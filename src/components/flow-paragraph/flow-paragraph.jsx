'use client';

import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
} from '@chenglou/pretext';
import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LogoTile } from '@/components/logo-tile/logo-tile';
import { useInViewport } from '@/lib/hooks';
import styles from './flow-paragraph.module.css';

const GAP = 14; // clearance between the tile and the text it displaces
const MIN_LINE = 110; // never squeeze a line narrower than this
const MAX_LINES = 60; // hard stop, so a bad measure can never spin forever
const TILE_LINES = 1; // tile is this many line-heights square
const ROW_SECONDS = 5.5; // time to cross one row
const TRAIL_POINTS = 78; // ~1.3s of trail at 60fps before it is fully gone
const TRAIL_PEAK = 0.34; // opacity at the head; the tail tapers from here to 0

/**
 * Paragraph whose text re-wraps live around a tile walking through it, with a
 * soft trail marking where it has been.
 *
 * CSS cannot do this. `shape-outside` floats a shape at the edge of a static
 * flow; it cannot reflow around something that moves every frame. Doing it by
 * hand means continuous re-measurement, and measuring through the DOM would
 * force a layout reflow per frame.
 *
 * Pretext lays out one line at a time at whatever width it is handed, using
 * pure arithmetic against the browser's font metrics — so each line asks for
 * the width left over by the tile's current position.
 *
 * Many of these run at once, so the loop is gated on visibility: a paragraph
 * off-screen does no layout work at all.
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
  const trailPointsRef = useRef([]);
  // Boxes the text currently occupies, so the trail can be kept out of them
  const occupiedRef = useRef([]);
  const ctxRef = useRef(null);
  const sizeRef = useRef(0);
  const boxHeightRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(wrapRef);
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
   * Lay out against the tile's box and write straight into a pool of spans.
   * Imperative on purpose — routing per-frame layout through React state
   * would be far too slow.
   */
  const flow = useCallback(tile => {
    const prepared = preparedRef.current;
    const host = lineHostRef.current;
    if (!prepared || !host) return 0;

    const { width, lineHeight } = metricsRef.current;
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    let index = 0;
    const occupied = [];

    while (index < MAX_LINES) {
      let lineX = 0;
      let lineWidth = width;

      if (tile && tile.bottom > y && tile.top < y + lineHeight) {
        const onRight = tile.left + tile.size / 2 > width / 2;
        if (onRight) {
          lineWidth = Math.max(MIN_LINE, tile.left - GAP);
        } else {
          lineX = Math.min(width - MIN_LINE, tile.left + tile.size + GAP);
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

      // Pretext gives the line's real width, not the width it was allowed —
      // so the trail can still show through the ragged right-hand edge.
      occupied.push({ x: lineX, y, w: line.width, h: lineHeight });

      cursor = range.end;
      y += lineHeight;
      index += 1;
    }

    for (let i = index; i < poolRef.current.length; i++) {
      poolRef.current[i].style.display = 'none';
    }

    occupiedRef.current = occupied;
    return index;
  }, []);

  /**
   * Match the trail canvas to its current CSS box. Must run on every resize,
   * not just once — a paragraph inside a grid or sticky stage can settle at a
   * very different width than it had on first measure, and a stale backing
   * store would draw the trail at the wrong scale.
   */
  const sizeTrail = useCallback(() => {
    const canvas = trailRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = metricsRef.current.width;
    const height = boxHeightRef.current;
    if (width < 2 || height < 2) return;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
    trailPointsRef.current = [];
  }, []);

  /** Re-measure, re-reserve height and re-size the trail as one unit. */
  const remeasure = useCallback(() => {
    if (!prepare()) return;
    const { width, lineHeight } = metricsRef.current;
    const size = Math.round(lineHeight * TILE_LINES);
    sizeRef.current = size;

    const worst = flow({
      left: width - size,
      top: 0,
      bottom: Number.MAX_SAFE_INTEGER,
      size,
    });
    boxHeightRef.current = worst * lineHeight;
    if (wrapRef.current) {
      wrapRef.current.style.minHeight = `${boxHeightRef.current}px`;
    }
    sizeTrail();
    flow(null);
  }, [prepare, flow, sizeTrail]);

  // --- setup: measure, reserve height, switch on the enhanced rendering
  useEffect(() => {
    if (reduceMotion) return undefined;

    let cancelled = false;
    let observer;

    const start = () => {
      if (cancelled || !prepare()) return;

      const { width, lineHeight } = metricsRef.current;
      const size = Math.round(lineHeight * TILE_LINES);
      sizeRef.current = size;

      // Random phase so many paragraphs on one page never march in lockstep.
      // Seeded here rather than at render — Math.random() during render is
      // impure and would produce a different value on every re-render.
      clockRef.current = Math.random() * ROW_SECONDS * 4;

      // Reserve the worst case so the block never changes height as the tile
      // squeezes lines and the line count shifts.
      const worst = flow({
        left: width - size,
        top: 0,
        bottom: Number.MAX_SAFE_INTEGER,
        size,
      });
      boxHeightRef.current = worst * lineHeight;
      if (wrapRef.current) {
        wrapRef.current.style.minHeight = `${boxHeightRef.current}px`;
      }

      setTileSize(size);
      setEnhanced(true);

      observer = new ResizeObserver(remeasure);
      observer.observe(wrapRef.current);
    };

    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [prepare, flow, remeasure, reduceMotion]);

  // Runs after the enhanced render commits — the first point at which the
  // canvas exists AND the element has its settled width. A full remeasure
  // rather than just sizing the canvas, because a paragraph inside a grid or
  // sticky stage is often laid out narrower than it measured on first pass,
  // and re-using that stale width would scale the trail wrongly.
  useEffect(() => {
    if (enhanced) remeasure();
  }, [enhanced, remeasure]);

  // --- animation, only while on screen
  useEffect(() => {
    if (!enhanced || reduceMotion || !isInViewport) return undefined;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      clockRef.current += 0.016;

      const { width: w, lineHeight: lh } = metricsRef.current;
      const size = sizeRef.current;
      const boxHeight = boxHeightRef.current;
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

      // Trail: keep a short history and repaint it whole each frame, brightest
      // at the head and tapering to nothing at the tail. Repainting rather
      // than compositing a fade means no residue accumulates.
      const ctx = ctxRef.current;
      if (ctx) {
        const points = trailPointsRef.current;
        points.push({ x: left + size / 2, y: top + size / 2 });
        if (points.length > TRAIL_POINTS) points.shift();

        ctx.clearRect(0, 0, w, boxHeight);

        // Keep the trail out of the text. Without this it survives on a row
        // after the tile has moved on, and once the text reflows back over
        // that space the leftover line reads as a strikethrough.
        //
        // An even-odd fill rule over [whole box] + [each text box] yields the
        // complement, so the trail is visible only where no text sits.
        const holes = new Path2D();
        holes.rect(0, 0, w, boxHeight);
        for (const r of occupiedRef.current) {
          holes.rect(r.x, r.y, r.w, r.h);
        }

        ctx.save();
        ctx.clip(holes, 'evenodd');
        ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';

        // Each span runs midpoint-to-midpoint with the sample itself as the
        // control point. Straight segments meeting at a shared vertex leave a
        // hard corner; routing through midpoints keeps the tangent continuous,
        // so every direction change reads as a curve. Consecutive spans share
        // an endpoint exactly, so per-span alpha still tapers cleanly.
        const midX = (p, q) => (p.x + q.x) / 2;
        const midY = (p, q) => (p.y + q.y) / 2;

        for (let i = 1; i < points.length - 1; i++) {
          const prev = points[i - 1];
          const cur = points[i];
          const next = points[i + 1];

          // Skip the jump when the snake wraps to the next row
          if (Math.abs(cur.y - prev.y) > lh * 1.5) continue;
          if (Math.abs(next.y - cur.y) > lh * 1.5) continue;

          const k = i / (points.length - 1); // 0 tail, 1 head
          ctx.globalAlpha = k * k * TRAIL_PEAK;
          ctx.lineWidth = 0.5 + k * 1.2;
          ctx.shadowBlur = 6 * k;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(midX(prev, cur), midY(prev, cur));
          ctx.quadraticCurveTo(cur.x, cur.y, midX(cur, next), midY(cur, next));
          ctx.stroke();
        }

        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    };

    animate();
    return () => cancelAnimationFrame(frameRef.current);
  }, [enhanced, isInViewport, reduceMotion, flow]);

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
