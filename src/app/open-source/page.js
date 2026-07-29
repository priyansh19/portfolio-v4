import { GeometricForm } from '@/components/geometric-form/geometric-form';
import { Nav } from '@/components/nav/nav';
import { PageHeader } from '@/components/page-header/page-header';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { openSource } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: openSource.title,
  description: openSource.intro,
};

export default function OpenSourcePage() {
  // Recent runtime work carries the signal; the 2019–2020 docs and CI patches
  // are real but shouldn't sit at the same weight.
  const recent = openSource.upstream.filter(repo => repo.tier === 'recent');
  const early = openSource.upstream.filter(repo => repo.tier === 'early');

  return (
    <>
      <Nav />

      <PageHeader
        crumbs={[{ label: openSource.title }]}
        kicker="Contributions"
        title={openSource.title}
        tagline={openSource.tagline}
        meta={[
          { label: 'GitHub', value: `@${openSource.handle}` },
          { label: 'Contributing since', value: openSource.since },
          { label: 'Merged PRs', value: openSource.stats[0].value },
        ]}
        visual={<GeometricForm shape="graph" />}
      />

      <main className={styles.main}>
        <section className={styles.intro}>
          <p className="prose">{openSource.intro}</p>

          <dl className={styles.stats}>
            {openSource.stats.map(stat => (
              <div className={styles.stat} key={stat.label}>
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent upstream work</h2>
          <p className={styles.sectionNote}>
            Patches to agent and LLM tooling I actually run. Merged status is marked per
            pull request — several are still open.
          </p>

          <ul className={styles.repos}>
            {recent.map(repo => (
              <li className={styles.repo} key={repo.id}>
                <header className={styles.repoHead}>
                  <div>
                    <h3 className={styles.repoName}>
                      <a href={repo.url} target="_blank" rel="noreferrer noopener">
                        {repo.org}
                      </a>
                    </h3>
                    <p className={styles.repoDescription}>{repo.description}</p>
                  </div>

                  <dl className={styles.repoCounts}>
                    <div className={styles.repoCount}>
                      <dt className={styles.repoCountLabel}>Merged</dt>
                      <dd className={styles.repoCountValue}>{repo.merged}</dd>
                    </div>
                    <div className={styles.repoCount}>
                      <dt className={styles.repoCountLabel}>Opened</dt>
                      <dd className={styles.repoCountValue}>{repo.opened}</dd>
                    </div>
                  </dl>
                </header>

                <ul className={styles.prList}>
                  {repo.highlights.map(pr => (
                    <li className={styles.pr} key={pr.url}>
                      <a
                        className={styles.prLink}
                        href={pr.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <span className={styles.prNumber}>{pr.number}</span>
                        <span className={styles.prBody}>
                          <span className={styles.prTitle}>{pr.title}</span>
                          {pr.note && <span className={styles.prNote}>{pr.note}</span>}
                        </span>
                        <span className={styles.prState} data-merged={pr.merged}>
                          {pr.merged ? 'Merged' : 'Open / closed'}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Earlier contributions</h2>
          <p className={styles.sectionNote}>
            Docs, CI and packaging work from 2019–2020, when I was starting out. Listed for
            completeness rather than as a headline.
          </p>

          <ul className={styles.earlyList}>
            {early.map(repo => (
              <li className={styles.early} key={repo.id}>
                <a
                  className={styles.earlyLink}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className={styles.earlyOrg}>{repo.org}</span>
                  <span className={styles.earlyDescription}>{repo.description}</span>
                  <span className={styles.earlyMeta}>
                    {repo.period} · {repo.merged} merged
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects I maintain</h2>
          <p className={styles.sectionNote}>
            Public repositories under{' '}
            <a href={openSource.profile} target="_blank" rel="noreferrer noopener">
              @{openSource.handle}
            </a>
            .
          </p>

          <ul className={styles.projects}>
            {openSource.maintained.map(project => (
              <li className={styles.project} key={project.name}>
                <a
                  className={styles.projectLink}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className={styles.projectHead}>
                    <span className={styles.projectName}>{project.name}</span>
                    <span className={styles.projectNote}>{project.note}</span>
                  </span>
                  <span className={styles.projectDescription}>{project.description}</span>
                  <span className={styles.projectLanguage}>{project.language}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.footnote}>
          Counts taken from the public GitHub API on 29 July 2026.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
