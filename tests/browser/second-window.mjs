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
await page.fill('input[type=text] >> nth=0', 'Two Windows Ltd');
await page.selectOption('select', 'merchant');
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input');
const link = await page.locator('.link-box input').inputValue();
const token = link.split('/q/')[1];

console.log('== the first window opens, then a second window opens after it ==');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');

// A second page load takes a later epoch, exactly as a second tab or phone would.
const second = await ctx.newPage();
await second.goto(link, { waitUntil: 'networkidle' });
await second.waitForSelector('.question');
await second.locator('.question').first().locator('.response-option').first().click();
await second.waitForTimeout(900);

console.log('\n-- the older window now edits the same requirement --');
await page.locator('.question').first().locator('.response-option').nth(1).click();
await page.waitForTimeout(1200);

const indicator = (await page.locator('.save-state').textContent())?.trim();
ck('the older window does not claim to have saved',
   indicator !== 'Saved' && /reload/i.test(indicator ?? ''), `indicator="${indicator}"`);
const msg = (await page.locator('.error-text').first().textContent())?.trim() ?? '';
ck('it explains that another window has the answers', /another window|another device/i.test(msg),
   msg.slice(0, 90));

const stored = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return d.answers['1.1.1']?.response;
}, token);
ck('the newer window’s answer is what the server holds', stored === 'yes', `stored=${stored}`);

console.log('\n-- and the stale window cannot attest to answers it has not seen --');
await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  let n = 500;
  for (const q of d.sections.flatMap((s) => s.questions)) {
    await fetch(`/api/assessment/${t}/answers/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'yes', epoch: d.session.epoch, seq: n++ }),
    });
  }
}, token);
await page.locator('.saq-nav button').last().click();
await page.waitForTimeout(400);
await page.locator('label.field', { hasText: 'Your name' }).locator('input').fill('A Person');
await page.waitForTimeout(200);
await page.click('button:has-text("Submit self-assessment")');
await page.waitForTimeout(1500);
ck('submission is refused while the window is stale', !page.url().includes('/results'),
   page.url().split('/').slice(-1)[0]);

console.log('\n-- reloading clears it and everything works again --');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');
await page.locator('.question').first().locator('.response-option').nth(1).click();
await page.waitForTimeout(1200);
ck('a reloaded window saves normally',
   (await page.locator('.save-state').textContent())?.trim() === 'Saved');
const after = await page.evaluate(async (t) => {
  const d = await (await fetch(`/api/assessment/${t}`)).json();
  return d.answers['1.1.1']?.response;
}, token);
ck('its edit reached the server', after === 'no', `stored=${after}`);

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nSTALE-WINDOW HANDLING VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
