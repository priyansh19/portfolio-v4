'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/content';
import styles from './boot-screen.module.css';

const LINES = ['MEMORY CHECK... OK', 'LOADING CARTRIDGE...', 'SYSTEM READY'];
const STEP_MS = 260;
const HOLD_MS = 220;

/**
 * Console boot sequence shown on first paint. A hard timeout dismisses it
 * regardless of the line sequence, so it can never trap a visitor behind a
 * stuck animation — reduced motion skips the sequence entirely and resolves
 * almost immediately.
 */
export const BootScreen = () => {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(true);
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      const fade = setTimeout(() => setVisible(false), 40);
      const unmount = setTimeout(() => setMounted(false), 340);
      return () => {
        clearTimeout(fade);
        clearTimeout(unmount);
      };
    }

    const stepTimers = LINES.map((_, index) =>
      setTimeout(() => setLineIndex(index), index * STEP_MS)
    );

    // Hard backstop — dismisses the boot screen no matter what happens
    // above, so it can never hang a visitor behind an animation.
    const totalMs = LINES.length * STEP_MS + HOLD_MS;
    const fade = setTimeout(() => setVisible(false), totalMs);
    const unmount = setTimeout(() => setMounted(false), totalMs + 300);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(fade);
      clearTimeout(unmount);
    };
  }, [reduceMotion]);

  if (!mounted) return null;

  const progress = reduceMotion ? 1 : (lineIndex + 1) / LINES.length;

  return (
    <div className={styles.overlay} data-visible={visible} aria-hidden>
      <div className={styles.panel}>
        <span className={styles.mark}>{profile.name}</span>
        <span className={styles.line}>{reduceMotion ? 'SYSTEM READY' : LINES[lineIndex]}</span>
        <span className={styles.track}>
          <span className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </div>
  );
};
