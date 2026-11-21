/** Load Google Tag Manager only after the user has granted analytics consent. */
export const GTM_ID = 'GTM-PL3F42RM';

export function loadGoogleTagManager() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__skytzGtmLoaded) return;
  window.__skytzGtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
}

export function isGoogleTagManagerLoaded() {
  return Boolean(window.__skytzGtmLoaded);
}