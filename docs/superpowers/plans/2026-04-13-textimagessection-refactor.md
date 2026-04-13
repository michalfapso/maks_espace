# TextImageSection Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a generic TextImageSection component with style variants, refactor ProductSection to use it, and update the English index page to use TextImageSection for Interior Inspiration and Materials sections.

**Architecture:** TextImageSection is a layout-only wrapper that handles responsive two-column (mobile single-column) layouts with bright/dark style variants. ProductSection becomes a thin wrapper around TextImageSection, focusing on product-specific content (name, price, description). Both Interior Inspiration and Materials sections on the index page are refactored to use TextImageSection.

**Tech Stack:** Astro components, Tailwind CSS, responsive utilities

---

## Task 1: Create TextImageSection Component

**Files:**
- Create: `src/components/ui/TextImageSection.astro`

- [ ] **Step 1: Create the TextImageSection.astro file with component structure**

Create `/workspace/src/components/ui/TextImageSection.astro` with:

```astro
---
// src/components/ui/TextImageSection.astro

interface Props {
  variant: 'bright' | 'dark';
}

const { variant } = Astro.props;

const variantStyles = {
  bright: 'bg-white text-wood',
  dark: 'bg-wood text-cream'
};

const bgColorClass = variant === 'bright' ? 'bg-white' : 'bg-wood';
const textColorClass = variant === 'bright' ? 'text-wood' : 'text-cream';
---

<section class={`section-padding ${bgColorClass}`}>
  <div class="container">
    <div class={`grid grid-cols-1 md:grid-cols-2 gap-12 items-start ${textColorClass}`}>
      {/* Text Slot */}
      <slot name="text" />

      {/* Image Slot */}
      <slot name="image" />
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la src/components/ui/TextImageSection.astro`

Expected: File exists with proper permissions

- [ ] **Step 3: Commit the new component**

```bash
git add src/components/ui/TextImageSection.astro
git commit -m "feat: create TextImageSection generic layout component with bright/dark variants"
```

---

## Task 2: Refactor ProductSection to Use TextImageSection

**Files:**
- Modify: `src/components/ui/ProductSection.astro`

- [ ] **Step 1: Read the current ProductSection.astro file**

Read the entire file at `src/components/ui/ProductSection.astro` to understand current implementation.

- [ ] **Step 2: Replace ProductSection with new implementation**

Replace the entire content of `src/components/ui/ProductSection.astro` with:

```astro
---
import TextImageSection from './TextImageSection.astro';

interface Props {
  name: string;
  size: string;
  price: string;
  description: string[];
  reverse?: boolean;
}

const { name, size, price, description, reverse = false } = Astro.props;
---

<TextImageSection variant="bright">
  <div slot="text">
    <h2 class="text-3xl font-bold text-wood mb-2">{name}</h2>
    <p class="text-lg text-wood font-semibold mb-4">{size} • {price}</p>

    <ul class="space-y-3 mb-6">
      {description.map(point => (
        <li class="flex gap-3">
          <span class="text-wood text-xl flex-shrink-0">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>

    <slot name="cta" />
  </div>

  <div slot="image" class={`${reverse ? 'md:order-first' : ''}`}>
    <slot name="image" />
  </div>
</TextImageSection>
```

- [ ] **Step 3: Verify the file was modified correctly**

Run: `cat src/components/ui/ProductSection.astro`

Expected: File contains TextImageSection import and new structure with both slots

- [ ] **Step 4: Commit the refactoring**

```bash
git add src/components/ui/ProductSection.astro
git commit -m "refactor: ProductSection now uses TextImageSection with bright variant"
```

---

## Task 3: Update Interior Inspiration Section in en/index.astro

**Files:**
- Modify: `src/pages/en/index.astro:56-64`

- [ ] **Step 1: Read the current Interior Inspiration section**

Read lines 56-64 of `src/pages/en/index.astro` to see current implementation.

- [ ] **Step 2: Add TextImageSection import at top of file**

At line 3 (after existing imports), add:

```astro
import TextImageSection from '@components/ui/TextImageSection.astro';
```

- [ ] **Step 3: Replace Interior Inspiration section**

Replace lines 56-64 (the Interior Inspiration section) with:

```astro
  {/* Interior Inspiration Section */}
  <TextImageSection variant="dark">
    <div slot="text">
      <h2 class="text-4xl font-bold mb-6">Interior Inspiration</h2>
      <p class="text-lg leading-relaxed mb-6">
        Explore how our garden offices can be personalized and furnished to create your ideal workspace.
        From minimalist setups to fully equipped offices, discover inspiration for your next project.
      </p>
    </div>
    <div slot="image">
      <Gallery folder="/assets/galleries/interior" />
    </div>
  </TextImageSection>
```

- [ ] **Step 4: Verify the section renders correctly**

Check that the section appears in the file at the correct location. Run: `sed -n '56,75p' src/pages/en/index.astro`

Expected: TextImageSection component with both text and image slots

- [ ] **Step 5: Commit the Interior Inspiration update**

```bash
git add src/pages/en/index.astro
git commit -m "refactor: Interior Inspiration section uses TextImageSection with dark variant"
```

---

## Task 4: Update Materials Section in en/index.astro

**Files:**
- Modify: `src/pages/en/index.astro:66-99`

- [ ] **Step 1: Read the current Materials section**

Read lines 66-99 of `src/pages/en/index.astro` to see current implementation.

- [ ] **Step 2: Replace Materials section**

Replace lines 66-99 (the Materials section) with:

```astro
  {/* Materials Section */}
  <TextImageSection variant="bright">
    <div slot="text">
      <h2 class="text-4xl md:text-5xl font-bold text-wood mb-6">Materials</h2>
      <p class="text-lg leading-relaxed text-gray-700 mb-6">
        A fully bio-based, vapour-open wall system that combines excellent thermal
        performance (U ≈ 0.24 W/m²K) with healthy indoor climate and natural durability.
        Built from hemp-lime insulation, straw panels, and charred wood cladding.
      </p>

      <ul class="space-y-3 mb-8 text-gray-700">
        <li class="flex items-start">
          <span class="text-amber mr-3">•</span>
          <span>Energy efficient – reduces heating and cooling demands</span>
        </li>
        <li class="flex items-start">
          <span class="text-amber mr-3">•</span>
          <span>Healthy and breathable – regulates indoor humidity naturally</span>
        </li>
        <li class="flex items-start">
          <span class="text-amber mr-3">•</span>
          <span>Low-carbon materials – plant and lime-based, not mineral wool</span>
        </li>
        <li class="flex items-start">
          <span class="text-amber mr-3">•</span>
          <span>Long-lasting facade – charred wood withstands weather naturally</span>
        </li>
      </ul>

      <a href="/en/materials" class="inline-block px-6 py-3 bg-amber text-white font-semibold rounded hover:bg-opacity-90 transition-opacity">
        Read more about our materials
      </a>
    </div>
    <div slot="image">
      <img
        src="/assets/galleries/materials/material.jpg"
        alt="Bio-based wall system cross-section"
        class="w-full rounded-lg"
      />
    </div>
  </TextImageSection>
```

- [ ] **Step 3: Verify the section renders correctly**

Check that the section appears in the file at the correct location. Run: `sed -n '66,120p' src/pages/en/index.astro`

Expected: TextImageSection component with text slot containing heading, description, bullets, and CTA; image slot with materials image

- [ ] **Step 4: Commit the Materials update**

```bash
git add src/pages/en/index.astro
git commit -m "refactor: Materials section uses TextImageSection with bright variant and image"
```

---

## Task 5: Verify Responsive Behavior and Visual Correctness

**Files:**
- Test: All modified files in browser

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

Expected: Dev server starts and is accessible at `http://localhost:3000/en/`

- [ ] **Step 2: Test ProductSection on desktop (md+ breakpoint)**

Navigate to `http://localhost:3000/en/` and verify:
- First ProductSection (Hay Office Solo, reverse=false): Image on left, text on right
- Second ProductSection (Hay Studio Duo, reverse=true): Text on left, image on right
- Third ProductSection (Nature Meeting Cube, reverse=false): Image on left, text on right
- All sections display in 2-column layout with proper spacing

- [ ] **Step 3: Test ProductSection on mobile (< md breakpoint)**

Resize browser to mobile width (~375px) and verify:
- All ProductSections display in single column
- Text content appears above images
- `reverse` prop is ignored (text always comes first)
- Content is readable and properly spaced

- [ ] **Step 4: Test Interior Inspiration section on desktop**

Verify:
- Dark background (bg-wood) with light text
- Text on left, Gallery images on right
- Proper 2-column layout with gap-12 spacing

- [ ] **Step 5: Test Interior Inspiration section on mobile**

Verify:
- Text appears above Gallery images
- Dark background maintained
- Single column layout

- [ ] **Step 6: Test Materials section on desktop**

Verify:
- Bright background (bg-white) with dark text
- Text on left, material image on right
- Image displays properly without overflow
- CTA link is visible and properly styled

- [ ] **Step 7: Test Materials section on mobile**

Verify:
- Text appears above material image
- Bright background maintained
- Image scales properly to full width
- CTA link is accessible

- [ ] **Step 8: Check for visual regressions**

Verify:
- No layout breaking or overlapping content
- Colors match the design (wood/cream/white)
- Spacing is consistent across sections
- Text is readable on all backgrounds

- [ ] **Step 9: Stop the dev server**

Press Ctrl+C to stop the server

- [ ] **Step 10: Commit verification confirmation**

```bash
git commit --allow-empty -m "chore: verified responsive behavior and visual correctness for TextImageSection refactor"
```

---

## Summary

This plan:
1. Creates TextImageSection component with bright/dark style variants
2. Refactors ProductSection to use TextImageSection internally
3. Updates Interior Inspiration section to use TextImageSection with dark variant
4. Updates Materials section to use TextImageSection with bright variant and adds material image
5. Verifies responsive behavior on both desktop and mobile breakpoints

All changes are scoped to the English version (en). Slovak and Czech translations will be updated in a separate batch operation after this is complete and tested.
