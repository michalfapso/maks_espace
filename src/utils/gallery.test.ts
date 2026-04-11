import { describe, it, expect } from 'vitest';
import { computeContainerAR, computeOverlay } from './gallery';

describe('computeContainerAR', () => {
  it('returns 1 for an empty array', () => {
    expect(computeContainerAR([])).toBe(1);
  });

  it('returns aspect ratio matching the tallest landscape image', () => {
    // 1_podorys.jpg: 472/677 ≈ 0.6974; 2.jpg: 425/724 ≈ 0.5871
    const result = computeContainerAR([472 / 677, 425 / 724]);
    expect(result).toBeCloseTo(677 / 472, 3); // ≈ 1.4343
  });

  it('caps at 1.0 when max height ratio exceeds square', () => {
    expect(computeContainerAR([0.697, 1.5])).toBeCloseTo(1.0, 3);
  });

  it('returns 1.0 for an all-portrait gallery', () => {
    expect(computeContainerAR([1.2, 1.5, 1.3])).toBeCloseTo(1.0, 3);
  });

  it('returns 1.0 for a single square image', () => {
    expect(computeContainerAR([1.0])).toBeCloseTo(1.0, 3);
  });
});

describe('computeOverlay', () => {
  it('letterboxes a wider image — stripes top and bottom', () => {
    // imageAR=1.704 in containerAR=1.434
    const result = computeOverlay(1.704, 1.434);
    const expectedHeight = 1.434 / 1.704;
    expect(result.overlayWidth).toBeCloseTo(1, 3);
    expect(result.overlayLeft).toBeCloseTo(0, 3);
    expect(result.overlayHeight).toBeCloseTo(expectedHeight, 3);
    expect(result.overlayTop).toBeCloseTo((1 - expectedHeight) / 2, 3);
  });

  it('pillarboxes a narrower image — stripes on sides', () => {
    // portrait imageAR=0.667 in square containerAR=1.0
    const result = computeOverlay(0.667, 1.0);
    const expectedWidth = 0.667 / 1.0;
    expect(result.overlayHeight).toBeCloseTo(1, 3);
    expect(result.overlayTop).toBeCloseTo(0, 3);
    expect(result.overlayWidth).toBeCloseTo(expectedWidth, 3);
    expect(result.overlayLeft).toBeCloseTo((1 - expectedWidth) / 2, 3);
  });

  it('returns full overlay for a perfect-fit image', () => {
    const result = computeOverlay(1.434, 1.434);
    expect(result.overlayTop).toBeCloseTo(0, 3);
    expect(result.overlayLeft).toBeCloseTo(0, 3);
    expect(result.overlayHeight).toBeCloseTo(1, 3);
    expect(result.overlayWidth).toBeCloseTo(1, 3);
  });
});
