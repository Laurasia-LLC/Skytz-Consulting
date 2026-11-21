import { updateGoogleConsent } from './googleConsent';

function resolveLang() {
  if (typeof window === 'undefined') return 'en';
  const fromPath = window.location.pathname.split('/').filter(Boolean)[0];
  if (fromPath === 'de' || fromPath === 'en') return fromPath;
  const htmlLang = (document.documentElement.lang || '').toLowerCase().split('-')[0];
  if (htmlLang === 'de' || htmlLang === 'en') return htmlLang;
  return 'en';
}

function privacyPath(lang) {
  return `/${lang}/privacy`;
}

function imprintPath(lang) {
  return `/${lang}/imprint`;
}

export function buildKlaroConfig(lang = resolveLang()) {
  return {
    version: 1,
    elementID: 'klaro',
    styling: {
      theme: ['light', 'bottom', 'wide'],
    },
    storageMethod: 'cookie',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 180,
    default: false,
    mustConsent: false,
    acceptAll: true,
    hideDeclineAll: false,
    hideLearnMore: false,
    noticeAsModal: false,
    disablePoweredBy: true,
    groupByPurpose: true,
    htmlTexts: true,
    lang,
    translations: {
      en: {
        privacyPolicyUrl: privacyPath('en'),
        ok: 'Accept all',
        decline: 'Decline all',
        consentNotice: {
          title: 'Cookie settings',
          description:
            'We use Google Tag Manager and Google Analytics only if you agree. No analytics requests are sent before your choice. See our <a href="' +
            privacyPath('en') +
            '">privacy policy</a> and <a href="' +
            imprintPath('en') +
            '">legal notice</a>.',
        },
        consentModal: {
          title: 'Privacy settings',
          description:
            'Choose whether we may use analytics cookies. Essential cookies store your consent choice via Klaro in your browser.',
        },
        purposes: {
          analytics: {
            title: 'Analytics',
            description:
              'Helps us measure traffic and improve the website (Google Tag Manager, Google Analytics 4).',
          },
        },
        googleAnalytics: {
          title: 'Google Tag Manager & Analytics',
          description:
            'Sets analytics cookies (e.g. _ga) and processes usage data through Google Tag Manager (GTM-PL3F42RM) and Google Analytics 4 (G-1XDT92HXNG), subject to your consent.',
        },
        privacyPolicy: {
          name: 'privacy policy',
          text: 'privacy policy',
        },
      },
      de: {
        privacyPolicyUrl: privacyPath('de'),
        ok: 'Alle akzeptieren',
        decline: 'Alle ablehnen',
        consentNotice: {
          title: 'Cookie-Einstellungen',
          description:
            'Google Tag Manager und Google Analytics werden nur mit Ihrer Einwilligung geladen. Vor Ihrer Entscheidung werden keine Analyse-Anfragen gesendet. Details in der <a href="' +
            privacyPath('de') +
            '">Datenschutzerklärung</a> und im <a href="' +
            imprintPath('de') +
            '">Impressum</a>.',
        },
        consentModal: {
          title: 'Datenschutz-Einstellungen',
          description:
            'Legen Sie fest, ob wir Analytics-Cookies verwenden dürfen. Essenzielle Cookies speichern Ihre Einwilligung über Klaro im Browser.',
        },
        purposes: {
          analytics: {
            title: 'Analyse',
            description:
              'Hilft uns, Besucherzahlen zu messen und die Website zu verbessern (Google Tag Manager, Google Analytics 4).',
          },
        },
        googleAnalytics: {
          title: 'Google Tag Manager & Analytics',
          description:
            'Setzt Analytics-Cookies (z. B. _ga) und verarbeitet Nutzungsdaten über Google Tag Manager (GTM-PL3F42RM) und Google Analytics 4 (G-1XDT92HXNG), abhängig von Ihrer Einwilligung.',
        },
        privacyPolicy: {
          name: 'Datenschutzerklärung',
          text: 'Datenschutzerklärung',
        },
      },
    },
    services: [
      {
        name: 'googleAnalytics',
        purposes: ['analytics'],
        cookies: [/^(_ga|_gid|_gat)/, /^_gac_/, /^_gcl_/],
        required: false,
        default: false,
        optOut: false,
        onlyOnce: false,
        callback(consent) {
          updateGoogleConsent(consent);
        },
      },
    ],
  };
}