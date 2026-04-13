/**
 * animations/variants.ts
 *
 * Curated Framer Motion variants for high-performance eCommerce UI.
 * Use these with the `motion` component.
 */

import { fade } from "./presets/fade"
import { slide } from "./presets/slide"
import { scale } from "./presets/scale"
import { stagger } from "./presets/stagger"

export const variants = {
  // Pre-configured transitions
  fadeIn: fade,
  slideInUp: slide.up,
  slideInRight: slide.right,
  scaleIn: scale,
  
  // Containers for list items
  staggerContainer: stagger.container,
  staggerContainerFast: stagger.containerFast,

  // Micro-interactions
  buttonPress: {
    whileTap: { scale: 0.97 },
    whileHover: { scale: 1.02, transition: { duration: 0.1 } }
  },
  
  cardHover: {
    initial: { y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: { 
      y: -8, 
      boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
      transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
    }
  }
}

export type Variants = typeof variants
