/**
 * Headless capture for DSJ/BGW/VCEX scam landing pages.
 * Loads each target, records all network requests + responses, walks visible
 * navigation/CTAs to trigger lazy XHR, and dumps everything to per-target dirs.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGETS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'https://bg-wealth-sharing-six.vercel.app/',
      'https://bg-wealth-simulator.vercel.app/',
      'https://vcexpro.com/',
      'https://vcexin.com/',
    ];

const OUT = path.resolve(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

// Tron Base58Check validator
function b58decode(s) {
  const A = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let n = 0n;
  for (const c of s) { const i = A.indexOf(c); if (i < 0) return null; n = n*58n + BigInt(i); }
  let h = n.toString(16); if (h.length % 2) h = '0' + h;
  const buf = Buffer.from(h, 'hex'); return buf;
}
async function isValidTron(s) {
  if (typeof s !== 'string' || s.length !== 34 || !s.startsWith('T')) return false;
  const r = b58decode(s); if (!r || r.length !== 25 || r[0] !== 0x41) return false;
  const crypto = require('crypto');
  const chk = crypto.createHash('sha256').update(crypto.createHash('sha256').update(r.subarray(0,21)).digest()).digest().subarray(0,4);
  return chk.equals(r.subarray(21));
}

function slugify(u) {
  return u.replace(/^https?:\/\//,'').replace(/[\/?&=#:]/g,'_').replace(/_+$/,'') || 'root';
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const target of TARGETS) {
    const tag = slugify(target);
    const dir = path.join(OUT, tag);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n=== ${target} -> ${dir} ===`);

    const ctx = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      ignoreHTTPSErrors: true,
    });
    const page = await ctx.newPage();
    const events = [];
    const pushEv = (e) => { events.push({ ts: Date.now(), ...e }); };

    page.on('request', r => pushEv({ type:'req', url:r.url(), method:r.method(), resourceType:r.resourceType(), postData:r.postData() }));
    page.on('response', async r => {
      const e = { type:'resp', url:r.url(), status:r.status(), ct:r.headers()['content-type']||'' };
      if (/json|javascript|text|xml/i.test(e.ct) && r.status() < 400) {
        try {
          const buf = await r.body();
          if (buf.length < 200_000) e.body = buf.toString('utf8');
          else e.body_len = buf.length;
        } catch {}
      }
      pushEv(e);
    });
    page.on('console', msg => pushEv({ type:'console', level:msg.type(), text:msg.text() }));
    page.on('pageerror', err => pushEv({ type:'pageerror', err:String(err) }));

    try {
      await page.goto(target, { waitUntil:'networkidle', timeout:30000 });
    } catch (e) {
      pushEv({ type:'goto_error', err:String(e) });
    }

    // Snapshot the rendered DOM + screenshot
    try {
      const html = await page.content();
      fs.writeFileSync(path.join(dir, 'rendered.html'), html);
      await page.screenshot({ path: path.join(dir, 'page.png'), fullPage: true });
    } catch (e) { pushEv({ type:'snapshot_error', err:String(e) }); }

    // Walk: scroll to bottom, then click any obvious CTA / link
    try {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      // collect candidate clickables
      const clicks = await page.$$eval('a,button', els =>
        els.slice(0,80).map((e,i) => ({
          i, tag:e.tagName, text:(e.innerText||'').trim().slice(0,80), href:e.getAttribute('href')||null,
        })).filter(x => x.text || x.href)
      );
      fs.writeFileSync(path.join(dir, 'clickables.json'), JSON.stringify(clicks, null, 2));
      // click anything that smells like deposit / register / signup / start / wallet / 注册 / login
      const intent = /deposit|wallet|sign\s?up|sign\s?in|register|start|join|invest|开始|注册|登录|đăng/i;
      const hits = clicks.filter(c => intent.test(c.text) || (c.href && intent.test(c.href)));
      pushEv({ type:'note', candidates: hits });
      for (const c of hits.slice(0,4)) {
        try {
          const all = await page.$$('a,button');
          const el = all[c.i];
          if (!el) continue;
          await el.click({ timeout:5000, trial:false });
          await page.waitForTimeout(2500);
          // capture potential modal / new content
          const html2 = await page.content();
          fs.writeFileSync(path.join(dir, `after_click_${c.i}_${c.text.replace(/\W+/g,'_').slice(0,30)}.html`), html2);
        } catch (e) {
          pushEv({ type:'click_error', label:c.text, err:String(e) });
        }
      }
    } catch (e) { pushEv({ type:'walk_error', err:String(e) }); }

    fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify(events, null, 2));

    // Tally + scan for TRON addrs in any captured response body / DOM / events
    let tronAddrs = new Set();
    const scan = (s) => {
      const re = /\b(T[1-9A-HJ-NP-Za-km-z]{33})\b/g; let m;
      while ((m = re.exec(s||'')) !== null) tronAddrs.add(m[1]);
    };
    for (const e of events) if (e.body) scan(e.body);
    for (const f of fs.readdirSync(dir)) {
      if (/\.html$/.test(f)) scan(fs.readFileSync(path.join(dir,f),'utf8'));
    }
    const validated = [];
    for (const a of tronAddrs) if (await isValidTron(a)) validated.push(a);
    fs.writeFileSync(path.join(dir, 'tron_candidates.json'),
      JSON.stringify({ all: [...tronAddrs], validated }, null, 2));

    // Endpoint summary: hosts touched
    const hosts = {};
    for (const e of events) {
      if (e.type !== 'req' || !e.url) continue;
      try { const u = new URL(e.url); hosts[u.host] = (hosts[u.host]||0) + 1; } catch {}
    }
    const summary = {
      target, events: events.length,
      hosts: Object.entries(hosts).sort((a,b)=>b[1]-a[1]),
      validatedTron: validated,
      allTronCandidates: [...tronAddrs],
      apiCalls: events.filter(e => e.type==='req' && /\/api\/|api\.[^/]+\//.test(e.url)).map(e => `${e.method} ${e.url}`),
    };
    fs.writeFileSync(path.join(dir, 'SUMMARY.json'), JSON.stringify(summary, null, 2));
    console.log(`  events: ${events.length}, hosts: ${Object.keys(hosts).length}, validated TRON: ${validated.length}`);
    console.log(`  API calls: ${summary.apiCalls.length}`);
    if (validated.length) console.log(`  ${'>>'.repeat(20)} VALID TRON FOUND: ${validated.join(', ')}`);

    await ctx.close();
  }
  await browser.close();
  console.log('\nDONE.');
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
