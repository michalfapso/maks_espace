---
name: Materials Page Design
description: Design for new Materials page and Products page teaser section
type: design
date: 2026-04-12
---

# Materials Page & Homepage Section Design

## Overview

Create a new dedicated Materials page (`src/pages/en/materials.astro`) to showcase the bio-based wall system technology. The Products page will feature a brief teaser section in the Materials area with a "read more" link to the full page. Add "Materials" to the top navigation toolbar.

## Goals

- Provide clients and investors with detailed, trustworthy information about the wall system
- Maintain visual engagement through strategic image placement
- Keep the Products page concise while offering depth for interested readers
- Establish a consistent pattern for dedicated content pages

## Design Approach: Visual-Centric Storytelling

Content is structured around visual moments, with illustrational images interspersed throughout to break up text and support understanding. This approach leverages the available images as structural elements rather than decoration.

## Products Page Materials Section (src/pages/en/index.astro)

### Content Structure (Option B: Technical Highlight + Benefits)

**1-2 sentence introduction:**
Introduce the system concept and lead benefit (technical + practical).

Example:
> "A fully bio-based, vapour-open wall system that combines excellent thermal performance (U ≈ 0.24 W/m²K) with healthy indoor climate and natural durability. Built from hemp-lime insulation, straw panels, and charred wood cladding."

**Key benefits (3-4 bullets):**
- Energy efficient – reduces heating and cooling demands
- Healthy and breathable – regulates indoor humidity naturally
- Low-carbon materials – plant and lime-based, not mineral wool
- Long-lasting facade – charred wood withstands weather naturally

**Call-to-action:**
"Read more" link to `/materials`

### Purpose
The Products page teaser should give stakeholders enough information to understand the concept's value while inviting deeper engagement through the dedicated page.

## Dedicated Materials Page (src/pages/en/materials.astro)

### Page Structure: 5 Sections

**Section 1: System Overview**
- Explains what the wall system is
- Describes the philosophical/design approach (bio-based, vapour-open, etc.)
- Invites readers into the topic
- *Visual placement:* Hero image or system concept diagram

**Section 2: Composition & Layers**
- Introduces the layer build-up concept
- Details each layer from interior to exterior:
  - Interior finish (strawboard panel)
  - Insulation (hemp-lime)
  - Timber frame
  - Vapour-permeable membrane
  - Counter battens
  - Ventilated air cavity
  - Exterior façade (charred wood)
- Includes material properties and thermal conductivity where relevant
- *Visual placement:* Cross-section diagram or detailed illustration showing all layers

**Section 3: Thermal Performance**
- Presents U-value and R-value specifications
- Explains what these metrics mean in practical terms
- Describes climate suitability (Central European conditions noted)
- *Visual placement:* Optional—performance comparison chart or clarity diagram

**Section 4: Key Benefits Summary**
- Expands on each benefit with 1-2 sentence explanations:
  - Energy efficiency
  - Healthy and vapour-open construction
  - Low-carbon and natural materials
  - Durable facade
  - Comfortable indoor climate
- *Visual placement:* Icons, infographics, or lifestyle imagery supporting the benefits

**Section 5: Engagement/Next Steps**
- Brief closing statement inviting readers to get in touch
- Directs readers to the contact form already present at the bottom of every page (no new form needed)

### Layout & Visual Integration

- Single-scroll article layout, consistent with existing pages
- Images positioned between sections to provide visual relief and support narrative
- Adequate whitespace around images for readability
- Typography hierarchy should guide readers through sections

## Navigation Update

### Top Toolbar Addition

**Add "Materials" link to main navigation:**
- Position: Alongside existing "Products" and "For Investors" links
- Link destination: `/materials`
- Styling: Consistent with existing navigation items
- Active state: Should highlight when on the Materials page

**Implementation location:**
Modify the shared navigation/header component (exact location TBD during implementation exploration)

## Technical Implementation

### Files to Create
- `src/pages/en/materials.astro` – New dedicated page following the structure above

### Files to Modify
- `src/pages/en/index.astro` – Fill in the existing placeholder Materials section with teaser content and "read more" link (section already exists, content is a placeholder)
- Navigation component (exact location TBD) – Add Materials link to toolbar

### Design Consistency
- Materials page layout should follow the same pattern as existing pages (e.g., `for-investors.astro`)
- Use consistent spacing, typography, and component patterns
- Images are sourced from `src/assets/galleries/materials/`

## Success Criteria

- ✓ Homepage Materials section is concise (2-8 sentences/bullets) and inviting
- ✓ Materials page presents all content from `input_materials.md` in readable, visual format
- ✓ Images are strategically placed to support content flow
- ✓ Navigation toolbar includes functional Materials link
- ✓ Page maintains visual consistency with existing site pages
- ✓ Content is accessible and scannable for both technical and non-technical readers

## Content Source

All materials page content derives from `docs/input_materials.md`, which documents:
- Bio-based wall technology system
- Detailed layer composition and specifications
- Thermal performance metrics
- Key benefits for clients

## Next Steps

1. Write implementation plan (writing-plans skill)
2. Implement materials.astro page
3. Update index.astro Materials section
4. Update navigation component
5. Integrate illustrational images
6. Test navigation and page rendering
