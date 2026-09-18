# Tests

These are the suites that were written while building this tool, one per defect
found. They run against a real server and a real Postgres, because most of what
they cover — write ordering, locking, page-hide flushes, two windows editing the
same assessment — does not exist in a mocked one.

## Running them

```bash
createdb pci_saq_test
TEST_DATABASE_URL=postgres://postgres@localhost:5432/pci_saq_test npm test
```

`TEST_DATABASE_URL` is required and is **truncated between suites**. It is
deliberately not `DATABASE_URL`, so no test run is one typo away from emptying a
real database.

Narrow it down while working:

```bash
npm test -- api                # one folder
npm test -- second-window      # one suite, by name
```

The runner starts a fresh server and empties the database before each suite.
Both matter: sign-in lockouts live in server memory, and suites find
assessments in the admin table by client name, so leftovers make those
selectors ambiguous.

The browser suites need a built front end (`npm run build`) and Chromium
(`npx playwright install chromium`). Set `CHROMIUM_PATH` if you want a specific
binary.

## Layout

| Folder | Runtime | What it covers |
| --- | --- | --- |
| `unit/` | Node | Functions that can be checked without a server |
| `api/` | Python 3 | HTTP behaviour, concurrency, storage, transport |
| `browser/` | Node + Playwright | What a client and an assessor actually see |

The API suites are plain Python with no dependencies beyond the standard
library — they are the scripts that reproduced each defect, kept as they were
rather than rewritten.

## What each suite holds

### `unit/`

| Suite | Covers |
| --- | --- |
| `https-gate` | Which requests may sign in: direct TLS, a proxy on the private network, a spoofed forwarded header, localhost |

### `api/`

| Suite | Covers |
| --- | --- |
| `eligibility-routing` | Every path through the wizard, and that the server recomputes the outcome rather than trusting the client |
| `eligibility-rules` | The narrower SAQs' conditions — a validated provider, an isolated workstation |
| `input-limits` | Oversized and non-string text, and that a successful sign-in does not clear accumulated failures |
| `mutation-races` | Answer saves racing an eligibility change, a reset, a reopen, and a submission |
| `submit-race` | Thirty rounds of a submission racing a save: what is attested always matches what is stored |
| `answer-ordering` | Out-of-order writes within one page, and clears keeping their watermark |
| `clock-independence` | A device with a slow clock is not locked out by a fast one |
| `saq-responses-and-login` | The customized approach is refused, and a burst of sign-in attempts is shed |
| `attestation-revision` | A window cannot attest to answers another window changed |
| `questionnaire-generation` | A write from before a reset cannot restore deleted answers |
| `reopen-and-snapshots` | Reopening does not revive tabs open at submission; reports are read from one snapshot |
| `https-enforcement` | Plaintext is redirected with no way out of it, and the health check stays reachable |

### `browser/`

| Suite | Covers |
| --- | --- |
| `smoke` | Sign in, create an assessment, open the link, answer, reload |
| `saq-wizard` | The public wizard: routing, going back, the explanation with each outcome |
| `requirements-page` | The catalogue: search, filters, section browsing, deep links |
| `questionnaire-ui` | Responses, justifications, and what the section navigation reports |
| `admin-console` | A client routed away from SAQ D, and what a reset does |
| `autosave-text` | Text typed during a save, and leaving the page mid-debounce |
| `save-failures` | A failed save is not masked by another succeeding, and blocks submission |
| `page-hide-flush` | A flush on page-hide cannot overwrite the edit that followed it |
| `second-window` | A second window is detected, and the first refuses to submit |
| `wizard-then-answer` | Answers given after the wizard are still ordered |
| `scope-and-cross-window` | The scope summary is shown; a cross-window change blocks submission |
| `retry-accounting` | A save that failed at the network does not hide another window's edit |
