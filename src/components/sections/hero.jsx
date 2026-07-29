import Link from 'next/link';
import { DeviceMockup } from '@/components/device-mockup/device-mockup';
import { ParticleField } from '@/components/particle-field/particle-field';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { ScrambleText } from '@/components/scramble-text/scramble-text';
import { links, profile, stats } from '@/lib/content';
import styles from './hero.module.css';

export const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.sky} aria-hidden />
    <ParticleField className={styles.particles} />

    <div className={styles.inner}>
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

      <Reveal delay={0.25} className={styles.mockupWrap}>
        <DeviceMockup />
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
