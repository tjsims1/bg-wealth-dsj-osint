/**
 * Driven controller. Launches headed Chromium, primes it with the test account's captured
 * session token, and walks the share / team / award API endpoints to resolve
 * the salesman behind ID 192445109373423616.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TOKEN = '[REDACTED_SESSION_TOKEN]';   // most recent token from events.jsonl
const HOME  = 'https://tra809.tw/h5/#/home';
const API   = 'https://api.ddjea.com';
const OUT   = path.resolve(__dirname, 'live_out');

const TEAM_ENDPOINTS = [
  '/api/app/share/team',
  '/api/app/share/my/award',
  '/api/app/user/share',
  '/api/app/rank/team',
  '/api/app/second/share/user/list',
  '/api/app/second/share/list',
  '/api/app/second/share/user/follow',
  '/api/app/user/credit/list',
  '/api/app/user/credit/getScore',
];

(async () => {
  const browser = await chromium.launch({ headless: false, args:['--disable-blink-features=AutomationControlled'] });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  const results = {};
  page.on('response', async r => {
    const u = r.url();
    if (u.includes('api.ddjea.com')) {
      const ct = r.headers()['content-type'] || '';
      if (/json|text/i.test(ct)) {
        try {
          const body = await r.text();
          results[u] = body;
        } catch {}
      }
    }
  });

  // 1. Land on the SPA so the cookies / Cloudflare clearance are in place
  console.log('1. Loading site to establish CF clearance + load app...');
  await page.goto(HOME, { waitUntil: 'networkidle', timeout: 30000 });

  // 2. Inject the saved auth token + plausible login flags into localStorage
  console.log('2. Injecting captured session token into localStorage...');
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('app-login-token', tok);
    localStorage.setItem('spToken', tok);
    localStorage.setItem('appLoginToken', tok);
    document.cookie = `app-login-token=${tok}; path=/; secure`;
  }, TOKEN);

  // 3. Reload so the SPA sees the auth state
  console.log('3. Reloading SPA with token set...');
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // 4. Try frontend hash routes commonly used by these clones
  const ROUTES = ['#/share', '#/team', '#/invite', '#/agent', '#/myteam', '#/spread', '#/myShare', '#/award', '#/share/team'];
  for (const r of ROUTES) {
    try {
      console.log(`4. Hitting route ${r}...`);
      await page.goto(`https://tra809.tw/h5/${r}`, { waitUntil: 'networkidle', timeout: 12000 });
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log(`   (${r} timed out)`);
    }
  }

  // 5. Programmatic fetch via page.evaluate — uses the browser's Cloudflare-cleared session
  console.log('5. Direct API calls with token...');
  const apiResults = await page.evaluate(async ({ token, base, eps }) => {
    const out = {};
    for (const ep of eps) {
      for (const method of ['POST', 'GET']) {
        try {
          const r = await fetch(base + ep, {
            method,
            headers: {
              'app-login-token': token,
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/plain, */*',
            },
            body: method === 'POST' ? '{}' : undefined,
            credentials: 'include',
          });
          const text = await r.text();
          if (r.status === 200 || r.status === 401 || r.status === 403) {
            out[`${method} ${ep}`] = { status: r.status, body: text.slice(0, 4000) };
            if (r.status === 200 && text.includes('resultCode":true')) break;
          }
        } catch (e) {
          out[`${method} ${ep}`] = { err: String(e).slice(0, 120) };
        }
      }
    }
    return out;
  }, { token: TOKEN, base: API, eps: TEAM_ENDPOINTS });

  fs.writeFileSync(path.join(OUT, 'team_dump.json'), JSON.stringify(apiResults, null, 2));
  fs.writeFileSync(path.join(OUT, 'team_results_passive.json'), JSON.stringify(results, null, 2));

  console.log('\n=== Direct fetch results ===');
  for (const [k, v] of Object.entries(apiResults)) {
    if (v.body) {
      const tag = v.body.includes('resultCode":true') ? 'OK' : (v.body.length > 0 ? 'data' : 'empty');
      console.log(`  ${k}: HTTP ${v.status} [${tag}] ${v.body.slice(0, 220).replace(/\s+/g,' ')}`);
    } else if (v.err) {
      console.log(`  ${k}: ERR ${v.err}`);
    }
  }

  console.log('\nDONE. Browser will stay open. Drive it to find any team/share UI you spot, then close.');
  await new Promise(resolve => browser.on('disconnected', resolve));
  await browser.close().catch(()=>{});
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
