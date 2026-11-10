import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLanguage from '../../hooks/useLanguage';
import { resetConsent } from '../../utils/consent';

const LINKEDIN_URL = 'https://www.linkedin.com/in/philipp-hoffschroer/';

export default function Footer() {
  const { t } = useTranslation();
  const { getLocalizedPath } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Legal Entity */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-xl font-bold text-slate-900">Skytz</span>
              <span className="text-blueprint-600 font-semibold">Consulting</span>
            </div>
            <p className="text-slate-600 text-sm mb-3 font-medium">
              {t('footer.legal')}
            </p>
            <address className="text-slate-400 text-xs not-italic leading-relaxed">
              {t('footer.addressLabel')}: {t('footer.address')}
            </address>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">
              {t('contact.title')}
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-700 font-medium">
                Philipp Hoffschröer, {t('imprint.representedBy.role')}
              </p>
              <a
                href="mailto:info@skytz-consulting.com"
                className="block text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                info@skytz-consulting.com
              </a>
              <a
                href="tel:+13074290181"
                className="block text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                +1 307 429 0181
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                {t('footer.linkedin')}
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link 
                to={getLocalizedPath('privacy')} 
                className="block text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                {t('footer.links.privacy')}
              </Link>
              <Link 
                to={getLocalizedPath('terms')} 
                className="block text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                {t('footer.links.terms')}
              </Link>
              <Link
                to={getLocalizedPath('imprint')}
                className="block text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                {t('footer.links.imprint')}
              </Link>
              <button
                type="button"
                onClick={resetConsent}
                className="block text-left text-slate-600 hover:text-blueprint-600 transition-colors"
              >
                {t('consent.settings')}
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-slate-400 text-sm text-center">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
