'use client';

import { useEffect, useState } from 'react';
import { techLogos } from '@/lib/tech-logos';
import styles from './logo-cube.module.css';

const FACES = ['front', 'back', 'right', 'left', 'top', 'bottom'];

/**
 * Small CSS-3D cube cycling technology logos.
 *
 * Deliberately CSS rather than WebGL: it is a ~72px object living inside a
 * paragraph, so a third WebGL context would be a poor trade, and CSS 3D keeps
 * it in the same coordinate space as the text flowing around it.
 */
export const LogoCube = ({ size = 72, spin = true }) => {
  const [offset, setOffset] = useState(0);

  // Six faces, more logos than faces — rotate the window round every few
  // seconds so the whole stack gets shown.
  useEffect(() => {
    if (!spin) return undefined;
    const id = setInterval(() => setOffset(o => (o + 6) % techLogos.length), 5200);
    return () => clearInterval(id);
  }, [spin]);

  return (
    <div className={styles.scene} style={{ width: size, height: size }}>
      <div className={styles.cube} data-spin={spin}>
        {FACES.map((face, index) => {
          const logo = techLogos[(offset + index) % techLogos.length];
          return (
            <div
              className={styles.face}
              data-face={face}
              key={face}
              style={{ '--face-size': `${size}px` }}
            >
              <svg viewBox="0 0 24 24" className={styles.glyph} aria-hidden>
                <path d={logo.path} fill={logo.hex} />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
