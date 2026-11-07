import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, MapPin, Clock, ArrowRight, FileText, Calendar, HelpCircle } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';
import { BOOKING_URL } from '../content/booking';
import { assetUrl } from '../utils/assetUrl';

const LINKEDIN_URL = 'https://www.linkedin.com/in/philipp-hoffschroer/';

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

export default function Contact() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.contact[lang] || pageSEOConfig.contact.en;

  useEffect(() => {
    document.title = `${t('nav.contact')} | Skytz Consulting`;
  }, [t]);

  return (
    <>
      <SEO title={seoConfig.title} description={seoConfig.description} />
      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.p variants={fadeIn} className="text-sm font-medium uppercase tracking-wider text-blueprint-600">
                {t('contact.subtitle')}
              </motion.p>
              <motion.h1 variants={fadeIn} className="mt-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
                {t('contact.title')}
              </motion.h1>
              <motion.p variants={fadeIn} className="mt-6 text-lg text-slate-600">
                {t('contact.description')}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Primary CTA: book a call */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex flex-col items-start gap-6 rounded-2xl bg-blueprint-600 p-8 shadow-xl ring-4 ring-blueprint-200 md:flex-row md:items-center md:justify-between md:p-10">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">{t('contact.booking.label')}</h2>
                    <p className="mt-2 text-blueprint-50">{t('contact.booking.action')}</p>
                    <p className="mt-2 text-sm text-blueprint-100">{t('contact.noCommitment')}</p>
                  </div>
                </div>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blueprint-700 shadow-lg transition hover:bg-blueprint-50 md:w-auto"
                >
                  {t('contact.booking.label')}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Who you are actually contacting */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <BentoCard>
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                  <img
                    src={assetUrl('brand/Philipp-Hoffschroer.jpg')}
                    alt="Philipp Hoffschröer"
                    className="h-32 w-32 shrink-0 rounded-2xl object-cover object-top border border-slate-200"
                    loading="eager"
                    decoding="async"
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">Philipp Hoffschröer</h2>
                    <p className="mt-1 text-slate-500">{t('contact.person.role')}</p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {t('contact.person.emailLabel')}
                        </p>
                        <a
                          href="mailto:info@skytz-consulting.com"
                          className="mt-1 inline-flex items-center gap-2 font-medium text-blueprint-600 hover:text-blueprint-700 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          info@skytz-consulting.com
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {t('contact.person.phoneLabel')}
                        </p>
                        <a
                          href="tel:+13074290181"
                          className="mt-1 inline-flex items-center gap-2 font-medium text-blueprint-600 hover:text-blueprint-700 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          +1 307 429 0181
                        </a>
                        <p className="mt-1 text-xs text-slate-500">{t('contact.person.phoneNote')}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {t('contact.person.linkedinLabel')}
                        </p>
                        <a
                          href={LINKEDIN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-2 font-medium text-blueprint-600 hover:text-blueprint-700 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                          /in/philipp-hoffschroer
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {t('contact.hours.title')}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-slate-700">{t('contact.hours.weekdays')}</p>
                        <p className="mt-1 text-xs text-slate-500">{t('contact.hours.timezone')}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {t('contact.office.title')}
                        </span>
                      </p>
                      <address className="mt-1 text-sm not-italic leading-relaxed text-slate-600">
                        Laurasia LLC<br />
                        1309 Coffeen Avenue STE 1200<br />
                        Sheridan, WY 82801, United States
                      </address>
                      <p className="mt-2 text-xs text-slate-500">{t('contact.office.note')}</p>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* Secondary options */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid gap-6"
            >
              <motion.div variants={fadeIn}>
                <BentoCard className="h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 mb-6">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('contact.fasterAlignment.title')}</h2>
                  <p className="mt-2 text-slate-600">{t('contact.fasterAlignment.description')}</p>

                  <div className="mt-6 space-y-3">
                    {['roleTitle', 'location', 'seniority', 'timeline', 'compensation'].map((key) => (
                      <div key={key} className="flex items-center gap-3 text-slate-600">
                        <ArrowRight className="h-4 w-4 text-blueprint-500 shrink-0" />
                        <span>{t(`contact.fasterAlignment.items.${key}`)}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </motion.div>

            </motion.div>
          </div>
        </section>
        {/* FAQ - the questions a buyer asks before they email */}
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <HelpCircle className="h-5 w-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('faq.title')}</h2>
                </div>

                <dl className="divide-y divide-slate-100">
                  {(t('faq.items', { returnObjects: true }) || []).map((item, index) => (
                    <div key={index} className="py-5 first:pt-0 last:pb-0">
                      <dt className="font-semibold text-slate-900">{item.q}</dt>
                      <dd className="mt-2 text-slate-600 leading-relaxed">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </BentoCard>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
