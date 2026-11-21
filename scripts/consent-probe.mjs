/**
 * Headless functional probe for Klaro + Google Consent Mode v2.
 * Run after `npm run build` with preview server on PORT (default 4173).
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

const PORT = Number(process.env.CONSENT_PROBE_PORT || 4173);
const BASE = `http://127.0.0.1:${PORT}`;

function hasGaCookie(cookies) {
  return cookies.some((c) => c.name.startsWith('_ga'));
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

async function main() {
  const preview = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' },
  });

  const logs = [];
  preview.stdout.on('data', (d) => logs.push(String(d)));
  preview.stderr.on('data', (d) => logs.push(String(d)));

  const killPreview = () => {
    if (!preview.killed) preview.kill('SIGTERM');
  };

  const results = [];

  try {
    await waitForServer(`${BASE}/en`);
    const browser = await chromium.launch({ headless: true });

    // --- Before consent: defaults denied, no _ga ---
    {
      const context = await browser.newContext();
      await context.clearCookies();
      const page = await context.newPage();
      await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
      await sleep(1500);
      const cookies = await context.cookies();
      const signals = await readConsentSignals(page);
      const denied =
        signals.consentDefault &&
        signals.consentDefault.analytics_storage === 'denied' &&
        signals.consentDefault.ad_storage === 'denied' &&
        signals.consentDefault.ad_user_data === 'denied' &&
        signals.consentDefault.ad_personalization === 'denied';
      results.push({
        step: 'before_consent',
        pass: !hasGaCookie(cookies) && denied,
        detail: { gaCookies: cookies.filter((c) => c.name.startsWith('_ga')), consentDefault: signals.consentDefault },
      });
      await context.close();
    }

    // --- Accept all: consent granted, GA allowed to run ---
    {
      const context = await browser.newContext();
      await context.clearCookies();
      const page = await context.newPage();
      await page.goto(`${BASE}/en`, { waitUntil: 'domcontentloaded' });
      await clickKlaroNoticeAccept(page);
      await sleep(3000);
      const cookies = await context.cookies();
      const signals = await readConsentSignals(page);
      const granted =
        signals.consentUpdate &&
        signals.consentUpdate.analytics_storage === 'granted';
      results.push({
        step: 'after_accept',
        pass: granted && (hasGaCookie(cookies) || cookies.some((c) => c.name === 'klaro')),
        detail: {
          consentUpdate: signals.consentUpdate,
          gaCookies: cookies.filter((c) => c.name.startsWith('_ga')),
          klaroCookie: cookies.find((c) => c.name === 'klaro'),
        },
      });
      await context.close();
    }

    // --- Decline: remain denied, no new GA activity ---
    {
      const context = await browser.newContext();
      await context.clearCookies();
      const page = await context.newPage();
      await page.goto(`${BASE}/en`, { waitUntil: 'domcontentloaded' });
      await clickKlaroNoticeDecline(page);
      await sleep(2000);
      const cookies = await context.cookies();
      const signals = await readConsentSignals(page);
      const deniedUpdate =
        !signals.consentUpdate ||
        signals.consentUpdate.analytics_storage === 'denied';
      results.push({
        step: 'after_decline',
        pass: !hasGaCookie(cookies) && deniedUpdate,
        detail: { consentUpdate: signals.consentUpdate, gaCookies: cookies.filter((c) => c.name.startsWith('_ga')) },
      });
      await context.close();
    }

    // --- Reopen settings from footer ---
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE}/en`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /Cookie settings/i }).click();
      await page.locator('#klaro .cm-modal, #klaro .cn-body').first().waitFor({ state: 'visible', timeout: 10_000 });
      results.push({ step: 'reopen_settings', pass: true, detail: {} });
      await context.close();
    }

    await browser.close();
  } finally {
    killPreview();
  }

  const failed = results.filter((r) => !r.pass);
  console.log(JSON.stringify({ results }, null, 2));
  if (failed.length > 0) {
    console.error('Consent probe FAILED', failed);
    if (logs.length) console.error(logs.join(''));
    process.exit(1);
  }
  console.log('Consent probe passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});