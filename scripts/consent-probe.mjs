/**
 * Headless consent + network probe for Klaro and delayed GTM loading.
 * Run after `npm run build` with preview server on PORT (default 4173),
 * or set CONSENT_PROBE_BASE_URL for a deployed origin.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

const PORT = Number(process.env.CONSENT_PROBE_PORT || 4173);
const REMOTE_BASE = process.env.CONSENT_PROBE_BASE_URL?.replace(/\/$/, '');
const BASE = REMOTE_BASE || `http://127.0.0.1:${PORT}`;
const VERCEL_SHARE = process.env.CONSENT_PROBE_VERCEL_SHARE;
const probeLabel = REMOTE_BASE ? 'remote' : 'local';
const ARTIFACT_DIR =
  process.env.CONSENT_PROBE_ARTIFACT_DIR ||
  path.join(process.cwd(), 'consent-probe-artifacts');

const GOOGLE_TRACKING_SUFFIXES = [
  'googletagmanager.com',
  'google-analytics.com',
  'doubleclick.net',
];

function trackingHost(hostname) {
  const host = (hostname || '').toLowerCase();
  return GOOGLE_TRACKING_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

function isGoogleComRequest(hostname, pathname) {
  const host = (hostname || '').toLowerCase();
  if (host !== 'google.com' && !host.endsWith('.google.com')) return false;
  return /\/(ccm\/collect|g\/collect|ads\/ga-audiences)/.test(pathname || '');
}

function firstPartyHost(baseUrl) {
  return new URL(baseUrl).hostname.toLowerCase();
}

function classifyRequest(url, baseHost) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { foreign: false, googleTracking: false };
  }
  const host = parsed.hostname.toLowerCase();
  const foreign = host !== baseHost && host !== '127.0.0.1' && host !== 'localhost';
  const googleTracking =
    trackingHost(host) || isGoogleComRequest(host, parsed.pathname);
  return { foreign, googleTracking, host, path: `${parsed.pathname}${parsed.search}` };
}

function uniqueRequestList(entries) {
  const seen = new Set();
  const list = [];
  for (const entry of entries) {
    const key = `${entry.host}|${entry.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({ host: entry.host, path: entry.path, url: entry.url });
  }
  list.sort((a, b) => a.host.localeCompare(b.host) || a.path.localeCompare(b.path));
  return list;
}

function hasGaCookie(cookies) {
  return cookies.some((c) => c.name.startsWith('_ga'));
}

async function gotoEn(page) {
  if (VERCEL_SHARE && REMOTE_BASE) {
    await page.goto(`${REMOTE_BASE}/?_vercel_share=${VERCEL_SHARE}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
  }
  await page.goto(`${BASE}/en`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
}

async function readConsentSignals(page) {
  return page.evaluate(() => {
    const layer = window.dataLayer || [];
    let consentDefault = null;
    let consentUpdate = null;
    for (let i = 0; i < layer.length; i += 1) {
      const entry = layer[i];
      if (!entry) continue;
      const cmd = entry[0] ?? entry['0'];
      const arg = entry[1] ?? entry['1'];
      const payload = entry[2] ?? entry['2'];
      if (cmd === 'consent' && arg === 'default') consentDefault = payload;
      if (cmd === 'consent' && arg === 'update') consentUpdate = payload;
    }
    return {
      consentDefault,
      consentUpdate,
      gtmLoaded: Boolean(window.__skytzGtmLoaded),
      klaroVisible: Boolean(document.querySelector('#klaro .cm-modal, #klaro .cn-body')),
    };
  });
}

async function clickKlaroNoticeAccept(page) {
  const button = page.locator('#klaro .cn-buttons .cm-btn-success');
  await button.waitFor({ state: 'visible', timeout: 15_000 });
  await button.click();
}

async function clickKlaroNoticeDecline(page) {
  const button = page.locator('#klaro .cn-buttons .cn-decline');
  await button.waitFor({ state: 'visible', timeout: 15_000 });
  await button.click();
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not ready
    }
    await sleep(300);
  }
  throw new Error(`Preview server did not become ready at ${url}`);
}

function attachNetworkRecorder(page, baseHost) {
  const raw = [];
  const onRequest = (request) => {
    const info = classifyRequest(request.url(), baseHost);
    if (!info.foreign && !info.googleTracking) return;
    raw.push({
      url: request.url(),
      host: info.host,
      path: info.path,
      googleTracking: info.googleTracking,
      foreign: info.foreign,
    });
  };
  page.on('request', onRequest);
  return {
    raw,
    stop: () => page.off('request', onRequest),
    snapshot() {
      const foreign = uniqueRequestList(raw.filter((e) => e.foreign));
      const googleTracking = uniqueRequestList(raw.filter((e) => e.googleTracking));
      return { foreignRequests: foreign, googleTrackingRequests: googleTracking };
    },
  };
}

async function runScenario(browser, baseHost, { name, action, waitMs }) {
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();
  const network = attachNetworkRecorder(page, baseHost);

  await gotoEn(page);
  if (action) await action(page);
  await sleep(waitMs);

  const cookies = await context.cookies();
  const signals = await readConsentSignals(page);
  const requests = network.snapshot();
  network.stop();

  const screenshotPath = path.join(ARTIFACT_DIR, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  let scenarioPass = false;

  if (name === 'before_consent') {
    const denied =
      signals.consentDefault &&
      signals.consentDefault.analytics_storage === 'denied' &&
      signals.consentDefault.ad_storage === 'denied';
    scenarioPass =
      denied &&
      !hasGaCookie(cookies) &&
      requests.googleTrackingRequests.length === 0 &&
      requests.foreignRequests.length === 0 &&
      !signals.gtmLoaded;
  } else if (name === 'after_decline') {
    const deniedUpdate =
      !signals.consentUpdate || signals.consentUpdate.analytics_storage === 'denied';
    scenarioPass =
      deniedUpdate &&
      !hasGaCookie(cookies) &&
      requests.googleTrackingRequests.length === 0 &&
      requests.foreignRequests.length === 0 &&
      !signals.gtmLoaded;
  } else if (name === 'after_accept') {
    scenarioPass =
      signals.gtmLoaded &&
      requests.googleTrackingRequests.some((r) => r.host.includes('googletagmanager')) &&
      hasGaCookie(cookies);
  }

  await context.close();

  return {
    step: name,
    pass: scenarioPass,
    screenshot: screenshotPath,
    detail: {
      cookies: cookies.map((c) => ({ name: c.name, domain: c.domain })),
      ...signals,
      ...requests,
    },
  };
}

async function main() {
  await mkdir(ARTIFACT_DIR, { recursive: true });

  let preview = null;
  const killPreview = () => {
    if (preview && !preview.killed) preview.kill('SIGTERM');
  };

  if (!REMOTE_BASE) {
    preview = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
      stdio: 'ignore',
      detached: true,
      env: { ...process.env, NODE_ENV: 'production' },
    });
    preview.unref();
  }

  const results = [];

  try {
    await waitForServer(`${BASE}/en`);
    const baseHost = firstPartyHost(BASE);
    const browser = await chromium.launch({ headless: true });

    results.push(
      await runScenario(browser, baseHost, {
        name: 'before_consent',
        waitMs: 3000,
      }),
    );

    results.push(
      await runScenario(browser, baseHost, {
        name: 'after_decline',
        waitMs: 2500,
        action: clickKlaroNoticeDecline,
      }),
    );

    results.push(
      await runScenario(browser, baseHost, {
        name: 'after_accept',
        waitMs: 5000,
        action: clickKlaroNoticeAccept,
      }),
    );

    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await gotoEn(page);
      await page.getByRole('button', { name: /Cookie settings/i }).click();
      await page.locator('#klaro .cm-modal, #klaro .cn-body').first().waitFor({ state: 'visible', timeout: 10_000 });
      const screenshotPath = path.join(ARTIFACT_DIR, 'reopen_settings.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.push({ step: 'reopen_settings', pass: true, screenshot: screenshotPath, detail: {} });
      await context.close();
    }

    await browser.close();
  } finally {
    killPreview();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    probe: probeLabel,
    base: BASE,
    results,
    summary: {
      passed: results.every((r) => r.pass),
      failedSteps: results.filter((r) => !r.pass).map((r) => r.step),
    },
  };

  const reportPath = path.join(ARTIFACT_DIR, 'report.json');
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify(report, null, 2));

  if (!report.summary.passed) {
    console.error('Consent probe FAILED', report.summary.failedSteps);
    process.exit(1);
  }
  console.log('Consent probe passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});