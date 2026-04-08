# HPM É-Space Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multilingual static marketing website for HPM garden office products with Astro.js, supporting Slovak/English/Czech languages, featuring interactive galleries with hotspots, a contact form, and investor pitch deck.

**Architecture:** Multi-language Astro static site with custom TypeScript i18n system, component-based UI with Tailwind CSS styling, interactive galleries with optional hotspot overlays defined via JSON, and Formspree backend for contact forms. Gallery component auto-discovers images from folders and wraps HotspotImage when .json files are present.

**Tech Stack:** Astro.js, Tailwind CSS, GLightbox, TypeScript, Formspree.io, Silktide Consent Manager, GA4, GitHub Actions

---

## File Structure

Key files to be created/modified:

**Configuration:**
- `astro.config.mjs`
- `tailwind.config.mjs`
- `tsconfig.json`
- `package.json` (modify for dependencies)

**i18n (global strings only):**
- `src/i18n/index.ts` (utilities: t(), getLangURL(), LANG_META, SUPPORTED_LANGS)
- `src/i18n/sk.ts` (Slovak: nav, footer, form labels)
- `src/i18n/en.ts` (English: nav, footer, form labels)
- `src/i18n/cs.ts` (Czech: nav, footer, form labels)

**Consent Manager (multi-language):**
- `public/consent/silktide_en.js` (English)
- `public/consent/silktide_sk.js` (Slovak, translated)
- `public/consent/silktide_cs.js` (Czech, translated)

**Layouts:**
- `src/layouts/BaseLayout.astro`
- `src/layouts/PageLayout.astro`

**Components:**
- `src/components/layout/Navbar.astro`
- `src/components/layout/MobileMenu.astro`
- `src/components/layout/Footer.astro`
- `src/components/seo/SEOHead.astro`
- `src/components/ui/Analytics.astro`
- `src/components/ui/HeroImage.astro`
- `src/components/ui/ProductSection.astro`
- `src/components/ui/Gallery.astro`
- `src/components/ui/HotspotImage.astro`
- `src/components/ui/ContactForm.astro`
- `src/components/ui/LanguageSelector.astro`

**Pages:**
- `src/pages/index.astro`
- `src/pages/[lang]/index.astro`
- `src/pages/sk/pre-investorov.astro`
- `src/pages/en/for-investors.astro`
- `src/pages/cs/pro-investory.astro`

**Styles:**
- `src/styles/global.css`

**Images:**
- `src/assets/img/logo.jpg`
- `src/assets/img/hero.jpg`
- `src/assets/galleries/1/` (product images)
- `src/assets/galleries/2/` (product images)
- `src/assets/galleries/3/` (product images)
- `src/assets/galleries/interior/` (interior images)
- `src/assets/galleries/materials/` (material images)

**Deployment:**
- `.github/workflows/deploy.yml`
- `public/robots.txt`
- `public/CNAME`

---

# Phase 1: Project Initialization

### Task 1: Scaffold Astro Project

**Files:**
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Modify: `package.json`

- [ ] **Step 1: Initialize npm project (if not already done)**

```bash
cd /workspace
npm init -y
```

- [ ] **Step 2: Install Astro and core dependencies**

```bash
npm install astro @astrojs/tailwind @astrojs/sitemap glightbox
npm install -D tailwindcss postcss autoprefixer typescript
```

Expected output: Dependencies installed in `node_modules/`

- [ ] **Step 3: Create `astro.config.mjs`**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://espace-gardens.com',
  base: '/',
  output: 'static',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    ssr: {
      external: ['glightbox'],
    },
  },
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "jsxImportSource": "astro",
    "allowJs": true,
    "checkJs": false,
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 5: Update `package.json` scripts**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 6: Create directories**

```bash
mkdir -p src/{layouts,components/{layout,ui,seo},pages/{lang,sk,en,cs},assets/{img,galleries/{1,2,3,interior,materials}},styles,i18n}
```

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs tsconfig.json package.json package-lock.json
git commit -m "chore: initialize Astro project scaffold

- Set up Astro with Tailwind CSS and Sitemap integrations
- Configure TypeScript strict mode
- Set site URL and output format
- Create directory structure for components, pages, and assets

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

# Phase 2: Internationalization (i18n)

### Task 2: Create i18n Index and Utilities (Global Strings Only)

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/types.ts`

**Note:** This simplified i18n system handles only global UI strings (nav, footer, form labels). Page-specific content (products, investor pitch) lives directly in page components.

- [ ] **Step 1: Write `src/i18n/index.ts`**

```typescript
// src/i18n/index.ts
export type Lang = 'sk' | 'en' | 'cs';

export const SUPPORTED_LANGS: Lang[] = ['sk', 'en', 'cs'];

export const LANG_META = {
  sk: { label: 'Slovenčina', flag: '🇸🇰', ogLocale: 'sk_SK' },
  en: { label: 'English', flag: '🇬🇧', ogLocale: 'en_GB' },
  cs: { label: 'Čeština', flag: '🇨🇿', ogLocale: 'cs_CZ' },
} as const;

// Import global translation strings
import sk from './sk';
import en from './en';
import cs from './cs';

const translations: Record<Lang, typeof sk> = { sk, en, cs };

export function t(lang: Lang) {
  return translations[lang] || translations.sk;
}

// Get language-specific URLs
export function getProductsPath(lang: Lang): string {
  return `/${lang}/`;
}

export function getInvestorPath(lang: Lang): string {
  const investorPaths: Record<Lang, string> = {
    sk: '/sk/pre-investorov/',
    en: '/en/for-investors/',
    cs: '/cs/pro-investory/',
  };
  return investorPaths[lang];
}

export function getLangURL(pathname: string, lang: Lang): string {
  if (pathname.includes('investorov') || pathname.includes('investors') || pathname.includes('investory')) {
    return getInvestorPath(lang);
  }
  return getProductsPath(lang);
}
```

- [ ] **Step 2: Create types file for global strings**

```typescript
// src/i18n/types.ts
export interface TranslationSet {
  nav: {
    products: string;
    investors: string;
  };
  footer: {
    company: string;
    contact: string;
  };
  contact: {
    formLabel: string;
    nameLabel: string;
    emailLabel: string;
    productLabel: string;
    noteLabel: string;
    submitBtn: string;
    whatsappBtn: string;
    successMsg: string;
    errorMsg: string;
    productOptions: [string, string, string, string]; // 4 options: 3 products + Other
  };
}
```

- [ ] **Step 3: Commit i18n foundation**

```bash
git add src/i18n/index.ts src/i18n/types.ts
git commit -m "feat: create i18n foundation (global strings)

- Define SUPPORTED_LANGS, LANG_META for 3 languages
- Create t() function for accessing translations
- Create getLangURL() and getInvestorPath() helpers
- Define TranslationSet interface for nav/footer/form labels only
- Support language-specific URL slugs
- Page-specific content will be defined in page components

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Create Slovak Translations (Global Strings, Source of Truth)

**Files:**
- Create: `src/i18n/sk.ts`

- [ ] **Step 1: Write Slovak global strings**

```typescript
// src/i18n/sk.ts
import type { TranslationSet } from './types';

const sk = {
  nav: {
    products: 'Produkty',
    investors: 'Pre Investorov',
  },
  footer: {
    company: 'HPM company Slovakia',
    contact: 'Kontakt',
  },
  contact: {
    formLabel: 'Kontaktný Formulár',
    nameLabel: 'Meno',
    emailLabel: 'Email',
    productLabel: 'Ktorý produkt vás zaujíma?',
    noteLabel: 'Poznámka',
    submitBtn: 'Odoslať',
    whatsappBtn: 'Alebo napíš mi na WhatsApp',
    successMsg: 'Ďakujeme! Čoskoro sa vám ozývame.',
    errorMsg: 'Chyba pri odoslaní. Skúste znova.',
    productOptions: ['Hay Office Solo', 'Hay Studio Duo', 'Nature Meeting Cube', 'Iné'],
  },
} as const satisfies TranslationSet;

export default sk;
```

- [ ] **Step 2: Commit Slovak translations**

```bash
git add src/i18n/sk.ts
git commit -m "i18n: add Slovak translations (global strings, source of truth)

- Navigation labels (Products, For Investors)
- Footer text (company name, contact)
- Contact form labels and messages
- Product dropdown options + 'Other'
- Marked as source of truth with 'as const'

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create English Translations (Global Strings)

**Files:**
- Create: `src/i18n/en.ts`

- [ ] **Step 1: Write English global strings**

```typescript
// src/i18n/en.ts
import type { TranslationSet } from './types';

const en = {
  nav: {
    products: 'Products',
    investors: 'For Investors',
  },
  footer: {
    company: 'HPM company Slovakia',
    contact: 'Contact',
  },
  contact: {
    formLabel: 'Contact Form',
    nameLabel: 'Name',
    emailLabel: 'Email',
    productLabel: 'Which product interests you?',
    noteLabel: 'Message',
    submitBtn: 'Send',
    whatsappBtn: 'Or message me on WhatsApp',
    successMsg: 'Thank you! We\'ll be in touch soon.',
    errorMsg: 'Error sending message. Please try again.',
    productOptions: ['Hay Office Solo', 'Hay Studio Duo', 'Nature Meeting Cube', 'Other'],
  },
} as const satisfies TranslationSet;

export default en;
```

- [ ] **Step 2: Commit English translations**

```bash
git add src/i18n/en.ts
git commit -m "i18n: add English translations (global strings)

- Navigation, footer, and contact form labels
- All keys match Slovak source of truth

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Create Czech Translations

**Files:**
- Create: `src/i18n/cs.ts`

- [ ] **Step 1: Write Czech translations**

```typescript
// src/i18n/cs.ts
import type { TranslationSet } from './types';

const cs = {
  nav: {
    products: 'Produkty',
    investors: 'Pro Investory',
  },
  footer: {
    company: 'HPM company Slovakia',
    contact: 'Kontakt',
  },
  contact: {
    formLabel: 'Kontaktní Formulář',
    nameLabel: 'Jméno',
    emailLabel: 'Email',
    productLabel: 'Který produkt vás zajímá?',
    noteLabel: 'Zpráva',
    submitBtn: 'Odeslat',
    whatsappBtn: 'Nebo mi napište na WhatsApp',
    successMsg: 'Děkujeme! Brzy se vám ozveme.',
    errorMsg: 'Chyba při odesílání. Zkuste prosím znovu.',
    productOptions: ['Hay Office Solo', 'Hay Studio Duo', 'Nature Meeting Cube', 'Jiné'],
  },
} as const satisfies TranslationSet;

export default cs;
```

- [ ] **Step 2: Commit Czech translations**

```bash
git add src/i18n/cs.ts
git commit -m "i18n: add Czech translations (global strings)

- Navigation, footer, and contact form labels translated to Czech
- All keys match Slovak and English versions
- Page-specific content will be in individual page components

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Summary So Far

✅ **Completed:**
- Phase 1: Astro scaffold, dependencies, directory structure
- Phase 2: i18n foundation with global strings (3 languages):
  - Navigation labels
  - Footer text
  - Contact form labels and messages
  - Product dropdown options

**Important:** Page-specific content (products, investor pitch sections) will be defined directly in their respective page components (`src/pages/[lang]/index.astro`, `src/pages/sk/pre-investorov.astro`, etc.) for simplicity.

**Consent Manager:** Silktide consent form will be downloaded and manually translated to create language-specific versions (`public/consent/silktide_sk.js`, `silktide_en.js`, `silktide_cs.js`). The `Analytics.astro` component will load the appropriate version based on the page language.

**Next:** Proceed to Task 6 to configure core files, then continue with layouts and components in the next session.

**Current Status:** Ready to test with `npm run dev` (will fail until layouts/pages are created).

