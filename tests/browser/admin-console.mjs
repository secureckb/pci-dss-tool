// The assessor's side of a client who is routed to an SAQ this tool does not
// administer: what the dashboard shows, what is withheld, and what a reset does.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};
const pick = async (l) => {
  await page.locator('.choice', { hasText: l }).first().click();
  await page.waitForTimeout(220);
};

const client = `Routed Elsewhere ${Date.now()}`;

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=password]', PW);
await page.click('button[type=submit]');
await page.waitForSelector('.card', { timeout: 10000 });
await page.click('button:has-text("New assessment")');
await page.fill('input[type=text] >> nth=0', client);
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input');
const link = await page.locator('.link-box input').inputValue();

console.log('== a client whose answers point away from SAQ D ==');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.choice');
await pick('A merchant');
await pick('No, we never store');
await pick('In person only');
await pick('Standalone PTS-approved terminals');
await page.locator('button:has-text("Confirm and continue")').click();
await page.waitForTimeout(1500);
ck('the client is told which SAQ applies', (await page.locator('.callout h2').first().textContent())?.trim() === 'SAQ B-IP',
   (await page.locator('.callout h2').first().textContent())?.trim());
ck('and the questionnaire does not start', (await page.locator('.question').count()) === 0);

console.log('\n== what the assessor sees ==');
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await page.waitForSelector('table');
const row = page.locator('tbody tr', { hasText: client }).first();
ck('the dashboard names the SAQ', ((await row.locator('td').nth(1).textContent()) ?? '').includes('B-IP'),
   (await row.locator('td').nth(1).textContent())?.trim());
await row.locator('a').first().click();
await page.waitForSelector('.callout', { timeout: 10000 });
ck('the assessment page says it was routed away',
   ((await page.locator('.callout h3').first().textContent()) ?? '').toLowerCase().includes('routed'),
   (await page.locator('.callout h3').first().textContent())?.trim());
ck('no report is offered for a questionnaire that was never started',
   (await page.locator('a:has-text("Full report")').count()) === 0);
ck('but the determination can be reset',
   (await page.locator('button:has-text("Reset determination")').count()) === 1);

console.log('\n== resetting sends the client back to the wizard ==');
page.once('dialog', (d) => d.accept());
await page.locator('button:has-text("Reset determination")').first().click();
await page.waitForTimeout(1500);
ck('the assessor sees it is waiting on the client again',
   ((await page.locator('.callout h3').first().textContent()) ?? '').toLowerCase().includes('waiting'),
   (await page.locator('.callout h3').first().textContent())?.trim());
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.choice', { timeout: 10000 });
ck('and the client gets the questions again', (await page.locator('.choice').count()) > 0);

console.log('\nERRORS:', errors.length ? errors : 'none');
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nADMIN CONSOLE VERIFIED');
await browser.close();

process.exit(fails.length ? 1 : 0);
