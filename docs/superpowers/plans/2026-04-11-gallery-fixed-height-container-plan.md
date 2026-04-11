# Gallery Fixed-Height Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the gallery main image area to a stable height derived from the tallest image's aspect ratio (capped at 1:1), preventing the thumbnail strip from jumping when switching between images.

**Architecture:** Extract pure overlay-computation functions into `src/utils/gallery.ts` and unit-test them with vitest. Feed their output into `Gallery.astro` (fixed `aspect-ratio` container) and `HotspotImage.astro` (hotspot overlay constrained to actual image pixels).

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, vitest

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/utils/gallery.ts` | Pure functions: `computeContainerAR`, `computeOverlay` |
| Create | `src/utils/gallery.test.ts` | Unit tests for the above |
| Create | `vitest.config.ts` | Vitest configuration |
| Modify | `src/components/ui/Gallery.astro` | Compute fractions, fixed-AR container, pass overlay props |
| Modify | `src/components/ui/HotspotImage.astro` | Accept overlay props, `h-full object-contain`, constrained hotspot layer |

---

## Task 1: Add vitest and create gallery utility module

**Files:**
- Create: `vitest.config.ts`
- Create: `src/utils/gallery.ts`
- Create: `src/utils/gallery.test.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

Expected: `package.json` devDependencies gains `"vitest": "^x.x.x"`.

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add test script to `package.json`**

In `package.json`, update the `scripts` block:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run"
},
```

- [ ] **Step 4: Write the failing tests in `src/utils/gallery.test.ts`**

```typescript
// src/utils/gallery.test.ts
import { describe, it, expect } from 'vitest';
import { computeContainerAR, computeOverlay } from './gallery';

describe('computeContainerAR', () => {
  it('returns 1 for an empty array', () => {
    expect(computeContainerAR([])).toBe(1);
  });

  it('returns aspect ratio matching the tallest landscape image', () => {
    // 1_podorys.jpg: 472/677 ≈ 0.6974; 2.jpg: 425/724 ≈ 0.5871
    const result = computeContainerAR([472 / 677, 425 / 724]);
    expect(result).toBeCloseTo(677 / 472, 3); // ≈ 1.4343
  });

  it('caps at 1.0 when max height ratio exceeds square', () => {
    expect(computeContainerAR([0.697, 1.5])).toBeCloseTo(1.0, 3);
  });

  it('returns 1.0 for an all-portrait gallery', () => {
    expect(computeContainerAR([1.2, 1.5, 1.3])).toBeCloseTo(1.0, 3);
  });

  it('returns 1.0 for a single square image', () => {
    expect(computeContainerAR([1.0])).toBeCloseTo(1.0, 3);
  });
});

describe('computeOverlay', () => {
  it('letterboxes a wider image — stripes top and bottom', () => {
    // imageAR=1.704 in containerAR=1.434
    const result = computeOverlay(1.704, 1.434);
    const expectedHeight = 1.434 / 1.704;
    expect(result.overlayWidth).toBeCloseTo(1, 3);
    expect(result.overlayLeft).toBeCloseTo(0, 3);
    expect(result.overlayHeight).toBeCloseTo(expectedHeight, 3);
    expect(result.overlayTop).toBeCloseTo((1 - expectedHeight) / 2, 3);
  });

  it('pillarboxes a narrower image — stripes on sides', () => {
    // portrait imageAR=0.667 in square containerAR=1.0
    const result = computeOverlay(0.667, 1.0);
    const expectedWidth = 0.667 / 1.0;
    expect(result.overlayHeight).toBeCloseTo(1, 3);
    expect(result.overlayTop).toBeCloseTo(0, 3);
    expect(result.overlayWidth).toBeCloseTo(expectedWidth, 3);
    expect(result.overlayLeft).toBeCloseTo((1 - expectedWidth) / 2, 3);
  });

  it('returns full overlay for a perfect-fit image', () => {
    const result = computeOverlay(1.434, 1.434);
    expect(result.overlayTop).toBeCloseTo(0, 3);
    expect(result.overlayLeft).toBeCloseTo(0, 3);
    expect(result.overlayHeight).toBeCloseTo(1, 3);
    expect(result.overlayWidth).toBeCloseTo(1, 3);
  });
});
```

- [ ] **Step 5: Run tests — verify they fail because the module doesn't exist yet**

```bash
npm test
```

Expected: `Error: Cannot find module './gallery'` (or similar import error).

- [ ] **Step 6: Create `src/utils/gallery.ts`**

```typescript
// src/utils/gallery.ts

export interface OverlayFractions {
  overlayTop: number;
  overlayLeft: number;
  overlayHeight: number;
  overlayWidth: number;
}

/**
 * Compute the container aspect ratio (width/height) for a gallery.
 *
 * Takes the array of per-image height/width ratios, picks the maximum
 * (tallest image), caps it at 1.0 (square) so portrait-heavy images
 * don't produce an excessively tall container, then converts to a
 * width/height ratio suitable for the CSS `aspect-ratio` property.
 */
export function computeContainerAR(heightRatios: number[]): number {
  if (heightRatios.length === 0) return 1;
  const rawMax = Math.max(...heightRatios);
  const capped = Math.min(rawMax, 1.0);
  return 1 / capped;
}

/**
 * Compute the overlay position fractions for a single image within a
 * fixed-aspect-ratio container that uses `object-fit: contain`.
 *
 * All values are fractions of the container dimension (0–1).
 * Used to constrain the hotspot dot layer to actual image pixels.
 *
 *   imageAR > containerAR → image wider → letterboxed (bars top & bottom)
 *   imageAR < containerAR → image narrower → pillarboxed (bars on sides)
 *   imageAR = containerAR → perfect fit
 */
export function computeOverlay(imageAR: number, containerAR: number): OverlayFractions {
  if (imageAR >= containerAR) {
    // Wider image: scales to fill container width, height < container height
    const overlayHeight = containerAR / imageAR;
    return {
      overlayWidth: 1,
      overlayHeight,
      overlayLeft: 0,
      overlayTop: (1 - overlayHeight) / 2,
    };
  } else {
    // Narrower image: scales to fill container height, width < container width
    const overlayWidth = imageAR / containerAR;
    return {
      overlayHeight: 1,
      overlayWidth,
      overlayTop: 0,
      overlayLeft: (1 - overlayWidth) / 2,
    };
  }
}
```

- [ ] **Step 7: Run tests — verify they all pass**

```bash
npm test
```

Expected output (all 8 tests passing):
```
✓ src/utils/gallery.test.ts (8)
  ✓ computeContainerAR (5)
  ✓ computeOverlay (3)

Test Files  1 passed (1)
Tests       8 passed (8)
```

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts src/utils/gallery.ts src/utils/gallery.test.ts package.json package-lock.json
git commit -m "feat: add gallery overlay computation utilities with tests"
```

---

## Task 2: Update Gallery.astro

**Files:**
- Modify: `src/components/ui/Gallery.astro`

- [ ] **Step 1: Replace the `ImageItem` interface and add the import**

In `Gallery.astro`, replace the existing `ImageItem` interface and add an import for the new utilities. The frontmatter block currently starts with these imports:

```typescript
import { Image, getImage } from 'astro:assets';
import HotspotImage from './HotspotImage.astro';
import { parse as parseYaml } from 'yaml';
import type { Hotspot } from './HotspotImage.astro';
```

Add the new import after those four lines:

```typescript
import { computeContainerAR, computeOverlay } from '../../utils/gallery';
```

Then replace the entire `ImageItem` interface:

```typescript
interface ImageItem {
  src: any;
  alt: string;
  hotspots?: Hotspot[];
  lightboxSrc?: string;
  overlayTop: number;
  overlayLeft: number;
  overlayHeight: number;
  overlayWidth: number;
}
```

- [ ] **Step 2: Update `discoverImages()` return type and add overlay computation**

Change the function signature from:

```typescript
async function discoverImages(folderPath: string) {
```

to:

```typescript
async function discoverImages(folderPath: string): Promise<{ images: ImageItem[], containerAR: number }> {
```

The existing `return images;` at the end of the function (line 135 in the original) becomes:

```typescript
  // Compute container aspect ratio and per-image overlay fractions
  const heightRatios = images.map(img => img.src.height / img.src.width);
  const containerAR = computeContainerAR(heightRatios);

  const imagesWithOverlay: ImageItem[] = images.map(img => {
    const imageAR = img.src.width / img.src.height;
    return { ...img, ...computeOverlay(imageAR, containerAR) };
  });

  return { images: imagesWithOverlay, containerAR };
```

Note: the existing code already builds a `const images = await Promise.all(...)` array. Keep that code unchanged — just replace the final `return images;` with the block above.

- [ ] **Step 3: Update the call site in the component script**

Replace:

```typescript
let images: ImageItem[] = [];
if (folder) {
  try {
    images = await discoverImages(folder);
  } catch (error) {
    console.error(`Failed to discover images in folder ${folder}:`, error);
  }
}
```

with:

```typescript
let images: ImageItem[] = [];
let containerAR = 1;
if (folder) {
  try {
    ({ images, containerAR } = await discoverImages(folder));
  } catch (error) {
    console.error(`Failed to discover images in folder ${folder}:`, error);
  }
}
```

- [ ] **Step 4: Update the multi-image template**

Replace the entire multi-image branch in the template. The current block is:

```astro
{/* Main Image Container - render all images, show based on selection */}
<div class="relative w-full" data-main-images>
  {images.map((img, idx) => (
    <div data-image-index={idx} class={idx === 0 ? '' : 'hidden'}>
      <a
        href={img.lightboxSrc}
        data-glightbox="type: image"
        class="inline-block w-full text-decoration-none cursor-pointer"
        style="all: inherit;"
      >
        <HotspotImage
          image={img.src}
          alt={img.alt}
          hotspots={img.hotspots || []}
        />
      </a>
    </div>
  ))}
</div>
```

Replace it with:

```astro
{/* Main Image Container - render all images, show based on selection */}
<div class="relative w-full" data-main-images style={`aspect-ratio: ${containerAR};`}>
  {images.map((img, idx) => (
    <div data-image-index={idx} class={`w-full h-full ${idx === 0 ? '' : 'hidden'}`}>
      <a
        href={img.lightboxSrc}
        data-glightbox="type: image"
        style="all: inherit;"
      >
        <HotspotImage
          image={img.src}
          alt={img.alt}
          hotspots={img.hotspots || []}
          overlayTop={img.overlayTop}
          overlayLeft={img.overlayLeft}
          overlayHeight={img.overlayHeight}
          overlayWidth={img.overlayWidth}
        />
      </a>
    </div>
  ))}
</div>
```

- [ ] **Step 5: Update the single-image template**

Replace the current single-image branch:

```astro
{/* Single Image */}
{images[0] && (
  <a
    href={images[0].lightboxSrc}
    data-glightbox="type: image"
    class="inline-block w-full text-decoration-none cursor-pointer"
    style="all: inherit;"
  >
    <HotspotImage
      image={images[0].src}
      alt={images[0].alt}
      hotspots={images[0].hotspots || []}
    />
  </a>
)}
```

with:

```astro
{/* Single Image */}
{images[0] && (
  <div class="relative w-full" style={`aspect-ratio: ${containerAR};`}>
    <a
      href={images[0].lightboxSrc}
      data-glightbox="type: image"
      style="all: inherit;"
    >
      <HotspotImage
        image={images[0].src}
        alt={images[0].alt}
        hotspots={images[0].hotspots || []}
        overlayTop={images[0].overlayTop}
        overlayLeft={images[0].overlayLeft}
        overlayHeight={images[0].overlayHeight}
        overlayWidth={images[0].overlayWidth}
      />
    </a>
  </div>
)}
```

- [ ] **Step 6: Run astro build — verify no TypeScript or template errors**

```bash
npm run build
```

Expected: build completes without errors. Warnings about `img.src` typed as `any` are acceptable.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/Gallery.astro
git commit -m "feat: compute fixed aspect-ratio container and overlay fractions in Gallery"
```

---

## Task 3: Update HotspotImage.astro

**Files:**
- Modify: `src/components/ui/HotspotImage.astro`

- [ ] **Step 1: Add the four new optional props to the interface and destructure them**

Replace the current Props interface and destructuring:

```typescript
interface Props {
  image: ImageMetadata;
  alt: string;
  hotspots: Hotspot[];
}

const { image, alt, hotspots } = Astro.props;
```

with:

```typescript
interface Props {
  image: ImageMetadata;
  alt: string;
  hotspots: Hotspot[];
  overlayTop?: number;
  overlayLeft?: number;
  overlayHeight?: number;
  overlayWidth?: number;
}

const {
  image,
  alt,
  hotspots,
  overlayTop = 0,
  overlayLeft = 0,
  overlayHeight = 1,
  overlayWidth = 1,
} = Astro.props;
```

- [ ] **Step 2: Update the outer container and image element**

Replace:

```html
<div class="relative w-full inline-block" data-hotspot-image>
  <Image src={image} alt={alt} class="w-full h-auto" loading="lazy" />
```

with:

```html
<div class="relative w-full h-full" data-hotspot-image>
  <Image src={image} alt={alt} class="w-full h-full object-contain" loading="lazy" />
```

- [ ] **Step 3: Update the hotspot dot layer**

Replace:

```html
<div class="absolute inset-0">
```

with:

```html
<div
  class="absolute"
  style={`top: ${overlayTop * 100}%; left: ${overlayLeft * 100}%; width: ${overlayWidth * 100}%; height: ${overlayHeight * 100}%;`}
>
```

- [ ] **Step 4: Run astro build — verify no errors**

```bash
npm run build
```

Expected: clean build. The `dist/` output updates.

- [ ] **Step 5: Start dev server and verify visually**

```bash
npm run dev
```

Open a gallery page in a browser. Verify:
1. Clicking through thumbnails — the main image area stays the same height throughout.
2. The thumbnail strip does not jump.
3. Hotspot dots (on `1_podorys` images) appear correctly positioned over the floor plan.
4. Images that are wider than the max-height image show thin letterbox bars at top and bottom.
5. If a portrait image exists in a gallery, it is pillarboxed (bars on sides) within a square container.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/HotspotImage.astro
git commit -m "feat: constrain hotspot overlay to image pixels in fixed-height container"
```
