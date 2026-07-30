import Link from 'next/link';
import { VoiceOrb } from '@/components/voice-orb/voice-orb';
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

        <Reveal as="p" className={styles.intro} delay={0.15}>
          {profile.intro}
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

      {/* Placeholder for the voice assistant. Once it is wired up, drive this
          with `state` and `amplitude` (0..1) from the audio analyser. */}
      <Reveal delay={0.25} className={styles.mockupWrap}>
        <VoiceOrb />
      </Reveal>

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
