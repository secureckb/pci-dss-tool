import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
const fails = [];
const ck = (l, c, x = '') => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`); if (!c) fails.push(l); };

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=password]', PW);
await page.click('button[type=submit]');
await page.waitForSelector('.card', { timeout: 10000 });
async function make(name) {
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("New assessment")');
  await page.fill('input[type=text] >> nth=0', name);
  await page.selectOption('select', 'merchant');
  await page.click('button:has-text("Create and generate link")');
  await page.waitForSelector('.link-box input');
  const link = await page.locator('.link-box input').inputValue();
  return { link, token: link.split('/q/')[1] };
}
const stored = (t, q, f) => page.evaluate(async ([tk, qi, fi]) => {
  const d = await (await fetch(`/api/assessment/${tk}`)).json();
  return d.answers?.[qi]?.[fi] ?? null;
}, [t, q, f]);

console.log('== 3 (yellow): a justification does not carry across a response change ==');
const { link, token } = await make('Justification Carry Ltd');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// 1.2.6 permits N/A. Mark it N/A with a justification, then switch to CCW.
const q = page.locator('.question', { hasText: '1.2.6' });
await q.locator('.response-option:not(.disabled)', { hasText: 'Not Applicable' }).first().click();
await page.waitForTimeout(300);
await q.locator('textarea').fill('No insecure services are in use.');
await page.waitForTimeout(1200);
ck('N/A justification saved', (await stored(token, '1.2.6', 'justification')) === 'No insecure services are in use.');

await q.locator('.response-option', { hasText: 'Yes with Compensating Control' }).first().click();
await page.waitForTimeout(1200);
const textareaValue = await q.locator('textarea').inputValue();
ck('the box is empty after switching response', textareaValue === '', `"${textareaValue}"`);
ck('server no longer holds the old justification', (await stored(token, '1.2.6', 'justification')) === '',
   `"${await stored(token, '1.2.6', 'justification')}"`);

// And submission must now be blocked until a new description is written.
const navDot = await page.locator('.saq-nav .nav-dot').first().getAttribute('class');
ck('section shows as unfinished', navDot?.includes('nav-dot-todo'), navDot);

console.log('\n== 2 (red): a page-hide flush cannot overwrite a later edit ==');
const { link: link2, token: token2 } = await make('Keepalive Order Ltd');
await page.goto(link2, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(900);

// Type "old", hide the page (keepalive flush fires), then return and type "new".
// Delay the keepalive request so it lands after the newer save.
await page.route('**/api/assessment/*/answers/1.1.1', async (route) => {
  const body = route.request().postDataJSON();
  if (body?.evidence === 'old evidence') {
    await new Promise((r) => setTimeout(r, 1200));
  }
  await route.continue();
});

await page.locator('.question').first().locator('input[type=text]').fill('old evidence');
await page.waitForTimeout(60);
await page.evaluate(() => {
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
});
await page.waitForTimeout(100);
await page.evaluate(() => {
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
});
await page.locator('.question').first().locator('input[type=text]').fill('new evidence');
await page.waitForTimeout(3000);

const finalEvidence = await stored(token2, '1.1.1', 'evidence');
ck('the later edit wins despite the delayed page-hide request',
   finalEvidence === 'new evidence', `stored="${finalEvidence}"`);

console.log('\nERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nPAGE-HIDE FLUSH VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
