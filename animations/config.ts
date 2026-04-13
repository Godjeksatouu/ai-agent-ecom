/**
 * animations/config.ts
 *
 * Central tokens for motion design. Consistent easing and timing
 * are key to a premium eCommerce feel.
 */

export const EASE = {
  // Smooth, natural in/out
  gentle: [0.25, 1, 0.5, 1],
  // Quick, responsive entrance
  responsive: [0.05, 0.7, 0.1, 1],
  // Subtle bounce for micro-interactions
  bounce: [0.175, 0.885, 0.32, 1.275],
  // Linear for very simple transitions
  linear: [0, 0, 1, 1],
}

export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
  xl: 0.8,
}

export const STAGGER = {
  base: 0.1,
  fast: 0.05,
}

export const motionConfig = {
  transition: {
    duration: DURATION.base,
    ease: EASE.gentle,
  },
}
