#!/usr/bin/env python3
"""
DSJ / BGW / Swift Wave Capital successor watchlist monitor.

Reads watchlist.yaml, runs DNS + crt.sh + HTTP probes,
appends a JSONL entry per run for diff'ing.

Usage:
    python3 monitor.py            # one-shot, prints summary + writes JSONL
    python3 monitor.py --diff     # show what changed since last run
"""
from __future__ import annotations
import argparse, json, os, re, socket, ssl, sys, time, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WATCHLIST = ROOT / "watchlist.yaml"
RESULTS = ROOT / "runs.jsonl"
UA = "Mozilla/5.0 (compatible; OSINT-watchlist/1.0)"

def parse_yaml_simple(text: str) -> dict:
    """Tiny dependency-free YAML reader: top-level keys with list values only."""
    out: dict[str, list[str]] = {}
    cur = None
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line.startswith(" ") and line.rstrip().endswith(":"):
            cur = line.strip().rstrip(":")
            out[cur] = []
        elif cur and line.lstrip().startswith("- "):
            v = line.split("- ", 1)[1].strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in ("'", '"'):
                v = v[1:-1]
            out[cur].append(v)
    return out

def dns_a(host: str) -> list[str]:
    try:
        return sorted({a[4][0] for a in socket.getaddrinfo(host, None)})
    except socket.gaierror:
        return []

def http_head(url: str, timeout: int = 8) -> dict:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ssl.create_default_context()) as r:
            return {"status": r.status, "server": r.headers.get("Server"), "location": r.headers.get("Location")}
    except Exception as e:
        return {"status": None, "error": str(e)[:120]}

def crtsh(query: str, timeout: int = 30) -> list[str]:
    url = f"https://crt.sh/?q={urllib.parse.quote(query)}&output=json"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ssl.create_default_context()) as r:
            data = r.read()
        records = json.loads(data)
        names: set[str] = set()
        for rec in records:
            for n in (rec.get("name_value") or "").split("\n"):
                n = n.strip().lower().lstrip("*.")
                if n:
                    names.add(n)
        return sorted(names)
    except Exception as e:
        return [f"__error__: {e}"]

def probe_domain(host: str) -> dict:
    return {
        "host": host,
        "a": dns_a(host),
        "http": http_head(f"https://{host}/", timeout=6),
    }

def run_once(watch: dict) -> dict:
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    out: dict = {"ts": now, "domains": [], "crtsh": {}}
    for d in watch.get("domains", []):
        out["domains"].append(probe_domain(d))
    for q in watch.get("crtsh_queries", []):
        out["crtsh"][q] = crtsh(q)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--diff", action="store_true", help="diff vs previous run")
    args = ap.parse_args()
    if not WATCHLIST.exists():
        sys.exit(f"missing watchlist: {WATCHLIST}")
    watch = parse_yaml_simple(WATCHLIST.read_text())
    result = run_once(watch)
    # diff vs last run if requested
    prev = None
    if RESULTS.exists() and args.diff:
        with RESULTS.open() as f:
            for line in f:
                line = line.strip()
                if line:
                    prev = json.loads(line)
    # append
    with RESULTS.open("a") as f:
        f.write(json.dumps(result) + "\n")
    # summary
    print(f"[{result['ts']}] watchlist run")
    for d in result["domains"]:
        a = ",".join(d["a"]) or "-"
        h = d["http"]
        st = h.get("status") if h.get("status") is not None else h.get("error", "ERR")
        print(f"  {d['host']:40s} A=[{a}] HTTP={st} server={h.get('server','-')}")
    for q, names in result["crtsh"].items():
        if names and isinstance(names[0], str) and names[0].startswith("__error__"):
            print(f"  crt.sh '{q}': {names[0]}")
        else:
            print(f"  crt.sh '{q}': {len(names)} unique names")
            for n in names[:10]:
                print(f"    - {n}")
    if args.diff and prev:
        prev_hosts = {d["host"]: d for d in prev["domains"]}
        cur_hosts = {d["host"]: d for d in result["domains"]}
        for h, cd in cur_hosts.items():
            pd = prev_hosts.get(h)
            if not pd:
                continue
            if pd.get("a") != cd.get("a") or pd["http"].get("status") != cd["http"].get("status"):
                print(f"  CHANGE {h}: A {pd.get('a')} -> {cd.get('a')}, HTTP {pd['http'].get('status')} -> {cd['http'].get('status')}")
        for q, names in result["crtsh"].items():
            old = set(prev["crtsh"].get(q, []))
            new = set(names) - old
            if new and not (len(new) == 1 and next(iter(new)).startswith("__error__")):
                print(f"  NEW certs '{q}':")
                for n in sorted(new)[:25]:
                    print(f"    + {n}")

if __name__ == "__main__":
    main()
