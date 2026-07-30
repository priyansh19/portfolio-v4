import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { freelance } from '@/lib/content';
import styles from './freelance-section.module.css';
import { FlowParagraph } from '@/components/flow-paragraph/flow-paragraph';

export const FreelanceSection = () => (
  <section className={styles.section} id="freelance">
    <div className={styles.inner}>
      <SectionHeading
        eyebrow="Freelance"
        title="Freelance & consulting"
        lede={freelance.intro}
        aside={`${freelance.period} · ${freelance.channel}`}
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          <h3 className={styles.subheading}>What I take on</h3>
          <RevealGroup as="ul" className={styles.services}>
            {freelance.services.map(service => (
              <RevealItem as="li" className={styles.service} key={service.id}>
                <span className={styles.serviceTitle}>{service.title}</span>
                <FlowParagraph className={styles.serviceBody} text={service.body} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <aside className={styles.side}>
          <dl className={styles.stats}>
            {freelance.stats.map(stat => (
              <div className={styles.stat} key={stat.label}>
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.process}>
            <h3 className={styles.subheading}>How it runs</h3>
            <ol className={styles.processList}>
              {freelance.process.map(phase => (
                <li className={styles.phase} key={phase.step}>
                  <span className={styles.phaseStep}>{phase.step}</span>
                  <span className={styles.phaseTitle}>{phase.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      <Reveal className={styles.cta}>
        <p className={styles.ctaNote}>
          The full breakdown — every service, the process end to end, and what past
          engagements looked like.
        </p>
        <Link className={styles.ctaButton} href="/freelance">
          See my freelance work →
        </Link>
      </Reveal>
    </div>
  </section>
);
