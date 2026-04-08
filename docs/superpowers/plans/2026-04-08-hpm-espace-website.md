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

**i18n:**
- `src/i18n/index.ts`
- `src/i18n/sk.ts`
- `src/i18n/en.ts`
- `src/i18n/cs.ts`

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

### Task 2: Create i18n Index and Utilities

**Files:**
- Create: `src/i18n/index.ts`

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

// Lazy import translations to reduce bundle size
import type { TranslationSet } from './types';

const translations: Record<Lang, TranslationSet> = {
  sk: (await import('./sk')).default,
  en: (await import('./en')).default,
  cs: (await import('./cs')).default,
};

export function t(lang: Lang): TranslationSet {
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

// Type for all translations
export interface TranslationSet {
  nav: {
    products: string;
    investors: string;
  };
  homepage: {
    title: string;
    subtitle: string;
  };
  products: {
    pageTitle: string;
    solo: {
      name: string;
      size: string;
      price: string;
      desc: string[];
    };
    duo: {
      name: string;
      size: string;
      price: string;
      desc: string[];
    };
    cube: {
      name: string;
      size: string;
      price: string;
      desc: string[];
    };
    interior: {
      title: string;
      desc: string;
    };
    materials: {
      title: string;
      text: string;
    };
  };
  contact: {
    label: string;
    name: string;
    email: string;
    product: string;
    note: string;
    submit: string;
    whatsapp: string;
    success: string;
    error: string;
  };
  investor: {
    pageTitle: string;
    vision: { title: string; text: string };
    problem: { title: string; points: string[] };
    solution: { title: string; text: string };
    roadmap: { title: string; text: string };
    market: { title: string; text: string };
    bizmodel: { title: string; text: string };
    why: { title: string; text: string };
    ask: { title: string; text: string };
  };
}
```

- [ ] **Step 2: Create types file for translations**

```typescript
// src/i18n/types.ts
export interface TranslationSet {
  nav: {
    products: string;
    investors: string;
  };
  homepage: {
    title: string;
    subtitle: string;
  };
  products: {
    pageTitle: string;
    solo: {
      name: string;
      size: string;
      price: string;
      desc: string[];
    };
    duo: {
      name: string;
      size: string;
      price: string;
      desc: string[];
    };
    cube: {
      name: string;
      size: string;
      price: string;
      desc: string[];
    };
    interior: {
      title: string;
      desc: string;
    };
    materials: {
      title: string;
      text: string;
    };
  };
  contact: {
    label: string;
    name: string;
    email: string;
    product: string;
    note: string;
    submit: string;
    whatsapp: string;
    success: string;
    error: string;
  };
  investor: {
    pageTitle: string;
    vision: { title: string; text: string };
    problem: { title: string; points: string[] };
    solution: { title: string; text: string };
    roadmap: { title: string; text: string };
    market: { title: string; text: string };
    bizmodel: { title: string; text: string };
    why: { title: string; text: string };
    ask: { title: string; text: string };
  };
}
```

- [ ] **Step 3: Commit i18n foundation**

```bash
git add src/i18n/index.ts src/i18n/types.ts
git commit -m "feat: create i18n foundation with language utilities

- Define SUPPORTED_LANGS, LANG_META for 3 languages
- Create t() function for accessing translations
- Create getLangURL() and getInvestorPath() helpers
- Define TranslationSet interface for type safety
- Support language-specific URL slugs

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Create Slovak Translations (Source of Truth)

**Files:**
- Create: `src/i18n/sk.ts`

- [ ] **Step 1: Write complete Slovak translations**

```typescript
// src/i18n/sk.ts
import type { TranslationSet } from './types';

const sk = {
  nav: {
    products: 'Produkty',
    investors: 'Pre Investorov',
  },
  homepage: {
    title: 'É-space Garden Houses',
    subtitle: 'Prefabrikované záhradné kancelárie z ekologických materiálov',
  },
  products: {
    pageTitle: 'Produktové portfólio HPM É-SPACE',
    solo: {
      name: 'Hay Office Solo',
      size: '6–10 m²',
      price: '8–12 tis. €',
      desc: [
        '1 pracovné miesto, panoramatické okno',
        'Základná ventilácia a elektrika',
        'Možnosť inštalácie klimatizácie/mini-splitu',
      ],
    },
    duo: {
      name: 'Hay Studio Duo',
      size: '12–16 m²',
      price: '16–24 tis. €',
      desc: [
        '1–2 pracovné miesta + zóna pre pohovku',
        'Vylepšené akustické riešenie',
        'Opcia kompaktného sanitárneho uzla',
      ],
    },
    cube: {
      name: 'Nature Meeting Cube',
      size: '20–24 m²',
      price: '24–40 tis. €',
      desc: [
        'Väčšie presklenie, dizajnový akcent',
        'Možnosť využitia ako malá zasadacia miestnosť',
        'Ideálne pre koučov, psychológov, mikro-coworking',
      ],
    },
    interior: {
      title: 'Interiérové Inšpirácie',
      desc: 'Dizajnované s IKEA nábytkom pre maximálny komfort a funkcionalitu.',
    },
    materials: {
      title: 'Použité Materiály',
      text: 'Konopné panely, slama a ďalšie ekologické materiály — podrobný popis bude doplnený neskôr.',
    },
  },
  contact: {
    label: 'Kontaktný Formulár',
    name: 'Meno',
    email: 'Email',
    product: 'Ktorý produkt vás zaujíma?',
    note: 'Poznámka',
    submit: 'Odoslať',
    whatsapp: 'Alebo napíš mi na WhatsApp',
    success: 'Ďakujeme! Čoskoro sa vám ozývame.',
    error: 'Chyba pri odoslaní. Skúste znova.',
  },
  investor: {
    pageTitle: 'PITCH-DECK pre investorov',
    vision: {
      title: 'Vôňa sena a ticho prírody – vaša každodenná kancelária',
      text: 'Prefabrikované záhradné kancelárie z konope a slamy pre Česko a Slovensko.',
    },
    problem: {
      title: 'Problém',
      points: [
        'Segment „garden offices" v EÚ prudko rastie, no väčšina riešení využíva štandardné materiály',
        'Majitelia domov hľadajú tiché, teplé a rýchlo zmontovateľné kancelárie bez zložitého povolenia',
        'Na trhu prakticky neexistujú sériové prefab-kancelárie z bio-materiálov',
      ],
    },
    solution: {
      title: 'Riešenie: HPM É-KIRI OFFICE',
      text: 'Séria prefabrikovaných modulárnych kancelárií s konope a slamou, opaľovaným dreveným obkladom a hotovými inžinierskymi riešeniami.',
    },
    roadmap: {
      title: 'Produktová Línia',
      text: 'Hay Office Solo, Hay Studio Duo, Nature Meeting Cube — všetky celoročne využiteľné.',
    },
    market: {
      title: 'Trh a Načasovanie',
      text: 'Globálny trh „garden rooms" dosiahne 2,7–2,9 mld. USD. Európa tvorí ~48% objemu. Rastúci záujem o biostavby v strednej Európe.',
    },
    bizmodel: {
      title: 'Biznis Model',
      text: 'B2C: priamy predaj; B2B: developeri, hotely, rezorty, glamping.',
    },
    why: {
      title: 'Prečo My',
      text: 'Skúsenosti s ekologickými materiálmi, lokálne zastúpenie, existujúca sieť partnerov.',
    },
    ask: {
      title: 'Čo Hľadáme',
      text: 'Investície na spustenie prototypovej linky, certifikáciu, showroomy v kľúčových lokalitách.',
    },
  },
} as const satisfies TranslationSet;

export default sk;
```

- [ ] **Step 2: Commit Slovak translations**

```bash
git add src/i18n/sk.ts
git commit -m "i18n: add complete Slovak translations (source of truth)

- Homepage and navigation labels
- All 3 product descriptions and prices
- Interior inspiration and materials sections
- Contact form labels
- All 8 investor pitch-deck sections
- Marked as source of truth with 'as const'

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create English Translations

**Files:**
- Create: `src/i18n/en.ts`

- [ ] **Step 1: Write English translations**

```typescript
// src/i18n/en.ts
import type { TranslationSet } from './types';

const en = {
  nav: {
    products: 'Products',
    investors: 'For Investors',
  },
  homepage: {
    title: 'É-space Garden Houses',
    subtitle: 'Prefabricated garden offices from eco-friendly materials',
  },
  products: {
    pageTitle: 'HPM É-SPACE Product Portfolio',
    solo: {
      name: 'Hay Office Solo',
      size: '6–10 m²',
      price: '8–12k €',
      desc: [
        '1 workspace, panoramic window',
        'Basic ventilation and electrical',
        'Option for air conditioning / mini-split',
      ],
    },
    duo: {
      name: 'Hay Studio Duo',
      size: '12–16 m²',
      price: '16–24k €',
      desc: [
        '1–2 workspaces + relaxation zone',
        'Enhanced acoustic solution',
        'Optional compact bathroom unit',
      ],
    },
    cube: {
      name: 'Nature Meeting Cube',
      size: '20–24 m²',
      price: '24–40k €',
      desc: [
        'Larger glazing, design accent',
        'Can be used as small meeting room',
        'Ideal for coaches, psychologists, micro-coworking',
      ],
    },
    interior: {
      title: 'Interior Inspiration',
      desc: 'Designed with IKEA furniture for maximum comfort and functionality.',
    },
    materials: {
      title: 'Materials Used',
      text: 'Hemp panels, straw, and other eco-friendly materials — detailed description coming soon.',
    },
  },
  contact: {
    label: 'Contact Form',
    name: 'Name',
    email: 'Email',
    product: 'Which product interests you?',
    note: 'Message',
    submit: 'Send',
    whatsapp: 'Or message me on WhatsApp',
    success: 'Thank you! We'll be in touch soon.',
    error: 'Error sending message. Please try again.',
  },
  investor: {
    pageTitle: 'PITCH-DECK for investors',
    vision: {
      title: 'The scent of hay and nature\'s quiet – your everyday office',
      text: 'Prefabricated garden offices from hemp and straw for Czech Republic and Slovakia.',
    },
    problem: {
      title: 'Problem',
      points: [
        'The „garden offices" segment in the EU is growing rapidly, but most solutions use standard materials',
        'Homeowners seek quiet, warm, quickly-assembled offices without complex permits',
        'There are virtually no serial prefab offices from bio-materials on the market',
      ],
    },
    solution: {
      title: 'Solution: HPM É-KIRI OFFICE',
      text: 'A series of prefabricated modular offices with hemp and straw, charred wood cladding, and ready-made engineering solutions.',
    },
    roadmap: {
      title: 'Product Line',
      text: 'Hay Office Solo, Hay Studio Duo, Nature Meeting Cube — all year-round usable.',
    },
    market: {
      title: 'Market & Timing',
      text: 'Global „garden rooms" market reaches €2.7–2.9B. Europe comprises ~48% of volume. Growing demand for bio-building in Central Europe.',
    },
    bizmodel: {
      title: 'Business Model',
      text: 'B2C: direct sales; B2B: developers, hotels, resorts, glamping.',
    },
    why: {
      title: 'Why Us',
      text: 'Experience with eco-materials, local presence, existing partner network.',
    },
    ask: {
      title: 'What We\'re Looking For',
      text: 'Investment to launch prototype line, system certification, showrooms in key locations.',
    },
  },
} as const satisfies TranslationSet;

export default en;
```

- [ ] **Step 2: Commit English translations**

```bash
git add src/i18n/en.ts
git commit -m "i18n: add English translations matching Slovak structure

- All navigation, product, and contact labels translated
- All 8 investor sections translated
- Structure and keys match Slovak source of truth

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
  homepage: {
    title: 'É-space Garden Houses',
    subtitle: 'Prefabrikované zahradní kanceláře z ekologických materiálů',
  },
  products: {
    pageTitle: 'HPM É-SPACE Portfolio Produktů',
    solo: {
      name: 'Hay Office Solo',
      size: '6–10 m²',
      price: '8–12 tis. €',
      desc: [
        '1 pracovní místo, panoramatické okno',
        'Základní ventilace a elektrika',
        'Možnost instalace klimatizace / mini-splitu',
      ],
    },
    duo: {
      name: 'Hay Studio Duo',
      size: '12–16 m²',
      price: '16–24 tis. €',
      desc: [
        '1–2 pracovní místa + zóna pro odpočinek',
        'Vylepšené akustické řešení',
        'Možnost kompaktní koupelny',
      ],
    },
    cube: {
      name: 'Nature Meeting Cube',
      size: '20–24 m²',
      price: '24–40 tis. €',
      desc: [
        'Větší zasklení, designový akcent',
        'Lze využít jako malou zasedací místnost',
        'Ideálně pro kouče, psychology, mikro-coworking',
      ],
    },
    interior: {
      title: 'Inspirace pro Interiér',
      desc: 'Navrženo s nábytkem IKEA pro maximální pohodlí a funkcionalitu.',
    },
    materials: {
      title: 'Použité Materiály',
      text: 'Konopné panely, sláma a další ekologické materiály — podrobný popis bude doplněn později.',
    },
  },
  contact: {
    label: 'Kontaktní Formulář',
    name: 'Jméno',
    email: 'Email',
    product: 'Který produkt vás zajímá?',
    note: 'Zpráva',
    submit: 'Odeslat',
    whatsapp: 'Nebo mi napište na WhatsApp',
    success: 'Děkujeme! Brzy se vám ozveme.',
    error: 'Chyba při odesílání. Zkuste prosím znovu.',
  },
  investor: {
    pageTitle: 'PITCH-DECK pro investory',
    vision: {
      title: 'Vůně sena a ticho přírody – vaše každodenní kancelář',
      text: 'Prefabrikované zahradní kanceláře z konopí a slamy pro Českou republiku a Slovensko.',
    },
    problem: {
      title: 'Problém',
      points: [
        'Segment „zahradních kanceláří" v EU rychle roste, ale většina řešení používá standardní materiály',
        'Majitelé domů hledají tiché, teplé a rychle montované kanceláře bez složitých povolení',
        'Na trhu prakticky neexistují sériové prefabrikované kanceláře z bio-materiálů',
      ],
    },
    solution: {
      title: 'Řešení: HPM É-KIRI OFFICE',
      text: 'Série prefabrikovaných modulárních kanceláří s konopím a slamou, vypáleným dřevěným obkladem a hotovými inženýrskými řešeními.',
    },
    roadmap: {
      title: 'Řada Produktů',
      text: 'Hay Office Solo, Hay Studio Duo, Nature Meeting Cube — všechny celoročně použitelné.',
    },
    market: {
      title: 'Trh a Načasování',
      text: 'Globální trh „zahradních místností" dosahuje €2,7–2,9 mld. Evropa tvoří ~48% objemu. Rostoucí poptávka po bio-stavbách ve střední Evropě.',
    },
    bizmodel: {
      title: 'Obchodní Model',
      text: 'B2C: přímý prodej; B2B: vývojáři, hotely, rezorty, glamping.',
    },
    why: {
      title: 'Proč My',
      text: 'Zkušenosti s ekologickými materiály, místní přítomnost, existující sít partnerů.',
    },
    ask: {
      title: 'Co Hledáme',
      text: 'Investici na spuštění prototypové linky, certifikaci systému, showroomy v klíčových lokalitách.',
    },
  },
} as const satisfies TranslationSet;

export default cs;
```

- [ ] **Step 2: Commit Czech translations**

```bash
git add src/i18n/cs.ts
git commit -m "i18n: add Czech translations matching Slovak structure

- All navigation, product, and contact labels translated
- All 8 investor sections translated to Czech
- Structure and keys match source of truth

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Summary So Far

✅ **Completed:**
- Phase 1: Astro scaffold, dependencies, directory structure
- Phase 2: i18n foundation with 3 complete languages

**Next:** Proceed to Task 6 to configure core files, then continue with layouts and components in the next session.

**Current Status:** Ready to test with `npm run dev` (will fail until layouts/pages are created).

