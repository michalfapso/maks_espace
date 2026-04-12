# Materials Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new dedicated Materials page showcasing the bio-based wall system, update the Products page teaser, and add navigation support.

**Architecture:** Create `materials.astro` following the existing page patterns (e.g., `for-investors.astro`). The page is structured as a single-scroll article with 5 sections, each with accompanying imagery. The Products page Materials section is updated with concise teaser content. Navigation component is extended to include the Materials link.

**Tech Stack:** Astro, existing component patterns, image assets from `src/assets/galleries/materials/`

---

## Task 1: Explore Codebase Structure

**Files:**
- Read: `src/pages/en/for-investors.astro` (reference implementation)
- Read: `src/pages/en/index.astro` (to find existing Materials section)
- Explore: Navigation component location

- [ ] **Step 1: Read the for-investors.astro page to understand the pattern**

Run: `cat src/pages/en/for-investors.astro`

Document key patterns:
- Layout structure (header, sections, spacing)
- Component imports and usage
- Image/asset integration
- How sections are organized
- Any reusable components used

- [ ] **Step 2: Check the current Materials section in index.astro**

Run: `grep -A 20 -B 5 "Materials" src/pages/en/index.astro`

Document:
- Current placeholder text (if any)
- Component structure
- Where exactly to insert the new content

- [ ] **Step 3: Locate the navigation component**

Run: `find src -name "*nav*" -o -name "*header*" -o -name "*menu*" | head -20`

Then examine likely candidates to find where "Products" and "For Investors" links are defined.

- [ ] **Step 4: Document findings**

Create a brief summary of:
- Astro page template patterns observed
- Navigation component location
- Image import/display patterns
- Component reuse opportunities

---

## Task 2: Create materials.astro Page Structure

**Files:**
- Create: `src/pages/en/materials.astro`

- [ ] **Step 1: Create the page with basic layout**

Create `src/pages/en/materials.astro`:

```astro
---
import Layout from '../../../components/Layout.astro';
// Import other necessary components based on exploration

const title = "Materials";
const description = "Bio-based wall system technology and specifications";
---

<Layout title={title}>
  <main class="materials-page">
    <!-- Section 1: System Overview -->
    <section id="overview" class="materials-section">
      <h1>Bio-Based Wall System</h1>
      <p>
        A fully bio-based, vapour-open wall construction that combines excellent 
        thermal performance with healthy indoor climate and natural durability.
      </p>
      <!-- Image: Hero image or system concept diagram -->
      <img 
        src="/src/assets/galleries/materials/system-overview.jpg" 
        alt="Bio-based wall system overview"
        class="materials-image"
      />
    </section>

    <!-- Section 2: Composition & Layers -->
    <section id="layers" class="materials-section">
      <h2>Composition & Layer Build-up</h2>
      <p>
        The wall is constructed from multiple layers, each chosen for specific 
        performance characteristics. From inside to outside:
      </p>
      
      <div class="layers-list">
        <div class="layer">
          <h3>Interior Finish – Strawboard Panel (30 mm)</h3>
          <p>
            A rigid board made from compressed straw fibres. It provides a smooth 
            interior surface, adds thermal insulation and acts as a moisture-buffering 
            layer. Typical thermal conductivity: ~0.09 W/m·K.
          </p>
        </div>
        
        <div class="layer">
          <h3>Insulation – Hemp-Lime (160 mm)</h3>
          <p>
            The main insulating layer of cast or sprayed hemp shiv and lime binder. 
            Low thermal conductivity (~0.07 W/m·K) forms a continuous layer around 
            timber studs, reducing thermal bridges. High thermal mass and moisture 
            buffering stabilise indoor temperature and humidity.
          </p>
        </div>
        
        <div class="layer">
          <h3>Timber Frame – Structural Studs (160 mm)</h3>
          <p>
            Standard softwood frame carrying structural loads. Cavities between 
            studs are completely filled with hemp-lime, integrating the structure 
            into the insulation zone.
          </p>
        </div>
        
        <div class="layer">
          <h3>Vapour-Permeable Membrane</h3>
          <p>
            On the cold side of the insulation, this membrane protects the wall 
            from wind and external moisture while allowing water vapour to move 
            through the assembly for drying in both directions.
          </p>
        </div>
        
        <div class="layer">
          <h3>Counter Battens – 25×50 mm</h3>
          <p>
            Timber battens create a ventilated cavity between membrane and outer 
            cladding, allowing moisture evaporation and improving facade durability.
          </p>
        </div>
        
        <div class="layer">
          <h3>Ventilated Air Cavity (25 mm)</h3>
          <p>
            A continuous, ventilated air space drains water and equalises pressure, 
            further protecting the wall from driving rain.
          </p>
        </div>
        
        <div class="layer">
          <h3>Façade Cladding – Charred Wood (20 mm, Shou Sugi Ban)</h3>
          <p>
            External finish of charred wood boards using the traditional Shou Sugi 
            Ban technique. The charred surface provides a deep appearance, improves 
            weather resistance and durability without synthetic coatings. Thermal 
            conductivity: ~0.13–0.15 W/m·K.
          </p>
        </div>
      </div>
      
      <!-- Image: Cross-section diagram or detailed layer illustration -->
      <img 
        src="/src/assets/galleries/materials/layer-cross-section.jpg" 
        alt="Wall system cross-section showing all layers"
        class="materials-image"
      />
    </section>

    <!-- Section 3: Thermal Performance -->
    <section id="performance" class="materials-section">
      <h2>Thermal Performance</h2>
      <p>
        Based on the indicated layer thicknesses and material properties, the wall 
        achieves excellent insulation performance suitable for low-energy buildings.
      </p>
      
      <div class="performance-specs">
        <div class="spec">
          <h3>Thermal Resistance (R-value)</h3>
          <p><strong>R ≈ 4.1 m²K/W</strong></p>
          <p>
            A higher R-value means better insulation. This value indicates excellent 
            thermal resistance compared to standard constructions.
          </p>
        </div>
        
        <div class="spec">
          <h3>Thermal Transmittance (U-value)</h3>
          <p><strong>U ≈ 0.24 W/m²K</strong></p>
          <p>
            A lower U-value means less heat loss through the wall. This very good 
            insulation performance reduces heating and cooling demands significantly, 
            especially under Central European climate conditions.
          </p>
        </div>
      </div>
      
      <!-- Image (optional): Performance comparison or clarity diagram -->
      <img 
        src="/src/assets/galleries/materials/performance-chart.jpg" 
        alt="Thermal performance specifications"
        class="materials-image"
      />
    </section>

    <!-- Section 4: Key Benefits Summary -->
    <section id="benefits" class="materials-section">
      <h2>Key Benefits</h2>
      
      <div class="benefits-list">
        <div class="benefit">
          <h3>Energy Efficient</h3>
          <p>
            With a U-value of approximately 0.24 W/m²K, this wall significantly 
            reduces heating and cooling demands compared to standard constructions, 
            lowering operational energy costs.
          </p>
        </div>
        
        <div class="benefit">
          <h3>Healthy and Vapour-Open</h3>
          <p>
            All main layers—strawboard, hemp-lime, membrane, timber, and charred 
            wood—are vapour-permeable, allowing the wall to naturally regulate indoor 
            humidity and prevent trapped moisture that can cause health issues.
          </p>
        </div>
        
        <div class="benefit">
          <h3>Low-Carbon and Natural</h3>
          <p>
            Plant-based materials (straw, hemp, timber) and lime binder have 
            significantly lower embodied CO₂ than conventional mineral wool and 
            concrete systems, supporting sustainable building goals.
          </p>
        </div>
        
        <div class="benefit">
          <h3>Durable Façade</h3>
          <p>
            The charred wood cladding provides long-lasting weather protection while 
            maintaining a natural, refined appearance without synthetic coatings that 
            require maintenance or replacement.
          </p>
        </div>
        
        <div class="benefit">
          <h3>Comfortable Indoor Climate</h3>
          <p>
            Hemp-lime and strawboard combine insulation with thermal mass and 
            moisture buffering, resulting in stable indoor temperatures, reduced 
            overheating risk, and naturally comfortable humidity levels year-round.
          </p>
        </div>
      </div>
      
      <!-- Image: Icons, infographics, or lifestyle imagery -->
      <img 
        src="/src/assets/galleries/materials/benefits-lifestyle.jpg" 
        alt="Benefits of the bio-based wall system"
        class="materials-image"
      />
    </section>

    <!-- Section 5: Engagement/Next Steps -->
    <section id="next-steps" class="materials-section">
      <h2>Ready to Learn More?</h2>
      <p>
        If you're interested in how this wall system could work for your project, 
        we'd love to discuss it further. Please get in touch using the contact form 
        below.
      </p>
      <!-- Contact form component will be rendered by the Layout at the bottom of the page -->
    </section>
  </main>
</Layout>

<style>
  .materials-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .materials-section {
    margin-bottom: 4rem;
  }

  .materials-section h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .materials-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    margin-top: 2rem;
  }

  .materials-section h3 {
    font-size: 1.25rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .materials-section p {
    line-height: 1.8;
    margin-bottom: 1rem;
    color: #333;
  }

  .materials-image {
    width: 100%;
    max-width: 800px;
    height: auto;
    margin: 2rem 0;
    border-radius: 8px;
    display: block;
  }

  .layers-list,
  .benefits-list {
    margin: 2rem 0;
  }

  .layer,
  .benefit {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .layer:last-child,
  .benefit:last-child {
    border-bottom: none;
  }

  .performance-specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
  }

  .spec {
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-radius: 8px;
  }

  .spec h3 {
    margin-top: 0;
  }

  .spec strong {
    display: block;
    font-size: 1.5rem;
    color: #2c5282;
    margin: 0.75rem 0;
  }

  @media (max-width: 768px) {
    .performance-specs {
      grid-template-columns: 1fr;
    }

    .materials-section h1 {
      font-size: 2rem;
    }

    .materials-section h2 {
      font-size: 1.5rem;
    }
  }
</style>
```

- [ ] **Step 2: Run the dev server and verify the page loads**

Run: `npm run dev` (or your project's dev command)

Navigate to: `http://localhost:3000/materials` (or appropriate port)

Verify:
- Page loads without errors
- All 5 sections are visible
- Layout is readable
- Images display (will show broken links initially, that's expected)

- [ ] **Step 3: Commit the initial page structure**

```bash
git add src/pages/en/materials.astro
git commit -m "feat: create materials page with 5 sections"
```

---

## Task 3: Update Products Page Materials Section

**Files:**
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Locate the Materials section placeholder**

Run: `grep -n -A 15 "Materials" src/pages/en/index.astro | head -30`

Note the exact line numbers where the Materials section begins and ends.

- [ ] **Step 2: Replace placeholder with teaser content**

Update the Materials section in `src/pages/en/index.astro` with:

```astro
<section class="materials-section">
  <h2>Materials</h2>
  <p>
    A fully bio-based, vapour-open wall system that combines excellent thermal 
    performance (U ≈ 0.24 W/m²K) with healthy indoor climate and natural durability. 
    Built from hemp-lime insulation, straw panels, and charred wood cladding.
  </p>
  
  <ul class="benefits-list">
    <li>Energy efficient – reduces heating and cooling demands</li>
    <li>Healthy and breathable – regulates indoor humidity naturally</li>
    <li>Low-carbon materials – plant and lime-based, not mineral wool</li>
    <li>Long-lasting facade – charred wood withstands weather naturally</li>
  </ul>
  
  <a href="/materials" class="read-more-link">Read more about our materials</a>
</section>
```

- [ ] **Step 3: View the updated Products page**

Run dev server if not already running: `npm run dev`

Navigate to: `http://localhost:3000/` (or your Products page URL)

Verify:
- Materials section is displayed correctly
- "Read more" link is visible and clickable
- Link points to `/materials`
- Styling is consistent with other sections

- [ ] **Step 4: Test the link**

Click the "Read more about our materials" link on the Products page.

Verify:
- You're navigated to the Materials page
- Page loads without errors

- [ ] **Step 5: Commit the update**

```bash
git add src/pages/en/index.astro
git commit -m "feat: add Materials section teaser to Products page"
```

---

## Task 4: Add Materials Link to Navigation

**Files:**
- Modify: Navigation component (location from Task 1 exploration)

- [ ] **Step 1: Examine the navigation component structure**

Based on your exploration in Task 1, open the navigation component file and examine:
- How "Products" and "For Investors" links are defined
- The structure and naming patterns
- Where to insert the new Materials link

Run: `cat [navigation-component-path]`

- [ ] **Step 2: Add the Materials link**

In the navigation component (exact location depends on codebase structure), add the Materials link alongside Products and For Investors.

Example (structure may vary):

```astro
<nav class="main-nav">
  <a href="/" class="nav-link">Products</a>
  <a href="/materials" class="nav-link">Materials</a>
  <a href="/for-investors" class="nav-link">For Investors</a>
</nav>
```

Or if using a data structure:

```astro
---
const navLinks = [
  { label: 'Products', href: '/' },
  { label: 'Materials', href: '/materials' },
  { label: 'For Investors', href: '/for-investors' },
];
---
```

Ensure the link text is "Materials" and the href is `/materials`.

- [ ] **Step 3: Test the navigation**

Run dev server: `npm run dev`

Navigate to any page and verify:
- The "Materials" link appears in the top navigation toolbar
- It's positioned appropriately alongside Products and For Investors
- The link is clickable and navigates to `/materials`
- Active state highlighting works (if applicable)

Test from multiple pages (homepage, materials, for-investors) to ensure navigation works everywhere.

- [ ] **Step 4: Commit the navigation update**

```bash
git add [navigation-component-path]
git commit -m "feat: add Materials link to main navigation"
```

---

## Task 5: Verify Image Integration

**Files:**
- Check: `src/assets/galleries/materials/` (pre-existing assets)

- [ ] **Step 1: List available image assets**

Run: `ls -la src/assets/galleries/materials/`

Document the filenames and count. Expected files (based on materials.astro):
- system-overview image
- layer-cross-section image
- performance-chart image
- benefits-lifestyle image

- [ ] **Step 2: Update image paths in materials.astro if needed**

If the actual filenames differ from what's in materials.astro, edit the image src paths.

Open `src/pages/en/materials.astro` and update any image paths:

```astro
<img 
  src="/src/assets/galleries/materials/actual-filename.jpg" 
  alt="description"
  class="materials-image"
/>
```

Use the actual filenames from the assets folder.

- [ ] **Step 3: Verify images load in browser**

Run dev server: `npm run dev`

Navigate to: `http://localhost:3000/materials`

Scroll through the entire Materials page and verify:
- All images load without broken-image icons
- Images are properly sized and positioned
- Image quality is appropriate
- Alt text is visible (hover or inspect)

- [ ] **Step 4: Commit image path corrections (if any)**

If you updated any image paths:

```bash
git add src/pages/en/materials.astro
git commit -m "fix: correct image paths in materials page"
```

If no updates were needed, skip this step.

---

## Task 6: Full Integration Test

**Files:**
- Test: All updated/created files

- [ ] **Step 1: Clear dev server and rebuild**

Stop the dev server (Ctrl+C if running).

Run: `npm run build` (or your project's build command)

Verify: Build completes without errors.

- [ ] **Step 2: Start dev server fresh**

Run: `npm run dev`

Wait for it to be fully ready.

- [ ] **Step 3: Test the complete user flow**

- Navigate to Products page (homepage)
- Verify Materials section is visible with teaser content
- Click "Read more about our materials" link
- Verify you're on the Materials page (`/materials`)
- Scroll through all 5 sections
- Verify all images load
- Verify typography and layout are consistent
- Return to Products page via navigation or back button
- Click Materials link in the top navigation
- Verify it takes you to the Materials page
- Click each nav link to ensure all pages load correctly

- [ ] **Step 4: Check for console errors**

While performing the flow above, open browser DevTools (F12):
- Check the Console tab for any errors or warnings
- Check the Network tab to ensure all resources load (no 404s for images)

Verify: No errors related to the new Materials page or navigation.

- [ ] **Step 5: Mobile responsiveness check**

In DevTools, toggle device toolbar (Ctrl+Shift+M):
- Test on mobile viewport sizes (iPhone, tablet)
- Verify Materials page layout is readable and responsive
- Verify navigation works on mobile

- [ ] **Step 6: Commit final verification**

If everything works:

```bash
git log --oneline -6
```

Verify all 4 previous commits are present:
1. "feat: create materials page with 5 sections"
2. "feat: add Materials section teaser to Products page"
3. "feat: add Materials link to main navigation"
4. (Optional image fixes)

All tasks complete!

---

## Summary of Changes

| File | Action | Summary |
|------|--------|---------|
| `src/pages/en/materials.astro` | Create | New dedicated Materials page with 5 sections, styled for single-scroll article |
| `src/pages/en/index.astro` | Modify | Replace Materials section placeholder with teaser + "read more" link |
| Navigation component | Modify | Add "Materials" link to top navigation toolbar |
| `src/assets/galleries/materials/` | Use | Reference existing image assets (no changes) |

---

## Testing Checklist

- [ ] Materials page loads at `/materials`
- [ ] All 5 sections render correctly with proper typography
- [ ] All images load without 404 errors
- [ ] Products page Materials section displays teaser content
- [ ] "Read more" link navigates to Materials page
- [ ] Materials link in top navigation works
- [ ] Active state highlighting on nav (if applicable)
- [ ] Mobile responsive on small viewports
- [ ] No console errors in DevTools
- [ ] All internal links work correctly
