/**
 * v3: launch real Chrome (channel: 'chrome') with the test account's actual profile
 * (~/Library/Application Support/Google/Chrome). His X session is logged
 * in there, X sees a real browser fingerprint + real cookies, no detection.
 *
 * Navigates to the ZachXBT thread, auto-scrolls, extracts everything.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

const URL = 'https://x.com/zachxbt/status/2051645845993648517';
const PROFILE = path.join(os.homedir(), 'Library/Application Support/Google/Chrome');
const OUT = path.resolve(__dirname, 'zachxbt_capture_v3');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 1000 },
  });
  const page = ctx.pages()[0] || await ctx.newPage();

  console.log('1. Loading X post (using your real Chrome session)...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Initial screenshot
  await page.screenshot({ path: path.join(OUT, '01_top.png'), fullPage: false });

  // Scroll incrementally — wait for new content to load each time
  console.log('2. Scrolling through thread...');
  let prevTextLen = 0;
  for (let i = 0; i < 60; i++) {
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(1500);

    const len = await page.evaluate(() => document.body.innerText.length);
    if (i % 10 === 9) console.log(`   scroll ${i+1}: text=${len} chars`);

    // If text length stops growing, we've hit the bottom
    if (i > 5 && len === prevTextLen) {
      console.log(`   plateau at scroll ${i+1}, stopping`);
      break;
    }
    prevTextLen = len;
  }
  await page.screenshot({ path: path.join(OUT, '02_bottom.png'), fullPage: true });

  // Extract everything
  const result = await page.evaluate(() => {
    const out = {
      title: document.title,
      url: location.href,
      tweetTexts: [],
      links: [],
      fullText: document.body.innerText,
    };
    document.querySelectorAll('[data-testid="tweetText"]').forEach(el => {
      const t = el.innerText.trim();
      if (t) out.tweetTexts.push(t);
    });
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      if (h && !h.startsWith('javascript:') && !out.links.includes(h)) {
        out.links.push(h);
      }
    });
    return out;
  });

  fs.writeFileSync(path.join(OUT, 'extracted.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(OUT, 'fulltext.txt'), result.fullText);
  fs.writeFileSync(path.join(OUT, 'tweets.txt'), result.tweetTexts.map((t,i)=>`--- tweet ${i+1} ---\n${t}`).join('\n\n'));

  // Address extraction
  const trons = new Set(); const eths = new Set(); const btcs = new Set();
  const tronRe = /\b(T[1-9A-HJ-NP-Za-km-z]{33})\b/g;
  const ethRe = /\b(0x[a-fA-F0-9]{40})\b/g;
  const btcRe = /\b(bc1[a-z0-9]{25,80}|[13][a-km-zA-HJ-NP-Z1-9]{25,33})\b/g;
  const allText = result.fullText + '\n' + result.tweetTexts.join('\n');
  for (const re of [[tronRe, trons], [ethRe, eths], [btcRe, btcs]]) {
    let m; while ((m = re[0].exec(allText))) re[1].add(m[1]);
  }

  console.log(`\n=== Extraction summary ===`);
  console.log(`  page text:     ${result.fullText.length} chars`);
  console.log(`  tweet blocks:  ${result.tweetTexts.length}`);
  console.log(`  links:         ${result.links.length}`);
  console.log(`  TRON:          ${trons.size}`);
  for (const a of [...trons].sort()) console.log(`    ${a}`);
  console.log(`  ETH:           ${eths.size}`);
  for (const a of [...eths].sort()) console.log(`    ${a}`);
  console.log(`  BTC candidates: ${btcs.size}`);
  for (const a of [...btcs].sort()) console.log(`    ${a}`);

  console.log(`\nArtifacts in: ${OUT}`);
  console.log(`Browser will stay open. Close to exit.`);
  await new Promise(resolve => ctx.on('close', resolve));
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
