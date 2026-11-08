import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import useLanguage from '../../hooks/useLanguage';

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { getLocalizedPath } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}brand/Logo-Skytz-Consulting.png`;

  // The logo already returns home, so "Home" is dropped to buy back header space.
  const navLinks = [
    { to: 'industries', label: t('nav.industries') },
    { to: 'testimonials', label: t('nav.testimonials') },
    { to: 'about', label: t('nav.about') },
    { to: 'meet-philipp', label: t('nav.contact') },
  ];

  const isActive = (path) => {
    const localizedPath = getLocalizedPath(path);
    return location.pathname === localizedPath || location.pathname === localizedPath + '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={getLocalizedPath('')} className="flex items-center gap-3 group">
          <img
            src={logoSrc}
            alt="Skytz Consulting"
            className="h-[44px] sm:h-[52px] lg:h-[60px] w-auto object-contain"
            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))' }}
            draggable="false"
            /* Above-the-fold and almost certainly the LCP element on every
               page, so it stays eager (lazy-loading it would delay LCP
               further, not help) — the real fix for the 2MB source file is
               replacing/compressing the asset itself; see audit notes.
               decoding="async" (was "sync") stops the decode from blocking
               the main thread while that file is still this large.
               width/height give the browser the real intrinsic aspect
               ratio so it can reserve layout space before the (currently
               2MB, slow-to-arrive) image loads, reducing layout shift. */
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="hidden xl:flex items-baseline leading-none">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Skytz</span>
            <span className="ml-1.5 text-2xl font-medium text-blueprint-600">Consulting</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={getLocalizedPath(link.to)}
              className={`text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-blueprint-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link
            to={getLocalizedPath('meet-philipp')}
            className="hidden sm:inline-flex items-center px-4 py-2.5 bg-blueprint-600 hover:bg-blueprint-700 text-white text-sm font-semibold rounded-lg transition-colors text-center leading-tight"
          >
            {t('hero.cta.primary')}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={getLocalizedPath(link.to)}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive(link.to) ? 'text-blueprint-600' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={getLocalizedPath('meet-philipp')}
                onClick={() => setMobileOpen(false)}
                className="block w-full mt-4 px-5 py-3 bg-blueprint-600 text-white text-sm font-semibold rounded-lg text-center"
              >
                {t('hero.cta.primary')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
