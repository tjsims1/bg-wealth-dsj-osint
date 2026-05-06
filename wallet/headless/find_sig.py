import re
with open('js/app_decomp.js') as f:
    t = f.read()

print("=== request interceptor ===")
m = re.search(r't\.a\.interceptors\.request\.use\(([\s\S]{0,3000}?)\),', t)
if m:
    print(m.group(0)[:3000])
print('---')

print("=== signature param construction ===")
# Look for assignment patterns to a 'signature' or 'sign' param
for kw in ['"signature"', "'signature'", '.signature=', 'signature:', '.sign=', 'sign:', 'random', '"timestamp"', "'timestamp'"]:
    for m in re.finditer(re.escape(kw), t):
        i = m.start()
        ctx = t[max(0, i-250):i+350]
        if 'failed' in ctx[200:400] or 'empty' in ctx[200:400]:
            continue
        print(f"--- {kw} @{i} ---")
        print(ctx[:600])
        print()
        break
