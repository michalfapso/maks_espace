---
name: HPM É-Space Website Design Spec
description: Multilingual static marketing website for garden office products targeting Slovakia, Czech Republic, and English markets
type: specification
date: 2026-04-08
---

# HPM É-Space Website — Design Specification

## 1. Project Overview

Building a multilingual static marketing website for HPM company's "É-space" garden office products. The site targets two audiences:
- **Customers**: Freelancers, small teams, and homeowners interested in purchasing prefab garden offices
- **Investors**: Potential investors and business partners interested in the business opportunity

The site is deployed as a static site to GitHub Pages with automatic CI/CD via GitHub Actions.

---

## 2. Products & Naming

Three product lines in the "Hay Office" and "Nature" series:

| Product | Size | Price Range* | Target Audience |
|---------|------|-------------|-----------------|
| **Hay Office Solo** | 6–10 m² | 8–12k € | Freelancers, small businesses, homeowners |
| **Hay Studio Duo** | 12–16 m² | 16–24k € | Pairs, creative professionals, consultants |
| **Nature Meeting Cube** | 20–24 m² | 24–40k € | Premium clients, small offices, micro-coworking |

*Pricing may vary by country/language version. The translation system supports language-specific pricing (e.g., different prices for `/sk/` vs. `/en/` vs. `/cs/`).

**Note:** Product names may evolve; these are the working names for this phase.

---

## 3. Site Structure & Pages

### 3.1 Routes (7 total)

| Route | Purpose | Languages |
|-------|---------|-----------|
| `/` | Language selector landing | (root only) |
| `/sk/`, `/en/`, `/cs/` | Products showcase | 3 languages |
| `/sk/pre-investorov/`, `/en/for-investors/`, `/cs/pro-investory/` | Investor pitch deck | 3 languages (translated URLs) |

**Language metadata:**
- Slovak: `/sk/` (label: Slovenčina, flag: 🇸🇰)
- English: `/en/` (label: English, flag: 🇬🇧)
- Czech: `/cs/` (label: Čeština, flag: 🇨🇿)

### 3.2 Homepage (`/`)
- Header with logo image and title "É-space Garden Houses"
- Clean flag grid layout: three large clickable cards (one per language)
- Each card shows country flag icon + language label
- Clicking navigates to the product page in that language (e.g., click Czech → `/cs/`)

### 3.3 Products Page (`/[lang]/`)

**Structure:**
1. **Hero image** — full-width image at top
2. **Three product sections** — alternating image-left/text-right and image-right/text-left layouts
3. **Each product section includes:**
   - Product name and price range
   - Description (max 3 bullet points)
   - Product gallery (single image or gallery with thumbnails; see section 5.2)
   - May include interactive hotspots on images
4. **Interior Inspiration section** — showcase gallery of interior setups (IKEA furniture combinations, styling ideas)
5. **Materials section** — brief note on eco-friendly materials (placeholder text initially)
6. **Contact form** — bottom of page

**Galleries within products:**
- Some product images may have multiple photos (e.g., gallery of 2–4 variants)
- Galleries open in a lightbox (GLightbox) with arrow navigation
- Hotspots (if present on an image) remain interactive **within the lightbox view**

### 3.4 Investor Page

Three separate static files, one per language, each with a different URL slug:
- `/sk/pre-investorov/` → `src/pages/sk/pre-investorov.astro`
- `/en/for-investors/` → `src/pages/en/for-investors.astro`
- `/cs/pro-investory/` → `src/pages/cs/pro-investory.astro`

Each file imports from the same shared component/layout and passes the appropriate `lang` prop. The `hreflang` alternates in SEOHead explicitly list all three translated URLs so search engines understand they are equivalent pages.

**All 8 pitch-deck sections:**
1. Vision (Paragraph + quote)
2. Problem (3–4 bullet points)
3. Solution (Overview + key specs)
4. Product Roadmap (3 products with specs)
5. Market & Timing (market size, growth drivers)
6. Business Model (B2C, B2B revenue streams)
7. Why HPM (experience, partnerships, market knowledge)
8. Ask (What we're looking for)

**Layout:** Clean, professional. Simple typography with accent colors. Each section is distinct but cohesive.

**Contact form at bottom** — same form as products page

---

## 4. Technology Stack

- **Framework:** Astro.js (static site generation)
- **Styling:** Tailwind CSS (custom brand colors)
- **Lightbox:** GLightbox (lightweight, vanilla JS)
- **Image optimization:** Astro's built-in `<Image>` and `<Picture>` components (auto-srcset via Sharp)
- **i18n:** Custom TypeScript-based translation system (no external package)
- **Form submission:** Formspree.io (50 submissions/month free tier, spam protection)
- **Analytics:** Google Analytics 4 (GA4) — behind Silktide consent banner
- **Consent/GDPR:** Silktide Consent Manager
- **SEO:** Sitemap.xml (auto-generated), robots.txt, meta tags, Open Graph, hreflang alternates
- **Deployment:** GitHub Pages with GitHub Actions CI/CD

---

## 5. Key Components

### 5.1 HotspotImage Component

**Purpose:** Display an image with clickable interactive hotspots. Each hotspot shows context-specific information.

**Props:**
- `image` — path to image asset
- `alt` — alt text
- `hotspots` — array of hotspot objects:
  ```
  {
    id: string,
    x: number (0–100, percentage),
    y: number (0–100, percentage),
    label: string (merged label + description + price info in one field)
  }
  ```

**Behavior:**
- Hotspot dots positioned absolutely using percentages (fully responsive)
- **Hover:** CSS pulsing ring animation + dot scales up slightly
- **Click:** 
  - Image scales to 1.1x and translates to center the clicked hotspot
  - Popup appears adjacent to hotspot (preferably above to avoid covering with finger on touch devices)
  - If not enough space above, popup intelligently repositions to left/right/bottom within image bounds
  - Popup background: semi-transparent with rounded corners
  - Popup closes when clicking outside or pressing Escape
- **Accessibility:** Keyboard navigation (Tab to hotspots, Enter/Space to activate)

**Popup Content Rendering:**
- If `label` contains a price marker (e.g., "Chair IDÅSEN, 199€"), render as styled product card
- Otherwise, render as plain text description

**Lightbox Integration:**
- Hotspots remain fully functional when image is opened in lightbox
- Lightbox overlays the hotspots, allowing interaction within the enlarged view

### 5.2 Gallery Component (with Thumbnail Strip)

**Purpose:** Display product and inspiration images with optional thumbnail navigation. Auto-discovers all images in a given folder and wraps `HotspotImage` for any image that has an accompanying `.json` file.

**Props:**
- `folder` — path to gallery folder (e.g., `src/assets/galleries/1/`)

**Image discovery (build-time):**
- At build time, reads all image files in `folder`, sorted alphabetically by filename
- For each image `IMG.jpg`, checks for a sibling `IMG.json`
  - If `IMG.json` exists → renders that image as a `HotspotImage` with hotspots defined in the JSON
  - If no JSON → renders as a plain `<Image>`
- JSON hotspot format:
  ```json
  [
    { "id": "desk", "x": 42.5, "y": 30.0, "label": "Stôl IDÅSEN, 199€", "href": "https://..." },
    { "id": "wall", "x": 15.0, "y": 60.0, "label": "Konopno-slamenný panel" }
  ]
  ```
  - `href` is optional; if present, the popup renders as a linked product card; otherwise as a text description

**Single image (folder contains 1 image):**
- Image (or HotspotImage) displays at full width
- Clicking the image opens it in GLightbox

**Multiple images (folder contains 2+ images):**
- First image displays at full width as the main image
- Below: horizontal scrollable thumbnail strip showing all images
  - Thumbnail height: 80–100px, rounded corners, gap between items
  - Active thumbnail is visually highlighted
- Clicking a thumbnail swaps it into the main image area (smooth swap, no page reload)
- Clicking the main image opens the full gallery in GLightbox starting from the current image
- When a hotspot image is in the main area, its hotspots are interactive; when it's a thumbnail, no hotspots shown

**Lightbox behavior:**
- GLightbox displays full-size images with left/right arrow navigation
- Hotspots remain interactive in lightbox view
- User can navigate between all images in the gallery from within the lightbox

### 5.3 ContactForm Component

**Fields:**
- Email (required)
- Name (required)
- Product interest dropdown (required): "Hay Office Solo" / "Hay Studio Duo" / "Nature Meeting Cube" / "Other" (for undecided customers)
- Note (optional, max 500 chars)

**Submission:**
- AJAX POST to Formspree endpoint
- On success: replace form with "Thank you" message + WhatsApp link
- On error: show error message, allow retry
- WhatsApp fallback link dynamically updates as user fills the form: the `href` is re-built on every `input`/`change` event, incorporating the current values (name, selected product). Base URL: `https://wa.me/+421XXXXXXXXX` (number TBD); text template: e.g., "Dobrý deň, volám sa [Name] a mám záujem o [Product]."

**Styling:** Clean, minimal. Matches page design.

### 5.4 Navbar & MobileMenu

**Desktop:** Horizontal navigation bar with logo (left) + menu links (right)
- Logo links to `/`
- Menu: "Produkty" / "Products" / "Produkty" (language-specific), "Pre Investorov" / "For Investors" / "Pro Investory" (language-specific)
- Language selector (3 flags) in top-right corner — clicking a flag navigates to the **equivalent page** in that language (e.g., on `/en/for-investors/`, clicking 🇸🇰 goes to `/sk/pre-investorov/`)

**Mobile (< 768px):** Hamburger menu
- Logo + hamburger button in toolbar
- Slide-in overlay menu with same links
- Language selector inside overlay menu

### 5.5 SEOHead Component

**On all pages:**
- `<title>` tag
- Meta description (60–160 chars)
- Meta keywords
- Open Graph tags: og:title, og:description, og:image, og:url, og:locale
- Canonical tag (pointing to self)
- hreflang alternates (link to all language variants of same page)

**Special handling for investor page:** Different OG image and description than products page

---

## 6. Internationalization (i18n)

### 6.1 Approach

Pure TypeScript translation system—no external i18n library:

```
src/i18n/
├── sk.ts       # Slovak (source of truth, typed as const)
├── en.ts       # English (must match Slovak structure)
├── cs.ts       # Czech (must match Slovak structure)
└── index.ts    # Helper exports: t(lang), SUPPORTED_LANGS, LANG_META
```

**Translation keys structure** (TypeScript object):
```ts
export const sk = {
  nav: {
    products: "Produkty",
    investors: "Pre Investorov",
  },
  products: {
    title: "Produktové portfólio HPM É-SPACE",
    solo: { name: "Hay Office Solo", price: "8–12 tis. €", ... },
    // ... all product text
  },
  investor: {
    title: "PITCH-DECK pre investorov",
    // ... all investor page text
  },
  // ... all other strings
} as const;
```

**Helper functions in `src/i18n/index.ts`:**
- `t(lang: Lang): TranslationSet` — returns the full translation object for a language
- `getLangURL(path: string, lang: Lang): string` — constructs language-specific URLs
- `SUPPORTED_LANGS: Lang[]` — `['sk', 'en', 'cs']`
- `LANG_META` — metadata per language (flag emoji, label, OG locale)

### 6.2 Page Routes with i18n

Use Astro's `getStaticPaths()` to generate all language variants at build time:

```ts
// src/pages/[lang]/index.astro
export async function getStaticPaths() {
  return SUPPORTED_LANGS.map(lang => ({
    params: { lang },
    props: { lang },
  }));
}
```

Each page receives `lang` prop and uses `t(lang)` to access translations.

---

## 7. Images & Assets

### 7.1 Image Files

**Existing:**
- `src/assets/img/logo.jpg` — company logo (used in Navbar and homepage)
- `src/assets/img/hero.jpg` — hero image for products page

**To be moved into gallery folders:**
- `src/assets/img/1_podorys.jpg` → `src/assets/galleries/1/1_podorys.jpg`
- `src/assets/img/2_podorys.jpg` → `src/assets/galleries/2/2_podorys.jpg`
- `src/assets/img/3_podorys.jpg` → `src/assets/galleries/3/3_podorys.jpg`
- `src/assets/img/material.jpg` → `src/assets/galleries/materials/material.jpg`

**Image optimization:**
- All images use Astro's `<Image>` or `<Picture>` components
- Sharp auto-generates responsive srcsets (WebP + fallback)
- Sizes optimized for desktop (1280px), tablet (768px), mobile (375px) viewports

### 7.2 Gallery Folder Structure

```
src/assets/galleries/
├── 1/                    # Hay Office Solo images
├── 2/                    # Hay Studio Duo images
├── 3/                    # Nature Meeting Cube images
├── interior/             # Interior inspiration / IKEA setups
└── materials/            # Materials showcase images
```

Each folder contains:
- Primary image(s) for that gallery
- Optional additional images for gallery thumbnail strip
- Images can include hotspots (responsive, percentage-based coordinates)

### 7.3 Hotspot Images

- Not all images will have hotspots
- Hotspots use percentage-based coordinates (responsive)
- Hotspots remain interactive in gallery view and in lightbox
- When clicking a hotspot in multi-image gallery, popup appears with hotspot info

---

## 8. Analytics & Consent

### 8.1 Silktide Consent Manager

- Silktide script loads unconditionally on all pages
- Displays a GDPR-compliant cookie banner on first visit
- User can customize consent (analytics, marketing, etc.)

### 8.2 Google Analytics 4 (GA4)

- GA4 script **does NOT load automatically**
- GA4 only initializes after user accepts "analytics" consent in Silktide
- GA4 Measurement ID stored as environment variable `PUBLIC_GA_ID`
- Track: page views, product clicks, form submissions, language selection

---

## 9. Contact Form & CTA

### 9.1 Form Endpoint

- Service: Formspree.io (free tier: 50 submissions/month)
- Form setup: create account, generate endpoint ID
- AJAX submission with fetch API
- Success/error messages swap in-place

### 9.2 WhatsApp CTA

- Standalone button below contact form: "Alebo napíš mi na WhatsApp" (language-translated)
- Links to `https://wa.me/+421XXXXXXXXX?text=...` (number TBD)
- Pre-filled message includes user interest (e.g., product name)

---

## 10. SEO

### 10.1 Technical SEO

- **sitemap.xml** — auto-generated by `@astrojs/sitemap`, includes all 7 pages
- **robots.txt** — public; allows all crawlers
- **Canonical tags** — on every page (pointing to self)
- **hreflang alternates** — each page links to its language variants

### 10.2 On-Page SEO

- Unique `<title>` and meta description per page
- Meta keywords (3–5 per page)
- Open Graph tags for social preview
- Structured data (schema.org markup) if needed for rich snippets

---

## 11. Responsive Design

**Breakpoints:**
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px, 1920px

**Testing points:**
- Hamburger menu collapses at < 768px
- HotspotImage hotspots scale correctly at all sizes
- Images scale with viewport
- Text remains readable at all sizes
- Contact form stacks vertically on mobile

---

## 12. Performance & Build

### 12.1 Build Process

```bash
npm run build       # Static site generation → dist/
npm run dev         # Local dev server
npm run preview     # Preview production build
```

### 12.2 GitHub Pages Deployment

- Static output to `dist/`
- GitHub Actions workflow triggers on push to `main`
- Sets `SITE_URL` and `PUBLIC_GA_ID` environment variables
- Deploys to GitHub Pages (Actions source in repo settings)

**Custom Domain:** The site uses a custom domain (not the default `orgname.github.io`). Configure custom domain in GitHub Pages settings and add `CNAME` file to `public/` directory.

**Base URL:** Since using a custom domain (not a subdirectory), `base: '/'` in `astro.config.mjs`.

### 12.3 Performance Targets

- Lighthouse score: 90+ (performance, accessibility, SEO, best practices)
- Lightbox images lazy-load
- CSS/JS minified in production
- No third-party scripts block initial render (GA4 deferred, Silktide async)

---

## 13. Materials Section (Placeholder)

The "Použité materiály" section currently displays placeholder text:

> "Konopné panely, slama a ďalšie ekologické materiály — podrobný popis bude doplnený neskôr."

This will be replaced with final material descriptions once finalized by the product team.

---

## 14. Design Language & Brand

**Color Palette:**
- Primary: Dark wood brown (e.g., `#3a2f29`)
- Secondary: Off-white / cream (e.g., `#f5f1ed`)
- Accent: Warm amber (e.g., `#c19a6b`)
- Text: Dark gray (e.g., `#333`)

**Typography:**
- Headlines: Clean sans-serif (system font stack or Google Fonts)
- Body: Readable sans-serif (same family)
- Font sizes: Scale responsively from 16px mobile to 18px desktop

**Style reference:** Inspired by minimalist Scandinavian design (IKEA gallery aesthetic)—clean, simple, focused on product imagery.

---

## 15. Project Structure (Astro)

```
/workspace/
├── .github/workflows/deploy.yml
├── public/
│   └── robots.txt
├── src/
│   ├── assets/img/           # images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   ├── MobileMenu.astro
│   │   │   └── Footer.astro
│   │   ├── ui/
│   │   │   ├── HeroImage.astro
│   │   │   ├── ProductSection.astro
│   │   │   ├── Gallery.astro
│   │   │   ├── HotspotImage.astro
│   │   │   ├── ContactForm.astro
│   │   │   ├── LanguageSelector.astro
│   │   │   └── Analytics.astro
│   │   └── seo/
│   │       └── SEOHead.astro
│   ├── i18n/
│   │   ├── sk.ts
│   │   ├── en.ts
│   │   ├── cs.ts
│   │   └── index.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── index.astro              # / — language selector
│   │   ├── [lang]/
│   │   │   └── index.astro          # products page (dynamic, 3 langs)
│   │   ├── sk/
│   │   │   └── pre-investorov.astro # investor page (Slovak)
│   │   ├── en/
│   │   │   └── for-investors.astro  # investor page (English)
│   │   └── cs/
│   │       └── pro-investory.astro  # investor page (Czech)
│   └── styles/
│       └── global.css               # Tailwind + GLightbox CSS
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 16. Acceptance Criteria

- [ ] All 7 pages render without errors in dev mode
- [ ] Static build completes cleanly (`npm run build`)
- [ ] All 3 languages accessible and correctly routed
- [ ] HotspotImage component works on desktop and mobile (touch)
- [ ] Lightbox opens/closes and navigates correctly
- [ ] Hotspots remain interactive in lightbox view
- [ ] Contact form submits to Formspree
- [ ] GA4 only fires after Silktide consent
- [ ] Silktide banner appears on first visit
- [ ] Responsive at 375px, 768px, 1280px, 1920px
- [ ] Lighthouse audit: 90+ on all metrics
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] SEO: sitemap valid, robots.txt present, hreflang correct
- [ ] Language switcher navigates to equivalent page in selected language (not homepage)
- [ ] Gallery auto-discovers images from folder; hotspot JSON files load correctly
- [ ] WhatsApp link text updates dynamically as contact form is filled
