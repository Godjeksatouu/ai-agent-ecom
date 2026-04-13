import { DURATION, EASE } from "../config"

export const scale = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.bounce }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE.linear }
  },
  // Interaction states
  tap: { scale: 0.97 },
  hover: { scale: 1.02 }
}
