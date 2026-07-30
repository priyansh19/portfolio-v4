'use client';

import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './kinetic-text.module.css';

/**
 * Headline that flips in line by line in 3D.
 *
 * CSS can wrap text, but it gives you no handle on the individual lines, so
 * you cannot animate them separately. The usual workaround — render, measure
 * with getBoundingClientRect, re-render — forces a layout reflow per frame.
 *
 * Pretext computes the line breaks with pure arithmetic against the browser's
 * own font metrics, so we know exactly where each line falls before anything
 * is committed to the DOM.
 *
 * The visible lines are aria-hidden and the whole string is exposed once to
 * assistive tech, so splitting for animation never changes how it is read.
 */
export const KineticText = ({
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.075,
  ...rest
}) => {
  const hostRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [lines, setLines] = useState(null);

  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;

    const width = host.clientWidth;
    if (width < 2) return;

    const computed = getComputedStyle(host);
    // Prefer the font shorthand; some browsers leave it blank, so rebuild it.
    const font =
      computed.font ||
      `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} / ${computed.lineHeight} ${computed.fontFamily}`;

    const lineHeight = parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2;

    try {
      const prepared = prepareWithSegments(text, font, {
        letterSpacing: parseFloat(computed.letterSpacing) || 0,
      });
      const result = layoutWithLines(prepared, width, lineHeight);
      setLines(result.lines.map(line => line.text));
    } catch {
      // Any measurement failure falls back to plain unsplit text
      setLines(null);
    }
  }, [text]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let observer;
    let cancelled = false;

    // Webfonts load async. Measuring before they land would break the lines
    // against the fallback face and land them in the wrong places.
    const start = () => {
      if (cancelled) return;
      measure();
      observer = new ResizeObserver(measure);
      if (hostRef.current) observer.observe(hostRef.current);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [measure, reduceMotion]);

  // Server render, reduced motion, or a measurement failure: plain text.
  if (reduceMotion || !lines) {
    return (
      <Tag className={`${styles.host} ${className}`} ref={hostRef} {...rest}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={`${styles.host} ${className}`} ref={hostRef} {...rest}>
      <span className="srOnly">{text}</span>

      <motion.span
        className={styles.stage}
        aria-hidden
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '-15%' }}
        variants={{ shown: { transition: { staggerChildren: stagger } } }}
      >
        {lines.map((line, index) => (
          <span className={styles.lineMask} key={`${line}-${index}`}>
            <motion.span
              className={styles.line}
              variants={{
                hidden: { rotateX: -88, y: '55%', opacity: 0 },
                shown: {
                  rotateX: 0,
                  y: '0%',
                  opacity: 1,
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};
