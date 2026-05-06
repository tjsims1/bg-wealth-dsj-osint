/**
 * v3: streaming write + auto-navigate to /share routes once login is detected.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const HOME  = 'https://tra809.tw/h5/#/login';
const OUT   = path.resolve(__dirname, 'live_out');
const STREAM_PATH = path.join(OUT, 'team_v3.jsonl');
const STREAM = fs.createWriteStream(STREAM_PATH, { flags: 'a' });

const ROUTES_AFTER_LOGIN = ['#/share', '#/credit', '#/follow/records', '#/shareRules', '#/about'];

function note(o){ STREAM.write(JSON.stringify({ts: Date.now(), ...o}) + '\n'); }

(async () => {
  const browser = await chromium.launch({ headless: false, args:['--disable-blink-features=AutomationControlled'] });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  let loggedInToken = null;
  let driving = false;

  page.on('response', async r => {
    const u = r.url();
    if (!u.includes('api.ddjea.com')) return;
    const ct = r.headers()['content-type'] || '';
    if (!/json|text/i.test(ct)) return;
    let body = '';
    try { body = await r.text(); } catch {}
    note({ type: 'resp', url: u, status: r.status(), body });
    // Login detection
    if (u.includes('/api/app/user/login') && body.includes('resultCode":true')) {
      try {
        const j = JSON.parse(body);
        if (j.data && !loggedInToken) {
          loggedInToken = j.data;
          console.log(`>>> LOGIN DETECTED. token=${loggedInToken}`);
          // Schedule auto-drive
          if (!driving) {
            driving = true;
            setTimeout(() => driveRoutes(), 2000);
          }
        }
      } catch {}
    }
  });

  async function driveRoutes() {
    console.log('>>> Auto-navigating logged-in SPA through team routes...');
    for (const r of ROUTES_AFTER_LOGIN) {
      try {
        console.log(`    -> ${r}`);
        await page.goto(`https://tra809.tw/h5/${r}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(2500);
      } catch (e) {
        console.log(`    ${r}: ${String(e).slice(0,80)}`);
      }
    }
    console.log('>>> Auto-drive complete. Browser stays open. Close window to exit.');
    note({ type: 'AUTO_DRIVE_COMPLETE' });
  }

  console.log(`>>> Open browser to: ${HOME}`);
  console.log(`>>> Log in. After detection, the script will auto-navigate to /share, /credit, etc.`);
  console.log(`>>> Streaming captures to: ${STREAM_PATH}`);
  await page.goto(HOME, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(()=>{});

  await new Promise(resolve => browser.on('disconnected', resolve));
  STREAM.end();
  await browser.close().catch(()=>{});
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
