import { DisplacementSphere } from '@/components/displacement-sphere/displacement-sphere';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { links, profile, stats } from '@/lib/content';
import styles from './hero.module.css';

/** Quick facts, presented as a compact editorial fact sheet. */
const entries = [
  { label: 'Based in', value: `${profile.location} · ${profile.timezone}` },
  { label: 'Working on', value: 'Agentic AI platforms & the infra under them' },
  { label: 'Studied', value: 'M.Sc. Artificial Intelligence, Heriot-Watt' },
  { label: 'Ask me about', value: 'RAG, Kubernetes, why your LLM bill is that big' },
];

export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.scene} aria-hidden>
      <DisplacementSphere />
    </div>

    <div className={styles.inner}>
      <Reveal as="p" className={styles.kicker}>
        {profile.role}
      </Reveal>

      <Reveal as="h1" className={styles.title} delay={0.05}>
        {profile.name}
      </Reveal>

      <Reveal as="p" className={styles.subtitle} delay={0.1}>
        {profile.headline}
      </Reveal>

      {/* The first question every visitor has, answered above the fold */}
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

      <div className={styles.body}>
        <RevealGroup className={styles.entryCard}>
          <dl className={styles.entries}>
            {entries.map(entry => (
              <RevealItem as="div" className={styles.entry} key={entry.label}>
                <dt className={styles.entryLabel}>{entry.label}</dt>
                <dd className={styles.entryValue}>{entry.value}</dd>
              </RevealItem>
            ))}
          </dl>

          <p className={styles.note}>
            Five years of building things that have to survive Monday morning.
          </p>
        </RevealGroup>

        <RevealGroup className={styles.stats} as="dl">
          {stats.map(stat => (
            <RevealItem as="div" className={styles.stat} key={stat.label}>
              <dt className={styles.statValue}>{stat.value}</dt>
              <dd className={styles.statLabel}>{stat.label}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Reveal className={styles.actions} delay={0.1}>
        <a className={styles.primary} href="#contact">
          Get in touch
        </a>
        {/* Only rendered once a real file exists, so it never 404s */}
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
  </section>
);
