// Analytics consent. Google Tag Manager (and everything it fires, e.g. GA4)
// is only injected after the visitor clicks "Accept"; until then no request
// goes to Google. The choice itself is strictly necessary storage.
const KEY = 'skytz-consent';
const GTM_ID = 'GTM-PL3F42RM';

export function getConsent() {
  try {
    return localStorage.getItem(KEY); // 'granted' | 'denied' | null
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the banner will simply ask again next visit.
  }
}

export function resetConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  // Reload so an already-running GTM container is gone after withdrawal.
  window.location.reload();
}

export function loadGTM() {
  if (window.__skytzGtmLoaded) return;
  window.__skytzGtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}
