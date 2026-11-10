import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function Privacy() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.privacy[lang] || pageSEOConfig.privacy.en;

  return (
    <>
      <SEO title={seoConfig.title} description={seoConfig.description} />
      <div className="min-h-screen bg-slate-50">
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900 md:text-4xl">
              {t('privacy.title')}
            </h1>
            <p className="mt-4 text-sm text-slate-500">{t('privacy.lastUpdated')}</p>

            <div className="prose prose-slate mt-8 max-w-none">
              <p className="text-slate-600 leading-relaxed">
                {t('privacy.intro')}
              </p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.controller.title')}</h2>
              <p className="text-slate-600 mt-2">{t('privacy.controller.description')}</p>
              <address className="mt-2 text-slate-600 not-italic">
                Laurasia LLC<br />
                1309 Coffeen Avenue STE 1200<br />
                Sheridan, WY 82801<br />
                United States
              </address>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.dataCollected.title')}</h2>
              <p className="text-slate-600">{t('privacy.dataCollected.intro')}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• {t('privacy.dataCollected.items.contact')}</li>
                <li>• {t('privacy.dataCollected.items.email')}</li>
                <li>• {t('privacy.dataCollected.items.technical')}</li>
                <li>• {t('privacy.dataCollected.items.candidate')}</li>
                <li>• {t('privacy.dataCollected.items.usage')}</li>
              </ul>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.purpose.title')}</h2>
              <p className="text-slate-600">{t('privacy.purpose.intro')}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• {t('privacy.purpose.items.inquiries')}</li>
                <li>• {t('privacy.purpose.items.services')}</li>
                <li>• {t('privacy.purpose.items.website')}</li>
                <li>• {t('privacy.purpose.items.legal')}</li>
                <li>• {t('privacy.purpose.items.communication')}</li>
              </ul>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.usRights.title')}</h2>
              <p className="text-slate-600">{t('privacy.usRights.description')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.legalBasis.title')}</h2>
              <p className="text-slate-600">{t('privacy.legalBasis.intro')}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>• {t('privacy.legalBasis.items.consent')}</li>
                <li>• {t('privacy.legalBasis.items.contract')}</li>
                <li>• {t('privacy.legalBasis.items.legitimate')}</li>
                <li>• {t('privacy.legalBasis.items.legal')}</li>
              </ul>
              <p className="mt-2 text-slate-600">{t('privacy.legalBasis.rights')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.sharing.title')}</h2>
              <p className="text-slate-600">{t('privacy.sharing.description')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.retention.title')}</h2>
              <p className="text-slate-600">{t('privacy.retention.description')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.security.title')}</h2>
              <p className="text-slate-600">{t('privacy.security.description')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.cookies.title')}</h2>
              <p className="text-slate-600">{t('privacy.cookies.description')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.changes.title')}</h2>
              <p className="text-slate-600">{t('privacy.changes.description')}</p>

              <h2 className="mt-8 text-xl font-bold text-slate-900">{t('privacy.contact.title')}</h2>
              <p className="text-slate-600">
                {t('privacy.contact.description')}: <a href="mailto:legal@skytz-consulting.com" className="text-blueprint-600 hover:underline">legal@skytz-consulting.com</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
