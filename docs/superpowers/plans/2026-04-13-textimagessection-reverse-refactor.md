# TextImageSection Reverse Property Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `reverse` prop to TextImageSection to control column ordering at md+ breakpoints, enabling ProductSection to pass through the prop directly.

**Architecture:** TextImageSection accepts an optional `reverse` prop and applies `md:order-last` to the text slot when reverse=true, pushing text to the right and image to the left at medium breakpoints and above. Mobile layout remains unchanged (text always first).

**Tech Stack:** Astro components, Tailwind CSS responsive utilities

---

## Task 1: Update TextImageSection to Accept Reverse Prop

**Files:**
- Modify: `src/components/ui/TextImageSection.astro`

- [ ] **Step 1: Read current TextImageSection.astro**

Read the file at `src/components/ui/TextImageSection.astro` to understand current structure.

- [ ] **Step 2: Update Props interface to include reverse**

Replace the Props interface:

```astro
interface Props {
  variant: 'bright' | 'dark';
  reverse?: boolean;
}
```

- [ ] **Step 3: Update Astro script to destructure reverse**

Change the destructuring line from:

```astro
const { variant } = Astro.props;
```

To:

```astro
const { variant, reverse = false } = Astro.props;
```

- [ ] **Step 4: Apply ordering class to text slot**

Update the text slot to conditionally apply ordering:

```astro
<slot name="text" class={reverse ? 'md:order-last' : ''} />
```

Replace the existing text slot line:

```astro
<slot name="text" />
```

With the new version above.

- [ ] **Step 5: Verify file structure**

Read the complete file to confirm it looks correct:

```astro
---
// src/components/ui/TextImageSection.astro

interface Props {
  variant: 'bright' | 'dark';
  reverse?: boolean;
}

const { variant, reverse = false } = Astro.props;

const bgColorClass = variant === 'bright' ? 'bg-white' : 'bg-wood';
const textColorClass = variant === 'bright' ? 'text-wood' : 'text-cream';
---

<section class={`section-padding ${bgColorClass}`}>
  <div class="container">
    <div class={`grid grid-cols-1 md:grid-cols-2 gap-12 items-start ${textColorClass}`}>
      {/* Text Slot */}
      <slot name="text" class={reverse ? 'md:order-last' : ''} />

      {/* Image Slot */}
      <slot name="image" />
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit the TextImageSection update**

```bash
git add src/components/ui/TextImageSection.astro
git commit -m "feat: add reverse prop to TextImageSection for column ordering control"
```

---

## Task 2: Update ProductSection to Pass Reverse Prop to TextImageSection

**Files:**
- Modify: `src/components/ui/ProductSection.astro`

- [ ] **Step 1: Read current ProductSection.astro**

Read the file at `src/components/ui/ProductSection.astro` to see current implementation.

- [ ] **Step 2: Simplify the image slot wrapper**

Find this line:

```astro
<div slot="image" class={`${reverse ? 'md:order-first' : ''}`}>
```

Replace it with:

```astro
<div slot="image">
```

- [ ] **Step 3: Add reverse prop to TextImageSection component**

Find this line:

```astro
<TextImageSection variant="bright">
```

Replace it with:

```astro
<TextImageSection variant="bright" reverse={reverse}>
```

- [ ] **Step 4: Verify complete file structure**

The file should now look like this:

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

<TextImageSection variant="bright" reverse={reverse}>
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

  <div slot="image">
    <slot name="image" />
  </div>
</TextImageSection>
```

- [ ] **Step 5: Commit the ProductSection update**

```bash
git add src/components/ui/ProductSection.astro
git commit -m "refactor: ProductSection passes reverse prop to TextImageSection, removes redundant class logic"
```

---

## Task 3: Test Responsive Behavior on Desktop (md+ breakpoint)

**Files:**
- Test: Manual browser verification at desktop viewport

- [ ] **Step 1: Start the development server**

Run: `npm run dev`

Expected: Dev server starts and is accessible at `http://localhost:3000/en/`

- [ ] **Step 2: Open the index page in browser**

Navigate to `http://localhost:3000/en/` and verify layout loads.

- [ ] **Step 3: Verify Hay Office Solo (reverse={true})**

Check the first ProductSection:
- Should display with **image on left**, **text on right**
- Gallery images appear in left column
- Product name, specs, description appear in right column
- Full 2-column layout visible

- [ ] **Step 4: Verify Hay Studio Duo (reverse={false})**

Check the second ProductSection:
- Should display with **text on left**, **image on right**
- Product name, specs, description appear in left column
- Gallery images appear in right column
- Full 2-column layout visible

- [ ] **Step 5: Verify Nature Meeting Cube (reverse={true})**

Check the third ProductSection:
- Should display with **image on left**, **text on right**
- Gallery images appear in left column
- Product name, specs, description appear in right column

- [ ] **Step 6: Verify other sections**

Check Interior Inspiration and Materials sections display correctly:
- Interior Inspiration: dark background, 2-column layout, no reverse (default left-right order)
- Materials: bright background, 2-column layout, no reverse (text on left, image on right)

---

## Task 4: Test Responsive Behavior on Mobile (< md breakpoint)

**Files:**
- Test: Manual browser verification at mobile viewport

- [ ] **Step 1: Resize browser to mobile width**

Resize to approximately 375px width (or use browser dev tools mobile mode) while on `http://localhost:3000/en/`

- [ ] **Step 2: Verify Hay Office Solo on mobile**

Check the first ProductSection:
- Should display in **single column**
- Product text (name, specs, description) appears **first**
- Gallery images appear **below** the text
- `reverse` prop is **ignored** (text always comes first on mobile)
- Content is readable and properly spaced

- [ ] **Step 3: Verify Hay Studio Duo on mobile**

Check the second ProductSection:
- Should display in **single column**
- Product text appears **first**
- Gallery images appear **below** the text
- No reordering on mobile

- [ ] **Step 4: Verify Nature Meeting Cube on mobile**

Check the third ProductSection:
- Should display in **single column**
- Product text appears **first**
- Gallery images appear **below** the text

- [ ] **Step 5: Verify other sections on mobile**

Check Interior Inspiration and Materials sections:
- Interior Inspiration: text appears first, gallery below
- Materials: text appears first, image below
- Both sections single column, readable layout

- [ ] **Step 6: Test intermediate breakpoints**

Resize browser to a few different widths between mobile and desktop (e.g., 600px, 800px, 1024px) and verify:
- Layout transitions smoothly at the md breakpoint
- No layout breaking or overlapping content
- Text and images remain properly aligned

---

## Task 5: Verify and Commit

**Files:**
- Test: All changes verified

- [ ] **Step 1: Stop the dev server**

Press Ctrl+C to stop the development server.

- [ ] **Step 2: Check git status**

Run: `git status`

Expected: All changes should be committed. Working tree should be clean.

- [ ] **Step 3: Review commit history**

Run: `git log --oneline -n 3`

Expected: Last 3 commits should show:
1. "refactor: ProductSection passes reverse prop to TextImageSection..."
2. "feat: add reverse prop to TextImageSection for column ordering control"
3. Previous commits

- [ ] **Step 4: Create verification commit**

```bash
git commit --allow-empty -m "chore: verified TextImageSection reverse prop responsive behavior on desktop and mobile"
```

---

## Summary

This plan:
1. Adds `reverse?: boolean` prop to TextImageSection with `md:order-last` ordering logic
2. Updates ProductSection to pass `reverse` prop directly to TextImageSection
3. Removes redundant class logic from ProductSection image wrapper
4. Verifies responsive behavior at desktop (md+) and mobile (< md) breakpoints
5. Confirms all three ProductSections display with correct column ordering based on reverse prop
6. Confirms other sections (Interior Inspiration, Materials) work correctly

**Result:** TextImageSection is now a fully generic, reusable component that any caller can use to control text-image layout ordering.
