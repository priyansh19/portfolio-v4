'use client';

import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
} from '@chenglou/pretext';
import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTileField } from '@/components/tile-field/tile-field';
import styles from './flow-paragraph.module.css';

const GAP = 16; // clearance between a tile and the text it displaces
const MIN_LINE = 110; // never squeeze a line narrower than this
const MAX_LINES = 60; // hard stop, so a bad measure can never spin forever

/**
 * Given the obstacles crossing one line band, return the widest run of free
 * horizontal space. Merging first means overlapping tiles are treated as one
 * blockage rather than producing a phantom gap between them.
 */
function widestFreeSpan(blocks, width) {
  if (blocks.length === 0) return { x: 0, width };

  const merged = [];
  for (const b of [...blocks].sort((p, q) => p.start - q.start)) {
    const last = merged[merged.length - 1];
    if (last && b.start <= last.end) last.end = Math.max(last.end, b.end);
    else merged.push({ start: b.start, end: b.end });
  }

  let best = { x: 0, width: 0 };
  let cursor = 0;
  for (const m of merged) {
    const gap = Math.min(m.start, width) - cursor;
    if (gap > best.width) best = { x: cursor, width: gap };
    cursor = Math.max(cursor, m.end);
  }
  if (width - cursor > best.width) best = { x: cursor, width: width - cursor };

  return best;
}

/**
 * Paragraph whose text re-wraps live around tiles crossing it.
 *
 * CSS cannot do this. `shape-outside` floats a shape at the edge of a static
 * flow; it cannot reflow around objects that move every frame, and there is no
 * way at all to part text around something in the middle of a column.
 *
 * Pretext lays out one line at a time at whatever width it is handed, using
 * pure arithmetic against the browser's font metrics — so each line asks for
 * the widest free span left by the tiles currently crossing it.
 */
export const FlowParagraph = ({ text, className = '' }) => {
  const id = useId();
  const field = useTileField();
  const wrapRef = useRef(null);
  const lineHostRef = useRef(null);
  const preparedRef = useRef(null);
  const metricsRef = useRef({ width: 0, lineHeight: 24 });
  const poolRef = useRef([]);
  const hitRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);

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
   * Lay out against the given obstacles and write straight into a pool of
   * spans. Imperative on purpose — routing per-frame layout through React
   * state would be far too slow.
   */
  const flow = useCallback(obstacles => {
    const prepared = preparedRef.current;
    const host = lineHostRef.current;
    if (!prepared || !host) return 0;

    const { width, lineHeight } = metricsRef.current;
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    let index = 0;

    while (index < MAX_LINES) {
      // Snap the band the text reacts to, so a tile mid-glide between rows
      // still displaces whole lines rather than clipping an extra one.
      const top = y;
      const bottom = y + lineHeight;

      const blocks = [];
      for (const o of obstacles) {
        const oTop = Math.round(o.top / lineHeight) * lineHeight;
        if (oTop + o.size <= top || oTop >= bottom) continue;
        blocks.push({ start: o.left - GAP, end: o.left + o.size + GAP });
      }

      const span = widestFreeSpan(blocks, width);
      const lineWidth = Math.max(MIN_LINE, span.width);
      const lineX = span.width < MIN_LINE ? 0 : span.x;

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

    hitRef.current = obstacles.length > 0;
    return index;
  }, []);

  useEffect(() => {
    if (reduceMotion || !field) return undefined;

    let cancelled = false;
    let observer;
    let unregister;

    const start = () => {
      if (cancelled || !prepare()) return;

      const { width, lineHeight } = metricsRef.current;

      // Reserve the worst case up front so the block never jumps in height as
      // tiles squeeze lines and the line count changes.
      const worst = flow([
        { left: width / 2 - field.tileSize / 2, top: 0, size: 1e6 },
      ]);
      if (wrapRef.current) {
        wrapRef.current.style.minHeight = `${worst * lineHeight}px`;
      }

      flow([]);
      setEnhanced(true);

      unregister = field.register(id, {
        getElement: () => wrapRef.current,
        wasHit: () => hitRef.current,
        flow,
      });

      observer = new ResizeObserver(() => {
        if (prepare()) flow([]);
      });
      observer.observe(wrapRef.current);
    };

    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelled = true;
      unregister?.();
      observer?.disconnect();
    };
  }, [prepare, flow, field, id, reduceMotion]);

  return (
    <div className={`${styles.wrap} ${className}`} data-enhanced={enhanced} ref={wrapRef}>
      <span className={enhanced ? 'srOnly' : undefined}>{text}</span>
      <span className={styles.lines} aria-hidden ref={lineHostRef} />
    </div>
  );
};
