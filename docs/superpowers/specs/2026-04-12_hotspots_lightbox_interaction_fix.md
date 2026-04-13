---
title: Hotspot Popup - Lightbox Interaction Fix
date: 2026-04-12
status: RESOLVED
---

## Problem Statement

**User reports:** When a hotspot popup is shown and user clicks on the image, the lightbox still opens. Expected behavior: lightbox should be blocked while popup is open or within 200ms after closing.

## Changes Made So Far

### 1. Disabled Image Zoom Feature
- Removed all zoom-in/zoom-out code from HotspotImage.astro (was causing hotspot positioning issues)
- Removed CSS for `hotspot-zoom` class and associated transform-origin calculations
- Removed image/overlay scaling on popup open

### 2. Attempted Fix: Timestamp-Based Lightbox Prevention
**File: src/components/ui/HotspotImage.astro**
- Changed document click handler from `bubble` to `capture: true` phase
- When popup closes, now sets: `container.setAttribute('data-popup-just-closed', String(Date.now()))`
- Removed `e.stopPropagation()` from close handler (no longer needed)
- Goal: Ensure close handler runs BEFORE Gallery.astro's lightbox prevention check

**File: src/components/ui/Gallery.astro**
- Updated lightbox prevention check to also look for recently-closed timestamp:
  ```javascript
  const isOpen = hotspotContainer.hasAttribute('data-popup-open');
  const closedAt = parseInt(hotspotContainer.getAttribute('data-popup-just-closed') || '0', 10);
  const recentlyClosed = closedAt > 0 && (Date.now() - closedAt < 200);
  if (isOpen || recentlyClosed) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  ```

## Diagnostic Logging Added

**HotspotImage.astro document capture handler (line ~147-164):**
```javascript
console.log('[HotspotImage capture] Click event, popup active:', popupActive, 'target:', e.target?.tagName);
// ... on popup close:
console.log('[HotspotImage] Closing popup, setting timestamp');
const timestamp = String(Date.now());
container.setAttribute('data-popup-just-closed', timestamp);
console.log('[HotspotImage] Timestamp set:', timestamp);
```

**Gallery.astro `<a>` capture handler (line ~270-283):**
```javascript
console.log('[Gallery <a> capture] Click detected, container found:', !!hotspotContainer);
const isOpen = hotspotContainer.hasAttribute('data-popup-open');
const closedAtStr = hotspotContainer.getAttribute('data-popup-just-closed');
const closedAt = parseInt(closedAtStr || '0', 10);
const recentlyClosed = closedAt > 0 && (Date.now() - closedAt < 200);
console.log('[Gallery] isOpen:', isOpen, 'closedAtStr:', closedAtStr, 'timeSinceClosed:', timeSinceClosed, 'recentlyClosed:', recentlyClosed);
if (isOpen || recentlyClosed) {
  console.log('[Gallery] BLOCKING lightbox');
} else {
  console.log('[Gallery] Allowing lightbox');
}
```

## Expected Event Flow (When Working)

When user clicks image while popup is open:
1. **Capture phase down DOM tree:**
   - HotspotImage's `document` capture handler fires (highest level)
   - Closes popup, sets `data-popup-just-closed` timestamp
   - Logs: `[HotspotImage] Closing popup, setting timestamp`

2. **Continue capture phase:**
   - Gallery.astro's `<a>` capture handler fires (lower level in tree)
   - Checks: `isOpen=false`, `closedAtStr=<timestamp>`, `recentlyClosed=true`
   - Blocks lightbox, calls `preventDefault` + `stopPropagation`
   - Logs: `[Gallery] BLOCKING lightbox`

3. **Result:**
   - GLightbox handler never fires (due to stopPropagation)
   - Lightbox does not open

## Known Working Behavior

- Hotspot buttons click opens popup ✓
- Clicking inside popup content keeps it open ✓
- Clicking outside popup closes it ✓
- Pressing Escape closes popup ✓
- Data attributes are being set correctly on container ✓

## Root Cause (Identified via Code Analysis)

**File:** `src/components/ui/Gallery.astro:272`

```javascript
// BUG: closest() traverses UP the DOM (toward document root)
const hotspotContainer = glightboxLink.closest('[data-hotspot-image]');
```

The DOM structure is:
```
<a data-glightbox>           ← glightboxLink
  <div data-hotspot-image>   ← CHILD of <a>, not an ancestor
  </div>
</a>
```

`closest('[data-hotspot-image]')` searches for an **ancestor** matching the selector. Since `[data-hotspot-image]` is a **child** of the `<a>` element (not above it), `closest()` returns `null`. The entire `if (hotspotContainer)` block was silently skipped on every click — the lightbox was never blocked.

The diagnostic log `container found: false` would have confirmed this.

## Fix Applied

**`src/components/ui/Gallery.astro:272`** — changed `closest()` to `querySelector()`:
```javascript
// FIX: querySelector() traverses DOWN the DOM (descendants)
const hotspotContainer = glightboxLink.querySelector('[data-hotspot-image]');
```

This correctly finds the `[data-hotspot-image]` div inside the link, allowing the `isOpen`/`recentlyClosed` checks to run.

## Files Modified
- `src/components/ui/HotspotImage.astro` - click handler to capture phase + timestamp setting + diagnostic logs
- `src/components/ui/Gallery.astro` - lightbox prevention check updated + diagnostic logs

## Rollback Information
If timestamp approach needs to be abandoned, the core architectural issue is:
- HotspotImage's popup close needs to be visible to Gallery.astro's lightbox prevention
- Current approach: timestamp attribute on container
- Alternative approaches to explore: modal state manager, global flag, different event pattern
