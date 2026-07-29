'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import styles from './device-mockup.module.css';

const springConfig = { stiffness: 120, damping: 22, mass: 0.6 };

/**
 * Expo's signature device-mockup hero, built from real CSS 3D transforms
 * (perspective + preserve-3d) rather than a sourced 3D model or screenshot —
 * a "laptop" card and a "phone" card, each holding an abstract dashboard UI,
 * floating over the sky-gradient wash. Tilts gently toward the pointer and
 * settles into a slightly different pose as the hero scrolls past.
 *
 * Under prefers-reduced-motion the pose is static: no pointer tilt, no
 * scroll-linked transforms, just the fixed 3D layout.
 */
export const DeviceMockup = () => {
  const wrapRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltY = useSpring(pointerX, springConfig);
  const tiltX = useSpring(pointerY, springConfig);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  });

  const scrollTilt = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -10]);
  const scrollLift = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -56]);
  const scrollFade = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.35]);

  useEffect(() => {
    if (reduceMotion) return;

    const onPointerMove = event => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      pointerX.set(nx * 16);
      pointerY.set(-ny * 10);
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduceMotion, pointerX, pointerY]);

  return (
    <div className={styles.wrap} ref={wrapRef} aria-hidden>
      <motion.div
        className={styles.stage}
        style={{
          rotateY: reduceMotion ? -8 : tiltY,
          rotateX: reduceMotion ? 10 : tiltX,
          y: scrollLift,
          opacity: scrollFade,
        }}
      >
        <motion.div className={styles.laptop} style={{ rotateX: scrollTilt }}>
          <div className={styles.laptopScreen}>
            <div className={styles.screenChrome}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.screenTab}>gateway.dashboard</span>
            </div>
            <div className={styles.screenBody}>
              <div className={styles.nav}>
                <span className={styles.navBrand} />
                {['Routing', 'Tenants', 'Guardrails', 'Cost', 'Traces'].map(label => (
                  <span className={styles.navItem} key={label}>
                    {label}
                  </span>
                ))}
              </div>
              <div className={styles.panel}>
                <div className={styles.panelRow}>
                  <span className={styles.chip} data-tone="link">
                    99.9% uptime
                  </span>
                  <span className={styles.chip}>500–5K users</span>
                </div>
                <div className={styles.chart}>
                  {[38, 62, 46, 80, 54, 91, 70, 58, 84, 66].map((height, index) => (
                    <span
                      className={styles.bar}
                      key={index}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className={styles.rows}>
                  <span className={styles.rowLine} />
                  <span className={styles.rowLine} />
                  <span className={styles.rowLine} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.laptopBase} />
        </motion.div>

        <motion.div className={styles.phone} style={{ rotateX: scrollTilt }}>
          <div className={styles.phoneNotch} />
          <div className={styles.phoneScreen}>
            <div className={styles.phoneStatus}>
              <span>9:41</span>
              <span>●●●</span>
            </div>
            <div className={styles.phoneHeader}>Agentic Runs</div>
            <div className={styles.phoneList}>
              {['Scout → Critic', 'Checkpoint saved', 'Trace exported'].map(label => (
                <div className={styles.phoneRow} key={label}>
                  <span className={styles.phoneDotOk} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className={styles.phoneCta}>Deploy</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
