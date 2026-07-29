import Link from 'next/link';
import { Polaroid } from '@/components/polaroid/polaroid';
import { Reveal } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { certifications, education, profile } from '@/lib/content';
import styles from './about.module.css';

/** Home-page teaser. Full bio, skills and certifications live at /about. */
export const About = () => (
  <section className={styles.section} id="about">
    <div className={styles.inner}>
      <SectionHeading
        eyebrow="Chapter five"
        title="A bit more about me"
        lede={profile.headline}
      />

      <Reveal className={styles.layout}>
        <div className={styles.prose}>
          <p>
            I spend my time where research meets production. That has meant leading a team
            of ten through 20+ enterprise RAG rollouts, designing an LLM gateway that turned
            a multi-week deployment into an afternoon, and hardening the Kubernetes estate
            those systems run on.
          </p>

          <p className={styles.scribble}>
            The model is rarely the bottleneck. Identity, tenancy, evaluation, cost and
            rollback are.
          </p>

          <div className={styles.foot}>
            <Link className={styles.footLink} href="/about">
              Read the full bio, skills and certifications →
            </Link>
          </div>
        </div>

        <aside className={styles.side}>
          <Polaroid
            alt="Graduation or campus photo"
            caption="Heriot-Watt, 2026"
            tilt="right"
            size="lg"
            tape="corner"
          />

          <dl className={styles.quick}>
            <div className={styles.quickRow}>
              <dt className={styles.quickLabel}>Education</dt>
              <dd className={styles.quickValue}>{education.length} degrees</dd>
            </div>
            <div className={styles.quickRow}>
              <dt className={styles.quickLabel}>Certifications</dt>
              <dd className={styles.quickValue}>{certifications.length} held</dd>
            </div>
            <div className={styles.quickRow}>
              <dt className={styles.quickLabel}>Based</dt>
              <dd className={styles.quickValue}>Dubai · {profile.timezone}</dd>
            </div>
          </dl>
        </aside>
      </Reveal>
    </div>
  </section>
);
