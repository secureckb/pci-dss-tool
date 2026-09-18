// The public requirement catalogue: search, filters, section browsing, deep links.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

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
const cards = () => page.locator('.requirement-card').count();

await page.goto(`${BASE}/requirements`, { waitUntil: 'networkidle' });
await page.waitForSelector('.requirement-card');

console.log('== the catalogue renders ==');
ck('nav lists every section plus "all"', (await page.locator('.saq-nav button').count()) >= 15,
   String(await page.locator('.saq-nav button').count()));
ck('the scoring legend is shown', (await page.locator('table tbody tr').count()) > 0);

console.log('\n== search ==');
await page.fill('.search-field input', '8.4');
await page.waitForTimeout(400);
const byNumber = await page.locator('.question-id').allTextContents();
ck('searching a number finds that subtree', ['8.4.1', '8.4.2', '8.4.3'].every((id) => byNumber.includes(id)),
   byNumber.join(', '));
// Search covers the requirement text as well as the number, so a requirement
// that refers to 8.4 is a hit too. Every match should be explained one way or
// the other rather than being arbitrary.
const cardTexts = await page.locator('.requirement-card').allTextContents();
ck('and every match mentions it somewhere', cardTexts.every((t) => t.includes('8.4')),
   `${cardTexts.length} cards`);

await page.fill('.search-field input', 'multi-factor');
await page.waitForTimeout(400);
ck('free text matches requirement text', (await cards()) > 0, `${await cards()} cards`);

await page.fill('.search-field input', 'zzzznotarequirement');
await page.waitForTimeout(400);
ck('no match says so rather than showing nothing',
   ((await page.locator('.card p.muted').first().textContent()) ?? '').length > 10);

await page.click('.search-clear');
await page.waitForTimeout(300);
ck('clearing search restores the list', (await cards()) > 0);

console.log('\n== filters ==');
await page.selectOption('.filter-bar select', 'merchant');
await page.waitForTimeout(300);
const merchantNav = await page.locator('.saq-nav button').allTextContents();
ck('the merchant edition omits Appendix A1', !merchantNav.some((t) => t.includes('A1')));
await page.selectOption('.filter-bar select', 'service-provider');
await page.waitForTimeout(300);
const spNav = await page.locator('.saq-nav button').allTextContents();
ck('the service-provider edition includes it', spNav.some((t) => t.includes('A1')));
await page.selectOption('.filter-bar select', 'all');
await page.waitForTimeout(300);

await page.check('.checkbox-field input');
await page.waitForTimeout(400);
ck('filtering to N/A-eligible excludes requirements where N/A is refused',
   (await page.locator('.requirement-card .badge', { hasText: 'N/A not permitted' }).count()) === 0);
await page.uncheck('.checkbox-field input');
await page.waitForTimeout(300);

console.log('\n== browsing and deep links ==');
await page.locator('.saq-nav button').first().click();
await page.waitForTimeout(900);
ck('"all requirements" shows the whole service-provider bank', (await cards()) === 260, `${await cards()} cards`);

await page.locator('.saq-nav button', { hasText: 'Req 9' }).first().click();
await page.waitForTimeout(400);
ck('a section shows only its own requirements', (await cards()) > 0 && (await cards()) < 260, `${await cards()} cards`);

await page.goto(`${BASE}/requirements#11.4.5`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
ck('a hash deep link scrolls to its requirement', await page.locator('#req-11\\.4\\.5').isVisible());

console.log('\n== layout ==');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/requirements`, { waitUntil: 'networkidle' });
await page.waitForSelector('.requirement-card');
ck('no horizontal overflow on a phone',
   !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));

await page.setViewportSize({ width: 1280, height: 1000 });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
ck('the landing page links to the catalogue', (await page.locator('a[href="/requirements"]').count()) > 0);

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nREQUIREMENT CATALOGUE VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
