# Phase 6: Layout Components — Implementation Plan

**Phase Goal:** Create navigation, footer, and analytics components.

**Files to create:**
- `src/components/layout/Navbar.astro`
- `src/components/layout/MobileMenu.astro`
- `src/components/layout/Footer.astro`
- `src/components/ui/Analytics.astro`

---

### Task 13: Create Navbar Component

**Files:**
- Create: `src/components/layout/Navbar.astro`

- [ ] **Step 1: Write `src/components/layout/Navbar.astro`**

```astro
---
// src/components/layout/Navbar.astro
import { t, LANG_META, type Lang, getProductsPath, getInvestorPath } from '@i18n/index';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const i18n = t(lang);
const productsUrl = getProductsPath(lang);
const investorsUrl = getInvestorPath(lang);
---

<nav class="bg-wood text-cream sticky top-0 z-50 shadow-lg">
  <div class="container flex items-center justify-between py-4">
    {/* Logo */}
    <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img 
        src="/assets/img/logo.jpg" 
        alt="HPM company logo" 
        class="h-10 w-auto"
      />
      <span class="hidden sm:inline text-lg font-bold">É-space</span>
    </a>

    {/* Desktop Menu */}
    <div class="hidden md:flex items-center gap-8">
      <a href={productsUrl} class="hover:text-amber transition-colors">
        {i18n.nav.products}
      </a>
      <a href={investorsUrl} class="hover:text-amber transition-colors">
        {i18n.nav.investors}
      </a>
    </div>

    {/* Language Selector + Mobile Menu Button */}
    <div class="flex items-center gap-4">
      {/* Desktop Language Selector */}
      <div class="hidden md:flex gap-2">
        {Object.entries(LANG_META).map(([langCode, meta]) => (
          <a
            href={langCode === 'sk' ? getProductsPath(langCode as Lang) : 
                  langCode === 'en' ? getProductsPath(langCode as Lang) :
                  getProductsPath(langCode as Lang)}
            class={`text-lg ${langCode === lang ? 'text-amber font-bold' : 'hover:text-amber transition-colors'}`}
            title={meta.label}
          >
            {meta.flag}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        class="md:hidden text-2xl hover:text-amber transition-colors"
        aria-label="Toggle menu"
        data-mobile-menu-toggle
      >
        ☰
      </button>
    </div>
  </div>

  {/* Mobile Menu (rendered but hidden by default) */}
  <div data-mobile-menu>
    <div data-mobile-menu-content class="pt-8 pb-6">
      <div class="flex flex-col gap-6 px-6">
        <a 
          href={productsUrl} 
          class="text-lg font-semibold hover:text-amber transition-colors"
          data-mobile-menu-close
        >
          {i18n.nav.products}
        </a>
        <a 
          href={investorsUrl} 
          class="text-lg font-semibold hover:text-amber transition-colors"
          data-mobile-menu-close
        >
          {i18n.nav.investors}
        </a>
        
        {/* Mobile Language Selector */}
        <div class="border-t border-wood pt-6">
          <p class="text-sm font-semibold mb-3">Jazyk / Language</p>
          <div class="flex gap-3">
            {Object.entries(LANG_META).map(([langCode, meta]) => (
              <a
                href={langCode === 'sk' ? getProductsPath(langCode as Lang) : 
                      langCode === 'en' ? getProductsPath(langCode as Lang) :
                      getProductsPath(langCode as Lang)}
                class={`flex flex-col items-center gap-1 p-2 rounded ${
                  langCode === lang 
                    ? 'bg-amber text-wood' 
                    : 'hover:bg-amber/20 transition-colors'
                }`}
                data-mobile-menu-close
              >
                <span class="text-2xl">{meta.flag}</span>
                <span class="text-xs font-semibold">{meta.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<script>
  // Mobile menu toggle
  const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuCloseLinks = document.querySelectorAll('[data-mobile-menu-close]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    menuCloseLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target as Node) && !menuToggle.contains(e.target as Node)) {
        mobileMenu.classList.remove('active');
      }
    });
  }
</script>
```

- [ ] **Step 2: Commit Navbar**

```bash
git add src/components/layout/Navbar.astro
git commit -m "components: add Navbar with desktop and mobile menu

- Logo links to homepage (/)
- Desktop navigation (Products, For Investors)
- Language selector with flags (desktop + mobile)
- Mobile hamburger menu with slide-in overlay
- Auto-closes menu on link click or outside click
- Sticky positioning with drop shadow
- Responsive: hamburger on mobile, full nav on desktop

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 14: Create Footer Component

**Files:**
- Create: `src/components/layout/Footer.astro`

- [ ] **Step 1: Write `src/components/layout/Footer.astro`**

```astro
---
// src/components/layout/Footer.astro
import { t, type Lang } from '@i18n/index';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const i18n = t(lang);
---

<footer class="bg-wood text-cream py-12 mt-20">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
      {/* Company Info */}
      <div>
        <h3 class="text-xl font-bold mb-4">{i18n.footer.company}</h3>
        <p class="text-cream/80">
          Prefabrikované záhradné kancelárie z ekologických materiálov.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 class="text-lg font-semibold mb-4">Rýchle odkazy</h4>
        <ul class="space-y-2">
          <li><a href="/" class="hover:text-amber transition-colors">Domov</a></li>
          <li><a href="/sk/" class="hover:text-amber transition-colors">{i18n.nav.products}</a></li>
          <li><a href="/sk/pre-investorov/" class="hover:text-amber transition-colors">{i18n.nav.investors}</a></li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 class="text-lg font-semibold mb-4">{i18n.footer.contact}</h4>
        <p class="text-cream/80">
          Email: <a href="mailto:info@hpm.sk" class="hover:text-amber transition-colors">info@hpm.sk</a>
        </p>
        <p class="text-cream/80">
          Phone: <a href="tel:+421XXXXXXXXX" class="hover:text-amber transition-colors">+421 XXX XXX XXX</a>
        </p>
      </div>
    </div>

    {/* Divider */}
    <div class="border-t border-cream/20 pt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-cream/70">
          &copy; 2026 HPM company Slovakia. All rights reserved.
        </p>
        <div class="flex gap-6 text-sm">
          <a href="#privacy" class="hover:text-amber transition-colors">Privacy Policy</a>
          <a href="#terms" class="hover:text-amber transition-colors">Terms of Service</a>
          <a href="#cookies" class="hover:text-amber transition-colors">Cookie Settings</a>
        </div>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit Footer**

```bash
git add src/components/layout/Footer.astro
git commit -m "components: add Footer with company info and links

- Company name and description
- Quick links to main pages
- Contact section (email, phone)
- Copyright notice
- Footer links (Privacy, Terms, Cookies)
- Responsive grid layout

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 15: Create Analytics Component (Silktide + GA4)

**Files:**
- Create: `src/components/ui/Analytics.astro`

- [ ] **Step 1: Write `src/components/ui/Analytics.astro`**

```astro
---
// src/components/ui/Analytics.astro
import type { Lang } from '@i18n/index';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;

// Map language codes to Silktide script files
const silktideScript = `/consent/silktide_${lang}.js`;
const gaId = import.meta.env.PUBLIC_GA_ID;
---

<!-- Silktide Consent Manager (unconditional, handles multi-language) -->
<script is:inline src={silktideScript}></script>

<!-- Google Analytics 4 (deferred, fires only after Silktide consent) -->
{gaId && (
  <script is:inline define:vars={{ gaId }}>
    // Wait for Silktide consent event
    window.addEventListener('silktide-consent-change', function(event) {
      const consent = event.detail || window.silktideConsent;
      
      // Only initialize GA4 if analytics consent is granted
      if (consent && consent.analytics === true) {
        // Prevent duplicate initialization
        if (window.gtag) return;

        // Google Analytics 4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', gaId, {
          allow_google_signals: consent.marketing === true,
          allow_ad_personalization: consent.marketing === true,
        });

        // Track page view
        window.gtag('event', 'page_view');
      }
    });

    // Try to get existing consent if user already accepted
    if (window.silktideConsent && window.silktideConsent.analytics === true) {
      window.dispatchEvent(new CustomEvent('silktide-consent-change', {
        detail: window.silktideConsent,
      }));
    }
  </script>
)}

<!-- Fallback: Silktide banner should display even if JS is disabled -->
<noscript>
  <p>This site uses cookies for analytics and GDPR compliance. Please enable JavaScript to see the consent manager.</p>
</noscript>
```

- [ ] **Step 2: Commit Analytics**

```bash
git add src/components/ui/Analytics.astro
git commit -m "components: add Analytics with Silktide consent + GA4

- Load language-specific Silktide consent banner
- Defer GA4 initialization until consent granted
- Listen to Silktide consent change events
- Initialize GA4 only if analytics consent is true
- Respect marketing consent for ad personalization
- Track page views after consent
- Fallback message for noscript

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Summary

✅ **Phase 6 Complete:**
- Navbar with logo, desktop nav, mobile hamburger menu
- Language selector (3 flags) that navigates to same page in other language
- Footer with company info, quick links, contact
- Analytics component with Silktide (multi-language) + GA4 (consent-deferred)

**Next:** Proceed to Phase 7 (SEO and Utility Components)
