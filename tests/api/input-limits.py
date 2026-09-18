#!/usr/bin/env python3
"""Oversized and non-string text, an eligibility change racing a save,
and sign-in failures that survive a successful sign-in."""
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
           {"clientName": "Round Three Ltd", "variant": "merchant"}, auth=True)
tok, aid = a["token"], a["id"]

print("== 4 (security): non-string text no longer bypasses the limit ==")
huge_array = ["y" * 500] * 40  # stringifies to ~20,000 characters
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
           {"response": "yes", "justification": huge_array})
ck("array justification rejected", s == 400, r.get("error") if isinstance(r, dict) else "")
_, p = req("GET", f"/api/assessment/{tok}")
ck("nothing was stored for it", "1.1.1" not in p["answers"] or len(p["answers"]["1.1.1"]["justification"]) == 0)

s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": "yes", "evidence": {"a": "b"}})
ck("object evidence rejected", s == 400)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": "yes", "justification": 12345})
ck("number justification rejected", s == 400)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
           {"response": "yes", "justification": "Normal text.", "evidence": "CHG-1184"})
ck("normal text still accepted", s == 200)
_, p = req("GET", f"/api/assessment/{tok}")
ck("stored correctly", p["answers"]["1.1.1"]["justification"] == "Normal text.")

print("\n== 5: eligibility change cannot race an answer save ==")
mismatches = 0
for round_no in range(10):
    _, a2 = req("POST", "/api/admin/assessments", {"clientName": f"Race3 {round_no}"}, auth=True)
    t2 = a2["token"]
    req("POST", f"/api/assessment/{t2}/eligibility",
        {"answers": {"entity-type": "merchant", "storage": "yes"}})

    outcome = {}
    barrier = threading.Barrier(2)

    def writer():
        barrier.wait()
        outcome["write"] = req("PUT", f"/api/assessment/{t2}/answers/1.1.1", {"response": "yes"})[0]

    def changer():
        barrier.wait()
        outcome["change"] = req("POST", f"/api/assessment/{t2}/eligibility",
                                {"answers": {"entity-type": "service-provider"}})[0]

    ts = [threading.Thread(target=writer), threading.Thread(target=changer)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()

    _, d = req("GET", f"/api/admin/assessments/{a2['id']}", auth=True)
    variant = d["assessment"]["variant"]
    answers = d["answers"]

    # Whoever won, the outcome must be coherent: either the change was refused
    # and the answer stands under the original variant, or the change went
    # through and any surviving answer was written after it against the new one.
    _, cat = req("GET", "/api/requirements")
    valid_ids = {
        q["id"] for sec in cat["sections"] for q in sec["questions"]
        if q["appliesTo"] == "all" or (variant == "service-provider" and q["appliesTo"] == "service-provider")
    }
    stale = [qid for qid in answers if qid not in valid_ids]
    if stale:
        mismatches += 1
        print(f"    round {round_no}: answer(s) {stale} invalid under variant {variant}")
    elif outcome["change"] == 200 and outcome["write"] == 200 and len(answers) > 1:
        mismatches += 1
        print(f"    round {round_no}: {len(answers)} answers survived a SAQ change")

ck("no incoherent answer/variant state after the race", mismatches == 0,
   f"{mismatches} bad outcomes in 10 rounds")

print("\n== 6 (security): a successful login does not clear accumulated failures ==")
for _ in range(8):
    req("POST", "/api/admin/login", {"password": "wrong"})
s, _ = req("POST", "/api/admin/login", {"password": PW})
ck("correct password still works below the threshold", s == 200)
statuses = [req("POST", "/api/admin/login", {"password": "wrong"})[0] for _ in range(3)]
ck("further failures still reach the lockout", 429 in statuses,
   f"after a successful login: {statuses}")

print("\n== regression: nothing else moved ==")
req("POST", "/api/admin/login", {"password": PW})
s, cat = req("GET", "/api/requirements")
ck("catalogue intact", s == 200 and cat["totals"]["questions"] == 260)
s, e = req("POST", "/api/eligibility", {"answers": {
    "entity-type": "merchant", "storage": "no", "channel": "moto",
    "moto-method": "virtual-terminal", "tpsp-vt": "yes", "vt-isolation": "yes"}})
ck("C-VT routing intact", s == 200 and e["saqType"] == "C-VT")

print("\n" + ("INPUT LIMITS VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
