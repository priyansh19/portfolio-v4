'use client';

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { experience } from '@/lib/content';
import styles from './work.module.css';
import { FlowParagraph } from '@/components/flow-paragraph/flow-paragraph';

/**
 * Home-page teaser, built as a sticky scroll sequence: the panel on the right
 * pins in place while the left rail advances through each role as the section
 * scrolls past. Falls back to a plain static list under reduced motion — no
 * tall scroll runway, no pinning, no scroll-linked state change, just the
 * same content read top to bottom.
 *
 * The ref stays on the outer <section> in both branches so framer-motion
 * always has a real element to measure, and a visually-hidden list keeps the
 * full role summary in the accessibility tree even while the animated stage
 * only shows one role at a time.
 */
export const Work = () => {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (reduceMotion) return;
    const index = Math.min(
      experience.length - 1,
      Math.max(0, Math.floor(value * experience.length))
    );
    setActive(index);
  });

  const activeJob = experience[active];

  return (
    <section
      className={styles.section}
      id="work"
      ref={wrapRef}
      style={reduceMotion ? undefined : { height: `${experience.length * 80}vh` }}
    >
      <div className={reduceMotion ? undefined : styles.stickyInner}>
        <div className={styles.inner}>
          <SectionHeading
            eyebrow="Experience"
            title="Where I've worked"
            lede="Five years at one company, moving from Terraform modules to leading enterprise GenAI delivery — with consulting alongside it."
          />

          {reduceMotion ? (
            <ol className={styles.staticList}>
              {experience.map(job => (
                <li className={styles.staticItem} key={job.id}>
                  <p className={styles.staticPeriod}>{job.period}</p>
                  <h3 className={styles.staticRole}>{job.role}</h3>
                  <p className={styles.staticCompany}>{job.company}</p>
                  <p className={styles.staticSummary}>{job.points[0]}</p>
                </li>
              ))}
            </ol>
          ) : (
            <>
              {/* Accessible source of truth — the animated stage below is a
                  decorative re-presentation of the same content. */}
              <ul className="srOnly">
                {experience.map(job => (
                  <li key={job.id}>
                    {job.role} — {job.company} ({job.period}). {job.points[0]}
                  </li>
                ))}
              </ul>

              <div className={styles.stage} aria-hidden>
                <ol className={styles.rail}>
                  {experience.map((job, index) => (
                    <li className={styles.railItem} data-active={index === active} key={job.id}>
                      <span className={styles.railPeriod}>{job.period}</span>
                      <span className={styles.railRole}>
                        {job.role}
                        {job.current && <span className={styles.badge}>Current</span>}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className={styles.scene}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeJob.id}
                      className={styles.sceneCard}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className={styles.sceneCompany}>
                        {activeJob.company}
                        <span className={styles.sceneScope}>{activeJob.scope}</span>
                      </p>
                      <h3 className={styles.sceneRole}>{activeJob.role}</h3>
                      <ul className={styles.scenePoints}>
                        {activeJob.points.slice(0, 3).map(point => (
                          <li key={point}>
                            <FlowParagraph text={point} />
                          </li>
                        ))}
                      </ul>
                      <ul className={styles.sceneTags}>
                        {activeJob.tags.map(tag => (
                          <li className={styles.tag} key={tag}>
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}

          <div className={styles.foot}>
            <Link className={styles.footLink} href="/work">
              Read the full history →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
