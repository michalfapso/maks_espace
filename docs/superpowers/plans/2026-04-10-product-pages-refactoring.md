# Products Page Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the dynamic `src/pages/[lang]/index.astro` products page into three language-specific Astro files, mirroring the pattern used for investor pages.

**Architecture:** Replace the dynamic `[lang]/index.astro` route with three static language-specific files (`sk/index.astro`, `en/index.astro`, `cs/index.astro`), each with embedded content for that language. This simplifies routing and makes language-specific pages easier to maintain independently.

**Tech Stack:** Astro, i18n utilities

---

## File Structure

**Files to create:**
- `src/pages/sk/index.astro` — Slovak products page
- `src/pages/en/index.astro` — English products page
- `src/pages/cs/index.astro` — Czech products page

**Files to delete:**
- `src/pages/[lang]/index.astro` — Dynamic route (no longer needed)

---

### Task 1: Create Slovak Products Page

**Files:**
- Create: `src/pages/sk/index.astro`

- [ ] **Step 1: Create the Slovak products page**

Create `/workspace/src/pages/sk/index.astro` with the Slovak content from the dynamic page:

```astro
---
// src/pages/sk/index.astro
import PageLayout from '@layouts/PageLayout.astro';
import HeroImage from '@components/ui/HeroImage.astro';
import ProductSection from '@components/ui/ProductSection.astro';
import ContactForm from '@components/ui/ContactForm.astro';
import heroImage from '@assets/img/hero.jpg';

const formspreeId = import.meta.env.PUBLIC_FORMSPREE_ID;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

const pageTitle = 'Produktové portfólio HPM É-SPACE';
const products = [
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
  {
    name: 'Hay Studio Duo',
    size: '12–18 m²',
    price: '15–20 tis. €',
    desc: [
      '2 pracovné miesta, panoramatické okná',
      'Lepšia ventilácia a elektrická sústava',
      'Možnosť mini-klimatizácie',
    ],
  },
  {
    name: 'Nature Meeting Cube',
    size: '18–25 m²',
    price: '22–28 tis. €',
    desc: [
      'Priestor pre stretnutia tímov alebo semináre',
      'Výdajná ventilácia a elektrika',
      'Možnosti pre komplexné ventilačné systémy',
    ],
  },
];
---

<PageLayout
  title={pageTitle}
  lang="sk"
  pathname="/sk/"
  seoKeywords={['garden office', 'prefab', 'eco-friendly']}
>
  <HeroImage src={heroImage} alt="Hero image" />

  {/* Product Sections */}
  {products.map((product, idx) => (
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
        {/* Gallery would go here */}
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
  <ContactForm lang="sk" formspreeId={formspreeId} whatsappNumber={whatsappNumber} />
</PageLayout>
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la /workspace/src/pages/sk/index.astro`

Expected output: File exists at that path

---

### Task 2: Create English Products Page

**Files:**
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Create the English products page**

Create `/workspace/src/pages/en/index.astro` with the English content:

```astro
---
// src/pages/en/index.astro
import PageLayout from '@layouts/PageLayout.astro';
import HeroImage from '@components/ui/HeroImage.astro';
import ProductSection from '@components/ui/ProductSection.astro';
import ContactForm from '@components/ui/ContactForm.astro';
import heroImage from '@assets/img/hero.jpg';

const formspreeId = import.meta.env.PUBLIC_FORMSPREE_ID;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

const pageTitle = 'HPM É-SPACE Product Portfolio';
const products = [
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
  {
    name: 'Hay Studio Duo',
    size: '12–18 m²',
    price: '15–20k €',
    desc: [
      '2 workspaces, panoramic windows',
      'Better ventilation and electrical system',
      'Option for mini-AC unit',
    ],
  },
  {
    name: 'Nature Meeting Cube',
    size: '18–25 m²',
    price: '22–28k €',
    desc: [
      'Team meeting or seminar space',
      'Advanced ventilation and electrical',
      'Options for complex ventilation systems',
    ],
  },
];
---

<PageLayout
  title={pageTitle}
  lang="en"
  pathname="/en/"
  seoKeywords={['garden office', 'prefab', 'eco-friendly']}
>
  <HeroImage src={heroImage} alt="Hero image" />

  {/* Product Sections */}
  {products.map((product, idx) => (
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
        {/* Gallery would go here */}
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
  <ContactForm lang="en" formspreeId={formspreeId} whatsappNumber={whatsappNumber} />
</PageLayout>
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la /workspace/src/pages/en/index.astro`

Expected output: File exists at that path

---

### Task 3: Create Czech Products Page

**Files:**
- Create: `src/pages/cs/index.astro`

- [ ] **Step 1: Create the Czech products page**

Create `/workspace/src/pages/cs/index.astro` with the Czech content:

```astro
---
// src/pages/cs/index.astro
import PageLayout from '@layouts/PageLayout.astro';
import HeroImage from '@components/ui/HeroImage.astro';
import ProductSection from '@components/ui/ProductSection.astro';
import ContactForm from '@components/ui/ContactForm.astro';
import heroImage from '@assets/img/hero.jpg';

const formspreeId = import.meta.env.PUBLIC_FORMSPREE_ID;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

const pageTitle = 'HPM É-SPACE Portfolio Produktů';
const products = [
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
  {
    name: 'Hay Studio Duo',
    size: '12–18 m²',
    price: '15–20 tis. €',
    desc: [
      '2 pracovní místa, panoramatická okna',
      'Lepší ventilace a elektrická soustava',
      'Možnost mini-klimatizace',
    ],
  },
  {
    name: 'Nature Meeting Cube',
    size: '18–25 m²',
    price: '22–28 tis. €',
    desc: [
      'Prostor pro schůzky týmu nebo semináře',
      'Pokročilá ventilace a elektrika',
      'Možnosti složitých ventilačních systémů',
    ],
  },
];
---

<PageLayout
  title={pageTitle}
  lang="cs"
  pathname="/cs/"
  seoKeywords={['garden office', 'prefab', 'eco-friendly']}
>
  <HeroImage src={heroImage} alt="Hero image" />

  {/* Product Sections */}
  {products.map((product, idx) => (
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
        {/* Gallery would go here */}
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
  <ContactForm lang="cs" formspreeId={formspreeId} whatsappNumber={whatsappNumber} />
</PageLayout>
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la /workspace/src/pages/cs/index.astro`

Expected output: File exists at that path

---

### Task 4: Delete Dynamic Route File

**Files:**
- Delete: `src/pages/[lang]/index.astro`

- [ ] **Step 1: Verify the dynamic route file exists**

Run: `ls -la /workspace/src/pages/\[lang\]/index.astro`

Expected output: File exists

- [ ] **Step 2: Delete the dynamic route file**

Run: `rm /workspace/src/pages/\[lang\]/index.astro`

- [ ] **Step 3: Verify deletion**

Run: `ls /workspace/src/pages/\[lang\]/ 2>&1 || echo "Directory is empty or deleted"`

Expected output: Directory should be empty or message indicating deletion

---

### Task 5: Verify Routing Works

**Files:**
- No changes to existing files

- [ ] **Step 1: Build the site to verify no routing errors**

Run: `npm run build 2>&1 | head -50`

Expected: Build completes successfully without routing errors

- [ ] **Step 2: Verify routing by checking dist output**

Run: `ls -la /workspace/dist/sk/ /workspace/dist/en/ /workspace/dist/cs/ 2>&1 | grep index.html`

Expected: Each language directory has an `index.html` file

- [ ] **Step 3: Commit changes**

```bash
git add src/pages/sk/index.astro src/pages/en/index.astro src/pages/cs/index.astro
git rm src/pages/\[lang\]/index.astro
git commit -m "refactor: split language-specific product pages from dynamic route

- Create sk/index.astro, en/index.astro, cs/index.astro with embedded language content
- Remove dynamic [lang]/index.astro route
- Maintains same routing structure: /{lang}/ remains the product page entry point"
```
