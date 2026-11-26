#!/usr/bin/env python3
"""Search-engine facing pages, and that client links stay out of both the
index and the visit counts."""
import json
import os
import re
import urllib.request
import urllib.error

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
PW = os.environ.get("ADMIN_PASSWORD", "test-admin-password-long")
BROWSER = "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0 Safari/537.36"
fails = []
cookie = {}


def get(path, ua=BROWSER, auth=False):
    h = {"User-Agent": ua} if ua else {}
    if auth and cookie:
        h["Cookie"] = cookie["v"]
    r = urllib.request.Request(BASE + path, headers=h)
    try:
        with urllib.request.urlopen(r) as x:
            return x.status, dict(x.headers), x.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode()


def post(path, body):
    r = urllib.request.Request(BASE + path, data=json.dumps(body).encode(), method="POST",
                               headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(r) as x:
        if "Set-Cookie" in x.headers:
            cookie["v"] = x.headers["Set-Cookie"].split(";")[0]
        return x.status, json.loads(x.read())


def ck(label, cond, extra=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}" + (f" -> {extra}" if extra else ""))
    if not cond:
        fails.append(label)


print("== public pages can be indexed, private ones cannot ==")
for p in ["/", "/which-saq", "/requirements", "/guides", "/guides/saq-d-vs-saq-a"]:
    s, h, b = get(p)
    ck(f"{p} is served and carries no noindex", s == 200 and "noindex" not in h.get("X-Robots-Tag", "") and "noindex" not in b)
for p in ["/q/0123456789abcdef0123456789abcdef", "/q/0123456789abcdef0123456789abcdef/results", "/admin", "/admin/login"]:
    s, h, b = get(p)
    ck(f"{p} is marked noindex", "noindex" in h.get("X-Robots-Tag", ""))
s, h, b = get("/api/health")
ck("the API is marked noindex", "noindex" in h.get("X-Robots-Tag", ""))

print("\n== each public page has its own title, description and canonical ==")
titles = set()
for p in ["/", "/which-saq", "/requirements"]:
    s, h, b = get(p)
    t = re.search(r"<title>(.*?)</title>", b)
    titles.add(t.group(1) if t else None)
    ck(f"{p} has a description and a canonical link", 'name="description"' in b and 'rel="canonical"' in b)
ck("the three titles are different", len(titles) == 3 and None not in titles, str(titles))

print("\n== guides ==")
s, h, b = get("/guides/service-provider-pci-levels")
ck("a guide is real HTML with its own heading", s == 200 and "<h1>" in b and "<article>" in b)
ck("it links the finder with a campaign label", "/which-saq?src=guide-service-provider-pci-levels" in b)
ck("it does not claim to be an official SAQ", "not an official SAQ" in b)
ck("an unknown guide is a 404", get("/guides/made-up")[0] == 404)

print("\n== robots.txt and sitemap.xml ==")
s, h, b = get("/robots.txt")
ck("robots.txt blocks client links and admin, and names the sitemap",
   "Disallow: /q/" in b and "Disallow: /admin" in b and "Sitemap:" in b)
s, h, b = get("/sitemap.xml")
ck("sitemap lists every public page", all(x in b for x in ["/which-saq", "/requirements", "/guides/saq-d-vs-saq-a"]))
ck("sitemap never lists a client link", "/q/" not in b and "/admin" not in b)

print("\n== visits are counted, and client links never are ==")
post("/api/admin/login", {"password": PW})
_, _, before = get("/api/admin/analytics?days=30", auth=True)
before = json.loads(before)

get("/which-saq?src=testmail")
get("/which-saq?src=testmail")
get("/which-saq?src=jane@example.com")
get("/which-saq?src=testmail", ua="Googlebot/2.1")
get("/q/0123456789abcdef0123456789abcdef")
get("/admin")
_, _, after = get("/api/admin/analytics?days=30", auth=True)
after = json.loads(after)


def views(d, key, name):
    return next((r["views"] for r in d[key] if r[key[2:].lower()] == name), 0)


ck("a labelled visit is counted per visit", views(after, "bySource", "testmail") - views(before, "bySource", "testmail") == 2)
ck("an email-shaped label is not stored", all("@" not in r["source"] for r in after["bySource"]))
ck("a crawler is not counted", views(after, "bySource", "testmail") - views(before, "bySource", "testmail") == 2)
ck("no path under /q/ or /admin ever appears",
   all(not r["path"].startswith("/q") and not r["path"].startswith("/admin") for r in after["byPath"]))

s, _, _ = get("/api/admin/analytics")
ck("the summary needs an admin session", s == 401)

if fails:
    print(f"\n{len(fails)} FAILED")
    raise SystemExit(1)
print("\nPUBLIC SEO AND VISIT COUNTING VERIFIED")
