'use client';

import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
} from '@chenglou/pretext';
import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LogoTile } from '@/components/logo-tile/logo-tile';
import styles from './flow-paragraph.module.css';

const GAP = 18; // clearance between the tile and the text it displaces
const MIN_LINE = 90; // never squeeze a line narrower than this
/** The tile is exactly this many line-heights square, so it displaces two lines. */
const TILE_LINES = 2;

/**
 * Paragraph whose text genuinely re-wraps around a cube walking through it.
 *
 * This is the thing CSS cannot do. `shape-outside` only floats a shape at the
 * edge of a static flow; it cannot re-flow around an object that moves every
 * frame. Doing it manually means re-measuring text continuously, and measuring
 * via the DOM would force a layout reflow per frame.
 *
 * Pretext lays out one line at a time at whatever width you hand it, using
 * pure arithmetic against the browser's font metrics. So each frame we ask for
 * a different width per line depending on where the cube currently sits, and
 * the text parts around it.
 *
 * The cube walks a boustrophedon path — left to right along one line, down,
 * right to left along the next — like a counter on a snakes-and-ladders board.
 */
export const FlowParagraph = ({ text, className = '' }) => {
  const wrapRef = useRef(null);
  const lineHostRef = useRef(null);
  const cubeRef = useRef(null);
  const preparedRef = useRef(null);
  const metricsRef = useRef({ width: 0, lineHeight: 24 });
  const poolRef = useRef([]);
  const frameRef = useRef(0);
  const clockRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);
  const [tileSize, setTileSize] = useState(0);

  /** Re-prepare whenever the text, font or container width changes. */
  const prepare = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return false;

    const width = wrap.clientWidth;
    if (width < 200) return false;

    const cs = getComputedStyle(wrap);
    const font =
      cs.font ||
      `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
    const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;

    try {
      preparedRef.current = prepareWithSegments(text, font, {
        letterSpacing: parseFloat(cs.letterSpacing) || 0,
      });
    } catch {
      preparedRef.current = null;
      return false;
    }

    metricsRef.current = { width, lineHeight };
    return true;
  }, [text]);

  /**
   * Lay the paragraph out once, given the cube's current box, and write the
   * result straight into a pool of spans. Deliberately imperative — pushing
   * this through React state every frame would be far too slow.
   */
  const flow = useCallback(cube => {
    const prepared = preparedRef.current;
    const host = lineHostRef.current;
    if (!prepared || !host) return 0;

    const { width, lineHeight } = metricsRef.current;
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    let index = 0;

    while (index < 40) {
      const top = y;
      const bottom = y + lineHeight;

      // Does the cube's box intersect this line's band?
      let lineX = 0;
      let lineWidth = width;

      if (cube && cube.bottom > top && cube.top < bottom) {
        const onRight = cube.left + cube.size / 2 > width / 2;
        if (onRight) {
          lineWidth = Math.max(MIN_LINE, cube.left - GAP);
        } else {
          lineX = Math.min(width - MIN_LINE, cube.left + cube.size + GAP);
          lineWidth = Math.max(MIN_LINE, width - lineX);
        }
      }

      const range = layoutNextLineRange(prepared, cursor, lineWidth);
      if (range === null) break;

      const line = materializeLineRange(prepared, range);

      let span = poolRef.current[index];
      if (!span) {
        span = document.createElement('span');
        span.className = styles.line;
        host.appendChild(span);
        poolRef.current[index] = span;
      }
      if (span.textContent !== line.text) span.textContent = line.text;
      span.style.transform = `translate3d(${lineX}px, ${y}px, 0)`;
      span.style.display = '';

      cursor = range.end;
      y += lineHeight;
      index += 1;
    }

    // Hide any spans left over from a taller previous layout
    for (let i = index; i < poolRef.current.length; i++) {
      poolRef.current[i].style.display = 'none';
    }

    return index;
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let cancelled = false;
    let observer;

    const start = () => {
      if (cancelled || !prepare()) return;

      const { width, lineHeight } = metricsRef.current;
      // Square, exactly two lines tall — so it displaces two lines, no more
      const cubeSize = Math.round(lineHeight * TILE_LINES);

      // Reserve height for the worst case, so the block never jumps as the
      // tile squeezes lines and the count changes.
      const squeezed = flow({
        left: width - cubeSize,
        top: 0,
        bottom: Number.MAX_SAFE_INTEGER,
        size: cubeSize,
      });
      if (wrapRef.current) {
        wrapRef.current.style.minHeight = `${squeezed * lineHeight}px`;
      }

      setTileSize(cubeSize);
      setEnhanced(true);

      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        clockRef.current += 0.016;

        const { width: w, lineHeight: lh } = metricsRef.current;
        const rows = Math.max(1, Math.round(wrapRef.current.clientHeight / lh) - 1);
        const travel = Math.max(1, w - cubeSize);

        // Boustrophedon: sweep across a row, drop, sweep back the other way
        const period = 6.5; // seconds per row
        const t = clockRef.current / period;
        const row = Math.floor(t) % rows;
        const phase = t % 1;
        const forward = Math.floor(t) % 2 === 0;
        const eased = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2 * 0.5 + Math.PI * 0);

        const progress = forward ? eased : 1 - eased;
        const left = progress * travel;
        const top = row * lh;

        flow({ left, top, bottom: top + cubeSize, size: cubeSize });

        if (cubeRef.current) {
          cubeRef.current.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        }
      };

      animate();

      observer = new ResizeObserver(() => {
        if (prepare()) flow(null);
      });
      observer.observe(wrapRef.current);
    };

    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      observer?.disconnect();
    };
  }, [prepare, flow, reduceMotion]);

  return (
    <div className={`${styles.wrap} ${className}`} data-enhanced={enhanced} ref={wrapRef}>
      {/* Plain text until enhanced, and the permanent accessible copy */}
      <span className={enhanced ? 'srOnly' : undefined}>{text}</span>

      <span className={styles.lines} aria-hidden ref={lineHostRef} />

      {enhanced && tileSize > 0 && (
        <span className={styles.cube} aria-hidden ref={cubeRef}>
          <LogoTile size={tileSize} animate={!reduceMotion} />
        </span>
      )}
    </div>
  );
};
