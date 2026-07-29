import { Polaroid } from '@/components/polaroid/polaroid';
import { links, profile, stats } from '@/lib/content';
import styles from './hero.module.css';

/** Slam-book front page: the "about me" entries filled in by hand. */
const entries = [
  { label: 'Name', value: profile.name },
  { label: 'Currently', value: profile.status.headline },
  { label: 'Based in', value: `${profile.location} · ${profile.timezone}` },
  { label: 'Working on', value: 'Agentic AI platforms & the infra under them' },
  { label: 'Studied', value: 'M.Sc. Artificial Intelligence, Heriot-Watt' },
  { label: 'Ask me about', value: 'RAG, Kubernetes, why your LLM bill is that big' },
];

export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.inner}>
      <div className={styles.head}>
        <p className={styles.kicker}>This book belongs to</p>
        <h1 className={styles.title}>{profile.name}</h1>
        <p className={styles.subtitle}>{profile.headline}</p>
      </div>

      {/* The first question every visitor has, answered above the fold */}
      <div className={styles.status}>
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
      </div>

      <div className={styles.body}>
        <div className={styles.entryCard}>
          <dl className={styles.entries}>
            {entries.map(entry => (
              <div className={styles.entry} key={entry.label}>
                <dt className={styles.entryLabel}>{entry.label}</dt>
                <dd className={styles.entryValue}>{entry.value}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.note}>
            Five years of building things that have to survive Monday morning.
          </p>
        </div>

        <aside className={styles.photos}>
          <Polaroid
            alt="Portrait of Priyansh"
            caption="me, allegedly"
            tilt="right"
            size="lg"
            tape="corner"
          />
        </aside>
      </div>

      <div className={styles.footRow}>
        <dl className={styles.stats}>
          {stats.map(stat => (
            <div className={styles.stat} key={stat.label}>
              <dt className={styles.statValue}>{stat.value}</dt>
              <dd className={styles.statLabel}>{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.actions}>
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
        </div>
      </div>
    </div>
  </section>
);
