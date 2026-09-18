#!/usr/bin/env python3
"""End-to-end test of the eligibility wizard flow against the running API."""
import json
import os
import sys
import urllib.request
import urllib.error

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
COOKIE = {}


def req(method, path, body=None, auth=False):
    data = json.dumps(body).encode() if body is not None else None
    headers = {}
    if data:
        headers["Content-Type"] = "application/json"
    if auth and COOKIE:
        headers["Cookie"] = COOKIE["v"]
    r = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(r) as resp:
            if "Set-Cookie" in resp.headers:
                COOKIE["v"] = resp.headers["Set-Cookie"].split(";")[0]
            raw = resp.read()
            return resp.status, (json.loads(raw) if raw and raw[:1] in b"{[" else raw)
    except urllib.error.HTTPError as e:
        raw = e.read()
        return e.code, (json.loads(raw) if raw and raw[:1] in b"{[" else raw)


def ok(label, cond, extra=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}{(' -> ' + str(extra)) if extra else ''}")
    return cond


failures = []


def check(label, cond, extra=""):
    if not ok(label, cond, extra):
        failures.append(label)


print("== public eligibility endpoints ==")
s, tree = req("GET", "/api/eligibility")
check("tree served publicly", s == 200 and tree["firstStep"] == "entity-type", f"{len(tree['steps'])} steps")
check("saq types included", len(tree["saqTypes"]) == 11, sorted(tree["saqTypes"])[:4])

s, out = req("POST", "/api/eligibility", {"answers": {
    "entity-type": "merchant", "storage": "no", "channel": "ecommerce",
    "ecommerce-integration": "redirect-iframe", "tpsp-a": "yes"}})
check("public scoring -> SAQ A", s == 200 and out["saqType"] == "A")

s, out = req("POST", "/api/eligibility", {"answers": {"entity-type": "merchant"}})
check("incomplete answers rejected", s == 400 and out["nextStep"] == "storage")
s, out = req("POST", "/api/eligibility", {"answers": "nope"})
check("malformed answers rejected", s == 400)

print("\n== admin creates an assessment with no SAQ chosen ==")
req("POST", "/api/admin/login", {"password": "test-admin-password-long"})
s, created = req("POST", "/api/admin/assessments", {"clientName": "Wizard Test Co"}, auth=True)
check("created without a variant", s == 201, created.get("token", "")[:8] + "...")
token = created["token"]
aid = created["id"]

s, listing = req("GET", "/api/admin/assessments", auth=True)
row = next(a for a in listing["assessments"] if a["id"] == aid)
check("dashboard shows awaiting eligibility", row["saqName"] is None and row["variant"] is None)

print("\n== client opens the link ==")
s, payload = req("GET", f"/api/assessment/{token}")
check("stage is eligibility", payload["stage"] == "eligibility")
check("no question bank served yet", payload["sections"] is None)
check("tree included for the client", payload["eligibility"]["firstStep"] == "entity-type")

print("\n== questionnaire routes are gated before eligibility ==")
s, r = req("PUT", f"/api/assessment/{token}/answers/1.1.1", {"response": "yes"})
check("cannot answer before routing", s == 409, r.get("error"))
s, r = req("POST", f"/api/assessment/{token}/submit", {"name": "X"})
check("cannot submit before routing", s == 409)
s, r = req("GET", f"/api/assessment/{token}/result")
check("no result before routing", s == 409)
s, r = req("GET", f"/api/admin/assessments/{aid}/report.pdf", auth=True)
check("no PDF before routing", s == 409)

print("\n== a client routed away from SAQ D ==")
s, r = req("POST", f"/api/assessment/{token}/eligibility", {"answers": {
    "entity-type": "merchant", "storage": "no", "channel": "ecommerce",
    "ecommerce-integration": "redirect-iframe", "tpsp-a": "yes"}})
check("wizard records SAQ A", s == 200 and r["saqType"] == "A" and r["administered"] is False)
s, payload = req("GET", f"/api/assessment/{token}")
check("stage becomes not-administered", payload["stage"] == "not-administered")
check("eligibility record stored", payload["assessment"]["eligibility"]["saqType"] == "A")
check("path recorded", len(payload["assessment"]["eligibility"]["path"]) == 5)
s, r = req("PUT", f"/api/assessment/{token}/answers/1.1.1", {"response": "yes"})
check("still cannot answer SAQ D questions", s == 409)

print("\n== client corrects their answers ==")
s, r = req("POST", f"/api/assessment/{token}/eligibility/reset")
check("reset allowed while nothing answered", s == 200)
s, payload = req("GET", f"/api/assessment/{token}")
check("back to the wizard", payload["stage"] == "eligibility")

print("\n== a client routed to SAQ D ==")
s, r = req("POST", f"/api/assessment/{token}/eligibility", {"answers": {
    "entity-type": "merchant", "storage": "yes"}})
check("storage routes to SAQ D merchant", s == 200 and r["saqType"] == "D-Merchant" and r["administered"] is True)
check("note explains why", any("rules out every shorter SAQ" in n["note"] for n in r["notes"]))
s, payload = req("GET", f"/api/assessment/{token}")
check("stage becomes questionnaire", payload["stage"] == "questionnaire")
check("merchant bank served", sum(len(x["questions"]) for x in payload["sections"]) == 234)
s, r = req("PUT", f"/api/assessment/{token}/answers/1.1.1", {"response": "yes"})
check("can now answer", s == 200)

print("\n== SAQ type cannot be changed once answering has started ==")
s, r = req("POST", f"/api/assessment/{token}/eligibility", {"answers": {"entity-type": "service-provider"}})
check("re-run blocked after answers exist", s == 409, r.get("error"))
s, r = req("POST", f"/api/assessment/{token}/eligibility/reset")
check("client reset blocked after answers exist", s == 409)

print("\n== the server does not trust a client-supplied outcome ==")
s, r = req("POST", f"/api/assessment/{token}/eligibility",
           {"answers": {"entity-type": "merchant", "storage": "yes"}, "saqType": "A", "variant": None})
check("posted saqType ignored (blocked anyway)", s == 409)

print("\n== assessor reset clears the determination and its answers ==")
s, r = req("POST", f"/api/admin/assessments/{aid}/reset-eligibility", auth=True)
check("assessor reset ok", s == 200)
s, detail = req("GET", f"/api/admin/assessments/{aid}", auth=True)
check("variant cleared", detail["assessment"]["variant"] is None)
check("result is null", detail["result"] is None)
check("answers deleted", len(detail["answers"]) == 0)

print("\n== admin may still pre-select a variant ==")
s, preset = req("POST", "/api/admin/assessments",
                {"clientName": "Preset Co", "variant": "service-provider"}, auth=True)
check("created with a preset variant", s == 201)
s, payload = req("GET", f"/api/assessment/{preset['token']}")
check("skips straight to the questionnaire", payload["stage"] == "questionnaire")
check("service provider bank served", sum(len(x["questions"]) for x in payload["sections"]) == 260)
s, r = req("POST", "/api/admin/assessments", {"clientName": "Bad Co", "variant": "nonsense"}, auth=True)
check("invalid variant rejected", s == 400)

print("\n" + ("ALL CHECKS PASSED" if not failures else f"{len(failures)} FAILURES: {failures}"))

sys.exit(1 if failures else 0)
