#!/usr/bin/env python3
"""An SAQ cannot record a customized approach, and a burst of
sign-in attempts is shed rather than held open."""
import json
import os
import sys
import threading
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
_, a = req("POST", "/api/admin/assessments",
           {"clientName": "Round Nine Ltd", "variant": "merchant"}, auth=True)
tok, aid = a["token"], a["id"]
_, load = req("GET", f"/api/assessment/{tok}")
E = load["session"]["epoch"]

print("== 1: an SAQ cannot record a customized approach, so the response is gone ==")
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
           {"response": "yes-customized", "justification": "Customized approach per Appendix D.",
            "epoch": E, "seq": 1})
ck("the API rejects it", s == 400, r.get("error") if isinstance(r, dict) else "")
_, p = req("GET", f"/api/assessment/{tok}")
ck("nothing was stored", "1.1.1" not in p["answers"])

s, cat = req("GET", "/api/requirements")
ck("requirement 12.3.2 is still in the bank (it is part of SAQ D)",
   any(q["id"] == "12.3.2" for sec in cat["sections"] for q in sec["questions"]))

print("\n-- the three remaining qualified answers still behave --")
for resp, extra, expect in [
    ("yes", {}, 200),
    ("yes-ccw", {"justification": "CCW-14 held with the assessor."}, 200),
    ("no", {}, 200),
]:
    s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": resp, "epoch": E, "seq": 10, **extra})
    ck(f"{resp} accepted", s == expect, json.dumps(r) if s != expect else "")

print("\n== 2: a compensating control still holds the result at pending review ==")
_, a2 = req("POST", "/api/admin/assessments", {"clientName": "CCW Only Ltd", "variant": "merchant"}, auth=True)
t2 = a2["token"]
_, p2 = req("GET", f"/api/assessment/{t2}")
e2 = p2["session"]["epoch"]
qs = [q for sec in p2["sections"] for q in sec["questions"]]
for n, q in enumerate(qs, start=1):
    body = {"response": "yes", "epoch": e2, "seq": n}
    if q["id"] == "1.1.1":
        body = {"response": "yes-ccw", "justification": "CCW-14.", "epoch": e2, "seq": n}
    req("PUT", f"/api/assessment/{t2}/answers/{q['id']}", body)
s, r = req("POST", f"/api/assessment/{t2}/submit", {"name": "A Person", "title": "CISO"})
ck("submission succeeds", s == 200)
ck("determination is pending review", s == 200 and r["result"]["determination"] == "pending-review",
   r["result"]["determination"] if s == 200 else "")
s, pdf = req("GET", f"/api/assessment/{t2}/report.pdf")
ck("gap report still renders", s == 200 and pdf[:5] == b"%PDF-")
s, pdf = req("GET", f"/api/assessment/{t2}/aoc.pdf")
ck("attestation still renders", s == 200 and pdf[:5] == b"%PDF-")

print("\n== 3 (security): a burst of parallel sign-in attempts is capped ==")
codes = []
errors = []
lock = threading.Lock()
barrier = threading.Barrier(30)


def attempt():
    barrier.wait()
    st, body = req("POST", "/api/admin/login", {"password": "wrong-password"})
    with lock:
        codes.append(st)
        errors.append(body.get("error", "") if isinstance(body, dict) else "")


ts = [threading.Thread(target=attempt) for _ in range(30)]
for t in ts:
    t.start()
for t in ts:
    t.join()

capped = [e for e in errors if "being processed" in e]
ck("the burst is shed rather than all held open", len(capped) > 0,
   f"{len(capped)} of 30 shed, codes={sorted(set(codes))}")
ck("every shed attempt is a 429", all(c == 429 for c, e in zip(codes, errors) if "being processed" in e))
ck("no attempt succeeded", 200 not in codes)

print("\n-- and the endpoint is still answering --")
s, r = req("POST", "/api/admin/login", {"password": "wrong-password"})
ck("still responding after the burst", s in (401, 429), s)

print("\n" + ("RESPONSES AND SIGN-IN VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
