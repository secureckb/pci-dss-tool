#!/usr/bin/env python3
"""Stale-read races across every assessment mutation."""
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


def fresh(name, answers_count=0):
    _, a = req("POST", "/api/admin/assessments", {"clientName": name}, auth=True)
    req("POST", f"/api/assessment/{a['token']}/eligibility",
        {"answers": {"entity-type": "merchant", "storage": "yes"}})
    for qid in ["1.1.1", "1.1.2", "1.2.1"][:answers_count]:
        req("PUT", f"/api/assessment/{a['token']}/answers/{qid}", {"response": "yes"})
    return a["token"], a["id"]


print("== Devin's case: an answer save in flight when the assessor resets ==")
bad = 0
for i in range(10):
    tok, aid = fresh(f"ResetRace {i}")
    outcome = {}
    barrier = threading.Barrier(2)

    def writer():
        barrier.wait()
        outcome["write"] = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": "yes"})[0]

    def resetter():
        barrier.wait()
        outcome["reset"] = req("POST", f"/api/admin/assessments/{aid}/reset-eligibility", auth=True)[0]

    ts = [threading.Thread(target=writer), threading.Thread(target=resetter)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()

    _, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
    # After a reset the assessment has no SAQ, so it must have no answers either.
    if d["assessment"]["variant"] is None and len(d["answers"]) > 0:
        bad += 1
        print(f"    round {i}: {len(d['answers'])} answer(s) survived the reset "
              f"(write={outcome['write']}, reset={outcome['reset']})")
ck("no answer survives a reset that cleared the SAQ", bad == 0, f"{bad} survivors in 10 rounds")

print("\n== the worse case: a stale wizard tab must not delete another tab's work ==")
bad = 0
for i in range(8):
    # Tab A loads the wizard while eligibility is still unset.
    _, a = req("POST", "/api/admin/assessments", {"clientName": f"StaleTab {i}"}, auth=True)
    tok, aid = a["token"], a["id"]
    req("GET", f"/api/assessment/{tok}")  # tab A's view: eligibility_completed_at is NULL

    # Tab B completes the wizard and answers three requirements.
    req("POST", f"/api/assessment/{tok}/eligibility",
        {"answers": {"entity-type": "merchant", "storage": "yes"}})
    for qid in ["1.1.1", "1.1.2", "1.2.1"]:
        req("PUT", f"/api/assessment/{tok}/answers/{qid}", {"response": "yes"})

    # Tab A now submits its stale wizard answers, choosing a different SAQ.
    status, _ = req("POST", f"/api/assessment/{tok}/eligibility",
                    {"answers": {"entity-type": "service-provider"}})
    _, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
    if status == 200 or len(d["answers"]) < 3:
        bad += 1
        print(f"    round {i}: stale tab returned {status}, {len(d['answers'])} of 3 answers left")
ck("stale wizard submission is refused and answers are preserved", bad == 0,
   f"{bad} bad outcomes in 8 rounds")

print("\n== reopen races a submission ==")
bad = 0
for i in range(8):
    tok, aid = fresh(f"ReopenRace {i}")
    _, p = req("GET", f"/api/assessment/{tok}")
    for q in [q for s in p["sections"] for q in s["questions"]]:
        req("PUT", f"/api/assessment/{tok}/answers/{q['id']}", {"response": "yes"})

    outcome = {}
    barrier = threading.Barrier(2)

    def submitter():
        barrier.wait()
        outcome["submit"] = req("POST", f"/api/assessment/{tok}/submit", {"name": "A Person"})[0]

    def reopener():
        barrier.wait()
        outcome["reopen"] = req("POST", f"/api/admin/assessments/{aid}/reopen", auth=True)[0]

    ts = [threading.Thread(target=submitter), threading.Thread(target=reopener)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()

    _, d = req("GET", f"/api/admin/assessments/{aid}", auth=True)
    st = d["assessment"]["status"]
    submitted_by = d["assessment"]["submittedBy"]
    # Whatever the order, status and signer must agree with each other.
    if (st == "submitted") != (submitted_by is not None):
        bad += 1
        print(f"    round {i}: status={st} but submittedBy={submitted_by}")
ck("status and attestation never disagree", bad == 0, f"{bad} inconsistencies in 8 rounds")

print("\n== reopen on a non-submitted assessment is refused ==")
tok, aid = fresh("Reopen Guard Ltd")
s, r = req("POST", f"/api/admin/assessments/{aid}/reopen", auth=True)
ck("reopen refuses an in-progress assessment", s == 409, r.get("error") if isinstance(r, dict) else "")

print("\n== ordinary behaviour unchanged ==")
tok, aid = fresh("Sanity Ltd")
s, _ = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": "yes", "evidence": "CHG-1"})
ck("answer accepted", s == 200)
s, _ = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": None})
ck("answer cleared", s == 200)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": "na", "justification": "x"})
ck("N/A still refused where not permitted", s == 400)
s, r = req("PUT", f"/api/assessment/{tok}/answers/9.9.9", {"response": "yes"})
ck("unknown requirement refused", s in (404, 409), s)
s, r = req("POST", f"/api/assessment/{tok}/submit", {"name": "A"})
ck("incomplete submission refused", s == 400)

print("\n" + ("MUTATION RACES VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
