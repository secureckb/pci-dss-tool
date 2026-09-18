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
| **Yes with Customized Approach** | Same as above. Description required. |

That produces one of four determinations:

- **Incomplete** — something is unanswered, or a required justification is missing. Submission is blocked.
- **Non-Compliant** — at least one requirement answered No.
- **Compliant — Pending Assessor Review** — nothing failed, but compensating controls or the
  customized approach are in play. These cannot be self-validated; a QSA must review the worksheets.
- **Compliant** — every applicable requirement is in place or justifiably N/A.

Requirements where N/A is never legitimate (documented policies, assigned roles, and similar) have
the Not Applicable option disabled, and the server rejects it too.

## How you use it

1. Sign in at `/admin` with your admin password.
2. Create an assessment: client name, contact, and whether they are a merchant or a service provider.
3. Send the client the generated link. There is no client login — the link is the credential, so
   send it directly to the intended contact.
4. The client answers at their own pace; every answer saves as they go.
5. On submit, answers lock and the result is generated. You see it on the assessment page, and you
   or the client can download the PDFs.
6. If they need to change something, reopen the assessment from the admin page.

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

`npm run build` runs `tsc --noEmit` first, so a type error fails the build.

## Project layout

```
shared/questions/   The SAQ D question bank, one module per requirement, plus Appendix A
shared/scoring.js   Response semantics and the pass/fail engine — used by both server and client
server/             Express API, Postgres access, PDF generation
src/                React SPA: landing, requirement catalogue, questionnaire, results, admin console
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
