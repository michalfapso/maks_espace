# HPM É-Space Website — Implementation Plan

## Context
Building a multilingual static marketing website for HPM company's "É-space" garden office products. The site targets customers and investors across Slovakia, Czech Republic, and English-speaking markets. Spec is in `docs/input.md`. Currently the workspace has only the spec and image assets — no Astro project exists yet.

---

## Project Structure

```
/workspace/
├── .github/workflows/deploy.yml
├── public/
│   └── robots.txt
├── src/
│   ├── assets/img/         # existing images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro        # desktop nav + hamburger trigger
│   │   │   ├── MobileMenu.astro    # slide-in panel for mobile
│   │   │   └── Footer.astro
│   │   ├── ui/
│   │   │   ├── HeroImage.astro         # full-width hero with srcset
│   │   │   ├── ProductSection.astro    # alternating image+text layout
│   │   │   ├── LightboxGallery.astro   # GLightbox wrapper
│   │   │   ├── HotspotImage.astro      # interactive image hotspots
│   │   │   ├── ContactForm.astro       # email form + WhatsApp link
│   │   │   ├── LanguageSelector.astro  # flag grid on homepage
│   │   │   └── Analytics.astro         # GA4 + Silktide scripts
│   │   └── seo/
│   │       └── SEOHead.astro           # meta, OG, hreflang, canonical
│   ├── i18n/
│   │   ├── index.ts    # t(), SUPPORTED_LANGS, LANG_META, getLangURL()
│   │   ├── sk.ts       # Slovak strings (source of truth)
│   │   ├── en.ts       # English
│   │   └── cs.ts       # Czech
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell: SEOHead, Analytics, Navbar, Footer
│   │   └── PageLayout.astro   # wraps BaseLayout, adds <main>
│   ├── pages/
│   │   ├── index.astro              # / — language selector
│   │   └── [lang]/
│   │       ├── index.astro          # products page
│   │       └── pre-investorov.astro # investor pitch-deck
│   └── styles/global.css            # Tailwind directives + GLightbox CSS
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## Page Routes (7 total)

| URL | Description |
|-----|-------------|
| `/` | Language selector |
| `/sk/`, `/en/`, `/cs/` | Products page (3 languages) |
| `/sk/pre-investorov/`, `/en/pre-investorov/`, `/cs/pre-investorov/` | Investor page (3 languages) |

---

## Key Packages

- `astro` — core framework
- `glightbox` — lightbox for image galleries
- `@astrojs/tailwind` + `tailwindcss` — styling
- `@astrojs/sitemap` — auto-generates sitemap.xml

No React/Vue/Svelte — all interactivity is vanilla JS in `<script>` tags.

---

## Key Design Decisions

### i18n
Pure TypeScript translation files, no external package. `sk.ts` is the source of truth typed `as const`. `en.ts` and `cs.ts` must conform to `typeof sk`. Helper `t(lang)` returns the correct translation set. Used in pages via `getStaticPaths()` + `Astro.params.lang`.

```ts
// src/i18n/index.ts
export type Lang = 'sk' | 'en' | 'cs';
export const SUPPORTED_LANGS: Lang[] = ['sk', 'en', 'cs'];
export function t(lang: Lang): TranslationSet { return translations[lang]; }
export const LANG_META = {
  sk: { label: 'Slovenčina', flag: '🇸🇰', ogLocale: 'sk_SK' },
  en: { label: 'English',    flag: '🇬🇧', ogLocale: 'en_GB' },
  cs: { label: 'Čeština',    flag: '🇨🇿', ogLocale: 'cs_CZ' },
};
```

### HotspotImage Component
Props: `image`, `alt`, `hotspots: Array<{id, x, y, label, price?, href?, description?}>`

- Points positioned with `left: x%; top: y%` — fully responsive (percentage-based)
- On hover: CSS pulsing ring animation + dot scale
- On click: `<img>` scales via `transform: scale(1.1) translate(dx%, dy%)` toward the point; popup appears near the point clamped inside image bounds
- Popup content: label + price + optional link, or description text
- Wrapper has `overflow: hidden`; only the `<img>` scales (not the wrapper)
- Test setup: `1_podorys.jpg` with 3–5 sample hotspots

### Analytics
Silktide loads unconditionally (it IS the consent mechanism). GA4 only initializes after the Silktide consent event fires with `analytics === true`. GA4 Measurement ID stored as `PUBLIC_GA_ID` env var (set in GitHub repo variables).

### Contact Form
Formspree.io (free tier: 50 submissions/month). AJAX POST via `fetch`, success/error message swap in-place. WhatsApp CTA button: `https://wa.me/{number}?text={prefilledText}`.

Form fields:
- Email (required)
- Name (required)
- Product interest dropdown (required): HPM Office Solo / Studio Duo / Nature Meeting Cube
- Note (optional)

### Images
Astro's `<Image>` / `<Picture>` auto-generate srcset via Sharp. **`material.heic` must be converted to JPG/WebP before use** (Sharp doesn't support HEIC).

### GitHub Pages Deployment
If deployed to a subdirectory URL (e.g. `orgname.github.io/repo-name/`), `astro.config.mjs` needs `base: '/repo-name/'`. All internal links must use `import.meta.env.BASE_URL`. Confirm actual GitHub Pages URL before Phase 1.

---

## Implementation Phases

### Phase 0 — Prerequisites (manual steps before coding)
- [ ] Convert `src/assets/img/material.heic` → `material.jpg`
- [ ] Confirm GitHub repo name and Pages URL → determines `astro.config.mjs` `base`
- [ ] Create [Formspree.io](https://formspree.io) account → get endpoint ID
- [ ] Confirm WhatsApp Business number for `wa.me` link
- [ ] Create GA4 property → get Measurement ID (`G-XXXXXXXXXX`)
- [ ] Create [Silktide](https://silktide.com/consent-manager) account → get CDN script URL

### Phase 1 — Project Scaffold
- [ ] `npm create astro@latest . -- --template minimal --typescript strict`
- [ ] `npx astro add tailwind` and `npx astro add sitemap`
- [ ] `npm install glightbox`
- [ ] Configure `astro.config.mjs` (site, base, output: static, integrations)
- [ ] Configure `tailwind.config.mjs` (brand colors: dark wood, off-white, accent amber)
- [ ] Create `src/styles/global.css` with Tailwind directives + GLightbox CSS import

### Phase 2 — i18n Foundation
- [ ] `src/i18n/sk.ts` — full Slovak strings (source of truth)
- [ ] `src/i18n/en.ts` and `src/i18n/cs.ts`
- [ ] `src/i18n/index.ts` — `t()`, `SUPPORTED_LANGS`, `LANG_META`, `getLangURL()`

### Phase 3 — Layout Shell
- [ ] `src/components/seo/SEOHead.astro` (title, description, OG, hreflang, canonical)
- [ ] `src/components/ui/Analytics.astro` (Silktide + deferred GA4)
- [ ] `src/layouts/BaseLayout.astro` (HTML shell)
- [ ] `src/components/layout/Navbar.astro` (desktop nav + hamburger button)
- [ ] `src/components/layout/MobileMenu.astro` (slide-in overlay)
- [ ] `src/components/layout/Footer.astro`
- [ ] `src/layouts/PageLayout.astro`
- [ ] `public/robots.txt`

### Phase 4 — Homepage (Language Selector)
- [ ] `src/components/ui/LanguageSelector.astro` (flag + label grid)
- [ ] `src/pages/index.astro`

### Phase 5 — Products Page
- [ ] `src/components/ui/HeroImage.astro`
- [ ] `src/components/ui/LightboxGallery.astro` (GLightbox wrapper)
- [ ] `src/components/ui/ProductSection.astro` (alternating layout, `reverse` prop)
- [ ] `src/pages/[lang]/index.astro` with `getStaticPaths()`

### Phase 6 — Hotspot Component
- [ ] `src/components/ui/HotspotImage.astro` (HTML + scoped CSS + vanilla JS)
- [ ] Demo in products page using `1_podorys.jpg` with sample hotspots
- [ ] Test edge cases: corner points, multiple instances, mobile touch

### Phase 7 — Contact Form
- [ ] `src/components/ui/ContactForm.astro`
- [ ] AJAX submit to Formspree + WhatsApp link
- [ ] Test end-to-end in Formspree test mode

### Phase 8 — Investor Page
- [ ] `src/pages/[lang]/pre-investorov.astro` with `getStaticPaths()`
- [ ] All 7 pitch-deck sections from spec

### Phase 9 — SEO Finalization
- [ ] Verify sitemap covers all 7 pages
- [ ] `hreflang` alternates in SEOHead for all language variants
- [ ] Final meta descriptions and OG images per page

### Phase 10 — Deployment
- [ ] `.github/workflows/deploy.yml`
- [ ] Enable GitHub Pages (Actions source) in repo settings
- [ ] Add `SITE_URL` and `PUBLIC_GA_ID` as repo variables
- [ ] Push to `main`, verify workflow and live site

### Phase 11 — QA
- [ ] Responsive: 375px / 768px / 1280px / 1920px
- [ ] Lighthouse: target 90+ (performance, accessibility, SEO, best practices)
- [ ] All 7 pages × 3 languages
- [ ] Hotspot component on touch devices
- [ ] GDPR: GA4 must NOT fire before Silktide consent
- [ ] Contact form end-to-end submission
- [ ] Cross-browser: Chrome, Firefox, Safari

---

## Verification Checklist
- `npm run dev` — all routes render without errors
- `npm run build` — clean build, check `dist/` output
- Lighthouse audit on deployed site
- GA4 DebugView — no events before consent, correct events after
- Silktide banner appears on first visit
- Formspree test submission received in dashboard
