#!/usr/bin/env python3
"""Write ordering must not depend on any one device's clock."""
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
           {"clientName": "Clock Skew Ltd", "variant": "merchant"}, auth=True)
tok = a["token"]

print("== 1 (red): a device with a slow clock is not locked out by a fast one ==")
# Each page load gets its epoch from the server, so the order of the two loads
# decides, not the millisecond each device happens to believe it is.
_, laptop = req("GET", f"/api/assessment/{tok}")
_, phone = req("GET", f"/api/assessment/{tok}")
e_laptop, e_phone = laptop["session"]["epoch"], phone["session"]["epoch"]
ck("each page load gets its own epoch", e_phone > e_laptop, f"laptop={e_laptop} phone={e_phone}")

s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
           {"response": "yes", "evidence": "from the laptop", "epoch": e_laptop, "seq": 1})
ck("laptop write applied", s == 200 and r["applied"] is True)

s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
           {"response": "no", "evidence": "from the phone", "epoch": e_phone, "seq": 1})
ck("phone write applied although its clock is behind", s == 200 and r["applied"] is True,
   json.dumps(r))
_, p = req("GET", f"/api/assessment/{tok}")
ck("server holds the phone's answer", p["answers"]["1.1.1"]["evidence"] == "from the phone",
   p["answers"]["1.1.1"]["evidence"])

print("\n-- and the phone keeps working for every later edit --")
ok = True
for n in range(2, 6):
    s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.1",
               {"response": "no", "evidence": f"phone edit {n}", "epoch": e_phone, "seq": n})
    if not (s == 200 and r["applied"] is True):
        ok = False
        print(f"    seq {n}: {s} {r}")
ck("four further edits from the phone all applied", ok)
_, p = req("GET", f"/api/assessment/{tok}")
ck("latest edit stored", p["answers"]["1.1.1"]["evidence"] == "phone edit 5",
   p["answers"]["1.1.1"]["evidence"])

print("\n== 2: ordering within one page still holds ==")
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.2",
           {"response": "yes", "evidence": "newer", "epoch": e_phone, "seq": 40})
ck("newer write applied", s == 200 and r["applied"] is True)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.2",
           {"response": "no", "evidence": "older", "epoch": e_phone, "seq": 20})
ck("an out-of-order keepalive flush is discarded", s == 200 and r["superseded"] is True)
_, p = req("GET", f"/api/assessment/{tok}")
ck("newer text survives", p["answers"]["1.1.2"]["evidence"] == "newer",
   p["answers"]["1.1.2"]["evidence"])
ck("the page is told its own epoch holds the answer", r["storedEpoch"] == e_phone,
   f"storedEpoch={r['storedEpoch']} own={e_phone}")

print("\n== 3: a stale page is told which epoch superseded it ==")
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.1.2",
           {"response": "yes", "evidence": "from the older page", "epoch": e_laptop, "seq": 99})
ck("the older page's write is refused", s == 200 and r["superseded"] is True)
ck("and it learns a different page holds the answer", r["storedEpoch"] == e_phone,
   f"storedEpoch={r['storedEpoch']} own={e_laptop}")

print("\n== 4: an unordered write does not reopen the row to stale writes ==")
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.1",
           {"response": "yes", "evidence": "ordered", "epoch": e_phone, "seq": 50})
ck("ordered write applied", s == 200 and r["applied"] is True)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.1", {"response": "no", "evidence": "unordered"})
ck("a client sending no ordering still saves", s == 200 and r["applied"] is True)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.1",
           {"response": "yes", "evidence": "stale", "epoch": e_phone, "seq": 10})
ck("the watermark was not dragged back to zero", s == 200 and r["superseded"] is True,
   json.dumps(r))
_, p = req("GET", f"/api/assessment/{tok}")
ck("unordered value still stands", p["answers"]["1.2.1"]["evidence"] == "unordered",
   p["answers"]["1.2.1"]["evidence"])

print("\n== 5: clearing keeps its watermark across page loads ==")
_, later = req("GET", f"/api/assessment/{tok}")
e_later = later["session"]["epoch"]
req("PUT", f"/api/assessment/{tok}/answers/1.2.2", {"response": "yes", "epoch": e_phone, "seq": 5})
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.2",
           {"response": None, "epoch": e_later, "seq": 1})
ck("clear applied", s == 200 and r["applied"] is True)
s, r = req("PUT", f"/api/assessment/{tok}/answers/1.2.2",
           {"response": "yes", "evidence": "resurrect", "epoch": e_phone, "seq": 9})
ck("an in-flight write from the earlier page cannot resurrect it",
   s == 200 and r["superseded"] is True)
_, p = req("GET", f"/api/assessment/{tok}")
ck("answer stays cleared", "1.2.2" not in p["answers"])

print("\n== 6: concurrent writes from two pages never lose the later page's edit ==")
bad = 0
for i in range(10):
    _, ax = req("POST", "/api/admin/assessments",
                {"clientName": f"TwoPages {i}", "variant": "merchant"}, auth=True)
    t = ax["token"]
    _, first = req("GET", f"/api/assessment/{t}")
    _, second = req("GET", f"/api/assessment/{t}")
    barrier = threading.Barrier(2)
    out = {}

    def w(name, ep, sq, val):
        barrier.wait()
        out[name] = req("PUT", f"/api/assessment/{t}/answers/1.1.1",
                        {"response": "yes", "evidence": val, "epoch": ep, "seq": sq})[1]

    ts = [threading.Thread(target=w, args=("old", first["session"]["epoch"], 1, "old page")),
          threading.Thread(target=w, args=("new", second["session"]["epoch"], 1, "new page"))]
    for th in ts:
        th.start()
    for th in ts:
        th.join()
    _, p = req("GET", f"/api/assessment/{t}")
    if p["answers"]["1.1.1"]["evidence"] != "new page":
        bad += 1
        print(f"    round {i}: stored {p['answers']['1.1.1']['evidence']!r}")
ck("the later page always wins, whatever the arrival order", bad == 0, f"{bad} in 10 rounds")

print("\n== regression: a full questionnaire still submits ==")
_, a2 = req("POST", "/api/admin/assessments", {"clientName": "Sanity 8 Ltd"}, auth=True)
t2 = a2["token"]
req("POST", f"/api/assessment/{t2}/eligibility", {"answers": {"entity-type": "service-provider"}})
_, p = req("GET", f"/api/assessment/{t2}")
ep = p["session"]["epoch"]
qs = [q for sec in p["sections"] for q in sec["questions"]]
ck("service-provider bank served", len(qs) == 260)
for n, q in enumerate(qs, start=1):
    body = {"response": "yes", "epoch": ep, "seq": n}
    if q["id"].startswith("A1."):
        body = {"response": "na", "justification": "Not a multi-tenant provider.", "epoch": ep, "seq": n}
    req("PUT", f"/api/assessment/{t2}/answers/{q['id']}", body)
s, r = req("POST", f"/api/assessment/{t2}/submit", {"name": "A Person", "title": "CISO"})
ck("submission succeeds", s == 200, r["result"]["determination"] if s == 200 else json.dumps(r))
s, pdf = req("GET", f"/api/assessment/{t2}/report.pdf")
ck("report PDF still generated", s == 200 and pdf[:5] == b"%PDF-")

print("\n" + ("CLOCK INDEPENDENCE VERIFIED" if not fails else f"{len(fails)} FAILURES: {fails}"))

sys.exit(1 if fails else 0)
