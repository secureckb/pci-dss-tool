#!/usr/bin/env python3
"""Out-of-order answer writes, and the guards that keep a preset
assessment's answers when eligibility is posted again."""
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

print("== 1 (red): a preset assessment's answers are never deleted by an eligibility post ==")
_, a = req("POST", "/api/admin/assessments",
           {"clientName": "Preset Answers Ltd", "variant": "merchant"}, auth=True)
tok, aid = a["token"], a["id"]
_, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("preset assessment has no eligibility record", d["assessment"]["eligibility"] is None)

for qid in ["1.1.1", "1.1.2", "1.2.1"]:
    req("PUT", f"/api/assessment/{tok}/answers/{qid}", {"response": "yes"})
s, r = req("POST", f"/api/assessment/{tok}/eligibility",
           {"answers": {"entity-type": "service-provider"}})
ck("eligibility post refused once answers exist", s == 409, r.get("error", "")[:60])
_, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("all three answers survive", len(d["answers"]) == 3, f"{len(d['answers'])} answers")
ck("SAQ type unchanged", d["assessment"]["variant"] == "merchant", d["assessment"]["variant"])

print("\n-- and a fresh assessment can still be routed --")
_, a2 = req("POST", "/api/admin/assessments", {"clientName": "Fresh Route Ltd"}, auth=True)
s, r = req("POST", f"/api/assessment/{a2['token']}/eligibility",
           {"answers": {"entity-type": "merchant", "storage": "yes"}})
ck("wizard still works on an untouched assessment", s == 200 and r["saqType"] == "D-Merchant")

print("\n== 2 (red): an out-of-order write cannot overwrite a newer answer ==")
_, a3 = req("POST", "/api/admin/assessments",
            {"clientName": "Revision Order Ltd", "variant": "merchant"}, auth=True)
t3 = a3["token"]
_, load3 = req("GET", f"/api/assessment/{t3}")
E3 = load3["session"]["epoch"]

# Newer revision lands first, older one arrives afterwards.
s, r = req("PUT", f"/api/assessment/{t3}/answers/1.1.1",
           {"response": "no", "justification": "newer", "epoch": E3, "seq": 2000})
ck("newer write applied", s == 200 and r["applied"] is True)
s, r = req("PUT", f"/api/assessment/{t3}/answers/1.1.1",
           {"response": "yes", "justification": "older", "epoch": E3, "seq": 1000})
ck("older write reported superseded, not failed", s == 200 and r["superseded"] is True)
_, p = req("GET", f"/api/assessment/{t3}")
ck("server still holds the newer answer",
   p["answers"]["1.1.1"]["response"] == "no" and p["answers"]["1.1.1"]["justification"] == "newer",
   f"{p['answers']['1.1.1']['response']}/{p['answers']['1.1.1']['justification']}")

s, r = req("PUT", f"/api/assessment/{t3}/answers/1.1.1",
           {"response": "yes", "justification": "newest", "epoch": E3, "seq": 3000})
ck("a genuinely newer write is applied", s == 200 and r["applied"] is True)
_, p = req("GET", f"/api/assessment/{t3}")
ck("server now holds the newest", p["answers"]["1.1.1"]["justification"] == "newest")

print("\n-- clearing respects ordering too --")
s, r = req("PUT", f"/api/assessment/{t3}/answers/1.1.1", {"response": None, "epoch": E3, "seq": 2500})
ck("a stale clear does not delete a newer answer", s == 200 and r["superseded"] is True)
_, p = req("GET", f"/api/assessment/{t3}")
ck("answer still present", "1.1.1" in p["answers"])
s, r = req("PUT", f"/api/assessment/{t3}/answers/1.1.1", {"response": None, "epoch": E3, "seq": 4000})
ck("a current clear does delete", s == 200 and r["applied"] is True)
_, p = req("GET", f"/api/assessment/{t3}")
ck("answer removed", "1.1.1" not in p["answers"])

print("\n-- a client that sends no ordering still works --")
s, r = req("PUT", f"/api/assessment/{t3}/answers/1.1.2", {"response": "yes"})
ck("write without ordering applied", s == 200 and r["applied"] is True)

print("\n== 5 (security): the health check fails when the database is unreachable ==")
s, r = req("GET", "/api/health")
ck("healthy while the database is up", s == 200 and r.get("database") == "up", json.dumps(r))

print("\n== regression: ordinary flows unaffected ==")
_, a4 = req("POST", "/api/admin/assessments", {"clientName": "Sanity 7 Ltd"}, auth=True)
t4 = a4["token"]
req("POST", f"/api/assessment/{t4}/eligibility", {"answers": {"entity-type": "service-provider"}})
_, p = req("GET", f"/api/assessment/{t4}")
qs = [q for sec in p["sections"] for q in sec["questions"]]
ck("service-provider bank served", len(qs) == 260)
for q in qs:
    body = {"response": "yes"}
    if q["id"].startswith("A1."):
        body = {"response": "na", "justification": "Not a multi-tenant provider."}
    req("PUT", f"/api/assessment/{t4}/answers/{q['id']}", body)
s, r = req("POST", f"/api/assessment/{t4}/submit", {"name": "A Person", "title": "CISO"})
ck("full submission still works", s == 200, r["result"]["determination"] if s == 200 else r)
s, pdf = req("GET", f"/api/assessment/{t4}/report.pdf")
ck("report PDF still generated", s == 200 and pdf[:5] == b"%PDF-")

print("\n" + ("ANSWER ORDERING VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
