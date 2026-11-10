import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { pageSEOConfig } from '../content/pageSEOConfig';
import useLanguage from '../hooks/useLanguage';

// One page per sector at /:lang/industries/:slug. Copy lives in
// locales/*.json under industries.detail[slug]; the roles/tech/channel/screen
// facts are reused from the matching industries.sectors[] card so the two
// pages never drift apart. Unknown slugs render the noindexed 404.
export default function IndustryDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { getLocalizedPath } = useLanguage();
  const lang = i18n.language || 'en';

  const detail = t(`industries.detail.${slug}`, { returnObjects: true });
  if (!detail || typeof detail !== 'object') return <NotFound />;

  const sector = (t('industries.sectors', { returnObjects: true }) || [])[detail.sector] || {};
  const labels = t('industries.labels', { returnObjects: true }) || {};
  const shared = t('industries.detailShared', { returnObjects: true }) || {};
  const seo = pageSEOConfig[`industry-${slug}`]?.[lang] || pageSEOConfig[`industry-${slug}`]?.en;

  return (
    <>
      {seo && <SEO title={seo.title} description={seo.description} />}

      <div className="min-h-screen bg-slate-50">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              to={getLocalizedPath('industries')}
              className="inline-flex items-center gap-2 text-sm font-medium text-blueprint-600 hover:text-blueprint-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {shared.back}
            </Link>
            <h1 className="mt-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">{detail.title}</h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">{detail.intro}</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-6 space-y-10">
            <BentoCard>
              <h2 className="text-lg font-bold text-slate-900">{sector.name}</h2>
              <dl className="mt-6 space-y-4 text-sm">
                {['roles', 'tech', 'channel'].map((key) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{labels[key]}</dt>
                    <dd className="mt-1 text-slate-600 leading-relaxed">{sector[key]}</dd>
                  </div>
                ))}
              </dl>
            </BentoCard>

            {(detail.sections || []).map((s) => (
              <div key={s.h}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{s.h}</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">{s.p}</p>
              </div>
            ))}

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{labels.screen}</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">{sector.screen}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{shared.searchTitle}</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">{shared.searchText}</p>
            </div>

            {detail.faq?.length > 0 && (
              <BentoCard>
                <h2 className="text-xl font-bold text-slate-900">{shared.faqTitle}</h2>
                <dl className="mt-6 divide-y divide-slate-100">
                  {detail.faq.map((item) => (
                    <div key={item.q} className="py-5 first:pt-0 last:pb-0">
                      <dt className="font-semibold text-slate-900">{item.q}</dt>
                      <dd className="mt-2 text-slate-600 leading-relaxed">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </BentoCard>
            )}

            <Link
              to={getLocalizedPath('meet-philipp')}
              className="inline-flex items-center gap-2 font-semibold text-blueprint-600 hover:text-blueprint-700 transition-colors"
            >
              {t('hero.cta.primary')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
