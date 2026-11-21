import { loadGoogleTagManager } from './loadGtm';

export function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

const CONSENT_KEYS = [
  'ad_storage',
  'analytics_storage',
  'ad_user_data',
  'ad_personalization',
];

/** Apply Google Consent Mode v2 and load GTM only when analytics consent is granted. */
export function updateGoogleConsent(analyticsGranted) {
  ensureGtag();
  const state = analyticsGranted ? 'granted' : 'denied';
  const payload = Object.fromEntries(CONSENT_KEYS.map((key) => [key, state]));
  window.gtag('consent', 'update', payload);
  if (analyticsGranted) {
    loadGoogleTagManager();
  }
}

export function readConsentDefaultFromDataLayer() {
  const layer = window.dataLayer || [];
  for (let i = 0; i < layer.length; i += 1) {
    const entry = layer[i];
    if (entry && entry[0] === 'consent' && entry[1] === 'default' && entry[2]) {
      return entry[2];
    }
  }
  return null;
}

export function readLatestConsentUpdateFromDataLayer() {
  const layer = window.dataLayer || [];
  let latest = null;
  for (let i = 0; i < layer.length; i += 1) {
    const entry = layer[i];
    if (entry && entry[0] === 'consent' && entry[1] === 'update' && entry[2]) {
      latest = entry[2];
    }
  }
  return latest;
}