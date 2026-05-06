/**
 * Headed live capture: TJ drives the browser, this script logs every network
 * request/response to a JSONL file in real time. Stays alive until you close
 * the window (or send SIGTERM). Survives navigations.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const START_URL = process.argv[2] || 'https://tra809.tw/h5/#/home';
const OUT = path.resolve(__dirname, 'live_out');
fs.mkdirSync(OUT, { recursive: true });
const LOG = path.join(OUT, 'events.jsonl');
const STREAM = fs.createWriteStream(LOG, { flags: 'a' });

function note(obj) {
  STREAM.write(JSON.stringify({ ts: Date.now(), ...obj }) + '\n');
}

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();

  page.on('request', r => note({
    type: 'req',
    url: r.url(),
    method: r.method(),
    resourceType: r.resourceType(),
    headers: r.headers(),
    postData: r.postData(),
  }));

  page.on('response', async r => {
    const e = {
      type: 'resp',
      url: r.url(),
      status: r.status(),
      headers: r.headers(),
    };
    const ct = r.headers()['content-type'] || '';
    // Capture text bodies inline, skip large binaries
    if (/json|text|javascript|xml|application\/x-www-form-urlencoded|application\/octet-stream/i.test(ct)) {
      try {
        const buf = await r.body();
        if (buf.length < 500_000) e.body = buf.toString('utf8');
        else e.body_size = buf.length;
      } catch (err) { e.body_err = String(err).slice(0, 120); }
    }
    note(e);
  });

  page.on('framenavigated', f => note({ type: 'nav', url: f.url() }));
  page.on('console', m => note({ type: 'console', level: m.type(), text: m.text().slice(0, 500) }));

  console.log(`>>> Navigating to: ${START_URL}`);
  console.log(`>>> Logging events to: ${LOG}`);
  console.log('>>> Drive the browser. Close the window to stop.');

  await page.goto(START_URL, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => note({ type: 'goto_err', err: String(e) }));

  // Stay open until the user closes the browser
  await new Promise((resolve) => {
    browser.on('disconnected', resolve);
    process.on('SIGINT', resolve);
    process.on('SIGTERM', resolve);
  });

  STREAM.end();
  console.log('>>> Browser closed. Capture saved.');
  await browser.close().catch(() => {});
  process.exit(0);
})();
