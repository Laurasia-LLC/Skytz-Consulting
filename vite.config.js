import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Public Cookiebot domain-group id for skytz-consulting.com. Not a secret.
// VITE_COOKIEBOT_CBID overrides it. A non-empty invalid value still strips
// Cookiebot and GTM. Blank or unset keeps this default, so Vercel needs no env.
const DEFAULT_COOKIEBOT_CBID = '1fc5469b-67b4-4029-9179-643181c01a87';
const COOKIEBOT_CBID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function cookiebotCbid(env) {
  const value = String(env.VITE_COOKIEBOT_CBID ?? '').trim();
  if (!value) return DEFAULT_COOKIEBOT_CBID;
  return COOKIEBOT_CBID_RE.test(value) ? value : '';
}

function stripMarked(html, start, end) {
  const pattern = new RegExp(`[ \\t]*${start}[\\s\\S]*?${end}\\r?\\n?`, 'g');
  return html.replace(pattern, '');
}

// %VITE_COOKIEBOT_CBID% in index.html is the Vite HTML env slot. This gate
// fills it with the resolved UUID. An invalid override drops Cookiebot,
// the consent default and GTM.
function cookiebotGtmGate(cbid) {
  return {
    name: 'cookiebot-gtm-gate',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!cbid) {
          html = stripMarked(html, '<!-- cookiebot:start -->', '<!-- cookiebot:end -->');
          html = stripMarked(html, '<!-- Google Tag Manager -->', '<!-- End Google Tag Manager -->');
          html = stripMarked(html, '<!-- Google Tag Manager \\(noscript\\) -->', '<!-- End Google Tag Manager \\(noscript\\) -->');
          return html;
        }
        return html.replaceAll('%VITE_COOKIEBOT_CBID%', cbid);
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Set VITE_BASE to e.g. '/Skytz-Consulting/' for GitHub Pages.
  const base = env.VITE_BASE || '/';
  const cbid = cookiebotCbid(env);

  return {
  base,
  define: {
    'import.meta.env.VITE_COOKIEBOT_CBID': JSON.stringify(cbid),
  },
  plugins: [cookiebotGtmGate(cbid), react()],
  build: {
    // Optimize image assets
    assetsInlineLimit: 4096, // Inline images smaller than 4KB
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg|webp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          } else {
            return `assets/[name]-[hash][extname]`
          }
        },
      },
    },
  },
  };
})
