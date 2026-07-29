'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from './loading-screen.module.css';

const MIN_VISIBLE_MS = 700;
const HARD_TIMEOUT_MS = 2200;

/**
 * Warm, editorial loading screen shown on first paint. It always resolves —
 * a hard timeout forces it closed even if something upstream never fires —
 * so it can never trap a visitor on a stalled asset or a slow connection.
 */
export const LoadingScreen = () => {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);
  const reduceMotion = useReducedMotion();
  const resolvedRef = useRef(false);

  useEffect(() => {
    // Once per browser session — repeat visits and internal navigation
    // shouldn't replay the mark every time.
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('loading-seen') === '1';
    } catch {
      alreadySeen = false;
    }

    const resolve = () => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      setHidden(true);
      try {
        sessionStorage.setItem('loading-seen', '1');
      } catch {
        /* ignore write errors (private mode, etc.) */
      }
    };

    if (alreadySeen) {
      // Defer even the "skip" path to a callback rather than resolving
      // synchronously in the effect body, so this stays a plain external
      // subscription rather than an inline render-phase side effect.
      const skipTimer = setTimeout(resolve, 0);
      return () => clearTimeout(skipTimer);
    }

    const minDelay = reduceMotion ? 0 : MIN_VISIBLE_MS;
    const readyTimer = setTimeout(resolve, minDelay);
    // Belt-and-braces: no matter what happens above, this always fires.
    const hardTimer = setTimeout(resolve, HARD_TIMEOUT_MS);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(hardTimer);
    };
  }, [reduceMotion]);

  if (gone) return null;

  return (
    <div
      className={styles.overlay}
      data-hidden={hidden}
      aria-hidden={hidden}
      onTransitionEnd={() => hidden && setGone(true)}
    >
      <div className={styles.mark} aria-hidden>
        <svg viewBox="0 0 48 48" width="40" height="40">
          <g className={styles.spikes}>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x="22.5"
                y="4"
                width="3"
                height="16"
                rx="1.5"
                fill="currentColor"
                transform={`rotate(${i * 45} 24 24)`}
              />
            ))}
          </g>
        </svg>
      </div>
      <p className={styles.label}>Priyansh Gupta</p>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
      <span className={styles.srOnly} role="status">
        Loading page
      </span>
    </div>
  );
};
