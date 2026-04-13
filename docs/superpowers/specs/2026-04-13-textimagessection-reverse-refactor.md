---
name: TextImageSection Reverse Property Refactor
description: Add reverse prop to TextImageSection to control column ordering, simplifying ProductSection and improving component reusability
type: spec
date: 2026-04-13
---

# TextImageSection Reverse Property Design Specification

## Overview

Refactor TextImageSection to accept a `reverse` prop for controlling column ordering at medium breakpoints and above. This makes TextImageSection more reusable and generic, allowing ProductSection to pass through the reverse prop directly rather than managing it separately.

## Goals

- Add `reverse` prop to TextImageSection for flexible layout control
- Simplify ProductSection by removing redundant class logic
- Make TextImageSection truly generic and reusable for any text-image layout
- Maintain responsive behavior: mobile-first layout (text always first), with optional reordering at md+

## Component Structure

### TextImageSection (`src/components/ui/TextImageSection.astro`)

A generic layout component that manages responsive text-image layouts with style variants and optional column reordering.

**Props:**
```typescript
interface Props {
  variant: 'bright' | 'dark';  // Controls background and text colors
  reverse?: boolean;            // Flip column order on md+ (text right, image left)
}
```

**Named Slots:**
- `text` — Content for the text column (headings, paragraphs, lists, CTAs, etc.)
- `image` — Content for the image column (Gallery, img tags, etc.)

### Style Variants

**bright variant:**
- Background: `bg-white`
- Text color: `text-wood` (dark text)

**dark variant:**
- Background: `bg-wood`
- Text color: `text-cream` (light text)

### Responsive Behavior

**Mobile (default, < md):**
- Single column layout
- Text always comes first
- Image comes second
- `reverse` prop is ignored

**Medium screens and up (md+):**
- Two-column grid with equal columns
- `gap-12` between columns
- `items-start` alignment
- When `reverse={false}`: Text on left, image on right (default)
- When `reverse={true}`: Text on right (via `md:order-first` on text slot), image on left

**Implementation:**
```astro
<section class={`section-padding ${bgColorClass}`}>
  <div class="container">
    <div class={`grid grid-cols-1 md:grid-cols-2 gap-12 items-start ${textColorClass}`}>
      {/* Text slot - may be reordered on md+ */}
      <slot name="text" class={reverse ? 'md:order-last' : ''} />
      
      {/* Image slot */}
      <slot name="image" />
    </div>
  </div>
</section>
```

## ProductSection Integration

ProductSection continues to wrap TextImageSection but now passes the `reverse` prop directly.

**Updated structure:**
- Accept `reverse?: boolean` prop
- Pass `reverse` to TextImageSection
- Remove class logic from image slot wrapper (now handled by TextImageSection)

**Props (unchanged):**
- `name: string` — Product name
- `size: string` — Product dimensions/capacity
- `price: string` — Product price
- `description: string[]` — List of product features/benefits
- `reverse?: boolean` — Flip column order on md+ screens

## Usage Examples

### Default layout (text left, image right):
```astro
<TextImageSection variant="bright">
  <div slot="text">Content here</div>
  <div slot="image">Image here</div>
</TextImageSection>
```

### Reversed layout (text right, image left):
```astro
<TextImageSection variant="bright" reverse={true}>
  <div slot="text">Content here</div>
  <div slot="image">Image here</div>
</TextImageSection>
```

### Via ProductSection:
```astro
<ProductSection
  name="Product Name"
  size="dimensions"
  price="price"
  description={['feature1', 'feature2']}
  reverse={true}
>
  <Gallery slot="image" folder="/path" />
</ProductSection>
```

## File Changes

**Modify:**
- `src/components/ui/TextImageSection.astro` — Add `reverse` prop and order logic
- `src/components/ui/ProductSection.astro` — Pass `reverse` to TextImageSection, simplify slot markup

**No changes needed:**
- `src/pages/en/index.astro` — Already using TextImageSection correctly
- Language versions (sk, cs) — Already updated in previous batch

## Success Criteria

- [x] TextImageSection accepts `reverse?: boolean` prop
- [x] Mobile behavior unchanged: text always first regardless of reverse
- [x] md+ with reverse=false: text left, image right
- [x] md+ with reverse=true: text right, image left (via md:order-last on text)
- [x] ProductSection passes reverse prop to TextImageSection
- [x] ProductSection removes redundant class logic
- [x] All three ProductSections on index page display correctly with their reverse values
- [x] Interior Inspiration section works (reverse not needed)
- [x] Materials section works (reverse not needed)
- [x] No visual regressions

## Technical Notes

- TextImageSection uses Tailwind's `md:order-last` utility to reorder text slot at md+ breakpoint
- Image slot remains in natural order (order-none by default)
- `reverse` prop is optional and defaults to `false` for backwards compatibility
- Responsive behavior prioritizes mobile UX (text-first) with flexible desktop reordering
