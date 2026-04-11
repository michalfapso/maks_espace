---
name: HotspotImage UX Enhancements
description: Improve hotspot visibility, hover feedback, and popup closing behavior for the HotspotImage component
type: specification
date: 2026-04-11
---

# HotspotImage UX Enhancements

## Overview

This spec covers UX improvements to the `HotspotImage.astro` component to make hotspots more discoverable and improve the popup interaction flow.

## Current State

The `HotspotImage` component currently has:
- Small amber dots (4x4px) with a pulsing border ring
- Click to show popup with product info
- Popup closes on Escape or click outside
- Lightbox integration (GLightbox)

## Issues to Address

1. **Hotspots not visible at first glance** — Amber dots are too subtle on busy product images
2. **Hover pulsing animation doesn't work** — The CSS pulsing animation is not visible
3. **Image zoom on click not implemented** — Spec calls for 1.1x zoom centered on hotspot
4. **Popup closing conflicts with lightbox** — Clicking outside popup to close it can accidentally open the lightbox

## Design Changes

### 1. Hotspot Styling – High Contrast Layered Design

Replace the current amber dot with a three-layer design for maximum visibility:

**Structure (from outside to inside):**
- **Outer ring:** 1px solid white circle
- **Middle ring:** ~10px black circle at 70% opacity
- **Center:** 10px solid white circle

**Why:** The white-black-white sandwich provides maximum contrast against most product photography backgrounds, making hotspots immediately discoverable at first glance.

### 2. Hotspot Hover State

When user hovers over a hotspot:
- **Center white circle:** Shrinks from 10px diameter to 5px diameter
- **Middle black ring:** Opacity increases from 70% to 90%

**Why:** The shrinking center and darkening black ring provide clear visual feedback that the hotspot is interactive, inspired by the IKEA website hotspot design.

### 3. Popup Closing Behavior – Decouple from Lightbox

**Current problem:** Clicking outside a popup to close it can open the lightbox, creating confusion about interaction flow.

**New behavior:**

| State | Action | Result |
|-------|--------|--------|
| **Popup open** | Click anywhere on image | Popup closes, no lightbox opens |
| **Popup open** | Press Escape | Popup closes |
| **No popup open** | Click on image (outside hotspots) | Lightbox opens |
| **No popup open** | Click on hotspot | Popup opens, same hotspot details as before |

This cleanly separates popup interaction from lightbox viewing.

### 4. Bug Fixes

- **Fix hover pulsing:** Ensure CSS animation for hotspot hover is working correctly
- **Image zoom on click:** Implement 1.1x zoom centered on clicked hotspot (as per original spec)

## Implementation Notes

- Hotspot positions use percentage-based coordinates (already responsive)
- All changes are CSS + small JavaScript logic updates
- Popup positioning logic should remain unchanged
- Lightbox integration should work as-is with the new popup closing behavior

## Acceptance Criteria

- [ ] Hotspots visible at first glance with white-black-white design
- [ ] Hover state works: center shrinks (10px → 5px), middle darkens (70% → 90% opacity)
- [ ] Popup closes when clicking image (not opening lightbox)
- [ ] Escape key still closes popup
- [ ] Clicking image when no popup shows lightbox
- [ ] Hotspot hover animation is smooth and responsive
- [ ] No visual regression on existing functionality
- [ ] Works on desktop and mobile (touch)
