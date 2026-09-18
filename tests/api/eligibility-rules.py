#!/usr/bin/env python3
"""The narrower SAQs and their conditions — a validated hosting
provider, an isolated virtual-terminal workstation."""
import json
import os
import sys
import urllib.request
import urllib.error

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
PW = os.environ.get("ADMIN_PASSWORD", "test-admin-password-long")
C = {}
fails = []


def req(m, p, b=None, auth=False):
    d = json.dumps(b).encode() if b is not None else None
    h = {"Content-Type": "application/json"} if d else {}
    if auth and C:
        h["Cookie"] = C["v"]
    r = urllib.request.Request(BASE + p, data=d, method=m, headers=h)
    try:
        with urllib.request.urlopen(r) as x:
            if "Set-Cookie" in x.headers:
                C["v"] = x.headers["Set-Cookie"].split(";")[0]
            body = x.read()
            return x.status, (json.loads(body) if body[:1] in b"{[" else body)
    except urllib.error.HTTPError as e:
        body = e.read()
        return e.code, (json.loads(body) if body[:1] in b"{[" else body)


def ck(label, cond, extra=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}" + (f" -> {extra}" if extra else ""))
    if not cond:
        fails.append(label)


req("POST", "/api/admin/login", {"password": PW})

print("== 1 (red): C-VT now requires a validated hosting provider ==")
base = {"entity-type": "merchant", "storage": "no", "channel": "moto", "moto-method": "virtual-terminal"}
s, r = req("POST", "/api/eligibility", {"answers": {**base, "tpsp-vt": "no"}})
ck("unvalidated provider routes to SAQ D", s == 200 and r["saqType"] == "D-Merchant")
s, r = req("POST", "/api/eligibility", {"answers": {**base, "tpsp-vt": "yes"}})
ck("validated provider still asks about isolation", s == 400 and r["nextStep"] == "vt-isolation")
s, r = req("POST", "/api/eligibility", {"answers": {**base, "tpsp-vt": "yes", "vt-isolation": "yes"}})
ck("both conditions met -> C-VT", s == 200 and r["saqType"] == "C-VT",
   " > ".join(p["stepId"] for p in r["path"]) if s == 200 else r)
s, r = req("POST", "/api/eligibility", {"answers": {**base, "tpsp-vt": "yes", "vt-isolation": "no"}})
ck("non-isolated workstation -> SAQ D", s == 200 and r["saqType"] == "D-Merchant")

print("\n== 2 (red): reset is atomic ==")
_, a = req("POST", "/api/admin/assessments",
           {"clientName": "Reset Atomicity Ltd", "variant": "merchant"}, auth=True)
tok, aid = a["token"], a["id"]
for q in ["1.1.1", "1.1.2", "1.2.1"]:
    req("PUT", f"/api/assessment/{tok}/answers/{q}", {"response": "yes"})
_, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("answers recorded before reset", len(d["answers"]) == 3)
s, _ = req("POST", f"/api/admin/assessments/{aid}/reset-eligibility", auth=True)
_, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("reset succeeded", s == 200)
ck("answers and determination cleared together",
   len(d["answers"]) == 0 and d["assessment"]["variant"] is None and d["assessment"]["saqType"] is None)
_, p = req("GET", f"/api/assessment/{tok}")
ck("client returns to the wizard", p["stage"] == "eligibility")

print("\n== 4 (yellow): a preset assessment can be reset ==")
_, a2 = req("POST", "/api/admin/assessments",
            {"clientName": "Preset Correction Ltd", "variant": "merchant"}, auth=True)
aid2 = a2["id"]
_, d2 = req("GET", f"/api/admin/assessments/{aid2}", auth=True)
ck("preset assessment has no eligibility record", d2["assessment"]["eligibility"] is None)
s, _ = req("POST", f"/api/admin/assessments/{aid2}/reset-eligibility", auth=True)
_, d2 = req("GET", f"/api/admin/assessments/{aid2}", auth=True)
ck("reset endpoint clears a preset variant", s == 200 and d2["assessment"]["variant"] is None)
_, p2 = req("GET", f"/api/assessment/{a2['token']}")
ck("client now gets the wizard instead", p2["stage"] == "eligibility")

print("\n== 5 (yellow/security): metadata is length-capped ==")
s, r = req("POST", "/api/admin/assessments", {"clientName": "x" * 300}, auth=True)
ck("oversized client name rejected", s == 400, r.get("error", "")[:60])
s, r = req("POST", "/api/admin/assessments",
           {"clientName": "Fine Co", "scopeSummary": "y" * 5000}, auth=True)
ck("oversized scope summary rejected", s == 400)
s, r = req("POST", "/api/admin/assessments",
           {"clientName": "Fine Co", "internalNotes": "z" * 9000}, auth=True)
ck("oversized internal notes rejected", s == 400)
s, a3 = req("POST", "/api/admin/assessments",
            {"clientName": "Normal Co", "scopeSummary": "Hosted gateway.", "internalNotes": "Nothing unusual."},
            auth=True)
ck("normal metadata still accepted", s == 201)
s, r = req("PATCH", f"/api/admin/assessments/{a3['id']}", {"internalNotes": "z" * 9000}, auth=True)
ck("oversized notes on edit rejected too", s == 400)
s, r = req("PATCH", f"/api/admin/assessments/{a3['id']}", {"internalNotes": "Fine."}, auth=True)
ck("normal edit still accepted", s == 200)

print("\n== regression: routing unchanged elsewhere ==")
for answers, expected in [
    ({"entity-type": "merchant", "storage": "no", "channel": "ecommerce",
      "ecommerce-integration": "redirect-iframe", "tpsp-a": "yes"}, "A"),
    ({"entity-type": "merchant", "storage": "no", "channel": "card-present", "cp-equipment": "p2pe"}, "P2PE"),
    ({"entity-type": "merchant", "storage": "no", "channel": "moto",
      "moto-method": "passed-through", "tpsp-a": "yes"}, "A"),
    ({"entity-type": "service-provider"}, "D-ServiceProvider"),
]:
    s, r = req("POST", "/api/eligibility", {"answers": answers})
    ck(f"still routes to {expected}", s == 200 and r["saqType"] == expected)

print("\n" + ("ELIGIBILITY RULES VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
