'use client';

import { useEffect, useRef, useState } from 'react';
import cardStyles from '@/app/work/page.module.css';
import { experience } from '@/lib/content';
import styles from './experience-sequence.module.css';

/**
 * Sticky scroll sequence for the full work history: a pinned "current chapter"
 * rail tracks whichever job card is centred in the viewport as you scroll
 * past it, like a console menu that highlights the selected save file.
 */
export const ExperienceSequence = () => {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActive(index);
          }
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0 }
    );

    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const current = experience[active];

  return (
    <div className={styles.grid}>
      <div className={styles.rail} aria-hidden>
        <p className={styles.railLabel}>Now viewing</p>
        <p className={styles.railPeriod}>{current.period}</p>
        <p className={styles.railRole}>{current.role}</p>
        <p className={styles.railCompany}>{current.company}</p>
        <div className={styles.railTrack}>
          {experience.map((job, index) => (
            <span className={styles.railDot} data-active={index === active} key={job.id} />
          ))}
        </div>
      </div>

      <ol className={styles.track}>
        {experience.map((job, index) => (
          <li
            className={styles.step}
            key={job.id}
            data-index={index}
            ref={el => {
              stepRefs.current[index] = el;
            }}
          >
            <div className={cardStyles.meta}>
              <p className={cardStyles.period}>{job.period}</p>
              {job.current && <span className={cardStyles.badge}>Current</span>}
            </div>

            <div className={cardStyles.card}>
              <h3 className={cardStyles.role}>{job.role}</h3>
              <p className={cardStyles.company}>
                {job.company}
                <span className={cardStyles.scope}>{job.scope}</span>
              </p>

              <ul className={cardStyles.points}>
                {job.points.map(point => (
                  <li className={cardStyles.point} key={point}>
                    {point}
                  </li>
                ))}
              </ul>

              <ul className={cardStyles.tags}>
                {job.tags.map(tag => (
                  <li className={cardStyles.tag} key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
