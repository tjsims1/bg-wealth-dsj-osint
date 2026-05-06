# OSINT Report: DSJ Exchange / BG Wealth Sharing

**Investigator:** Vault Data Servers
**Date compiled:** 2026-05-05 (Tue, MST)
**Status of operation:** Collapsed late April 2026; FBI domain seizure 2026-04-23; criminal charges filed 2026-04-23 (D.C.); **DSJ-branded successor infrastructure confirmed live and operational** as of this report (auth-walled live capture from the test account on `tra809.tw` / `api.ddjea.com`).
**Confidence:** Findings backed by multiple regulator notices, FBI/DOJ press, and independent OSINT (Danny de Hek / dehek.com, BehindMLM, IFW Global). **Live-session capture (§9) provides first-hand on-chain + backend evidence.** Treat unconfirmed personas (Stephen Beard, Joseph Smith) as fictional or AI-generated unless proven otherwise.

---

## 1. Executive Summary

**DSJ Exchange (DSJEX) / BG Wealth Sharing** was a "click-a-button" cryptocurrency Ponzi operated out of a scam compound in **Min Let Pan, Burma**, from at least **January 2025 until December 2025**, with US-facing recruitment continuing until the platform's collapse in **late April 2026**. Victims deposited USDT (TRC-20) into a controlled exchange UI, were fed scripted "trading signals" exclusively via BonChat (other channels — Telegram, WhatsApp — were used for *recruitment* only), and saw fake P&L until withdrawals locked. Total estimated illicit volume: **~$150M**, with **~$41.5M frozen** by combined US/international action.

Two Chinese nationals — **Jiang Wen Jie** (aka Jiang Nan) and **Huang Xingshan** (aka Ah Zhe) — were charged in the District of Columbia on **2026-04-23** as part of DOJ's Scam Center Strike Force. Both fled Burma to Thailand in November 2025 and were arrested by Thai authorities on immigration fraud; US extradition is undecided. **The two named defendants are not the masterminds; they are mid-level operators.** Two strong tells: (a) they were caught on *immigration* charges in Thailand, not financial crimes — that's the profile of compound staff who fled the heat without high-level protection, not of bosses with ties capable of insulating them; and (b) the operation's scale (≥$150M moved, exchange-as-a-service backend, multi-tier laundering chain shown in §2.2) requires institutional-level financiers + a software vendor + a laundering layer + an MLM marketing layer. The two indicted defendants plausibly managed the day-to-day compound and recruitment cell. Apex actors and several specialist roles remain at large — see §3.1 for the typical hierarchy. BonChat activity has remained continuously live post-indictment — see §9 — confirming the operational team is largely intact and that further indictments are likely as the DOJ Strike Force unwinds the broader network.

The platform branding personas — "**Professor Stephen Beard**" (claimed founder, gives daily "signals") and "**Joseph Smith**" (claimed COO) — are not who they claim to be. **Stephen Beard is a real person who appears recurrently in live Zoom meetings with victim recruits** (eyewitness corroboration). This rules out the AI-synthesis hypothesis (earlier report draft retracted). His **visual profile fits the Chinese "白工" (white-monkey job) archetype** — the kind of Western foreigner Chinese state media (CGTN) and promoter agencies recruit for legitimacy theater — so the most plausible reconstruction is: **白工 origin → escalated involvement**. Recurring live Zoom appearances rule out a one-shot prop hire and put him squarely in the "knowing participant" category by now, regardless of how much he understood at first. Treat him as a **target / co-conspirator candidate, not a mere witness**, while recognizing he is **a hired front man — not the apex of the operation**. Investigators should reverse-image-search his face (likely surfaces in prior CGTN appearances or other Chinese-promoter materials) and subpoena recordings of past BGW Zoom sessions for direct-evidence statements. The actual technical operation relied on freelance/commissioned developers in India and possibly elsewhere, with the source code briefly exposed on public GitHub.

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
| `nex.afirrmjob.com` | **NEXO Trading Global / "NEXOmax" frontend (new sibling)** | **Live (HTTP 200)** | Discovered 2026-05-05. Same operator family per dehek.com. |
| `afirrmjob.com` | NEXO parent SaaS host | Cloudflare-fronted | Registrar **Dominet (HK) Limited / Alibaba Cloud**, created 2025-03-11 — same Chinese registrar fingerprint as the rest of the cluster. |
| `bggp.vip`, `bg911.cc` | BG-rotation lookalikes | Listed by WA DFI | New patterns extending the rotation fleet. |
| `dsj15.com` | DSJ-rotation lookalike | Listed in alertopedia.com | Confirms the `dsj{N}.com` numerator runs lower than the previously catalogued range. |
| `dsj158.com`, `dsj081.com` | DSJ-rotation lookalikes | **Officially named by BCSC, 2026-01-28** (Investment Caution Warning, DSJ Exchange PTY Ltd) | Primary regulator citation: `bcsc.bc.ca/enforcement/early-intervention/investment-caution-list/2026/dsj-exchange-pty-ltd` |
| `limitlesscrowd.xyz` | Sarkaria-owned BGW recruitment funnel | DNS dead (taken down post-BCSC); registered Namecheap 2025-05-13, NS at MYSECURECLOUDHOST.COM | Flagged by BCSC in the companion BG Wealth Sharing warning (2026-01-28). Owner per site footer: Gagan Sarkaria — see §3.4.1. |
| `tradewithnick.com` | Variant front-man brand for BGW | ASIC Investor Alert List (Jan 2026); BGW alias | Surfaces a separate "Nick" front-man persona used in some recruitment funnels (separate from Stephen Beard / Joseph Smith). |

**Domain rotation pattern:** numeric-suffix lookalikes registered in fast bursts. The original branded patterns (`dsj{N}.com`, `dsjex{N}.com`, `dsj{N}.icu`, `bg{N}.com`, `yzzq{N}.cc`, `tra{N}.tw`) have been **partially superseded by un-themed 3-letter-prefix rotations** as of late April 2026 — operators are deliberately moving away from brand-mappable names to evade pattern-match detection. Examples in current rotation (captured 2026-05-05 directly from **operator BonChat broadcasts to retained users** — i.e. the same channel that delivers the rigged-trading "signal codes"; every "Latest Login URLs" message advertises a new domain pair as old ones get takedown'd; all live HTTP 200 unless noted, all via Gname.com Pte. Ltd. registrar):

| Pattern | Examples | Notes |
| --- | --- | --- |
| `bg{N}.com / .cc` (legacy themed) | `bg6988.com`, `bg5399.cc` | Both live |
| `yti{N}.com` | `yti351.com`, `yti355.com` | Both live |
| `okm{N}.net` | `okm772.net`, `okm776.net` | Both live |
| `ase{N}.net` | `ase5228.net` | Live (HTTP responds) |
| `ajy{N}.net` | `ajy6278.net` (and `/h5/ios` for iOS profile distribution) | Live |
| `wt{N}.cc` / `wtl{N}.cc` | `wt1113.cc`, `wtl003.cc`, `wtl005.cc` | Some live |
| `asq{N}.net` | `asq1283.net` | Live |
| `apy{N}.net` | `apy2088.net` | Live |

**Operator-attribution registrar:** every WHOIS record sampled traces to **Gname.com Pte. Ltd.** (Singapore-domiciled registrar; abuse contact `complaint@gname.com`, phone `+65.65189986`). This is the same registrar that the VCEX domains (`vcexpro.com`, `vcexin.com` etc.) used; **it is now the strongest single-source operator fingerprint in this network.** Any new domain in the rotation patterns above + Gname.com registration + Cloudflare front-end is high-confidence DSJEX/BGW family.

**Bulk-registration evidence:** the 2026-04-27 batch shows `asq1283.net` and `ajy6278.net` created in the **same minute** (08:40:54 / 08:40:56 UTC) — script-driven bulk registration, not manual. The 2026-04-25 batch (`wtl003.cc` and adjacent) registered ~05:25 UTC. Pacing of "Latest Login URLs" messages broadcast in BonChat to retained users matches a daily-to-bi-daily rotation cadence — i.e. operators register new domains in script-bursts every 1–2 days and immediately push the new URLs into the same closed channel that hosts the rigged-trading signal codes.

Any new domain matching these patterns + privacy-shielded WHOIS + Cloudflare in front + Gname.com registrar should be treated as suspect.

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
- **BonChat as victim-control infrastructure (per dehek.com investigation).** The platform is used not just for signal delivery but for **active surveillance and silencing**: operators monitor member messages, block screenshots in-app, and require victims to provide a "reason" before withdrawals — those who try to speak out or refuse are muted or removed from the channel. BonChat is a low-uptake messenger by design — chosen because it offers minimal transparency around message retention while giving operators central conversation control.
- **BonChat channel architecture (live capture 2026-05-05).** Group naming follows a numbered-cell convention — observed example: `BG-015 Wealth Shar…` — strongly implying the operator runs many parallel groups (`BG-001 … BG-015 …`) each handling a different chunk of the victim base. Channels are configured **"Prohibit to pin messages"** — read-only / broadcast-only mode where only the operator account can post or pin, eliminating any victim-to-victim cross-talk that might surface complaints.
- **Operator account handle (live capture 2026-05-05):** `**BG-Stephen Beard**`. This is the BonChat display name of the account broadcasting (a) the rotation domain pairs ("DSJEX Latest Login URLs"), (b) the rigged-trading signal codes (Order Codes), and (c) operator-authored tutorial screenshots. The same on-camera figure used in BGW promotional content (§3.2) appears as the channel avatar. Whether this BonChat account is operated by the on-camera "Stephen Beard" personally or by another operator using his name and likeness is unresolved — but brand cohesion is direct: the front-man identity is also the broadcast-channel identity.
- **Captured signal code (live, 2026-05-05 15:45 operator-timezone):** `1M7VIGSCR` — pinned by `BG-Stephen Beard`. Format is 8–9 alphanumeric characters. Operator-posted tutorial screenshots elsewhere in the same channel show victims (a) transferring USDT into the platform "Trade" wallet and then (b) pasting the signal code into a UI button labeled **"Order Code"** to "execute" the rigged trade. This is the closed-loop mechanism by which the platform produces fake P&L on a deterministic schedule.
- **Primary evidence screenshot:** `evidence/bonchat/bonchat-broadcast-2026-05-05.jpg` (iPhone status bar cropped). Shows the `BG-015 Wealth Shar…` channel header, the `BG-Stephen Beard updated pinned messages → 1M7VIGSCR` banner, the `DSJEX Latest Login URLs: yti355.com / yti351.com` broadcast (timestamp 15:35), the two operator-supplied tutorial screenshots (Funds-Transfer flow + the `Order Code` UI button, both at 15:37), and the second pinning of `1M7VIGSCR` at 2026-05-05 15:45. Source: a test account observer; viewer-side identifying elements (status bar, profile UI) are not in frame.
- **Captured Zoom infrastructure (BonChat broadcast 2026-05-05, preserved verbatim at `evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`).** The same closed BonChat channel that delivers signal codes and rotation domains is also used to broadcast recurring **Zoom presentation invitations**. The captured invitation is for a Vietnamese-language presentation series operating on a Wed + Fri schedule across CA/TX/FL/NY/Vietnam/France time zones. **Meeting ID `857 8897 8544`, passcode `11118888`**, host platform `us06web.zoom.us`. The presenter is Cynthia Tran (LV7); co-hosts are Lien Tran (LV7), Katrina Tran (LV6), Vivian HaChau PhamVo (LV3) — see §3.4.2. **Subpoena value:** Zoom's compliance team is responsive to law-enforcement subpoenas; the host account behind `857 8897 8544` is tied to a real billing identity (email + phone + payment method), meeting recordings are retained per the host-account retention setting, and attendee logs include each connected account's email or phone. This is the cleanest path to linking the named promoters to real legal identities and to documenting the verbatim pitch-deck claims (see §4) made to recruits.
- **Securities-fraud-actionable claims captured verbatim** (from the same broadcast — these are *direct quotations of the promoters' own pitch*, which is the strongest possible foundation for a securities-fraud filing): "1.8% daily profit", "capital doubles in 60 days", "AI Software with 99.6% win rate. But BG guarantees 100%", "Level-up bonuses $100 – $2.0M", "Monthly dividends $90 – $1.0M", "No participation fee", "Same-day withdrawals", "$100 Birthday Gift". Promised-returns-with-guarantee + retail-marketing recruitment satisfies the standard predicate elements for an unregistered-securities-offering charge under most Western jurisdictions.
- **Mobile-app distribution:** `dsj627.icu/dsj625.mobileconfig` (iOS) and `dsj627.icu/dsj625.apk` (Android) — installing the iOS profile grants MDM-style trust and is a major escalation vector beyond simple investment loss.

---

## 3. Persons of Interest

### 3.1 Charged (DOJ, D.C., 2026-04-23)

- **Jiang Wen Jie** (aka **Jiang Nan**) — Chinese national, operated Burma compound Min Let Pan, fled to Thailand Nov 2025, arrested by Thai authorities **on immigration fraud, not on the underlying investment-fraud counts**. Treated by DOJ as operational management of the compound; almost certainly **not the apex** of the scheme.
- **Huang Xingshan** (aka **Ah Zhe**) — Chinese national, same compound, same flight pattern, same Thai detention. Same mid-level-management profile.

**Why the two charged are likely mid-level, not kingpins.** They were arrested in Thailand on *immigration* charges — that's the failure mode of compound staff fleeing without high-level protection, not of financiers / sponsors. The financial scale ($150M+ historic, $30M through a single 4-day hot wallet) and the operational sophistication (centralized backend, rotating domain fleet, Cloudflare + Alibaba CDN + exchange-as-a-service template, multi-hop laundering, MLM marketing layer, BonChat + Zoom dual-channel handling, 白工 talent acquisition) require *layered* organizational structure these two could not credibly run alone.

**Typical Burma "click-a-button" compound hierarchy (roles likely still at large):**

| Layer | Role | Status of named defendants vs this layer |
| --- | --- | --- |
| **Apex / financier** | Capital sponsors, often Triad-affiliated; rarely physically present at the compound | Not charged. Untouched by current indictment. |
| **Compound leadership** | Cell operations boss, security, payroll | Not charged. Local protection in Burma. |
| **Mid-level management** | Floor managers, shift leads, BonChat-team supervisors | **← Jiang Wen Jie + Huang Xingshan most likely sit here.** |
| **Floor staff** (50–200 typical headcount) | BonChat handlers / signal scripters; KYC / chargeback handlers; IT / dev support | Not charged. Continued operation post-2026-04-23 confirms most floor staff still working. |
| **Marketing / MLM front** | Named promoters in §3.4 (Lee Meadows, Faiana Brown, etc.) — outside the compound | Not charged criminally; subject of regulator advisories only. |
| **Front-man personas** | "Stephen Beard", "Joseph Smith" — paid Western spokespeople with 白工 origin | Not charged. See §3.2; treat as targets / co-conspirators, not apex. |
| **Software vendor** | The Chinese exchange-clone-as-a-service supplier whose codebase backs DSJ + VCEX + clones | Unidentified. Strong forensic lead — same backend signatures span multiple "click-a-button" Ponzis. |
| **Laundering layer** | Operators of the next-hop wallets in §2.2 + the further off-ramp into CEXes | Unidentified. Top-5 next-hop wallets are the freeze targets. |

**Investigative priorities for additional attribution:**
- BonChat handle operators sending signal codes — capture timestamps + handles per session.
- Operators of `api.ddjea.com` / Cloudflare account that fronts it (subpoena Cloudflare for billing identity).
- Private-key holders for the operator hot wallet `TYwaXc4ofNK2mL4NHaz9y58WiNAhguqWLu` and the top-5 next-hop wallets in §2.2.
- The exchange-clone software vendor — fingerprintable across DSJ + VCEX (different stacks but same operator pattern); GitHub commits in `Navyakushwaha/DSJ-Exchange` and the deleted `XiaolanLin808/BG-Wealth_SCript` are starting points.
- Zoom host accounts that schedule recurring BGW meetings — host billing identity is the cleanest path to the front-man personas' real names.

### 3.2 Front-End Personas (paid actors and/or fabricated)

- **"Professor Stephen Beard"** — claimed BGW founder, gives daily "trading signals" (delivered exclusively via BonChat per §2.4). No biographical identity verifiable outside promo materials. Referenced by name in the **FCA UK warning** (May 2025). **BonChat-handle correlation (2026-05-05 capture, see §2.4):** the broadcast-operator account name in the BG-NNN BonChat channels is literally **`BG-Stephen Beard`**, with the on-camera figure as the channel avatar. The front-man identity is therefore also the operator broadcast identity on the closed signal channel — whether operated by him personally or by someone using his name and likeness is unresolved.
  - **Real person, knowing participant.** Eyewitness corroboration confirms he appears live in BGW Zoom meetings with victim recruits on a recurring schedule. That cadence rules out the AI-generated theory (earlier report draft retracted).
  - **Most plausible reconstruction: 白工 origin → escalated to active front-man.** His visual profile fits the classic 白工 ("white-monkey job") archetype — the kind of Western foreigner Chinese state media (CGTN) and promoter agencies recruit for legitimacy theater. He very likely *started* as a paid prop. But a one-shot prop hire would not have a recurring live Zoom presence, so he has since become an active, paid spokesperson — coordinating live with operators, reading scripts to victim audiences, and lending his real face and voice to legitimacy theater.
  - **Treatment in any filing:** target / co-conspirator candidate, **not** witness — but note he is **a hired front man, not the apex of the operation**. The Chinese promoter agency / talent-broker that placed him is the upstream lead. Note: "Stephen Beard" the on-camera name may be a stage / pseudonym; his real legal identity is the open question.
  - **Investigative leads on this persona:**
    - Reverse-image-search his face — the same face very often surfaces in **CGTN clips, Chinese tourism / business-promotional footage, stock-photo libraries, and other "white-foreigner-prop" gigs.** Aggregating his cross-platform appearances frequently exposes the talent agency that books him.
    - Subpoena recordings of past BGW Zoom sessions (named promoters in §3.4 routinely host them; recordings exist in their accounts).
    - Subpoena Zoom for the host accounts that scheduled BGW recurring meetings — those accounts are tied to real billing emails / phones, which is the cleanest path to his real legal identity without relying on photographic match alone.
- **"Joseph Smith"** — claimed DSJ Exchange COO. Promo video: `youtube.com/watch?v=dJ9A87PSJhM`. No verifiable identity. Same 白工-origin / paid-front-man pattern likely applies; pending Zoom-presence corroboration to confirm.

### 3.3 Developers (commissioned / linked)

- **Navya Kushwaha** ("Techsima") — developer of `Navyakushwaha/DSJ-Exchange` (frontend). Associated with Techsima coding institute, **Uttar Pradesh, India**. Assessed by investigators as a **likely commissioned developer** rather than core operator.
- **Xiaolan Lin** (GitHub: **XiaolanLin808**) — developer of `BG-Wealth_SCript` backend. Per Danny de Hek, **recorded admission of BGW user status preserved**; referrals made to **FBI Honolulu Field Office** and **USACIDC / Army CID** (claimed potential military affiliation / clearance status — to be verified by LE, not by us).

### 3.4 US-Based Recruiters (named in BehindMLM and dehek.com)

Hot regions: **US (UT, GA, TX, OK, WA), Tonga, Samoa**.

Senior promoters / Zoom presenters (publicly named by Danny de Hek's "Avengers" investigation; treat as **alleged promoters**, not convicted):

> Faiana Brown (aka Faithful / Gerald Faiana Brown) — UT/WA; Chanse Carlson — UT; Latanya Jones-Kerr — GA; Marcus & Angela Smith; Thaddious Thomas — TX; Mark & Kim Brown — OK; Yitzhak Morrison; **Cynthia Tran (HồngVân Trần) — LV7** (see §3.4.2); **Lien Tran — LV7**; **Katrina Tran — LV6**; **Vivian HaChau PhamVo — LV3**; Keith Darren Hudson; Tu Tran; Binod Ray; Randy & Sonya Crosby; Arthur Bankston Jr; Oliver Sagala; Gagan Sarkaria (see §3.4.1); Richard & Sumana Chea; Shawn Foster; BeBe Bui; Hang Tran; Sumana Chea; Suli Zinck; Nila Horton; Nhi Vo; Abhimanyu Choudhary; Diem Nguyen; Sheila Pena; Thuy Nguyen; Yen Nguyen; Brenda Parsons; Paea Ika; Daisy Khong; Gam Nguyen; Vicky Quy Ta; Tran Xuan Phuong; Gerry Bhatt; Santosh Bhusare; Anupam Sharma; Annabelle Hazelton; Gary Bhatt; Tony Sia; Ate Juno; Jossie G Gallizia; **Lee Meadows** (Instagram `@leequynhm`, ~23k followers); Bud Ayers; Ben Acorda; Mike Roberson; Sebrena Wilson; Carl Edwards; Cliffton Eichelberger; Betty Raven; Herman Christophe; Carol Roberson; Tyrone Tanner; Charles Sanders; Sandra Reynolds; Nat Montgomery; Beverly Williams; Ben Robinson; Theresia Carty; Monica Robinson; Veronika Wilson; Anthony Ramirez; Kent Robinson; Toyshiana Gaines; Drake Yi; Anthony Bryant; Drew Burton; Emmanuel Bernstein.

**Vietnamese-diaspora targeting cohort (added 2026-05-05).** A BonChat broadcast captured 2026-05-05 (preserved at `evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`) names Cynthia Tran, Lien Tran, Katrina Tran, and Vivian HaChau PhamVo as the presenter and co-hosts of a recurring Wednesday + Friday Vietnamese-language Zoom presentation series for BG Wealth Sharing. The four are the first promoters in this report whose **DSJEX in-platform ranks are confirmed by primary-source operator broadcast** (LV7 / LV7 / LV6 / LV3 respectively); the rank schedule in §4.5 implies LV7 status corresponds to ≥1,500 effective recruits.

> **Mau Hunt Kota** — Samoa (named by BehindMLM specifically).

> **Hohepa Patea** — New Zealand. Currently promoting "Signal Raiders" / CRGLOBAL / UICEX — same operator family as DSJ/BGW per dehek.com investigation (right-of-reply offered 2025-10-25). Subject of FMA NZ TXEX warning.

> **Philip J Hermann** — listed as "CEO" of NEXO Trading Global / NEXOmax (via `nex.afirrmjob.com`). NEXO LIMITED incorporated February 2026 at a Denver registered-agent address; references a FinCEN MSB registration (which provides no regulatory legitimacy). Same playbook as BGW. Profile assessment pending — front-man hypothesis (cf. Stephen Beard, §3.2) plausible but unconfirmed.

### 3.4.1 Documented promoter — Gagan Sarkaria (citation-anchored entry)

The §3.4 list includes Gagan Sarkaria. This sub-section restates each factual claim with the primary source it's drawn from. Every line item below is either (a) sourced to a regulator, (b) sourced to an established secondary investigative outlet (BehindMLM, dehek.com), or (c) drawn from her own publicly-published self-description. Claims I cannot independently corroborate from a primary or named secondary source have been removed from earlier drafts of this section.

**Identity (per her own publicly-available materials):**
- Name listed on her own websites and LinkedIn: **Gagan Sarkaria, MFA, MBA**
- Self-described professional role on `gagansarkaria.com`: "high achievement book, branding, business & life coach"
- Self-attributed business: "**Unfold Your Success, LLC**" in the **"Dallas-Fort Worth market in Texas**" — quoted verbatim from her personal website by BehindMLM (2026-02-XX writeup, see below). Note: I have not independently verified the LLC's filing status with Texas SOS; treat as her own self-attribution unless verified.
- Self-marketed specialties on her own sites: life-coaching and "Zi Wei Dou Shu (Chinese Astrology) Destiny Science Life Map Readings"
- Public profiles: `gagansarkaria.com`, `gagansarkaria.international`, `linkedin.com/in/gagansarkaria`, YouTube channel ID `UC18m5EWP-rSt-lFPjQ3FV-g`, Thrive Global contributor profile

**Connection to BG Wealth Sharing / DSJEX (regulator + named secondary sources):**
- **BCSC primary citation #1** — BG Wealth Sharing Ltd. Investment Caution Warning, dated **2026-01-28**: `bcsc.bc.ca/enforcement/early-intervention/investment-caution-list/2026/bg-wealth-sharing-ltd`. Explicitly lists `https://limitlesscrowd.xyz/bg-wealth-sharing` among the entity's websites, alongside `bg661.com`, `bg877.com`, `dsj679.com`. (BCSC names the websites; it does not name Sarkaria personally.)
- **BCSC primary citation #2** — DSJ Exchange PTY Ltd. Investment Caution Warning, dated **2026-01-28**: `bcsc.bc.ca/enforcement/early-intervention/investment-caution-list/2026/dsj-exchange-pty-ltd`. Lists `dsj158.com`, `dsj081.com`. (BCSC names the entity; it does not name Sarkaria personally.)
- **BehindMLM (named secondary source)** quotes the `limitlesscrowd.xyz` footer as identifying the site as **"owned by Gagan Sarkaria a Founding Member of Blockchain Sports Crowdfunding Project brought to you by Limitless"** and as describing her as **"an investor and member of the Limitless Crowdfunding Community."** I am unable to independently verify the footer text — Wayback Machine has no snapshots of `limitlesscrowd.xyz` and the domain has been dropped. The claim therefore rests on BehindMLM's reporting, not on a directly-archived primary.
- **dehek.com dedicated article** — "BG Wealth Sharing Collapse: Gagan Sarkaria's False Promises Exposed as Withdrawal Crisis Deepens" (`dehek.com/general/scam-fraud-investigations/bg-wealth-sharing-collapse-gagan-sarkarias-false-promises-exposed-as-withdrawal-crisis-deepens/`). Per dehek, in a presentation given in Utah, Sarkaria reportedly described BGW as a "US SEC-linked advisory firm" and as the "world's largest hedge fund for retail investors," and reportedly told the audience members could "double their money in under 60 days, supported by daily returns of around 1.3% to 1.8% through copy trading." These are dehek's reporting of her statements, not direct video transcript I have personally verified.

**Multi-scheme history (per named secondary sources):**
- Per BehindMLM and the millionairedrive blog: Sarkaria has been "tied to Blockchain Sports, itself linked to Jeremy Roma's repeatedly collapsed Daisy Global ecosystem." This is two independent secondary sources aligning on the same multi-scheme attribution; I have not independently verified the Daisy Global / Blockchain Sports linkage to Sarkaria from primary documents.

**Claims removed from earlier draft (could not be primary-sourced):**
- *"Held DSJEX in-platform rank LV7"* — appeared in one web-search summary; could not be traced to a primary source or established secondary. **Removed.**
- *"Appeared in promotional content alongside Dr. Stephen Beard for DSJEX"* — appeared in one web-search summary; could not be traced to a primary source or established secondary. **Removed.** (dehek.com's own taxonomy lists "Dr Steven Beard BG" as a topic-tag adjacent to articles tagged with Sarkaria, which is suggestive but not an assertion of co-appearance.)

**Right of reply.** This entry restates publicly-available reporting and her own publicly-published self-description. If Gagan Sarkaria, or anyone representing her, wishes to dispute any factual claim in this section or provide a response, contact via GitHub Issues on this repository. Corrections supported by reasonable evidence will be incorporated; the offer is open without prejudice.

**Treatment in this report.** Sarkaria is named on the §3.4 list of *alleged* BG Wealth Sharing promoters as documented by Danny de Hek's "Avengers" investigative community. Inclusion on the §3.4 list and elevation to this sub-section reflects the volume and specificity of secondary-source documentation, not any criminal finding by this investigator. **No criminal charge against Gagan Sarkaria is known to this investigator as of the report date.** Persons believing themselves to have been harmed by activities promoted under any of the brand names in §3.6 may consider filing complaints with their applicable consumer-protection or securities regulator; this report makes no recommendation of action against any specific named individual.

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

### 3.4.2 Documented promoter — Cynthia Tran (HồngVân Trần) (citation-anchored entry)

Same evidence-anchored framing as §3.4.1.

| Element | Detail |
| --- | --- |
| **Name(s)** | Cynthia Tran; Vietnamese: HồngVân (Cynthia) Trần |
| **DSJEX in-platform rank** | **LV7** — directly stated in operator-authored broadcast (`evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`); per §4.5 the LV7 tier requires ≥1,500 effective recruits. **First primary-source rank confirmation in this report.** |
| **Documented role** | Listed as "Presenter" of the BG Wealth Sharing recurring Vietnamese-language Zoom presentation (Wed + Fri, multi-time-zone schedule targeting CA/TX/FL/NY/Vietnam/France diaspora). |
| **Subject of Zoom session** (verbatim, translated) | "How to achieve up to 1.8% daily profit and grow your capital within 60 days! / Trading by signal — simple & easy" |
| **Co-hosts named in same broadcast** | Lien Tran (LV7), Katrina Tran (LV6), Vivian HaChau PhamVo (LV3) |
| **Independent secondary-source mention** | "Cynthia Tran" appears on the Danny de Hek "Avengers" community §3.4 list of alleged BGW promoters |

**Primary-source citation.** The broadcast invitation is preserved verbatim at `evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`. Both the rank and role attributions for Cynthia Tran in this sub-section come directly from that operator-authored broadcast — i.e. the authorship is the operator's, not this investigator's.

**Right of reply.** If Cynthia Tran (HồngVân Trần) — or Lien Tran, Katrina Tran, or Vivian HaChau PhamVo — wishes to dispute any factual claim or provide a response, contact via GitHub Issues on this repository. Corrections supported by reasonable evidence will be incorporated; the offer is open without prejudice.

**Treatment in this report.** Cynthia Tran is named on the §3.4 list of *alleged* BG Wealth Sharing promoters as documented by Danny de Hek's Avengers community. Inclusion on the list and elevation to this sub-section reflects the volume and specificity of secondary-source documentation supplemented by directly-captured operator broadcast. **No criminal charge against Cynthia Tran, Lien Tran, Katrina Tran, or Vivian HaChau PhamVo is known to this investigator as of the report date.** Persons believing themselves harmed by activities promoted under any of the brand names in §3.6 may consider filing complaints with their applicable consumer-protection or securities regulator; this report makes no recommendation of action against any specific named individual.

### 3.6 Multi-Brand Operator Family (the "TXEX Umbrella")

The DSJ Exchange / BG Wealth Sharing operation is **one cell of a long-running, multi-decade exchange-clone-as-a-service network**. The same playbook (10-tier MLM ranks, twice-daily "signal codes" pasted into a rigged UI, BonChat surveillance, withdrawal-blocking-plus-tax exit-scam, **the same recurring "Professor" persona reappearing across brands** per Alberta Securities Commission) has shipped under at least the following names. Promoters often pivot before each collapse, carrying their downline networks into the next brand.

| Era | Brand(s) | Status / Notes |
| --- | --- | --- |
| Earlier | **TXEX** (umbrella name) | FMA NZ explicit warning page: `fma.govt.nz/library/warnings-and-alerts/txex/` (2025) |
| ~ | **LWEX** | Predecessor brand per dehek.com |
| ~ | **CR Group LLC / CR Wealth / CR Investment Group / CRGLOBAL / UICEX** | Collapsed; current rebrand → "Signal Raiders" |
| 2025 | **BG Wealth Sharing** | FBI seizure of `bgwealthsharing.com` 2026-04-23; collapsed late April 2026 |
| 2025 | **DSJ Exchange / DSJEX** | Active sibling to BGW; live successor frontends `tra809.tw`, `dsj626.icu`, `dsj627.icu` etc. (this report) |
| 2025-12 | **Swift Wave Capital / VCEX / Value Chain** | Promoter Faiana Brown (also BGW); FMA-listed 2026-04-14; live VCEX nodes on `38.182.168.98` (`vcexpro.com`, `vcexin.com`) |
| 2026-02 | **NEXO Trading Global / NEXOmax** | Live at `nex.afirrmjob.com` (Cloudflare/Alibaba); NEXO LIMITED Denver shell; named "CEO" Philip J Hermann |
| 2026 | **Signal Raiders** | Current rebrand of CRGLOBAL/UICEX; promoter Hohepa Patea (NZ) — subject of FMA TXEX warning |

**Ancillary same-family brands referenced by investigators:** Hyperverse, Validus (older Australian crypto MLM Ponzis using the same recruitment-and-rebrand pattern; same compensation-plan archetype).

**Forensic implications:**
- The "**Professor Stephen Beard**" persona (§3.2) is plausibly **a recurring on-camera identity reused across multiple brands** — the dehek/ASC observation that "the same professor persona" appears in TXEX/CRGLOBAL/BGW/etc. means a single reverse-image-search may surface him in promotional material spanning multiple takedown-case brand names. That makes him a stronger forensic anchor than any single-brand investigation would suggest.
- The DSJ-stack signature (Spring/Java REST + `app-login-token` + plain-JSON over Cloudflare) and the VCEX-stack signature (Apache Struts 2 + AES-128-ECB-with-`dapp-20230831abc` + signing-salt-`VCExhhw...`) are **two distinct backends** servicing this same family, suggesting either two sibling SaaS vendors or one vendor with two product lines. NEXO's stack is a third datapoint: TradingView + Vite + `afirrmjob.com` parent — fingerprint pending.
- The 2026-04-23 indictment hit one cell. The umbrella is much larger.

---

## 4. Modus Operandi

1. **Acquisition** — pig-butchering style cold approach (dating apps, social DMs) or **BonChat-delivered invite link** (confirmed in this case). Invite to Zoom "education" sessions.
2. **Conditioning** — Zoom hype meetings with scripted testimonials, prosperity-gospel framing, MLM rank language ("blessings", "legacy", "wealth transfer"). Faith communities and Pacific Islander diaspora networks heavily targeted.
3. **Deposit** — minimum **$500** in USDT-TRC20 historically; live DSJ instance accepts **$1 minimum** (lowered to capture more victims with higher per-victim retention). Centralized HD-derived deposit address per victim → auto-swept to operator hot wallet within minutes (the test deposit: 13m51s).
4. **Fake yield (mechanism, now directly evidenced):** the operator account `BG-Stephen Beard` broadcasts a fresh **8-9 char alphanumeric "Order Code"** (e.g. captured example `1M7VIGSCR`, posted 2026-05-05 15:45) into the closed BonChat channel each session. Operator-supplied tutorial screenshots in the same channel show victims must (a) transfer USDT into a "Trade" sub-wallet, then (b) paste the Order Code into a UI button labeled **"Order Code"** to "execute" a trade. The platform deterministically renders fake P&L matching the advertised **1.3% daily / 2.6% compounding** yield. Live capture confirms ~98% rigged "win rate" on followed signals — i.e. the platform itself is the executor of the rigged trade; the "signal" is just a session token authorizing the deterministic outcome.
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

**Colorado Secretary of State (per WA DFI alert and confirmed by SEC EDGAR profile):** Both **DSJ Exchange PTY Ltd** (the SEC Form D filer, see fake-license entry above) and **BG Wealth Sharing, LLC** (the LLC name promoted in the Vietnamese-language Zoom broadcast — see `evidence/zoom/`) are registered in Colorado. WA DFI states the addresses on the Colorado SOS filings "do not appear to be legitimate places of business," noting BG Wealth Sharing provided "a generic PostNet address." Co-located shell registrations in Colorado are themselves an attribution signal: same operator-shell-vendor pattern across both legal entities.

**Fake SEC license claim — VERIFIED FRAUDULENT** (advertised to victims via in-app announcements):

> "Good news: DSJEX successfully applied for a SEC license from the U.S. Securities and Exchange Commission on July 11, 2025. CIK: 0002076856"

EDGAR confirms the CIK is real but the "license" framing is fraudulent:

| EDGAR field | Value |
| --- | --- |
| Company name | **DSJ Exchange PTY Ltd** |
| CIK | 0002076856 |
| Filings on record | **1** total — Form D, dated 2025-07-11 |
| State of incorporation | Colorado |
| Mailing address | 3190 SOUTH VAUGHN WAY, AURORA, CO 80014 |
| SIC code | (blank — no business sector claimed) |

**Form D is a notice of an EXEMPT (i.e., unregistered) securities offering under Reg D.** It is *the opposite of a "license"* — you file it precisely to claim *exemption* from SEC registration requirements. The filing is the SEC equivalent of writing yourself a permission slip; SEC reviews are not part of the process and the agency does not "issue licenses" through Form D. The Aurora CO address is almost certainly a registered-agent shell. **The advertised SEC-license claim is therefore a verified misrepresentation actionable as securities fraud (15 U.S.C. § 77q(a)).**

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
