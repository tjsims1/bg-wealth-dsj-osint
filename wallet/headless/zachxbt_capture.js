/**
 * Open the ZachXBT DSJ thread in headed Chromium, scroll through, capture
 * full text + screenshots + extract any wallet addresses found.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'https://x.com/zachxbt/status/2051645845993648517';
const OUT = path.resolve(__dirname, 'zachxbt_capture');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--disable-blink-features=AutomationControlled'] });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await ctx.newPage();

  console.log('1. Loading X post...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Try to dismiss the login overlay if present (X shows a sign-in modal but the underlying content is still readable)
  try {
    const closeBtn = await page.$('[aria-label="Close"]');
    if (closeBtn) { await closeBtn.click(); console.log('   dismissed login modal'); }
  } catch {}
  await page.waitForTimeout(2000);

  // Capture initial render
  await page.screenshot({ path: path.join(OUT, '01_initial.png'), fullPage: true });
  console.log('2. Initial screenshot saved.');

  // Scroll through to load thread replies (each scroll waits for content)
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(OUT, '02_scrolled.png'), fullPage: true });
  console.log('3. Scrolled through thread, screenshot saved.');

  // Extract all visible text + addresses
  const result = await page.evaluate(() => {
    const out = {
      title: document.title,
      url: location.href,
      text: document.body.innerText,
      tweetTexts: [],
      links: [],
    };
    // Tweet text containers (X uses data-testid="tweetText")
    document.querySelectorAll('[data-testid="tweetText"]').forEach(el => {
      const t = el.innerText.trim();
      if (t && !out.tweetTexts.includes(t)) out.tweetTexts.push(t);
    });
    // External links (often where addresses or arkham/etherscan links land)
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      if (h && !h.includes('x.com') && !h.includes('twitter.com') && !out.links.includes(h)) {
        out.links.push(h);
      }
    });
    return out;
  });

  fs.writeFileSync(path.join(OUT, 'extracted.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(OUT, 'fulltext.txt'), result.text);

  // Address extraction
  const tronAddrs = new Set(); const ethAddrs = new Set(); const btcAddrs = new Set();
  const tronRe = /\b(T[1-9A-HJ-NP-Za-km-z]{33})\b/g;
  const ethRe = /\b(0x[a-fA-F0-9]{40})\b/g;
  const btcRe = /\b(bc1[a-z0-9]{20,80}|[13][a-km-zA-HJ-NP-Z1-9]{25,33})\b/g;
  let m;
  while ((m = tronRe.exec(result.text))) tronAddrs.add(m[1]);
  while ((m = ethRe.exec(result.text))) ethAddrs.add(m[1]);
  while ((m = btcRe.exec(result.text))) btcAddrs.add(m[1]);
  for (const t of result.tweetTexts) {
    while ((m = tronRe.exec(t))) tronAddrs.add(m[1]);
    while ((m = ethRe.exec(t))) ethAddrs.add(m[1]);
    while ((m = btcRe.exec(t))) btcAddrs.add(m[1]);
  }

  console.log(`\n=== Extraction summary ===`);
  console.log(`  tweet text blocks: ${result.tweetTexts.length}`);
  console.log(`  external links:   ${result.links.length}`);
  console.log(`  TRON addresses:   ${tronAddrs.size}`);
  for (const a of tronAddrs) console.log(`    ${a}`);
  console.log(`  ETH addresses:    ${ethAddrs.size}`);
  for (const a of ethAddrs) console.log(`    ${a}`);
  console.log(`  BTC candidates:   ${btcAddrs.size}`);
  for (const a of btcAddrs) console.log(`    ${a}`);
  console.log(`\nFull artifacts: ${OUT}`);
  console.log(`\nBrowser stays open. Drive it manually if needed; close window to exit.`);

  await new Promise(resolve => browser.on('disconnected', resolve));
  await browser.close().catch(()=>{});
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
