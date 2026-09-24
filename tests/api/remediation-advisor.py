#!/usr/bin/env python3
"""The remediation advisor's HTTP surface, and the guards in front of it.

Nothing here calls a model. What is worth checking without one is everything
around the call: that the advisor is assessor-only, that a deployment with no
key still works and says so, that a run is refused when there is nothing to
remediate, and that a second click does not start a second run.

The second half starts its own server with a placeholder key, because the
guards that matter for cost all sit in front of the first API call and are
unreachable on a deployment where the advisor is switched off.
"""
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
PW = os.environ.get("ADMIN_PASSWORD", "test-admin-password-long")
fails = []


def ck(label, cond, extra=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}" + (f" -> {extra}" if extra else ""))
    if not cond:
        fails.append(label)


def make_client(base):
    jar = {}

    def req(method, path, body=None, auth=False):
        data = json.dumps(body).encode() if body is not None else None
        headers = {"Content-Type": "application/json"} if data else {}
        if auth and "v" in jar:
            headers["Cookie"] = jar["v"]
        r = urllib.request.Request(base + path, data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(r, timeout=30) as x:
                if "Set-Cookie" in x.headers:
                    jar["v"] = x.headers["Set-Cookie"].split(";")[0]
                raw = x.read()
                return x.status, (json.loads(raw) if raw[:1] in b"{[" else raw)
        except urllib.error.HTTPError as e:
            raw = e.read()
            return e.code, (json.loads(raw) if raw[:1] in b"{[" else raw)

    return req


# ---------------------------------------------------------------- unconfigured
req = make_client(BASE)

print("== the advisor is reachable only by the assessor ==")
st, _ = req("GET", "/api/admin/assessments/00000000-0000-4000-8000-000000000000/remediation")
ck("reading a plan without a session is refused", st == 401, str(st))
st, _ = req("POST", "/api/admin/assessments/00000000-0000-4000-8000-000000000000/remediation")
ck("starting a run without a session is refused", st == 401, str(st))

req("POST", "/api/admin/login", {"password": PW})
_, created = req("POST", "/api/admin/assessments",
                 {"clientName": "Advisor Unconfigured Ltd", "variant": "merchant"}, auth=True)
aid = created["id"]

print("\n-- a deployment with no key still works, and says why the advisor is idle --")
st, state = req("GET", f"/api/admin/assessments/{aid}/remediation", auth=True)
ck("the advisor's state is readable", st == 200, str(st))
ck("it reports itself unconfigured", state.get("configured") is False, str(state.get("configured")))
ck("with no plan and no runs", state.get("plan") is None and state.get("runs") == [])

st, body = req("POST", f"/api/admin/assessments/{aid}/remediation", auth=True)
ck("a run is refused with a reason, not a 500", st == 503, str(st))
ck("and the reason names the variable to set", "ANTHROPIC_API_KEY" in str(body.get("error")), str(body.get("error"))[:80])

print("\n-- the rest of the tool is unaffected by the advisor being off --")
st, _ = req("GET", f"/api/admin/assessments/{aid}", auth=True)
ck("the assessment still scores", st == 200, str(st))
st, _ = req("GET", f"/api/admin/assessments/{aid}/report.pdf", auth=True)
ck("the report still generates", st == 200, str(st))

print("\n-- a plan id from somewhere else is not accepted --")
st, _ = req("POST", f"/api/admin/assessments/{aid}/remediation/00000000-0000-4000-8000-0000000000ff/approve",
            auth=True)
ck("approving an unrelated plan is a 404", st == 404, str(st))


# ------------------------------------------------------------------ configured
# A placeholder key is enough to get past the configuration check. Every
# assertion below is about a guard that returns before any model is called.
PORT = int(os.environ.get("TEST_PORT", "8099")) - 2
CONFIGURED_BASE = f"http://localhost:{PORT}"
env = dict(os.environ)
env.update({
    "PORT": str(PORT),
    "PUBLIC_BASE_URL": CONFIGURED_BASE,
    "ANTHROPIC_API_KEY": "sk-ant-placeholder-not-a-real-key",
    "NODE_ENV": "test",
})
server = subprocess.Popen(["node", "server/index.js"], env=env,
                          stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

try:
    ready = False
    deadline = time.time() + 25
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{CONFIGURED_BASE}/api/health", timeout=3) as x:
                if x.status == 200:
                    ready = True
                    break
        except Exception:
            time.sleep(0.3)
    ck("a second server starts with the advisor configured", ready)

    if ready:
        req2 = make_client(CONFIGURED_BASE)
        req2("POST", "/api/admin/login", {"password": PW})

        print("\n== with the advisor on, a run still has to be worth making ==")
        _, blank = req2("POST", "/api/admin/assessments", {"clientName": "Advisor No Variant Ltd"}, auth=True)
        st, body = req2("POST", f"/api/admin/assessments/{blank['id']}/remediation", auth=True)
        ck("an assessment with no questionnaire cannot be remediated", st == 409, str(st))
        ck("and says so", "nothing to remediate" in str(body.get("error")), str(body.get("error"))[:80])

        _, fresh = req2("POST", "/api/admin/assessments",
                        {"clientName": "Advisor Unanswered Ltd", "variant": "merchant"}, auth=True)
        st, body = req2("POST", f"/api/admin/assessments/{fresh['id']}/remediation", auth=True)
        # The guard that matters most for cost: an unanswered questionnaire has
        # no failed requirements, so there is nothing to draft and no run is
        # started. Without this, opening the console on a new assessment and
        # clicking would bill for advice about nothing.
        ck("an unanswered questionnaire is refused before any model call", st == 409, str(st))
        ck("and says nothing needs remediation",
           "needs remediation" in str(body.get("error")), str(body.get("error"))[:80])

        st, state = req2("GET", f"/api/admin/assessments/{fresh['id']}/remediation", auth=True)
        ck("the advisor now reports itself configured", state.get("configured") is True)
        ck("and no run was recorded for the refusal", state.get("runs") == [], str(state.get("runs")))

        print("\n-- once something has failed, a run starts, and only one --")
        tok = fresh["token"]
        # Both servers share the test database, so the client link opened here is
        # the same assessment the console above is looking at.
        _, load = req2("GET", f"/api/assessment/{tok}")
        session = load["session"]
        st, _ = req2("PUT", f"/api/assessment/{tok}/answers/1.1.1",
                     {"response": "no", "justification": "Not yet in place.",
                      "epoch": session["epoch"], "seq": 1})
        ck("a requirement can be failed", st == 200, str(st))

        st, started = req2("POST", f"/api/admin/assessments/{fresh['id']}/remediation", auth=True)
        ck("a run is accepted and left to work in the background", st == 202, str(st))
        ck("and it reports the run it started", bool(started.get("runId")), str(started)[:80])
        ck("counting the gap it will work on", started.get("gapCount") == 1, str(started.get("gapCount")))

        st, again = req2("POST", f"/api/admin/assessments/{fresh['id']}/remediation", auth=True)
        ck("a second click does not start a second run", st == 409, str(st))
        ck("and points at the run already going", bool(again.get("running")), str(again)[:80])

        st, state = req2("GET", f"/api/admin/assessments/{fresh['id']}/remediation", auth=True)
        ck("the run is visible while it works", state.get("running") is not None)
        ck("and is in the run log", len(state.get("runs", [])) == 1, str(len(state.get("runs", []))))
finally:
    server.terminate()
    try:
        server.wait(timeout=10)
    except subprocess.TimeoutExpired:
        server.kill()

print(f"\n{len(fails)} FAILURES: {fails}" if fails else "\nREMEDIATION ADVISOR VERIFIED")
sys.exit(1 if fails else 0)
