# Gallery Auto-Discovery Implementation Design

**Date:** 2026-04-10  
**Component:** `src/components/ui/Gallery.astro`  
**Status:** Design Complete - Ready for Implementation

## Overview

The Gallery component will support automatic discovery and loading of images from a folder using Astro's `import.meta.glob()` at build time. Images are parsed, sorted numerically, and matched with optional YAML sidecar files containing hotspot metadata. Alt text is generated from image filenames by stripping numeric prefixes and path separators.

## Requirements

### Functional Requirements

1. **Image Discovery**
   - Auto-discover `.jpg` files from a specified folder at build time
   - Support JPEG/JPG format only
   - Accept folder path via `folder` prop (e.g., `src/assets/galleries/1`)

2. **Alt Text Generation**
   - Generate alt text from image filename
   - Strip leading number prefix and separators (`_`, `-`)
   - Example: `1_podorys.jpg` → alt text: `"podorys"`
   - Example: `3-bedroom-view.jpg` → alt text: `"bedroom view"`

3. **Hotspot Support**
   - Auto-discover YAML sidecar files matching image filenames
   - Example: `1_podorys.jpg` + `1_podorys.yaml`
   - Load hotspot data from YAML at build time
   - YAML format: contains `hotspots` array with `label`, `x`, `y` coordinates

4. **Image Ordering**
   - Sort images numerically using natural sort
   - Handle filenames like `1_`, `2_`, `10_` correctly
   - Use `localeCompare('en', {numeric: true})` for sorting

5. **Gallery Rendering**
   - Empty state: show message if no images found
   - Single image: display full-width without thumbnails
   - Multiple images: show main image + thumbnail strip with navigation

### Non-Functional Requirements

- All parsing happens at build time (zero runtime overhead)
- Component remains production-ready without changes
- No new dependencies beyond `yaml` package
- Error handling graceful (skip invalid data, log warnings)

## File Structure

```
src/assets/galleries/1/
├── 1_podorys.jpg
├── 1_podorys.yaml          (optional)
├── 2_interior.jpg
├── 2_interior.yaml         (optional)
├── 10_detail.jpg
└── ...
```

### YAML Sidecar Format

```yaml
# 1_podorys.yaml
hotspots:
  - label: "Kitchen"
    x: 25
    y: 40
  - label: "Bedroom"
    x: 75
    y: 60
  - label: "Living Room"
    x: 50
    y: 50
```

Fields:
- `hotspots`: Array of hotspot objects (optional)
- `label`: Human-readable hotspot label (required if hotspots present)
- `x`: Horizontal position as percentage 0-100 (required if hotspots present)
- `y`: Vertical position as percentage 0-100 (required if hotspots present)

## Implementation Details

### Component Front-Matter Logic

1. **Input Validation**
   - Check if `folder` prop is provided
   - Validate folder path format

2. **Image Discovery**
   - Use `import.meta.glob(`./../../assets/galleries/${folderName}/*.jpg`)` to find all JPG files
   - Load all files at build time

3. **YAML Discovery & Parsing**
   - Use `import.meta.glob(`./../../assets/galleries/${folderName}/*.yaml`)` to find YAML files
   - Parse using `yaml` package (via `npm install yaml`)
   - Handle missing/invalid YAML gracefully

4. **Image Object Construction**
   ```typescript
   interface ImageItem {
     src: any;              // ImageMetadata from glob
     alt: string;           // Generated from filename
     hotspots?: any[];      // From YAML, if present
   }
   ```

5. **Alt Text Generation Algorithm**
   - Extract filename without extension: `1_podorys.jpg` → `1_podorys`
   - Strip leading digits and separators: `1_podorys` → `podorys`
   - Replace remaining underscores/hyphens with spaces: `podorys` → `podorys`
   - Title-case optional (keep simple unless user requests)

6. **Sorting**
   - Use `Array.sort((a, b) => a.localeCompare(b, 'en', {numeric: true}))`
   - Applied to filenames after extraction

7. **Error Handling**
   - Missing folder → render empty state with message
   - Invalid YAML → log warning, skip hotspots for that image, still render image
   - Missing YAML file → render image without hotspots (expected behavior)
   - Malformed hotspot coordinates → skip entire hotspot entry for that image

### Component API

```astro
<Gallery folder="src/assets/galleries/1" />
```

Props:
- `folder` (required): Path to folder containing images (e.g., `src/assets/galleries/1`)

Output:
- Empty state if no images
- Single image display if 1 image
- Gallery with thumbnails if 2+ images

## Success Criteria

✅ Images auto-discover from folder at build time  
✅ Alt text generated correctly (number + separators stripped)  
✅ Hotspots load from YAML sidecar files  
✅ Images sort numerically  
✅ Gallery renders correctly (empty/single/multiple)  
✅ No runtime parsing overhead  
✅ Error handling graceful  
✅ Zero production issues  

## Dependencies

- `yaml` package for YAML parsing (to be installed)
- Existing: `astro:assets`, `Image` component

## Testing Considerations

- Create gallery folders with varying file naming patterns
- Test YAML parsing with valid/invalid hotspot data
- Verify alt text generation with various filename formats
- Confirm numeric sorting with mixed number ranges

## Out of Scope

- Image optimization (Astro's Image component handles this)
- Image ordering via external config files
- Metadata beyond hotspots (captions, descriptions, etc.)
- WebP/PNG/other formats (JPG only per requirements)
