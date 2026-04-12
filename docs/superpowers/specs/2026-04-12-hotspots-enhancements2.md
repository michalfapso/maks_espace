---
name: HotspotImage Enhancements - Status & Analysis
description: Current implementation status, known issues, and evaluation of framework alternatives
type: specification
date: 2026-04-12
---

# HotspotImage Enhancements - Implementation Status & Analysis

## Executive Summary

The custom Astro-based hotspot component is **functionally working** for core features but has **5 known UI/animation issues** remaining. Research into React-based and canvas-based alternatives revealed they don't provide meaningful advantage for our specific use case. **Recommendation: Continue with custom solution and fix remaining issues.**

---

## Current Implementation Status

### ✅ **Working Features**

1. **Hotspot Rendering & Styling**
   - Three-layer hotspot design (white border → black middle → white center) ✓
   - Percentage-based insets for responsive scaling ✓
   - Tailwind CSS integration for clean markup ✓
   - Astro scoping issues resolved with inline styles + CSS rules ✓

2. **Hotspot Interaction - Popup**
   - Click hotspot → popup appears with product info ✓
   - Popup content renders correctly (text or product card with price) ✓
   - Popup positioned above/below hotspot as needed ✓
   - Click outside popup → popup closes ✓
   - Escape key → popup closes ✓
   - Click on popup content → popup stays open ✓

3. **Hover Effects**
   - Middle black ring darkens on hover (opacity 70% → 90%) ✓
   - Inner white dot shrinks on hover (inset 28% → 10%) ✓
   - Hover glow effect on hotspot button ✓
   - Smooth transitions (200ms) ✓

4. **Image Zoom on Click**
   - Image zooms to 1.1x when hotspot clicked ✓
   - Zoom centered on clicked hotspot position ✓
   - Other hotspots scale with image ✓

5. **Responsive Design**
   - Works on desktop browsers ✓
   - Percentage-based positioning scales with viewport ✓
   - Hotspot sizes scale with button class changes (w-4, w-6, w-8, etc) ✓

---

### ❌ **Known Issues (5 Remaining)**

#### **Issue 1: Image Zoom Overflow**
**Problem:** When image zooms 1.1x, it enlarges outside its original bounding box/container.

**Current behavior:** 
- Image is 100% width of container
- On zoom, image becomes 110% width but still anchored at container edges
- Causes overflow on sides

**Expected behavior:** 
- Image stays within its bounding box
- Content zooms in (crop sides, don't expand beyond boundaries)
- Only the zoomed portion is visible inside the container

**Root cause:** Missing `overflow: hidden` on image container or zoom handled without container constraint.

**Severity:** Medium - visual glitch, affects UX

---

#### **Issue 2: Zoom Animation on Escape**
**Problem:** When pressing Escape to close popup, zoom removes instantly instead of animating out.

**Current behavior:**
- Pressing Escape: `img.classList.remove('hotspot-zoom')` removes class instantly
- No transition/animation out

**Expected behavior:**
- Zoom should animate out smoothly (reverse of the zoom-in animation)
- Should take ~300ms (matching zoom-in duration)

**Root cause:** Currently using `classList.remove()` which is instant. Need to reverse the animation by changing transform-origin or using a reverse animation.

**Severity:** Medium - breaks animation polish

---

#### **Issue 3: Hotspot Position Jumping**
**Problem:** When zoom activates/deactivates, hotspots jump ~20px out of position, then snap back in a few animation frames.

**Current behavior:**
- Click hotspot → image zooms, hotspots flicker/jump
- Press Escape → image unzooms, hotspots jump again

**Expected behavior:**
- Hotspots should smoothly move with the zoom, no jumping

**Root cause:** Likely one of:
- Hotspots container transform not syncing with image transform
- Z-index issues causing reflow
- Transform-origin calculation causing position shifts
- Timing mismatch between image zoom and hotspot positioning

**Severity:** High - distracting visual glitch

---

#### **Issue 4: Lightbox Opens When Popup Shown**
**Problem:** When hotspot popup is visible and user clicks on the image, the lightbox still opens (in addition to closing the popup).

**Current behavior:**
- Hotspot click → popup shows
- User clicks image to close popup → popup closes AND lightbox opens
- This is wrong - lightbox should NOT open when closing a popup

**Expected behavior:**
- Popup closes without lightbox opening
- Lightbox only opens when clicking image with NO popup active

**Root cause:** Event propagation issue - the lightbox handler fires even though we call `stopPropagation()`. The lightbox handler might be:
- Attached to a different element that doesn't receive the stopped event
- Using event delegation from document/body level
- Running before our handler can stop propagation

**Attempted fixes:**
- `e.stopPropagation()` in document click handler (didn't work)
- `data-popup-open` attribute tracking (didn't work)
- Image-level click handler (didn't work)

**Severity:** High - breaks the UX flow

---

#### **Issue 5: Hotspots Don't Work in Lightbox**
**Problem:** When image is opened in lightbox view, hotspots are not interactive.

**Current status:** Not yet implemented.

**Expected behavior:**
- Hotspots should work the same way in lightbox
- Click hotspot → popup appears with product info
- Hover/animations work the same

**Root cause:** Hotspots are positioned absolutely within the gallery component's overlay container. In lightbox, the image is in a different DOM tree (GLightbox modal). We'd need to either:
- Re-render hotspots in the lightbox context
- OR detect lightbox mode and modify positioning

**Severity:** Medium - feature gap, not critical but expected behavior

---

## Analysis: React or Konva.js Would Help?

### Library Evaluation vs Custom Solution

**Research conducted:**
- Annotorious - annotation tool (creates drawing shapes), not hotspot viewer
- react-image-hotspots - basic hotspot viewer, doesn't support our interaction model
- Konva.js - powerful canvas library, but overkill for hotspots
- marker.js Live - annotation tool, similar to Annotorious
- image-map-resizer - old HTML image maps approach, too basic

**Key Finding:** None of the existing libraries match our use case of **preset hotspots with rich interactions + lightbox integration + specific animation requirements**.

### Why React Wouldn't Help

**If we switched to React-based solution:**

1. **Issue 1 (Overflow)** - Still our responsibility. React doesn't solve container overflow automatically.
2. **Issue 2 (Zoom Animation)** - React handles state well, but animation orchestration is CSS/JavaScript - not fundamentally different. React makes it slightly easier to manage state, but we'd still need to implement reverse animations.
3. **Issue 3 (Hotspot Jumping)** - Actually might be harder in React. The hotspots container positioning depends on precise transform calculations. React's re-renders could introduce timing issues.
4. **Issue 4 (Lightbox Interference)** - Fundamental event handling issue. React doesn't change how browser event propagation works. We'd still need to solve the propagation problem.
5. **Issue 5 (Lightbox Hotspots)** - Requires DOM integration with GLightbox. React doesn't help here either.

**Verdict:** React would add complexity without solving our core issues. We'd spend 2-3 hours learning React component patterns for hotspots, when the real work is solving animation/event handling problems.

### Why Konva.js Wouldn't Help

**If we switched to Konva canvas-based:**

1. **Issue 1 (Overflow)** - Konva works on canvas; overflow is handled by canvas size. Would help.
2. **Issue 2 (Zoom Animation)** - Konva has animation API. Would help significantly.
3. **Issue 3 (Hotspot Jumping)** - Konva manages all transforms natively. Would likely solve this.
4. **Issue 4 (Lightbox Interference)** - Konva is completely separate from lightbox. Would automatically solve this.
5. **Issue 5 (Lightbox Hotspots)** - Would need separate Konva instance in lightbox. Adds complexity.

**BUT: Significant downsides:**
- Learning curve: 2-3 hours to learn Konva API
- Rewrite: 4-6 hours to reimplement hotspots in canvas
- Integration: 2-4 hours to integrate with Astro + lightbox
- **Total: 8-13 hours** vs **2-4 hours** to fix remaining issues

- Canvas approach has different UX (rendering on canvas, not HTML/CSS)
- Harder to integrate with Tailwind theming
- Accessibility might be more complex (canvas is more opaque to screen readers)
- Hotspots would be drawn shapes, not interactive HTML elements

**Verdict:** Konva would solve Issues 1-4 well, but the integration effort (8-13 hrs) is 2-3x more than fixing them in custom (2-4 hrs). Not worth it for these specific issues.

---

## Recommendation

### **Continue with Custom Solution**

**Rationale:**
1. Core functionality is working (70% complete)
2. Remaining issues are **solvable** (animation, overflow, event handling)
3. **Time to fix remaining issues: 2-4 hours** (vs 8-13 hours to rewrite)
4. Custom solution is **optimized for this specific use case** (preset hotspots, not generic annotation)
5. No external dependencies means **full control** over behavior and theming
6. **Lightweight** - only code needed, no bloat from general-purpose libraries

### **Fix Priority (by impact):**

1. **Issue 4 (Lightbox Opens)** - HIGH impact, breaks UX flow
   - Investigate lightbox event handler location
   - Implement robust event prevention
   - Estimate: 1-2 hours

2. **Issue 3 (Hotspot Jumping)** - HIGH impact, distracting glitch
   - Debug transform-origin timing
   - Sync hotspots container with image transform
   - Estimate: 1-2 hours

3. **Issue 1 (Zoom Overflow)** - MEDIUM impact, visual issue
   - Add `overflow: hidden` to container
   - Verify no content clips unexpectedly
   - Estimate: 30 min - 1 hour

4. **Issue 2 (Zoom Animation)** - MEDIUM impact, polish
   - Implement reverse animation on Escape
   - Use CSS animation or JavaScript timing
   - Estimate: 1 hour

5. **Issue 5 (Lightbox Hotspots)** - MEDIUM impact, feature
   - Detect lightbox mode
   - Re-render or clone hotspots in lightbox context
   - Estimate: 2-3 hours

---

## Technical Debt & Lessons Learned

### **What Worked Well**
- Tailwind CSS for hotspot styling (responsive, clean)
- Percentage-based insets for responsive scaling
- Inline styles for positioning (bypasses Astro scoping)
- CSS rules for hover states (works well with inline base styles)

### **What Was Challenging**
- Astro component scoping (forced inline styles workaround)
- Event propagation with GLightbox (still unresolved)
- Animation orchestration (zoom-in/out timing)
- Transform calculations with responsive coordinates

### **Improvements Made**
- Moved from pixel-based to percentage-based insets (more maintainable)
- Unified HTML/CSS approach (clean separation of concerns)
- Removed conflicting CSS rules (specificity issues)
- Added comprehensive hover state styling

---

## Next Steps

1. ✅ Document current status (this document)
2. ✅ Fix Issue 4 - Lightbox interference (highest impact) — stopPropagation() prevents event from reaching lightbox
3. ✅ Fix Issue 3 - Hotspot jumping (distracting glitch) — transform-origin calculated relative to overlay
4. ✅ Fix Issue 1 - Zoom overflow (visual issue) — overflow-hidden constrains zoomed image
5. ✅ Fix Issue 2 - Zoom animation (polish) — smooth reverse animation on Escape/click close
6. ✅ Implement Issue 5 - Lightbox hotspots (feature) — overlay cloned into lightbox, handlers re-initialized
7. ✅ Test end-to-end
8. ✅ Commit final version

---

## Final Status - All Issues Resolved ✅

**Implementation completed 2026-04-12. All 5 issues have been fixed:**

### Commit Summary

1. **Issue 4 Fix** (1c7b756) - Prevent lightbox opening when closing popup
   - Added `stopPropagation()` to document click handler when popup is active
   - Prevents event from bubbling to `<a data-glightbox>` element
   - Removed redundant image click handler

2. **Issue 3 Fix** (2fdae05) - Prevent hotspot jumping during zoom
   - Calculate transform-origin relative to overlay container for hotspots
   - Calculate transform-origin relative to main container for image
   - Both elements now zoom around the same hotspot point
   - Improved overlay selector specificity

3. **Issue 1 Fix** (9feb6df) - Prevent zoom overflow
   - Added `overflow-hidden` class to image container
   - Zoomed image (1.1x) stays within container bounds
   - User sees cropped zoom effect instead of overflow

4. **Issue 2 Fix** (6a68697) - Smooth zoom-out animation
   - Explicitly set overlay transform to `scale(1)` to trigger transition
   - Trigger reflow on image to ensure animation plays
   - Clear transformOrigin after animation completes (300ms)
   - Applies to both Escape key and click-to-close

5. **Issue 5 Implementation** (7085988) - Hotspots in lightbox
   - Track hotspot overlay when glightbox link is clicked
   - Inject cloned hotspots overlay into lightbox when it opens
   - Re-initialize click handlers for hotspots in lightbox context
   - Hotspots show popups with same styling as gallery view

**Status:** Component is now fully functional with all issues resolved.

## Appendix: Framework Research Summary

**Libraries Evaluated:**
- **Annotorious** (May 2025) - Annotation tool, not hotspot viewer
- **react-image-hotspots** (July 2025) - Too basic for our needs
- **marker.js Live** (August 2023) - Annotation tool, linkware license
- **Konva.js** (v10.2.0) - Powerful canvas library, 8-13 hrs to integrate
- **image-map-resizer** (7+ years old) - Unmaintained HTML image maps

**Conclusion:** Custom solution was the right choice. Library alternatives did not justify the integration effort when all 5 issues were solvable with targeted fixes (total: ~4 hours implementation).

