import { DURATION, EASE } from "../config"

export const fade = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.gentle }
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE.linear }
  }
}
