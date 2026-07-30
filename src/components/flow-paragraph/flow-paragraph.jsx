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

const GAP = 16; // clearance between the tile and the text it displaces
const MIN_LINE = 110; // never squeeze a line narrower than this
const MAX_LINES = 60; // hard stop, so a bad measure can never spin forever
const TILE_LINES = 2; // tile is this many line-heights square
const ROW_SECONDS = 5.5; // time to cross one row
const TRAIL_FADE = 0.045; // how fast the trail dissolves each frame

/**
 * Paragraph whose text re-wraps live around a cube walking through it, with
 * the cube leaving a glowing trail along its path.
 *
 * CSS cannot do this. `shape-outside` floats a shape at the edge of a static
 * flow; it cannot reflow around something that moves every frame. Doing it by
 * hand means continuous re-measurement, and measuring through the DOM would
 * force a layout reflow per frame.
 *
 * Pretext lays out one line at a time at whatever width it is handed, using
 * pure arithmetic against the browser's font metrics — so each line asks for
 * the width left over by the cube's current position.
 */
export const FlowParagraph = ({ text, className = '' }) => {
  const wrapRef = useRef(null);
  const lineHostRef = useRef(null);
  const tileRef = useRef(null);
  const trailRef = useRef(null);
  const preparedRef = useRef(null);
  const metricsRef = useRef({ width: 0, lineHeight: 24 });
  const poolRef = useRef([]);
  const frameRef = useRef(0);
  const clockRef = useRef(0);
  const prevRef = useRef(null);
  const ctxRef = useRef(null);
  const boxHeightRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);
  const [tileSize, setTileSize] = useState(0);

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
   * Lay out against the cube's box and write straight into a pool of spans.
   * Imperative on purpose — routing per-frame layout through React state
   * would be far too slow.
   */
  const flow = useCallback(cube => {
    const prepared = preparedRef.current;
    const host = lineHostRef.current;
    if (!prepared || !host) return 0;

    const { width, lineHeight } = metricsRef.current;
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    let index = 0;

    while (index < MAX_LINES) {
      let lineX = 0;
      let lineWidth = width;

      if (cube && cube.bottom > y && cube.top < y + lineHeight) {
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

      let node = poolRef.current[index];
      if (!node) {
        node = document.createElement('span');
        node.className = styles.line;
        host.appendChild(node);
        poolRef.current[index] = node;
      }
      if (node.textContent !== line.text) node.textContent = line.text;
      node.style.transform = `translate3d(${lineX}px, ${y}px, 0)`;
      node.style.display = '';

      cursor = range.end;
      y += lineHeight;
      index += 1;
    }

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
      const size = Math.round(lineHeight * TILE_LINES);

      // Reserve the worst case so the block never changes height as the cube
      // squeezes lines and the line count shifts.
      const worst = flow({
        left: width - size,
        top: 0,
        bottom: Number.MAX_SAFE_INTEGER,
        size,
      });
      const boxHeight = worst * lineHeight;
      boxHeightRef.current = boxHeight;
      if (wrapRef.current) wrapRef.current.style.minHeight = `${boxHeight}px`;

      setTileSize(size);
      setEnhanced(true);

      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        clockRef.current += 0.016;
        const ctx = ctxRef.current;

        const { width: w, lineHeight: lh } = metricsRef.current;
        const rows = Math.max(1, Math.round(boxHeight / lh) - (TILE_LINES - 1));
        const travel = Math.max(1, w - size);

        // Snake: sweep a row left to right, drop, sweep back the other way
        const t = clockRef.current / ROW_SECONDS;
        const leg = Math.floor(t);
        const phase = t - leg;
        const row = leg % rows;
        const forward = leg % 2 === 0;
        const progress = forward ? phase : 1 - phase;

        const left = progress * travel;
        const top = row * lh;

        flow({ left, top, bottom: top + size, size });

        if (tileRef.current) {
          tileRef.current.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        }

        // --- trail: erase a little each frame, then stroke the new segment
        if (ctx) {
          const cx = left + size / 2;
          const cy = top + size / 2;

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE})`;
          ctx.fillRect(0, 0, w, boxHeight);

          ctx.globalCompositeOperation = 'source-over';
          const prev = prevRef.current;
          // Skip the jump when the snake wraps to a new row
          if (prev && Math.abs(cy - prev.y) < lh * 1.5) {
            ctx.shadowBlur = 14;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(cx, cy);
            ctx.stroke();
          }
          prevRef.current = { x: cx, y: cy };
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

  // The canvas only exists once the enhanced render has committed, so size it
  // here rather than inside the animation loop — a throttled rAF would
  // otherwise leave it at the 300x150 default.
  useEffect(() => {
    if (!enhanced || !trailRef.current) return;
    const canvas = trailRef.current;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(metricsRef.current.width * dpr);
    canvas.height = Math.round(boxHeightRef.current * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, [enhanced]);

  return (
    <div className={`${styles.wrap} ${className}`} data-enhanced={enhanced} ref={wrapRef}>
      <span className={enhanced ? 'srOnly' : undefined}>{text}</span>

      {enhanced && <canvas className={styles.trail} aria-hidden ref={trailRef} />}

      <span className={styles.lines} aria-hidden ref={lineHostRef} />

      {enhanced && tileSize > 0 && (
        <span className={styles.cube} aria-hidden ref={tileRef}>
          <LogoTile size={tileSize} animate={!reduceMotion} />
        </span>
      )}
    </div>
  );
};
