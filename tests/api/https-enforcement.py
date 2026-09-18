#!/usr/bin/env python3
"""Plaintext is refused, with nothing in the request able to talk its way out."""
import http.client
import os
import sys
from urllib.parse import urlparse
import json

TARGET = urlparse(os.environ.get("BASE_URL", "http://127.0.0.1:8080"))
# The port in a Host header is immaterial to the loopback check — only the
# hostname is parsed — but matching the real one keeps these readable.
PORT = TARGET.port or 80

fails = []


def ck(label, cond, extra=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}" + (f" -> {extra}" if extra else ""))
    if not cond:
        fails.append(label)


def request(path, host="saq.example.com", method="GET", headers=None):
    conn = http.client.HTTPConnection(TARGET.hostname, TARGET.port or 80, timeout=10)
    h = {"Host": host}
    h.update(headers or {})
    conn.request(method, path, headers=h)
    r = conn.getresponse()
    body = r.read()
    out = (r.status, dict(r.getheaders()), body)
    conn.close()
    return out


print("== 1 (red): nothing in the request can talk its way out of the redirect ==")
for path in [
    "/q/abc123",
    "/q/abc123?__https_retry=1",
    "/q/abc123?__https_retry",
    "/api/assessment/abc123?__https_retry=1",
    "/admin?__https_retry=1&foo=bar",
]:
    status, headers, _ = request(path)
    ck(f"redirected: {path}", status == 308, f"{status} -> {headers.get('Location', '(none)')}")

print("\n-- and a write is redirected with its method intact --")
status, headers, _ = request("/api/assessment/abc/answers/1.1.1", method="PUT")
ck("308 keeps the method", status == 308, str(status))

print("\n== 2 (red): a platform health probe on the private network still works ==")
status, _, body = request("/api/health", host=f"pci-dss-tool.railway.internal:{PORT}")
ck("health answers over plain HTTP", status == 200, f"{status} {body[:40].decode()}")
ck("and reports the database", json.loads(body).get("database") == "up")

print("\n-- but nothing else on that host is served in the clear --")
status, _, _ = request("/api/requirements", host=f"pci-dss-tool.railway.internal:{PORT}")
ck("the catalogue is redirected", status == 308, str(status))
status, _, _ = request("/api/admin/assessments", host=f"pci-dss-tool.railway.internal:{PORT}")
ck("the admin API is redirected", status == 308, str(status))

print("\n== 3 (yellow): IPv6 loopback is local development, not a public host ==")
for host in [f"[::1]:{PORT}", "[::1]", f"localhost:{PORT}", f"127.0.0.1:{PORT}"]:
    status, _, _ = request("/api/requirements", host=host)
    ck(f"served for {host}", status == 200, str(status))

print("\n-- a bracketed address that is not loopback is still public --")
status, _, _ = request("/api/requirements", host=f"[2001:db8::1]:{PORT}")
ck("redirected", status == 308, str(status))

print("\n== 4: a proxy reporting HTTPS gets HSTS and no redirect ==")
status, headers, _ = request("/api/health", headers={"X-Forwarded-Proto": "https"})
ck("served", status == 200, str(status))
ck("HSTS set", "max-age=31536000" in headers.get("Strict-Transport-Security", ""),
   headers.get("Strict-Transport-Security", "(none)"))

print("\n" + ("HTTPS ENFORCEMENT VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
