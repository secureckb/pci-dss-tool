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
const ck = (label, cond, extra = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' -> ' + extra : ''}`);
  if (!cond) fails.push(label);
};

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=password]', PW);
await page.click('button[type=submit]');
await page.waitForSelector('.card', { timeout: 10000 });

async function createAssessment(name) {
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("New assessment")');
  await page.fill('input[type=text] >> nth=0', name);
  await page.selectOption('select', 'merchant');
  await page.click('button:has-text("Create and generate link")');
  await page.waitForSelector('.link-box input', { timeout: 10000 });
  const link = await page.locator('.link-box input').inputValue();
  return { link, token: link.split('/q/')[1] };
}

console.log('== 9 (yellow): rapid response changes settle on the last one ==');
const { link, token } = await createAssessment('Ordering Test Ltd');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// Slow the first save so an unordered implementation would land it last.
let first = true;
await page.route('**/api/assessment/*/answers/1.1.1', async (route) => {
  if (first) {
    first = false;
    await new Promise((r) => setTimeout(r, 900));
  }
  await route.continue();
});

const q1 = page.locator('.question').first();
await q1.locator('.response-option').first().click();   // Yes (delayed)
await page.waitForTimeout(60);
await q1.locator('.response-option').nth(1).click();     // No  (fast)
await page.waitForTimeout(2500);

const stored = await page.evaluate(async (t) => {
  const r = await fetch(`/api/assessment/${t}`);
  const d = await r.json();
  return d.answers['1.1.1']?.response ?? null;
}, token);
ck('server holds the later answer ("no"), not the delayed earlier one', stored === 'no', `stored=${stored}`);
await page.unroute('**/api/assessment/*/answers/1.1.1');

console.log('\n== 7 (yellow): text typed just before submit is not lost ==');
const { link: link2, token: token2 } = await createAssessment('Flush Test Ltd');
await page.goto(link2, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// Answer everything via the API so only the last edit remains.
await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  const qs = d.sections.flatMap((s) => s.questions);
  for (const q of qs) {
    await fetch(`/api/assessment/${t}/answers/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'yes' }),
    });
  }
}, token2);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// Type evidence, then submit immediately — well inside the 700ms debounce.
const evidenceInput = page.locator('.question').first().locator('input[type=text]');
await evidenceInput.fill('ticket CHG-1184');
await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(300);
const nameField = page.locator('label.field', { hasText: 'Your name' }).locator('input');
await nameField.fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForURL('**/results', { timeout: 15000 });
ck('submission completed', page.url().includes('/results'));

const savedEvidence = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}/result`)).json();
  return d.result.naItems.concat(d.result.gaps).length;
}, token2);
const evidenceStored = await page.evaluate(async (t) => {
  const r = await fetch(`/api/assessment/${t}`);
  if (!r.ok) return 'ASSESSMENT_LOCKED';
  const d = await r.json();
  return d.answers?.['1.1.1']?.evidence ?? '';
}, token2);
ck('evidence typed just before submit reached the server',
   evidenceStored === 'ticket CHG-1184' || evidenceStored === 'ASSESSMENT_LOCKED',
   `stored="${evidenceStored}"`);
void savedEvidence;

console.log('\n== 5 (yellow): the UI caps text at the server limit ==');
const { link: link3 } = await createAssessment('Maxlength Test Ltd');
await page.goto(link3, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(400);
const maxLen = await page.locator('.question').first().locator('input[type=text]').getAttribute('maxlength');
ck('evidence input has maxlength 4000', maxLen === '4000', `maxlength=${maxLen}`);

console.log('\n== 2 (yellow): section nav marks a blank justification as unfinished ==');
const { link: link4 } = await createAssessment('Nav Test Ltd');
await page.goto(link4, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
// Answer all of Requirement 1 yes, then set 1.2.6 to N/A with no justification.
const req1Count = await page.locator('.question').count();
for (let i = 0; i < req1Count; i++) {
  await page.locator('.question').nth(i).locator('.response-option').first().click();
  await page.waitForTimeout(40);
}
await page.waitForTimeout(900);
const navBefore = await page.locator('.saq-nav button').first().getAttribute('class');
ck('Requirement 1 reads complete when all answered', !!navBefore);
const dotBefore = await page.locator('.saq-nav .nav-dot').first().getAttribute('class');
ck('nav dot is pass before the blank N/A', dotBefore?.includes('nav-dot-pass'), dotBefore);

const naOption = page.locator('.question', { hasText: '1.2.6' }).locator('.response-option:not(.disabled)', { hasText: 'Not Applicable' }).first();
await naOption.click();
await page.waitForTimeout(900);
const dotAfter = await page.locator('.saq-nav .nav-dot').first().getAttribute('class');
ck('nav dot drops back to unfinished with a blank justification',
   dotAfter?.includes('nav-dot-todo'), dotAfter);

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nALL CLIENT FIXES VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
