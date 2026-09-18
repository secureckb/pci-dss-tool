# PCI DSS v4.0.1 Self-Assessment Questionnaire D

A self-assessment tool for consultants to hand to clients. You create an assessment, send the
client a private link, and they work through the full SAQ D question bank. The tool applies PCI
DSS pass/fail rules and produces a determination, a gap remediation report, and a draft
attestation summary.

## What it covers

The complete SAQ D question bank for PCI DSS v4.0.1, in both official editions:

| Edition | Applicable requirements |
| --- | --- |
| SAQ D for Merchants | 234 |
| SAQ D for Service Providers | 260 |

All twelve requirements, plus Appendix A1 (multi-tenant service providers) and Appendix A2
(entities using SSL/early TLS for POS POI connections). The service provider edition adds the
requirements marked "Additional requirement for service providers only" — 3.3.3, 3.6.1.1, 3.7.9,
8.2.3, 8.3.10, 8.3.10.1, 10.7.1, 11.4.6, 11.4.7, 11.5.1.1, 12.4.1, 12.4.2, 12.4.2.1, 12.5.2.1,
12.5.3, 12.9.1, 12.9.2, A2.1.2, A2.1.3, and all of Appendix A1.

Each question carries the official requirement text and a summary of what an assessor would
examine, so clients can answer without a copy of the standard open beside them.

## Choosing the right SAQ

Clients do not pick their own questionnaire. Which SAQ applies is decided by how an organisation
takes payments and what account data it holds, so the first thing a client sees is a short
eligibility wizard, and their answers set the SAQ type for the assessment.

The wizard is at most six questions deep and routes to any of the eleven outcomes: SAQ A, A-EP, B,
B-IP, C, C-VT, P2PE, SPoC, D for Merchants, D for Service Providers, or "needs review with your
assessor" when the answers genuinely do not settle it. Every result explains why it was reached,
lists what that SAQ assumes about the client, and shows the trail of answers that produced it.

**This tool administers SAQ D only.** A client routed to any other SAQ is told which one applies
and that you will follow up; the questionnaire does not start, and the server refuses every
questionnaire route for that assessment. Adding another bank later means setting `variant` on that
type in `shared/eligibility.js` and building the matching question modules — the decision tree does
not change.

Three things are worth knowing about how it behaves:

- **The server decides, not the browser.** The outcome is always recomputed from the recorded
  answers, so a client cannot select their own questionnaire by posting a result. Answers to
  questions that are no longer on the path are pruned before storage.
- **Changing the SAQ type is deliberate.** A client can re-run the wizard freely until they answer
  their first questionnaire question. After that the type is fixed, because changing it would
  orphan their answers — you reset it from the admin page, which deletes those answers with it.
- **The determination is kept.** The client's answers and the resulting path are stored with the
  assessment as a record of how the scope was set, and shown on the admin page.

You can still pre-select SAQ D for Merchants or Service Providers when creating an assessment,
which skips the wizard entirely.

A public version runs at `/which-saq` with nothing recorded and no link required — useful for
scoping calls and for prospects.

## The requirement catalogue

`/requirements` is a public, read-only reference for everything in the question bank — useful for
scoping a client before you send them a link, and for clients who want to see what they will be
asked. It lists every requirement with its PCI DSS text, the testing procedures an assessor would
follow, whether Not Applicable is permitted and on what condition, and whether the requirement is
service-provider-only.

- Search by requirement number (`8.4`) or by text (`multi-factor`).
- Filter to one edition, or to only the requirements where N/A is permitted.
- Browse one requirement at a time, or show all 260 at once for printing.
- Deep link to any requirement with a hash, e.g. `/requirements#8.4.2`.

It exposes no client data. The page is served from `GET /api/requirements`, which returns the
question bank together with the response options and determinations from `shared/scoring.js`, so
the documented rules cannot drift from the ones the server applies.

## How the determination works

PCI DSS validation is strictly pass/fail — there is no partial credit and no percentage score.
The tool scores exactly that way:

| Response | Effect |
| --- | --- |
| **Yes** | Requirement is in place. |
| **No** | **Fails the whole assessment.** Appears on the gap remediation plan. |
| **Not Applicable** | Passes, but a written justification is **required**. Only offered on requirements where N/A is legitimate. |
| **Yes with Compensating Control** | Passes, but holds the result at *pending assessor review*. Description required. |

There is deliberately no customized-approach response. An SAQ cannot be used to document the
customized approach — the customized approach objectives are not included in the SAQs, and an entity
validating that way uses the ROC template instead. Requirement 12.3.2 still asks about the targeted
risk analysis behind a customized approach, because it is part of SAQ D; an entity not using one
marks it Not Applicable.

That produces one of four determinations:

- **Incomplete** — something is unanswered, or a required justification is missing. Submission is blocked.
- **Non-Compliant** — at least one requirement answered No.
- **Compliant — Pending Assessor Review** — nothing failed, but compensating controls are in play.
  A compensating control cannot be self-validated; a QSA must review the Appendix C worksheet.
- **Compliant** — every applicable requirement is in place or justifiably N/A.

Requirements where N/A is never legitimate (documented policies, assigned roles, and similar) have
the Not Applicable option disabled, and the server rejects it too.

## How you use it

1. Sign in at `/admin` with your admin password.
2. Create an assessment with the client's name and contact. Leave the SAQ type for the client to
   determine, or pre-select SAQ D for Merchants or Service Providers.
3. Send the client the generated link. There is no client login — the link is the credential, so
   send it directly to the intended contact.
4. The client answers the eligibility questions, which set the SAQ type. If that is SAQ D they
   continue straight into the questionnaire; if it is any other SAQ they are told which one applies
   and stop there.
5. The client answers at their own pace; every answer saves as they go.
6. On submit, answers lock and the result is generated. You see it on the assessment page, and you
   or the client can download the PDFs.
7. If they need to change something, reopen the assessment from the admin page. To change the SAQ
   type itself, reset the determination — which also deletes the answers it would orphan.

## Deploying on Railway

1. Push this repository to GitHub, then **New Project → Deploy from GitHub repo** in Railway.
2. Add the Postgres plugin to the project (**New → Database → Add PostgreSQL**). Railway injects
   `DATABASE_URL` automatically; the schema is created on first boot.
3. Set these service variables:

   | Variable | Required | Notes |
   | --- | --- | --- |
   | `ADMIN_PASSWORD` | yes | Your admin console password. The server refuses to start without it. |
   | `SESSION_SECRET` | yes | Signs the admin session cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
   | `DATABASE_URL` | yes | Provided by the Postgres plugin. |
   | `PUBLIC_BASE_URL` | recommended | e.g. `https://your-app.up.railway.app`. Used to build client links. Without it, links are built from the request host. |
   | `REQUIRE_HTTPS` | no | Plain HTTP is redirected to HTTPS by default, since a client link is a bearer credential. Set to `0` only for an instance you accept is plaintext. Localhost and `/api/health` are exempt. A proxy terminating TLS in front of this service must set `X-Forwarded-Proto`, or requests will be redirected back to it. |
   | `DATABASE_SSL` | no | Remote Postgres connections verify the server certificate by default. Set `no-verify` to encrypt without verifying (the connection is then not authenticated), or `off` for a private network with no TLS. |
   | `DATABASE_CA` | no | PEM for a private root certificate, if your provider publishes one. |
   | `PORT` | no | Railway sets this. |

4. Generate a domain under **Settings → Networking**, then set `PUBLIC_BASE_URL` to it and redeploy
   so the client links point at the right host.

`railway.json` already sets the build command, start command, and a health check on `/api/health`.
Any host that runs Node 20+ with a Postgres database works the same way — there is nothing
Railway-specific in the application code.

## Running locally

```bash
npm install
cp .env.example .env          # fill in ADMIN_PASSWORD, SESSION_SECRET, DATABASE_URL
npm run dev                   # API on :8080, Vite dev server on :5173 proxying /api
```

Open http://localhost:5173. For a production-style run:

```bash
npm run build && npm start    # serves the built SPA and the API on :8080
```

`npm run build` runs `npm run verify` and `tsc --noEmit` first, so a type error or a
broken question bank fails the build.

`npm run verify` asserts the invariants a reader would otherwise have to check by hand:
that each edition holds exactly the number of requirements the tool claims (234 and 260),
that no requirement id is duplicated, that every N/A-eligible requirement says when N/A
applies, that every eligibility step is reachable and every SAQ outcome can actually be
reached from the tree.

## Project layout

```
shared/questions/     The SAQ D question bank, one module per requirement, plus Appendix A
shared/scoring.js     Response semantics and the pass/fail engine — used by server and client
shared/eligibility.js The SAQ decision tree and the eleven outcomes it routes to
server/               Express API, Postgres access, PDF generation
src/                  React SPA: landing, SAQ wizard, requirement catalogue, questionnaire, results, admin
```

The scoring engine and the question bank are shared by the server and the browser, so the progress
shown while answering and the determination on the server can never disagree.

### Amending the question bank

Edit the relevant `shared/questions/reqNN.js`. Each question is:

```js
{
  id: '1.2.3',
  title: 'Network diagram',
  question: 'Is an accurate network diagram(s) maintained that ...?',
  requirement: 'An accurate network diagram(s) is maintained that ...',
  testing: ['Examine the diagram(s) ...'],
  appliesTo: 'all',        // or 'service-provider'
  allowNA: false,          // true only where N/A is legitimate
  condition: 'Mark N/A only if ...',   // shown when allowNA is true
}
```

Existing answers are stored by requirement id, so renaming an id orphans previously recorded
answers for that requirement. The requirement catalogue at `/requirements` is generated from these
modules, so it updates with them and needs no separate edit.

## Scope and limitations

This tool records a self-assessment. It is not affiliated with or endorsed by the PCI Security
Standards Council, and it does not produce an official SAQ or a signed Attestation of Compliance.
A "Compliant" determination means no applicable requirement was answered No — it does not verify
that the answers are accurate, that the described scope is correct, or that supporting evidence
exists. The official SAQ D and AOC forms must be obtained from the PCI SSC Document Library,
completed, and signed before submission to an acquirer or payment brand.

Client links are unguessable (128 bits of entropy) but are bearer credentials: anyone holding a
link can read and answer that questionnaire. Send them directly to the intended contact, and
delete assessments you no longer need.

Admin sign-in requires HTTPS. If the deployment is reachable over plain HTTP the login is
refused rather than issuing a session cookie in clear text; `localhost` is exempt so local
development still works. Railway terminates TLS and forwards `X-Forwarded-Proto`, so a normal
deployment is unaffected.
