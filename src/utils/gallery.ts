export interface OverlayFractions {
  overlayTop: number;
  overlayLeft: number;
  overlayHeight: number;
  overlayWidth: number;
}

/**
 * Compute the container aspect ratio (width/height) for a gallery.
 *
 * Takes the array of per-image height/width ratios, picks the maximum
 * (tallest image), caps it at 1.0 (square) so portrait-heavy images
 * don't produce an excessively tall container, then converts to a
 * width/height ratio suitable for the CSS `aspect-ratio` property.
 */
export function computeContainerAR(heightRatios: number[]): number {
  if (heightRatios.length === 0) return 1;
  const rawMax = Math.max(...heightRatios);
  const capped = Math.min(rawMax, 1.0);
  return 1 / capped;
}

/**
 * Compute the overlay position fractions for a single image within a
 * fixed-aspect-ratio container that uses `object-fit: contain`.
 *
 * All values are fractions of the container dimension (0–1).
 * Used to constrain the hotspot dot layer to actual image pixels.
 *
 *   imageAR > containerAR → image wider → letterboxed (bars top & bottom)
 *   imageAR < containerAR → image narrower → pillarboxed (bars on sides)
 *   imageAR = containerAR → perfect fit
 */
export function computeOverlay(imageAR: number, containerAR: number): OverlayFractions {
  if (imageAR >= containerAR) {
    // Wider image: scales to fill container width, height < container height
    const overlayHeight = containerAR / imageAR;
    return {
      overlayWidth: 1,
      overlayHeight,
      overlayLeft: 0,
      overlayTop: (1 - overlayHeight) / 2,
    };
  } else {
    // Narrower image: scales to fill container height, width < container width
    const overlayWidth = imageAR / containerAR;
    return {
      overlayHeight: 1,
      overlayWidth,
      overlayTop: 0,
      overlayLeft: (1 - overlayWidth) / 2,
    };
  }
}
