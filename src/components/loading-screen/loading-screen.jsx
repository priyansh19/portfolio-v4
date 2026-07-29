'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './loading-screen.module.css';

// Purely cosmetic pacing for the fill bar — capped hard below so a slow
// network never turns this into a trap.
const MIN_VISIBLE_MS = 450;
const HARD_MAX_MS = 2600;
const FADE_MS = 420;

/**
 * White, minimal first-paint loader. Always resolves: it hides on whichever
 * comes first of (window load + minimum dwell) or a hard timeout.
 *
 * Under prefers-reduced-motion the fill bar simply never animates (it stays
 * at rest) rather than swapping to a different visual state — no motion is
 * the only requirement, not a particular appearance.
 */
export const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mountedAt = Date.now();
    const timers = [];
    let rafId;
    let loadHandled = false;

    const startHide = () => {
      if (hiddenRef.current) return;
      hiddenRef.current = true;
      setFading(true);
      timers.push(setTimeout(() => setVisible(false), reduced ? 0 : FADE_MS));
    };

    const finish = () => {
      if (loadHandled) return;
      loadHandled = true;
      const elapsed = Date.now() - mountedAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

      if (reduced || remaining === 0) {
        startHide();
      } else {
        timers.push(setTimeout(startHide, remaining));
      }
    };

    // Hard fallback — guarantees the loader can never trap the page even if
    // the load event never fires (e.g. a stalled subresource).
    timers.push(setTimeout(startHide, HARD_MAX_MS));

    const tick = () => {
      const elapsed = Date.now() - mountedAt;
      // Eases toward ~92% on its own; the real `load` event is what
      // actually completes and releases the bar to 100%.
      const eased = 1 - Math.exp(-elapsed / 550);
      setProgress(Math.min(eased * 0.92, 0.92));
      if (!hiddenRef.current) rafId = requestAnimationFrame(tick);
    };

    // Under reduced motion the bar is simply never driven — it stays put,
    // no rAF loop, no transition.
    if (!reduced) {
      rafId = requestAnimationFrame(tick);
    }

    const onLoad = () => {
      if (!reduced) setProgress(1);
      finish();
    };

    if (document.readyState === 'complete') {
      timers.push(setTimeout(onLoad, 0));
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', onLoad);
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={styles.screen}
      data-fading={fading}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.mark}>P</div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
};
