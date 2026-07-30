'use client';

import { useEffect, useState } from 'react';
import { techLogos } from '@/lib/tech-logos';
import styles from './logo-tile.module.css';

/**
 * Flat pulsating square carrying one technology logo at a time.
 *
 * Sized by the caller to exactly two line-heights, so it displaces precisely
 * two lines of the paragraph it travels through.
 */
export const LogoTile = ({ size = 56, animate = true, offset = 0 }) => {
  // `offset` staggers each tile's starting logo so several on screen at once
  // are never showing the same one.
  const [index, setIndex] = useState(offset % techLogos.length);

  useEffect(() => {
    if (!animate) return undefined;
    const id = setInterval(() => setIndex(i => (i + 1) % techLogos.length), 2600);
    return () => clearInterval(id);
  }, [animate]);

  const logo = techLogos[index];

  return (
    <span
      className={styles.tile}
      data-animate={animate}
      style={{ width: size, height: size, '--brand': logo.hex }}
    >
      {/* key forces a fresh element per logo so the swap can cross-fade */}
      <svg className={styles.glyph} key={logo.label} viewBox="0 0 24 24" aria-hidden>
        <path d={logo.path} fill={logo.hex} />
      </svg>
    </span>
  );
};
