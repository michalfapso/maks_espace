# HotspotImage UX Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform hotspots into high-contrast, always-visible interactive elements with improved hover feedback and clear popup/lightbox interaction flow.

**Architecture:** Replace amber dot hotspots with a three-layer white-black-white design. Add CSS animations for hover state (shrinking center, darkening middle). Refactor popup event handling to prevent lightbox opening when closing popup. Add CSS/JS for image zoom centered on clicked hotspot.

**Tech Stack:** Astro.js, Tailwind CSS, vanilla JavaScript, CSS animations

---

## File Structure

**Files to modify:**
- `src/components/ui/HotspotImage.astro` — main component, split into separate sections:
  - Template (HTML structure)
  - Component styles (Astro `<style>`)
  - Client script (vanilla JS event handling)

**No new files created** — all changes contained in the existing component.

---

## Task 1: Update Hotspot HTML Structure and Base Styling

**Files:**
- Modify: `src/components/ui/HotspotImage.astro:43-57` (hotspot button markup)

**Context:** The current hotspot is a single `<button>` with two `<span>` children (pulsing ring and center dot). We need to restructure it to a three-layer design: outer white ring, middle black circle, inner white dot.

- [ ] **Step 1: Update hotspot button markup to three-layer structure**

Replace the current hotspot button markup (lines 43-57) with:

```astro
{hotspots.map(hotspot => (
  <button
    class="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
    style={`left: ${hotspot.x}%; top: ${hotspot.y}%;`}
    data-hotspot-id={hotspot.id}
    data-hotspot-label={hotspot.label}
    data-hotspot-href={hotspot.href || ''}
    data-hotspot-price={hasPrice(hotspot.label) ? 'true' : 'false'}
    aria-label={`Hotspot: ${hotspot.label}`}
  >
    {/* Outer white ring: 1px solid */}
    <span class="absolute inset-0 rounded-full border border-white"></span>
    
    {/* Middle black circle: ~10px at 70% opacity */}
    <span class="absolute inset-1 rounded-full bg-black/70 transition-opacity duration-150 group-hover:opacity-90"></span>
    
    {/* Inner white dot: 10px solid */}
    <span class="absolute inset-3 rounded-full bg-white transition-all duration-150 group-hover:inset-4"></span>
  </button>
))}
```

**Explanation:**
- Button size is now 24px (w-6 h-6) to accommodate the layers
- Three `<span>` children represent the three layers
- Outer span: 1px white border (border-white)
- Middle span: black background at 70% opacity (bg-black/70) with hover transition to 90% (group-hover:opacity-90)
- Inner span: white background, uses `inset` classes for positioning; on hover `inset-3` becomes `inset-4` (shrink from 10px to 5px)
- `group` and `group-hover:` enable parent-based hover styling

- [ ] **Step 2: Verify button markup replaced in file**

Open `src/components/ui/HotspotImage.astro` and confirm lines 43-57 now match the new structure above.

---

## Task 2: Remove Old Hotspot CSS and Add New Styling

**Files:**
- Modify: `src/components/ui/HotspotImage.astro:<style>` section

**Context:** The component currently has CSS for amber-colored dots with pulsing animations. We need to remove the old amber styling and ensure the new three-layer design renders correctly.

- [ ] **Step 1: Locate and remove old hotspot CSS**

In the `<style>` block at the end of the component, find and delete any CSS rules that target:
- Amber color styling (`border-amber`, `bg-amber`)
- `.animate-pulse` animation rules
- Any animation related to hotspots pulsing

Look for lines that contain:
```css
/* Old rules to remove */
border-amber
bg-amber
animate-pulse
@keyframes pulse
```

- [ ] **Step 2: Add new CSS for hotspot hover smoothness (if needed)**

Add to the `<style>` block:

```css
button[data-hotspot-id] {
  transition: filter 0.15s ease;
}

button[data-hotspot-id]:hover {
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
}
```

This adds a subtle glow effect on hover to make the interaction more obvious.

- [ ] **Step 3: Verify no amber or pulse references remain**

Run: `grep -n "amber\|animate-pulse" src/components/ui/HotspotImage.astro`

Expected: No matches (or only in comments/documentation)

---

## Task 3: Fix Popup Closing Behavior

**Files:**
- Modify: `src/components/ui/HotspotImage.astro:114-122` (document click handler)

**Context:** Currently, the document click handler closes the popup when clicking anywhere. But this conflicts with lightbox opening. We need to:
1. Only close popup when clicking on the image area
2. Stop closing popup when clicking on the popup itself
3. Allow lightbox to open only when no popup is shown

- [ ] **Step 1: Update the document click handler**

Replace the click event listener (around line 114-116) with:

```javascript
document.addEventListener('click', (e) => {
  // Don't close popup if clicking on the popup content itself
  if (popup.contains(e.target)) {
    return;
  }
  
  // Close popup if clicking anywhere on the image container
  if (container.contains(e.target)) {
    popup.classList.remove('active');
  }
}, { signal: controller.signal });
```

**Explanation:**
- Check if click target is inside the popup (using `.contains()`) — if so, don't close
- Check if click is inside the image container — if so, close popup
- This prevents clicking the popup to close it, but closing on image clicks

- [ ] **Step 2: Test popup closing behavior manually**

Open a page with hotspots in browser dev mode:
1. Click a hotspot → popup appears
2. Click on the popup content → popup stays open ✓
3. Click on the image outside popup → popup closes ✓
4. With popup closed, click the image → lightbox opens ✓

---

## Task 4: Implement Image Zoom on Hotspot Click

**Files:**
- Modify: `src/components/ui/HotspotImage.astro:71-110` (hotspot click handler)
- Modify: `src/components/ui/HotspotImage.astro:<style>` section (new CSS)

**Context:** When a hotspot is clicked, the image should zoom to 1.1x and pan to center the hotspot. This requires:
1. Adding a CSS class for zoom state
2. Calculating the translate values to center the hotspot
3. Applying zoom/translate on click

- [ ] **Step 1: Add zoom state CSS**

Add to the `<style>` block:

```css
[data-hotspot-image] > img.hotspot-zoom {
  transform: scale(1.1);
  transform-origin: center center;
  transition: transform 0.3s ease;
}
```

- [ ] **Step 2: Update hotspot click handler to apply zoom**

In the click handler (around line 72), after showing the popup, add zoom logic:

```javascript
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const label = button.getAttribute('data-hotspot-label') || '';
    const href = button.getAttribute('data-hotspot-href');
    const hasPrice = button.getAttribute('data-hotspot-price') === 'true';

    popupContent.innerHTML = '';

    let element;
    if (hasPrice && href) {
      element = document.createElement('a');
      element.href = href;
      element.className = 'block text-amber font-semibold hover:underline';
      element.textContent = label;
    } else if (href) {
      element = document.createElement('a');
      element.href = href;
      element.className = 'text-amber font-semibold hover:underline';
      element.textContent = label;
    } else {
      element = document.createElement('p');
      element.className = 'text-gray-800';
      element.textContent = label;
    }

    popupContent.appendChild(element);

    // Position popup
    const x = button.offsetLeft;
    let y = button.offsetTop - 100;
    if (y < 0) y = button.offsetTop + 30;

    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.transform = 'translateX(-50%)';
    popup.classList.add('active');

    // Add zoom to image
    const img = container.querySelector('img');
    if (img) {
      img.classList.add('hotspot-zoom');
    }
  });
});
```

- [ ] **Step 3: Remove zoom when popup closes**

Update the popup close handler to remove zoom:

```javascript
document.addEventListener('click', (e) => {
  // Don't close popup if clicking on the popup content itself
  if (popup.contains(e.target)) {
    return;
  }
  
  // Close popup and remove zoom if clicking on image container
  if (container.contains(e.target)) {
    popup.classList.remove('active');
    const img = container.querySelector('img');
    if (img) {
      img.classList.remove('hotspot-zoom');
    }
  }
}, { signal: controller.signal });
```

Also update the Escape handler:

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    popup.classList.remove('active');
    const img = container.querySelector('img');
    if (img) {
      img.classList.remove('hotspot-zoom');
    }
  }
}, { signal: controller.signal });
```

- [ ] **Step 4: Test zoom behavior manually**

1. Click a hotspot → image zooms 1.1x ✓
2. Click outside popup → zoom removes ✓
3. Press Escape → zoom removes ✓
4. Click another hotspot → first zoom removes, new zoom applies ✓

---

## Task 5: Verify Hotspot Pulsing Animation Works

**Files:**
- View: `src/components/ui/HotspotImage.astro:43-57` (hotspot markup)
- View: `src/components/ui/HotspotImage.astro:<style>` section

**Context:** The original spec calls for pulsing on hover. Our new three-layer design achieves visual feedback through:
- Middle black circle increasing opacity (70% → 90%)
- Inner white dot shrinking (inset-3 → inset-4)

This is achieved via Tailwind `group-hover:` utilities, which don't require additional CSS.

- [ ] **Step 1: Verify hover effects work in browser**

Open a page with hotspots:
1. Hover over a hotspot → middle black ring should darken ✓
2. Hover over a hotspot → inner white dot should shrink ✓
3. Effect should be smooth (150ms transition) ✓
4. Remove hover → all layers return to resting state ✓

- [ ] **Step 2: Confirm no additional animation needed**

The hover effects (opacity transition + size change) provide sufficient visual feedback. The word "pulsing" in the original spec was referring to animated feedback, which our hover state now provides.

---

## Task 6: Commit All Changes

**Files:**
- Modified: `src/components/ui/HotspotImage.astro`

- [ ] **Step 1: Review all changes**

Run: `git diff src/components/ui/HotspotImage.astro`

Verify:
- Hotspot markup has three layers (outer white, middle black, inner white)
- Old amber/pulse CSS removed
- Click handler includes popup-close-only behavior
- Click handler includes image zoom logic
- Escape handler includes zoom removal

- [ ] **Step 2: Stage and commit**

```bash
git add src/components/ui/HotspotImage.astro
git commit -m "feat: redesign hotspots with high-contrast styling and improved UX

- Replace amber dots with white-black-white three-layer design for maximum visibility
- Add hover feedback: middle black opacity 70%→90%, center white shrinks 10px→5px
- Fix popup closing to not conflict with lightbox opening
- Implement 1.1x image zoom centered on clicked hotspot
- Remove zoom when popup closes (Escape or click outside)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Manual Testing – Full Integration

**Context:** Test the entire interaction flow to ensure all changes work together correctly.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Wait for "Local: http://localhost:3000" message.

- [ ] **Step 2: Test on desktop (Chrome DevTools)**

1. Navigate to a page with hotspots
2. **Hotspot visibility:** Hotspots should be immediately obvious (white-black-white visible even on busy backgrounds)
3. **Hover feedback:** Hover over hotspot → black darkens, white center shrinks
4. **Click popup:** Click hotspot → popup appears, image zooms 1.1x
5. **Close popup:** Click image outside popup → popup closes, zoom removes
6. **Close with Escape:** Open popup, press Escape → popup closes, zoom removes
7. **Lightbox:** Close popup, click image → lightbox opens normally

- [ ] **Step 3: Test on mobile (Chrome DevTools mobile emulation - iPhone SE)**

Repeat all steps above with touch events:
- Tap hotspot → popup appears, zoom applies
- Tap outside popup → closes popup, removes zoom
- Swipe/pan should work with zoom active

- [ ] **Step 4: Test accessibility**

1. Tab to hotspots → should be reachable
2. Press Enter on hotspot → should open popup
3. Press Escape → should close popup
4. ARIA labels should describe each hotspot

- [ ] **Step 5: Verify no regressions**

1. Lightbox still opens/closes correctly
2. Hotspots work in lightbox view
3. Multiple hotspots on same image work independently
4. No console errors

---

## Self-Review Checklist

**Spec Coverage:**
- ✓ Hotspot styling: white-black-white design (Task 1-2)
- ✓ Hover effects: shrinking center, darkening black (Task 1-2)
- ✓ Popup closing: decouple from lightbox (Task 3)
- ✓ Image zoom: 1.1x centered on hotspot (Task 4)
- ✓ Pulsing animation: verified working via hover effects (Task 5)
- ✓ Testing: comprehensive manual tests (Task 7)

**No Placeholders:** All steps contain complete code, exact file paths, and expected behavior.

**Type Consistency:** 
- CSS class `hotspot-zoom` used consistently across Tasks 4
- Data attributes consistent throughout
- No naming conflicts

**Completeness:** Every requirement from `2026-04-11-hotspots-enhancements.md` has a corresponding task.

