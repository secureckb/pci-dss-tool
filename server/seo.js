import fs from 'node:fs';
import path from 'node:path';
import { asyncRouter } from './async-router.js';
import { publicBaseUrl } from './helpers.js';
import { GUIDES, findGuide, AUTHOR_LINE, CONTACT_EMAIL, GUIDES_UPDATED } from './guides.js';
import { recordVisit, trackedPath } from './analytics.js';

/**
 * Search-engine facing pieces: real HTML for the guide pages, per-page titles
 * and descriptions for the app's public pages, robots.txt and sitemap.xml.
 *
 * The app is a single-page application, so without this every public URL would
 * present the same empty shell and title to a crawler. Client links (/q/...) and
 * the admin console are kept out of search results with a response header rather
 * than a tag in the shell, so the public pages can be indexed while those stay
 * private.
 */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const SITE_NAME = 'SAQ Sprint by CKB Secure Data LLC';

/** What each public app route says about itself. */
export const PAGE_META = {
  '/': {
    title: 'SAQ Sprint: guided PCI DSS SAQ D self-assessment',
    description:
      'A consultant-run PCI DSS v4.0.1 self-assessment for SAQ D, for merchants and service providers. Pass/fail scoring, a gap report and an attestation summary that helps you complete your AOC.',
  },
  '/requirements': {
    title: 'PCI DSS v4.0.1 SAQ D requirements: the full question list',
    description:
      'Browse every requirement a SAQ D self-assessment asks, for merchants and for service providers, before you start. Free, nothing is saved.',
  },
  '/which-saq': {
    title: 'Which PCI SAQ do I need? Free SAQ finder',
    description:
      'Answer a few questions about how you take payments and find out which PCI DSS v4.0.1 self-assessment questionnaire applies. Free, and nothing you enter is saved.',
  },
};

/** Keep client links, the admin console and the API out of search results. */
export function robotsHeader(req, res, next) {
  if (/^\/(q|admin|api)(\/|$)/.test(req.path)) {
    res.set('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
}

/** Read the built shell once and inject per-route metadata into a copy. */
export function makeShellRenderer(distDir) {
  const file = path.join(distDir, 'index.html');
  let template = null;

  function load() {
    if (template === null) template = fs.readFileSync(file, 'utf8');
    return template;
  }

  return function render(req, routePath) {
    const html = load();
    const meta = PAGE_META[routePath];
    if (!meta) return html;
    const base = publicBaseUrl(req);
    const canonical = `${base}${routePath === '/' ? '/' : routePath}`;
    const tags = [
      `<meta name="description" content="${esc(meta.description)}" />`,
      `<link rel="canonical" href="${esc(canonical)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
      `<meta property="og:title" content="${esc(meta.title)}" />`,
      `<meta property="og:description" content="${esc(meta.description)}" />`,
      `<meta property="og:url" content="${esc(canonical)}" />`,
    ].join('\n    ');
    return html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`)
      .replace('</head>', `    ${tags}\n  </head>`);
  };
}

const PAGE_CSS = `
:root{--ink:#0f172a;--soft:#475569;--line:#e2e8f0;--brand:#1d4ed8;--brand-soft:#eff6ff;--bg:#f1f5f9;--surface:#fff}
*{box-sizing:border-box}
body{margin:0;font:16px/1.65 'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--ink)}
header.site{background:var(--surface);border-bottom:1px solid var(--line)}
.wrap{max-width:720px;margin:0 auto;padding:0 max(16px,env(safe-area-inset-left,0px))}
header.site .wrap{display:flex;align-items:center;gap:16px;padding-block:14px;flex-wrap:wrap}
header.site a.brand{font-weight:700;color:var(--ink);text-decoration:none}
header.site nav{display:flex;gap:16px;margin-left:auto;font-size:14px}
main{padding-block:32px 56px}
article{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:clamp(18px,4vw,36px)}
h1{font-size:clamp(1.5rem,4vw,2rem);line-height:1.2;letter-spacing:-.01em;margin:0 0 .5em;text-wrap:balance}
h2{font-size:1.25rem;margin:1.8em 0 .4em}
p,li{max-width:65ch}
a{color:var(--brand)}
.byline{color:var(--soft);font-size:14px;margin:0 0 1.5em}
.cta{background:var(--brand-soft);border:1px solid #bfdbfe;border-radius:10px;padding:16px 18px;margin:2em 0 0}
.cta p{margin:.2em 0}
.btn{display:inline-block;background:var(--brand);color:#fff;text-decoration:none;font-weight:600;padding:9px 16px;border-radius:8px;margin:.5em .5em 0 0}
.btn.alt{background:#fff;color:var(--brand);border:1px solid var(--brand)}
.note{color:var(--soft);font-size:13px;margin-top:2em}
footer{color:var(--soft);font-size:13px;padding-bottom:40px}
ul.guides{list-style:none;padding:0;display:grid;gap:12px}
ul.guides li{border:1px solid var(--line);border-radius:10px;padding:14px 16px}
ul.guides a{font-weight:600}
a:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
`;

function layout({ title, description, canonical, jsonLd, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(canonical)}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="${esc(SITE_NAME)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(canonical)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
<style>${PAGE_CSS}</style>
${jsonLd ? `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<header class="site"><div class="wrap">
<a class="brand" href="/">SAQ Sprint</a>
<nav aria-label="Main"><a href="/guides">Guides</a><a href="/which-saq">SAQ finder</a><a href="/requirements">Requirements</a></nav>
</div></header>
<main><div class="wrap">
${body}
</div></main>
<footer><div class="wrap">
<p>CKB Secure Data LLC &middot; <a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a></p>
<p>This site counts page visits without cookies, and without storing IP addresses or any information about visitors. The questions you answer in the SAQ finder are not saved.</p>
</div></footer>
</body>
</html>`;
}

function renderGuide(guide, base) {
  const canonical = `${base}/guides/${guide.slug}`;
  const sections = guide.sections
    .map((s) => {
      const paras = (s.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('\n');
      const list = s.list ? `<ul>${s.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
      return `<h2>${esc(s.heading)}</h2>\n${paras}\n${list}`;
    })
    .join('\n');

  const src = `guide-${guide.slug}`.slice(0, 40);
  const body = `<article>
<h1>${esc(guide.title)}</h1>
<p class="byline">${esc(AUTHOR_LINE)} Updated ${esc(guide.updated)}.</p>
${sections}
<div class="cta">
<p><strong>Not sure which questionnaire applies to you?</strong></p>
<p>The finder takes a few minutes and saves nothing.</p>
<a class="btn" href="/which-saq?src=${esc(src)}">Find my SAQ</a>
<a class="btn alt" href="/requirements?src=${esc(src)}">See the SAQ D questions</a>
</div>
<p class="note">General information, not legal or compliance advice. What you must validate, and how, is set by your acquirer and the card brands. SAQ Sprint produces a self-assessment record that helps you complete the official Attestation of Compliance. It is not an official SAQ and not a signed AOC.</p>
</article>`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    author: { '@type': 'Organization', name: 'CKB Secure Data LLC' },
    publisher: { '@type': 'Organization', name: 'CKB Secure Data LLC' },
    mainEntityOfPage: canonical,
  });

  return layout({ title: `${guide.title} | SAQ Sprint`, description: guide.description, canonical, jsonLd, body });
}

function renderIndex(base) {
  const items = GUIDES.map(
    (g) =>
      `<li><a href="/guides/${esc(g.slug)}">${esc(g.title)}</a><br /><span>${esc(g.description)}</span></li>`
  ).join('\n');
  const body = `<article>
<h1>PCI DSS guides</h1>
<p class="byline">${esc(AUTHOR_LINE)}</p>
<ul class="guides">
${items}
</ul>
<div class="cta">
<p><strong>Find your questionnaire in a few minutes.</strong></p>
<a class="btn" href="/which-saq?src=guides-index">Find my SAQ</a>
</div>
</article>`;
  return layout({
    title: 'PCI DSS guides for service providers and merchants | SAQ Sprint',
    description: 'Plain-language guides to PCI DSS SAQ D, service provider levels and what to do when a customer asks for your AOC.',
    canonical: `${base}/guides`,
    body,
  });
}

const router = asyncRouter();

router.get('/robots.txt', (req, res) => {
  const base = publicBaseUrl(req);
  res.type('text/plain').send(
    ['User-agent: *', 'Allow: /', 'Disallow: /q/', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n')
  );
});

router.get('/sitemap.xml', (req, res) => {
  const base = publicBaseUrl(req);
  const urls = [
    { loc: `${base}/`, lastmod: GUIDES_UPDATED },
    { loc: `${base}/which-saq`, lastmod: GUIDES_UPDATED },
    { loc: `${base}/requirements`, lastmod: GUIDES_UPDATED },
    { loc: `${base}/guides`, lastmod: GUIDES_UPDATED },
    ...GUIDES.map((g) => ({ loc: `${base}/guides/${g.slug}`, lastmod: g.updated })),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n') +
    '\n</urlset>\n';
  res.type('application/xml').send(xml);
});

router.get('/guides', (req, res) => {
  recordVisit(req, req.path);
  res.type('html').send(renderIndex(publicBaseUrl(req)));
});

router.get('/guides/:slug', (req, res) => {
  const guide = findGuide(req.params.slug);
  if (!guide) return res.status(404).type('text/plain').send('Guide not found.');
  recordVisit(req, trackedPath(req.path) || req.path);
  res.type('html').send(renderGuide(guide, publicBaseUrl(req)));
});

export default router;
