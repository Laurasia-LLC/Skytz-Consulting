#!/usr/bin/env node
/**
 * Post-build static prerendering for canonical/hreflang/title/meta tags.
 *
 * Fixes CRITICAL-3 from the 2026-08-18 SEO audit: this is a Vite + React
 * SPA behind Vercel's catch-all rewrite ("/(.*)" -> "/index.html"), so
 * without this step every URL on the site serves the *same* index.html,
 * meaning every non-JS crawler (Bing's non-JS pass, LinkedIn/X link-preview
 * bots, most AI crawlers) sees one hardcoded canonical/hreflang/title for
 * every route, and client-side JS never adds hreflang to inner pages at all
 * (see src/components/SEO.jsx for the post-hydration fix to that second
 * part).
 *
 * This script runs after `vite build` (see package.json "postbuild") and
 * writes a real static index.html per route, e.g.
 *   dist/index.html         (unmodified SPA shell; fallback for any route
 *                             not covered below, e.g. via vercel.json's
 *                             rewrite)
 *   dist/en/index.html      -> served for GET /en
 *   dist/de/about/index.html -> served for GET /de/about
 *   ...
 * Each copy is byte-identical to the built SPA shell except for the
 * head tags listed in ROUTE_HEAD_FIELDS below — same JS bundle, same
 * hydration, same app. Vercel serves an exact-match static file (e.g.
 * dist/de/about/index.html for a request to /de/about) in preference to
 * its rewrites, so crawlers get the correct tags in the raw HTTP response
 * without executing any JavaScript. This is intentionally NOT a full SSR/
 * prerender of the React tree (no data fetching, no rendered content) —
 * just the <head> metadata that determines indexing/canonicalization,
 * which is what the audit finding is about.
 *
 * Scope note: /vacancies is deliberately excluded from this list. Whether
 * vacancy content should be indexable anywhere is an open business
 * decision (see the audit's "VACANCIES SUBDOMAIN" section) that is out of
 * scope for this fix — prerendering it here would have pre-empted that
 * decision by shipping indexable, canonical vacancy URLs on the main
 * domain.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageSEOConfig } from '../src/content/pageSEOConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const SITE_URL = 'https://skytz-consulting.com';
const LANGS = ['en', 'de'];
const DEFAULT_LANG = 'en';
const SITE_NAME = 'Skytz Consulting';

// route "key" = pageSEOConfig key; "segment" = URL sub-path under /:lang
// ('' = language root, i.e. /en or /de). Must stay in sync with the
// language-prefixed routes in src/App.jsx (minus /vacancies — see above).
const ROUTES = [
  { key: 'home', segment: '' },
  { key: 'testimonials', segment: 'testimonials' },
  { key: 'about', segment: 'about' },
  { key: 'industries', segment: 'industries' },
  { key: 'industry-process-instrumentation', segment: 'industries/process-instrumentation', faq: (l) => l.industries.detail['process-instrumentation'].faq },
  { key: 'industry-motion-control-drives', segment: 'industries/motion-control-drives', faq: (l) => l.industries.detail['motion-control-drives'].faq },
  { key: 'industry-test-measurement', segment: 'industries/test-measurement', faq: (l) => l.industries.detail['test-measurement'].faq },
  { key: 'vacancies', segment: 'vacancies' },
  { key: 'contact', segment: 'meet-philipp', faq: (l) => l.faq.items },
  { key: 'privacy', segment: 'privacy' },
  { key: 'terms', segment: 'terms' },
  { key: 'imprint', segment: 'imprint' },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildUrl(lang, segment) {
  return `${SITE_URL}/${lang}${segment ? '/' + segment : ''}`;
}

function replaceOrThrow(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`prerender-seo: expected to find "${label}" in dist/index.html but didn't. Template may have changed — update scripts/prerender-seo.mjs.`);
  }
  return html.replace(regex, replacement);
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('prerender-seo: dist/ not found — run "vite build" first.');
    process.exit(1);
  }

  const template = await readFile(path.join(DIST, 'index.html'), 'utf-8');
  const locales = Object.fromEntries(
    await Promise.all(LANGS.map(async (l) => [l, JSON.parse(await readFile(path.join(ROOT, 'src', 'locales', `${l}.json`), 'utf-8'))]))
  );

  let written = 0;
  for (const { key, segment, faq } of ROUTES) {
    const configByLang = pageSEOConfig[key];
    if (!configByLang) {
      console.warn(`prerender-seo: no pageSEOConfig entry for "${key}", skipping.`);
      continue;
    }

    for (const lang of LANGS) {
      const seo = configByLang[lang] || configByLang[DEFAULT_LANG];
      if (!seo) {
        console.warn(`prerender-seo: no SEO copy for "${key}" (${lang}), skipping.`);
        continue;
      }

      const url = buildUrl(lang, segment);
      const title = escapeHtml(`${seo.title} | ${SITE_NAME}`);
      const description = escapeHtml(seo.description);
      const locale = lang === 'de' ? 'de_DE' : 'en_US';
      const altLocale = lang === 'de' ? 'en_US' : 'de_DE';

      let html = template;

      html = replaceOrThrow(html, /<html lang="[^"]*">/, `<html lang="${lang}">`, '<html lang>');
      html = replaceOrThrow(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
      html = replaceOrThrow(html, /<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${title}" />`, 'meta[name=title]');
      html = replaceOrThrow(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`, 'meta[name=description]');
      html = replaceOrThrow(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'link[rel=canonical]');

      html = replaceOrThrow(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
      html = replaceOrThrow(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`, 'og:title');
      html = replaceOrThrow(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`, 'og:description');
      html = replaceOrThrow(html, /<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${locale}" />`, 'og:locale');
      html = replaceOrThrow(html, /<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${altLocale}" />`, 'og:locale:alternate');

      html = replaceOrThrow(html, /<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`, 'twitter:url');
      html = replaceOrThrow(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title');
      html = replaceOrThrow(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`, 'twitter:description');

      // hreflang alternates: this route's own de/en/x-default URLs (x-default -> DEFAULT_LANG).
      const hreflangBlock = LANGS
        .map((l) => `    <link rel="alternate" hreflang="${l}" href="${buildUrl(l, segment)}" />`)
        .concat(`    <link rel="alternate" hreflang="x-default" href="${buildUrl(DEFAULT_LANG, segment)}" />`)
        .join('\n');
      // No ^/m anchors here: the checked-out line endings are CRLF, and an
      // anchored version silently matched only the first <link> line,
      // leaving stale hreflang tags duplicated alongside the new ones.
      html = replaceOrThrow(
        html,
        /(?:[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\r?\n)+/,
        `${hreflangBlock}\n`,
        'hreflang block'
      );

      // FAQPage JSON-LD built from the same locale strings the page renders,
      // so the markup always matches the visible Q&A. "<" is escaped so no
      // answer text can close the script tag.
      if (faq) {
        const items = faq(locales[lang]) || [];
        const faqLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: lang,
          url,
          mainEntity: items.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        };
        const json = JSON.stringify(faqLd).replace(/</g, '\\u003c');
        html = replaceOrThrow(html, /<\/head>/, `    <script type="application/ld+json">${json}</script>\n  </head>`, '</head>');
      }

      const outDir = path.join(DIST, lang, segment);
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
      written += 1;
    }
  }

  // Real 404 page: Vercel serves dist/404.html with HTTP 404 for any path
  // that has no static file and no rewrite (see vercel.json). Same SPA shell
  // so React Router still renders NotFound, but noindex and no canonical/hreflang.
  let notFound = template;
  notFound = replaceOrThrow(notFound, /<title>[^<]*<\/title>/, `<title>Page Not Found | ${SITE_NAME}</title>`, '<title>');
  notFound = replaceOrThrow(notFound, /<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />', 'meta[name=robots]');
  notFound = replaceOrThrow(notFound, /[ \t]*<link rel="canonical" href="[^"]*" \/>\r?\n/, '', 'link[rel=canonical]');
  notFound = replaceOrThrow(notFound, /(?:[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\r?\n)+/, '', 'hreflang block');
  await writeFile(path.join(DIST, '404.html'), notFound, 'utf-8');

  console.log(`prerender-seo: wrote ${written} static route(s) with route-correct canonical/hreflang/title/meta.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
