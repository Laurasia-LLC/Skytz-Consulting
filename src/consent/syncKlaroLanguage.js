import { initKlaro } from './initKlaro';

/** Keep Klaro UI language aligned with react-i18next (/en, /de). */
export function syncKlaroLanguage(i18n) {
  const apply = (lng) => {
    const code = (lng || 'en').toLowerCase().split('-')[0];
    if (code !== 'en' && code !== 'de') return;
    initKlaro(code);
  };

  i18n.on('languageChanged', apply);

  return () => {
    i18n.off('languageChanged', apply);
  };
}