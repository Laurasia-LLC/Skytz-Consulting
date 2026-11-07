import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ShieldCheck, Users, Mail, Phone, Linkedin, ChevronLeft, ChevronRight, Pause, Play, Search, Route, ClipboardCheck, Gauge, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import SEO from '../components/SEO';
import { pageSEOConfig } from '../content/pageSEOConfig';
import { mandateSummaries } from '../content/vacancies';
import { assetUrl } from '../utils/assetUrl';
import useLanguage from '../hooks/useLanguage';

const LINKEDIN_URL = 'https://www.linkedin.com/in/philipp-hoffschroer/';

// The European locales publish fewer figures than the US one, so the strip
// picks a column count that fills the row rather than leaving a ragged gap.
const METRIC_GRID = {
  1: 'sm:grid-cols-1 max-w-2xl',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  default: 'sm:grid-cols-2 lg:grid-cols-4',
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const { getLocalizedPath } = useLanguage();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: "-100px" });
  const lang = i18n.language || 'en';
  const seoConfig = pageSEOConfig.home[lang] || pageSEOConfig.home.en;

  // Spread across sectors rather than stacking one account: SebaKMT is a Megger
  // company, so leading with both reads as a single-client track record.
  const carouselKeys = useMemo(() => ['megger', 'gef', 'swr', 'eurasiagroup'], []);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);

  const isAutoplaying = !isPaused && !isHoverPaused;
  const activeKey = carouselKeys[activeSlideIdx] || 'megger';

  const logoByClient = useMemo(
    () => ({
      megger: {
        src: assetUrl('recommendation/Megger_logo_without_slogan.svg'),
        alt: 'Megger Group',
        className: 'h-12',
      },
      gef: {
        src: assetUrl('recommendation/Logo-gef.png'),
        alt: 'GEF Ingenieur AG',
        className: 'h-14',
      },
      swr: {
        src: assetUrl('recommendation/SWR_logo.jpeg'),
        alt: 'SWR Südwestdeutsche Rohrleitungsbau',
        className: 'h-16',
      },
      eurasiagroup: {
        src: assetUrl('recommendation/Eurasia-logo.png'),
        alt: 'Eurasia Group AG',
        className: 'h-16',
      },
    }),
    []
  );

  const activeLogo = logoByClient[activeKey] || logoByClient.megger;

  const mandates = useMemo(() => mandateSummaries(t), [t]);

  const metricItems = t('metrics.items', { returnObjects: true }) || [];

  useEffect(() => {
    if (!isAutoplaying) return;
    // 9s: long enough to finish reading a client quote.
    const id = setInterval(() => {
      setActiveSlideIdx((idx) => (idx + 1) % carouselKeys.length);
    }, 9000);
    return () => clearInterval(id);
  }, [isAutoplaying, carouselKeys.length]);

  const goPrev = () => setActiveSlideIdx((idx) => (idx - 1 + carouselKeys.length) % carouselKeys.length);
  const goNext = () => setActiveSlideIdx((idx) => (idx + 1) % carouselKeys.length);

  // Framer Motion: "Clarity Transition" for premium headshot reveal
  const imageVariants = {
    initial: { 
      filter: 'grayscale(100%) blur(2px)', 
      opacity: 0.8,
      scale: 1 
    },
    active: { 
      filter: 'grayscale(0%) blur(0px)', 
      opacity: 1,
      scale: 1.02,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <>
      <SEO title={seoConfig.title} description={seoConfig.description} />
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-20 lg:py-28 min-h-screen">

      {/* 12-Column Bento Grid with Swiss Air */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* TILE 1: HERO IDENTITY (8 cols) - Verified Trust & Identity */}
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-8 bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center gap-6 lg:gap-8 relative overflow-hidden"
        >
          {/* Premium Headshot with "Clarity Transition".
              Ordered second on small screens so the headline and the employer
              CTA land inside the first viewport instead of below a 200px
              portrait. */}
          <motion.div 
            className="relative shrink-0 cursor-pointer mb-6 order-2 lg:order-1"
            initial="initial"
            animate={isInView ? "active" : "initial"}
            whileHover="active"
          >
            <motion.div 
              className="w-40 sm:w-48 lg:w-44 xl:w-52 rounded-2xl overflow-hidden border border-slate-200/60 shadow-xl aspect-[4/5]"
              variants={imageVariants}
            >
              <img 
                src={assetUrl('brand/Philipp-Hoffschroer.jpg')} 
                alt="Philipp Hoffschröer – Founder, Skytz Consulting" 
                className="w-full h-full object-cover object-top" 
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            {/* Trust Verification Badge */}
            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-blueprint-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Founder Name - Below Image */}
            <div className="mt-4 text-center">
              <p className="text-sm font-bold text-slate-900">
                Philipp Hoffschröer
              </p>
              <p className="text-xs text-blueprint-600 font-semibold uppercase tracking-wide mt-1">
                Skytz Consulting
              </p>
            </div>
          </motion.div>
          
          <div className="min-w-0 flex-1 text-center lg:text-left order-1 lg:order-2">
            <span className="text-blueprint-600 font-bold tracking-[0.2em] text-[11px] uppercase mb-4 block">
              {t('hero.tagline')}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2rem] xl:text-[2.6rem] font-extrabold text-slate-900 mb-5 leading-[1.1] tracking-[-0.02em] text-balance hyphens-auto break-words">
              {t('hero.headline')}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-xl hyphens-auto">
              {t('hero.subhead')}
            </p>

            {/* Primary employer action, above the contact details and inside the
                first viewport on a 390px screen. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center justify-center lg:justify-start mb-6">
              <Link
                to={getLocalizedPath('meet-philipp')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blueprint-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blueprint-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint-700 sm:w-auto"
              >
                {t('hero.cta.primary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={getLocalizedPath('vacancies')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 sm:w-auto"
              >
                {t('hero.cta.secondary')}
              </Link>
            </div>
            
            {/* One way to reach a named person, no competing calls to action. */}
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 justify-center lg:justify-start">
              <a
                href="mailto:info@skytz-consulting.com"
                className="inline-flex items-center gap-2 font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors break-all sm:break-normal"
              >
                <Mail className="h-4 w-4" />
                info@skytz-consulting.com
              </a>
              <a
                href="tel:+13074290181"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +1 307 429 0181
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                {t('hero.reach.linkedinLabel')}
              </a>
            </div>
            </div>
          </motion.div>


        {/* TILE 2: CLIENT VOICES (4 cols) - a vouching logo beside the face */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-sm flex flex-col h-full"
          onMouseEnter={() => setIsHoverPaused(true)}
          onMouseLeave={() => setIsHoverPaused(false)}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5 text-blueprint-600">
              <ShieldCheck size={20} strokeWidth={2.5} />
              {/* Same key/timing as the quote block so badge, quote and attribution never desync mid-transition. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  {t(`testimonials.clients.${activeKey}.badge`, { defaultValue: t('testimonials.subtitle') })}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
                aria-pressed={isPaused}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={activeLogo.src}
                  alt={activeLogo.alt}
                  className={`${activeLogo.className || 'h-12'} mb-4 object-contain max-w-[220px]`}
                />

                <p className="text-slate-600 italic text-sm leading-relaxed mb-6 border-l-2 border-slate-200 pl-4">
                  "{t(`testimonials.clients.${activeKey}.quote`)}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-xs text-slate-500"
              >
                <strong className="text-slate-900 block font-bold">{t(`testimonials.clients.${activeKey}.contact`)}</strong>
                {t(`testimonials.clients.${activeKey}.role`)}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-1.5">
              {carouselKeys.map((key, idx) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSlideIdx(idx)}
                  aria-label={`Show ${t(`testimonials.clients.${key}.company`)}`}
                  className={`h-2 w-2 rounded-full transition-colors ${idx === activeSlideIdx ? 'bg-blueprint-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>


        {/* TILE 3: MEASURED RESULTS (12 cols) - US only; the German locale ships no figures */}
        {metricItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-12 rounded-[2rem] border border-slate-200/80 bg-white p-6 lg:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-blueprint-600 mb-6">
            <Gauge size={20} strokeWidth={2.5} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('metrics.title')}</h2>
          </div>

          <dl className={`grid gap-6 ${METRIC_GRID[metricItems.length] || METRIC_GRID.default}`}>
            {metricItems.map((item, idx) => (
              <div key={idx} className="min-w-0">
                <dt className="text-3xl lg:text-4xl font-black tracking-[-0.03em] text-slate-900">
                  {item.value}
                </dt>
                <dd className="mt-1 font-semibold text-slate-700 leading-snug">{item.label}</dd>
                <dd className="mt-2 text-sm text-slate-500 leading-relaxed">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 max-w-2xl">{t('metrics.germanNote')}</p>
            <Link
              to={getLocalizedPath('about')}
              className="shrink-0 text-sm font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors"
            >
              {t('metrics.methodLabel')} &rarr;
            </Link>
          </div>
        </motion.div>

        )}

        {/* TILE 4: LIVE SEARCHES (7 cols) - proof the cold email was not a mail merge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7 self-start bg-white rounded-[2rem] p-8 lg:p-10 border border-slate-200/80 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-blueprint-600 mb-6">
            <Search size={20} strokeWidth={2.5} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('searches.title')}
            </h2>
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
        </motion.div>


        {/* TILE 5: TRACK RECORD (5 cols) - checkable proof, not percentages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 bg-blueprint-600 rounded-[2rem] p-8 lg:p-10 text-white flex flex-col justify-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-blueprint-200" size={24} />
              <span className="text-blueprint-100 text-[11px] font-bold uppercase tracking-[0.2em]">
                {t('stats.placements.label')}
              </span>
            </div>
            <div className="text-6xl lg:text-7xl font-black mb-3 tracking-[-0.04em]">
              {t('stats.placements.value')}
            </div>
            <p className="text-blueprint-100 font-medium text-lg leading-snug max-w-xs">
              {t('stats.placements.subtext')}
            </p>

            {/* Checkable proof beats a percentage: the letters are downloadable. */}
            <div className="mt-8 pt-6 border-t border-white/20 flex items-baseline gap-3">
              <span className="text-3xl font-black tracking-[-0.03em]">
                {t('stats.letters.value')}
              </span>
              <span className="text-blueprint-100 font-medium">
                {t('stats.letters.label')}
              </span>
            </div>
            <p className="text-blueprint-200 text-sm mt-1">
              {t('stats.letters.subtext')}
            </p>
            <Link
              to={getLocalizedPath('testimonials')}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
            >
              {t('stats.letters.linkLabel')}
            </Link>

            <p className="mt-6 pt-6 border-t border-white/20 text-blueprint-100 font-medium">
              {t('stats.repeat')}
            </p>
          </div>
        </motion.div>


        {/* TILE 6: PROCESS (7 cols) - what actually happens after they email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7 bg-white rounded-[2rem] p-8 lg:p-10 border border-slate-200/80 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-blueprint-600 mb-6">
            <Route size={20} strokeWidth={2.5} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('process.title')}
            </h2>
          </div>

          <ol className="space-y-5">
            {(t('process.steps', { returnObjects: true }) || []).map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blueprint-50 text-sm font-bold text-blueprint-600">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
            {t('process.note')}
          </p>
        </motion.div>


        {/* TILE 7: DELIVERABLE (5 cols) - the concrete thing they receive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 self-start bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-white"
        >
          <div className="flex items-center gap-2.5 text-slate-300 mb-6">
            <ClipboardCheck size={20} strokeWidth={2.5} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('deliverable.title')}
            </h2>
          </div>

          <ul className="space-y-4">
            {(t('deliverable.items', { returnObjects: true }) || []).map((item, idx) => (
              <li key={idx} className="flex gap-3 leading-relaxed text-slate-100">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blueprint-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

      </div>
    </div>
    </>
  );
}