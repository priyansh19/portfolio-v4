'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './scroll-progress.module.css';

/** Hairline progress bar pinned under the nav. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden />;
};
