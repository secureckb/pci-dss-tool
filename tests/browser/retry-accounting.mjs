import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && !/CERT|Failed to load resource/.test(m.text()) && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=password]', PW);
await page.click('button[type=submit]');
await page.waitForSelector('.card', { timeout: 10000 });
await page.click('button:has-text("New assessment")');
await page.fill('input[type=text] >> nth=0', 'Failed Save Slack Ltd');
await page.selectOption('select', 'merchant');
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input');
const link = await page.locator('.link-box input').inputValue();
const token = link.split('/q/')[1];

// Answer everything up front so only the accounting is under test.
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  let n = 1;
  for (const q of d.sections.flatMap((s) => s.questions)) {
    await fetch(`/api/assessment/${t}/answers/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'yes', epoch: d.session.epoch, seq: n++, generation: d.session.generation }),
    });
  }
}, token);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');

console.log("== a save that never reached the server must not buy slack in the accounting ==");
// 1. The first change fails at the network, so the server never sees it.
let aborted = 0;
await page.route('**/api/assessment/*/answers/1.1.1', async (route) => {
  if (aborted === 0) {
    aborted += 1;
    return route.abort('connectionfailed');
  }
  return route.continue();
});
await page.locator('.question').nth(0).locator('.response-option').nth(1).click(); // -> No, fails
await page.waitForTimeout(800);
ck('the failed save is reported', (await page.locator('.save-state').textContent())?.trim() === 'Not saved');

// 2. The client retries the same requirement, and this one lands.
await page.locator('.question').nth(0).locator('.response-option').nth(0).click(); // -> Yes, succeeds
await page.waitForTimeout(900);
ck('the retry recovers', (await page.locator('.save-state').textContent())?.trim() === 'Saved',
   (await page.locator('.save-state').textContent())?.trim());

// 3. Another window changes a different requirement.
await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  await fetch(`/api/assessment/${t}/answers/8.3.1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response: 'no', justification: 'Another window.', epoch: d.session.epoch, seq: 1, generation: d.session.generation }),
  });
}, token);

// 4. This page saves again. Under the old accounting the failed request left a
//    spare unit, and this response would have been accepted as its own.
await page.locator('.question').nth(1).locator('.response-option').nth(1).click();
await page.waitForTimeout(1200);

const indicator = (await page.locator('.save-state').textContent())?.trim();
ck('the page notices the other window despite the earlier failure', /reload/i.test(indicator ?? ''),
   `indicator="${indicator}"`);

await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForTimeout(1500);
ck('and refuses to submit', !page.url().includes('/results'), page.url().split('/').slice(-1)[0]);

const status = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return d.assessment.status;
}, token);
ck('nothing was locked', status === 'in-progress', status);

console.log('\n== a questionnaire reset while the page is open is explained, not just failed ==');
await page.unroute('**/api/assessment/*/answers/1.1.1');
const { id } = await page.evaluate(async () => {
  const list = await (await fetch('/api/admin/assessments')).json();
  return { id: list.assessments.find((a) => a.clientName === 'Failed Save Slack Ltd').id };
});
await page.evaluate(async (assessmentId) => {
  await fetch(`/api/admin/assessments/${assessmentId}/reset-eligibility`, { method: 'POST' });
}, id);
await page.locator('.saq-nav button').first().click();
await page.waitForTimeout(300);
await page.locator('.question').nth(2).locator('.response-option').nth(1).click();
await page.waitForTimeout(1200);
const msg = (await page.locator('.error-text').first().textContent())?.trim() ?? '';
ck('the client is told the questionnaire was reset', /reset|SAQ type was changed/i.test(msg), msg.slice(0, 80));

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nRETRY ACCOUNTING VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
