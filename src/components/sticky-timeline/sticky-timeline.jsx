'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styles from './sticky-timeline.module.css';

/**
 * A sticky scroll sequence: a pinned "scene" on the left holds the currently
 * active role while the full history scrolls past on the right. The active
 * role advances as each card crosses the centre of the viewport.
 *
 * Falls back to a plain static scene (no pinning, no swap) under
 * prefers-reduced-motion, since a sticky panel that visually changes as you
 * scroll is itself a motion effect.
 */
export const StickyTimeline = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [reduceMotion, items.length]);

  const active = items[activeIndex] ?? items[0];

  return (
    <div className={styles.wrap}>
      <div className={styles.scene}>
        <div className={styles.sceneInner}>
          <span className={styles.sceneCount}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>

          {reduceMotion ? (
            <div>
              <p className={styles.scenePeriod}>{active.period}</p>
              <h3 className={styles.sceneRole}>{active.role}</h3>
              <p className={styles.sceneCompany}>{active.company}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={styles.scenePeriod}>{active.period}</p>
                <h3 className={styles.sceneRole}>{active.role}</h3>
                <p className={styles.sceneCompany}>{active.company}</p>
              </motion.div>
            </AnimatePresence>
          )}

          <ol className={styles.rail} aria-hidden>
            {items.map((item, index) => (
              <li
                className={styles.railDot}
                data-active={index === activeIndex}
                key={item.id}
              />
            ))}
          </ol>
        </div>
      </div>

      <ol className={styles.track}>
        {items.map((item, index) => (
          <li
            className={styles.trackItem}
            data-active={index === activeIndex}
            key={item.id}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            data-index={index}
          >
            <div className={styles.meta}>
              <p className={styles.period}>{item.period}</p>
              {item.current && <span className={styles.badge}>Current</span>}
            </div>

            <div className={styles.card}>
              <h3 className={styles.role}>{item.role}</h3>
              <p className={styles.company}>
                {item.company}
                <span className={styles.scope}>{item.scope}</span>
              </p>

              <ul className={styles.points}>
                {item.points.map(point => (
                  <li className={styles.point} key={point}>
                    {point}
                  </li>
                ))}
              </ul>

              <ul className={styles.tags}>
                {item.tags.map(tag => (
                  <li className={styles.tag} key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
