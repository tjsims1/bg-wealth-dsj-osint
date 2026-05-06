# VCEX Backend Reverse-Engineering Notes

**Captured:** 2026-05-05 via headless Playwright session against `https://vcexpro.com/`.
**Sister site:** `vcexin.com` shares the same JS bundles + API host (`vcexpro.com`); identical backend.
**Backing IP (both):** `38.182.168.98` — Cogent ASN, fronted by `Server: Xcdn` (Chinese CDN).

---

## 1. Stack signature

- **Frontend:** Vue.js SPA (vendor bundle includes Vue + element-ui), Brotli-compressed.
- **Backend:** Apache Struts 2 (`!method.action` URL convention).
- **Endpoint root:** `https://vcexpro.com/wap/api/<controller>!<method>.action`
- **Stack origin:** Chinese build (zh-CN strings, RMB shown in fiat list, error messages localized to Chinese first).

---

## 2. Request crypto

**All API requests** carry the body as an AES-encrypted blob in the `cipherTextKey` query parameter, plus three signature headers.

### 2.1 Symmetric encryption

```
Algorithm:    AES-128
Mode:         ECB
Padding:      PKCS#7
Key:          "dapp-20230831abc"   (16 bytes UTF-8)
Plaintext:    str(Date.now()) + JSON   (13-char ms timestamp prefix + JSON body)
Wire format:  base64(ciphertext)
```

JS reference (from `js/app.0cc79ab7127a71a7abf2.js` @ ~1835704):

```js
let c = h.a.enc.Utf8.parse("dapp-20230831abc"),
    l = { mode: h.a.mode.ECB, padding: h.a.pad.Pkcs7 };

function d(e) {  // encrypt
  e = h.a.enc.Utf8.parse(Date.now() + e);
  return h.a.AES.encrypt(e, c, l).toString();
}
function g(e) {  // decrypt
  e = h.a.AES.decrypt(e, c, l).toString(h.a.enc.Utf8).substring(13);
  return JSON.parse(e);
}
```

### 2.2 Request signing

Each request adds three headers via the axios request interceptor:

| Header | Value | Notes |
| --- | --- | --- |
| `tissuePaper` | unix-seconds timestamp (string) | header name is literally "tissuePaper" — anti-grep obfuscation |
| `systemRandom` | `<unix_seconds><6-digit-random>` | nonce |
| `sign` | `MD5(salt + tissuePaper + systemRandom).toUpperCase()` | hex digest, uppercase |

**Salt:** `VCExhhw2uuFge4283y8WFgu23g287WFh248298SFew`

Constructor (from same bundle):
```js
let t = "VCExhhw2uuFge4283y8WFgu23g287WFh248298SFew";
function o() {
  var n = Math.floor((new Date).getTime()/1e3);
  var i = "" + n + Math.random().toString().slice(-6);
  var e = "" + t + n + i;
  return { signature: a()(e).toUpperCase(), timestamp: n, systemRandom: i };
}
```

Server validation order:
1. Missing timestamp → `{"code":"201","msg":"timestamp is empty"}`
2. Missing signature → `{"code":"201","msg":"signature is empty"}`
3. Bad signature → `{"code":"201","msg":"signature failed"}`
4. Stale timestamp → `{"code":"201","msg":"request expired"}`
5. Auth required → `{"code":"213","msg":"token was not submitted"}`

### 2.3 Response decryption

Same key, same mode, same prefix-stripping. Plaintext format:
```
<13-char ms timestamp><JSON-encoded response>
```

The 13-char timestamp prefix is stripped via `.substring(13)` before `JSON.parse()`.

---

## 3. Endpoint catalog (50 endpoints; surface mapped 2026-05-05)

**Public (no token required, returned data without auth):**
- `syspara!getSyspara.action` — system parameters (only returns `customer_service_url` / `use_amazon_s3_flag`)
- `syspara!getTimeZone.action` — server timezone (returns `America/New_York`)
- `exchangerate!list.action` — fiat exchange rates (USD, CNY, VND, KRW, INR, IDR, PHP, JPY, EUR, GBP, AUD, NZD, MYR, THB, TWD, HKD, CAD, SGD)
- `exchangerateuserconfig!get.action` — user's preferred fiat
- `item!list.action` — list of trading pairs
- `hobi!getRealtime.action` — real-time market data (this endpoint returns plaintext JSON, not encrypted)
- `cms!get.action` — CMS articles (needs id)
- `localuser!getImageCode.action` — registration captcha (returns base64 JPG)

**Auth-walled (returned `code:213, token was not submitted`):**
- `wallet!getAll.action` ← **deposit addresses likely returned here**
- `assets!getAll.action`
- `c2cAdvert!list.action`, `c2cAdvert!get.action`, `c2cAdvert!symbol.action`
- `c2cOrder!list.action`, `c2cOrder!get.action`, `c2cOrder!open.action`
- `c2cPaymentMethod!list.action`, `c2cPaymentMethod!get.action`, `c2cPaymentMethod!getAdPayments.action`
- `c2cAppeal!apply.action`
- `c2cUser!get.action`, `c2cUser!getUserCenter.action`
- `exchangeapplyorder!list/get/open/close/openview/closeview/cancel.action`
- `itemUserOptional!list/add/delete.action`
- `localuser!get/register/registerNoVerifcode/**registerTest**.action`
- `user!login/logout/googleLogin/verifCodeLogin/resetpsw/resetpswByGoogle/setSafewordReg/getUserNameVerifTarget.action`
- `newOnlinechat!list/send.action`, `otcOnlinechat!list/send.action`
- `uploadimg!execute.action`
- `idcode!execute.action`

Note `localuser!registerTest.action` — a test registration endpoint left in production. Forensically interesting; not exercised here.

---

## 4. What this means for the wallet hunt

The TRC-20 deposit address is returned by `wallet!getAll.action` and is **gated behind a logged-in `spToken` session cookie / localStorage value**. The token is obtained by completing the `localuser!register*.action` → `user!login.action` flow, which creates an actual account on the platform.

**I did not register an account.** Creating an account on a live scam platform — even without depositing — leaves an account fingerprint in their database, may trigger MLM-recruiter contact attempts (the registration funnel is the front door of the scam), and crosses from passive observation into engagement. Out of scope for unauth OSINT.

**To proceed past this wall, options are:**
1. **Cooperating victim** — anyone already registered can be guided to capture their `wallet!getAll.action` response with browser DevTools + run it through the decryption snippet in §5. One sample yields one TRC-20 deposit address. Multiple victim samples reveal whether addresses are per-user (HD-derived) or shared.
2. **Law-enforcement subpoena** — DOJ already has the Burma compound's infrastructure under indictment (per the BG Wealth Sharing seizure case in D.D.C., 2026-04-23). The same task force can compel the hosting provider.
3. **Sandbox registration** with explicit authorization (e.g. by a regulator or victim) — would require clean attribution and is out of scope here.

---

## 5. Working decrypt / sign snippet

Drop into Python 3 with `cryptography` installed.

```python
import base64, json, time, hashlib, random, urllib.request, urllib.parse, ssl
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding as p7

KEY  = b'dapp-20230831abc'
SALT = 'VCExhhw2uuFge4283y8WFgu23g287WFh248298SFew'

def enc(plain: str) -> str:
    body = (str(int(time.time()*1000)) + plain).encode()
    pad  = p7.PKCS7(128).padder()
    pt   = pad.update(body) + pad.finalize()
    ct   = Cipher(algorithms.AES(KEY), modes.ECB()).encryptor().update(pt)
    ct  += Cipher(algorithms.AES(KEY), modes.ECB()).encryptor().finalize()
    return base64.b64encode(ct).decode()

def dec(b64: str) -> str:
    raw = Cipher(algorithms.AES(KEY), modes.ECB()).decryptor().update(base64.b64decode(b64))
    unp = p7.PKCS7(128).unpadder()
    return (unp.update(raw) + unp.finalize()).decode('utf-8','replace')[13:]

def sign():
    ts  = int(time.time())
    rnd = str(ts) + str(random.random())[-6:]
    sig = hashlib.md5((SALT + str(ts) + rnd).encode()).hexdigest().upper()
    return {'tissuePaper': str(ts), 'sign': sig, 'systemRandom': rnd}
```

Decrypt a captured response: `dec(captured_b64_string)`.
Forge a request: encrypted body in `?cipherTextKey=`, signed via `sign()` headers.

---

## 6. Files in this directory

- `RE_NOTES.md` — this file
- `headless/capture.js` — Playwright capture script (target list + auto-walk)
- `headless/out/<host>/events.json` — full network trace per target
- `headless/out/<host>/SUMMARY.json` — distinct hosts, validated TRON, API call list
- `headless/out/<host>/page.png` — full-page screenshot
- `headless/out/<host>/rendered.html` — final DOM after JS execution
- `headless/out/vcexpro.com/decrypted.json` — every captured API response, decrypted
- `headless/out/vcexpro.com/endpoints_actions.txt` — all 50 enumerated API endpoints
- `headless/out/vcexpro.com/js/{app,vendors_decomp}.js` — full Brotli-decompressed JS bundles
