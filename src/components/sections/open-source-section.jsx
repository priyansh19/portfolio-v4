import Link from 'next/link';
import { RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { openSource } from '@/lib/content';
import styles from './open-source-section.module.css';

/** Merged upstream patches worth calling out on the home page. */
const featured = openSource.upstream
  .flatMap(repo => repo.highlights.map(pr => ({ ...pr, org: repo.org })))
  .filter(pr => pr.merged && pr.note)
  .slice(0, 2);

export const OpenSourceSection = () => (
  <section className={styles.section} id="open-source">
    <div className={styles.inner}>
      <SectionHeading
        eyebrow="Stage 04"
        title="Open source"
        lede={openSource.intro}
        aside={`contributing as @${openSource.handle} since ${openSource.since}`}
      />

      <dl className={styles.stats}>
        {openSource.stats.map(stat => (
          <div className={styles.stat} key={stat.label}>
            <dt className={styles.statValue}>{stat.value}</dt>
            <dd className={styles.statLabel}>{stat.label}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.layout}>
        <div className={styles.column}>
          <h3 className={styles.subheading}>Projects I contribute to</h3>
          <RevealGroup as="ul" className={styles.orgs}>
            {openSource.upstream.map(repo => (
              <RevealItem as="li" className={styles.org} key={repo.id}>
                <span className={styles.orgName}>{repo.org}</span>
                <span className={styles.orgDescription}>{repo.description}</span>
                <span className={styles.orgCounts}>
                  <span className={styles.orgCount} data-merged={repo.merged > 0}>
                    {repo.merged} merged
                  </span>
                  <span className={styles.orgCount}>{repo.opened} opened</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className={styles.column}>
          <h3 className={styles.subheading}>Patches worth mentioning</h3>
          <ul className={styles.prs}>
            {featured.map(pr => (
              <li className={styles.pr} key={pr.url}>
                <span className={styles.prHead}>
                  <span className={styles.prNumber}>
                    {pr.org} {pr.number}
                  </span>
                  <span className={styles.prBadge}>Merged</span>
                </span>
                <span className={styles.prTitle}>{pr.title}</span>
                <span className={styles.prNote}>{pr.note}</span>
              </li>
            ))}
          </ul>

          <h3 className={`${styles.subheading} ${styles.subheadingSpaced}`}>
            Projects I maintain
          </h3>
          <ul className={styles.repos}>
            {openSource.maintained.slice(0, 4).map(project => (
              <li className={styles.repo} key={project.name}>
                <span className={styles.repoName}>{project.name}</span>
                <span className={styles.repoNote}>{project.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.cta}>
        <p className={styles.ctaNote}>
          Every upstream patch, every repo, with merged status marked honestly.
        </p>
        <Link className={styles.ctaButton} href="/open-source">
          See all my contributions →
        </Link>
      </div>
    </div>
  </section>
);
