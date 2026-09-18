#!/usr/bin/env python3
"""A page may only attest to the answer set it has seen: the
whole-assessment revision, and what is cacheable."""
import json
import os
import sys
import urllib.request
import urllib.error

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
PW = os.environ.get("ADMIN_PASSWORD", "test-admin-password-long")
C = {}
fails = []


def req(m, p, b=None, auth=False, headers=None):
    d = json.dumps(b).encode() if b is not None else None
    h = {"Content-Type": "application/json"} if d else {}
    if auth and C:
        h["Cookie"] = C["v"]
    h.update(headers or {})
    r = urllib.request.Request(BASE + p, data=d, method=m, headers=h)
    try:
        with urllib.request.urlopen(r) as x:
            if "Set-Cookie" in x.headers:
                C["v"] = x.headers["Set-Cookie"].split(";")[0]
            body = x.read()
            return x.status, (json.loads(body) if body[:1] in b"{[" else body), dict(x.headers)
    except urllib.error.HTTPError as e:
        body = e.read()
        return e.code, (json.loads(body) if body[:1] in b"{[" else body), dict(e.headers)


def ck(label, cond, extra=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}" + (f" -> {extra}" if extra else ""))
    if not cond:
        fails.append(label)


req("POST", "/api/admin/login", {"password": PW})
_, a, _ = req("POST", "/api/admin/assessments",
              {"clientName": "Revision Ltd", "variant": "merchant",
               "scopeSummary": "London store and hosted checkout only."}, auth=True)
tok, aid = a["token"], a["id"]

print("== 1 (red): a window cannot attest to answers changed in another window ==")
_, w1, _ = req("GET", f"/api/assessment/{tok}")   # window A
_, w2, _ = req("GET", f"/api/assessment/{tok}")   # window B
ea, eb = w1["session"]["epoch"], w2["session"]["epoch"]
ck("the payload carries a revision", "revision" in w1["session"], json.dumps(w1["session"]))

qs = [q for sec in w1["sections"] for q in sec["questions"]]
rev = w1["session"]["revision"]
for n, q in enumerate(qs, start=1):
    _, r, _ = req("PUT", f"/api/assessment/{tok}/answers/{q['id']}",
                  {"response": "yes", "epoch": ea, "seq": n})
    rev = r["revision"]
ck("every applied write moved the revision", rev == w1["session"]["revision"] + len(qs),
   f"{w1['session']['revision']} -> {rev} over {len(qs)} writes")

# Window B now changes a *different* requirement than window A last touched.
_, rb, _ = req("PUT", f"/api/assessment/{tok}/answers/{qs[5]['id']}",
               {"response": "no", "justification": "Gap found.", "epoch": eb, "seq": 1})
ck("window B's write applied", rb["applied"] is True)
ck("and moved the revision past window A's view", rb["revision"] == rev + 1,
   f"A saw {rev}, now {rb['revision']}")

s, r, _ = req("POST", f"/api/assessment/{tok}/submit",
              {"name": "A Person", "title": "CISO", "revision": rev})
ck("window A's submission is refused", s == 409 and r.get("stale") is True,
   r.get("error", "")[:70])
_, d, _ = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("nothing was locked", d["assessment"]["status"] == "in-progress", d["assessment"]["status"])

print("\n-- and window B, which is current, can submit --")
s, r, _ = req("POST", f"/api/assessment/{tok}/submit",
              {"name": "B Person", "title": "CTO", "revision": rb["revision"]})
ck("current window submits", s == 200, json.dumps(r)[:80] if s != 200 else r["result"]["determination"])

print("\n== 2: a superseded write does not move the revision ==")
_, a2, _ = req("POST", "/api/admin/assessments", {"clientName": "No Bump Ltd", "variant": "merchant"}, auth=True)
t2 = a2["token"]
_, p2, _ = req("GET", f"/api/assessment/{t2}")
e2 = p2["session"]["epoch"]
_, r1, _ = req("PUT", f"/api/assessment/{t2}/answers/1.1.1", {"response": "yes", "epoch": e2, "seq": 20})
_, r2, _ = req("PUT", f"/api/assessment/{t2}/answers/1.1.1", {"response": "no", "epoch": e2, "seq": 10})
ck("the stale write was superseded", r2["superseded"] is True)
ck("and the revision stood still", r2["revision"] == r1["revision"], f"{r1['revision']} -> {r2['revision']}")

print("\n-- an assessor reset moves the revision, so a client holding the old view is stale --")
_, before, _ = req("GET", f"/api/assessment/{t2}")
req("POST", f"/api/admin/assessments/{a2['id']}/reset-eligibility", auth=True)
# Re-route it so the questionnaire exists again, then read the revision back.
req("POST", f"/api/assessment/{t2}/eligibility", {"answers": {"entity-type": "merchant", "storage": "yes"}})
_, after, _ = req("GET", f"/api/assessment/{t2}")
ck("the reset advanced the revision", after["session"]["revision"] > before["session"]["revision"],
   f"{before['session']['revision']} -> {after['session']['revision']}")
s, r, _ = req("POST", f"/api/assessment/{t2}/submit",
              {"name": "A Person", "revision": before["session"]["revision"]})
ck("a submission quoting the pre-reset revision is refused", s == 409 and r.get("stale") is True,
   r.get("error", "")[:60])

print("\n== 3 (security): nothing behind a client link or an admin session is cacheable ==")
_, a3, _ = req("POST", "/api/admin/assessments", {"clientName": "Cache Ltd", "variant": "merchant"}, auth=True)
t3 = a3["token"]
for path in [f"/api/assessment/{t3}", f"/api/assessment/{t3}/result", f"/api/assessment/{t3}/report.pdf",
             "/api/admin/assessments"]:
    _, _, h = req("GET", path, auth=True)
    cc = h.get("Cache-Control", "")
    ck(f"no-store on {path.replace(t3, '<token>')}", "no-store" in cc, cc or "(none)")

_, _, h = req("GET", "/api/requirements")
ck("the public catalogue is still cacheable", "public" in h.get("Cache-Control", ""),
   h.get("Cache-Control", "(none)"))

print("\n== 4: the scope the assessor recorded reaches the client ==")
_, p3, _ = req("GET", f"/api/assessment/{tok}")
ck("scope is in the client payload", p3["assessment"]["scopeSummary"] == "London store and hosted checkout only.",
   str(p3["assessment"]["scopeSummary"]))

print("\n== regression: a plain submission without a revision still works ==")
_, a4, _ = req("POST", "/api/admin/assessments", {"clientName": "No Revision Ltd"}, auth=True)
t4 = a4["token"]
req("POST", f"/api/assessment/{t4}/eligibility", {"answers": {"entity-type": "service-provider"}})
_, p4, _ = req("GET", f"/api/assessment/{t4}")
e4 = p4["session"]["epoch"]
for n, q in enumerate([q for s2 in p4["sections"] for q in s2["questions"]], start=1):
    body = {"response": "yes", "epoch": e4, "seq": n}
    if q["id"].startswith("A1."):
        body = {"response": "na", "justification": "Not a multi-tenant provider.", "epoch": e4, "seq": n}
    req("PUT", f"/api/assessment/{t4}/answers/{q['id']}", body)
s, r, _ = req("POST", f"/api/assessment/{t4}/submit", {"name": "A Person"})
ck("an API client that sends no revision can still submit", s == 200,
   r["result"]["determination"] if s == 200 else json.dumps(r)[:80])

print("\n" + ("ATTESTATION REVISION VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
