'use client';

import { useReducedMotion } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LogoTile } from '@/components/logo-tile/logo-tile';
import styles from './tile-field.module.css';

const TileFieldContext = createContext(null);

const TILE_SIZE = 56; // ~2 lines at body line-height
const TILE_COUNT = 3;
const SPEED = 78; // px per second
const TOP_INSET = 76; // keep clear of the nav bar

/**
 * Tiles bouncing around the viewport like balls on a table, while every
 * registered paragraph re-wraps its text around whichever tiles are currently
 * crossing it.
 *
 * One rAF loop drives everything. Per frame it reads every subscriber's rect
 * first, then does all the writes — batching that way avoids the read/write
 * thrash you get from interleaving getBoundingClientRect with style updates.
 *
 * Paragraphs whose box no tile currently overlaps are skipped entirely, so
 * the cost scales with how many are actually being disturbed, not with how
 * many exist.
 */
export const TileField = ({ children }) => {
  const subscribers = useRef(new Map());
  const tiles = useRef([]);
  const nodes = useRef([]);
  const frame = useRef(0);
  const last = useRef(0);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  const register = useCallback((id, entry) => {
    subscribers.current.set(id, entry);
    return () => subscribers.current.delete(id);
  }, []);

  const value = useMemo(() => ({ register, tileSize: TILE_SIZE }), [register]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const bounds = () => ({
      minX: 8,
      maxX: window.innerWidth - TILE_SIZE - 8,
      minY: TOP_INSET,
      maxY: window.innerHeight - TILE_SIZE - 8,
    });

    const b = bounds();
    tiles.current = Array.from({ length: TILE_COUNT }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: b.minX + Math.random() * Math.max(1, b.maxX - b.minX),
        y: b.minY + Math.random() * Math.max(1, b.maxY - b.minY),
        vx: Math.cos(angle) * SPEED,
        vy: Math.sin(angle) * SPEED,
        seed: i,
      };
    });

    // Deferred out of the effect body (a synchronous setState there triggers a
    // cascading render) but NOT tied to rAF — gating the tiles' existence on
    // the animation loop would leave them absent in a throttled background tab.
    const reveal = setTimeout(() => setActive(true), 0);

    const step = now => {
      frame.current = requestAnimationFrame(step);

      const dt = Math.min(0.05, (now - (last.current || now)) / 1000);
      last.current = now;

      const lim = bounds();

      // --- physics: integrate, then bounce off the viewport edges
      for (const t of tiles.current) {
        t.x += t.vx * dt;
        t.y += t.vy * dt;

        if (t.x <= lim.minX) {
          t.x = lim.minX;
          t.vx = Math.abs(t.vx);
        } else if (t.x >= lim.maxX) {
          t.x = lim.maxX;
          t.vx = -Math.abs(t.vx);
        }

        if (t.y <= lim.minY) {
          t.y = lim.minY;
          t.vy = Math.abs(t.vy);
        } else if (t.y >= lim.maxY) {
          t.y = lim.maxY;
          t.vy = -Math.abs(t.vy);
        }
      }

      // --- tile-on-tile: swap velocity components along the contact axis
      for (let i = 0; i < tiles.current.length; i++) {
        for (let j = i + 1; j < tiles.current.length; j++) {
          const a = tiles.current[i];
          const c = tiles.current[j];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          if (Math.abs(dx) >= TILE_SIZE || Math.abs(dy) >= TILE_SIZE) continue;

          if (Math.abs(dx) > Math.abs(dy)) {
            const tmp = a.vx;
            a.vx = c.vx;
            c.vx = tmp;
            const push = (TILE_SIZE - Math.abs(dx)) / 2;
            a.x -= Math.sign(dx || 1) * push;
            c.x += Math.sign(dx || 1) * push;
          } else {
            const tmp = a.vy;
            a.vy = c.vy;
            c.vy = tmp;
            const push = (TILE_SIZE - Math.abs(dy)) / 2;
            a.y -= Math.sign(dy || 1) * push;
            c.y += Math.sign(dy || 1) * push;
          }
        }
      }

      // --- move the tiles themselves
      for (let i = 0; i < tiles.current.length; i++) {
        const node = nodes.current[i];
        if (node) {
          node.style.transform = `translate3d(${tiles.current[i].x}px, ${tiles.current[i].y}px, 0)`;
        }
      }

      // --- READS first: every subscriber's box in viewport coordinates
      const pending = [];
      for (const [, entry] of subscribers.current) {
        const el = entry.getElement();
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Skip anything off-screen entirely
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
          if (entry.wasHit()) pending.push({ entry, local: [] });
          continue;
        }

        const local = [];
        for (const t of tiles.current) {
          if (
            t.x + TILE_SIZE < rect.left ||
            t.x > rect.right ||
            t.y + TILE_SIZE < rect.top ||
            t.y > rect.bottom
          ) {
            continue;
          }
          local.push({ left: t.x - rect.left, top: t.y - rect.top, size: TILE_SIZE });
        }

        // Nothing overlapping and nothing to clear — leave this one alone
        if (local.length === 0 && !entry.wasHit()) continue;
        pending.push({ entry, local });
      }

      // --- WRITES second
      for (const { entry, local } of pending) entry.flow(local);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      clearTimeout(reveal);
      cancelAnimationFrame(frame.current);
    };
  }, [reduceMotion]);

  return (
    <TileFieldContext.Provider value={value}>
      {children}

      {active && !reduceMotion && (
        <div className={styles.field} aria-hidden>
          {Array.from({ length: TILE_COUNT }, (_, i) => (
            <span
              className={styles.tile}
              key={i}
              ref={node => {
                nodes.current[i] = node;
              }}
            >
              <LogoTile size={TILE_SIZE} offset={i * 5} />
            </span>
          ))}
        </div>
      )}
    </TileFieldContext.Provider>
  );
};

export const useTileField = () => useContext(TileFieldContext);
