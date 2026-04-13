---
name: TextImageSection Refactor
description: Generic text-image layout component with style variants, replacing ProductSection internals and improving code reuse
type: spec
date: 2026-04-13
---

# TextImageSection Refactor Design Specification

## Overview

Refactor the ProductSection component into a more generic TextImageSection component that handles layout and styling for alternating text and image sections. ProductSection will use TextImageSection internally, reducing code duplication and enabling reuse for other text-image layouts on the site (Interior Inspiration, Materials sections).

## Goals

- Eliminate layout duplication across components
- Support bright and dark style variants for section alternation
- Maintain ProductSection's current functionality while simplifying its implementation
- Improve component reusability across the site

## Component Structure

### TextImageSection (`src/components/ui/TextImageSection.astro`)

A generic layout component that manages responsive text-image layouts with built-in styling.

**Props:**
```typescript
interface Props {
  variant: 'bright' | 'dark';  // Controls background and text colors
}
```

**Named Slots:**
- `image` — Content for the image column (Gallery, img tags, etc.)
- `text` — Content for the text column (headings, paragraphs, lists, CTAs, etc.)

### Style Variants

**bright variant:**
- Background: `bg-white` or `bg-cream`
- Text color: `text-wood` (dark text)
- Use case: Light sections with prominent content

**dark variant:**
- Background: `bg-wood`
- Text color: `text-cream` (light text)
- Use case: Dark sections for visual alternation and emphasis

### Responsive Behavior

**Mobile (default):**
- Single column layout
- Text slot always comes first
- Image slot comes second
- Full width with section padding

**Medium screens and up (md+):**
- Two-column grid with equal columns
- `gap-12` between columns
- `items-start` alignment (text and image top-aligned)
- Respects column ordering via CSS when needed

**Structure:**
```html
<section class="section-padding {variant-bg-color}">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Text column (always first on mobile, can be reordered on md+) */}
      <slot name="text" />
      
      {/* Image column (always second on mobile) */}
      <slot name="image" />
    </div>
  </div>
</section>
```

## ProductSection Integration

ProductSection becomes a wrapper around TextImageSection.

**New structure:**
```astro
// ProductSection uses TextImageSection with bright variant
// - Passes product name, size, price, description as content
// - Respects reverse prop for column ordering on md+ only
// - Image slot handled by caller (Gallery components)
```

**Props remain unchanged:**
- `name: string` — Product name
- `size: string` — Product dimensions/capacity
- `price: string` — Product price
- `description: string[]` — List of product features/benefits
- `reverse?: boolean` — Flip column order on md+ screens (text on right, image on left)

**Behavior changes:**
- On mobile: Always shows product info (text) first, then image — `reverse` is ignored
- On md+: `reverse` prop controls column order as before
- Styling moves into TextImageSection — ProductSection no longer handles `bg-white` or padding

## Index Page Migration

### Interior Inspiration Section
**Current:** Dark section with comment placeholder for gallery
**New:** 
- Use TextImageSection with `variant="dark"`
- Text slot: heading "Interior Inspiration" + description text
- Image slot: Gallery component

### Materials Section
**Current:** Light section with text, bullets, and CTA; no image
**New:**
- Use TextImageSection with `variant="bright"`
- Text slot: existing heading, description, bullet list, and CTA link
- Image slot: image from `/assets/galleries/materials/material.jpg`

Both sections maintain their current content and messaging; only the structure changes.

## File Changes

**Create:**
- `src/components/ui/TextImageSection.astro` — New generic component

**Modify:**
- `src/components/ui/ProductSection.astro` — Refactor to use TextImageSection
- `src/pages/en/index.astro` — Replace Interior Inspiration and Materials sections with TextImageSection
- `src/pages/sk/index.astro` — Same changes (Slovak version)
- `src/pages/cs/index.astro` — Same changes (Czech version)

## Success Criteria

- [x] TextImageSection renders correctly with both variants
- [x] Responsive behavior works: text-first on mobile, two-column on md+
- [x] ProductSection uses TextImageSection and maintains all current functionality
- [x] ProductSection's `reverse` prop works only on md+ screens
- [x] Interior Inspiration section displays with Gallery in TextImageSection
- [x] Materials section displays with image in TextImageSection
- [x] All three language versions (en, sk, cs) updated and tested
- [x] No visual regressions in existing layouts

## Technical Notes

- TextImageSection uses Tailwind's responsive utilities: `grid-cols-1 md:grid-cols-2`
- The `reverse` prop in ProductSection will use Tailwind's `md:order-*` utilities, only applied at md+ breakpoints
- Style variants handled via conditional CSS classes in Astro template
- Existing color variables and spacing (gap-12, section-padding, container) reused from design system
