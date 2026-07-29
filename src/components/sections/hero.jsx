import { DisplacementSphere } from '@/components/displacement-sphere/displacement-sphere';
import { Polaroid } from '@/components/polaroid/polaroid';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { links, profile, stats } from '@/lib/content';
import styles from './hero.module.css';

const entries = [
  { label: 'Name', value: profile.name },
  { label: 'Currently', value: profile.status.headline },
  { label: 'Based in', value: `${profile.location} · ${profile.timezone}` },
  { label: 'Working on', value: 'Agentic AI platforms & the infra under them' },
  { label: 'Studied', value: 'M.Sc. Artificial Intelligence, Heriot-Watt' },
  { label: 'Ask me about', value: 'RAG, Kubernetes, why your LLM bill is that big' },
];

/**
 * Opens on the dark navy band — BMW's structural signature — with a
 * theme-aware displacement sphere turning behind the headline. The band is
 * `position: sticky`, so the light panel beneath scrolls up and over it: one
 * sticky scroll sequence, no scroll-jacking, `prefers-reduced-motion` still
 * gets the same layout without the pinning motion (see the media query in
 * hero.module.css).
 */
export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.darkBand}>
      <div className={styles.sphere} aria-hidden>
        <DisplacementSphere />
      </div>

      <div className={styles.darkInner}>
        <Reveal as="p" className={styles.kicker}>
          {profile.role}
        </Reveal>
        <Reveal as="h1" className={styles.title} delay={0.05}>
          {profile.name}
        </Reveal>
        <Reveal as="p" className={styles.subtitle} delay={0.1}>
          {profile.headline}
        </Reveal>

        <Reveal className={styles.status} delay={0.16}>
          <p className={styles.statusHead}>
            <span className={styles.statusDot} aria-hidden />
            {profile.status.headline}
          </p>
          <p className={styles.statusDetail}>{profile.status.detail}</p>
          <ul className={styles.openTo}>
            {profile.status.openTo.map(item => (
              <li className={styles.openToItem} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.actions} delay={0.22}>
          <a className={styles.primary} href="#contact">
            Get in touch
          </a>
          {links.resume && (
            <a className={styles.secondary} href={links.resume} download>
              Download CV
            </a>
          )}
          <a className={styles.secondary} href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className={styles.secondary} href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </Reveal>
      </div>
    </div>

    <div className={styles.lightPanel}>
      <div className={styles.inner}>
        <div className={styles.body}>
          <Reveal as="div" className={styles.entryCard}>
            <dl className={styles.entries}>
              {entries.map(entry => (
                <div className={styles.entry} key={entry.label}>
                  <dt className={styles.entryLabel}>{entry.label}</dt>
                  <dd className={styles.entryValue}>{entry.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal as="aside" className={styles.photos} delay={0.08}>
            <Polaroid alt="Portrait of Priyansh" caption="Priyansh Gupta" size="lg" />
          </Reveal>
        </div>

        <RevealGroup as="dl" className={styles.stats}>
          {stats.map(stat => (
            <RevealItem as="div" className={styles.stat} key={stat.label}>
              <dt className={styles.statValue}>{stat.value}</dt>
              <dd className={styles.statLabel}>{stat.label}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  </section>
);
