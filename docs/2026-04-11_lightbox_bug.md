# Gallery Lightbox Bug Investigation (2026-04-11)

## Problem Statement
The Gallery component in `/workspace/src/components/ui/Gallery.astro` has a lightbox feature that:
- ✅ Thumbnail navigation works (clicking thumbnails swaps main image)
- ❌ Lightbox opening fails (clicking main image shows black overlay with infinite loading spinner)

## Symptom
When user clicks on a main gallery image to open in lightbox:
1. Black overlay appears (lightbox modal opens)
2. Circular loading indicator displays
3. **Gets stuck forever** - image never loads, must close browser tab

## Investigation Findings

### What Works
- ✅ Gallery component renders correctly
- ✅ Thumbnail buttons swap images properly
- ✅ GLightbox library initializes successfully
- ✅ Click handlers fire when images are clicked
- ✅ GLightbox `onOpen` event fires (modal opens)
- ✅ Image URLs return HTTP 200 status
- ✅ Image data is valid and loadable as webp format
- ✅ Images load fine when tested with plain `<img>` element

### What Fails
- ❌ GLightbox cannot load images from Astro's image optimization endpoint (`/_image?...`)
- The lightbox opens but hangs on loading the image

## Technical Details

### Image URL Format
GLightbox is being given URLs like:
```
/_image?href=%2F%40fs%2Fhome%2Fmiso%2Fprojects%2Fwww%2Fmaks_espace%2Fsrc%2Fassets%2Fgalleries%2F1%2F1_podorys.jpg%3ForigWidth%3D677%26origHeight%3D472%26origFormat%3Djpg&w=677&h=472&f=webp
```

This is Astro's **image optimization endpoint URL**, which:
- Returns HTTP 200
- Sets correct `Content-Type: image/webp` headers
- Contains valid image data (34-68KB webp blobs)
- **BUT**: GLightbox cannot load it (hangs indefinitely)

### Why This is Strange
- The Image component uses these same URLs and works fine
- Our diagnostic test fetches the URL, converts to blob, loads in Image element = success
- But when GLightbox tries to load from this URL directly = failure

### Attempts to Fix

#### Attempt 1: Use simple image paths
- Changed href to `/assets/galleries/1/1_podorys.jpg`
- **Failed**: Astro doesn't serve src/assets files directly at this path

#### Attempt 2: Move images to public folder
- Copied all galleries to `/public/assets/galleries/`
- **Abandoned**: This skips Astro's image optimization (defeats the purpose)

#### Attempt 3: Use getImage() to get optimized URL
- Used `getImage()` to fetch optimized image metadata
- Returns the optimization endpoint URL (`/_image?...`)
- **Still fails**: Same issue - GLightbox can't load from endpoint

#### Attempt 4: Preload as blob URLs
- Fetch image → convert to blob → create blob URL with `URL.createObjectURL()`
- Replace link href with blob URL
- Blob URLs look like: `blob:http://localhost:4330/abc123...`
- **Still fails**: GLightbox hangs even with blob URLs

## Console Logs

### Page Load
```
Gallery script initializing...
initGallery called
GLightbox global: function GLightbox
GLightbox initialized: Object {...}
GLightbox version: 3.3.1
Found data-glightbox elements: 4
Glightbox link 0: href="/_image?href=..."
...
Attaching click handler to glightbox link 0
```

### Image Validation (showing images ARE valid)
```
Image 0 GET: status=200, content-type=image/webp
Image 0 blob: 34474 bytes, type=image/webp, claimed=image/webp
Image 0 is valid (loaded successfully)  ← Test Image element loads it fine
```

### Clicking Main Image (showing GLightbox gets stuck)
```
GLightbox: onOpen event fired
GLightbox link 0 clicked!
  href: /_image?href=...
  calling lightbox.open()
GLightbox: onOpen event fired
  lightbox.open() completed
[STUCK HERE - never progresses]
```

## Current Code State

### Gallery.astro Script Section
```javascript
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css">
<script src="https://cdn.jsdelivr.net/npm/glightbox"></script>

<script is:inline>
  console.log('Gallery script initializing...');

  function initGallery() {
    const lightbox = GLightbox({
      selector: '[data-glightbox]',
      onOpen: () => console.log('GLightbox: onOpen event fired'),
    });
    
    const glightboxLinks = document.querySelectorAll('[data-glightbox]');
    glightboxLinks.forEach((link, idx) => {
      const href = link.getAttribute('href');
      console.log(`Glightbox link ${idx}: href="${href}"`);
      
      // Attempt to preload as blob URL (currently not working)
      fetch(href)
        .then(r => r.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          link.setAttribute('href', blobUrl);
        })
        .catch(e => console.error(`Image ${idx} preload error:`, e));
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        lightbox.open(link);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
</script>
```

### Gallery Template
```html
{/* Multi-image gallery */}
{isMultiple ? (
  <>
    <div class="relative w-full" data-main-images>
      {images.map((img, idx) => (
        <div data-image-index={idx} class={idx === 0 ? '' : 'hidden'}>
          <a
            href={img.lightboxSrc}  <!-- Astro optimization endpoint URL -->
            data-glightbox="gallery"
            class="inline-block w-full text-decoration-none cursor-pointer"
            style="all: inherit;"
          >
            <HotspotImage image={img.src} alt={img.alt} hotspots={img.hotspots} />
          </a>
        </div>
      ))}
    </div>
    <!-- Thumbnail strip -->
  </>
)}
```

## Hypothesis for Root Cause

The Astro image optimization endpoint (`/_image?...`) is designed to work with the Image component (which uses special handling). When external libraries like GLightbox try to load from this endpoint directly, one of these might be happening:

1. **Redirect loop** - endpoint might redirect and GLightbox doesn't follow
2. **Missing headers** - endpoint might not set headers GLightbox expects
3. **Streaming issue** - endpoint might stream image data in a way GLightbox can't consume
4. **Cache issue** - endpoint might not cache properly for external fetches
5. **CORS/Frame headers** - endpoint might have restrictions
6. **Format issue** - webp format might have compatibility issues with GLightbox

## Files Involved
- `/workspace/src/components/ui/Gallery.astro` - Main component with lightbox script
- `/workspace/src/components/ui/HotspotImage.astro` - Image with hotspots
- `/workspace/src/pages/sk/index.astro` - Uses Gallery component
- `/workspace/public/assets/galleries/` - Gallery images (copied from src/assets)
- `/workspace/src/assets/galleries/` - Original gallery images with YAML hotspot data

## Next Steps for New Session

1. **Use Playwright to debug** - Inspect network tab to see:
   - What response the optimization endpoint returns
   - Response headers
   - Whether it's a redirect
   - The actual image data

2. **Check GLightbox internals** - Monitor what GLightbox is doing when it tries to load:
   - What fetch/XHR requests it makes
   - What errors it encounters
   - Whether it's a format/parsing issue

3. **Test alternatives**:
   - Try GLightbox with a simple external image URL (e.g., from imgur)
   - Try other lightbox libraries
   - Check if there's a GLightbox configuration option we're missing

4. **Consider workarounds**:
   - Create a custom Astro route handler that serves images without optimization
   - Use a different approach (e.g., modal with img tag instead of lightbox library)
   - Disable webp conversion in the optimization endpoint

## Environment
- Node: workspace at `/workspace`
- Dev server: Running on `http://localhost:4330/`
- Astro version: (check astro.config.mjs)
- GLightbox version: 3.3.1
- Test page: `http://localhost:4330/sk/` (has 3 galleries with multiple images)
