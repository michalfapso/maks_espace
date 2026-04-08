# HPM É-Space Website Implementation Plans

Complete, phased implementation guide for the HPM É-space garden office marketing website.

## Quick Navigation

**Start here:** Read the spec first to understand requirements.

```
docs/superpowers/specs/2026-04-08-hpm-espace-website-design.md
```

**Then follow the plan phases in order:**

### Phase 1-2: Foundation (Complete ✅)
- **File:** `2026-04-08-hpm-espace-website.md`
- **Tasks:** 1-5 (Astro scaffold + i18n system)
- **Output:** Astro project initialized, translation system ready
- **Status:** Ready to test with `npm run dev`

### Phase 3: Configuration
- **File:** `phase-3-configuration.md`
- **Tasks:** 6-9 (astro.config, tailwind.config, tsconfig, .env)
- **Estimated time:** 30 mins

### Phase 4: Global Styles
- **File:** `phase-4-global-styles.md`
- **Tasks:** 10 (global.css)
- **Estimated time:** 20 mins

### Phase 5: Layouts
- **File:** `phase-5-layouts.md`
- **Tasks:** 11-12 (BaseLayout, PageLayout)
- **Estimated time:** 30 mins

### Phase 6: Layout Components
- **File:** `phase-6-layout-components.md`
- **Tasks:** 13-15 (Navbar, Footer, Analytics)
- **Estimated time:** 1 hour

### Phase 7-9: UI Components
- **File:** `phase-7-8-9-components.md`
- **Tasks:** 16-22 (SEOHead, HeroImage, HotspotImage, Gallery, ContactForm)
- **Estimated time:** 2 hours

### Phase 10-11: Pages & Deployment
- **File:** `phase-10-11-pages-deployment.md`
- **Tasks:** 23-33 (5 pages + deployment setup)
- **Estimated time:** 1.5 hours

---

## How to Use These Plans

### For Agentic Workers (Recommended)

Use **superpowers:subagent-driven-development** to execute each phase:

```bash
# Phase 3 example:
# Dispatch subagent with phase-3-configuration.md
# Run tasks 6-9, get reviewed after completion
# Move to Phase 4
```

**Advantages:**
- Fresh subagent per phase = no context carryover
- Review checkpoints after each phase
- Parallel work if independent phases

### For Sequential Execution

Use **superpowers:executing-plans** within this session:

```bash
# Current session: Execute all phases 1-11 sequentially
# Checkpoint after each major milestone
# Test with `npm run dev` and `npm run build` regularly
```

---

## File Structure of Plans

Each phase document contains:

- **Phase Goal** — What gets built
- **Task N: Component Name** — Discrete work unit
  - **Files:** Which files to create/modify
  - **Step 1, 2, 3...** — Exact code + commands
  - **Commit message** — Git commit template
- **Summary** — What's done, what's next

### Code Completeness

✅ All code is **complete and runnable** — not pseudo-code or placeholders.

✅ All **imports and paths** use the established aliases (`@i18n`, `@components`, etc).

✅ All **commit messages** are ready to copy-paste.

---

## Progress Tracking

As you work through phases:

### After Phase 1-2
```bash
npm run dev
# Expected: Dev server starts on http://localhost:3000
```

### After Phase 5
```bash
# Layouts exist, pages will error (not created yet)
# Expected: See BaseLayout structure in browser
```

### After Phase 10
```bash
npm run build
# Expected: Builds to dist/ with all 7 pages
ls dist/
# index.html, sk/index.html, en/index.html, etc.
```

### After Phase 11
```bash
npm run preview
# Expected: Live preview of production build
# All pages render, styles applied, components functional
```

---

## Key Decisions in These Plans

1. **i18n Simplified:** Only global strings in i18n files. Page-specific content lives in pages.
2. **Silktide Multi-Language:** Downloaded and translated into 3 versions (en/sk/cs).
3. **Static Pages:** Investor pages are 3 separate static files, not dynamic routes.
4. **Gallery Auto-Discovery:** Component ready for `import.meta.glob()` future upgrade.
5. **Component Isolation:** Each component is self-contained; can work independently.

---

## Gotchas & Notes

### Before Starting Any Phase

```bash
# Make sure you're in a clean working state
git status

# Make sure environment variables are set
cat .env.example
# Add your secrets to .env (not committed)
```

### During Phase 3-4

You'll add config files. If you've already initialized Astro differently, adjust accordingly.

### During Phase 6

The Navbar references components that don't exist yet (will be created in Phase 7-8). This is fine—pages won't render until later phases complete.

### During Phase 10-11

Image galleries are placeholders in `ProductSection`. You'll need to manually add images to:
- `src/assets/galleries/1/` (Hay Office Solo)
- `src/assets/galleries/2/` (Hay Studio Duo)
- `src/assets/galleries/3/` (Nature Meeting Cube)
- `src/assets/galleries/interior/` (inspiration)
- `src/assets/galleries/materials/` (materials)

### GitHub Secrets (Phase 11)

Before deploying, add these to GitHub repo settings → Secrets and variables:

```
PUBLIC_SITE_URL=https://your-domain.com
PUBLIC_GA_ID=G-XXXXX
PUBLIC_FORMSPREE_ID=xxxxx
PUBLIC_WHATSAPP_NUMBER=+421XXXXXXXXX
```

---

## Quality Checklist

After completing all phases:

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows all 7 pages rendering
- [ ] All links work (nav, language switcher, footer)
- [ ] Forms submit (Formspree integration)
- [ ] GA4 doesn't fire before Silktide consent
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Lighthouse audit: 90+ on performance, accessibility, SEO
- [ ] `dist/sitemap-index.xml` exists and includes all 7 pages
- [ ] `dist/robots.txt` present
- [ ] GitHub Pages deploying automatically on push to main

---

## Next Steps After Completion

1. **Add real content:** Replace placeholder product descriptions, investor pitch, materials
2. **Add images:** Upload product galleries to `src/assets/galleries/`
3. **Configure Formspree:** Get form submission endpoint, add to secrets
4. **Configure GA4:** Create GA4 property, add ID to secrets
5. **Download Silktide:** Request and translate consent scripts
6. **Test live:** Deploy to GitHub Pages, verify all features work

---

## Total Implementation Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|-----------------|
| 1-2 | 1-5 | 30 mins |
| 3 | 6-9 | 30 mins |
| 4 | 10 | 20 mins |
| 5 | 11-12 | 30 mins |
| 6 | 13-15 | 1 hour |
| 7-9 | 16-22 | 2 hours |
| 10-11 | 23-33 | 1.5 hours |
| **Total** | **33 tasks** | **~6 hours** |

**Actual time depends on:** Familiarity with Astro, type-ahead efficiency, testing overhead.

---

## Support & Debugging

**If you get stuck:**

1. Check the specific phase document — it has exact code
2. Verify file paths match the project structure
3. Check import paths use the configured aliases
4. Run `npm run build` to see full error traces
5. Check git diff to see what changed

**Common issues:**

- `Cannot find module '@components/...'` → Check tsconfig.json aliases
- `Image import failed` → Verify image exists in `src/assets/`
- `Form not submitting` → Check Formspree ID in secrets
- `GA4 fires on page load` → Verify Silktide script loaded first

---

## Maintenance After Launch

### Regular Tasks

- Update product descriptions (in page components)
- Refresh product images (in `src/assets/galleries/`)
- Monitor GA4 for traffic patterns
- Update contact information (in Footer, ContactForm)

### Quarterly

- Check Lighthouse scores
- Review console errors in production
- Audit responsive design on new devices

### Yearly

- Renew domain, SSL certificate
- Review and update materials descriptions
- Consider new product launches

---

**Last Updated:** 2026-04-08  
**Spec Reference:** `docs/superpowers/specs/2026-04-08-hpm-espace-website-design.md`
