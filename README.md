# BG Wealth Sharing / DSJ Exchange — OSINT Dossier

**Compiled by Vault Data Servers**
**Date: 2026-05-05**
**Status: DSJ-branded successor infrastructure confirmed live and operational** (post-FBI seizure of original `bgwealthsharing.com` on 2026-04-23)

This repository documents the **BG Wealth Sharing / DSJ Exchange / Swift Wave Capital (VCEX)** "click-a-button" cryptocurrency Ponzi network operated out of a scam compound in **Min Let Pan, Burma**. It is intended as a public reference for victims, journalists, regulators, and law-enforcement liaisons.

> ⚠️ All evidence in this repository was gathered from **publicly available sources** plus a **single sanitized live-capture session** (PII-stripped). Personal identifiers of the test account holder, the third party who provided test credentials, and any victim-linkable wallet addresses have been redacted with `[REDACTED_*]` placeholders. Operator-side wallet addresses, domains, account IDs, and infrastructure are preserved in full.

---

## Quick links

| File | Contents |
| --- | --- |
| **[REPORT.md](REPORT.md)** | Full OSINT report — domains, persons of interest, modus operandi, regulatory posture, live-capture findings |
| **[wallet/WALLET_FORENSICS.md](wallet/WALLET_FORENSICS.md)** | TRON on-chain trace: $30M operator hot wallet + 9,500-victim sample + top-5 next-hop freeze candidates |
| **[wallet/RE_NOTES.md](wallet/RE_NOTES.md)** | Reverse-engineering notes for the VCEX/Struts2 backend (AES key, signing salt, 50-endpoint catalog) |
| **[watchlist/WATCHLIST.md](watchlist/WATCHLIST.md)** | Successor-domain monitoring patterns, search queries, escalation endpoints |
| **[watchlist/monitor.py](watchlist/monitor.py)** | Daily-cron-ready Python monitor for new lookalike domains + cert-transparency hits |

---

## At-a-glance findings

**The criminal case (FBI / DOJ, D.D.C., 2026-04-23):**
- Original domain `bgwealthsharing.com` seized by FBI per warrant from US District Court, D.C.
- Two Chinese nationals charged: **Jiang Wen Jie** (aka Jiang Nan) and **Huang Xingshan** (aka Ah Zhe). Both fled Burma to Thailand in November 2025; arrested by Thai authorities on immigration fraud.
- Part of DOJ Scam Center Strike Force action; 503 fake-investment websites seized; >$700M tied to Chinese "click-a-button" Ponzis.

**Live-confirmed successor infrastructure (2026-05-05):**
- Frontend: `tra809.tw/h5/` (Vue/Vant SPA, Cloudflare-fronted)
- Centralized backend: `api.ddjea.com` — single REST API serving multiple disposable storefronts
- Mobile distribution: `dsj627.icu/dsj625.mobileconfig` (iOS profile install — significant trust escalation) + `dsj627.icu/dsj625.apk` (Android)
- Asset CDN: `dsiscos.com` + `dsj24.oss-ap-southeast-1.aliyuncs.com` (Alibaba Cloud Singapore)
- VCEX clone: `vcexpro.com`, `vcexin.com` (server `Xcdn` on `38.182.168.98` — Chinese CDN)
- Recruitment landings still on Vercel: `bg-wealth-sharing-six.vercel.app`, `bg-wealth-simulator.vercel.app`

**On-chain forensics (operator hot wallet, March 2026 rotation):**
- Address: **`TYwaXc4ofNK2mL4NHaz9y58WiNAhguqWLu`**
- Through-volume: **$30,895,315 USDT in 4 days** (2026-03-19 → 03-23)
- **9,567 unique sender addresses** captured in a single 27-hour window — each one a victim deposit
- Rotation cadence: ~4 days per hot wallet

**Top 5 next-hop wallets (≥$23M / 75% of outflow — immediate freeze candidates):**
1. `TFTYF7k41xnHqjCGYb26BDvMy4Yhfp4Tx6` — $5.51M
2. `TUw7Lp1xWSWyHaA1n3D8QqDzbBphSct1Wi` — $4.63M
3. `TCQe3aiYbHbLKWhPTe9NC1MQRfwMebJ1jW` — $4.60M
4. `TCqZRkSviRWRpCh3e9rvhcBEoEnaeqy1no` — $4.42M
5. `TSUPWoF2bdBs5juQbqv7s9duXpa7VLFrPC` — $4.00M

**Confirmed recruitment vectors:** Telegram, WhatsApp, **BonChat** (the operators specifically push victims into BonChat because it resists subpoena). Funnel: social-media DMs → Zoom hype meetings → in-app rigged "trading signals."

**Front-end personas appear fictional / AI-generated:** "Professor Stephen Beard" (claimed founder, named in FCA UK warning May 2025), "Joseph Smith" (claimed COO).

---

## If you have lost money

File in this order, ideally with this report attached:

1. **FBI IC3** — https://www.ic3.gov — reference *US v. Jiang Wen Jie & Huang Xingshan*, D.D.C., 2026-04-23. Include any TRON / Ethereum txids, deposit address, screenshots, the recruiter's contact info.
2. **Your state securities regulator** (or country-equivalent for non-US victims).
3. **Action Fraud (UK)** if UK-based — https://www.actionfraud.police.uk
4. **Your bank or card issuer** — immediate fraud claim if a fiat-to-crypto on-ramp was involved.
5. **Crypto exchange** that hosted any wallet in the chain — formal fraud / freeze request, citing the IC3 case number.

**Do not pay any "withdrawal tax" or "unlock fee."** Once your DSJ balance "locks", paying additional fees only feeds the advance-fee tail of the same scam. The money already deposited is, in the vast majority of cases, unrecoverable from the operators directly — *recovery* paths run through law enforcement and CEX freeze actions, not the platform itself.

---

## What's *not* in this repository

- The raw, un-sanitized live-session capture (contains test-account PII).
- The cloned operator GitHub source repos (`Navyakushwaha/DSJ-Exchange`, `sonyho2715/lee-meadows-saas`, `TheAugDev/BG`) — see `REPORT.md §2.3` for the URLs. They were preserved offline and have been reported via GitHub abuse.
- Direct identification of the test account holder or the third party who provided the test credentials.

---

## Scope, assumptions, and disclaimers

- **Alleged promoters** named in `REPORT.md §3.4` are sourced from public Zoom-meeting attendance records and social-media activity compiled by Danny de Hek (dehek.com) and the "Avengers" investigative community. They are **alleged**, not subject to any criminal charge known to this investigator. Inclusion here does not imply guilt; it places them in a contemporaneous record of who was visible in BG Wealth Sharing recruitment activity.
- **Wallet attributions** are derived from on-chain analysis (TRONGRID public API) and the structural pattern of the operator's hot-wallet rotation. Attribution to "operator" vs. "victim" wallet is based on flow patterns, not Tronscan public tags (which were absent for the wallets named).
- Findings are presented **as-of the report date**. Domain rotation, wallet rotation, and successor brand pivots are observed every 1–4 days; current state may differ.
- This repository **is not legal advice** and **is not a regulatory filing**. It is an OSINT compilation made available to support victim reporting, journalism, and regulator awareness.

---

## Contributing

If you have additional evidence — a wallet address that resolves to a current rotation, a screenshot of recruitment activity, a fresh successor brand — open an issue or a PR. Do not include personal identifying information of victims; redact before submission.

If you are a victim and have a recent (post-2026-05-01) `wallet/recharge/payment/info` capture from your DSJ session, the deposit address it contains can be used to identify *this week's* operator hot wallet; the trace pattern in `wallet/WALLET_FORENSICS.md` is reproducible. Reach out before posting publicly so we can scrub PII first.

---

## License

- **Documents** (`*.md`, raw HTML captures, JSON / JSONL data) — Creative Commons Attribution 4.0 International (CC-BY-4.0). See `LICENSE-DOCS`.
- **Code** (`*.py`, `*.js`, monitoring scripts) — MIT License. See `LICENSE-CODE`.

Attribution: Vault Data Servers, 2026.
