import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Users, Shield, TrendingUp, Lock, Building2, Briefcase, ArrowRight, Columns2, Globe2, Ruler } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';
import { mandateSummaries } from '../content/vacancies';
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

export default function About() {
  const { t, i18n } = useTranslation();
  const { getLocalizedPath } = useLanguage();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.about[lang] || pageSEOConfig.about.en;

  useEffect(() => {
    document.title = `${t('nav.about')} | Skytz Consulting`;
  }, [t]);

  const operations = [
    { icon: Users, key: 'direct' },
    { icon: Shield, key: 'documented' },
    { icon: TrendingUp, key: 'honest' },
    { icon: Lock, key: 'discretion' }
  ];

  const mandates = useMemo(() => mandateSummaries(t), [t]);

  return (
    <>
      <SEO title={seoConfig.title} description={seoConfig.description} />
      <div className="min-h-screen bg-slate-50">
        {/* Intro */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.p variants={fadeIn} className="text-sm font-medium uppercase tracking-wider text-blueprint-600">
                {t('about.subtitle')}
              </motion.p>
              <motion.h1 variants={fadeIn} className="mt-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
                {t('about.title')}
              </motion.h1>
              <motion.p variants={fadeIn} className="mt-6 text-lg text-slate-600">
                {t('about.description')}
              </motion.p>
              <motion.div variants={fadeIn} className="mt-6 space-y-5 text-slate-600 leading-relaxed">
                <p>{t('about.body.market')}</p>
                <p>{t('about.body.placed')}</p>
                {/* German ships no metric strip, so the retention figure lands here instead. */}
                <p>{t('about.body.numbers')}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Searches running now */}
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blueprint-50">
                    <Search className="h-5 w-5 text-blueprint-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('searches.title')}</h2>
                </div>
                <ul className="space-y-4">
                  {mandates.map(({ key, title, location }) => (
                    <li key={key} className="flex gap-3 text-slate-700 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blueprint-500" />
                      <span>
                        {title}
                        <span className="text-slate-400"> — </span>
                        <span className="text-slate-500">{location}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
                  {t('searches.note')}
                </p>
                <Link
                  to={getLocalizedPath('vacancies')}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors"
                >
                  {t('searches.allRoles')} &rarr;
                </Link>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* How I work */}
        <section className="border-t border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('about.operationsTitle')}</h2>
                </div>

                <div className="space-y-6">
                  {operations.map((op) => (
                    <div key={op.key} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <op.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{t(`about.operations.${op.key}.title`)}</h3>
                        <p className="mt-1 text-sm text-slate-600">{t(`about.operations.${op.key}.description`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* Methodology: the thing that makes the numbers defensible rather than decorative */}
        <section id="method" className="border-t border-slate-200 py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Ruler className="h-5 w-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('method.title')}</h2>
                </div>
                <p className="mb-6 text-slate-600 leading-relaxed">{t('method.intro')}</p>

                <div className="divide-y divide-slate-100">
                  {(t('method.items', { returnObjects: true }) || []).map((item, index) => (
                    <div key={index} className="py-5 first:pt-0">
                      <h3 className="font-semibold text-slate-900">{item.metric}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.definition}</p>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        <span className="font-semibold text-slate-600">
                          {t('method.excludesLabel')}:
                        </span>{' '}
                        {item.excludes}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                  {t('method.window')}
                </p>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  {t('method.benchmarkNote')}
                </p>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* How the two markets differ - the thing a US subsidiary has to explain upward */}
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blueprint-50">
                    <Globe2 className="h-5 w-5 text-blueprint-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('markets.title')}</h2>
                </div>
                <p className="mb-6 text-slate-600 leading-relaxed">{t('markets.intro')}</p>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        <th className="w-1/4 py-3 pr-4" />
                        <th className="w-[37.5%] py-3 pr-4 font-semibold text-blueprint-600">
                          {t('markets.usLabel')}
                        </th>
                        <th className="w-[37.5%] py-3 font-semibold text-slate-500">
                          {t('markets.deLabel')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(t('markets.rows', { returnObjects: true }) || []).map((row, index) => (
                        <tr key={index} className="border-b border-slate-100 align-top last:border-0">
                          <td className="py-4 pr-4 font-semibold text-slate-900">{row.topic}</td>
                          <td className="py-4 pr-4 text-slate-800">{row.us}</td>
                          <td className="py-4 text-slate-600">{row.de}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
                  {t('markets.note')}
                </p>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* Why not a generalist */}
        <section className="border-t border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Columns2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('whyNot.title')}</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[34rem] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        <th className="w-1/4 py-3 pr-4 font-semibold text-slate-400" />
                        <th className="w-[37.5%] py-3 pr-4 font-semibold text-slate-500">
                          {t('whyNot.themLabel')}
                        </th>
                        <th className="w-[37.5%] py-3 font-semibold text-blueprint-600">
                          {t('whyNot.meLabel')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(t('whyNot.rows', { returnObjects: true }) || []).map((row, index) => (
                        <tr key={index} className="border-b border-slate-100 align-top last:border-0">
                          <td className="py-4 pr-4 font-semibold text-slate-900">{row.topic}</td>
                          <td className="py-4 pr-4 text-slate-500">{row.them}</td>
                          <td className="py-4 text-slate-800">{row.me}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* Background */}
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blueprint-50">
                    <Briefcase className="h-5 w-5 text-blueprint-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('about.backgroundTitle')}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">{t('about.background')}</p>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* Company + how to reach me */}
        <section className="border-t border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <BentoCard className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('about.legal.title')}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">{t('about.legal.description')}</p>
                <p className="mt-4 text-slate-600 leading-relaxed">{t('about.body.reach')}</p>
                <Link
                  to={getLocalizedPath('meet-philipp')}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors"
                >
                  {t('hero.cta.primary')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </BentoCard>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
