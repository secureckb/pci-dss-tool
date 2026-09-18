#!/usr/bin/env python3
"""A write from a questionnaire that has since been replaced is
refused, and a load reports a revision that matches its answers."""
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

print("== 1 (red): a reset questionnaire cannot have its answers restored ==")
_, a = req("POST", "/api/admin/assessments", {"clientName": "Reset Ghost Ltd"}, auth=True)
tok, aid = a["token"], a["id"]
req("POST", f"/api/assessment/{tok}/eligibility", {"answers": {"entity-type": "merchant", "storage": "yes"}})
_, p = req("GET", f"/api/assessment/{tok}")
old_epoch, old_gen = p["session"]["epoch"], p["session"]["generation"]
ck("the payload carries a generation", isinstance(old_gen, int), json.dumps(p["session"]))

req("PUT", f"/api/assessment/{tok}/answers/1.2.1",
    {"response": "yes", "evidence": "from the old questionnaire", "epoch": old_epoch, "seq": 1,
     "generation": old_gen})

# The assessor resets, and the client (or another tab) runs the wizard again.
req("POST", f"/api/admin/assessments/{aid}/reset-eligibility", auth=True)
req("POST", f"/api/assessment/{tok}/eligibility", {"answers": {"entity-type": "merchant", "storage": "yes"}})
_, p2 = req("GET", f"/api/assessment/{tok}")
ck("the reassessment starts empty", p2["answers"] == {}, f"{len(p2['answers'])} answers")
ck("and its generation has moved", p2["session"]["generation"] > old_gen,
   f"{old_gen} -> {p2['session']['generation']}")

# The buffered write from the page that was filling in the old questionnaire
# now arrives.
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.1",
           {"response": "yes", "evidence": "from the old questionnaire", "epoch": old_epoch, "seq": 2,
            "generation": old_gen})
ck("the delayed write is refused", s == 409 and r.get("stage") == "generation",
   r.get("error", "")[:60])
_, p3 = req("GET", f"/api/assessment/{tok}")
ck("no answer was restored", "1.2.1" not in p3["answers"], json.dumps(p3["answers"])[:60])

print("\n-- a write from the current questionnaire still works --")
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.1",
           {"response": "yes", "epoch": p2["session"]["epoch"], "seq": 1,
            "generation": p2["session"]["generation"]})
ck("current-generation write applied", s == 200 and r["applied"] is True)

print("\n-- an SAQ change also moves the generation --")
_, a2 = req("POST", "/api/admin/assessments", {"clientName": "Change SAQ Ltd"}, auth=True)
t2 = a2["token"]
req("POST", f"/api/assessment/{t2}/eligibility", {"answers": {"entity-type": "merchant", "storage": "yes"}})
_, before = req("GET", f"/api/assessment/{t2}")
req("POST", f"/api/admin/assessments/{a2['id']}/reset-eligibility", auth=True)
req("POST", f"/api/assessment/{t2}/eligibility", {"answers": {"entity-type": "service-provider"}})
_, after = req("GET", f"/api/assessment/{t2}")
ck("generation advanced across the change",
   after["session"]["generation"] > before["session"]["generation"],
   f"{before['session']['generation']} -> {after['session']['generation']}")
s, _ = req("PUT", f"/api/assessment/{t2}/answers/A1.1.1",
           {"response": "na", "justification": "x", "epoch": before["session"]["epoch"], "seq": 1,
            "generation": before["session"]["generation"]})
ck("a write against the old SAQ is refused", s == 409, s)

print("\n== 2 (red): a page claims only the writes it had applied ==")
# The client-side accounting is in the browser; here the server half is checked:
# a submission quoting a revision that is not the server's is refused, and the
# count only moves for writes that actually applied.
_, a3 = req("POST", "/api/admin/assessments", {"clientName": "Claim Ltd", "variant": "merchant"}, auth=True)
t3 = a3["token"]
_, p3 = req("GET", f"/api/assessment/{t3}")
e3, g3 = p3["session"]["epoch"], p3["session"]["generation"]
base = p3["session"]["revision"]
qs = [q for sec in p3["sections"] for q in sec["questions"]]
applied = 0
for n, q in enumerate(qs, start=1):
    _, r = req("PUT", f"/api/assessment/{t3}/answers/{q['id']}",
               {"response": "yes", "epoch": e3, "seq": n, "generation": g3})
    if r["applied"]:
        applied += 1
# A write that is superseded must not count towards what this page may claim.
_, newer = req("PUT", f"/api/assessment/{t3}/answers/1.1.1",
               {"response": "yes", "epoch": e3, "seq": 9000, "generation": g3})
applied += 1 if newer["applied"] else 0
_, sup = req("PUT", f"/api/assessment/{t3}/answers/1.1.1",
             {"response": "no", "epoch": e3, "seq": 8000, "generation": g3})
ck("the stale write was superseded", sup["superseded"] is True, json.dumps(sup))
ck("and it did not move the revision", sup["revision"] == base + applied,
   f"claimed base+{applied} = {base + applied}, server {sup['revision']}")
s, _ = req("POST", f"/api/assessment/{t3}/submit",
           {"name": "A Person", "revision": base + applied})
ck("a submission claiming exactly that is accepted", s == 200, s)

print("\n== 3 (yellow): the load's revision matches the answers it returns ==")
# Hammer the assessment with writes while reading it, and check every payload's
# revision matches the answers in the same payload.
_, a4 = req("POST", "/api/admin/assessments", {"clientName": "Snapshot Ltd", "variant": "merchant"}, auth=True)
t4 = a4["token"]
_, p4 = req("GET", f"/api/assessment/{t4}")
e4, g4 = p4["session"]["epoch"], p4["session"]["generation"]
ids = [q["id"] for sec in p4["sections"] for q in sec["questions"]][:40]
stop = False


def writer():
    n = 0
    while not stop:
        n += 1
        req("PUT", f"/api/assessment/{t4}/answers/{ids[n % len(ids)]}",
            {"response": "yes" if n % 2 else "no", "epoch": e4, "seq": n, "generation": g4})


t = threading.Thread(target=writer, daemon=True)
t.start()
mismatches = 0
for _ in range(25):
    _, load = req("GET", f"/api/assessment/{t4}")
    # A payload is coherent when submitting its own revision is not refused for
    # being behind what it is showing. Answers and revision come from one
    # snapshot, so the count of answered requirements can never exceed the
    # revision that came with them.
    if len(load["answers"]) > load["session"]["revision"]:
        mismatches += 1
        print(f"    {len(load['answers'])} answers under revision {load['session']['revision']}")
stop = True
t.join(timeout=5)
ck("no payload shows more answers than its revision allows", mismatches == 0,
   f"{mismatches} of 25 loads")

print("\n== 4 (security): the admin is told when a link came from the request host ==")
_, created = req("POST", "/api/admin/assessments", {"clientName": "Link Base Ltd"}, auth=True)
ck("localhost does not warn", created.get("linkFromRequestHost") is False,
   str(created.get("linkFromRequestHost")))

print("\n== regression ==")
_, p5 = req("GET", f"/api/assessment/{t3}/result")
ck("results still served", "result" in p5)
s, pdf = req("GET", f"/api/assessment/{t3}/report.pdf")
ck("report PDF still generated", s == 200 and pdf[:5] == b"%PDF-")

print("\n" + ("GENERATION GUARD VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
