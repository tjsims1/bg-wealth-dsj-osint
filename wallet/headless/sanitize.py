#!/usr/bin/env python3
"""
Strip PII + auth tokens out of events.jsonl so the trace can be shared.
Writes events.sanitized.jsonl alongside the original.
"""
import json, re, sys
from pathlib import Path

SRC = Path(__file__).parent / 'live_out' / 'events.jsonl'
DST = Path(__file__).parent / 'live_out' / 'events.sanitized.jsonl'

# Static replacements: known PII values from the test session
STATIC = {
    '[REDACTED_PHONE]': '[REDACTED_PHONE]',
    '[REDACTED_PHONE]':  '[REDACTED_PHONE]',
    '[REDACTED_PHONE]':   '[REDACTED_PHONE]',
    '[REDACTED_IPV6_REG]': '[REDACTED_IPV6_REG]',
    '[REDACTED_IPV6_LOGIN]':   '[REDACTED_IPV6_LOGIN]',
    '[REDACTED_ACCOUNT_ID]': '[REDACTED_ACCOUNT_ID]',
    '[REDACTED_WALLET_ID]': '[REDACTED_WALLET_ID_USDT]',
    '[REDACTED_WALLET_ID]': '[REDACTED_WALLET_ID_ETH]',
    '[REDACTED_WALLET_ID]': '[REDACTED_WALLET_ID_BTC]',
    '[REDACTED_WALLET_ID]': '[REDACTED_WALLET_ID_USDC]',
    '[REDACTED_WALLET_ID]': '[REDACTED_WALLET_ID_DAI]',
    '[REDACTED_INVITE_CODE]': '[REDACTED_INVITE_CODE]',
}

# Header patterns to redact entirely (cookie / auth)
HEADER_BLACKLIST = {
    'cookie', 'set-cookie', 'authorization', 'token', 'access-token',
    'sptoken', 'x-token', 'x-auth-token', 'auth', 'x-session',
}

# JSON fields to scrub when present in any object
SENSITIVE_KEYS = {
    'phone', 'email', 'password', 'token', 'spToken', 'sessionId', 'cookies',
    'registIp', 'loginIp', 'ip', 'ipAddress', 'invitationCode',
    'googlePassword', 'newPassword', 'oldWithdrawalPassword',
    'newWithdrawalPassword', 'verificationCode', 'salt',
}

def scrub_value(v):
    if isinstance(v, str):
        s = v
        for k, repl in STATIC.items():
            s = s.replace(k, repl)
        # IPv6 catch-all (paranoid)
        s = re.sub(r'\b([0-9a-fA-F]{1,4}:){2,}[0-9a-fA-F]{1,4}\b', '[REDACTED_IPV6]', s)
        # IPv4 catch-all (skip private + reserved + 1.1.1.1-class CDN ranges that are obviously not user IPs)
        return s
    if isinstance(v, dict):
        return {k: ('[REDACTED]' if k in SENSITIVE_KEYS and val not in (None, '', 0, False) else scrub_value(val)) for k, val in v.items()}
    if isinstance(v, list):
        return [scrub_value(x) for x in v]
    return v

def scrub_headers(h):
    if not isinstance(h, dict): return h
    return {k: ('[REDACTED]' if k.lower() in HEADER_BLACKLIST else scrub_value(v)) for k, v in h.items()}

n_in = n_out = 0
with SRC.open() as src, DST.open('w') as dst:
    for line in src:
        n_in += 1
        try:
            e = json.loads(line)
        except Exception:
            continue
        # Scrub headers
        if 'headers' in e:
            e['headers'] = scrub_headers(e['headers'])
        # Scrub URLs (query params can carry timestamps but rarely PII; do static replace only)
        if 'url' in e and isinstance(e['url'], str):
            for k, repl in STATIC.items():
                e['url'] = e['url'].replace(k, repl)
        # Scrub body (most likely to contain user object)
        if 'body' in e and isinstance(e['body'], str):
            scrubbed = e['body']
            # If JSON, parse + scrub recursively then re-serialize
            try:
                obj = json.loads(scrubbed)
                obj = scrub_value(obj)
                scrubbed = json.dumps(obj, ensure_ascii=False)
            except Exception:
                # not JSON; do static replacement only
                for k, repl in STATIC.items():
                    scrubbed = scrubbed.replace(k, repl)
            e['body'] = scrubbed
        # Scrub postData
        if 'postData' in e and isinstance(e['postData'], str):
            pd = e['postData']
            for k, repl in STATIC.items():
                pd = pd.replace(k, repl)
            e['postData'] = pd
        dst.write(json.dumps(e, ensure_ascii=False) + '\n')
        n_out += 1

print(f'Read:    {n_in} events')
print(f'Wrote:   {n_out} events')
print(f'Output:  {DST}')
