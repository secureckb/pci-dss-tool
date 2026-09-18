// The shortest path through the whole product: sign in, create an assessment,
// open its link, answer a requirement, see it saved.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && !m.text().includes('CERT') && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
ck('the landing page offers the catalogue', (await page.locator('a[href="/requirements"]').count()) > 0);

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=password]', PW);
await page.click('button[type=submit]');
await page.waitForSelector('.card', { timeout: 10000 });
ck('the admin console opens', page.url().includes('/admin'));

await page.click('button:has-text("New assessment")');
await page.fill('input[type=text] >> nth=0', 'Smoke Test Ltd');
await page.selectOption('select', 'merchant');
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input', { timeout: 10000 });
const link = await page.locator('.link-box input').inputValue();
ck('a client link is generated', /\/q\/[0-9a-f]{32}$/.test(link), link.replace(/[0-9a-f]{32}$/, '<token>'));

await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question');
ck('the questionnaire opens on requirement 1', (await page.locator('.question').count()) > 0);

await page.locator('.question').first().locator('.response-option').first().click();
await page.waitForTimeout(900);
ck('an answer saves', (await page.locator('.save-state').textContent())?.trim() === 'Saved',
   (await page.locator('.save-state').textContent())?.trim());

await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.question');
ck('and survives a reload',
   (await page.locator('.question').first().locator('.response-option.selected').count()) === 1);

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nSMOKE TEST PASSED');
await browser.close();

process.exit(fails.length ? 1 : 0);
