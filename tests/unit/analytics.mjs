// Visit counting: what is allowed to be counted, and what a campaign label may be.
// The point of the allowlist is that a client link can never reach the table.
process.env.DATABASE_URL ||= 'postgres://postgres@localhost:5432/unused';
const { trackedPath, cleanSource, looksAutomated } = await import('../../server/analytics.js');

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};

console.log('== only public pages are countable ==');
for (const p of ['/', '/requirements', '/which-saq', '/guides', '/guides/saq-d-vs-saq-a']) {
  ck(`${p} is counted`, trackedPath(p) === p);
}
ck('a trailing slash collapses to the page', trackedPath('/which-saq/') === '/which-saq');
ck('a client link is never counted', trackedPath('/q/0123456789abcdef0123456789abcdef') === null);
ck('a client results page is never counted', trackedPath('/q/0123456789abcdef0123456789abcdef/results') === null);
ck('the admin console is never counted', trackedPath('/admin') === null && trackedPath('/admin/assessments/1') === null);
ck('the API is never counted', trackedPath('/api/health') === null);
ck('an unknown guide is not counted', trackedPath('/guides/made-up') === null);
ck('a non-string is not counted', trackedPath(undefined) === null && trackedPath(['/']) === null);

console.log('\n== campaign labels cannot carry anything personal ==');
ck('a plain label is kept', cleanSource('email') === 'email');
ck('case is folded', cleanSource('LinkedIn') === 'linkedin');
ck('hyphen and underscore are allowed', cleanSource('guide-saq_d') === 'guide-saq_d');
ck('an email address is refused', cleanSource('jane@example.com') === 'direct');
ck('spaces and punctuation are refused', cleanSource('a b') === 'direct' && cleanSource('a.b') === 'direct');
ck('markup is refused', cleanSource('<script>') === 'direct');
ck('a very long label is refused', cleanSource('a'.repeat(41)) === 'direct');
ck('empty and missing are direct', cleanSource('') === 'direct' && cleanSource(undefined) === 'direct');
ck('a repeated parameter uses the first', cleanSource(['email', 'x']) === 'email');

console.log('\n== automated traffic is not counted ==');
ck('a browser is counted', looksAutomated('Mozilla/5.0 (Windows NT 10.0) Chrome/120 Safari/537.36') === false);
ck('Googlebot is not', looksAutomated('Mozilla/5.0 (compatible; Googlebot/2.1)') === true);
ck('curl is not', looksAutomated('curl/8.5.0') === true);
ck('a missing user agent is not', looksAutomated(undefined) === true && looksAutomated('') === true);

if (fails.length) {
  console.log(`\n${fails.length} FAILED`);
  process.exit(1);
}
console.log('\nANALYTICS RULES VERIFIED');
process.exit(0);
