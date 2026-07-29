'use client';

import { useEffect, useState } from 'react';
import styles from './loading-screen.module.css';

const FILL_MS = 1000;
const HOLD_MS = 220;
// Hard ceiling — if anything above ever changes, the screen still clears.
const SAFETY_MS = 2400;

/**
 * First-paint loading screen. Purely decorative: page content mounts and is
 * interactive immediately underneath it, so there is nothing to "unblock" —
 * this only ever covers content for a fixed, short duration and then removes
 * itself from the DOM. `prefers-reduced-motion` is honoured twice over: the
 * CSS media query hides it outright before any script runs, and the JS path
 * below skips straight to done for browsers that only expose the preference
 * to `matchMedia`.
 */
export const LoadingScreen = () => {
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setPhase('done');
      return undefined;
    }

    const revealTimer = setTimeout(() => setPhase('done'), FILL_MS + HOLD_MS);
    const safetyTimer = setTimeout(() => setPhase('done'), SAFETY_MS);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      role="status"
      aria-label="Loading"
      aria-hidden={phase === 'done'}
      onTransitionEnd={event => {
        if (event.propertyName === 'opacity' && phase === 'done') setRemoved(true);
      }}
    >
      <div className={styles.mark}>
        <span className={styles.markLine} aria-hidden />
        <span className={styles.markText}>PG</span>
      </div>

      <div className={styles.rail} aria-hidden>
        <span className={styles.fill} style={{ animationDuration: `${FILL_MS}ms` }} />
      </div>

      <p className={styles.label}>Loading</p>
    </div>
  );
};
