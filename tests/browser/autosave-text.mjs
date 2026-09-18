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

async function newAssessment(name) {
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("New assessment")');
  await page.fill('input[type=text] >> nth=0', name);
  await page.selectOption('select', 'merchant');
  await page.click('button:has-text("Create and generate link")');
  await page.waitForSelector('.link-box input', { timeout: 10000 });
  const link = await page.locator('.link-box input').inputValue();
  return { link, token: link.split('/q/')[1] };
}

const stored = (token, qid, field) =>
  page.evaluate(
    async ([t, q, f]) => {
      const d = await (await fetch(`/api/assessment/${t}`)).json();
      return d.answers?.[q]?.[f] ?? null;
    },
    [token, qid, field]
  );

console.log('== 1 (red): a slow response save must not erase text typed after it ==');
const { link, token } = await newAssessment('Erase Text Ltd');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// Delay the first request so it completes mid-typing, before the debounce fires.
let delayed = false;
await page.route('**/api/assessment/*/answers/1.1.1', async (route) => {
  if (!delayed) {
    delayed = true;
    await new Promise((r) => setTimeout(r, 300));
  }
  await route.continue();
});

const q1 = page.locator('.question').first();
await q1.locator('.response-option').first().click();           // starts the slow save
await page.waitForTimeout(40);
await q1.locator('input[type=text]').fill('ticket CHG-1184');    // buffered while it is in flight
await page.waitForTimeout(2500);                                 // debounce + save
await page.unroute('**/api/assessment/*/answers/1.1.1');

ck('evidence typed during an in-flight save reached the server',
   (await stored(token, '1.1.1', 'evidence')) === 'ticket CHG-1184',
   `stored="${await stored(token, '1.1.1', 'evidence')}"`);

console.log('\n== 2 (red): leaving within the debounce must not lose text ==');
const { link: link2, token: token2 } = await newAssessment('Navigate Away Ltd');
await page.goto(link2, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(900);

// Type, then navigate away immediately — well inside the 700ms debounce.
await page.locator('.question').first().locator('input[type=text]').fill('Firewall standard v3.2');
await page.waitForTimeout(80);
await page.click('header a.brand');
await page.waitForTimeout(1500);
ck('SPA navigation flushes the buffered edit',
   (await stored(token2, '1.1.1', 'evidence')) === 'Firewall standard v3.2',
   `stored="${await stored(token2, '1.1.1', 'evidence')}"`);

console.log('\n-- and a full page reload within the debounce --');
const { link: link3, token: token3 } = await newAssessment('Reload Away Ltd');
await page.goto(link3, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(900);
await page.locator('.question').first().locator('input[type=text]').fill('Reloaded evidence');
await page.waitForTimeout(80);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
ck('keepalive save survives a reload',
   (await stored(token3, '1.1.1', 'evidence')) === 'Reloaded evidence',
   `stored="${await stored(token3, '1.1.1', 'evidence')}"`);

console.log('\n-- normal typing still saves as before --');
const { link: link4, token: token4 } = await newAssessment('Normal Typing Ltd');
await page.goto(link4, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(800);
await page.locator('.question').first().locator('input[type=text]').fill('Steady state evidence');
await page.waitForTimeout(1600);
ck('debounced save still works normally',
   (await stored(token4, '1.1.1', 'evidence')) === 'Steady state evidence');
ck('save indicator reads Saved', (await page.locator('.save-state').textContent())?.trim() === 'Saved');

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nALL TEXT-LOSS FIXES VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
