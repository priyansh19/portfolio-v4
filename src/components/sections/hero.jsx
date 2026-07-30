import Link from 'next/link';
import { FlowParagraph } from '@/components/flow-paragraph/flow-paragraph';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { ScrambleText } from '@/components/scramble-text/scramble-text';
import { links, profile, stats } from '@/lib/content';
import styles from './hero.module.css';

export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.inner}>
      {/* Copy sits left, mockup rides up beside it — a centred stack left a
          dead band of empty canvas between the buttons and the device. */}
      <div className={styles.copy}>
        <Reveal className={styles.statusPill} as="p">
          <span className={styles.statusDot} aria-hidden />
          {profile.status.headline}
        </Reveal>

        <Reveal as="h1" className={styles.title} delay={0.05}>
          {profile.name}
        </Reveal>

        <Reveal as="p" className={styles.subtitle} delay={0.1}>
          {profile.role} —{' '}
          <ScrambleText words={profile.titles} className={styles.scramble} />
        </Reveal>

        {/* Text re-wraps live around the cube walking through it */}
        <Reveal className={styles.introWrap} delay={0.15}>
          <FlowParagraph className={styles.intro} text={profile.intro} />
        </Reveal>

        <Reveal className={styles.actions} delay={0.2}>
          <a className={styles.primary} href="#contact">
            Get in touch
          </a>
          <Link className={styles.secondary} href="/projects">
            See the work
            <span aria-hidden> →</span>
          </Link>
          {links.resume && (
            <a className={styles.textLink} href={links.resume} download>
              Download CV
            </a>
          )}
        </Reveal>
      </div>

      {/* Reserves the orb's slot in the layout. The orb itself is a fixed
          layer mounted in the root layout so it survives scroll and route
          changes — it parks over this anchor, then docks to the corner. */}
      <div className={styles.mockupWrap}>
        <div className={styles.agentAnchor} id="agent-anchor" aria-hidden />
      </div>

      <RevealGroup className={styles.stats}>
        {stats.map(stat => (
          <RevealItem className={styles.stat} key={stat.label}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  </section>
);
