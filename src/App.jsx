import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieConsent from './components/CookieConsent';

const Home = lazy(() => import('./pages/Home'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Imprint = lazy(() => import('./pages/Imprint'));
const Vacancies = lazy(() => import('./pages/Vacancies'));
const Industries = lazy(() => import('./pages/Industries'));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-blueprint-600 text-lg font-medium">Loading...</div>
    </div>
  );
}

// Layout wrapper for language-prefixed routes
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

const SUPPORTED_LANGS = ['en', 'de'];
const DEFAULT_LANG = 'en';

// Guards every "/:lang" and "/:lang/*" route. Anything outside
// SUPPORTED_LANGS (typos, garbage paths, scanner probes like "/xx") renders
// a noindexed 404 instead of silently matching Home/etc. at that URL.
// Note: this only takes effect once React hydrates and this component runs
// client-side — the initial HTTP response is still a 200 with the SPA shell
// (Vercel's catch-all rewrite in vercel.json serves index.html for every
// path at the network level). Non-JS crawlers/tools that don't execute JS
// will still see a 200 with no distinguishing signal; this fixes the
// rendered/indexable content and robots meta for everything that does run JS.
function LangGate({ children }) {
  const { lang } = useParams();
  if (!SUPPORTED_LANGS.includes(lang)) {
    return <Layout><NotFound /></Layout>;
  }
  return children;
}

const VACANCIES_HOST_PREFIX = 'vacancies.';

function isVacanciesHost() {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.startsWith(VACANCIES_HOST_PREFIX);
}

// Vacancies render on both hosts. The main site keeps them indexable and in the
// sitemap — job listings are a primary entry point from search. The vacancies
// subdomain serves the same content for candidate-facing links but is held out
// of search indexes by the X-Robots-Tag rule in vercel.json, so the two copies
// never compete. Do not gate this on the host again without also restoring the
// sitemap entries and the prerender route.
function VacanciesRoute() {
  return <Layout><Vacancies /></Layout>;
}

function normalizeLang(lang) {
  if (!lang) return null;
  const code = String(lang).toLowerCase().split('-')[0];
  return SUPPORTED_LANGS.includes(code) ? code : null;
}

function DetectedRedirect({ suffix = '' }) {
  const { i18n } = useTranslation();
  const detected = normalizeLang(i18n.resolvedLanguage || i18n.language) || DEFAULT_LANG;
  const effectiveSuffix = suffix || (isVacanciesHost() ? 'vacancies' : '');
  const path = effectiveSuffix ? `/${detected}/${effectiveSuffix}` : `/${detected}`;
  return <Navigate to={path} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Language-prefixed routes. LangGate rejects any :lang value
              outside SUPPORTED_LANGS (e.g. "/xx") with a noindexed 404
              instead of matching the page below. */}
          <Route path="/:lang" element={<LangGate><Layout><Home /></Layout></LangGate>} />
          <Route path="/:lang/testimonials" element={<LangGate><Layout><Testimonials /></Layout></LangGate>} />
          <Route path="/:lang/about" element={<LangGate><Layout><About /></Layout></LangGate>} />
          <Route path="/:lang/industries" element={<LangGate><Layout><Industries /></Layout></LangGate>} />
          <Route path="/:lang/industries/:slug" element={<LangGate><Layout><IndustryDetail /></Layout></LangGate>} />
          <Route path="/:lang/meet-philipp" element={<LangGate><Layout><Contact /></Layout></LangGate>} />
          <Route path="/:lang/vacancies" element={<LangGate><VacanciesRoute /></LangGate>} />
          <Route path="/:lang/privacy" element={<LangGate><Layout><Privacy /></Layout></LangGate>} />
          <Route path="/:lang/terms" element={<LangGate><Layout><Terms /></Layout></LangGate>} />
          <Route path="/:lang/imprint" element={<LangGate><Layout><Imprint /></Layout></LangGate>} />

          {/* Direct access routes (without language prefix) - redirect to default language */}
          <Route path="/meet-philipp" element={<DetectedRedirect suffix="meet-philipp" />} />
          <Route path="/testimonials" element={<DetectedRedirect suffix="testimonials" />} />
          <Route path="/about" element={<DetectedRedirect suffix="about" />} />
          <Route path="/industries" element={<DetectedRedirect suffix="industries" />} />
          <Route path="/vacancies" element={<DetectedRedirect suffix="vacancies" />} />
          <Route path="/imprint" element={<DetectedRedirect suffix="imprint" />} />
          <Route path="/impressum" element={<DetectedRedirect suffix="imprint" />} />
          <Route path="/privacy" element={<DetectedRedirect suffix="privacy" />} />
          <Route path="/terms" element={<DetectedRedirect suffix="terms" />} />

          {/* Redirect root to default language */}
          <Route path="/" element={<DetectedRedirect />} />

          {/* True catch-all: any other path (unknown sub-path within a
              language, e.g. "/de/abuot", or any other unmatched URL) is a
              real 404, not a silent redirect to the homepage. */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </Suspense>
  );
}
