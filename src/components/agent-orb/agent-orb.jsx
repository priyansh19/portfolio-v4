'use client';

import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceOrb } from '@/components/voice-orb/voice-orb';
import styles from './agent-orb.module.css';

/**
 * Base render size. The wrapper is always this many CSS pixels and is scaled
 * with a transform, so the WebGL canvas never resizes during the dock
 * animation — resizing a drawing buffer every frame is expensive and causes
 * visible flicker.
 */
const BASE_SIZE = 380;
const DOCKED_SIZE = 88;

/** How far you scroll before the orb has fully reached the corner. */
const DOCK_DISTANCE = 420;

/** Element the orb sits over while parked in the hero. */
const ANCHOR_ID = 'agent-anchor';

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * The voice assistant, persistent across scroll and route changes.
 *
 * On the home page it starts parked over the hero anchor at full size, then
 * shrinks and flies to the top-right corner as you scroll. Everywhere else it
 * is docked in the corner from the outset.
 */
export const AgentOrb = () => {
  const pathname = usePathname();
  const wrapperRef = useRef(null);
  const frameRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [docked, setDocked] = useState(true);
  const [ready, setReady] = useState(false);

  const position = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const anchor = document.getElementById(ANCHOR_ID);
    const gutter = Math.max(
      16,
      Math.min(40, Math.round(window.innerWidth * 0.04))
    );
    const navHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 64;

    // Where the orb ends up: pinned under the nav, right-hand edge
    const dockedTarget = {
      x: window.innerWidth - DOCKED_SIZE - gutter,
      y: navHeight + 12,
      scale: DOCKED_SIZE / BASE_SIZE,
    };

    if (!anchor) {
      wrapper.style.transform = `translate3d(${dockedTarget.x}px, ${dockedTarget.y}px, 0) scale(${dockedTarget.scale})`;
      setDocked(true);
      setReady(true);
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const heroTarget = {
      x: rect.left,
      y: rect.top,
      scale: rect.width / BASE_SIZE,
    };

    // 0 while parked in the hero, 1 once fully docked
    const t = Math.max(0, Math.min(1, window.scrollY / DOCK_DISTANCE));
    // Ease so it accelerates away from the hero rather than sliding linearly
    const eased = t * t * (3 - 2 * t);

    const x = lerp(heroTarget.x, dockedTarget.x, eased);
    const y = lerp(heroTarget.y, dockedTarget.y, eased);
    const scale = lerp(heroTarget.scale, dockedTarget.scale, eased);

    wrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    setDocked(eased > 0.55);
    setReady(true);
  }, []);

  // Coalesce scroll/resize work into one rAF so we never lay out twice a frame
  const schedule = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(position);
  }, [position]);

  useEffect(() => {
    // `ready` is flipped inside position(), which runs in a rAF callback —
    // setting it here would be a synchronous setState in an effect body.
    schedule();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // The hero anchor changes size with the layout, not just the window
    const anchor = document.getElementById(ANCHOR_ID);
    const observer = anchor ? new ResizeObserver(schedule) : null;
    if (anchor && observer) observer.observe(anchor);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [schedule, pathname]);

  return (
    <div
      className={styles.wrapper}
      data-docked={docked}
      data-ready={ready}
      data-reduced={reduceMotion ? 'true' : 'false'}
      ref={wrapperRef}
      style={{ width: BASE_SIZE, height: BASE_SIZE }}
    >
      {/* Hook the assistant up here: pass state and amplitude (0..1) */}
      <VoiceOrb className={styles.orb} />
    </div>
  );
};
