/**
 * v2: drive the SPA to /share, AND hit the API via Playwright's request context
 * (which bypasses browser CORS).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TOKEN = '[REDACTED_SESSION_TOKEN]';
const HOME  = 'https://tra809.tw/h5/#/home';
const SHARE = 'https://tra809.tw/h5/#/share';
const API   = 'https://api.ddjea.com';
const OUT   = path.resolve(__dirname, 'live_out');

const TARGETS = [
  '/api/app/share/team',
  '/api/app/share/my/award',
  '/api/app/user/share',
  '/api/app/rank/team',
  '/api/app/second/share/user/list',
  '/api/app/second/share/list',
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

  const captured = {};
  page.on('response', async r => {
    const u = r.url();
    if (!u.includes('api.ddjea.com')) return;
    const ct = r.headers()['content-type'] || '';
    if (/json|text/i.test(ct)) {
      try { captured[u] = await r.text(); } catch {}
    }
  });

  console.log('1. Loading home...');
  await page.goto(HOME, { waitUntil: 'networkidle', timeout: 30000 });

  console.log('2. Setting token...');
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('app-login-token', tok);
    document.cookie = `app-login-token=${tok}; path=/; secure; SameSite=None`;
  }, TOKEN);

  console.log('3. Navigating to /share...');
  await page.goto(SHARE, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT, 'share_page.png'), fullPage: true });

  console.log('4. Trying SPA-loaded sub-routes...');
  for (const r of ['#/shareRules','#/credit','#/follow/records','#/about']) {
    try {
      await page.goto(`https://tra809.tw/h5/${r}`, { waitUntil: 'networkidle', timeout: 12000 });
      await page.waitForTimeout(1500);
    } catch (e) { /* timeouts ok */ }
  }

  console.log('5. Calling team APIs via Playwright request context (no CORS)...');
  const apiCtx = page.request;
  const directResults = {};
  for (const ep of TARGETS) {
    for (const m of ['POST','GET']) {
      try {
        const r = await apiCtx.fetch(API + ep, {
          method: m,
          headers: {
            'app-login-token': TOKEN,
            'Content-Type': 'application/json',
            'Origin': 'https://tra809.tw',
            'Referer': 'https://tra809.tw/',
            'Accept': 'application/json, text/plain, */*',
          },
          data: m === 'POST' ? '{}' : undefined,
        });
        const txt = await r.text();
        directResults[`${m} ${ep}`] = { status: r.status(), body: txt.slice(0, 5000) };
        if (r.status() === 200 && txt.includes('resultCode":true')) break;
      } catch (e) {
        directResults[`${m} ${ep}`] = { err: String(e).slice(0,140) };
      }
    }
  }

  fs.writeFileSync(path.join(OUT,'team_v2_direct.json'), JSON.stringify(directResults, null, 2));
  fs.writeFileSync(path.join(OUT,'team_v2_passive.json'), JSON.stringify(captured, null, 2));

  console.log('\n=== Direct ===');
  for (const [k,v] of Object.entries(directResults)) {
    if (v.body) console.log(`  ${k} HTTP ${v.status}: ${v.body.slice(0,300).replace(/\s+/g,' ')}`);
    else if (v.err) console.log(`  ${k}: ERR ${v.err}`);
  }
  console.log('\n=== Passive (browser-issued XHR while navigating) — keys ===');
  for (const k of Object.keys(captured)) console.log('  ' + k);

  console.log('\nDONE. Browser stays open. Close to exit.');
  await new Promise(resolve => browser.on('disconnected', resolve));
  await browser.close().catch(()=>{});
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
