// The public "which SAQ do I need?" wizard: routing, going back, and the
// explanation that comes with each outcome.
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
const pick = async (label) => {
  await page.locator('.choice', { hasText: label }).first().click();
  await page.waitForTimeout(250);
};
const heading = async () => (await page.locator('.card h2').first().textContent())?.trim();
const outcome = async () => {
  await page.locator('button:has-text("See which SAQ applies")').click();
  await page.waitForTimeout(500);
  return (await page.locator('.callout h2').first().textContent())?.trim();
};
const restart = async () => {
  await page.locator('button:has-text("Start again")').first().click();
  await page.waitForTimeout(400);
};

await page.goto(`${BASE}/which-saq`, { waitUntil: 'networkidle' });
await page.waitForSelector('.choice');

console.log('== routing ==');
await pick('A merchant');
await pick('No, we never store');
await pick('Online only');
await pick('Redirect or iframe');
await pick('Yes, and we hold evidence');
ck('fully outsourced e-commerce routes to SAQ A', (await outcome()) === 'SAQ A');
ck('the result explains what that SAQ assumes', (await page.locator('.criteria-list li').count()) > 0);
ck('and shows the answers that produced it', (await page.locator('.answer-summary li').count()) === 5);

await restart();
await pick('A merchant');
await pick('No, we never store');
await pick('In person only');
await pick('Terminals in a validated P2PE');
ck('validated P2PE terminals route to SAQ P2PE', (await outcome()) === 'SAQ P2PE');

await restart();
await pick('A merchant');
await pick('Yes, we store');
ck('storing account data routes straight to SAQ D', (await outcome()) === 'SAQ D for Merchants');

await restart();
await pick('A service provider');
ck('a service provider routes to the service-provider edition',
   (await outcome()) === 'SAQ D for Service Providers');

console.log('\n== going back re-asks the branch below ==');
await restart();
await pick('A merchant');
await pick('No, we never store');
await pick('Online only');
await pick('Redirect or iframe');
const before = await page.locator('.answer-trail li').count();
await page.locator('.answer-trail li', { hasText: 'How do your customers pay you?' }).locator('button').click();
await page.waitForTimeout(300);
const after = await page.locator('.answer-trail li').count();
ck('changing an earlier answer drops the ones below it', after < before, `${before} -> ${after}`);
ck('and asks that question again', (await heading()) === 'How do your customers pay you?', await heading());

await pick('By post or over the phone only');
await pick('Typed into a virtual terminal');
await pick('Yes, and we hold evidence');
await pick('No, it is a normal machine');
ck('a virtual terminal on a shared machine falls back to SAQ D',
   (await outcome()) === 'SAQ D for Merchants');
ck('and says why the narrower SAQ does not apply',
   ((await page.locator('.card', { hasText: 'What this means for you' }).locator('p.small').first().textContent()) ?? '')
     .includes('C-VT'));

console.log('\n== layout ==');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/which-saq`, { waitUntil: 'networkidle' });
await page.waitForSelector('.choice');
ck('no horizontal overflow on a phone',
   !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));

console.log('\nCONSOLE ERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nSAQ WIZARD VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
