'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** A damped mechanical snap — panels click into place, they don't ease in. */
const snap = { type: 'spring', stiffness: 340, damping: 26, mass: 0.9 };

/**
 * Scroll-triggered reveal styled as a UI plate snapping into its slot: a
 * short drop plus a spring settle, no blur or cinematic easing. Fires once,
 * respects prefers-reduced-motion (which collapses to a plain instant fade).
 */
export const Reveal = ({ children, as = 'div', delay = 0, y = 22, className, ...rest }) => {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y, scale: 0.98 };
  const shown = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: '-80px' }}
      transition={reduceMotion ? { duration: 0.01 } : { ...snap, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/**
 * Staggers direct children. Pair with <RevealItem>.
 */
export const RevealGroup = ({ children, className, stagger = 0.07, ...rest }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="shown"
    viewport={{ once: true, margin: '-60px' }}
    variants={{ shown: { transition: { staggerChildren: stagger } } }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const RevealItem = ({ children, as = 'div', className, y = 20, ...rest }) => {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y, scale: 0.98 },
        shown: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: snap,
        },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};
