'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered reveal. Fires once, respects prefers-reduced-motion
 * (which collapses to a plain fade so content never pops in unannounced).
 */
export const Reveal = ({
  children,
  as = 'div',
  delay = 0,
  y = 28,
  blur = true,
  className,
  ...rest
}) => {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y, filter: blur ? 'blur(8px)' : 'blur(0px)' };

  const shown = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/**
 * Staggers direct children. Pair with <RevealItem>.
 */
export const RevealGroup = ({ children, as = 'div', className, stagger = 0.08, ...rest }) => {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ shown: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export const RevealItem = ({ children, as = 'div', className, y = 24, ...rest }) => {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};
