import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getConsent, setConsent, loadGTM } from '../utils/consent';

export default function CookieConsent() {
  const { t, i18n } = useTranslation();
  const [choice, setChoice] = useState(getConsent);
  const lang = i18n.language === 'de' ? 'de' : 'en';

  useEffect(() => {
    if (choice === 'granted') loadGTM();
  }, [choice]);

  if (choice) return null;

  const decide = (value) => {
    setConsent(value);
    setChoice(value);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur shadow-lg"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600 leading-relaxed">
          {t('consent.text')}{' '}
          <Link to={`/${lang}/privacy`} className="font-medium text-blueprint-600 underline hover:text-blueprint-700">
            {t('consent.more')}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('consent.decline')}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
