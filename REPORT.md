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

### 2.2.1 ZachXBT-Attributed Operator Cluster (independently published 2026-05-05)

The on-chain investigator known as ZachXBT publicly published a partial operator-wallet list for the DSJEX/BG cluster on 2026-05-05 (`x.com/zachxbt/status/2051645845993648517`). His investigation tracked **$92M+ moved across chains between 2026-04-27 and 2026-05-03** and triggered a coordinated freeze of **$41.5M+** (Tether: $38.4M; other services: $3.1M). Per his summary: **$63M routed to Cobo (custody)** and **$30M to OKX-linked addresses** as downstream off-ramps. The seven addresses below were captured from his post on 2026-05-07 and verified by this investigator:

| Chain | Address | Created | Current state | Tether blacklist |
| --- | --- | --- | --- | --- |
| TRON | `TGTWYCJxhvrDkZc4pyugBAnc4qWeXdXJdF` | 2026-03-28 | drained (0 TRX / 0 USDT) | free (not currently blacklisted) |
| TRON | `TBsjjfnBi5mW3soFmSVFK1pAD5Jbwrbjcg` | 2026-03-28 | drained (0 TRX / $3 USDT) | free |
| TRON | `TWF1bcuNLXtwQCRxb6Qn6uKqWCuXRatiei` | 2026-04-04 | drained (218 TRX / $0.43 USDT) | free |
| Ethereum | `0xf3bd39870d26cfdcdc582ed02b97f74e19e0ee97` | (pre-existing) | drained (0 ETH / 0 USDT) | free |
| Ethereum | `0x35c752ddbd5a5f23482141fab42f943c52ba9adb` | — | drained (0 ETH / 0.01 USDT) | free |
| Ethereum | `0x7a22c5d74f90515ed5834b237b6f8f865c543a66` | — | drained (0 ETH / 0 USDT) | free |
| Ethereum | `0x78255cFa63A3b49b742Cbc9aDb36aF926d3cdA90` | — | drained (0 ETH / 0.01 USDT) | free |

**Observations:**
- All 7 addresses are validated and confirmed associated with the DSJ/BG cluster by an independent investigator (ZachXBT) using methodology distinct from this report's.
- All 7 are currently drained — funds passed through and out, consistent with ZachXBT's $92M-laundered-in-a-week finding. The freeze action ($41.5M) caught roughly 45% of the laundered total; the remainder reached Cobo / OKX before the blacklist could land.
- None of the 7 are currently on Tether's blacklist contract — confirms ZachXBT's reporting that the freeze targeted *later-stage* consolidation addresses further downstream, while these mid-stage flow-through wallets had already been drained.
- The 3 TRON addresses were created **2026-03-28 / 2026-04-04** — i.e. *after* the original `TYwaXc4...WLu` hot wallet was retired (2026-03-23 12:35 UTC, see below). These are the **next-generation operator hot wallets** following our documented rotation cutoff. Independent corroboration of the operator's ~4-day rotation cadence.
- **Cross-attribution: this investigator's evidence (March hot wallet `TYwaXc4...WLu` + 5 named next-hops in §2.2) and ZachXBT's evidence (these 7 addresses, plus the larger laundering cascade through Tokenlon, Bridgers, Butter Network, USDT0 / USDD bridging) describe the *same operator network*** at sequential points in the rotation timeline. Combined: ≥$30M (this investigator) + $92M (ZachXBT) = ≥$122M traceable through the operator wallet structure. Aligns with the ~$150M total figure reported by multiple regulators and BehindMLM.
- **Investigative leverage opens up materially** with this cross-attribution. Any LE referral citing this report can now point to:
  1. Six freeze targets named in §2.2 (now drained but historically transit-traceable for chain-of-custody),
  2. Seven additional freeze targets named in §2.2.1 (ZachXBT-attributed),
  3. Two specific downstream off-ramps (Cobo custody + OKX) which ZachXBT identified as the laundering endpoints — both subpoena-responsive in the US and Asian jurisdictions.

**Cobo + OKX endpoint deposit addresses (ZachXBT-published, this-investigator-verified):**

| Service | Deposit address | Created | Verified inbound USDT-TRC20 | ZachXBT-claimed total |
| --- | --- | --- | --- | --- |
| Cobo | `TFjQWjNkyTJ5xmqy87WBTYaUS7gWzLuWzu` | 2026-04-27 | **$30,059,254** (62 txs) | (sub-portion of $63M total) |
| Cobo | `TD1yXHq8NAPFZN5tCAAsd2HsrYfMuuqGCq` | 2026-04-29 | **$12,857,282** (27 txs) | (sub-portion of $63M total) |
| Cobo | `TMsA7dJpEYJ8r8HCGK7tyAg5NGtJzFWMom` | (unverified) | 0 USDT-TRC20 (presumed cross-chain inbound) | (sub-portion of $63M total) |
| Cobo | `TN5YhGsCBPZSi3ATUp2G5wht5Wmbumy23o` | (unverified) | 0 USDT-TRC20 (presumed cross-chain inbound) | (sub-portion of $63M total) |
| OKX | `TTV5Dn2tfU16NzrX3HoRuaRWcuLnuboQff` | (unverified) | 0 USDT-TRC20 (presumed cross-chain inbound) | $30M total |

**Verified primary-source: $42,916,536 of USDT-TRC20 inbound** to two of the four Cobo deposit addresses, occurring in the 2026-04-27 → 2026-05-03 laundering window per ZachXBT's tracking. The remaining $20M of Cobo's $63M and the full $30M of OKX's intake presumably routed through the cross-chain bridges ZachXBT named (Tokenlon, Bridgers, Butter Network, USDT0, USDD) — i.e. the funds reached Cobo/OKX via Ethereum or via wrapped-USDD paths rather than direct USDT-TRC20 transfer, which is consistent with sophisticated laundering hygiene.

**Cobo and OKX as compliance-subpoena targets:**

- **Cobo** (Singapore-headquartered custody platform; founded 2017; $20B+ AUM as of 2025; serves institutional clients including exchanges, payment processors, custodians). Both the Cobo entity and individual deposit-account holders are subpoena-responsive in Singapore + US (via MLAT). The four deposit addresses above are the *immediate* identifiers for which Cobo accounts received the $63M; Cobo's compliance team can produce the underlying account-holder identities (KYC required for institutional onboarding) and the destination-of-funds disposal data downstream of those accounts.
- **OKX** (Seychelles-incorporated exchange; aggressive US enforcement-cooperation track record; known to honor Tether freezes and law-enforcement subpoenas). The single OKX deposit address above is sufficient for OKX compliance to produce the corresponding user account identity, login IP history, KYC documents, and downstream withdrawal trail.

**These two service-side subpoenas are the cleanest path to apex-actor identification** in the entire investigation. Operator-controlled wallets can be replaced trivially (rotation cadence ≈ 4 days); Cobo / OKX accounts cannot be — they're tied to KYC documents, banking on-ramps, and persistent identity infrastructure. Whoever holds the accounts that received the $93M is, by definition, **at minimum a launderer-level participant in the operation, plausibly an apex actor**, and very probably named in real-name format on the underlying KYC.

---

**On-chain status as of 2026-05-07** (six weeks post-rotation): the operator hot wallet `TYwaXc4...WLu` and **all 5 named next-hop wallets are fully drained — zero TRX, zero USDT, zero recent activity since 2026-03-23**. Last hot-wallet activity was a clean cascade: final victim drips at 11:50–11:54 UTC followed by full sweep-out at 11:59–12:35 UTC ($30K + $30K + $58,390.40 to next-hops), then dead. Operators completed the entire next-hop laundering cascade in the weeks since. Implication: **the May 2026 rectification fees (12 % of balances) are NOT flowing to the March hot wallet** — operators rotated to a new hot wallet for the current rotation cycle, address presently unknown to this investigator. Capturing the current rotation's hot wallet would require a fresh 2026-May-era victim's authenticated `/api/app/recharge/payment/info` response (same capture pattern used for the March hot wallet identification per `wallet/WALLET_FORENSICS.md`). The cleanest LE path: BonChat-compliance subpoena for the `Stephen03` / `Elena03` / `Amelia` operator-account broadcast histories from 2026-05-02 onward (rectification-broadcast period), which contain or reference the current rotation's deposit-address infrastructure.

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
- **Recruitment / language targeting (multi-cohort).** Operators distribute parallel content streams into multiple diaspora cohorts:
  - **English** — primary cohort (US/UK/AU). Recruitment via Telegram, WhatsApp, social DMs; main YouTube channel `BG wealth sharing LTD`.
  - **Vietnamese** — Cynthia Tran (LV7) + Lien Tran (LV7) recurring Wed/Fri Zoom presentations targeting Vietnamese diaspora across CA/TX/FL/NY/Vietnam/France (`evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`).
  - **Hindi** — `bg-wealth-sharing-six.vercel.app` recruitment landing page; `BG Wealth India` YouTube channel.
  - **Mandarin / Chinese-diaspora** — operator timezone-coordination ("Eastern Time trading signals"), Chinese hosting backend (Tengine on `bg6988.com`), Chinese-language LLM-narrated explainer video.
  - **Spanish — confirmed 2026-05-07** in the bilingual EN/ES extension-notice broadcast (`evidence/bonchat/extension-notice-broadcast-2026-05-07.txt`). Hispanic-diaspora victim cohort previously not documented; targeting confirmed by full Spanish translation distributed alongside the English text in the same BG-015 cell broadcast.
  - **Tagalog (Filipino) — confirmed 2026-05-07** in a victim-authored warning being broadcast inside the BG community (`evidence/victim-reports/withdraw-kicked-warning-tagalog-2026-05-07.txt`). Filipino-diaspora victim cohort. The Philippines SEC has an active advisory against BG Wealth Sharing (§5); this Tagalog-language warning being posted by a victim shows operator information-control is failing inside that cohort. Brings documented language-targeted cohorts to **six** (English / Vietnamese / Hindi / Mandarin / Spanish / Filipino).
- **Recruitment** (broadcast / outreach): Telegram, WhatsApp, social DMs.
- **Operational signal-code delivery (live-confirmed): BonChat ONLY.** The "trading signal codes" that victims paste into the rigged UI are sent exclusively via BonChat. Operators specifically push victims into BonChat — and out of mainstream channels — once they're past the initial recruitment funnel. This deliberate channel split (open recruitment → closed signals) is itself a high-confidence operator-attribution signal, and it explains why subpoenas of Telegram/WhatsApp turn up recruitment chatter but rarely the rigged-trading evidence.
- Confirmed Telegram recruitment channel (reported for abuse): `t.me/+fyRGxnhsEKkwYzg5`.
- **BonChat is confirmed as the recruitment vector for this specific case.** the test account was opened by a third party who received the registration link via BonChat. BonChat use is itself an indicator on the WA DFI alert and BehindMLM reporting — operators specifically push victims into it because it resists subpoena.
- **BonChat as victim-control infrastructure (per dehek.com investigation).** The platform is used not just for signal delivery but for **active surveillance and silencing**: operators monitor member messages, block screenshots in-app, and require victims to provide a "reason" before withdrawals — those who try to speak out or refuse are muted or removed from the channel. BonChat is a low-uptake messenger by design — chosen because it offers minimal transparency around message retention while giving operators central conversation control.
- **Captured information-control playbook — operator-authored, primary-source (preserved at `evidence/bonchat/anti-fraud-tips-broadcast-2026-05-05.txt`).** Operators broadcast a "BG Anti-Fraud Tips" notice to every cell on 2026-05-05 that simultaneously instructs victims to (a) conduct all financial activity only on DSJEX (lock-in), (b) communicate only through BonChat — *"any other social media platform is a scam"* (channel lock-in), (c) refuse to share unfamiliar links unless from LV7+ trusted promoters (information suppression), (d) refute and suppress *"any false information about BG and DSJEX"* — explicitly designed to neutralize regulator advisories, public investigations, and any victim raising concerns, and (e) actively *"defend the integrity, development, and long-term plans of BG and DSJEX"* — recruit victims as defenders against criticism. **All five mechanisms are textbook information-control indicators** (cf. the BITE Model of Authoritarian Control). The notice is a self-ironic admission: every "anti-fraud tip" the operators issue is a description of a control they themselves apply.

- **Captured operator pitch deck (2026-05-05; preserved at `evidence/ppt/BG-Wealth-Sharing-recruitment-deck.pptx`, also as `.pdf`, with extracted transcript at `transcript.json` and per-slide PNG renders at `evidence/ppt/slides/`).** 34-slide PowerPoint marketing deck distributed by operators with explicit instruction to print and use for in-person friends-and-family recruitment. Every slide is a fraud predicate. Highlights, with verifiable status:

  | Slide | Verbatim claim | Verified status |
  | --- | --- | --- |
  | 1 | "Invest once in DSJ Exchange and benefit for a lifetime" | Tagline; advertising language |
  | 4 | "DSJ Exchange holds licenses from more than 30 countries and regions worldwide, including: US (SEC), Australia (ASIC), Monetary Authority of Singapore (MAS), Dubai Financial Services Authority (DFSA), Central Bank of the Bahamas" | **All FALSE.** ASIC has issued an *investor alert* against DSJEX (opposite of licensing). SEC has only the single 2025-07-11 Form D filing, not a license. MAS / DFSA / Central Bank of the Bahamas show no DSJEX entries in their public licensee registers. Materially false statement to retail investors. |
  | 5 | "signal trading accuracy rate of up to 99.6%" + "Members who join the team can guaranteed stable returns by following Professor Stephen every day" | Quantified guaranteed-return claim, securities-fraud predicate. |
  | 7 | "DSJ exchange platform holds an Australian license and is directly regulated by the Australian government." | **FALSE.** ASIC issued an alert; never licensed DSJEX. |
  | 10 | "April 13, 2025, BG Wealth Sharing Fund Company was officially approved by the Colorado Secretary of State, and obtained legal license certification with a capital injection of US$70 million." Slide displays a **"CERTIFICATE OF DOCUMENT FILED"** from Colorado SOS. | The Colorado SOS does not issue investment licenses. The displayed certificate is a generic LLC formation receipt (~\$50 paperwork). The "$70M capital injection" claim is fabricated theater. Per WA DFI, "addresses used on the Colorado Secretary of State filing for BG Wealth and DSJ do not appear to be legitimate places of business." |
  | 14 | Slide displays a **forged "U.S. Securities and Exchange Commission" certificate** for "DSJ Exchange PTY LTD" with CIK number, claiming SEC license. | **Forgery.** SEC EDGAR confirms CIK 0002076856 has *one* filing total (Form D, 2025-07-11, an exempt-offering notice — the opposite of a license). SEC does not issue certificates resembling the displayed image. |
  | 15 | "On August 15, 2025, BG Wealth Sharing LTD was honored to announce its successful obtaining of a U.S. RIA (Registered Investment Advisor) license." Slide displays a **second forged "U.S. Securities and Exchange Commission" certificate**. | **Verifiable in SEC IAPD** (`adviserinfo.sec.gov`). If "BG Wealth Sharing LTD" does not appear in IAPD, the claim is a documented false statement actionable under the Investment Advisers Act anti-fraud provisions (15 U.S.C. § 80b-6). |
  | 17 | MLM compensation table: $500/$25/$25, $1000/$100/$50, $3000/$300/$150, $5000/$500/$250 (recharge / referrer bonus / newcomer reward). "If a friend invited by the spokesperson joins and their first recharge reaches 500 USDT, both the Spokesperson and the new member will receive an additional special training signal bonus." | Direct documentary evidence of MLM compensation tied to investment recruitment — pyramid-scheme indicia under FTC *Wholesale* doctrine. |
  | 20 | "If you successfully invite 5 new friends to join, and each of them invests more than $300, you will be promoted to Level 1 Manager and receive a $100 promotion bonus." | Tiered MLM promotion explicitly tied to recruitment volume. |
  | 21 | "If you invest $1,000, 2 days of signal trading can help you realize a profit of $65. If you invest $3,000, you might get $195 in profit." | Quantified guaranteed-profit projections. |
  | 25 | 5-phase escalating-bet "loss recovery" structure: $5 → $15 → $45 → $135 → $405 (LV01); $10 → $30 → $90 → $270 → $810 (LV02). | **Martingale gambling fallacy** dressed as a trading method. Mathematically a guaranteed-loss strategy under any non-trivial loss rate. The "we have 99.6% accuracy so failure is unlikely but here's a 5-phase recovery if it happens" framing is internally contradictory. |
  | 26 | "1.3% Daily Return" (2 fixed signals), "2.6% return" (2 + 2 additional signals), "5.2% Daily Return" (2 fixed + 6 additional signals on $3,000 funds). | Multiple specific quantified return rates promised. |

  Combined with all prior captured broadcasts, the pitch deck establishes **forgery of regulatory documents** (15 U.S.C. § 78j(b) Securities Exchange Act anti-fraud + 18 U.S.C. § 1343 wire fraud + state criminal-document-forgery statutes) as an additional charging avenue, separate from the offering-fraud predicates already documented. **The forged SEC certificates on slides 14 and 15 are independently chargeable as document forgery whether or not anyone deposited money.**

- **Captured MLM-recruitment manual + KYC-impersonation withdrawal-block (2026-05-05; preserved at `evidence/bonchat/mlm-recruitment-manual-broadcast-2026-05-05.txt`).** Operators distributed a coaching document to existing members containing **the strongest single securities-fraud predicate captured to date** — verbatim: *"As long as you follow Professor Stephen's trading method, the BG team will 100% guarantee your profit."* An unconditional written guarantee of investment profit, distributed to retail victims, by operators of an unregistered investment offering, satisfies 15 U.S.C. § 77q(a) on its face. Notable additional content:
  - **Recruitment-as-moral-duty framing.** Two "principles" required of all members: "Respect" (= obligation to reply promptly, keeping victims available for operator outreach) and "Gratitude" (= obligation to actively recruit — *"take the initiative to share... invite more people to join"*). Refusing to recruit is structurally framed as betrayal of the group, classic MLM coercion.
  - **KYC-impersonation withdrawal-block.** *"All users will be subject to identity verification when using a new wallet address for the first time to withdraw funds. The BG team will contact you for confirmation."* Operationally serves three operator goals: (a) harvest additional PII at the withdrawal-attempt moment when victims are most motivated to comply, (b) manufacture an indefinite delay window, and (c) flag and block withdrawals to forensically-traceable destinations (exchange-deposit wallets, attorneys, fraud-recovery escrows).
  - **Wallet-change approval gate.** Victims must "contact the head of the BG team" before changing destination wallet — preventing rerouting to operator-disapproved (i.e. clean) addresses.
  - **PPT (PowerPoint) materials referenced** — operators distribute a printable presentation deck with "core concept, development opportunities and income model" for offline / in-person recruitment of friends and family. Confirms the Chinese MLM offline-evangelism overlay on the BonChat / Zoom funnel.
  - **Recruitment soft-skills coaching** — second half of the notice provides structured sales-script training ("build trust, thorough preparation, focus, real stories, sincere attitude") for member-to-recruit conversations. Operators are professionalizing the recruitment role, turning members into trained sales agents — strengthening the §3.4 promoter-complicity argument.

- **Captured recruitment / onboarding script — operator-authored (preserved at `evidence/bonchat/recruitment-script-broadcast-2026-05-05.txt`).** Operators distributed a step-by-step recruitment funnel to existing members for onward use with prospective victims. Key operational details captured verbatim:
  - **Investment range advertised: $500–$5,000** with "professional guidance from Professor Stephen Beard."
  - **Multi-asset deposit requirement:** *"Purchase equal amounts of USDT, BTC, and ETH"* — operators force three-chain deposits, defeating fiat chargeback (BTC irreversibility) and creating three on-chain forensic surfaces per victim.
  - **BonChat platform: `bonchat.live`** — primary subpoena target for compliance data on the BG2606 server, the Elena03 / Stephen03 / Amelia accounts, and the full victim contact graph.
  - **Phone-tied registration:** SMS-verification onboarding means each victim's phone number is in BonChat's registration database — making an Elena03-contacts subpoena equivalent to a phone-number list of the entire victim cohort.
  - **Operator business hours:** group closes 11pm ET, reopens 10:30am — operator-imposed window limiting when victims can raise concerns, plus legitimate-business theater.
  - **Recruitment-layer complicity:** because the script is distributed to existing members for them to forward to recruits, every member who onboards a downline becomes a knowing distributor of the unregistered-investment-offering terms — additional wire-fraud predicates per §3.4 promoter, parallel to the rectification-notice complicity vector.
- **BonChat channel architecture (live capture 2026-05-05).** Group naming follows a numbered-cell convention — observed example: `BG-015 Wealth Sharing Investment Group` — within a parent **server**. The operator runs **at least nine distinct BonChat servers** for BG Wealth Sharing alone (per a server-migration broadcast preserved at `evidence/bonchat/server-migration-broadcast-2026-05-05.txt`): `BG2022`, `BG2026`, `BG2601`, `BG2602`, `BG2603`, `BG2604`, `BG2605`, `BG2606` (current), `BG3666`. The operator was migrating to `BG2606` as of 2026-05-05 to "align with BG Wealth Sharing's Eastern Time trading signals" — i.e. signal broadcasts are scheduled around US Eastern Time, confirming primary US targeting (jurisdictionally relevant). The `BG-015` cell-group sits inside the active server and is the "Official designated group". Channels are configured **"Prohibit to pin messages"** — read-only / broadcast-only mode where only the operator account can post or pin, eliminating any victim-to-victim cross-talk that might surface complaints.
- **Operator account handles (live capture 2026-05-05):**
  - **`Stephen03`** (display name `BG-Stephen Beard`) — the broadcast account behind (a) the rotation domain pairs ("DSJEX Latest Login URLs"), (b) the rigged-trading signal codes (Order Codes), and (c) operator-authored tutorial screenshots. The same on-camera figure used in BGW promotional content (§3.2) appears as the channel avatar.
  - **`Elena03`** — second operator persona, identified as an "Official account" alongside Stephen03 in the 2026-05-05 server-migration broadcast (preserved at `evidence/bonchat/server-migration-broadcast-2026-05-05.txt`). Likely a parallel front-name fronting another language cohort or another operator shift; full role currently unresolved.
  - **`BG - Group Management Amelia`** — third operator persona, role: "Group Management" / cash-collection / accounting layer. Distinct from Stephen03 and Elena03. Avatar: a young woman; the photographic identity is presumably another paid-front-man hire on the same 白工 / CGTN-archetype pattern as Stephen Beard (§3.2). Documented role observed 2026-05-05: posting victim-supplied USDT-transfer confirmation photos to the BG-015 channel as **public proof-of-payment for the 12 % "rectification" fee**, plus textual confirmations in the form `Member ID: u<NNN> / Amount of taxes paid: $<NNN>`. This serves both as accounting and as **social-proof / peer-pressure** to push other victims into compliance.

  - **Operator role-split (definitive, per `evidence/bonchat/anti-fraud-tips-broadcast-2026-05-05.txt`):**
    - **Elena03 = onboarding / intake / DSJEX-activation gateway.** The notice instructs new members verbatim: *"New members should add Elena03 to activate their DSJEX account first, and then add Stephen03."* Elena03 is therefore the **single highest-value subpoena target for victim-list discovery** — her contact list is, by operator design, an enumeration of every onboarded victim. (Earlier draft said Elena03 was a "parallel signal-broadcast role"; corrected here to onboarding/intake.)
    - **Stephen03 = ongoing signal broadcasts** (Order Codes, rotation domains, tutorial screenshots, exit-scam advocacy theater per §4.7).
    - **Amelia = cash collection / proof-of-payment accounting** (per `rectification-payment-confirmation-2026-05-05.jpg`).
    - **LV7+ promoters = trusted lateral content layer.** Same notice: *"leaders at level 7 and above may share lecture videos or links."* This is structural confirmation that the §3.4 LV7+ promoter cohort (Cynthia Tran, Lien Tran, allegedly Sarkaria) operates as the operator-trusted middle-management bridge between operators and victims — they are the only non-operator accounts permitted to distribute external content within BonChat groups.
  - The `03` suffix shared by Stephen03 and Elena03 is suggestive of an internal numbered-persona scheme. Whether any of these three accounts is operated by the on-camera figure personally or by other operators using their names is unresolved — but brand cohesion is direct: the front-man identities are also the broadcast-channel identities.
- **Captured signal code (live, 2026-05-05 15:45 operator-timezone):** `1M7VIGSCR` — pinned by `BG-Stephen Beard`. Format is 8–9 alphanumeric characters. Operator-posted tutorial screenshots elsewhere in the same channel show victims (a) transferring USDT into the platform "Trade" wallet and then (b) pasting the signal code into a UI button labeled **"Order Code"** to "execute" the rigged trade. This is the closed-loop mechanism by which the platform produces fake P&L on a deterministic schedule.
- **Primary evidence screenshot:** `evidence/bonchat/bonchat-broadcast-2026-05-05.jpg` (iPhone status bar cropped). Shows the `BG-015 Wealth Shar…` channel header, the `BG-Stephen Beard updated pinned messages → 1M7VIGSCR` banner, the `DSJEX Latest Login URLs: yti355.com / yti351.com` broadcast (timestamp 15:35), the two operator-supplied tutorial screenshots (Funds-Transfer flow + the `Order Code` UI button, both at 15:37), and the second pinning of `1M7VIGSCR` at 2026-05-05 15:45. Source: a test account observer; viewer-side identifying elements (status bar, profile UI) are not in frame.
- **Captured Zoom infrastructure (BonChat broadcast 2026-05-05, preserved verbatim at `evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`).** The same closed BonChat channel that delivers signal codes and rotation domains is also used to broadcast recurring **Zoom presentation invitations**. The captured invitation is for a Vietnamese-language presentation series operating on a Wed + Fri schedule across CA/TX/FL/NY/Vietnam/France time zones. **Meeting ID `857 8897 8544`, passcode `11118888`**, host platform `us06web.zoom.us`. The presenter is Cynthia Tran (LV7); co-hosts are Lien Tran (LV7), Katrina Tran (LV6), Vivian HaChau PhamVo (LV3) — see §3.4.2. **Subpoena value:** Zoom's compliance team is responsive to law-enforcement subpoenas; the host account behind `857 8897 8544` is tied to a real billing identity (email + phone + payment method), meeting recordings are retained per the host-account retention setting, and attendee logs include each connected account's email or phone. This is the cleanest path to linking the named promoters to real legal identities and to documenting the verbatim pitch-deck claims (see §4) made to recruits.
- **Securities-fraud-actionable claims captured verbatim** (from the same broadcast — these are *direct quotations of the promoters' own pitch*, which is the strongest possible foundation for a securities-fraud filing): "1.8% daily profit", "capital doubles in 60 days", "AI Software with 99.6% win rate. But BG guarantees 100%", "Level-up bonuses $100 – $2.0M", "Monthly dividends $90 – $1.0M", "No participation fee", "Same-day withdrawals", "$100 Birthday Gift". Promised-returns-with-guarantee + retail-marketing recruitment satisfies the standard predicate elements for an unregistered-securities-offering charge under most Western jurisdictions.

- **Captured exit-scam / advance-fee-tail broadcast (2026-05-02).** Preserved verbatim with forensic annotations at `evidence/bonchat/rectification-notice-broadcast-2026-05-02.txt`. Operators issued a mass BonChat broadcast falsely titled "Important Announcement" claiming a "DSJEX IPO review" had been "temporarily suspended" pending "regulatory rectification," and demanding **12 % of each victim's account balance** as a fake "tax settlement" within a 5-business-day window. Worked examples in the broadcast: "$500 → $60", "$1,000 → $120", "$5,000 → $600". Withdrawals were simultaneously suspended ("During the rectification period, all DSJEX accounts will: Have withdrawals suspended"). Victims were instructed to remit the 12 % to their "team assistant" — i.e. their MLM upline. Every substantive factual claim in the notice is provably false: there is no DSJEX IPO; no regulator has ordered rectification; the funds will not be returned. The notice is the textbook execution of the advance-fee tail flagged in the WA DFI alert (March 2026: "A company that requires an investor to deposit additional external funds in order to withdraw their investment is highly likely to be operating an advance fee scam."). **Each promoter who relayed this notice to their downline and accepted the 12 % payment becomes a direct co-target under wire-fraud statutes, separate from any scheme-promotion theory.**
- **Captured cash-collection / proof-of-payment broadcast (2026-05-05; preserved at `evidence/bonchat/rectification-payment-confirmation-2026-05-05.jpg`).** Direct visual evidence of operator `BG - Group Management Amelia` (§2.4) posting (a) a victim-supplied photograph of their phone showing a USDT transfer confirmation **"Sent $222.16 of USDT, May 3 2026, 4:23 PM, Status: Complete"**, (b) the same victim's DSJEX assets-page screenshot showing total balance **6422.54 USDT** (Exchange 724.18 / Trade 5698.36) with URL-bar domain **`tra818.tw`** *(new rotation domain in the `tra{N}.tw` pattern, added to watchlist)*, and (c) Amelia's own text broadcast confirming "Member ID: u558356 / Amount of taxes paid: $724." Platform-internal user-ID format `u<NNN>` documented.

- **Continued cash-collection captured 2026-05-07 — ETH-side payment** (`evidence/bonchat/cash-collection-eth-payment-2026-05-07.jpg`). Second proof-of-payment broadcast captured two days after the original; operators are still collecting rectification fees post the May 6 deadline expiry. This payment was made via **Ethereum (0.2548759 ETH ≈ $601.88, Status: Success, dated 05 May 2026 12:20)** — confirming the §4 multi-asset deposit pattern: rectification fees flow on USDT-TRC20, BTC, and ETH chains in parallel. Operator broadcast text: "Member ID: u78192053 / Withdrawal amount with taxes paid: $601" — note the operator's twisted framing of the *outbound rectification fee* as "withdrawal amount with taxes paid," conflating tax payment with withdrawal eligibility (which the May 7 Tagalog victim warning at `evidence/victim-reports/withdraw-kicked-warning-tagalog-2026-05-07.txt` confirms is false). Member-ID format `u<6-8 digits>` extended (vs. the §2.4 6-digit `u558356`); user-ID space is sparse, suggesting either tens of millions of accounts created (likely inflated by registration spam) or non-sequential ID assignment. The operator-side ETH deposit address + on-chain TX ID are blurred in this artifact (privacy-redacted by source); **if an unblurred copy surfaces, it identifies the current ETH-rotation operator-receiving wallet** — first concrete forensic handle on the post-March operator infrastructure (cf. §2.2 note: original March hot wallet `TYwa...WLu` and all five named next-hop wallets are fully drained as of 2026-05-07).

- **Captured "drip-restoration" follow-up broadcast (2026-05-05; preserved at `evidence/bonchat/restoration-notice-broadcast-2026-05-05.txt`).** Three days after the rectification demand, operators broadcast that — "following multiple rounds of communication and coordination between Professor Stephen Beard and DSJEX staff" — withdrawals will be "gradually restored" to victims who paid the 12 %, with "normal withdrawal channels fully restored on May 7th." This is the textbook **second beat of the exit-scam playbook**: keep payers hopeful (so they don't file complaints) while pressuring non-payers to also pay before the May 7 deadline. The notice further deploys the "Stephen Beard" front-man persona as a fake "advocate" who has supposedly negotiated rights for victims with the imaginary "DSJEX staff" — theatrical separation between two halves of the same operator. Predicted outcome on May 7: either operators absconding, a small number of token withdrawals as social proof, or an additional fee layer ("clearance fee", "verification fee"). **Each operator-authored broadcast is a separate wire-fraud predicate.**

The complete exit-scam cycle, all primary-sourced and time-stamped, in chronological order:

| Date (ET) | Broadcast | Mechanism | Artifact |
| --- | --- | --- | --- |
| 2026-05-02 | "Rectification" demand (12 % of balance, fake regulator pressure) | Initiate advance-fee extraction | `evidence/bonchat/rectification-notice-broadcast-2026-05-02.txt` |
| 2026-05-03 | Victim transfers $222.16 USDT (one captured example) | Cash collection (in flight) | inset within 2026-05-05 .jpg |
| 2026-05-05 | "Amelia" posts proof-of-payment + receipt confirmations | Social-proof pressure on non-payers | `evidence/bonchat/rectification-payment-confirmation-2026-05-05.jpg` |
| 2026-05-05 | "Drip-restoration" announcement | Keep payers hopeful + final pressure on holdouts | `evidence/bonchat/restoration-notice-broadcast-2026-05-05.txt` |
| 2026-05-07 (observed) | Recycled rotation domains broadcast + bilingual EN/ES extension notice + signal code `1MCIJPUSU` | Operators continue extraction; outcome (1) ruled out, outcome (3) confirmed (continued advance-fee tail with deadline extension) | Broadcast preserved at `evidence/bonchat/extension-notice-broadcast-2026-05-07.txt`; rotation URLs `yzzq657.cc`/`yzzq919.cc` rebroadcast to BG-015; operators **self-admit** "majority of members were unable to complete the required procedures by the original May 6 deadline"; deadline extended to **2026-05-09 23:59 ET** with bilingual Spanish broadcasting to a previously-undocumented Hispanic-diaspora victim cohort; new operator-claimed financial-backing figure of "£40 million guarantee from DSJEX" added on top of the pre-existing fabricated "£30M + $70M" claims; live signal code `1MCIJPUSU` captured (second timestamp on the rigged-trading Order Code mechanism after `1M7VIGSCR` on 2026-05-05) |
| 2026-05-07 (continued) | First-hand victim warning circulates inside BonChat in Tagalog: paid 12 % → tried withdrawal → kicked out → lost balance. *Operator's drip-restoration promise verified false in real time by community observation.* | Confirms scenario 4: pay-then-kicked exit. Operators' info-control cracking — at least one victim breaking silence to warn others. | `evidence/victim-reports/withdraw-kicked-warning-tagalog-2026-05-07.txt` |
| 2026-05-09 23:59 ET (predicted) | Either further extension, full exit-scam pivot, or rebrand-migration announcement | Cult-rhetoric closing line *"this is not the end — it is a selection, a reconstruction, and a true beginning"* foreshadows successor-brand migration. Watching for a "BG → [next brand]" pivot announcement on or around May 9. | (pending capture) |

**May 7 outcome — operators continue with deadline-extension + Spanish-language broadcast targeting (continuing advance-fee tail).** Two days after the promised "full restoration on May 7th" date, operators broadcast updated login URLs in the BG-015 BonChat channel: `yzzq657.cc/h5/#/assets` and `yzzq919.cc/h5/#/assets`. Both domains are **recycled** — they were registered 2026-04-25 (per WHOIS) and originally went live shortly after. Operators are rotating *previously-burned* domains back into active use rather than registering new ones at the same cadence as the 2026-04-25 / 2026-04-27 burst. Both URLs serve the same SPA bundle build (`1777092729882`, May 5 18:14 UTC) captured in our original `tra809.tw` reverse-engineering — meaning **the entire §2.4 RE remains valid against this week's rotation** (AES key `dapp-20230831abc`, signing salt `VCExhhw…`, 50-endpoint catalog all unchanged). Watchlist scan confirms most operator infrastructure (VCEX `vcexpro.com/vcexin.com`, NEXO `nex.afirrmjob.com`, the 13 BG2606-rotation domains, Sarkaria's `bggracefulwealth.com`, CR Group's `crglobal.com`, the SmartMoneyProject promoter SaaS) still HTTP 200. The platform is not dead; it has shrunk into a maintenance / cash-collection mode pending whatever the next rebrand is. Worth watching: `bg6988.com` (advertised in the 2026-05-05 recruitment script as the "BG Group website") is now serving from a **Tengine** server (Alibaba's nginx fork) on `43.174.246.54/247.54` — a Chinese-hosting fingerprint distinct from the Cloudflare-fronted rotation fleet, indicating the operators' "official-stable-website" layer is on Chinese infrastructure separate from the disposable rotation domains.
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
  - **Captured Stephen Beard video — direct prima facie wire-fraud evidence (`evidence/video/`):** A 6.5-minute video titled **"MSG By Professor Stephen Beard 03-05-2026"** was uploaded to YouTube channel **"BG Wealth India"** (`youtube.com/@BGWealthIndia-z9o`, channel ID `UCwpOuwQ13qNus-J96aP0EzQ`) on **2026-05-02** — the *same day* the rectification fraud notice was broadcast in BonChat (§4.7). Beard delivers the rectification justification on camera, on the record. Preserved at `evidence/video/`:
    - `stephen-beard-msg-2026-05-02.webm` — the full video (9.5 MB)
    - `stephen-beard-msg-2026-05-02.transcript.txt` — verbatim transcript (839 words, machine-extracted from YouTube auto-captions)
    - `stephen-beard-msg-2026-05-02.metadata.json` — channel/upload metadata for subpoena
    - `stephen-beard-msg-2026-05-02-frame-{01,03,05}m.jpg` — frames at 1 / 3 / 5 minute marks for face/setting analysis
    - **Confirmed: same executive-office set as `stephen-beard-zoom-still-full.jpg`** — same shelving, same eagle-seal certificates, same lighting, same suit. The video and the earlier Zoom still are recordings from the same room.
    - **Forensically critical statements in the video** — paraphrased + direct quotes (full text in transcript file):
      - *"Hello everyone, this is Stephen as usual."* — confirms Beard is a recurring on-camera persona, not a one-shot prop hire.
      - *"DSX right now has officially entered the crucial stage of IPO preparation and has introduced a relevant auditing department to conduct a systematic review for the entire platform."* — **knowingly false statement**. There is no DSJEX IPO. There is no external audit. SEC EDGAR shows only one filing (Form D, 2025-07-11). **Wire fraud predicate (18 U.S.C. § 1343) on its face.**
      - Fabricated "70% of cases" statistic invented to justify the universal 12 % tax: *"this situation accounts for over 70% of cases and is distributed across various teams."*
      - Direct demand for the 12 % tax with a worked example: *"if your account has 50,000 dollars, you will need to pay 6,000 for the tax."*
      - **Pre-emptive rebuttal of the obvious victim question** ("why can't it be deducted directly from the account?") with a fabricated explanation about "external audit department requiring verifiable, traceable, recordable data." Pre-rebuttal of suspicion is itself textbook intent-to-defraud evidence — operators knew the demand would seem suspicious and prepared a script to defend it.
      - False promise of refund: *"the funds you paid during the rectification period can be withdrawn normally after the audit is completed."* — provably false; no refund mechanism exists.
      - Closing psychological pressure: *"isn't a time to choose, but a time to cooperate, not a time to observe, but a time to execute."*
    - **Operator YouTube channel #1 surfaced:** `BG Wealth India` (`UCwpOuwQ13qNus-J96aP0EzQ`, `youtube.com/@BGWealthIndia-z9o`) — previously undocumented operator-controlled channel, India-targeted (matching the §2.1 Hindi recruitment landing page on Vercel). YouTube/Google compliance can be subpoenaed for the channel's billing identity, login IPs, upload history. **22,830 views in 4 days** establishes meaningful audience reach.
    - **Operator YouTube channel #2 surfaced (parallel rollout 2026-05-02):** `BG wealth sharing LTD` (`UC9sqbcTJnLl9skaYlZBB2FQ`, `youtube.com/@BG-wealthsharingltd`) — second operator-controlled channel, generic-branded. Hosts an LLM-scripted, TTS-narrated, stock-animation-template explainer video preserved at `evidence/video/bg-wealth-explainer-2026-05-02.mp4` (+ transcript + metadata). The video does NOT feature Beard on camera; it is mass-produced marketing material. Same upload date (2026-05-02) as the Beard video on channel #1 confirms operator coordinated multi-channel rollout. Notable additional fraud predicates from the explainer transcript:
      - **"DSJ exchange is ISO 27001 certified"** — independently verifiable false claim. The ISO maintains a public certified-organizations register. DSJ Exchange is not certified.
      - **"BG and DSJ have maintained a fruitful partnership for the past 3 years"** — false. UK Companies House records DSJ Exchange Ltd as incorporated July 2024. The BG Wealth Sharing LLC was formed in Colorado April 2025. Three-year history is fabricated.
      - **"300,000 global investors"** — operator self-claimed victim base size. Useful even if inflated, as the operator's own claim of scale.
      - **"99.6% accuracy rate in trading signals"** — same fabricated win rate as the PPT and Vietnamese Zoom invitation.
      - Specific revenue-split claims: investors get "60% to 65% of the trading profits", BG team gets "5% dividend from the exchange's transaction volume", DSJ Exchange charges "35% to 50% commission" — fabricated business model masking the Ponzi structure (no real trading is occurring per §2.2 wallet-forensics).
    - **Effect on Beard's role characterization in §3.2:** the 白工 / paid-foreigner-prop hypothesis weakens substantially. A one-shot prop hire would not record dedicated rectification-justification videos with specific dollar examples, fabricated statistics, and pre-rebuttal scripts. He is delivering operator-authored scripts about specific scheme operations on a specific date — knowing-participant framing is now strongly supported. Whether he wrote the script or read one provided to him is unresolved, but he understands what it says.

  - **Captured "Stephen Beard" follow-up video (2026-05-05) — multi-actor confirmation (`evidence/video/stephen-beard-followup-2026-05-05.mp4` + transcript + frame + metadata).** Same operator YouTube channel `BG wealth sharing LTD` published a second on-camera "Stephen Beard" video three days after the first. Title: *"🚨 OFFICIAL BG ANNOUNCEMENT | Important Message From Professor Stephen Beard This Week."* The man on camera is **filmed in the hotel-room setting** documented earlier (`evidence/persons/stephen-beard-zoom-still-2.jpg`), but his speech pattern is heavily non-native English with broken construction (*"I never left you back or something like that"*, *"everything will be text and calculated properly"*, *"BGL sharing"*) — completely different from the polished American-English delivery in the May 2 executive-office video. Auto-captions transcribe his self-introduction as *"this is Steven"* (not "Stephen"), suggesting either a non-native speaker pronouncing the name or an actual self-correction. **This is direct evidence that "Stephen Beard" is a character played by multiple paid actors, not a single individual.** The operator infrastructure provides the same name and (where possible) the same set, but the human is interchangeable — exactly what the 白工 / disposable-foreign-prop pattern predicts. Notable additional findings in the transcript:
    - **"Our enemies are trying to use this disadvantage to their advantage"** — operators explicitly framing regulators, journalists, and exposed-victims as "enemies." Direct evidence of consciousness-of-fraud.
    - **Mention of "Alida"** in *"do not reply to ... from me from Alida or anyone else"* — possibly a fourth operator persona name (or a non-native-speaker mispronunciation of "Elena" / "Amelia").
    - **Zoom meetings explicitly suspended** for the week, channeling all victim communication into BonChat (further information-control intensification, consistent with the cult-info-control playbook in `evidence/bonchat/anti-fraud-tips-broadcast-2026-05-05.txt`).
    - **Operator admits prior collapses:** *"It's not the first time for BGL sharing to face difficulties like that but definitely we'll overcome them just like we did before"* — operator self-acknowledgment that BG has previously had "difficulties" (i.e. prior takedowns or collapses), consistent with the §3.6 multi-brand operator-family framework where the same playbook recurs under successive brand names.
    - **Two-actor visual match:** the man on camera in this video matches the "hotel-room" still in `evidence/persons/stephen-beard-zoom-still-2.jpg`, NOT the executive-office "Stephen Beard #1." The two stills earlier preserved as "different lighting of the same person" are now confirmed to be **two different humans playing the same character**.

  - **Visual artifacts preserved in this report:**
    - `evidence/persons/stephen-beard-zoom-still-full.jpg` — full-frame Zoom-call still showing the on-camera "Stephen Beard" persona mid-speech in a curated **"executive office" set**.
    - `evidence/persons/stephen-beard-face-for-reverse-image-search.jpg` — tight 990×990 face crop from the executive-office frame, optimized for face-search engines (PimEyes, Google Images, Yandex, TinEye).
    - `evidence/persons/stephen-beard-zoom-still-2.jpg` — second Zoom-call still of the same person filmed from a **completely different location resembling a hotel room** (generic curtain + valance, table lamp, plain wall, TV-style wall mount). Black casual top instead of the navy suit. Lower resolution (still pulled from video).
    - `evidence/persons/stephen-beard-face-2-hotel-setting.jpg` — face crop from the hotel-setting frame for cross-confirmation in reverse-image-search.
    - **Background-set details** (visible in the executive-office full-frame): books with legible spines (*Brooklyn's Finest*, *Century…*, *Marilyn Mon…*, *IDEA AL…*), curated decorative objects (man-with-binoculars statue, abstract figural sculptures, gold trophy/star figures), an eagle-seal framed certificate bottom-right (US-state-style document — could be a genuine state-issued document, a notary commission, or a stage prop), framed diploma top-center, recessed warm under-shelf LED lighting on wood-toned shelving.
    - **The contrast between the two settings is itself forensically significant.** A real "Founder / Professor" of a "global hedge fund" would not film from a generic hotel room. Two-location filming establishes that the "executive office" frame is a **stage** — either a rented production set, a colleague's space borrowed for video days, or a virtual background composited in post. This corroborates the §3.2 reconstruction (paid-front-man / 白工-origin role, not a genuine company-leadership figure).
  - **Investigative leads on this persona:**
    - Reverse-image-search his face — the cropped face JPG is sized for direct upload to PimEyes / Yandex Images / Google Images / TinEye. The same face often surfaces in **CGTN clips, Chinese tourism / business-promotional footage, stock-photo libraries, and other "white-foreigner-prop" gigs.** Aggregating his cross-platform appearances frequently exposes the talent agency that books him.
    - Subpoena recordings of past BGW Zoom sessions (named promoters in §3.4 routinely host them; recordings exist in their accounts).
    - Subpoena Zoom for the host accounts that scheduled BGW recurring meetings — those accounts are tied to real billing emails / phones, which is the cleanest path to his real legal identity without relying on photographic match alone.
    - Subpoena BonChat for the `Stephen03` account (the broadcast-account underlying the on-camera identity per §2.4) — billing identity, IP logs, message history.

  - **Reverse-image-search attempt (preserved for investigator review at `evidence/persons/reverse_search/`).** Both face crops were submitted to Yandex Images CBIR + Google Lens via headless-browser automation (script at `wallet/headless/reverse_image_search.js`). Result summary, framed honestly:
    - **Yandex returned divergent face-tag suggestions for the two stills** — meaning the matches are low-confidence at our image resolution. The executive-office still received a tag set including a public-figure name (a Ukrainian TV journalist); the hotel-room still received a different name set entirely. Google Lens identified only the eyeglasses style on both — no public-person match.
    - **Two competing interpretations**, equally consistent with the data: (a) Yandex's face-recognition is noisy at ≤990 px crops with mixed lighting and is producing low-confidence near-matches that should not be treated as identifications; (b) the on-camera "Stephen Beard" persona is portrayed by **multiple different paid Western actors across different broadcasts** — i.e. "Stephen Beard" is the brand and the human is interchangeable, which is exactly what the 白工 hypothesis predicts.
    - **No specific candidate identity is named in this public report.** The Yandex screenshots are preserved in `evidence/persons/reverse_search/` so that investigators with **professional face-recognition tooling** (PimEyes paid account, Clearview AI, or law-enforcement face-search systems with formal accuracy thresholds) can re-run the comparison with proper validation. Defamation risk on any specific named individual based on a single CBIR match is too high to publish without that confirmation step.
- **"Joseph Smith"** — claimed DSJ Exchange COO. Promo video: `youtube.com/watch?v=dJ9A87PSJhM`. No verifiable identity. Same 白工-origin / paid-front-man pattern likely applies; pending Zoom-presence corroboration to confirm.
- **"Elena" (BonChat handle `Elena03`)** — designated as an "Official account" in the 2026-05-05 server-migration broadcast (`evidence/bonchat/server-migration-broadcast-2026-05-05.txt`), parallel to Stephen03. Previously undocumented in public reporting. No on-camera or biographical material yet observed; persona-vs-real-person hypothesis unresolved.

### 3.3 Developers (commissioned / linked)

- **Navya Kushwaha** ("Techsima") — developer of `Navyakushwaha/DSJ-Exchange` (frontend). Associated with Techsima coding institute, **Uttar Pradesh, India**. Assessed by investigators as a **likely commissioned developer** rather than core operator.
- **Xiaolan Lin** (GitHub: **XiaolanLin808**) — developer of `BG-Wealth_SCript` backend. Per Danny de Hek, **recorded admission of BGW user status preserved**; referrals made to **FBI Honolulu Field Office** and **USACIDC / Army CID** (claimed potential military affiliation / clearance status — to be verified by LE, not by us).

### 3.4 US-Based Recruiters (named in BehindMLM and dehek.com)

Hot regions: **US (UT, GA, TX, OK, WA), Tonga, Samoa**.

Senior promoters / Zoom presenters (publicly named by Danny de Hek's "Avengers" investigation; treat as **alleged promoters**, not convicted):

> Faiana Brown (aka Faithful / Gerald Faiana Brown) — UT/WA; Chanse Carlson — UT; Latanya Jones-Kerr — GA; Marcus & Angela Smith; Thaddious Thomas — TX; Mark & Kim Brown — OK; Yitzhak Morrison; **Cynthia Tran (HồngVân Trần) — LV7** (see §3.4.2); **Lien Tran — LV7**; **Katrina Tran — LV6**; **Vivian HaChau PhamVo — LV3**; Keith Darren Hudson; Tu Tran; Binod Ray; Randy & Sonya Crosby; Arthur Bankston Jr; Oliver Sagala; Gagan Sarkaria (see §3.4.1); Richard & Sumana Chea; Shawn Foster; BeBe Bui; Hang Tran; Sumana Chea; Suli Zinck; Nila Horton; Nhi Vo; Abhimanyu Choudhary; Diem Nguyen; Sheila Pena; Thuy Nguyen; Yen Nguyen; Brenda Parsons; Paea Ika; Daisy Khong; Gam Nguyen; Vicky Quy Ta; Tran Xuan Phuong; Gerry Bhatt; Santosh Bhusare; Anupam Sharma; Annabelle Hazelton; Gary Bhatt; Tony Sia; Ate Juno; Jossie G Gallizia; **Lee Meadows** (Instagram `@leequynhm`, ~23k followers); Bud Ayers; Ben Acorda; Mike Roberson; Sebrena Wilson; Carl Edwards; Cliffton Eichelberger; Betty Raven; Herman Christophe; Carol Roberson; Tyrone Tanner; Charles Sanders; Sandra Reynolds; Nat Montgomery; Beverly Williams; Ben Robinson; Theresia Carty; Monica Robinson; Veronika Wilson; Anthony Ramirez; Kent Robinson; Toyshiana Gaines; Drake Yi; Anthony Bryant; Drew Burton; Emmanuel Bernstein.

**Vietnamese-diaspora targeting cohort (added 2026-05-05).** A BonChat broadcast captured 2026-05-05 (preserved at `evidence/zoom/zoom-invitation-vietnamese-2026-05-05.txt`) names Cynthia Tran, Lien Tran, Katrina Tran, and Vivian HaChau PhamVo as the presenter and co-hosts of a recurring Wednesday + Friday Vietnamese-language Zoom presentation series for BG Wealth Sharing. The four are the first promoters in this report whose **DSJEX in-platform ranks are confirmed by primary-source operator broadcast** (LV7 / LV7 / LV6 / LV3 respectively); the rank schedule in §4.5 implies LV7 status corresponds to ≥1,500 effective recruits.

**Self-published-promoter recruitment funnels (added 2026-05-05).** Some §3.4 promoters operate their own personal-brand recruitment funnels, publicly accessible and not previously documented in the secondary-source promoter dossiers:

- **Steven Rachel** — self-published recruitment YouTube on `youtube.com/@StevenRachel`. Two notable artifacts:

  1. **"BG Wealth Sharing | Inside My DSJ Exchange Account With No Trading Experience"** (`youtube.com/watch?v=gO4Mwq5E4xs`, 2026-03-01, ~14.5K views). Verbatim quote: *"I'm not a trader. I don't analyze charts. I simply copy and paste the trading signals."*

  2. **"Tired Of Changing DSJ Links? Watch This!"** (`youtube.com/watch?v=ymaiK7uBCuE`, 2026-05-01, ~4.5K views). 21-minute walkthrough explaining the BG rotation-domain burn problem and pitching SmartMoneyProject as the BG-promoter workaround. Two especially significant verbatim admissions in this video:
     - **Promoter confession of the rigged-trading mechanism:** *"they're going to actually provide all the parameters of the trade, like the stop loss, all the take profit, all that stuff... they have all the parameters of the next trade, and all you have to do is copy and paste the code that already has the parameters in the back end of that code... that gives them permission. So, when whenever they're ready to do that trade, they already got your permission to actually do it because you you actually manually did that."* This is a textbook confession that the platform pre-determines every trade outcome; the victim's "Order Code" paste is just pre-authorization.
     - **Operator-claimed user base:** *"there's 700 plus thousand people or more inside of BG Wealth."* Different scale from the LLM-explainer's "300,000 global investors" claim — both operator-sourced.
     - **Acknowledgment of domain-burn pattern from the promoter side:** *"sometimes those links stop working, and people get these little weird messages... why are all these people coming in, you know, all of a sudden... it creates some certain issues."*

  - Recruitment funnels (added to watchlist):
    - **`win.steverachel.com`** (title "This System Pays!") — form-based lead capture asking *first name, last name, email, phone, "What Level Are You Starting With?"* — pre-segmenting victims by §4 deposit-tier before pitch.
    - **`bgfunnel.steverachel.com`** — BG-specific funnel subdomain. Same `smartmoneyproject.net`-backed signature.
    - Funnel form action posts to **`smartmoneyproject.net/member/capture-prospect`** with `srachel` as Rachel's per-tenant slug.
  - **`smartmoneyproject.net` = confirmed BG-promoter recruitment SaaS.** Rachel's 2026-05-01 video is essentially a 21-minute SmartMoneyProject pitch packaged as a "Tired Of Changing DSJ Links" tutorial. Title plus description (*"the System I Use To Promote BG"*) plus content unambiguously establish that SmartMoneyProject is BG-promoter infrastructure, not a generic third-party MLM funnel-builder Rachel happens to use. **If multiple BG promoters subscribe (likely given the per-tenant slug architecture), a subpoena to SmartMoneyProject's operator would surface the entire BG-promoter funnel cohort plus their captured prospect lists** — a parallel and highly-leveraged attribution / victim-list discovery target alongside the BonChat / Elena03 subpoena play.
  - Public-facing contact (visible on the funnel page itself, not extracted by this investigator): `srachel2@gmail.com`. Linked socials: `facebook.com/ItsMeStevenRachel`, `vm.tiktok.com/ZTRgR7opj/`, `instagram.com/stevenrachel2/`.
  - Treatment: alleged BG promoter, public-facing, self-published. Right of reply per §3.4.1 / §3.4.2.

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
7. **Lockout / advance-fee tail** — when victim attempts withdrawal, platform demands additional "tax / unlock fee" deposits. Min-withdrawal-fee `$35 USDT` configured server-side. **The exit-scam tail was captured live for this report**: on 2026-05-02 (the same day BehindMLM places the withdrawal-stop event) operators broadcast a "rectification notice" to every BonChat cell demanding **12 % of each victim's account balance** as a fake "tax settlement" within a 5-business-day window (May 2 – May 6). The notice falsely claims regulator-mandated rectification, falsely promises that "funds paid can be withdrawn normally" once the rectification completes, and instructs victims to route their 12 % payment to "their team assistant" (i.e. their MLM upline — turning the §3.4 promoters into the cash-collection layer). **Verbatim text + forensic annotations:** `evidence/bonchat/rectification-notice-broadcast-2026-05-02.txt`. **Statutory exposure on the face of the notice:** 18 U.S.C. § 1343 (wire fraud), 15 U.S.C. § 77q(a) (securities fraud) — the notice contains multiple knowingly-false statements transmitted electronically to induce additional fund transfers, satisfying both predicates without any further investigative work.
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

**Two additional forged documents distributed via BonChat (captured 2026-05-07; preserved at `evidence/forged-documents/`):**

1. **`forged-stock-certificate-bg-wealth-sharing-ltd.jpg`** — A vintage-template stock certificate (Goes-Lithographing-style green eagle scrollwork) purporting to issue **70,000,000 shares of "BG Wealth Sharing LTD" common stock at $1.00 par value, all owned by "Stephen Beard"**, dated 13 April 2025 under "the laws of the State of Colorado." **Forgery indicia:** Colorado LLC formation does not authorize share issuance; LLCs do not issue "common stock at par value" (corporation-only language); SEC EDGAR shows zero share-registration filings for "BG Wealth Sharing LTD"; the template is a commercially-available stock-certificate printer template (vendors like StockCertificates.com sell these for $10-30). **Function in the scheme:** distributed to retail investors to imply Stephen Beard personally owns equity in a real registered corporation, supporting the §3.2 "founder" persona.

2. **`forged-investment-partnership-commitment-letter.jpg`** — A purported **"Investment Partnership Commitment Letter"** on **"BG WEALTH SHARING LTD"** letterhead, claiming it as an **"Australian Company" with "A.C.N. 686 266 704"**, signed *"Stephen Beard"* with red fingerprint stamp + a **"DSJ EXCHANGE LIMITED" corporate seal**, effective 20 April 2025 → 19 August 2034. **Forgery confirmed:** Australian Business Register lookup on ACN 686 266 704 returns *"No record found matching ACN 686266704"*. There is no such Australian company. The document is a fabrication using a non-existent ACN.

3. **`forged-letter-of-authorization-dsjex-bg.jpg`** — A purported **"DSJEX Exchange — Letter of Authorization and Agency Declaration"** in which "DSJ EXCHANGE LTD" claims to officially appoint "BG WEALTH SHARING LTD" as "the agent for the second contract and related business." Two corporate stamps: "DSJ EXCHANGE PTY LIMITED" and "BG WEALTH SHARING PTY LIMITED" (note both say PTY = Australian). Signed *"Stephen B[eard]"*. **Date claimed: August 1, 2022.** **Forgery indicia (multiple, structural):**
   - **Date is structurally impossible.** UK Companies House records show DSJ Exchange Ltd was *incorporated July 2024* (company #15821489). A 2022-dated authorization from an entity that did not legally exist for another two years is forgery on its face.
   - **PTY LIMITED designation contradicts the actual UK incorporation** of DSJ Exchange Ltd (no Australian PTY record exists for either entity, per ASIC).
   - **Chinese-origin drafting tells:** the clause *"reserves the right of final interpretation"* is the textbook Chinese commercial-contract phrase 最终解释权 (zuìzhōng jiěshì quán) — virtually never appears in English-native contracts. The phrase *"cannot be transferred through videotape or modification"* reads like a machine translation of Chinese 录像 (recording/videotape). The document is a Chinese-drafted forgery machine-translated into English, not an English-native forgery.
   - **Vague "second contract" reference** — purposefully ambiguous. The "second contract" is never specified, designed to look authoritative without committing to anything verifiable.
   - Decorative template: matches generic Chinese-language certificate-generator templates (decorative dark navy + gold scrollwork, oval seals).

**Three different fictitious jurisdictional claims across three forged documents from the same operator:** Colorado corporation (forged stock cert) / Australian ACN 686 266 704 (forged commitment letter) / Australian PTY LIMITED (forged authorization letter, dated impossibly). Inconsistent jurisdictional claims across the same operator's documents = forgery indicia per se.

**Chinese-language drafter footprint added to the operator-attribution profile.** Combined with prior Chinese-stack signatures (Tengine server on `bg6988.com`, Xcdn CDN on VCEX, Gname.com Pte. Ltd. Singapore registrar, AES key `dapp-20230831abc`, Struts2 backend on VCEX, Alibaba Cloud Singapore S3 bucket `dsj24.oss-ap-southeast-1.aliyuncs.com`), the operators' documents are now also confirmed Chinese-drafted via untranslated Chinese contractual idiom carried into the English text. **What makes this document forensically the most valuable single artifact:** it contains operator-authored *contractual* terms that constitute direct documentary evidence of the rigged-trading mechanism, the cult information-control directives, and the personal liability of "Stephen Beard" — all signed and date-stamped:

   - *"Over the next ten years, Stephen Beard commits to providing two signal analyses each day, ensuring that at least one out of five analyses is profitable. Participants must operate based on the trade analyses provided by Stephen Beard, adhering to the timing, direction, and specific amounts specified."* — written contractual specification of the rigged-trading mechanism, with **"Stephen Beard" personally named as the author/guarantor of the trade analyses**. Compare to the §3.2 "Stephen Beard" front-figure framing: the operators have him not just on camera but as a *signing personal guarantor* on a fraudulent contract. This substantially increases his individual exposure under any future federal action — he is no longer plausibly an unwitting prop hire (cf. earlier 白工 hypothesis); he is the **named-and-signed personal guarantor** on a written contract distributed to retail investors.
   - *"While following these trades, investors must comply with the company's development policies, maintain the company's reputation, and uphold the company's culture."* — **contractual information-control obligation imposed on victims**.
   - *"If an investor discovers anyone spreading rumors or disseminating negative information, they should promptly report it to the relevant parties to jointly maintain a positive investment environment."* — **contractual snitch-on-critics provision**, requiring victims to suppress external warnings (regulator alerts, dehek.com, this report).
   - *"If a user's DSJ exchange is hacked, resulting in a loss of funds for BG members, the team will fully reimburse all lost funds."* — **fraudulent guarantee deployed as a pre-emptive neutralizer of "I was hacked / scammed" victim claims**.
   - *"Scope of Guarantee: If all five signal phases published by Stephen Beard are incorrect, leading to losses for members trading based on the plan, BG WEALTH SHARING LTD. will cover all investment losses."* — explicit reference to the **5-phase martingale loss-recovery scheme from PPT slide 25**, written into the contract as a "guarantee" — operationally meaningless because no such reimbursement mechanism exists, but contractually establishes the martingale system as the operator-promised trade structure.

   **Statutory exposure on the face of this document alone:**
   - 18 U.S.C. § 1343 (wire fraud — false statement transmitted electronically inducing financial action)
   - 15 U.S.C. § 77q(a) (securities fraud — material misrepresentation)
   - 18 U.S.C. § 1028 (false identification — fabricated ACN)
   - State criminal-document-forgery statutes (e.g. Colorado §18-5-101, Texas §32.21)
   - Cross-border misrepresentation: claiming Australian-company status when no such entity exists triggers Australian Criminal Code §134.2 (general dishonesty) jurisdiction.

**Multi-jurisdiction shell-entity claims captured to date:**
- Colorado LLC ("BG Wealth Sharing, LLC" + "DSJ Exchange PTY Ltd") — confirmed Colorado SOS filings exist (no investment-license meaning); per WA DFI, addresses are not legitimate places of business.
- Colorado corporation issuing 70M shares ("BG Wealth Sharing LTD") — **no such filing exists; forged stock certificate**.
- Australian company ACN 686 266 704 ("BG Wealth Sharing LTD") — **no such ACN exists; forged contract**.
- UK company "DSJ Exchange Ltd" — incorporated July 2024, dissolved October 2025 (Companies House #15821489); the £30M / £40M / £70M figures cited in operator broadcasts and PPT have no Companies House corroboration.
- The operators are **forum-shopping legitimacy theater across multiple national jurisdictions** depending on victim audience cohort.

---

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
