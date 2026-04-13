import { STAGGER } from "../config"

export const stagger = {
  container: {
    animate: {
      transition: {
        staggerChildren: STAGGER.base
      }
    }
  },
  containerFast: {
    animate: {
      transition: {
        staggerChildren: STAGGER.fast
      }
    }
  }
}
