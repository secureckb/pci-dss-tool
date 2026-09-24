// The advisor's card in the assessor's console, on a deployment that has no
// model access — which is how this tool ships and how CI runs it.
//
// The card has to appear, say plainly that the advisor is off and what would
// turn it on, and change nothing else about the page. The failure this guards
// against is the whole feature being additive in intent and load-bearing in
// practice: a component that throws takes the assessment view down with it, and
// an assessor would lose the gap list over a drafting tool they never used.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const PW = process.env.ADMIN_PASSWORD || 'test-admin-password-long';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
// Resource-load failures are excluded: a sandbox with its own TLS interception
// reports them for anything the page did not bundle, and they say nothing about
// this feature.
page.on('console', (m) => {
  if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('CONSOLE: ' + m.text());
});

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};

const client = `Advisor Card ${Date.now()}`;

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=password]', PW);
await page.click('button[type=submit]');
await page.waitForSelector('.card', { timeout: 10000 });
await page.click('button:has-text("New assessment")');
await page.fill('input[type=text] >> nth=0', client);
await page.selectOption('select', 'merchant');
await page.click('button:has-text("Create and generate link")');
await page.waitForSelector('.link-box input');
const link = await page.locator('.link-box input').inputValue();

console.log('== with no gap, the card stays out of the way ==');
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await page.locator('tbody tr', { hasText: client }).first().locator('a').first().click();
await page.waitForSelector('h2:has-text("Client link")', { timeout: 10000 });
ck('nothing to remediate means no advisor card', (await page.locator('h2:has-text("Remediation advisor")').count()) === 0);

console.log('\n== once a requirement fails ==');
await page.goto(link, { waitUntil: 'networkidle' });
await page.waitForSelector('.question', { timeout: 10000 });
await page.locator('.question').first().locator('label', { hasText: 'No' }).first().click();
await page.waitForTimeout(1200);

await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await page.locator('tbody tr', { hasText: client }).first().locator('a').first().click();
await page.waitForSelector('h2:has-text("Remediation advisor")', { timeout: 10000 });
ck('the advisor card appears alongside the gap', true);

const card = page.locator('.card', { has: page.locator('h2:has-text("Remediation advisor")') });
const text = (await card.textContent()) ?? '';
ck('it says it is not configured', /Not configured on this deployment/.test(text));
ck('and names what would switch it on', text.includes('ANTHROPIC_API_KEY'));
ck('and says the rest of the tool does not depend on it', /do not depend on it/.test(text));
ck('there is no draft button to press with no key', (await card.locator('button').count()) === 0,
   String(await card.locator('button').count()));

console.log('\n-- and the assessment view is otherwise untouched --');
ck('the failed requirement is still listed', (await page.locator('h2:has-text("Failed requirements")').count()) === 1);
// One failed requirement out of 235 leaves the assessment Incomplete, not
// non-compliant: an unanswered requirement outranks a failed one, because no
// determination can be made from a questionnaire that is not finished. The
// advisor card still appears, because there is already a gap to plan for.
ck('the determination still reads Incomplete', (await page.locator('.callout h3').first().textContent())?.includes('Incomplete'),
   (await page.locator('.callout h3').first().textContent())?.trim());
ck('the report is still offered', (await page.locator('a:has-text("Full report")').count()) === 1);

console.log('\nCONSOLE ERRORS: ' + (errors.length ? '\n  ' + errors.join('\n  ') : 'none'));
if (errors.length) fails.push('console errors');

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nADVISOR CARD VERIFIED');
process.exit(fails.length ? 1 : 0);
