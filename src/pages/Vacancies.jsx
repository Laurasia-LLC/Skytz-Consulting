import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, Building2 } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const VACANCIES = [
  {
    key: 'gfAssistenz',
    pdfPath: '/GF-Assistenz.pdf',
  },
  {
    key: 'bauueberwachung',
    pdfPath: '/Bauueberwachung.pdf',
  },
  {
    key: 'technischerZeichner',
    pdfPath: '/Technischer-Zeichner.pdf',
  },
  {
    key: 'expertSifa',
    pdfPath: '/Experte-Sifa.pdf',
  },
];

export default function Vacancies() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.vacancies?.[lang] || pageSEOConfig.vacancies?.en;

  useEffect(() => {
    document.title = `${t('nav.vacancies')} | Skytz Consulting`;
  }, [t]);

  return (
    <>
      {seoConfig && <SEO title={seoConfig.title} description={seoConfig.description} />}

      <div className="min-h-screen bg-slate-50">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.p
                variants={fadeIn}
                className="text-sm font-medium uppercase tracking-wider text-blueprint-600"
              >
                {t('vacancies.subtitle')}
              </motion.p>
              <motion.h1
                variants={fadeIn}
                className="mt-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl lg:text-6xl"
              >
                {t('vacancies.title')}
              </motion.h1>
              <motion.p variants={fadeIn} className="mt-6 text-lg text-slate-600">
                {t('vacancies.description')}
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid gap-6 md:grid-cols-2"
            >
              {VACANCIES.map((v) => (
                <motion.div key={v.key} variants={fadeIn}>
                  <BentoCard className="h-full">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {t(`vacancies.positions.${v.key}.title`)}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span>{t(`vacancies.positions.${v.key}.company`)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{t(`vacancies.positions.${v.key}.location`)}</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={v.pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        {t('vacancies.download')}
                      </a>
                    </div>

                    <p className="mt-6 text-slate-600 leading-relaxed">
                      {t(`vacancies.positions.${v.key}.summary`)}
                    </p>
                  </BentoCard>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 text-center">
              <a
                href="mailto:info@skytz-consulting.com"
                className="inline-flex items-center justify-center rounded-xl bg-blueprint-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blueprint-700 transition-colors"
              >
                {t('vacancies.cta')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
