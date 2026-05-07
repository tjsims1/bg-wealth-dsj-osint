#!/usr/bin/env python3
"""
Snapshot USDT-TRC20 balances of the 19 addresses Tether blacklisted in
block 82411924 (2026-05-04 14:12:18 UTC) — the cluster ZachXBT publicly
attributed to the DSJEX/BG Wealth Sharing operator network on 2026-05-05.

Run:  python3 freeze_monitor.py            # one-shot, appends to runs.jsonl
      python3 freeze_monitor.py --diff     # show last vs previous snapshot

Each run appends a single JSON line: { ts_utc, totals, balances: [{addr, usdt}...] }.
History is preserved in runs.jsonl for diff/audit. tether_freeze_19_balances.json
holds the latest snapshot for convenience.
"""
import json, time, sys, urllib.request, datetime
from pathlib import Path

USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
HERE = Path(__file__).resolve().parent
RUNS = HERE / "freeze_runs.jsonl"
LATEST = HERE / "tether_freeze_19_balances.json"

ADDRS = [
    "TAAcSiQkKF1F3Jj9oxMCqojyihjBXajFGV", "TT4gjGCpfU78sUYRw7hUUfdWKvZnhZFuLN",
    "TH3wtXtmuEbooiUGz47JDzm4VQvsr9qKyy", "TD4rPd5RXQm9qn8d2keRVuPvZhQtCVsEXB",
    "TVumv6FZJqxsvsykjyJs1BWhLWbqwDXRDh", "TYWzZS6QFx95h1HQMNz4JjVMTwa2wcF2Re",
    "TNk9uytcAUrxoHrk1PBL2TEhFMU6Ap1WUV", "TVWHdLRLTMrMEvbXFk9E3JGHY4HSThYiDY",
    "TJVXcFZmzyAjGGNpeAd9o2PkqSnP2FQmfr", "THJHHP9qS9o7v9ek7ztw6C2cuzsr7vPZRE",
    "TRSQrMpSy1axo3pK8dWAvMbKXeZhdE7uSX", "TXYteZ8Zsrx89YTG3wMzDkwrQ38yTh86M4",
    "TSCdgoNMjcX2jarrw6TBq4X4LfsGfzWo4W", "TEEXJYUAMupkXW2dx9V9WDkjKcckjkP5hi",
    "TSkeScCcfDxuajYSApzZnKpt5qZZ1wTpdj", "TFxCPJf9qFujUiHnT4hcKfrqQG7UFAWsiQ",
    "TEAGP3Kgv8hJWmUEmrtDjHH2AunmpzztxL", "TWwPnnkY1gaS8jDzyTTkAsjfQD7z5mbwUm",
    "TAQa4FZweNjbxq69adEhPnFQeKZqkN1pJa",
]

def fetch(addr, attempts=4):
    for i in range(attempts):
        try:
            with urllib.request.urlopen(f"https://api.trongrid.io/v1/accounts/{addr}", timeout=20) as r:
                d = json.load(r).get("data", [])
            info = d[0] if d else {}
            usdt = 0
            for tk in info.get("trc20", []):
                if USDT in tk:
                    usdt = int(tk[USDT]) / 1_000_000
                    break
            return {"addr": addr, "usdt": usdt, "last_op_ts": info.get("latest_opration_time", 0)}
        except Exception as e:
            if i == attempts - 1:
                return {"addr": addr, "error": str(e)}
            time.sleep(3 * (i + 1))

def snapshot():
    rows = []
    for a in ADDRS:
        rows.append(fetch(a))
        time.sleep(2.5)
    total = sum(r.get("usdt", 0) for r in rows)
    return {
        "ts_utc": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "freeze_block": 82411924,
        "freeze_ts_utc": "2026-05-04T14:12:18Z",
        "total_usdt": round(total, 2),
        "balances": sorted(rows, key=lambda r: -r.get("usdt", 0)),
    }

def diff():
    if not RUNS.exists():
        print("no runs yet"); return
    snaps = [json.loads(l) for l in RUNS.read_text().splitlines() if l.strip()]
    if len(snaps) < 2:
        print(f"only {len(snaps)} snapshot(s); need 2 to diff"); return
    a, b = snaps[-2], snaps[-1]
    print(f"prev: {a['ts_utc']}  total ${a['total_usdt']:,}")
    print(f"curr: {b['ts_utc']}  total ${b['total_usdt']:,}")
    print(f"delta: ${b['total_usdt'] - a['total_usdt']:+,.2f}")
    pa = {r["addr"]: r.get("usdt", 0) for r in a["balances"]}
    for r in b["balances"]:
        prev = pa.get(r["addr"], 0)
        cur = r.get("usdt", 0)
        if abs(cur - prev) > 0.001:
            print(f"  {r['addr']}  {prev:>14,.2f} -> {cur:>14,.2f}  ({cur-prev:+,.2f})")

if __name__ == "__main__":
    if "--diff" in sys.argv:
        diff()
    else:
        snap = snapshot()
        with RUNS.open("a") as f:
            f.write(json.dumps(snap) + "\n")
        LATEST.write_text(json.dumps(snap, indent=2))
        print(f"snapshot: {snap['ts_utc']}  total ${snap['total_usdt']:,}  ({len(snap['balances'])} addresses)")
        for r in snap["balances"][:3]:
            print(f"  {r['addr']}  ${r.get('usdt', 0):>14,.2f}")
        print(f"... appended to {RUNS.name}")
