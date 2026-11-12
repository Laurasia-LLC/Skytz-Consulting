import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Skytz Consulting';
const SITE_URL = 'https://skytz-consulting.com';

// Kept in sync with App.jsx's SUPPORTED_LANGS / DEFAULT_LANG. Every route in
// this app exists at the same sub-path under both /en and /de (see App.jsx),
// so hreflang alternates can be derived generically by swapping the leading
// language segment of the current path rather than hardcoding per-page URLs.
const SUPPORTED_LANGS = ['en', 'de'];
const DEFAULT_LANG = 'en';

// Single source of truth for the OG/Twitter share image (1200x630).
const OG_IMAGE_PATH = 'brand/og-image.jpg';

export default function SEO({ 
  title, 
  description, 
  canonical,
  noindex = false,
  article = false,
  image
}) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language || 'en';
  
  const defaultTitle = lang === 'de'
    ? 'Skytz Consulting | Personalberatung für technischen Vertrieb und Engineering'
    : 'Skytz Consulting | Sales Engineer Recruiting for Industrial Manufacturers';

  const defaultDescription = lang === 'de'
    ? 'Persönliche Personalberatung für Hersteller, Ingenieurbüros und Bauunternehmen in Deutschland und der Schweiz. Direktansprache statt Anzeigen. Philipp Hoffschröer, seit 2015.'
    : 'Personal executive search for technical sales and engineering roles in Germany and Switzerland. Direct approach since 2015.';

  const pageTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageUrl = canonical || `${SITE_URL}${location.pathname}`;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const pageImage = image || `${SITE_URL}${baseUrl}${OG_IMAGE_PATH}`;

  // Hreflang alternates: swap the leading /:lang segment of the current
  // path for each supported language. Every route lives at the same
  // sub-path under both /en and /de (see App.jsx), so this is generic and
  // doesn't need a per-page URL map. Skipped for noindex pages (typo'd
  // paths, unsupported /:lang segments) since there's no real alternate to
  // point to and Google ignores hreflang on noindex pages anyway.
  const hreflangUrls = useMemo(() => {
    if (noindex) return null;
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pathRest = (SUPPORTED_LANGS.includes(pathSegments[0]) ? pathSegments.slice(1) : pathSegments).join('/');
    return {
      ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE_URL}/${l}${pathRest ? '/' + pathRest : ''}`])),
      'x-default': `${SITE_URL}/${DEFAULT_LANG}${pathRest ? '/' + pathRest : ''}`,
    };
  }, [location.pathname, noindex]);

  useEffect(() => {
    // Update document title
    document.title = pageTitle;
    
    // Update or create meta tags
    const updateMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Basic meta tags
    updateMeta('description', pageDescription);
    updateMeta('author', 'Philipp Hoffschröer, Skytz Consulting');
    updateMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Open Graph
    updateMeta('og:type', article ? 'article' : 'website', true);
    updateMeta('og:url', pageUrl, true);
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', pageImage, true);
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:locale', lang === 'de' ? 'de_DE' : 'en_US', true);
    
    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:url', pageUrl);
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', pageImage);
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);

    // Update hreflang alternates (en, de, x-default). Previously this
    // component never touched hreflang at all, so every inner page (e.g.
    // /de/about) inherited whatever static block was last in index.html
    // instead of pointing at its own /en/about counterpart.
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    if (hreflangUrls) {
      Object.entries(hreflangUrls).forEach(([hreflang, href]) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hreflang);
        link.setAttribute('href', href);
        document.head.appendChild(link);
      });
    }

    // Update html lang
    document.documentElement.lang = lang;

    // Cleanup function
    return () => {
      // Keep meta tags for SEO crawlers
    };
  }, [pageTitle, pageDescription, pageUrl, pageImage, lang, noindex, article, hreflangUrls]);

  return null; // This component doesn't render anything
}
