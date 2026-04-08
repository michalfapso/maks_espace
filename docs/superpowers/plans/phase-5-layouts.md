# Phase 5: Layouts — Implementation Plan

**Phase Goal:** Create base layout shell with HTML structure, and page layout wrapper.

**Files to create:**
- `src/layouts/BaseLayout.astro`
- `src/layouts/PageLayout.astro`

---

### Task 11: Create BaseLayout Component

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import type { Lang } from '@i18n/index';

interface Props {
  title: string;
  description?: string;
  lang: Lang;
  pathname?: string;
  ogImage?: string;
}

const { 
  title, 
  description = 'HPM É-space garden offices - Prefabricated eco-friendly workspaces',
  lang,
  pathname = '',
  ogImage = '/og-image.jpg'
} = Astro.props;
---

<!DOCTYPE html>
<html lang={lang} dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Head slot - populated by page -->
    <slot name="seo" />

    <!-- Preload fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Preload critical assets -->
    <link rel="preload" as="image" href="/assets/img/logo.jpg" />
    <link rel="preload" as="style" href="/styles/global.css" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    
    <!-- DNS Prefetch for external services -->
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://consent.silktide.com" />
    <link rel="dns-prefetch" href="https://formspree.io" />
  </head>

  <body class="bg-cream text-gray-800">
    <!-- Skip to main content link for accessibility -->
    <a href="#main" class="visually-hidden focus:not-visually-hidden">
      Skip to main content
    </a>

    <!-- Navbar -->
    <slot name="navbar" />

    <!-- Main Content -->
    <main id="main" role="main">
      <slot />
    </main>

    <!-- Footer -->
    <slot name="footer" />

    <!-- Analytics (Silktide + GA4) -->
    <slot name="analytics" />
  </body>
</html>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
```

- [ ] **Step 2: Commit BaseLayout**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "layout: add BaseLayout with HTML shell

- HTML5 doctype with lang attribute
- Viewport meta for responsive design
- Preload critical assets (logo, styles)
- DNS prefetch for external services
- Favicon and Apple touch icon setup
- Named slots for navbar, footer, analytics
- Skip-to-main-content link for accessibility
- Import global CSS

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Create PageLayout Component

**Files:**
- Create: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Write `src/layouts/PageLayout.astro`**

```astro
---
// src/layouts/PageLayout.astro
import BaseLayout from './BaseLayout.astro';
import Navbar from '@components/layout/Navbar.astro';
import Footer from '@components/layout/Footer.astro';
import Analytics from '@components/ui/Analytics.astro';
import SEOHead from '@components/seo/SEOHead.astro';
import type { Lang } from '@i18n/index';

interface Props {
  title: string;
  description?: string;
  lang: Lang;
  pathname?: string;
  ogImage?: string;
  ogType?: string;
  seoKeywords?: string[];
}

const { 
  title, 
  description,
  lang,
  pathname = '',
  ogImage,
  ogType = 'website',
  seoKeywords = []
} = Astro.props;
---

<BaseLayout title={title} description={description} lang={lang} pathname={pathname} ogImage={ogImage}>
  <SEOHead 
    slot="seo"
    title={title}
    description={description}
    lang={lang}
    pathname={pathname}
    ogImage={ogImage}
    ogType={ogType}
    seoKeywords={seoKeywords}
  />

  <Navbar slot="navbar" lang={lang} />

  <!-- Page Content -->
  <slot />

  <Footer slot="footer" lang={lang} />

  <Analytics slot="analytics" lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Commit PageLayout**

```bash
git commit -m "layout: add PageLayout wrapper

- Wraps BaseLayout with standard page structure
- Injects Navbar, Footer, Analytics automatically
- Passes lang prop to all layout components
- Accepts SEO props for page-specific metadata
- Provides consistent header/footer across all pages

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Summary

✅ **Phase 5 Complete:**
- BaseLayout with HTML5 shell, preloads, DNS prefetch
- Accessibility features (skip-to-main, semantic markup)
- Named slots for navbar, footer, analytics
- PageLayout wrapper that auto-injects common components

**Next:** Proceed to Phase 6 (Layout Components: Navbar, Footer, etc.)

**Note:** Navbar, Footer, Analytics, and SEOHead will be created in Phase 6-7. The PageLayout references them but they don't exist yet—that's intentional. Phase 6-7 will complete those components.
