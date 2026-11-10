# Outside-in site test: skytz-consulting.com (2026-11-10)

**Tester:** Claude (headless Chromium via Playwright 1.56.1, scripted crawl)
**Persona:** an HR or operations lead at a US industrial or energy company who is deciding whether to hire a headhunter for an open position
**Scope:** every URL in `sitemap.xml` (16), plus the pages found by following internal links (`/en/imprint`, `/de/imprint`), the 9 linked PDFs, `robots.txt`, `llms.txt`, redirects, a 404 probe and the vacancies subdomain
**Evidence:** [crawl log (JSON)](2026-11-10-claude-outside-bot/crawl-log.json) · [screenshots folder](2026-11-10-claude-outside-bot/screenshots/), with a full-page desktop (1366 px) and mobile (iPhone 13) screenshot of every page

> **Important:** this report describes the **live** site as of today. The SEO fixes from the 2026-11-10 audit are made in the working tree but have **not been deployed**. These are the cookie consent gate, the merged JSON-LD without `priceRange`, FAQPage markup, and three new industry pages. Where one of them affects a finding, the finding says so.

---

## 0. Buyer verdict (persona view)

**Short version:** I run a US industrial or energy company. I would probably not book a call from this site. Nothing looks wrong. The site simply tells me it is for someone else.

### What makes me stay
- **The numbers are concrete and defined.** 5 business days to a shortlist, ~20 days to a signed offer, 92 % retention after 12 months, and a 90-day replacement guarantee. Each figure has a "how I measure this" section that says what is *not* counted. Few recruiters do this, and it reads as honest.
- **There are live searches with US territories:** Southeast, Upper Midwest, Mountain West, Northeast, Midwest, and the Texas Gulf Coast for process instrumentation. That last one is the only sign of my world, which is refining, petrochemical and midstream.
- **The screening questions show real domain knowledge.** For example: "Have they walked a unit during a turnaround? Do they know which EPC writes the spec?" That is the most convincing text on the site for an energy buyer.
- **There is one person and a clear process.** It takes a 45-minute intake call to get the fee in writing, and there is a Calendly link. The contact page is clean on mobile ([screenshot](2026-11-10-claude-outside-bot/screenshots/en_meet-philipp-mobile.jpg)).

### What makes me leave
1. **The H1 excludes me.** "I recruit sales engineers for **German manufacturers'** U.S. operations" ([home](2026-11-10-claude-outside-bot/screenshots/en-desktop.jpg)). A US-owned company reads this as "not for us". The About page repeats it: "Most of my clients are German manufacturers with U.S. operations."
2. **"Energy" appears 0 times on the English site.** Neither do "utility", "oil", "gas", "power grid" or "Houston" (from a word count over the rendered EN text). Refining and midstream appear only inside one industries card.
3. **There are no US client names.** The named references are Megger Germany, SebaKMT, Eurasia Group (Switzerland), SWR, Otopront, Box02 LLC (e-commerce) and GEF Ingenieur AG. The US metrics have no US logo or reference behind them.
4. **The timelines contradict each other.** The home stats say "~20 days to a signed offer". The "How a search runs" box on the same page says "US searches typically run **six to ten weeks** from the intake call to a signed offer". A buyer notices this and then trusts neither number.
5. **The vacancies are off-message.** All five open roles are construction jobs (Executive Assistant, Construction Supervision, CAD Draftsman, BIM Manager, Sifa safety expert), four of them in Germany ([screenshot](2026-11-10-claude-outside-bot/screenshots/en_vacancies-desktop.jpg)). The rest of the site says "sales engineers for industrial manufacturers".
6. **The fee is vague.** "A percentage of first-year total compensation" gives no range, and the site never says retained or contingency. US buyers compare on exactly those terms. (The FAQ says "paid once on a successful hire" and "usually exclusive", which reads as exclusive contingency, but I have to work that out myself.)
7. **Reachability is unclear.** The contact page says "Monday–Friday, 8:00 a.m. – 5:00 p.m. CET. That's 2:00 a.m. – 11:00 a.m. Eastern". The About page says "work U.S. hours through midday Eastern". For a Houston buyer (Central time), that means mornings only.
8. guess: the Sheridan, WY "registered office" (1309 Coffeen Ave) is a widely used registered-agent address. A US buyer who looks it up may read the company as having no real US presence. Saying plainly "based in Germany, US entity Laurasia LLC" (the About page already does) is the better framing.

### Would I book the call?
I would only book if my company were a US subsidiary of a German parent. For a US-owned energy or industrial company, the site first needs to say it serves me (fixes 3, 4 and 7 below).

---

## A. Search engines

### A.1 Site-level facts (from the log)

| Check | Result |
|---|---|
| `http://` and `www.` | 308 → `https://skytz-consulting.com/` ✅ |
| `/en/` (trailing slash) | 308 → `/en` ✅ |
| `/this-page-does-not-exist`, `/en/nonexistent-page` | **404** with `noindex, nofollow` and title "Page Not Found" ✅ |
| `/about` (no language prefix) | **200** returning the SPA shell, followed by a client-side redirect. Not a server redirect. |
| `vacancies.skytz-consulting.com` | 200 with `X-Robots-Tag: noindex, nofollow` ✅ |
| `sitemap.xml` | 16 URLs with lastmod and reciprocal hreflang. **`/en/imprint` and `/de/imprint` are missing**, although they are indexable and linked from every footer. |
| `robots.txt` | `User-agent: * / Allow: /`, sitemap declared, and `Crawl-delay: 1` (guess: Google ignores Crawl-delay) |
| Console errors | none on any page (desktop or mobile) |
| Mobile horizontal overflow | none on any page |
| Images without alt | **0** across all pages |
| Linked PDFs (9) | all 200 `application/pdf` |

### A.2 Per page

All 18 pages share these values:
- the canonical points at the page itself, in both the rendered DOM and the raw HTML
- the robots meta is `index, follow, max-image-preview:large…`
- there are 3 hreflang links (en, de, x-default)
- the JSON-LD is the same template-wide `Organization` + `EmploymentAgency` + `Service`, with no page-specific types
- **the raw HTML contains 0 words of body text and no `<h1>`**: all content is rendered by JavaScript

"Rendered title" is what Google shows after it runs JavaScript. "Raw title" is what the static HTML delivers.

| Page | Rendered title | Raw-HTML title | Desc. chars | H1 (rendered) | Int. page links | LCP desktop / mobile (ms) | CLS |
|---|---|---|---|---|---|---|---|
| /en | Sales Engineer Recruiter, Direct Search \| Skytz Consulting | same | 176 | I recruit sales engineers for German manufacturers' U.S. operations. | 8 | 752 / 684 | 0.0001 |
| /de | Personalberatung Vertriebsingenieure \| Skytz Consulting | same | 183 | Positionen im technischen Vertrieb und im Engineering. | 8 | 1088 / 468 | 0 |
| /en/industries | **Industries** \| Skytz Consulting | Automation, Drives & Instrumentation \| … | 183 | The industries I work in | 8 | 1512 / 1248 | 0 |
| /de/industries | **Branchen** \| … | Branchen: Messtechnik & Antriebstechnik \| … | 176 | Branchen, in denen ich arbeite | 8 | 1268 / 1256 | 0 |
| /en/testimonials | **References** \| … | Client References & Case Studies \| … | 163 | Reference Clients | 8 + 4 PDFs | 1468 / 2580 | 0 |
| /de/testimonials | **Referenzen** \| … | Kundenreferenzen & Erfolgsgeschichten \| … | 145 | Referenzkunden | 8 + 4 PDFs | 1620 / 1260 | 0 |
| /en/vacancies | Open Positions \| … | same | 80 | Open Positions | 8 + 5 PDFs | 1144 / 1276 | 0 |
| /de/vacancies | Offene Positionen \| … | same | 97 | Offene Positionen | 8 + 5 PDFs | 1548 / 1236 | 0 |
| /en/about | **About** \| … | Sales Engineer Recruiting Since 2015 \| … | 157 | About | 8 | 1428 / 1256 | 0 |
| /de/about | **Über mich** \| … | Über uns: Personalberatung seit 2015 \| … | 148 | Über mich | 8 | 1568 / 1340 | 0 |
| /en/meet-philipp | **Contact** \| … | Meet Philipp, Book a Call \| … | 156 | Contact | 8 | 1280 / 1264 | 0 |
| /de/meet-philipp | **Kontakt** \| … | Philipp treffen, Gespräch buchen \| … | 169 | Kontakt | 8 | 1552 / 1284 | 0 |
| /en/privacy | **Privacy** \| … | Privacy Policy \| … | 123 | Privacy Policy | 8 | 1080 / 1040 | 0 |
| /de/privacy | **Datenschutz** \| … | Datenschutzerklärung \| … | 128 | Datenschutzerklärung | 8 | 1424 / 1064 | 0 |
| /en/terms | **Terms** \| … | Terms & Conditions \| … | 113 | Terms & Conditions | 8 | 1324 / 1052 | 0 |
| /de/terms | **AGB** \| … | Allgemeine Geschäftsbedingungen \| … | 91 | Allgemeine Geschäftsbedingungen | 8 | 1320 / 1056 | 0 |
| /en/imprint (not in sitemap) | Legal Notice \| … | Imprint \| … | 132 | Legal Notice | 8 | 1344 / 1076 | 0 |
| /de/imprint (not in sitemap) | Impressum \| … | same | 136 | Impressum | 8 | 1384 / 1064 | 0 |

**Main finding in this table: the page titles get overwritten.** On 14 of 18 pages, the keyword titles from `pageSEOConfig` are replaced after hydration by generic nav labels ("About", "Contact", "References"). The cause is that each page component sets `document.title` in its own `useEffect`, and that effect runs *after* the `<SEO>` child's effect: [About.jsx:33](../src/pages/About.jsx#L33), [Contact.jsx:33](../src/pages/Contact.jsx#L33), [Industries.jsx:35](../src/pages/Industries.jsx#L35), [Testimonials.jsx:33](../src/pages/Testimonials.jsx#L33), [Vacancies.jsx:53](../src/pages/Vacancies.jsx#L53), [Privacy.jsx:22](../src/pages/Privacy.jsx#L22), [Terms.jsx:22](../src/pages/Terms.jsx#L22), [Imprint.jsx:22](../src/pages/Imprint.jsx#L22). Google indexes the rendered title, so the search titles shown are the weak ones.

**Heading order:**
- Home, About, Industries, Testimonials, Privacy, Terms and Contact run H1 → H2 (→ H3) in order.
- **Vacancies goes H1 → H3**, skipping H2.
- Every page ends with footer **H4**s ("Contact", "Legal"), which skip H3 on pages that have none. This is minor.
- The H1s "About", "Contact" and "Reference Clients" carry no keywords.

**Meta descriptions:** /en (176), /de (183), /en/industries (183) and /de/industries (176) are over ~160 characters. guess: Google truncates these in results. /de/terms (91) and /en/vacancies (80) are short.

**Vacancies:** 85 / 76 rendered words, and the role content sits only in PDFs. The pages are thin, indexable and off-topic for the positioning.

**Performance (lab, single run).** These are not field Core Web Vitals, and INP was not measured.
- Run from a machine in UTC+8, so TTFB includes trans-Pacific latency.
- LCP was 0.68–1.62 s on desktop and 0.47–1.34 s on mobile. The one outlier was /en/testimonials on mobile at 2.58 s, where TTFB was 1.33 s on that run only.
- CLS was ≤ 0.0001 everywhere.
- 15–24 requests per page.
- The first page transferred 677 KB with a cold cache. Later pages transferred 3–93 KB because the browser cache was shared.
- Verdict from the log: speed is not a problem.

### A.3 Searches a US industry or energy buyer would type

Your template's examples (e.g. "BD leads from job postings") were written for a recruiter tool. The searches below are the ones this persona would actually type. "Answered" means a live page clearly answers the search.

| Search | Answered? | Where / why not |
|---|---|---|
| executive search firm energy industry | **No** | "energy" appears 0 times on the EN site |
| oil and gas sales engineer recruiter | **No / weak** | refining, petrochemical and midstream are mentioned only in one card on /en/industries |
| recruiter for process instrumentation sales engineers | Partial | /en/industries card. The new `/en/industries/process-instrumentation` page (built, not deployed) answers it directly |
| control valve / flow measurement sales recruiter | Partial | the same card; the new page answers it once deployed |
| power utility / electrical test equipment sales recruiter | Partial | the test & measurement card mentions "electrical test equipment" and Megger, but never "utility" |
| sales engineer recruiter Houston / Texas | **No** | only "Texas Gulf Coast" in the running-searches list; no location page |
| how much does a headhunter charge for an engineer | Partial | the FAQ says "a percentage of first-year total compensation" but gives no number |
| retained vs contingency recruiter for engineers | **No** | neither word appears anywhere |
| recruiter replacement guarantee 90 days | **Yes** | /en/meet-philipp FAQ and /en/about |
| how long does it take to hire a sales engineer | Yes, but contradictory | /en/about and the FAQ say ~20 days; the home page process box says 6–10 weeks |
| recruiter for German company's US subsidiary | **Yes** | /en home and /en/about, which is the core positioning |
| motion control / drives sales recruiter | Partial | /en/industries card; the new `/en/industries/motion-control-drives` page (not deployed) |

---

## B. Answer engines (ChatGPT, Perplexity, Google AI Overviews)

### B.1 Can the FAQ answers be quoted on their own? (/en/meet-philipp, 11 items)

| Question | Quotable alone? | Note |
|---|---|---|
| How do you charge? | Partial | no number, so an engine has no fee fact to quote; "I" never names who |
| What happens if the hire does not work out? | **Yes** | self-contained. The "around 85 % of agency guarantees" claim has no source |
| Do you work exclusively? | Partial | "Usually" needs the question for context |
| Can you really recruit in the US from Germany? | Partial | starts with "Yes."; meaningless without the question |
| Will you understand our products? | Yes | |
| Who actually does the work? | **No** | "I do." Without the question and a name, this says nothing |
| How fast will I see candidates? | **Yes** | strongest answer: specific and self-contained |
| Where do you find people? | Yes | |
| Are you a staffing agency? | Partial | starts with "No."; the rest stands on its own |
| How do you judge whether a technical candidate is credible? | Yes | |
| How do we start? | Yes | |

**Cross-cutting issue:** every answer is in the first person ("I") and never names Philipp Hoffschröer or Skytz Consulting. A quoted snippet loses its attribution. The FAQ answers on the new industry pages (not deployed) name "Skytz Consulting" in each answer for this reason.

### B.2 Structured data

| Type | Live | In working tree (not deployed) |
|---|---|---|
| Organization | present, as a separate node from EmploymentAgency | merged into one `EmploymentAgency` node with `@id` |
| EmploymentAgency | present, with `priceRange: "$$$$"` and no Austria in its service area | `priceRange` removed; `areaServed` now matches across nodes |
| Service + OfferCatalog | present, 3 offers, `provider` as a separate unlinked Organization | 4 offers; `provider` points to the organization by `@id` |
| **FAQPage** | **missing** | added to the static HTML of `/en|de/meet-philipp` and all 6 new industry pages, built from the same locale strings the page shows |
| Product | not applicable (service business); none present | — |
| Person (founder) | only nested inside Organization | — |
| BreadcrumbList | missing | — |

### B.3 AI crawlers

- **robots.txt:** `User-agent: *` with `Allow: /`. There are no AI-specific rules, so GPTBot, ClaudeBot, PerplexityBot and Google-Extended are all allowed by default.
- **Same response for AI bots:** requests with GPTBot, PerplexityBot and ClaudeBot user agents got 200 and the same 9,445-byte HTML. Nothing is blocked at the edge.
- **`/llms.txt`: missing.** It returns 404 with the SPA HTML shell. `/llms-full.txt` is also 404.
- **The biggest AEO problem is that the raw HTML has 0 body words on every page.** The FAQ, the fee wording, the 90-day guarantee, the timelines and the industry text exist only after JavaScript runs. guess: GPTBot, ClaudeBot and PerplexityBot do not execute JavaScript (widely reported, but not tested here). If that is true, these engines see only the `<title>`, the meta description and the JSON-LD. The FAQPage JSON-LD added in the working tree partly fixes this for FAQ content.

### B.4 Are prices and plan facts in plain HTML?

The fee model ("percentage of first-year total compensation"), the guarantee (90 days, replacement only) and the timelines (5 business days, ~20 days) are plain text in the **rendered** DOM. They are not inside images. They are **not in the raw HTML response**, though, only in the JS bundle and locale JSON. No actual fee percentage is published anywhere.

---

## Fixes (max 10, ranked by impact)

Format: **page | what to change | why | effort**

1. **All pages | Prerender the page body (H1, main text, FAQ) into the static HTML at build time** (e.g. a Playwright or `react-dom/server` pass that extends `scripts/prerender-seo.mjs`, which already writes per-route HTML for the head tags) | raw HTML has 0 words and no H1 on all 18 pages (log). guess: AI crawlers that don't run JS see no content at all | **M**
2. **8 inner pages | Delete the per-page `document.title` effects** in About, Contact, Industries, Testimonials, Vacancies, Privacy, Terms and Imprint, so `<SEO>`'s title wins | the rendered titles are generic ("About \| Skytz Consulting") while the raw keyword titles are thrown away on 14 of 18 pages (log) | **S**
3. **/en (home) | Rewrite the H1 and subline so US-owned industrial and energy companies see themselves**, e.g. "Sales engineers for industrial and energy equipment makers in the US", and keep the German-parent angle as a second line | the current H1 limits the audience to "German manufacturers' U.S. operations"; this persona leaves at the H1 | **S** (copy decision)
4. **/en/industries + new process-instrumentation page | Use energy vocabulary in titles, H1s and intros**: oil & gas, refining, midstream, power & utilities | "energy", "oil", "gas" and "utility" each appear 0 times on the EN site (log), so none of the buyer searches in A.3 can match | **S**
5. **/en (home) | Fix the timeline contradiction**: "~20 days to a signed offer" (stats) vs "six to ten weeks from the intake call to a signed offer" (process box) | buyers notice the conflict, and answer engines may quote either number | **S**
6. **/en/meet-philipp FAQ | Publish a fee range and say "contingency" or "retained"; name Philipp Hoffschröer / Skytz Consulting in the answers to "Who does the work", "How do you charge" and "Can you recruit in the US"** | no quotable fee fact; "retained vs contingency" is unanswered (A.3); first-person answers lose attribution when quoted (B.1) | **S**
7. **/en/testimonials | Add at least one named US client, or a short US case study with an outcome** | every named reference is DACH or e-commerce, so the US metrics on the home page have no US proof behind them | **M** (needs client permission)
8. **/en/vacancies, /de/vacancies | Move the construction vacancies to the vacancies subdomain only (already noindexed) or set `noindex` on the main-domain page; otherwise label them clearly as a separate practice** | five construction roles contradict the sales-engineer positioning; the pages are thin (85 / 76 words) and indexable | **S**
9. **Site root | Add `/llms.txt`** (a one-paragraph summary, key facts such as fee model, guarantee, timelines and sectors, and links to the main pages); **remove `Crawl-delay`**; decide on explicit AI-crawler rules in `robots.txt` | llms.txt currently returns a 404 with the HTML shell (log) | **S**
10. **sitemap.xml / vercel.json | Add `/en/imprint` and `/de/imprint` to the sitemap (or noindex them), and make un-prefixed paths such as `/about` a server-side 301 in `vercel.json`** | the imprint pages are indexable and linked from every footer but missing from the sitemap; `/about` returns 200 with the SPA shell instead of a redirect (log) | **S**

### Already done in the working tree today (from the 2026-11-10 SEO audit, not yet deployed)

- **Google Tag Manager now loads only after consent.** A cookie banner offers Accept and Decline as equally prominent buttons, there is a "Cookie settings" link in the footer, and the privacy text is updated in EN and DE. The privacy text needs a legal check.
- **JSON-LD merged** into a single organization node. `priceRange: "$$$$"` is removed and `areaServed` is consistent.
- **FAQPage JSON-LD** is now in the static HTML of the contact pages and the new industry pages.
- **Three new industry pages** in EN and DE: process instrumentation, motion control & drives, and test & measurement. They are in the sitemap, the prerender list and the Service offers, and linked from /industries. The copy is built only from facts already on the site and needs owner review.

These were checked against a local `vite preview` build:
- no request to Google before consent or after Decline
- GTM loads after Accept
- an unknown industry slug returns the 404 page
- 3 detail links on /industries
- lint is clean and the build writes 24 prerendered routes

**Not doable from code:**
- confirming indexing in Google Search Console (needs your login)
- backlink outreach to the reference clients

---

## Screenshot index

| Page | Desktop | Mobile |
|---|---|---|
| /en | [en-desktop](2026-11-10-claude-outside-bot/screenshots/en-desktop.jpg) | [en-mobile](2026-11-10-claude-outside-bot/screenshots/en-mobile.jpg) |
| /de | [de-desktop](2026-11-10-claude-outside-bot/screenshots/de-desktop.jpg) | [de-mobile](2026-11-10-claude-outside-bot/screenshots/de-mobile.jpg) |
| /en/industries | [desktop](2026-11-10-claude-outside-bot/screenshots/en_industries-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_industries-mobile.jpg) |
| /de/industries | [desktop](2026-11-10-claude-outside-bot/screenshots/de_industries-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_industries-mobile.jpg) |
| /en/testimonials | [desktop](2026-11-10-claude-outside-bot/screenshots/en_testimonials-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_testimonials-mobile.jpg) |
| /de/testimonials | [desktop](2026-11-10-claude-outside-bot/screenshots/de_testimonials-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_testimonials-mobile.jpg) |
| /en/vacancies | [desktop](2026-11-10-claude-outside-bot/screenshots/en_vacancies-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_vacancies-mobile.jpg) |
| /de/vacancies | [desktop](2026-11-10-claude-outside-bot/screenshots/de_vacancies-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_vacancies-mobile.jpg) |
| /en/about | [desktop](2026-11-10-claude-outside-bot/screenshots/en_about-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_about-mobile.jpg) |
| /de/about | [desktop](2026-11-10-claude-outside-bot/screenshots/de_about-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_about-mobile.jpg) |
| /en/meet-philipp | [desktop](2026-11-10-claude-outside-bot/screenshots/en_meet-philipp-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_meet-philipp-mobile.jpg) |
| /de/meet-philipp | [desktop](2026-11-10-claude-outside-bot/screenshots/de_meet-philipp-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_meet-philipp-mobile.jpg) |
| /en/privacy | [desktop](2026-11-10-claude-outside-bot/screenshots/en_privacy-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_privacy-mobile.jpg) |
| /de/privacy | [desktop](2026-11-10-claude-outside-bot/screenshots/de_privacy-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_privacy-mobile.jpg) |
| /en/terms | [desktop](2026-11-10-claude-outside-bot/screenshots/en_terms-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_terms-mobile.jpg) |
| /de/terms | [desktop](2026-11-10-claude-outside-bot/screenshots/de_terms-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_terms-mobile.jpg) |
| /en/imprint | [desktop](2026-11-10-claude-outside-bot/screenshots/en_imprint-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/en_imprint-mobile.jpg) |
| /de/imprint | [desktop](2026-11-10-claude-outside-bot/screenshots/de_imprint-desktop.jpg) | [mobile](2026-11-10-claude-outside-bot/screenshots/de_imprint-mobile.jpg) |
| 404 probe | [desktop](2026-11-10-claude-outside-bot/screenshots/en_this-page-does-not-exist-desktop.jpg) | — |

## Method notes

- The crawl script and the local verification script live outside the repo, in the session scratchpad. They can be added under `scripts/` if you want this repeatable.
- Each page was scrolled top to bottom before the screenshot, so the scroll-triggered animations rendered. The screenshots are JPEG at quality 70. The mobile shots are at 3× pixel density, so the folder is about 23 MB.
- "Raw HTML" means a plain HTTP GET with no JavaScript, which is what a non-rendering crawler receives.
