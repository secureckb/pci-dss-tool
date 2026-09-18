#!/usr/bin/env python3
"""Hammer the submit/answer race: the attested result must always match the stored answers."""
import json
import os
import sys
import threading
import urllib.request
import urllib.error

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
PW = os.environ.get("ADMIN_PASSWORD", "test-admin-password-long")
C = {}


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


req("POST", "/api/admin/login", {"password": PW})

ROUNDS = 30
mismatches = 0
late_writes = 0

for round_no in range(ROUNDS):
    _, a = req("POST", "/api/admin/assessments",
               {"clientName": f"Race {round_no}", "variant": "merchant"}, auth=True)
    tok = a["token"]
    _, p = req("GET", f"/api/assessment/{tok}")
    qs = [q for sec in p["sections"] for q in sec["questions"]]
    for q in qs:
        req("PUT", f"/api/assessment/{tok}/answers/{q['id']}", {"response": "yes"})

    # Fire a "No" write and the submit at the same instant.
    outcome = {}
    barrier = threading.Barrier(2)

    def writer():
        barrier.wait()
        outcome["write"] = req("PUT", f"/api/assessment/{tok}/answers/1.1.1", {"response": "no"})[0]

    def submitter():
        barrier.wait()
        st, body = req("POST", f"/api/assessment/{tok}/submit", {"name": "Racer"})
        outcome["submit"] = (st, body["result"]["totals"]["counts"]["no"] if st == 200 else None)

    ts = [threading.Thread(target=writer), threading.Thread(target=submitter)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()

    # Whatever the interleaving, the stored answers must match what was attested.
    _, res = req("GET", f"/api/assessment/{tok}/result")
    stored_no = res["result"]["totals"]["counts"]["no"]
    attested_no = outcome["submit"][1]
    write_status = outcome["write"]

    if attested_no is not None and attested_no != stored_no:
        mismatches += 1
        print(f"  round {round_no}: MISMATCH attested no={attested_no} stored no={stored_no}")
    if write_status == 200 and attested_no == 0 and stored_no == 1:
        late_writes += 1

    print(f"  round {round_no}: write={write_status} submit={outcome['submit'][0]} "
          f"attested_no={attested_no} stored_no={stored_no}")

print()
print(f"rounds: {ROUNDS} | attested/stored mismatches: {mismatches} | writes landing after lock: {late_writes}")
print("PASS" if mismatches == 0 and late_writes == 0 else "FAIL")

sys.exit(0 if mismatches == 0 and late_writes == 0 else 1)
