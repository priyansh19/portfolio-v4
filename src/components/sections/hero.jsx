import { HardwareRig } from '@/components/hardware-rig/hardware-rig';
import { ParticleField } from '@/components/particle-field/particle-field';
import { Polaroid } from '@/components/polaroid/polaroid';
import { Reveal } from '@/components/reveal/reveal';
import { links, profile, stats } from '@/lib/content';
import styles from './hero.module.css';

/** System info readout — the "about me" facts as a console status panel. */
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
    <div className={styles.stage} aria-hidden>
      <div className={styles.circuit}>
        <ParticleField />
      </div>
      <div className={styles.rig}>
        <HardwareRig />
      </div>
    </div>

    <div className={styles.inner}>
      <Reveal as="div" className={styles.head}>
        <p className={styles.kicker}>Player file</p>
        <h1 className={styles.title}>{profile.name}</h1>
        <p className={styles.subtitle}>{profile.headline}</p>
      </Reveal>

      {/* The first question every visitor has, answered above the fold */}
      <Reveal as="div" className={styles.status} delay={0.05}>
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
        <Reveal as="div" className={styles.entryCard} delay={0.1}>
          <p className={styles.entryTitle}>System info</p>
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
        </Reveal>

        <Reveal as="aside" className={styles.photos} delay={0.15}>
          <Polaroid
            alt="Portrait of Priyansh"
            caption="me, allegedly"
            tilt="right"
            size="lg"
            tape="corner"
          />
        </Reveal>
      </div>

      <Reveal as="div" className={styles.footRow} delay={0.05}>
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
      </Reveal>
    </div>
  </section>
);
