# Phase 3: Configuration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Phase Goal:** Configure Astro, Tailwind, and TypeScript for the project.

**Files to create/modify:**
- `astro.config.mjs`
- `tailwind.config.mjs`
- `tsconfig.json`
- `.env.example`

---

### Task 6: Create and Configure astro.config.mjs

**Files:**
- Create: `astro.config.mjs`

- [ ] **Step 1: Write `astro.config.mjs`**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://espace-gardens.com',
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
  env: {
    schema: {
      PUBLIC_SITE_URL: 'string',
      PUBLIC_GA_ID: 'string',
    },
  },
});
```

- [ ] **Step 2: Commit astro config**

```bash
git add astro.config.mjs
git commit -m "config: set up astro.config.mjs

- Configure site URL from env or default
- Static output mode for GitHub Pages
- Tailwind CSS and Sitemap integrations
- GLightbox marked as external for SSR

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Create and Configure tailwind.config.mjs

**Files:**
- Create: `tailwind.config.mjs`

- [ ] **Step 1: Write `tailwind.config.mjs`**

```javascript
// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        wood: '#3a2f29',      // Dark wood brown
        cream: '#f5f1ed',     // Off-white / cream
        amber: '#c19a6b',     // Warm amber accent
        gray: {
          800: '#333',        // Dark text
          600: '#666',        // Medium text
          100: '#f0f0f0',     // Light backgrounds
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
        '5xl': ['48px', '48px'],
        '6xl': ['60px', '60px'],
      },
      spacing: {
        'section-padding': '2rem', // Responsive via @apply
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Commit tailwind config**

```bash
git add tailwind.config.mjs
git commit -m "config: set up tailwind.config.mjs

- Custom color palette (wood, cream, amber)
- Typography scale (16px base to 60px)
- Inter font family as default
- Extended spacing and responsive utilities

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Create and Configure tsconfig.json

**Files:**
- Create/Modify: `tsconfig.json`

- [ ] **Step 1: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "jsxImportSource": "astro",
    "allowJs": true,
    "checkJs": false,
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020", "dom", "dom.iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "rootDirs": ["./src"],
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@pages/*": ["src/pages/*"],
      "@i18n/*": ["src/i18n/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 2: Commit tsconfig**

```bash
git add tsconfig.json
git commit -m "config: set up tsconfig.json

- Strict TypeScript mode enabled
- ES2020 target with bundler module resolution
- Path aliases for clean imports (@components, @i18n, etc)
- Astro JSX support configured

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Create .env.example

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Write `.env.example`**

```
# Site Configuration
PUBLIC_SITE_URL=https://espace-gardens.com

# Google Analytics 4
PUBLIC_GA_ID=G-XXXXXXXXXX

# Formspree Contact Form
PUBLIC_FORMSPREE_ID=

# WhatsApp Business
PUBLIC_WHATSAPP_NUMBER=+421XXXXXXXXX

# Silktide Consent (file-based, URLs will be in Analytics.astro)
# Download from Silktide and translate to silktide_sk.js, silktide_cs.js
```

- [ ] **Step 2: Commit .env.example**

```bash
git add .env.example
git commit -m "docs: add .env.example template

- Site URL configuration
- GA4 Measurement ID placeholder
- Formspree endpoint placeholder
- WhatsApp Business number placeholder
- Reminder about Silktide translation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Summary

✅ **Phase 3 Complete:**
- Astro configuration with site URL, integrations, environment
- Tailwind CSS theme (colors, typography, spacing)
- TypeScript strict mode with path aliases
- Environment variable template

**Next:** Proceed to Phase 4 (Global Styles)
