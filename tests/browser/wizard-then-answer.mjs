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

async function newAssessment(name, variant) {
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("New assessment")');
  await page.fill('input[type=text] >> nth=0', name);
  if (variant) await page.selectOption('select', variant);
  await page.click('button:has-text("Create and generate link")');
  await page.waitForSelector('.link-box input', { timeout: 10000 });
  const link = await page.locator('.link-box input').inputValue();
  return { link, token: link.split('/q/')[1] };
}

console.log('== 1 (red): answers saved after the wizard must still be ordered ==');
// No preset variant, so the client runs the eligibility wizard first — the path
// where the questionnaire's ordering epoch arrives on a later payload.
const { link } = await newAssessment('Wizard Then Answer Ltd', null);
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.choice');
const pick = async (label) => {
  await page.locator('.choice', { hasText: label }).first().click();
  await page.waitForTimeout(200);
};
await pick('A merchant');
await pick('Yes, we store');
await page.locator('button:has-text("Confirm and continue")').click();
await page.waitForSelector('.question', { timeout: 15000 });

const sent = [];
await page.route('**/api/assessment/*/answers/*', async (route) => {
  try {
    sent.push(JSON.parse(route.request().postData() ?? '{}'));
  } catch {
    /* ignore */
  }
  await route.continue();
});
await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(1000);

ck('the save carried an epoch', sent.length > 0 && typeof sent[0].epoch === 'number',
   `epoch=${JSON.stringify(sent[0]?.epoch)}`);
ck('and a sequence number', typeof sent[0]?.seq === 'number', `seq=${JSON.stringify(sent[0]?.seq)}`);
await page.unroute('**/api/assessment/*/answers/*');

console.log('\n-- so a second window is still detected --');
const second = await ctx.newPage();
await second.goto(link, { waitUntil: 'networkidle' });
await second.waitForSelector('.question');
await second.locator('.question').first().locator('.response-option').nth(1).click();
await second.waitForTimeout(900);
await page.locator('.question').first().locator('.response-option').nth(1).click();
await page.waitForTimeout(1200);
const indicator = (await page.locator('.save-state').textContent())?.trim();
ck('the older window is warned rather than told it saved', /reload/i.test(indicator ?? ''),
   `indicator="${indicator}"`);
await second.close();

console.log('\n== 2 (red): answers cannot change once submission has started ==');
const { link: link2, token: token2 } = await newAssessment('Freeze On Submit Ltd', 'merchant');
await page.goto(link2, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
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
}, token2);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// Hold the submit request open so the window between flush and lock is wide.
await page.route('**/api/assessment/*/submit', async (route) => {
  await new Promise((r) => setTimeout(r, 2500));
  await route.continue();
});
await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForTimeout(700);

// Go back to the first section and try to change an answer mid-submission.
await page.locator('.saq-nav button').first().click();
await page.waitForTimeout(300);
const firstCard = page.locator('.question').first();
ck('response controls are disabled while submitting',
   await firstCard.locator('.response-option input').first().isDisabled());
ck('evidence field is disabled too', await firstCard.locator('input[type=text]').first().isDisabled());

await firstCard.locator('.response-option').nth(1).click({ force: true });
await page.waitForTimeout(400);
const onScreen = await firstCard.locator('.response-option.selected, .response-option.selected-no').first().textContent();
ck('the displayed answer did not change', (onScreen ?? '').includes('Yes'), `shows "${(onScreen ?? '').trim()}"`);

await page.waitForURL('**/results', { timeout: 20000 }).catch(() => {});
ck('submission completed', page.url().includes('/results'), page.url().split('/').slice(-1)[0]);

const stored = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}/result`)).json();
  return { determination: d.result.determination, status: d.assessment.status };
}, token2);
ck('the attested result matches what was on screen', stored.determination === 'compliant',
   JSON.stringify(stored));

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nORDERING AFTER THE WIZARD VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
