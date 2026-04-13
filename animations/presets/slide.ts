import { DURATION, EASE } from "../config"

export const slide = {
  up: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: DURATION.base, ease: EASE.responsive }
    },
    exit: { 
      y: 20, 
      opacity: 0,
      transition: { duration: DURATION.fast, ease: EASE.linear }
    }
  },
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { duration: DURATION.base, ease: EASE.responsive }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { duration: DURATION.fast, ease: EASE.linear }
    }
  }
}
