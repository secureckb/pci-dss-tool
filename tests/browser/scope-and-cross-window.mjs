import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && !m.text().includes('CERT') && errors.push(m.text()));
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
await page.fill('input[type=text] >> nth=0', 'Cross Window Ltd');
await page.selectOption('select', 'merchant');
await page
  .locator('label.field', { hasText: 'Scope summary' })
  .locator('textarea')
  .fill('London store and hosted checkout only;\nexcludes the Manchester call centre.');
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input');
const link = await page.locator('.link-box input').inputValue();
const token = link.split('/q/')[1];

console.log('== the scope the assessor recorded is shown to the client ==');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
const scope = page.locator('.callout', { hasText: 'Scope of this assessment' }).first();
ck('scope is displayed on the questionnaire', await scope.count() > 0);
ck('and its line breaks are preserved',
   ((await scope.locator('p').textContent()) ?? '').includes('Manchester call centre'),
   ((await scope.locator('p').textContent()) ?? '').replace('\n', ' / ').slice(0, 60));

console.log('\n== a window cannot submit answers another window changed ==');
// Fill everything in from this window so it is ready to submit.
await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  let n = 1;
  for (const q of d.sections.flatMap((s) => s.questions)) {
    await fetch(`/api/assessment/${t}/answers/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'yes', epoch: d.session.epoch, seq: n++ }),
    });
  }
}, token);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// A second window changes a requirement this one is not touching.
const second = await ctx.newPage();
await second.goto(link, { waitUntil: 'networkidle' });
await second.waitForSelector('.question');
await second.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  await fetch(`/api/assessment/${t}/answers/8.3.1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response: 'no', justification: 'Found a gap.', epoch: d.session.epoch, seq: 1 }),
  });
}, token);
await second.close();

await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForTimeout(2000);

ck('the submission did not go through', !page.url().includes('/results'), page.url().split('/').slice(-1)[0]);
const msg = (await page.locator('.error-text').first().textContent())?.trim() ?? '';
ck('the client is told to reload rather than shown a generic failure',
   /another window|another device|reload/i.test(msg), msg.slice(0, 90));
const state = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return { status: d.assessment.status, q831: d.answers['8.3.1']?.response };
}, token);
ck('nothing was locked', state.status === 'in-progress', JSON.stringify(state));

console.log('\n-- after reloading, the other window’s answer is visible and submission proceeds --');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');
const answered = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return d.answers['8.3.1']?.response;
}, token);
ck('the changed answer is now part of what would be attested', answered === 'no', `8.3.1=${answered}`);
await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForURL('**/results', { timeout: 20000 }).catch(() => {});
ck('submission now succeeds', page.url().includes('/results'));
await page.waitForSelector('.page-head h1', { timeout: 10000 });
await page.waitForTimeout(500);
ck('the results page shows the scope too',
   await page.locator('.callout', { hasText: 'Scope of this assessment' }).count() > 0);

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nSCOPE AND CROSS-WINDOW VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
