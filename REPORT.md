# OSINT Report: DSJ Exchange / BG Wealth Sharing

**Investigator:** Vault Data Servers
**Date compiled:** 2026-05-05 (Tue, MST)
**Status of operation:** Collapsed late April 2026; FBI domain seizure 2026-04-23; criminal charges filed 2026-04-23 (D.C.); **DSJ-branded successor infrastructure confirmed live and operational** as of this report (auth-walled live capture from the test account on `tra809.tw` / `api.ddjea.com`).
**Confidence:** Findings backed by multiple regulator notices, FBI/DOJ press, and independent OSINT (Danny de Hek / dehek.com, BehindMLM, IFW Global). **Live-session capture (§9) provides first-hand on-chain + backend evidence.** Treat unconfirmed personas (Stephen Beard, Joseph Smith) as fictional or AI-generated unless proven otherwise.

---

## 1. Executive Summary

**DSJ Exchange (DSJEX) / BG Wealth Sharing** was a "click-a-button" cryptocurrency Ponzi operated out of a scam compound in **Min Let Pan, Burma**, from at least **January 2025 until December 2025**, with US-facing recruitment continuing until the platform's collapse in **late April 2026**. Victims deposited USDT (TRC-20) into a controlled exchange UI, were fed scripted "trading signals" exclusively via BonChat (other channels — Telegram, WhatsApp — were used for *recruitment* only), and saw fake P&L until withdrawals locked. Total estimated illicit volume: **~$150M**, with **~$41.5M frozen** by combined US/international action.

Two Chinese nationals — **Jiang Wen Jie** (aka Jiang Nan) and **Huang Xingshan** (aka Ah Zhe) — were charged in the District of Columbia on **2026-04-23** as part of DOJ's Scam Center Strike Force. Both fled Burma to Thailand in November 2025 and were arrested by Thai authorities on immigration fraud; US extradition is undecided. **The two named defendants are almost certainly a small subset of the operating team.** Min Let Pan-style scam compounds typically house 50–200 workers (signal scripters, BonChat handlers, MLM recruiters, IT staff). BonChat activity has remained continuously live post-indictment — see §9 — confirming the operational team is largely intact and that further indictments are likely as the DOJ Strike Force unwinds the cell.

The platform branding personas — "**Professor Stephen Beard**" (claimed founder, gives daily "signals") and "**Joseph Smith**" (claimed COO) — are not who they claim to be. **The strongest working hypothesis on Stephen Beard is that he is a "白工" / "white-monkey job" hire** — a Western foreigner paid by a Chinese promoter to appear in legitimacy-theater promotional material with little to no knowledge of the underlying scheme. This is a well-documented Chinese marketing practice; it fits the pattern of *real video appearances* + *zero verifiable biographical trail outside the promotional materials*. AI synthesis remains possible but is less likely given the consistency of the on-screen identity. **If correct, "Stephen Beard" is a witness, not a target** — but the photographer / videographer / agency that paid him is a key lead. The actual technical operation relied on freelance/commissioned developers in India and possibly elsewhere, with the source code briefly exposed on public GitHub.

The scheme is **operationally dead** but **not contained**: surviving accomplices are running successor "click a button" clones (Swift Wave Capital, others), at least two recruitment landing pages remain live on Vercel as of report time, and BonChat trading-signal channels continue to deliver scripted entries to retained victims.

---

## 2. Identifiers and Indicators

### 2.1 Domain Indicators

| Domain | Role | Status (2026-05-05) | Notes |
| --- | --- | --- | --- |
| `bgwealthsharing.com` | Original BGW site | **Seized by FBI** (2026-04-23) | Per warrant from US District Court, D.C. Returns DOJ seizure notice. |
| `dsjex.net` | Primary "DSJ Exchange" UI | Down / FCA-listed | Cited in FCA UK warning (May 2025). |
| `dsj89.com`, `dsjex123.com` | Rotation lookalikes | Down | Domains rotated every 1–2 days under takedown pressure. |
| `bg877.com`, `bg661.com` | Rotation lookalikes | Down | Naming pattern: `bg<3-digit>.com`. |
| `yzzq919.cc`, `yzzq657.cc` | **Active successor (post-collapse)** | Live (HTTP 403 / Cloudflare-fronted) | Privately registered 2026-04-25 (2 days post-seizure). |
| `bg-wealth-sharing-six.vercel.app` | Hindi recruitment landing | **Live (HTTP 200)** | Title: "BG Wealth \| Official Information Portal". Vercel-hosted. |
| `bg-wealth-simulator.vercel.app` | Vietnamese ROI simulator | **Live (HTTP 200)** | Title: "BG Wealth Sharing \| Investment Simulator". Vercel-hosted. |
| `copytradingsignals.org` | Affiliate signal portal | Offline (post-abuse-report) | |
| `bggracefulwealth.com` | Promoter funnel | Parked (Hostinger, NS1.DNS-PARKING.COM) | Created 2025-07-01. |
| `bgwealthalert.com` | **Awareness/aggregator (not the scam)** | Live | Created 2026-04-04. Public scam-warning site, not BGW infra. |
| `tra809.tw` | **Active DSJ frontend (live)** | Live (HTTP 200, Cloudflare-fronted) | Discovered 2026-05-05 from a victim referral. Vue/Vant H5 SPA. |
| `api.ddjea.com` | **DSJ centralized API host** | Live (Cloudflare-fronted) | All real backend traffic — login, wallet, recharge, share/team. **Plain JSON over HTTPS, `app-login-token` header**. NOT encrypted (different stack from VCEX/Struts2). |
| `dsj626.icu` | DSJ web invite-funnel domain | Live (per share URL) | Surfaced in the test account's invite link `dsj626.icu/pc/#/home<code>`. |
| `dsj627.icu` | DSJ mobile-app distribution | Live | Hosts iOS `mobileconfig` profile + Android `apk` per `/api/app/config`. **Mobile-config install = MDM-style trust grant — significant threat vector if installed.** |
| `dsiscos.com` | DSJ image / asset CDN | Live | Slide banners + announcement art served from here. |
| `dsj24.oss-ap-southeast-1.aliyuncs.com` | Alibaba Cloud Singapore S3 bucket | Live | DSJ branding/logo store. |

**Domain rotation pattern:** numeric suffix lookalikes (`dsj{N}.com`, `dsjex{N}.com`, `dsj{N}.icu`, `bg{N}.com`, `yzzq{N}.cc`, `tra{N}.tw`) registered in fast bursts. Any new domain matching these patterns + privacy-shielded WHOIS + Cloudflare in front + Chinese hosting backend should be treated as suspect.

**Centralized backend hint:** `api.ddjea.com` services *multiple* DSJ frontends (the test session pinged `api.tra809.tw` once but all real traffic flowed to `api.ddjea.com`). One backend, many disposable storefronts.

### 2.2 Cryptocurrency Indicators

**Network / asset:** Tether USDT on TRON (TRC-20) primary. Also accepts USDT on Ethereum (ERC-20), USDC, BTC, ETH per `/api/app/recharge/payment`. Lee Meadows successor advertises a **$300 USDT** minimum; live DSJ instance shows **$1 USDT minimum** for TRC-20 deposits, **$35 USDT minimum** withdrawal fee (designed to lock small balances).

**Live-captured deposit addresses (the test account, 2026-05-05):**

| Chain | Address | Validation |
| --- | --- | --- |
| TRON (TRC-20 USDT) | `[REDACTED_VICTIM_DEPOSIT_TRC20]` | Base58Check valid (0x41 prefix, checksum OK) |
| Ethereum (ERC-20 USDT) | `[REDACTED_VICTIM_DEPOSIT_ERC20]` | 40-hex EVM address |

**Per-user HD-derivation confirmed.** Each victim is shown a unique TRC-20 address. Auto-sweep to a centralized hot wallet within minutes of any deposit. Rotation cadence ≈ 4 days per hot wallet.

**Live-traced operator hot wallet (March 2026 rotation):**

| Address | Volume (USDT) | Window | Source-addr count |
| --- | --- | --- | --- |
| `TYwaXc4ofNK2mL4NHaz9y58WiNAhguqWLu` | **$30,895,315.50 outbound** in 4 days | 2026-03-19 → 03-23 | **9,567 unique deposit-addresses** in a single 27-hour window |

**Top 5 next-hop wallets (≥$23.16M / 75% of outflow):**

1. `TFTYF7k41xnHqjCGYb26BDvMy4Yhfp4Tx6` — $5.51M, 136 txs
2. `TUw7Lp1xWSWyHaA1n3D8QqDzbBphSct1Wi` — $4.63M, 122 txs
3. `TCQe3aiYbHbLKWhPTe9NC1MQRfwMebJ1jW` — $4.60M, 118 txs
4. `TCqZRkSviRWRpCh3e9rvhcBEoEnaeqy1no` — $4.42M, 122 txs
5. `TSUPWoF2bdBs5juQbqv7s9duXpa7VLFrPC` — $3.99M, 105 txs

These are **operator-controlled intermediates** (Tronscan tags scrape returned no consumer-exchange labels). Hop-2 trace from the top recipient (`TFTYF7k…`) shows fan-out to 5,734 unique addresses — that's the Ponzi-payout / MLM-commission layer. Real CEX off-ramping lives 1–2 hops further down. **These five are the immediate freeze candidates** for any IC3 / FinCEN filing.

**Deposit→sweep proof (the 2026-03-20 test, $1,000 USDT):**

```
22:10:18 UTC  [REDACTED_VICTIM_SOURCE_WALLET]  ─→  [REDACTED_VICTIM_DEPOSIT_TRC20]
                                          1,000 USDT  txid 59430d6a…26ccf2d3a
22:24:09 UTC  [REDACTED_VICTIM_DEPOSIT_TRC20]  ─→  TYwaXc4ofNK2mL4NHaz9y58WiNAhguqWLu
                                          1,000 USDT  txid a62a7822…32074799a
                                          (auto-sweep, +13m51s)
```

This is direct, on-chain proof of the consolidation architecture. Full forensics: `wallet/WALLET_FORENSICS.md`.

### 2.3 Source-Code Repositories (evidence)

| Repo | Role | Status |
| --- | --- | --- |
| `github.com/Navyakushwaha/DSJ-Exchange` | DSJ Exchange website frontend | Public (last seen) |
| `github.com/XiaolanLin808/BG-Wealth_SCript` | BGW automation backend | **Deleted** (evidence preserved by investigators) |
| `github.com/sonyho2715/lee-meadows-saas` | Lee Meadows SaaS (recruiter funnel) | Public (last seen) |
| `github.com/TheAugDev/BG` | Affiliate portal | Reported to GitHub abuse |

Forensic value: backend repo before deletion contained referral-code logic, deposit-address routing, and "signal code" handling — these establish the trade-execution UI was a deterministic UI, not a live exchange.

### 2.4 Communication Channels

- Public funnel: YouTube, Facebook, Instagram, LinkedIn → invite to **Zoom hype meetings**.
- **Recruitment** (broadcast / outreach): Telegram, WhatsApp, social DMs.
- **Operational signal-code delivery (live-confirmed): BonChat ONLY.** The "trading signal codes" that victims paste into the rigged UI are sent exclusively via BonChat. Operators specifically push victims into BonChat — and out of mainstream channels — once they're past the initial recruitment funnel. This deliberate channel split (open recruitment → closed signals) is itself a high-confidence operator-attribution signal, and it explains why subpoenas of Telegram/WhatsApp turn up recruitment chatter but rarely the rigged-trading evidence.
- Confirmed Telegram recruitment channel (reported for abuse): `t.me/+fyRGxnhsEKkwYzg5`.
- **BonChat is confirmed as the recruitment vector for this specific case.** the test account was opened by a third party who received the registration link via BonChat. BonChat use is itself an indicator on the WA DFI alert and BehindMLM reporting — operators specifically push victims into it because it resists subpoena.
- **Mobile-app distribution:** `dsj627.icu/dsj625.mobileconfig` (iOS) and `dsj627.icu/dsj625.apk` (Android) — installing the iOS profile grants MDM-style trust and is a major escalation vector beyond simple investment loss.

---

## 3. Persons of Interest

### 3.1 Charged (DOJ, D.C., 2026-04-23)

- **Jiang Wen Jie** (aka **Jiang Nan**) — Chinese national, operated Burma compound Min Let Pan, fled to Thailand Nov 2025, arrested by Thai authorities (immigration fraud).
- **Huang Xingshan** (aka **Ah Zhe**) — Chinese national, same compound, same flight pattern, same Thai detention.

**Likely additional operators (not yet charged).** Burma scam compounds typically employ 50–200 workers per cell, segmented across roles: signal-script writers, BonChat handlers (the "Stephen Beard" voice on chat is plausibly a rotating team, not one person), MLM recruiters, IT/devs, finance/laundering. The persistence of BonChat-delivered signal codes after the 2026-04-23 indictment confirms an active operating team beyond the two named defendants. Investigative priorities for additional attribution:
- BonChat handle operators sending signal codes — capture timestamps + handles per session
- Operators of `api.ddjea.com` / Cloudflare account that fronts it
- Whoever holds the private keys to the operator hot wallet `TYwaXc4ofNK2mL4NHaz9y58WiNAhguqWLu` and the top-5 next-hop wallets in §2.2

### 3.2 Front-End Personas (paid actors and/or fabricated)

- **"Professor Stephen Beard"** — claimed BGW founder, gives daily "trading signals" (delivered exclusively via BonChat per §2.4). No identity verifiable outside promo materials. Referenced by name in the **FCA UK warning** (May 2025).
  - **Working hypothesis:** "Stephen Beard" is a **"白工" / "white-monkey job"** — a Western foreigner hired by a Chinese promoter to appear in legitimacy-theater video and photography, almost certainly with no knowledge of the underlying scheme. Hired-foreigner-as-prop is a well-documented Chinese marketing practice; the pattern (consistent on-screen face + zero biographical paper trail) fits.
  - Practical implication: the on-screen "Professor" is most likely **a witness, not a target**. The casting/talent agency that placed him and the production company that filmed him are the upstream leads; investigators should subpoena BGW media production records and reverse-image-search the on-screen identity to find his other commercial appearances.
  - Earlier characterization in this report as "AI-generated" is downgraded to "possible but unlikely given consistent video presence."
- **"Joseph Smith"** — claimed DSJ Exchange COO. Promo video: `youtube.com/watch?v=dJ9A87PSJhM`. No verifiable identity. Same "white-monkey job" hypothesis applies and should be evaluated jointly.

### 3.3 Developers (commissioned / linked)

- **Navya Kushwaha** ("Techsima") — developer of `Navyakushwaha/DSJ-Exchange` (frontend). Associated with Techsima coding institute, **Uttar Pradesh, India**. Assessed by investigators as a **likely commissioned developer** rather than core operator.
- **Xiaolan Lin** (GitHub: **XiaolanLin808**) — developer of `BG-Wealth_SCript` backend. Per Danny de Hek, **recorded admission of BGW user status preserved**; referrals made to **FBI Honolulu Field Office** and **USACIDC / Army CID** (claimed potential military affiliation / clearance status — to be verified by LE, not by us).

### 3.4 US-Based Recruiters (named in BehindMLM and dehek.com)

Hot regions: **US (UT, GA, TX, OK, WA), Tonga, Samoa**.

Senior promoters / Zoom presenters (publicly named by Danny de Hek's "Avengers" investigation; treat as **alleged promoters**, not convicted):

> Faiana Brown (aka Faithful / Gerald Faiana Brown) — UT/WA; Chanse Carlson — UT; Latanya Jones-Kerr — GA; Marcus & Angela Smith; Thaddious Thomas — TX; Mark & Kim Brown — OK; Yitzhak Morrison; Cynthia Tran; Keith Darren Hudson; Tu Tran; Binod Ray; Randy & Sonya Crosby; Arthur Bankston Jr; Oliver Sagala; Gagan Sarkaria; Richard & Sumana Chea; Shawn Foster; BeBe Bui; Hang Tran; Sumana Chea; Suli Zinck; Nila Horton; Nhi Vo; Abhimanyu Choudhary; Diem Nguyen; Sheila Pena; Thuy Nguyen; Yen Nguyen; Brenda Parsons; Paea Ika; Daisy Khong; Gam Nguyen; Vicky Quy Ta; Tran Xuan Phuong; Gerry Bhatt; Santosh Bhusare; Anupam Sharma; Annabelle Hazelton; Gary Bhatt; Tony Sia; Ate Juno; Jossie G Gallizia; **Lee Meadows** (Instagram `@leequynhm`, ~23k followers); Bud Ayers; Ben Acorda; Mike Roberson; Sebrena Wilson; Carl Edwards; Cliffton Eichelberger; Betty Raven; Herman Christophe; Carol Roberson; Tyrone Tanner; Charles Sanders; Sandra Reynolds; Nat Montgomery; Beverly Williams; Ben Robinson; Theresia Carty; Monica Robinson; Veronika Wilson; Anthony Ramirez; Kent Robinson; Toyshiana Gaines; Drake Yi; Anthony Bryant; Drew Burton; Emmanuel Bernstein.

> **Mau Hunt Kota** — Samoa (named by BehindMLM specifically).

These names are sourced from public Zoom-meeting attendance records and social-media activity compiled by the dehek.com Avengers community. They are **alleged promoters**, not subject to any criminal charge known to this investigator.

### 3.5 Live-Captured Upline IDs (anonymous, confirmed-active 2026-05-05)

Pulled from authenticated calls to `api.ddjea.com/api/app/second/share/user/list` from the test account.

| Role | DSJ Account ID | Account Created | Inferred from |
| --- | --- | --- | --- |
| **Salesman** (direct recruiter, L1) | `192445109373423616` | 2024-06-14 17:08:09 UTC | Snowflake decode (DSJ epoch 2023-01-01) |
| **Agent** (L2 upline) | `192444096188960768` | 2024-06-14 17:04:07 UTC | Same |

Both accounts registered **within 4 minutes of each other** on 2024-06-14. This is one of:
- A coordinated recruiter pair (couple / business partners)
- One operator running two personas to game the 3-tier MLM commission structure
- Operator team-leader registered alongside their first downline as an artificial "depth"

Names are **not exposed by the API** at LV0 rank — by design. To resolve names, either subpoena DSJ via FBI IC3 case linkage, or follow the human chain (the BonChat sender is the natural pivot — but the test account came from a third party, breaking that chain).

---

## 4. Modus Operandi

1. **Acquisition** — pig-butchering style cold approach (dating apps, social DMs) or **BonChat-delivered invite link** (confirmed in this case). Invite to Zoom "education" sessions.
2. **Conditioning** — Zoom hype meetings with scripted testimonials, prosperity-gospel framing, MLM rank language ("blessings", "legacy", "wealth transfer"). Faith communities and Pacific Islander diaspora networks heavily targeted.
3. **Deposit** — minimum **$500** in USDT-TRC20 historically; live DSJ instance accepts **$1 minimum** (lowered to capture more victims with higher per-victim retention). Centralized HD-derived deposit address per victim → auto-swept to operator hot wallet within minutes (the test deposit: 13m51s).
4. **Fake yield** — signal codes pasted by victim into the platform produce **1.3% daily / 2.6% compounding** apparent returns. AI-trading hedge-fund cover story. Live capture confirms ~98% rigged "win rate" on followed signals.
5. **Recruitment kickbacks** — **3-tier MLM** observed (per `/api/app/rank/team`): 10 ranks LV0–LV9 unlocked at 5/30/100/300/600/1000/1500/2500/5000 effective recruits; bonus structure scales `0.3 / 0.1 / 0.1` (L1/L2/L3 commission %) up to `5 / 0.1 / 0.1` at LV9. Heavy front-loaded direct-referral incentive.
6. **Mobile-config trust escalation** — DSJ pushes iOS configuration profile (`dsj627.icu/dsj625.mobileconfig`) — granting MDM-style trust to scammer infrastructure.
7. **Lockout** — when victim attempts withdrawal, platform demands additional "tax / unlock fee" deposits (advance-fee scam tail). Min-withdrawal-fee `$35 USDT` configured server-side.
8. **Domain rotation** — old domains burn, new lookalikes go up every 1–2 days. Centralized backend (`api.ddjea.com`) survives the rotation.
9. **Collapse / pivot** — platform freezes withdrawals; operators move to a clone (Swift Wave Capital observed; Lee Meadows separately spinning up "Abundant Blessing AI" / TradePulse-AI funnel).

---

## 5. Regulatory Posture (alerts already issued)

| Regulator | Date | Citation |
| --- | --- | --- |
| FCA (UK) | May 2025 | `fca.org.uk/news/warnings/dsj-exchange-dsjexnet` |
| FMA (New Zealand) | Nov 2025 | `fma.govt.nz/consumers/scams/investment-scams/` |
| ASIC (Australia) | Jan 2026 | `asic.gov.au/investor-alert-list` |
| ASC (Alberta, Canada) | Feb 2026 | `albertasecurities.com` |
| Utah Division of Securities | Mar 2026 | `commerce.utah.gov/2026/03/10/...` |
| WA DFI | Mar 2026 | `dfi.wa.gov/alerts/...` |
| Central Bank of Samoa | (advisory) | Public advisory, Facebook |
| Philippines SEC | (advisory) | Cease/unauthorized notice |
| Tonga | (advisory) | Public advisory |
| FBI / DOJ | Apr 2026 | Indictments + 503-domain seizure (D.C.) |

**UK Companies House:** "DSJ Exchange Ltd" — incorporated July 2024, **dissolved October 2025**, company #15821489 (`find-and-update.company-information.service.gov.uk/company/15821489`). Used for legitimacy theater; never a regulated entity.

**Fake SEC license claim (advertised to victims via in-app announcements):**
> "Good news: DSJEX successfully applied for a SEC license from the U.S. Securities and Exchange Commission on July 11, 2025. CIK: 0002076856"

CIK should be verified against EDGAR. A CIK is automatically issued on first filing and means *nothing* about "license" status — which is a common misrepresentation tactic. Either the CIK doesn't exist, or it was obtained via a sham Form D / no-action filing for legitimacy theater.

---

## 6. Reporting Packet (if you or a contact were affected)

If a victim / client was hit, file in this order:

1. **FBI IC3** — `https://www.ic3.gov` — primary US channel. Reference: BG Wealth Sharing / DSJ Exchange, US v. Jiang Wen Jie & Huang Xingshan (D.D.C. 2026-04-23).
2. **State securities regulator** for victim's state (Utah Division of Securities, WA DFI, etc.).
3. **Action Fraud (UK)** — `actionfraud.police.uk` — if UK victim.
4. **Bank / card issuer** — immediate chargeback / fraud claim if fiat-to-crypto on-ramp used.
5. **Crypto exchange** that hosted any wallet in the chain — formal fraud / freeze request, citing the IC3 case number.
6. **Vercel abuse** — `abuse@vercel.com` — point at `bg-wealth-sharing-six.vercel.app` and `bg-wealth-simulator.vercel.app` (still live).
7. **Telegram abuse** — `abuse@telegram.org` — channel `t.me/+fyRGxnhsEKkwYzg5`.
8. **GitHub abuse** — `github.com/contact/report-content` — flag remaining repos `Navyakushwaha/DSJ-Exchange` and `sonyho2715/lee-meadows-saas`.

**For a victim filing:** keep deposit transaction hashes (TXIDs), wallet-from addresses, screenshots of the platform UI, all messaging history, names/handles of recruiter, dates and amounts. Do **not** pay any "withdrawal tax" or "unlock fee" — that's the advance-fee tail of the scam.

**Pre-built attachments for IC3 / DOJ reference:**
- `wallet/WALLET_FORENSICS.md` — full TRON cluster trace of the operator's $30M hot wallet, named immediate-freeze candidates.
- `wallet/RE_NOTES.md` — VCEX backend reverse-engineering (AES key, signing salt, endpoint catalog) — replayable against any captured VCEX-stack victim session.
- `wallet/headless/live_out/events.sanitized.jsonl` — PII-stripped capture of the live DSJ session showing the architecture in action.

---

## 7. Recommended Follow-Ups (if scope expands)

- ~~Identify the real deposit wallet~~ — **DONE.** the test deposit + sweep + 4-day operator hot wallet captured. See §2.2 + `wallet/WALLET_FORENSICS.md`.
- ~~Source-code archive~~ — **DONE.** Mirror under `evidence/github/`.
- ~~Vercel landing-page archive~~ — **DONE.** Under `evidence/vercel/`.
- **Etherscan trace** — repeat the TRON cluster analysis on `[REDACTED_VICTIM_DEPOSIT_ERC20]` (ERC-20 deposit). Requires Etherscan v2 API key.
- **Tronscan / Arkham attribution** — feed the top-5 next-hop wallets into a paid attribution service to identify the actual CEX off-ramp wallets 2–3 hops downstream.
- **Successor watch** — `watchlist/monitor.py` is automated; daily-cron-ready. Patterns: `yzzq{N}.cc`, `tra{N}.tw`, `dsj{N}.icu`, VCEX clones, "Swift Wave Capital".
- **Promoter scrape** — automated pull of named promoters' active socials (YT/IG/TikTok) to identify who's still pushing post-collapse.
- **EDGAR check** — verify CIK `0002076856` (claimed DSJEX SEC license). If empty/sham, that's a chargeable misrepresentation and a strong addition to the IC3 filing.
- **Capture this week's DSJ hot wallet** — replay the live-capture process (`wallet/headless/take_over_v3.js`) using a fresh victim session. Address rotation cadence ≈ 4 days, so the March hot wallet is dead but its 2026-05-05 equivalent is live.

---

## 8. Sources

- **FCA (UK) warning** — `https://www.fca.org.uk/news/warnings/dsj-exchange-dsjexnet`
- **WA DFI alert** — `https://dfi.wa.gov/alerts/alleged-investment-group-bg-wealth-sharing-ltd-and-cryptocurrency-trading-platform-dsj`
- **Utah Commerce alert** — `https://commerce.utah.gov/2026/03/10/investor-alert-canadian-regulators-warn-about-bg-wealth-sharing-ltd/`
- **ASC (Alberta) / Yahoo Finance mirror** — `https://finance.yahoo.com/news/investor-alert-asc-warns-public-160000249.html`
- **Central Bank of Samoa public advisory** — Facebook post (samoagovt)
- **BehindMLM — FBI seizure** — `https://behindmlm.com/companies/click-a-button-app-ponzis/fbi-seizes-bg-wealth-sharings-original-website-domain/`
- **BehindMLM — WA fraud warning** — `https://behindmlm.com/companies/click-a-button-app-ponzis/bg-wealth-sharing-dsjex-fraud-warning-from-washington/`
- **dehek.com — GitHub source code** — `https://www.dehek.com/general/scam-fraud-investigations/i-found-the-dsj-exchange-source-code-on-github-and-it-proves-everything/`
- **dehek.com — naming and shaming promoters** — `https://www.dehek.com/general/scam-fraud-investigations/naming-and-shaming-bg-wealth-sharing-promoters-senior-leaders-and-potential-victims-listed-publicly/`
- **dehek.com — Lee Meadows exposed** — `https://dehek.substack.com/p/lee-meadows-and-bg-wealth-sharing`
- **IFW Global** — `https://ifwglobal.com/bg-wealth-dsj-exchange-crypto-scam-warning/`
- **fxdailyreport — $41.5M frozen** — `https://fxdailyreport.com/41-5-million-frozen-linked-to-dsj-exchange-collapse/`
- **bgwealthalert.com** — public awareness aggregator (not BGW infra)
- **CrYptOG TRON on-chain video** — `youtu.be/exgrNmrqA08`

---

## 9. Live-Capture Session (2026-05-05)

A test DSJ account (provided by a third-party victim/tester who received the registration link via **BonChat**) was driven through a headed Playwright session against `https://tra809.tw/h5/`. Findings beyond what's already incorporated above:

- **Backend stack:** Spring/Java REST behind Cloudflare. Plain JSON — **no encryption layer** (unlike the older VCEX/Struts2 build). Authentication via `app-login-token` header, returned from `/api/app/user/login`.
- **Endpoint catalog (50+):** wallet/balance, recharge/payment(/info), withdraw/*, share/team, rank/team, second/share/user/*, c2c/*, exchangeapplyorder/*, perpetual/*, finance/* (including a stubbed mining/pledge/yuebao subsystem). Full list in `wallet/headless/out/tra809.tw/api_endpoints.txt`.
- **Deposit shown to victim** = HD-derived TRC-20 + ERC-20 addresses (per-account, both validated; see §2.2).
- **3-tier MLM bonus structure** observed: 10 ranks (LV0–LV9), unlocked at 5/30/100/300/600/1000/1500/2500/5000 effective recruits.
- **Fake performance metrics** in the test account: `followCount: 86`, `followWinCount: 84`, `followLoseCount: 2` (97.7% win rate). Standard rigged-signals confidence-builder.
- **Fake balance** (~$1,774 USDT) — credited to the test account by the prior-tester third party. **Money cannot be withdrawn without paying advance "tax/unlock" fees**, which is the second-stage scam tail; do not pay any unlock fee.
- **Upline IDs:** see §3.5. Names not exposed by the API at LV0 — name resolution requires DSJ subpoena via FBI IC3.
- **Sanitized capture available:** `wallet/headless/live_out/events.sanitized.jsonl` — PII (phone, IPs, account ID, session token, invite code) stripped; safe to attach to any regulator filing.

---

## 10. Sources & Files

**Raw evidence preserved at:** `osint/dsj-exchange/`

```
REPORT.md                              # this file
raw/                                   # original article + WHOIS/DNS captures
  whois.txt, dns.txt, live_domains.txt, successor_domains.txt
  dehek_github.html, dehek_promoters.html
  behindmlm_fbi.html, behindmlm_wa.html
  bgwealthalert.html, ifw_global.html
  vercel_six.html, vercel_simulator.html, tradepulse_ai.html
  vcexpro_index.html, vcexin_index.html
evidence/
  github/        # cloned source repos (Navyakushwaha, sonyho2715, TheAugDev)
  vercel/        # mirrored bg-wealth-sharing-six + bg-wealth-simulator
watchlist/
  WATCHLIST.md, watchlist.yaml
  monitor.py                           # daily cron-ready successor monitor
  runs.jsonl                           # historical run log
wallet/
  WALLET_FORENSICS.md                  # TRON cluster + $30M hot-wallet trace
  RE_NOTES.md                          # VCEX backend reverse-engineering
  chain/tron/flows/                    # 10K inbound + 641 outbound + hop-2 transfers
  headless/
    capture.js, live_capture.js, take_over_v3.js, sanitize.py
    live_out/
      events.jsonl                     # raw capture (CONTAINS PII)
      events.sanitized.jsonl           # safe-to-share version
      team_v3.jsonl                    # /share, /team, /credit responses
      team_v2_passive.json             # earlier capture (pre-token-expiry)
    out/
      tra809.tw/        # DSJ frontend bundle + decompressed JS
      vcexpro.com/      # VCEX frontend + decrypted API responses
      bg-wealth-sharing-six.vercel.app/, bg-wealth-simulator.vercel.app/
```
