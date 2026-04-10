# Gallery Auto-Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement auto-discovery of JPG images and optional YAML hotspot metadata in the Gallery.astro component at build time.

**Architecture:** Gallery component will use `import.meta.glob()` during build time to discover images and their YAML sidecars, parse metadata, generate alt text from filenames, sort numerically, and inject processed data into the component.

**Tech Stack:** Astro, TypeScript, `yaml` package, `import.meta.glob()` for static asset discovery

---

## File Changes Overview

- **Modify:** `src/components/ui/Gallery.astro` - implement image discovery, YAML parsing, alt text generation, sorting, and hotspot ID generation
- **Create:** `src/assets/galleries/interior/` example folder structure for testing (if needed)
- **Add:** Sample `.yaml` files alongside existing `.jpg` files for testing hotspots

---

### Task 1: Install yaml dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install yaml package**

Run:
```bash
npm install yaml
```

Expected: Package installs successfully, `yaml` added to `package.json` dependencies

- [ ] **Step 2: Verify installation**

Run:
```bash
npm list yaml
```

Expected: Output shows `yaml@X.X.X` installed

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add yaml dependency for Gallery hotspot parsing"
```

---

### Task 2: Implement helper function for alt text generation

**Files:**
- Modify: `src/components/ui/Gallery.astro` (front-matter section)

- [ ] **Step 1: Add alt text generation function**

In the front-matter of `src/components/ui/Gallery.astro`, add this function before the props destructuring:

```typescript
/**
 * Generate alt text from filename by stripping numeric prefix and separators
 * Examples:
 *   "1_podorys.jpg" → "podorys"
 *   "3-bedroom-view.jpg" → "bedroom view"
 *   "image.jpg" → "image"
 */
function generateAltText(filename: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Strip leading digits and separators (_, -, space)
  const withoutPrefix = nameWithoutExt.replace(/^\d+[\s_-]+/, '');
  
  // Replace remaining underscores and hyphens with spaces
  const altText = withoutPrefix.replace(/[_-]+/g, ' ');
  
  return altText;
}
```

- [ ] **Step 2: Test the function with examples**

Add this test code temporarily in the front-matter to verify:

```typescript
// Test alt text generation
console.assert(generateAltText('1_podorys.jpg') === 'podorys', 'Test 1 failed');
console.assert(generateAltText('3-bedroom-view.jpg') === 'bedroom view', 'Test 2 failed');
console.assert(generateAltText('image.jpg') === 'image', 'Test 3 failed');
console.assert(generateAltText('2_materials-overview.jpg') === 'materials overview', 'Test 4 failed');
console.log('All alt text generation tests passed!');
```

Run the dev server and check console:
```bash
npm run dev
```

Expected: Console shows "All alt text generation tests passed!"

- [ ] **Step 3: Remove test code**

Delete the test assertion block from the component

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Gallery.astro
git commit -m "feat: add alt text generation function for auto-discovery"
```

---

### Task 3: Implement numeric sorting function

**Files:**
- Modify: `src/components/ui/Gallery.astro` (front-matter section)

- [ ] **Step 1: Add numeric sort function**

Add this function in the front-matter, after the `generateAltText` function:

```typescript
/**
 * Sort filenames using natural numeric order
 * Examples:
 *   ["10_image.jpg", "2_image.jpg", "1_image.jpg"] → ["1_image.jpg", "2_image.jpg", "10_image.jpg"]
 */
function sortFilenamesNumerically(filenames: string[]): string[] {
  return [...filenames].sort((a, b) => 
    a.localeCompare(b, 'en', { numeric: true })
  );
}
```

- [ ] **Step 2: Test the sorting function**

Add test code in the front-matter:

```typescript
// Test numeric sorting
const testFiles = ['10_image.jpg', '2_image.jpg', '1_image.jpg', '20_image.jpg'];
const sorted = sortFilenamesNumerically(testFiles);
const expected = ['1_image.jpg', '2_image.jpg', '10_image.jpg', '20_image.jpg'];
console.assert(JSON.stringify(sorted) === JSON.stringify(expected), 'Sorting test failed');
console.log('Numeric sorting test passed!');
```

Run dev server and verify console output

- [ ] **Step 3: Remove test code**

Delete the sorting test block

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Gallery.astro
git commit -m "feat: add numeric filename sorting for Gallery images"
```

---

### Task 4: Implement hotspot ID generation function

**Files:**
- Modify: `src/components/ui/Gallery.astro` (front-matter section)

- [ ] **Step 1: Add hotspot ID generation function**

Add this function after the sorting function:

```typescript
/**
 * Generate unique hotspot IDs
 * Example: generateHotspotId("podorys", 0) → "hotspot-podorys-0"
 */
function generateHotspotId(imageName: string, index: number): string {
  return `hotspot-${imageName}-${index}`;
}
```

- [ ] **Step 2: Test the function**

Add test code:

```typescript
// Test hotspot ID generation
const id1 = generateHotspotId('podorys', 0);
const id2 = generateHotspotId('interior', 2);
console.assert(id1 === 'hotspot-podorys-0', 'ID generation test 1 failed');
console.assert(id2 === 'hotspot-interior-2', 'ID generation test 2 failed');
console.log('Hotspot ID generation tests passed!');
```

Verify console output

- [ ] **Step 3: Remove test code**

Delete the ID generation test block

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Gallery.astro
git commit -m "feat: add hotspot ID generation utility"
```

---

### Task 5: Implement image discovery logic using import.meta.glob()

**Files:**
- Modify: `src/components/ui/Gallery.astro` (front-matter section)

- [ ] **Step 1: Add import for yaml parsing and Hotspot type**

Add these imports at the very top of the front-matter:

```typescript
import { parse as parseYaml } from 'yaml';
import type { Hotspot } from './HotspotImage.astro';
```

- [ ] **Step 2: Add image discovery function**

Add this function after the helper functions, before destructuring Astro.props:

```typescript
/**
 * Discover and load images from a folder using import.meta.glob()
 * Returns array of ImageItem objects ready for rendering
 */
async function discoverImages(folderPath: string) {
  // Resolve absolute path for glob pattern
  // Example: "src/assets/galleries/1" → glob pattern for that folder
  const imagePath = folderPath.replace(/^src\//, '');
  const globPattern = `../../assets/${imagePath}/*.jpg`;
  
  // Discover JPG files
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    '../../assets/galleries/**/*.jpg',
    { eager: true }
  );
  
  // Discover YAML files for hotspots
  const yamlModules = import.meta.glob<string>(
    '../../assets/galleries/**/*.yaml',
    { eager: true, as: 'raw' }
  );
  
  // Filter images and YAML to matching folder
  const folderName = folderPath.split('/').pop() || '';
  const folderPattern = `../assets/galleries/${folderName}/`;
  
  const matchingImages = Object.entries(imageModules)
    .filter(([path]) => path.includes(folderName))
    .map(([path, module]) => ({
      path,
      filename: path.split('/').pop() || '',
      src: module.default
    }));
  
  // Create map of YAML data by image filename (without extension)
  const yamlDataMap: Record<string, any> = {};
  Object.entries(yamlModules)
    .filter(([path]) => path.includes(folderName))
    .forEach(([path, content]) => {
      try {
        const yamlFilename = path.split('/').pop() || '';
        const imageFilename = yamlFilename.replace(/\.yaml$/, '');
        yamlDataMap[imageFilename] = parseYaml(content);
      } catch (error) {
        console.warn(`Failed to parse YAML at ${path}:`, error);
      }
    });
  
  // Sort images numerically
  const sortedImages = sortFilenamesNumerically(
    matchingImages.map(img => img.filename)
  ).map(filename => matchingImages.find(img => img.filename === filename)!);
  
  // Build ImageItem array with hotspots
  const images = sortedImages.map((img, index) => {
    const imageName = img.filename.replace(/\.[^/.]+$/, '');
    const yamlData = yamlDataMap[imageName];
    
    let hotspots: Hotspot[] = [];
    if (yamlData?.hotspots && Array.isArray(yamlData.hotspots)) {
      hotspots = yamlData.hotspots.map((hotspot: any, idx: number) => ({
        id: generateHotspotId(imageName, idx),
        label: hotspot.label || '',
        x: hotspot.x || 0,
        y: hotspot.y || 0,
        href: hotspot.href
      }));
    }
    
    return {
      src: img.src,
      alt: generateAltText(img.filename),
      hotspots: hotspots.length > 0 ? hotspots : undefined
    };
  });
  
  return images;
}
```

- [ ] **Step 2: Call discovery function and handle errors**

Replace the current empty images array initialization with:

```typescript
const { folder } = Astro.props;

let images: ImageItem[] = [];
if (folder) {
  try {
    images = await discoverImages(folder);
  } catch (error) {
    console.error(`Failed to discover images in folder ${folder}:`, error);
  }
}
```

- [ ] **Step 3: Verify imports are correct**

Check that the top of the file has all necessary imports:

```typescript
import { Image } from 'astro:assets';
import HotspotImage from './HotspotImage.astro';
import { parse as parseYaml } from 'yaml';
import type { Hotspot } from './HotspotImage.astro';
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Gallery.astro
git commit -m "feat: implement image discovery with import.meta.glob() and YAML parsing"
```

---

### Task 6: Test with sample YAML hotspot files

**Files:**
- Create: Sample YAML files in existing gallery folders

- [ ] **Step 1: Create sample YAML for gallery 1**

Create `src/assets/galleries/1/1_podorys.yaml`:

```yaml
hotspots:
  - label: "Kitchen Area"
    x: 25
    y: 30
    href: "/products/kitchen-setup"
  - label: "€12,000"
    x: 75
    y: 60
    href: "/pricing"
```

- [ ] **Step 2: Test component with sample data**

Edit a page to use the Gallery component (e.g., `src/pages/cs/index.astro`):

```astro
import Gallery from '@components/ui/Gallery.astro';

<!-- In the Interior Inspiration section, replace the placeholder comment with: -->
<Gallery folder="src/assets/galleries/1" />
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Navigate to the page and verify:
- Images from gallery/1 are discovered and displayed
- Alt text is generated correctly (should show "podorys" not "1 podorys")
- Hotspots appear on the image
- Clicking hotspots shows the label and href

- [ ] **Step 4: Test multiple galleries**

Create `src/assets/galleries/2/2_interior.yaml`:

```yaml
hotspots:
  - label: "Bedroom"
    x: 50
    y: 40
```

Test with:
```astro
<Gallery folder="src/assets/galleries/2" />
```

Verify different gallery shows different images and hotspots.

- [ ] **Step 5: Test edge cases**

Create a test gallery with no YAML files to verify images still display without hotspots:
```astro
<Gallery folder="src/assets/galleries/3" />
```

- [ ] **Step 6: Remove test Gallery component usage from pages**

Revert the changes to `src/pages/cs/index.astro` and other pages (restore to original state without Gallery usage)

- [ ] **Step 7: Commit sample YAML files**

```bash
git add src/assets/galleries/1/1_podorys.yaml src/assets/galleries/2/2_interior.yaml
git commit -m "test: add sample YAML hotspot files for Gallery testing"
```

---

### Task 7: Handle empty folder and missing images gracefully

**Files:**
- Modify: `src/components/ui/Gallery.astro`

- [ ] **Step 1: Verify empty state handling**

Current code already handles this - the component checks `isEmpty = !currentImage` and renders an empty message. This happens automatically when `images` array is empty.

Run dev server and test with a non-existent folder to verify console error is logged but page doesn't crash:

```astro
<Gallery folder="src/assets/galleries/nonexistent" />
```

Expected: Error logged in console, empty gallery message shown

- [ ] **Step 2: Verify the prop is required (TypeScript)**

The interface already specifies `folder: string` which is required. TypeScript will catch missing props at build time.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Gallery.astro
git commit -m "test: verify error handling and empty states work correctly"
```

---

### Task 8: Final code review and cleanup

**Files:**
- Review: `src/components/ui/Gallery.astro`

- [ ] **Step 1: Review complete component**

Open `src/components/ui/Gallery.astro` and verify:
- All helper functions are present and correct
- Image discovery logic uses proper glob pattern
- Alt text generation strips numeric prefixes
- Numeric sorting is applied
- Hotspot IDs are generated
- Error handling logs warnings but doesn't crash
- All imports are correct
- TypeScript types are accurate

- [ ] **Step 2: Remove any console.assert or console.log test code**

Search for any remaining test/debug code:
```bash
grep -n "console\." src/components/ui/Gallery.astro
```

Expected: No output (no console statements remain)

- [ ] **Step 3: Build for production**

```bash
npm run build
```

Expected: Build completes successfully with no errors

- [ ] **Step 4: Final commit summary**

If any cleanup was needed:

```bash
git add src/components/ui/Gallery.astro
git commit -m "refactor: clean up Gallery component implementation"
```

---

## Self-Review Checklist

✅ **Spec Coverage:**
- [x] Auto-discover JPG images from folder using `import.meta.glob()` - Task 5
- [x] Generate alt text by stripping numeric prefixes - Task 2
- [x] Auto-discover YAML sidecar files - Task 5
- [x] Parse YAML for hotspot metadata - Task 5
- [x] Support `href` in hotspots - Task 5 (YAML parsing includes href)
- [x] Sort images numerically - Task 3
- [x] Generate unique hotspot IDs - Task 4
- [x] Error handling - Task 7
- [x] Build-time processing (no runtime overhead) - Task 5 (uses eager glob)

✅ **No Placeholders:**
- All helper functions have complete implementations
- All test steps show exact code and expected output
- No "TBD", "TODO", or "handle edge cases" statements
- All commit messages are specific and meaningful

✅ **Type Consistency:**
- `Hotspot` type imported from `HotspotImage.astro`
- `ImageItem` interface matches component expectations
- Alt text generation returns string
- Sort function returns string array
- All ID generation follows naming pattern

✅ **Dependencies:**
- [x] `yaml` package installed in Task 1
- [x] All imports added in Task 5

No gaps found. Plan is ready for execution.

---

## Next Steps

Plan complete and saved to `docs/superpowers/plans/2026-04-10-gallery-auto-discovery-plan.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration with checkpoints

**2. Inline Execution** — Execute tasks in this session using executing-plans skill, batch with review checkpoints

Which approach would you prefer?
