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

export default function Imprint() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.imprint[lang] || pageSEOConfig.imprint.en;

  // Fields the business still has to supply render only once filled in.
  const phone = t('imprint.contact.phone');
  const registerAuthority = t('imprint.register.authority');
  const registerNumber = t('imprint.register.number');
  const vat = t('imprint.vat.value');

  // German and Austrian law require the § blocks below; the English locale
  // leaves them empty so U.S. readers get a plain legal notice instead.
  const responsibleTitle = t('imprint.responsible.title');
  const disclaimerTitle = t('imprint.disclaimer.title');
  const externalLinksTitle = t('imprint.externalLinks.title');
  const disputeTitle = t('imprint.dispute.title');

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
                {t('imprint.title')}
              </h1>

              <div className="prose prose-slate mt-8 max-w-none">
                <h2 className="mt-8 text-xl font-bold text-slate-900">{t('imprint.provider.title')}</h2>
                <address className="mt-2 text-slate-600 not-italic leading-relaxed">
                  Laurasia LLC<br />
                  1309 Coffeen Avenue STE 1200<br />
                  Sheridan, WY 82801<br />
                  United States
                </address>
                <p className="mt-2 text-slate-600">{t('imprint.provider.brandNote')}</p>

                <h2 className="mt-8 text-xl font-bold text-slate-900">{t('imprint.representedBy.title')}</h2>
                <p className="mt-2 text-slate-600">
                  {t('imprint.representedBy.name')}, {t('imprint.representedBy.role')}
                </p>

                <h2 className="mt-8 text-xl font-bold text-slate-900">{t('imprint.contact.title')}</h2>
                <p className="mt-2 text-slate-600">
                  {t('imprint.contact.emailLabel')}:{' '}
                  <a href="mailto:info@skytz-consulting.com" className="text-blueprint-600 hover:underline">
                    info@skytz-consulting.com
                  </a>
                </p>
                <p className="mt-1 text-slate-600">
                  {t('imprint.contact.legalEmailLabel')}:{' '}
                  <a href="mailto:legal@skytz-consulting.com" className="text-blueprint-600 hover:underline">
                    legal@skytz-consulting.com
                  </a>
                </p>
                {phone && (
                  <p className="mt-1 text-slate-600">
                    {t('imprint.contact.phoneLabel')}:{' '}
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-blueprint-600 hover:underline">
                      {phone}
                    </a>
                  </p>
                )}

                {(registerAuthority || registerNumber) && (
                  <>
                    <h2 className="mt-8 text-xl font-bold text-slate-900">{t('imprint.register.title')}</h2>
                    {registerAuthority && (
                      <p className="mt-2 text-slate-600">
                        {t('imprint.register.authorityLabel')}: {registerAuthority}
                      </p>
                    )}
                    {registerNumber && (
                      <p className="mt-1 text-slate-600">
                        {t('imprint.register.numberLabel')}: {registerNumber}
                      </p>
                    )}
                  </>
                )}

                {vat && (
                  <>
                    <h2 className="mt-8 text-xl font-bold text-slate-900">{t('imprint.vat.title')}</h2>
                    <p className="mt-2 text-slate-600">{vat}</p>
                  </>
                )}

                {responsibleTitle && (
                  <>
                    <h2 className="mt-8 text-xl font-bold text-slate-900">{responsibleTitle}</h2>
                    <address className="mt-2 text-slate-600 not-italic leading-relaxed">
                      {t('imprint.responsible.name')}<br />
                      1309 Coffeen Avenue STE 1200<br />
                      Sheridan, WY 82801<br />
                      United States
                    </address>
                  </>
                )}

                {disclaimerTitle && (
                  <>
                    <h2 className="mt-8 text-xl font-bold text-slate-900">{disclaimerTitle}</h2>
                    <p className="mt-2 text-slate-600 leading-relaxed">{t('imprint.disclaimer.content')}</p>
                  </>
                )}

                {externalLinksTitle && (
                  <>
                    <h2 className="mt-8 text-xl font-bold text-slate-900">{externalLinksTitle}</h2>
                    <p className="mt-2 text-slate-600 leading-relaxed">{t('imprint.externalLinks.content')}</p>
                  </>
                )}

                <h2 className="mt-8 text-xl font-bold text-slate-900">{t('imprint.copyrightNotice.title')}</h2>
                <p className="mt-2 text-slate-600 leading-relaxed">{t('imprint.copyrightNotice.content')}</p>

                {disputeTitle && (
                  <>
                    <h2 className="mt-8 text-xl font-bold text-slate-900">{disputeTitle}</h2>
                    <p className="mt-2 text-slate-600 leading-relaxed">{t('imprint.dispute.content')}</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
