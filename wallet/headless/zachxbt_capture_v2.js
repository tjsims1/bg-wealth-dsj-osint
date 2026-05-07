/**
 * v2: persistent profile so TJ can sign in once and the cookies survive.
 * Opens X login page, waits for sign-in (keep window open), then on
 * disconnect, the script ends. Re-run extract.js to pull thread once authed.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE = path.resolve(__dirname, 'chromium-profile-x');
fs.mkdirSync(PROFILE, { recursive: true });

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: false,
    viewport: { width: 1280, height: 1000 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();

  console.log('>>> Opening x.com — sign in here.');
  console.log('>>> Cookies will persist in: ' + PROFILE);
  console.log('>>> After signing in, just type "ready" in chat — DO NOT close the browser.');
  await page.goto('https://x.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Stay open until disconnect or SIGTERM
  await new Promise(resolve => {
    ctx.on('close', resolve);
    process.on('SIGINT', resolve);
    process.on('SIGTERM', resolve);
  });
  console.log('>>> Context closed.');
  await ctx.close().catch(()=>{});
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
