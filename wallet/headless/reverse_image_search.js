/**
 * Drive Yandex + TinEye reverse-image search programmatically and dump
 * what the rendered page actually shows. Saves screenshots + JSON of hits.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_IMG = process.argv[2] || 'https://raw.githubusercontent.com/[REDACTED_USER]/bg-wealth-dsj-osint/main/evidence/persons/stephen-beard-face-for-reverse-image-search.jpg';
const OUT = path.resolve(__dirname, 'reverse_search_out');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 1000 },
    locale: 'en-US',
  });
  const page = await ctx.newPage();

  // ---- YANDEX ----
  console.log('\n=== YANDEX ===');
  const yUrl = `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(TARGET_IMG)}`;
  try {
    await page.goto(yUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT, 'yandex.png'), fullPage: false });
    const yDump = await page.evaluate(() => {
      const out = { title: document.title, captcha: false, hits: [], summary: '' };
      if (document.body.innerText.match(/captcha|robot|are you human/i)) out.captcha = true;
      // Yandex-specific: look for similar/match cards
      document.querySelectorAll('a[href*="img_href"], a.SerpItem-Link, a.CbirItem-Thumb, a.OtherSizes-Item').forEach(a => {
        out.hits.push({ href: a.href, text: (a.title || a.innerText || '').trim().slice(0, 200) });
      });
      // Generic: grab any external-image hit URL with a title
      document.querySelectorAll('a').forEach(a => {
        const h = a.href || '';
        if ((h.includes('img_url=') || h.includes('img_href=')) && a.innerText && out.hits.length < 30) {
          out.hits.push({ href: h, text: a.innerText.trim().slice(0, 200) });
        }
      });
      // Dedup
      const seen = new Set();
      out.hits = out.hits.filter(h => { if (seen.has(h.href)) return false; seen.add(h.href); return true; });
      // Summary text up top
      const sm = document.querySelector('.CbirSimilar, .CbirSites, .CbirNavigation') || document.body;
      out.summary = (sm.innerText || '').slice(0, 800);
      return out;
    });
    fs.writeFileSync(path.join(OUT, 'yandex.json'), JSON.stringify(yDump, null, 2));
    console.log(`  title: ${yDump.title}`);
    console.log(`  captcha: ${yDump.captcha}`);
    console.log(`  hits: ${yDump.hits.length}`);
    console.log(`  summary first 300: ${yDump.summary.slice(0, 300).replace(/\s+/g,' ')}`);
    yDump.hits.slice(0, 10).forEach((h, i) => console.log(`    [${i}] ${h.text} -> ${h.href.slice(0, 120)}`));
  } catch (e) {
    console.log('  YANDEX err:', String(e).slice(0, 200));
  }

  // ---- TINEYE ----
  console.log('\n=== TINEYE ===');
  const tUrl = `https://tineye.com/search?url=${encodeURIComponent(TARGET_IMG)}&sort=score&order=desc`;
  try {
    await page.goto(tUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: path.join(OUT, 'tineye.png'), fullPage: false });
    const tDump = await page.evaluate(() => {
      const out = { title: document.title, hits: [], summary: '' };
      document.querySelectorAll('a, .match-row a').forEach(a => {
        const h = a.href || '';
        if (h && (h.includes('http') && !h.includes('tineye.com'))) {
          out.hits.push({ href: h, text: (a.title || a.innerText || '').trim().slice(0, 200) });
        }
      });
      const seen = new Set();
      out.hits = out.hits.filter(h => { if (seen.has(h.href)) return false; seen.add(h.href); return true; }).slice(0, 30);
      out.summary = (document.body.innerText || '').slice(0, 1200);
      return out;
    });
    fs.writeFileSync(path.join(OUT, 'tineye.json'), JSON.stringify(tDump, null, 2));
    console.log(`  title: ${tDump.title}`);
    console.log(`  summary first 400: ${tDump.summary.slice(0, 400).replace(/\s+/g,' ')}`);
    console.log(`  hits: ${tDump.hits.length}`);
    tDump.hits.slice(0, 15).forEach((h, i) => console.log(`    [${i}] ${h.text.slice(0,80)} -> ${h.href.slice(0, 140)}`));
  } catch (e) {
    console.log('  TINEYE err:', String(e).slice(0, 200));
  }

  // ---- GOOGLE LENS ----
  console.log('\n=== GOOGLE LENS ===');
  const gUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(TARGET_IMG)}`;
  try {
    await page.goto(gUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT, 'google_lens.png'), fullPage: false });
    const gDump = await page.evaluate(() => {
      const out = { title: document.title, finalUrl: location.href, hits: [], summary: '' };
      document.querySelectorAll('a').forEach(a => {
        const h = a.href || '';
        const tx = (a.innerText || '').trim();
        if (h && tx && !h.includes('google.com/search') && !h.includes('lens.google') && !h.startsWith('javascript')) {
          out.hits.push({ href: h, text: tx.slice(0, 200) });
        }
      });
      const seen = new Set();
      out.hits = out.hits.filter(h => { if (seen.has(h.href)) return false; seen.add(h.href); return true; }).slice(0, 30);
      out.summary = (document.body.innerText || '').slice(0, 1200);
      return out;
    });
    fs.writeFileSync(path.join(OUT, 'google_lens.json'), JSON.stringify(gDump, null, 2));
    console.log(`  title: ${gDump.title}`);
    console.log(`  finalUrl: ${gDump.finalUrl.slice(0, 200)}`);
    console.log(`  summary first 500: ${gDump.summary.slice(0, 500).replace(/\s+/g,' ')}`);
    console.log(`  hits: ${gDump.hits.length}`);
    gDump.hits.slice(0, 15).forEach((h, i) => console.log(`    [${i}] ${h.text.slice(0,80)} -> ${h.href.slice(0, 140)}`));
  } catch (e) {
    console.log('  GOOGLE err:', String(e).slice(0, 200));
  }

  await browser.close();
  console.log('\nDONE. Outputs in:', OUT);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
