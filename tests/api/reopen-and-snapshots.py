#!/usr/bin/env python3
"""Reopening does not revive tabs open at submission, a version sent
twice counts once, and reports come from one snapshot."""
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


def complete(name):
    _, a = req("POST", "/api/admin/assessments", {"clientName": name, "variant": "merchant"}, auth=True)
    tok, aid = a["token"], a["id"]
    _, p = req("GET", f"/api/assessment/{tok}")
    e, g = p["session"]["epoch"], p["session"]["generation"]
    for n, q in enumerate([q for sec in p["sections"] for q in sec["questions"]], start=1):
        req("PUT", f"/api/assessment/{tok}/answers/{q['id']}",
            {"response": "yes", "epoch": e, "seq": n, "generation": g})
    return tok, aid, p["session"]


print("== 1 (red): reopening does not revive the tabs that were open at submission ==")
tok, aid, first = complete("Reopen Tabs Ltd")
# A second page was open the whole time and holds a higher epoch.
_, stale_page = req("GET", f"/api/assessment/{tok}")
stale_epoch, stale_gen = stale_page["session"]["epoch"], stale_page["session"]["generation"]

req("POST", f"/api/assessment/{tok}/submit", {"name": "A Person", "revision": None})
s, r = req("POST", f"/api/assessment/{tok}/submit", {"name": "A Person"})
_, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("assessment is submitted", d["assessment"]["status"] == "submitted", d["assessment"]["status"])

s, _ = req("POST", f"/api/admin/assessments/{aid}/reopen", auth=True)
ck("reopen succeeds", s == 200, s)

s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
           {"response": "no", "justification": "From the tab left open.",
            "epoch": stale_epoch, "seq": 9999, "generation": stale_gen})
ck("the tab left open since before submission cannot write", s == 409 and r.get("stage") == "generation",
   r.get("error", "")[:60] if isinstance(r, dict) else str(r))
_, p = req("GET", f"/api/assessment/{tok}")
ck("the answer it tried to overwrite still stands", p["answers"]["1.1.1"]["response"] == "yes",
   p["answers"]["1.1.1"]["response"])
ck("and a reloaded page can edit", req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
   {"response": "no", "justification": "After reload.", "epoch": p["session"]["epoch"], "seq": 1,
    "generation": p["session"]["generation"]})[0] == 200)

print("\n== 2 (yellow): the same version sent twice counts once ==")
_, a2 = req("POST", "/api/admin/assessments", {"clientName": "Double Send Ltd", "variant": "merchant"}, auth=True)
t2 = a2["token"]
_, p2 = req("GET", f"/api/assessment/{t2}")
e2, g2 = p2["session"]["epoch"], p2["session"]["generation"]
body = {"response": "yes", "evidence": "CHG-1", "epoch": e2, "seq": 7, "generation": g2}
_, r1 = req("PUT", f"/api/assessment/{t2}/answers/1.1.1", body)
_, r2 = req("PUT", f"/api/assessment/{t2}/answers/1.1.1", body)
ck("the first is applied", r1["applied"] is True)
ck("the resend is not a second write", r2["applied"] is False, json.dumps(r2))
ck("and the revision moved once", r2["revision"] == r1["revision"],
   f"{r1['revision']} then {r2['revision']}")
_, p2b = req("GET", f"/api/assessment/{t2}")
ck("the answer is still there", p2b["answers"]["1.1.1"]["evidence"] == "CHG-1")

print("\n-- so a page that flushed on hide can still submit --")
_, a3 = req("POST", "/api/admin/assessments", {"clientName": "Hide Then Submit Ltd", "variant": "merchant"}, auth=True)
t3 = a3["token"]
_, p3 = req("GET", f"/api/assessment/{t3}")
e3, g3 = p3["session"]["epoch"], p3["session"]["generation"]
applied = 0
for n, q in enumerate([q for sec in p3["sections"] for q in sec["questions"]], start=1):
    _, r = req("PUT", f"/api/assessment/{t3}/answers/{q['id']}",
               {"response": "yes", "epoch": e3, "seq": n, "generation": g3})
    applied += 1 if r["applied"] else 0
# The page-hide flush resends the last edit at the same version.
_, dup = req("PUT", f"/api/assessment/{t3}/answers/1.1.1",
             {"response": "yes", "epoch": e3, "seq": 1, "generation": g3})
applied += 1 if dup["applied"] else 0
s, r = req("POST", f"/api/assessment/{t3}/submit",
           {"name": "A Person", "revision": p3["session"]["revision"] + applied})
ck("submission is accepted", s == 200, json.dumps(r)[:80] if s != 200 else r["result"]["determination"])

print("\n== 3 (yellow): a reset cannot be caught halfway through a report ==")
bad = 0
for i in range(8):
    tok4, aid4, sess4 = complete(f"Report Race {i}")
    out = {}
    barrier = threading.Barrier(2)

    def reader():
        barrier.wait()
        out["report"] = req("GET", f"/api/assessment/{tok4}/result")

    def resetter():
        barrier.wait()
        out["reset"] = req("POST", f"/api/admin/assessments/{aid4}/reset-eligibility", auth=True)[0]

    ts = [threading.Thread(target=reader), threading.Thread(target=resetter)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()

    status, body = out["report"]
    # Either the report is of the questionnaire as it was, or there is no
    # questionnaire any more. What it must never be is the old questionnaire
    # scored against the deleted answers.
    if status == 200 and body["result"]["determination"] == "incomplete":
        bad += 1
        print(f"    round {i}: report scored {body['result']['totals']['counts']['unanswered']} unanswered")
ck("a report is never the old questionnaire with the answers removed", bad == 0,
   f"{bad} of 8 rounds")

print("\n== 4 (security): a lockout belongs to the caller, not to everyone ==")


def login_as(ip, password):
    d = json.dumps({"password": password}).encode()
    r = urllib.request.Request(BASE + "/api/admin/login", data=d, method="POST",
                               headers={"Content-Type": "application/json", "X-Forwarded-For": ip})
    try:
        with urllib.request.urlopen(r) as x:
            return x.status
    except urllib.error.HTTPError as e:
        e.read()
        return e.code


attacker, assessor = "203.0.113.5", "198.51.100.9"
for _ in range(12):
    login_as(attacker, "wrong")
ck("the caller who guessed is locked out", login_as(attacker, "wrong") == 429)
ck("and stays locked out even with the right password", login_as(attacker, PW) == 429)
ck("the assessor elsewhere is unaffected", login_as(assessor, PW) == 200)
ck("their own wrong guesses are counted separately",
   login_as(assessor, "wrong") == 401, "401 expected, not a lockout")

print("\n== regression ==")
_, p5 = req("GET", f"/api/assessment/{t3}/result")
ck("results still served", "result" in p5)
s, pdf = req("GET", f"/api/assessment/{t3}/report.pdf")
ck("client report PDF", s == 200 and pdf[:5] == b"%PDF-")
s, pdf = req("GET", f"/api/assessment/{t3}/aoc.pdf")
ck("client attestation PDF", s == 200 and pdf[:5] == b"%PDF-")
_, a6 = req("POST", "/api/admin/assessments", {"clientName": "Admin PDF Ltd", "variant": "merchant"}, auth=True)
s, d = req("GET", f"/api/admin/assessments/{a6['id']}", auth=True)
ck("admin detail still served", s == 200 and d["assessment"]["clientName"] == "Admin PDF Ltd")
s, pdf = req("GET", f"/api/admin/assessments/{a6['id']}/report.pdf", auth=True)
ck("admin report PDF", s == 200 and pdf[:5] == b"%PDF-")

print("\n" + ("REOPEN AND SNAPSHOTS VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
