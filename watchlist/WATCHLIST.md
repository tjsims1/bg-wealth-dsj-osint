# Successor Watchlist — DSJ Exchange / BG Wealth Sharing / Swift Wave Capital

**Compiled:** 2026-05-05 (TJ + Ghost)
**Goal:** detect new domains, infrastructure shifts, and clone schemes spun up by the same operators after the BGW collapse and FBI seizure of `bgwealthsharing.com` (2026-04-23).

---

## 1. Operator Behaviour (what we're hunting for)

The same Burma-based "click-a-button" Ponzi crew rotates infrastructure on a 1–2 day cycle. Confirmed patterns:

| Signal | Why it matters |
| --- | --- |
| Numeric-suffix lookalike domains: `dsj{N}.com`, `dsjex{N}.com`, `bg{N}.com`, `yzzq{N}.cc`, `vcex{X}.com` | Burst-registered for rotation. |
| Registrar **Gname.com Pte. Ltd.** (Singapore) + nameservers `*.SHARE-DNS.COM/NET` | Heavily used by Chinese scam-front registrations. |
| Privacy-redacted WHOIS + Cloudflare front + Chinese CDN backend (`Server: Xcdn`) | Stack signature observed on VCEX live nodes. |
| Multiple domains created **same minute** | Indicates a registration batch — script-generated. |
| SPA front-end with empty body until JS execution | Cloned from same React/Next template; backend API is the real tell. |
| Promoter pivot: Faiana Brown / Lee Meadows / Chanse Carlson moving brands | If they appear endorsing a new brand, treat that brand as suspect-by-default. |
| Telegram channel link in YouTube description / IG bio | First-line victim-funnel; report immediately. |

---

## 2. Active Targets (as of 2026-05-05)

### 2.1 Direct successors (post-FBI seizure)

| Host | Status | Notes |
| --- | --- | --- |
| `bgwealthsharing.com` | HTTP 200 (DOJ seizure notice via Cloudflare) | Should remain seizure notice — flag if content changes. |
| `yzzq919.cc` | HTTP 403 (Cloudflare gate) | Registered 2026-04-25 (2 days post-seizure). |
| `yzzq657.cc` | HTTP 403 (Cloudflare gate) | Same registration date. |
| `bg-wealth-sharing-six.vercel.app` | HTTP 200 — Hindi recruitment landing | Vercel — abuse-report eligible. |
| `bg-wealth-simulator.vercel.app` | HTTP 200 — Vietnamese ROI simulator | Vercel — abuse-report eligible. |

### 2.2 Swift Wave Capital / VCEX (clone scheme)

Same MO, same promoter (Faiana Brown), New Zealand FMA-listed 2026-04-14.

| Host | Created | Status (2026-05-05) | Notes |
| --- | --- | --- | --- |
| `vcexbe.com` | 2025-12-11 | DNS dead | Gname.com + SHARE-DNS. |
| `vcexup.com` | 2025-12-11 | DNS dead | Same batch. |
| `vcexpro.com` | 2025-12-11 | **HTTP 200** — `Server: Xcdn` (Chinese CDN) | Live SPA shell, title "VCex". |
| `vcexin.com` | 2025-12-11 | **HTTP 200** — `Server: Xcdn` | Live, identical body to vcexpro. |

YouTube channel: `youtube.com/@VCEX-j5b`
Facebook group: `facebook.com/groups/25964393116546838`
Promoter video: `youtube.com/watch?v=rzJaGYdyL74`

### 2.3 Promoter accounts to watch

If any of these starts pushing a new branded "exchange" or "AI signals" platform, log the new brand into the watchlist:

- **Lee Meadows** — Instagram `@leequynhm`, ~23k followers
- **Faiana Brown** (aka Faithful / Gerald Faiana Brown) — Hawaii / UT / WA, currently visible in Swift Wave Capital
- **Chanse Carlson** — Utah
- **Latanya Jones-Kerr** — Georgia
- **Mark & Kim Brown** — Oklahoma
- **Thaddious Thomas** — Texas
- **Mau Hunt Kota** — Samoa

(Full list of ~70 alleged Zoom-promoters is in `../REPORT.md` §3.4.)

---

### 2.4 Lee Meadows next brand (under construction in source repo)

The `sonyho2715/lee-meadows-saas` repo's commit log explicitly shows the developer scrubbing references:

> `498fdfa Remove BG/DSJ/Lee Meadows references - rebrand to AI Trading`
> `56738b7 rebrand: change to Abundant Blessing AI with copy-paste messaging`
> `1e9a53c copy: rewrite landing page with Sabri Suby-style direct response`
> `a4c5d0c feat: transform landing page into Facebook ad funnel`
> `8b5fc74 feat: add database infrastructure for lead capture`

Package name in `package.json`: `tradepulse-ai`. Folder name: `lee-meadows-saas`.
Tech stack: Next.js 16 + Supabase + Tailwind + Sentry. Vietnamese localization in commits.
**The repo was authored using Claude Code** (`.claude/` dir + `CLAUDE.md` present) — noteworthy as a sign that AI dev tooling is being used to build scam funnels.

Probed candidate domains (2026-05-05):

| Host | Status | Note |
| --- | --- | --- |
| `tradepulse.ai` | HTTP 200 — **Spaceship.com domain-for-sale page** | **Watch for transfer / DNS change → Lee Meadows acquired this brand domain.** |
| `tradepulseai.com` | HTTP 405 (AWS-fronted) | Currently in use by something — verify ownership before assuming connection. |
| `abundantblessingai.com` | DNS resolves (66.33.22.136), TLS hostname mismatch | Looks parked / mid-setup. |
| `abundantblessing.com` | DNS resolves (Vultr 207.148.248.143), connection refused | Possibly registered in advance. |
| `abundantblessing.ai` | NXDOMAIN | Not yet registered. |

`TheAugDev/BG`'s `CNAME` file also confirms it served `copytradingsignals.org` (the offline affiliate signal portal).

---

## 3. Search Queries (rerun manually or via cron)

### crt.sh patterns (also encoded in `watchlist.yaml`)
- `%dsjex%`, `%dsj-exchange%`
- `%bgwealth%`, `%bg-wealth%`
- `%yzzq%`
- `%vcex%`, `%swiftwave%`, `%swift-wave%`

### Google / DuckDuckGo dorks
- `"BG Wealth Sharing" -behindmlm -dehek -site:fca.org.uk` — surface new shilling
- `"DSJ Exchange" "review"` after 2026-05-01 — find new affiliate funnel sites
- `"Swift Wave Capital" OR "VCEX" -dehek` — promoter outreach
- `"Professor Stephen Beard"` — fictional persona may be reused
- `"Joseph Smith" "DSJ" OR "BGW"` — claimed COO persona
- `"trading signals" "1.3% daily"` OR `"three signals" "1%"` — copy-paste pitch language
- `site:vercel.app "BG Wealth"` and `site:vercel.app "VCEX"` — host of choice for Hindi/Vietnamese landing pages
- `site:t.me "BG Wealth Sharing"` — Telegram recruitment channels

### Social pivots
- YouTube: search uploaders within last 30 days for `"BG Wealth Sharing"`, `"DSJ Exchange"`, `"Swift Wave Capital"`, `"VCEX"`
- TikTok: same terms; many recruiters cross-post
- Instagram: monitor `@leequynhm` reels/stories for new brand mentions
- LinkedIn: any account adding "BG Wealth" / "DSJ" / "VCEX" employer history

---

### 3.1 Known-noisy targets (ignore in diff)

- `bggracefulwealth.com` — Hostinger parking; A records rotate every run. Treat status changes (HTTP 200 → 200) as noise.
- `dsjex.net` / `vcexbe.com` / `vcexup.com` — these resolve to `2001:db8:1000::fa` + `203.0.113.250`, which are RFC 5737 / RFC 3849 reserved (TEST-NET-3 + documentation prefix). Looks like an upstream resolver (Hostinger or registrar) is returning a reserved-range sinkhole on dead lookups. Not real infra.

---

## 4. Operating the monitor

```bash
cd osint/dsj-exchange/watchlist
python3 monitor.py            # one-shot scan; appends a JSONL row to runs.jsonl
python3 monitor.py --diff     # print what changed since last run
```

The script:
- Resolves DNS for every host in `watchlist.yaml`
- Fires HTTP HEAD; logs status code + Server header
- Hits crt.sh for each pattern; caches the unique name list
- Appends one JSON line to `runs.jsonl` per run

Suggested cadence: daily via launchd / cron. Sample crontab line (runs 09:00 local):

```cron
0 9 * * * cd osint/dsj-exchange/watchlist && /usr/bin/python3 monitor.py --diff >> daily.log 2>&1
```

If you'd rather have it as a launchd plist or hooked into your existing cron tooling, ping me — I'll write the wrapper.

---

## 5. Wayback / archive checklist (manual, browser)

Wayback's Save Page Now blocks unauth curl requests. Trigger these from a browser session:

- `https://web.archive.org/save/https://bg-wealth-sharing-six.vercel.app/`
- `https://web.archive.org/save/https://bg-wealth-simulator.vercel.app/`
- `https://web.archive.org/save/https://vcexpro.com/`
- `https://web.archive.org/save/https://vcexin.com/`
- `https://web.archive.org/save/https://github.com/Navyakushwaha/DSJ-Exchange`
- `https://web.archive.org/save/https://github.com/sonyho2715/lee-meadows-saas`

Existing snapshots:
- `bgwealthsharing.com` — Wayback has 2026-05-04 snapshot showing DOJ seizure notice.

---

## 6. Escalation / reporting endpoints (if any new host pops)

| Channel | Where |
| --- | --- |
| FBI IC3 | `https://www.ic3.gov` (case-link to BGW/DSJ when filing) |
| Vercel abuse | `abuse@vercel.com` |
| GitHub abuse | `https://github.com/contact/report-content` |
| Telegram abuse | `abuse@telegram.org` |
| Gname.com abuse | `abuse@gname.com` (likely null-routed but worth filing for the paper trail) |
| Cloudflare abuse | `https://www.cloudflare.com/abuse/form` |
| FCA scam-warning request | `reportscam@fca.org.uk` (UK-facing victims) |
| FMA NZ alerts | `https://www.fma.govt.nz/` |
