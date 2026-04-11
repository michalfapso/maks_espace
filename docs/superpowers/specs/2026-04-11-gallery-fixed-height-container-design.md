# Gallery Fixed-Height Container Design

**Date:** 2026-04-11
**Status:** Approved

## Problem

In multi-image (and single-image) galleries, the main image area resizes on every thumbnail click because images have varying aspect ratios. This causes the thumbnail strip to jump up and down — poor UX.

## Goal

Fix the main image area to a stable height computed at build time, with empty bars (letterbox or pillarbox) filling the unused space for images that don't match the container's aspect ratio. No cropping allowed.

## Constraints

- All image dimensions (`width`, `height`) are available at build time via Astro `ImageMetadata`
- No cropping — images always display in full
- Container height is capped at 1:1 (square) — portrait images beyond square are pillarboxed rather than making the container arbitrarily tall
- Single-image galleries behave identically to multi-image ones (same fixed container, no thumbnail strip)
- Hotspot dot positions must remain correctly aligned over actual image pixels even when the image doesn't fill the container

---

## Data Model

`ImageItem` gains four new build-time-computed fields:

```typescript
interface ImageItem {
  src: any;
  alt: string;
  hotspots?: Hotspot[];
  lightboxSrc?: string;
  overlayTop: number;    // fraction of container height — top edge of image within container
  overlayLeft: number;   // fraction of container width  — left edge of image within container
  overlayHeight: number; // fraction of container height the image occupies
  overlayWidth: number;  // fraction of container width  the image occupies
}
```

`discoverImages()` returns `{ images: ImageItem[], containerAR: number }` instead of `ImageItem[]`.

---

## Build-Time Computation

At the end of `discoverImages()`, after all `ImageItem` objects are built:

```typescript
const rawMaxHeightRatio = Math.max(...images.map(i => i.src.height / i.src.width));
const maxHeightRatio = Math.min(rawMaxHeightRatio, 1.0); // cap at square
const containerAR = 1 / maxHeightRatio;                  // CSS aspect-ratio value (width/height)

for (const img of images) {
  const imageAR = img.src.width / img.src.height;
  if (imageAR >= containerAR) {
    // wider than container → letterboxed (stripes top & bottom)
    img.overlayWidth  = 1;
    img.overlayHeight = containerAR / imageAR;
    img.overlayLeft   = 0;
    img.overlayTop    = (1 - img.overlayHeight) / 2;
  } else {
    // narrower than container → pillarboxed (stripes on sides)
    img.overlayHeight = 1;
    img.overlayWidth  = imageAR / containerAR;
    img.overlayTop    = 0;
    img.overlayLeft   = (1 - img.overlayWidth) / 2;
  }
}
```

**Container AR rule:**
- All-landscape gallery: `containerAR` = aspect ratio of the least-wide image (tallest relative to its width)
- Gallery with portrait images: `containerAR` = 1.0 (square), portrait images pillarboxed, landscape images letterboxed

---

## Gallery.astro Template

Both single-image and multi-image branches wrap `HotspotImage` in the same structure:

```html
<div class="relative w-full" style={`aspect-ratio: ${containerAR};`}>
  <a href={img.lightboxSrc} class="block w-full h-full" data-glightbox="type: image" style="all: inherit;">
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
```

For the multi-image case, each slot also carries `w-full h-full`:

```html
<div data-image-index={idx} class={`w-full h-full ${idx === 0 ? '' : 'hidden'}`}>
```

The `data-main-images` wrapper keeps `relative w-full` and gains the inline `aspect-ratio` style.

---

## HotspotImage.astro Changes

### Props

```typescript
interface Props {
  image: ImageMetadata;
  alt: string;
  hotspots: Hotspot[];
  overlayTop?: number;    // default 0
  overlayLeft?: number;   // default 0
  overlayHeight?: number; // default 1
  overlayWidth?: number;  // default 1
}
```

Defaults ensure backward-compatible behaviour for any caller that doesn't pass overlay props.

### Outer container

```html
<!-- before -->
<div class="relative w-full inline-block" data-hotspot-image>

<!-- after -->
<div class="relative w-full h-full" data-hotspot-image>
```

### Image element

```html
<!-- before -->
<Image src={image} alt={alt} class="w-full h-auto" loading="lazy" />

<!-- after -->
<Image src={image} alt={alt} class="w-full h-full object-contain" loading="lazy" />
```

### Hotspot dot layer

```html
<!-- before -->
<div class="absolute inset-0">

<!-- after -->
<div
  class="absolute"
  style={`
    top: ${overlayTop * 100}%;
    left: ${overlayLeft * 100}%;
    width: ${overlayWidth * 100}%;
    height: ${overlayHeight * 100}%;
  `}
>
```

The popup container (`data-hotspot-popup`) is unchanged — it positions itself via `offsetLeft`/`offsetTop` of the clicked button, which are already within the hotspot layer bounds.

---

## Behaviour Summary

| Image vs container | Result |
|---|---|
| Image AR = container AR | Fills container exactly, no bars |
| Image AR > container AR (wider) | Letterboxed — thin bars top & bottom |
| Image AR < container AR (narrower) | Pillarboxed — bars on sides |
| Portrait image (h > w) | Container capped at 1:1, image pillarboxed |

---

## Out of Scope

- Changing the thumbnail strip layout or sizing
- Changing the lightbox behaviour
- Any gallery other than the standard `Gallery.astro` component
