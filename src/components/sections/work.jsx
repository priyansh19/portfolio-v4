import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { experience } from '@/lib/content';
import styles from './work.module.css';

/**
 * Home-page teaser. The full bullets live at /work — repeating them here would
 * put the same text on two URLs.
 */
export const Work = () => (
  <section className={styles.section} id="work">
    <div className={styles.inner}>
      <Reveal>
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked"
          lede="Five years at one company, moving from Terraform modules to leading enterprise GenAI delivery — with consulting alongside it."
        />
      </Reveal>

      <RevealGroup as="ol" className={styles.list}>
        {experience.map(job => (
          <RevealItem as="li" className={styles.item} key={job.id}>
            <p className={styles.period}>{job.period}</p>

            <div className={styles.detail}>
              <h3 className={styles.role}>
                {job.role}
                {job.current && <span className={styles.badge}>Current</span>}
              </h3>
              <p className={styles.company}>
                {job.company}
                <span className={styles.scope}>{job.scope}</span>
              </p>
              <p className={styles.summary}>{job.points[0]}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className={styles.foot}>
        <Link className={styles.footLink} href="/work">
          Read the full history
          <span className={styles.arrow} aria-hidden>
            ›
          </span>
        </Link>
      </div>
    </div>
  </section>
);
