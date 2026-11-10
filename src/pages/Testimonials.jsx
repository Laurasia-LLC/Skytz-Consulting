import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, Building2, CheckCircle, FileText } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';
import { assetUrl } from '../utils/assetUrl';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.testimonials[lang] || pageSEOConfig.testimonials.en;

  // Client keys to iterate over
  // On-niche proof first (Megger + SebaKMT, same group, deepest relationship), then breadth.
  const clientKeys = ['megger', 'sebakmt', 'eurasiagroup', 'swr', 'otopront', 'box02', 'gef'];

  // Published letters must be signed and on letterhead. Box02's is excluded on
  // purpose: its letterhead carries a Sheridan, WY registered-agent address.
  const letterByClient = {
    megger: { url: assetUrl('recommendation/Megger-Reference-Friedrich-Enkert.pdf') },
    swr: { url: assetUrl('recommendation/SWR-Reference-Dirk-Heesen.pdf') },
    eurasiagroup: {
      url: assetUrl('recommendation/Eurasia-Reference-Mustafa-Sahin.pdf'),
      redacted: true,
    },
    otopront: {
      url: assetUrl('recommendation/Otopront-Reference-Carlo-Happersberger-DE.pdf'),
      german: true,
    },
  };

  const cases = clientKeys.map(key => ({
    key,
    letter: letterByClient[key],
    company: t(`testimonials.clients.${key}.company`),
    industry: t(`testimonials.clients.${key}.industry`),
    person: t(`testimonials.clients.${key}.contact`),
    role: t(`testimonials.clients.${key}.role`),
    quote: t(`testimonials.clients.${key}.quote`),
    quoteNote: t(`testimonials.clients.${key}.quoteNote`, { defaultValue: '' }),
    outcome: t(`testimonials.clients.${key}.outcome`, { defaultValue: '' }),
    highlights: t(`testimonials.clients.${key}.highlights`, { returnObjects: true }) || []
  }));

  return (
    <>
      <SEO title={seoConfig.title} description={seoConfig.description} />
      <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.p variants={fadeIn} className="text-sm font-medium uppercase tracking-wider text-blueprint-600">
              {t('testimonials.subtitle')}
            </motion.p>
            <motion.h1 variants={fadeIn} className="mt-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
              {t('testimonials.title')}
            </motion.h1>
            <motion.p variants={fadeIn} className="mt-6 text-lg text-slate-600">
              {t('testimonials.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            {cases.map((c) => (
              <motion.div key={c.key} variants={fadeIn}>
                <BentoCard className="p-0 overflow-hidden">
                  <div className="grid md:grid-cols-3">
                    {/* Company Info */}
                    <div className="p-8 md:border-r border-slate-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-24 w-48 items-center justify-center rounded-xl bg-blueprint-50 p-3 shrink-0">
                          {c.key === 'megger' ? (
                            <img src={assetUrl('recommendation/Megger_logo_without_slogan.svg')} alt="Megger" className="max-h-16 max-w-40 object-contain" />
                          ) : c.key === 'eurasiagroup' ? (
                            <img src={assetUrl('recommendation/Eurasia-logo.png')} alt="Eurasia Group" className="max-h-20 max-w-44 object-contain" />
                          ) : c.key === 'swr' ? (
                            <img src={assetUrl('recommendation/SWR_logo.jpeg')} alt="SWR Südwestdeutsche Rohrleitungsbau" className="max-h-16 max-w-40 object-contain" />
                          ) : c.key === 'sebakmt' ? (
                            <img src={assetUrl('recommendation/sebakmt-logo-black-rgb-scaled.png')} alt="SebaKMT" className="max-h-16 max-w-40 object-contain" />
                          ) : c.key === 'otopront' ? (
                            <img src={assetUrl('recommendation/otopront-logo.png')} alt="Otopront" className="max-h-16 max-w-40 object-contain" />
                          ) : c.key === 'box02' ? (
                            <img src={assetUrl('recommendation/Logo-box02.png')} alt="Box02" className="max-h-16 max-w-40 object-contain" />
                          ) : c.key === 'gef' ? (
                            <img src={assetUrl('recommendation/Logo-gef.png')} alt="GEF Ingenieur AG" className="max-h-16 max-w-40 object-contain" />
                          ) : (
                            <Building2 className="h-12 w-12 text-blueprint-600" />
                          )}
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900">{c.company}</h2>
                          <p className="text-sm text-slate-500">{c.industry}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{c.person}</p>
                        <p className="text-sm text-slate-500">{c.role}</p>
                      </div>
                      
                      {c.outcome && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700">{c.outcome}</span>
                        </div>
                      )}

                      {c.letter && (
                        <div className="mt-4">
                          <a
                            href={c.letter.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors"
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            {c.letter.german
                              ? t('testimonials.letterLabelGerman')
                              : t('testimonials.letterLabel')}
                          </a>
                          {c.letter.redacted && (
                            <p className="mt-1 text-xs text-slate-500">
                              {t('testimonials.redactionNote')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Quote */}
                    <div className="md:col-span-2 p-8 bg-slate-50/50">
                      <div className="flex gap-4">
                        <Quote className="h-8 w-8 text-blueprint-200 shrink-0" />
                        <div>
                          <p className="text-slate-700 italic leading-relaxed">
                            "{c.quote}"
                          </p>
                          {c.quoteNote && (
                            <p className="text-xs text-slate-400 mt-1">({c.quoteNote})</p>
                          )}
                          
                          <div className="mt-6 space-y-2">
                            {Array.isArray(c.highlights) && c.highlights.map((h, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <ArrowRight className="h-4 w-4 text-blueprint-500" />
                                {h}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reference CTA */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {t('testimonials.cta.title')}
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              {t('testimonials.cta.description')}
            </p>
            <a
              href="mailto:info@skytz-consulting.com"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              {t('testimonials.cta.button')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
