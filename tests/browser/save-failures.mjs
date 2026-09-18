import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
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
await page.fill('input[type=text] >> nth=0', 'Fail Mask Ltd');
await page.selectOption('select', 'merchant');
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input');
const link = await page.locator('.link-box input').inputValue();
const token = link.split('/q/')[1];

// Answer everything via the API so only the failing change is outstanding.
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  for (const q of d.sections.flatMap((s) => s.questions)) {
    await fetch(`/api/assessment/${t}/answers/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'yes' }),
    });
  }
}, token);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');

console.log('== a failed change to one answer must not be masked by another succeeding ==');
// 1.1.1's change to "No" fails; 1.1.2's later change succeeds.
await page.route('**/api/assessment/*/answers/1.1.1', (route) =>
  route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"boom"}' })
);

await page.locator('.question').nth(0).locator('.response-option').nth(1).click(); // 1.1.1 -> No (fails)
await page.waitForTimeout(500);
await page.locator('.question').nth(1).locator('.response-option').nth(1).click(); // 1.1.2 -> No (succeeds)
await page.waitForTimeout(900);

const indicator = (await page.locator('.save-state').textContent())?.trim();
ck('save indicator still reports the failure', indicator === 'Not saved', `indicator="${indicator}"`);

const serverState = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return { a: d.answers['1.1.1']?.response, b: d.answers['1.1.2']?.response };
}, token);
ck('server still holds the old value for the failed answer', serverState.a === 'yes', `1.1.1=${serverState.a}`);
ck('the other answer did save', serverState.b === 'no', `1.1.2=${serverState.b}`);

// Submitting must refuse rather than attest the stale value.
await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForTimeout(1500);

ck('submission was refused', !page.url().includes('/results'), page.url().split('/').slice(-1)[0]);
const errText = (await page.locator('.error-text').first().textContent())?.trim() ?? '';
ck('the error names the requirement that failed', errText.includes('1.1.1'), errText.slice(0, 110));

const stillOpen = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return d.assessment.status;
}, token);
ck('the questionnaire was not locked', stillOpen === 'in-progress', stillOpen);

console.log('\n-- once the failing save succeeds, submission proceeds --');
await page.unroute('**/api/assessment/*/answers/1.1.1');
await page.locator('.saq-nav button').first().click();
await page.waitForTimeout(400);
await page.locator('.question').nth(0).locator('.response-option').nth(0).click(); // 1.1.1 -> Yes (now succeeds)
await page.waitForTimeout(1000);
ck('indicator recovers to Saved', (await page.locator('.save-state').textContent())?.trim() === 'Saved');

await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForURL('**/results', { timeout: 15000 }).catch(() => {});
ck('submission now succeeds', page.url().includes('/results'));

console.log('\nCONSOLE ERRORS:', errors.filter((e) => !e.includes('500')).length ? errors : 'none beyond the injected 500');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nFAILURE-MASKING FIX VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
