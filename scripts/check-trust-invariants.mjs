#!/usr/bin/env node
/**
 * Guards the specific trust and friction fixes made in this change set.
 *
 * These are content and build-output assertions, not UI tests: the failures
 * they catch are the ones that already shipped once (a booking link pointing
 * at a decommissioned calendar, an invented call duration, a mandate count
 * that contradicts the vacancy list, analytics booting before consent).
 *
 * Run with: npm run check:trust
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

let failures = 0;
const pass = (name, detail = '') => console.log(`  ok    ${name}${detail ? ` — ${detail}` : ''}`);
const fail = (name, detail) => {
  failures += 1;
  console.error(`  FAIL  ${name} — ${detail}`);
};

const locales = ['en', 'de'].map((l) => ({
  lang: l,
  data: JSON.parse(read(`src/locales/${l}.json`)),
}));

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' && !Array.isArray(v) ? flatten(v, key) : [[key, v]];
  });

// 0. No un-audited headline statistics or default fee/guarantee copy on public locales.
{
  const bannedStats = /50\+|92\s*%|92\s*Prozent|90-day|90 day|85\s*% of agency|SHRM's 2026/;
  const offenders = locales.flatMap(({ lang, data }) => {
    const blob = JSON.stringify(data);
    return bannedStats.test(blob) ? [`${lang}: locale contains banned headline-stat or default guarantee pattern`] : [];
  });
  if (offenders.length === 0) pass('no banned un-audited headline stats in locale JSON');
  else fail('no banned un-audited headline stats in locale JSON', offenders.join(' | '));
}

console.log('\nSkytz trust and friction checks\n');

// 1. Single booking identity, and it is the authorised schedule.
{
  const bookingSrc = read('src/content/booking.js');
  const expected = 'https://calendar.app.google/5xbLcjnJdEKsHMqy9';
  if (bookingSrc.includes(expected)) pass('booking URL is the authorised Google schedule');
  else fail('booking URL is the authorised Google schedule', 'BOOKING_URL does not match');

  const sourceFiles = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const rel = join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.(jsx?|json|html)$/.test(entry.name)) sourceFiles.push(rel);
    }
  };
  walk('src');
  sourceFiles.push('index.html');

  const strays = sourceFiles.filter((f) => {
    const text = read(f);
    // The booking module itself is allowed to contain the literal URL.
    const hits = text.match(/calendly\.com|calendar\.app\.google/g) || [];
    return hits.length > (f.endsWith('booking.js') ? 1 : 0);
  });
  if (strays.length === 0) pass('no competing calendar link anywhere in src/ or index.html');
  else fail('no competing calendar link anywhere in src/ or index.html', strays.join(', '));
}

// 2. No call-duration promise that the calendar cannot guarantee.
{
  const offenders = locales.flatMap(({ lang, data }) =>
    flatten(data)
      .filter(([, v]) => typeof v === 'string' && /\b(45|30)[\s-]*(minutes?|Minuten)\b/i.test(v))
      .map(([k, v]) => `${lang}:${k} = ${v.slice(0, 70)}`),
  );
  if (offenders.length === 0) pass('no stated call duration in either locale');
  else fail('no stated call duration in either locale', offenders.join(' | '));
}

// 3. Mandate counts must not contradict the vacancy list. The list is now
//    generated from src/content/vacancies.js, so the check reads that module
//    and confirms both locale files describe every entry it contains.
{
  const vacSrc = read('src/content/vacancies.js');
  const moduleKeys = [...vacSrc.matchAll(/key:\s*'([^']+)'/g)].map((m) => m[1]);
  const problems = [];

  if (moduleKeys.length === 0) problems.push('no roles found in src/content/vacancies.js');

  for (const { lang, data } of locales) {
    const positions = data.vacancies?.positions || {};
    const positionKeys = Object.keys(positions);
    if (positionKeys.length !== moduleKeys.length) {
      problems.push(`${lang}: ${positionKeys.length} position entries vs ${moduleKeys.length} module roles`);
    }
    const missing = moduleKeys.filter((k) => !positions[k]?.title || !positions[k]?.location);
    if (missing.length) problems.push(`${lang}: missing title/location for ${missing.join(', ')}`);

    // A hand-maintained duplicate list would let the two drift apart again.
    if (Array.isArray(data.searches?.items)) {
      problems.push(`${lang}: searches.items is duplicated in the locale file`);
    }
    if (/three searches|drei Suchen/i.test(JSON.stringify(data))) {
      problems.push(`${lang}: still contains a hard-coded "three searches" claim`);
    }
  }

  if (problems.length === 0) {
    pass('mandate list is generated from one source', `${moduleKeys.length} roles in both locales`);
  } else {
    fail('mandate list is generated from one source', problems.join(' | '));
  }
}

// 4. No analytics or third-party font loading may be reintroduced pre-consent.
{
  const html = read('index.html');
  const css = read('src/index.css');
  const banned = [
    [/googletagmanager/i, 'Google Tag Manager'],
    [/gtag\/js|google-analytics\.com/i, 'Google Analytics'],
    [/fonts\.googleapis\.com|fonts\.gstatic\.com/i, 'remote Google Fonts'],
  ];
  const found = banned.filter(([re]) => re.test(html) || re.test(css));
  if (found.length === 0) pass('no analytics or remote font loading in index.html or index.css');
  else fail('no analytics or remote font loading', found.map(([, n]) => n).join(', '));

  const pkg = JSON.parse(read('package.json'));
  if (pkg.dependencies?.['@fontsource-variable/inter']) {
    pass('fonts are self-hosted via @fontsource-variable/inter');
  } else {
    fail('fonts are self-hosted', '@fontsource-variable/inter missing from dependencies');
  }
}

// 5. The public contact addresses that are actually live must stay untouched.
{
  const expected = ['info@skytz-consulting.com', 'legal@skytz-consulting.com'];
  const allText = [
    'src/pages/Contact.jsx',
    'src/pages/Imprint.jsx',
    'src/pages/Privacy.jsx',
    'src/pages/Terms.jsx',
    'src/pages/Vacancies.jsx',
    'src/pages/Home.jsx',
    'src/components/layout/Footer.jsx',
  ]
    .map(read)
    .join('\n');
  const missing = expected.filter((e) => !allText.includes(e));
  if (missing.length === 0) pass('live contact addresses preserved');
  else fail('live contact addresses preserved', missing.join(', '));

  // No address may be invented in the locale copy.
  const proposed = /philipp@|ph@skytz/i;
  const invented = locales.filter(({ data }) => proposed.test(JSON.stringify(data)));
  if (invented.length === 0) pass('no unprovisioned mailbox introduced');
  else fail('no unprovisioned mailbox introduced', invented.map((i) => i.lang).join(', '));
}

// 6. Privacy text must not describe analytics the site no longer runs.
{
  const stale = locales.filter(({ data }) => {
    const blob = JSON.stringify(data.privacy).toLowerCase();
    return blob.includes('google tag manager') || blob.includes('google analytics');
  });
  if (stale.length === 0) pass('privacy text matches the analytics-free implementation');
  else fail('privacy text matches implementation', stale.map((s) => s.lang).join(', '));
}

// 7. The employer CTA must precede the candidate CTA in the hero markup, so
//    mobile order (primary first) cannot silently invert.
{
  const home = read('src/pages/Home.jsx');
  const primary = home.indexOf("t('hero.cta.primary')");
  const secondary = home.indexOf("t('hero.cta.secondary')");
  if (primary > -1 && secondary > -1 && primary < secondary) {
    pass('employer CTA renders before candidate CTA in the hero');
  } else {
    fail('employer CTA renders before candidate CTA in the hero', `primary@${primary} secondary@${secondary}`);
  }

  // The hero text block must be ordered first on small screens.
  if (/order-1 lg:order-2/.test(home) && /order-2 lg:order-1/.test(home)) {
    pass('hero text precedes the portrait on small screens');
  } else {
    fail('hero text precedes the portrait on small screens', 'order utilities missing');
  }

  // Above-the-fold space on a 360px-wide phone is tight; a long hero subhead
  // or generous vertical padding pushes the employer CTA back below the fold.
  // 40 words is roughly three lines at that width.
  const longSubheads = locales
    .filter(({ data }) => (data.hero?.subhead || '').split(/\s+/).length > 40)
    .map(({ lang, data }) => `${lang}: ${data.hero.subhead.split(/\s+/).length} words`);
  if (longSubheads.length === 0) pass('hero subhead stays short enough to keep the CTA above the fold');
  else fail('hero subhead stays short enough to keep the CTA above the fold', longSubheads.join(' | '));

  // Mobile top padding must stay smaller than the desktop rhythm.
  if (/pt-8 .*lg:py-28/.test(home)) {
    pass('home hero uses reduced top padding on mobile');
  } else {
    fail('home hero uses reduced top padding on mobile', 'expected pt-8 with lg:py-28');
  }
}

// 8. Built output must be free of the removed trackers, if a build exists.
{
  const dist = join(root, 'dist');
  if (!existsSync(dist)) {
    console.log('  skip  dist/ checks (run npm run build first)');
  } else {
    const assets = [];
    const walkDist = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walkDist(full);
        else if (/\.(js|css|html)$/.test(entry.name)) assets.push(full);
      }
    };
    walkDist(dist);

    const leaky = assets.filter((f) => /googletagmanager|google-analytics\.com|fonts\.googleapis/.test(readFileSync(f, 'utf8')));
    if (leaky.length === 0) pass('built assets contain no tracker or remote-font references');
    else fail('built assets contain no tracker or remote-font references', leaky.map((f) => f.replace(root, '')).join(', '));

    const fontDir = join(dist, 'assets', 'fonts');
    const fonts = existsSync(fontDir) ? readdirSync(fontDir).filter((f) => f.endsWith('.woff2')) : [];
    if (fonts.length > 0) pass('fonts are emitted into the build', `${fonts.length} woff2 files`);
    else fail('fonts are emitted into the build', 'no woff2 in dist/assets/fonts');
  }
}

console.log('');
if (failures > 0) {
  console.error(`${failures} check(s) failed\n`);
  process.exit(1);
}
console.log('all checks passed\n');
