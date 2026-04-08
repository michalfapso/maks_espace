# Phases 10-11: Pages & Deployment — Implementation Plan

---

## Phase 10: Page Implementation

### Task 23: Create Homepage (Language Selector)

**Files:** `src/pages/index.astro`

```astro
---
// src/pages/index.astro
import LanguageSelector from '@components/ui/LanguageSelector.astro';
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout title="É-space Garden Houses" description="Choose your language">
  <LanguageSelector />
</BaseLayout>
```

**Commit:**
```bash
git add src/pages/index.astro
git commit -m "pages: add homepage with language selector

- Root page (/) with 3 language options
- Uses LanguageSelector component
- Navigates to /sk/, /en/, /cs/ based on selection

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 24: Create Products Page (Dynamic for 3 Languages)

**Files:** `src/pages/[lang]/index.astro`

```astro
---
// src/pages/[lang]/index.astro
import PageLayout from '@layouts/PageLayout.astro';
import HeroImage from '@components/ui/HeroImage.astro';
import ProductSection from '@components/ui/ProductSection.astro';
import ContactForm from '@components/ui/ContactForm.astro';
import { SUPPORTED_LANGS, type Lang } from '@i18n/index';
import heroImage from '@assets/img/hero.jpg';

export async function getStaticPaths() {
  return SUPPORTED_LANGS.map(lang => ({
    params: { lang },
    props: { lang },
  }));
}

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;

// Page-specific content per language
const content = {
  sk: {
    pageTitle: 'Produktové portfólio HPM É-SPACE',
    products: [
      {
        name: 'Hay Office Solo',
        size: '6–10 m²',
        price: '8–12 tis. €',
        desc: [
          '1 pracovné miesto, panoramatické okno',
          'Základná ventilácia a elektrika',
          'Možnosť inštalácie klimatizácie/mini-splitu',
        ],
      },
      // ... more products
    ],
  },
  en: {
    pageTitle: 'HPM É-SPACE Product Portfolio',
    products: [
      {
        name: 'Hay Office Solo',
        size: '6–10 m²',
        price: '8–12k €',
        desc: [
          '1 workspace, panoramic window',
          'Basic ventilation and electrical',
          'Option for air conditioning / mini-split',
        ],
      },
      // ... more products
    ],
  },
  cs: {
    pageTitle: 'HPM É-SPACE Portfolio Produktů',
    products: [
      {
        name: 'Hay Office Solo',
        size: '6–10 m²',
        price: '8–12 tis. €',
        desc: [
          '1 pracovní místo, panoramatické okno',
          'Základní ventilace a elektrika',
          'Možnost instalace klimatizace / mini-splitu',
        ],
      },
      // ... more products
    ],
  },
};

const pageContent = content[lang];
const formspreeId = import.meta.env.PUBLIC_FORMSPREE_ID;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
---

<PageLayout
  title={pageContent.pageTitle}
  lang={lang}
  pathname={`/${lang}/`}
  seoKeywords={['garden office', 'prefab', 'eco-friendly']}
>
  <HeroImage src={heroImage} alt="Hero image" />

  {/* Product Sections */}
  {pageContent.products.map((product, idx) => (
    <ProductSection
      name={product.name}
      size={product.size}
      price={product.price}
      description={product.desc}
      reverse={idx % 2 === 1}
    >
      <img slot="image" src={`/assets/galleries/${idx + 1}/image.jpg`} alt={product.name} />
    </ProductSection>
  ))}

  {/* Interior Inspiration Section */}
  <section class="section-padding bg-wood text-cream">
    <div class="container">
      <h2 class="text-4xl font-bold mb-8">Interior Inspiration</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Gallery gallery would go here -->
      </div>
    </div>
  </section>

  {/* Materials Section */}
  <section class="section-padding bg-cream">
    <div class="container">
      <h2 class="text-4xl font-bold text-wood mb-4">Materials</h2>
      <p class="text-gray-600">Placeholder: detailed materials info coming soon</p>
    </div>
  </section>

  {/* Contact Form */}
  <ContactForm lang={lang} formspreeId={formspreeId} whatsappNumber={whatsappNumber} />
</PageLayout>
```

**Commit:**
```bash
git add src/pages/[lang]/index.astro
git commit -m "pages: add products page (dynamic for 3 languages)

- Generates 3 static pages: /sk/, /en/, /cs/
- Hero image, product sections, interior, materials
- Contact form at bottom
- Language-specific content and pricing

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 25-27: Create Investor Pages (Static per Language)

**Files:**
- `src/pages/sk/pre-investorov.astro`
- `src/pages/en/for-investors.astro`
- `src/pages/cs/pro-investory.astro`

Example for `src/pages/sk/pre-investorov.astro`:

```astro
---
// src/pages/sk/pre-investorov.astro
import PageLayout from '@layouts/PageLayout.astro';
import ContactForm from '@components/ui/ContactForm.astro';

const formspreeId = import.meta.env.PUBLIC_FORMSPREE_ID;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
---

<PageLayout
  title="PITCH-DECK pre investorov"
  description="Business opportunity: prefab garden offices from eco-materials"
  lang="sk"
  pathname="/sk/pre-investorov/"
>
  {/* Vision */}
  <section class="section-padding">
    <div class="container max-w-3xl">
      <h2 class="text-4xl font-bold text-wood mb-4">Vôňa sena a ticho prírody – vaša každodenná kancelária</h2>
      <p class="text-lg text-gray-600">Prefabrikované záhradné kancelárie z konope a slamy pre Česko a Slovensko.</p>
    </div>
  </section>

  {/* Problem */}
  <section class="section-padding bg-cream">
    <div class="container max-w-3xl">
      <h2 class="text-4xl font-bold text-wood mb-6">Problém</h2>
      <ul class="space-y-4">
        <li class="flex gap-3">
          <span class="text-amber font-bold">•</span>
          <span>Segment „garden offices" v EÚ prudko rastie, no väčšina riešení využíva štandardné materiály</span>
        </li>
        {/* More points */}
      </ul>
    </div>
  </section>

  {/* ... More sections (Solution, Roadmap, Market, Business Model, Why Us, Ask) */}

  {/* Contact Form */}
  <ContactForm lang="sk" formspreeId={formspreeId} whatsappNumber={whatsappNumber} />
</PageLayout>
```

Create similar files for `en/for-investors.astro` and `cs/pro-investory.astro` with translated content.

**Commit all three:**
```bash
git add src/pages/sk/pre-investorov.astro src/pages/en/for-investors.astro src/pages/cs/pro-investory.astro
git commit -m "pages: add investor pitch deck (3 languages)

- /sk/pre-investorov/ - Slovak investor page
- /en/for-investors/ - English investor page
- /cs/pro-investory/ - Czech investor page
- All 8 pitch-deck sections per language
- Contact form at bottom

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 11: Deployment & Build

### Task 28: Organize Images into Gallery Folders

**Files:** Move existing image files

```bash
# Create gallery folder structure
mkdir -p src/assets/galleries/{1,2,3,interior,materials}

# Move floor plan images to respective folders
mv src/assets/img/1_podorys.jpg src/assets/galleries/1/
mv src/assets/img/2_podorys.jpg src/assets/galleries/2/
mv src/assets/img/3_podorys.jpg src/assets/galleries/3/

# Move material image
mv src/assets/img/material.jpg src/assets/galleries/materials/

# Keep logo and hero in img/ folder
# (they're already there)

# Create .gitkeep files for empty galleries
touch src/assets/galleries/interior/.gitkeep
```

**Commit:**
```bash
git add src/assets/galleries/
git commit -m "chore: organize images into gallery folders

- 1/, 2/, 3/ - product gallery folders
- interior/ - interior inspiration gallery
- materials/ - materials showcase gallery
- Moved 1_podorys.jpg, 2_podorys.jpg, 3_podorys.jpg
- Moved material.jpg to materials/
- logo.jpg and hero.jpg remain in img/

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 29: Create robots.txt

**Files:** `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://espace-gardens.com/sitemap-index.xml
```

**Commit:**
```bash
git add public/robots.txt
git commit -m "seo: add robots.txt

- Allow all crawlers
- Point to sitemap-index.xml (auto-generated by Astro)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 30: Create GitHub Pages Workflow

**Files:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  PUBLIC_SITE_URL: ${{ secrets.PUBLIC_SITE_URL }}
  PUBLIC_GA_ID: ${{ secrets.PUBLIC_GA_ID }}
  PUBLIC_FORMSPREE_ID: ${{ secrets.PUBLIC_FORMSPREE_ID }}
  PUBLIC_WHATSAPP_NUMBER: ${{ secrets.PUBLIC_WHATSAPP_NUMBER }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

**Commit:**
```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow

- Build on push to main
- Deploy dist/ to GitHub Pages
- Inject environment variables from secrets
- Support for custom domain

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 31: Create CNAME for Custom Domain

**Files:** `public/CNAME`

```
espace-gardens.com
```

(Replace with actual domain)

**Commit:**
```bash
git add public/CNAME
git commit -m "config: add CNAME for custom domain

- Tells GitHub Pages to use custom domain
- Replace 'espace-gardens.com' with actual domain

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 32: Download and Translate Silktide

**Manual Task:**

1. Download Silktide consent script from their dashboard
2. Save to `public/consent/silktide_en.js` (original)
3. Create `silktide_sk.js` by translating UI strings:
   - "Manage Consent" → "Spravovať Súbory Cookie"
   - "Accept All" → "Akceptovať Všetko"
   - "Reject All" → "Odmietnuť Všetko"
   - (and other UI text)
4. Create `silktide_cs.js` with Czech translations
5. Commit all three

```bash
git add public/consent/silktide_*.js
git commit -m "ci: add Silktide consent manager (multi-language)

- silktide_en.js - English (original)
- silktide_sk.js - Slovak (translated)
- silktide_cs.js - Czech (translated)
- Loaded dynamically by Analytics.astro based on page lang

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 33: Final Build & Verification

```bash
# Build production
npm run build

# Verify dist/ contains:
# - dist/index.html (language selector)
# - dist/sk/index.html (products page)
# - dist/en/index.html (products page)
# - dist/cs/index.html (products page)
# - dist/sk/pre-investorov/index.html
# - dist/en/for-investors/index.html
# - dist/cs/pro-investory/index.html
# - dist/sitemap-index.xml (auto-generated)
# - dist/robots.txt

# Verify no build errors
npm run preview # Preview production build locally
```

**Commit verification:**
```bash
git commit --allow-empty -m "build: verify production build

- npm run build completes without errors
- All 7 pages render in dist/
- Sitemap auto-generated
- Ready for deployment to GitHub Pages

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Final Checklist

- [ ] All phases 1-11 completed
- [ ] All 33 tasks committed
- [ ] GitHub secrets configured:
  - `PUBLIC_SITE_URL`
  - `PUBLIC_GA_ID`
  - `PUBLIC_FORMSPREE_ID`
  - `PUBLIC_WHATSAPP_NUMBER`
- [ ] GitHub Pages enabled (repo settings → Pages → Deploy from GitHub Actions)
- [ ] Custom domain configured (if using one)
- [ ] Build passes: `npm run build`
- [ ] Site live and accessible

---

## Summary

✅ **Phase 10 Complete:**
- Homepage language selector
- Products page (3 language variants)
- Investor pages (3 language variants)

✅ **Phase 11 Complete:**
- Image organization into gallery folders
- robots.txt for SEO
- GitHub Actions deployment workflow
- CNAME for custom domain
- Silktide multi-language setup

**Site is now ready for deployment!**
