import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Factory, Wrench, Network, Gauge, ArrowRight } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';
import useLanguage from '../hooks/useLanguage';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const SECTOR_ICONS = [Factory, Wrench, Gauge, Network];

export default function Industries() {
  const { t, i18n } = useTranslation();
  const { getLocalizedPath } = useLanguage();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.industries?.[lang] || pageSEOConfig.industries?.en;

  const sectors = t('industries.sectors', { returnObjects: true }) || [];
  const labels = t('industries.labels', { returnObjects: true }) || {};

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
              <motion.p variants={fadeIn} className="text-sm font-medium uppercase tracking-wider text-blueprint-600">
                {t('industries.subtitle')}
              </motion.p>
              <motion.h1 variants={fadeIn} className="mt-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
                {t('industries.title')}
              </motion.h1>
              <motion.p variants={fadeIn} className="mt-6 text-lg text-slate-600 leading-relaxed">
                {t('industries.intro')}
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid gap-6 lg:grid-cols-2"
            >
              {sectors.map((sector, index) => {
                const Icon = SECTOR_ICONS[index % SECTOR_ICONS.length];
                return (
                  <motion.div key={index} variants={fadeIn}>
                    <BentoCard className="h-full">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blueprint-50">
                          <Icon className="h-5 w-5 text-blueprint-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 leading-snug">{sector.name}</h2>
                      </div>

                      <dl className="space-y-4 text-sm">
                        {[
                          ['roles', sector.roles],
                          ['tech', sector.tech],
                          ['channel', sector.channel]
                        ].map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              {labels[key]}
                            </dt>
                            <dd className="mt-1 text-slate-600 leading-relaxed">{value}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-blueprint-600">
                          {labels.screen}
                        </p>
                        <p className="mt-2 text-slate-700 leading-relaxed">{sector.screen}</p>
                      </div>
                    </BentoCard>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-10 max-w-3xl text-slate-500"
            >
              {t('industries.note')}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-8"
            >
              <Link
                to={getLocalizedPath('meet-philipp')}
                className="inline-flex items-center gap-2 font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors"
              >
                {t('hero.cta.primary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
