'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Cycles a word into place one character at a time — the "decoding" effect.
 * Rotates through `words` on an interval when more than one is given.
 */
export const ScrambleText = ({ words, interval = 2600, className }) => {
  const list = Array.isArray(words) ? words : [words];
  const [output, setOutput] = useState(list[0]);
  const indexRef = useRef(0);
  const frameRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || list.length < 2) return;

    let rafId;
    let timeoutId;

    const scrambleTo = target => {
      const from = list[indexRef.current];
      const length = Math.max(from.length, target.length);
      // Each character gets a random start/end frame so they settle out of order
      const queue = Array.from({ length }, (_, i) => ({
        to: target[i] ?? '',
        start: Math.floor(Math.random() * 20),
        end: Math.floor(Math.random() * 20) + 20,
        char: '',
      }));

      frameRef.current = 0;

      const tick = () => {
        let complete = 0;
        const next = queue.map((item, charIndex) => {
          if (frameRef.current >= item.end) {
            complete += 1;
            return item.to;
          }
          if (frameRef.current >= item.start) {
            if (!item.char || Math.random() < 0.28) {
              item.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            return item.char;
          }
          return from[charIndex] ?? '';
        });

        setOutput(next.join(''));
        frameRef.current += 1;

        if (complete < queue.length) {
          rafId = requestAnimationFrame(tick);
        } else {
          indexRef.current = list.indexOf(target);
          timeoutId = setTimeout(cycle, interval);
        }
      };

      tick();
    };

    const cycle = () => {
      const next = list[(indexRef.current + 1) % list.length];
      scrambleTo(next);
    };

    timeoutId = setTimeout(cycle, interval);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [interval, reduceMotion, list.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={className} aria-label={list[0]}>
      <span aria-hidden>{output}</span>
    </span>
  );
};
