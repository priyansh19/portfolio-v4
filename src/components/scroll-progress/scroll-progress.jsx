'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import styles from './scroll-progress.module.css';

/** Hairline progress bar pinned under the nav. */
export const ScrollProgress = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  // Reflects raw scroll position 1:1 under reduced motion — no added spring
  // lag, just a direct read of where the user already is.
  const scaleX = reduceMotion ? scrollYProgress : smoothed;

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden />;
};
