import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { PageHeader } from '@/components/page-header/page-header';
import { Polaroid } from '@/components/polaroid/polaroid';
import { RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { projects } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: 'Projects',
  description:
    'Platforms, agents and knowledge graphs — each project written up end to end, from the problem it started with to what came out the other side.',
};

export default function ProjectsIndexPage() {
  return (
    <>
      <Nav />

      <PageHeader
        crumbs={[{ label: 'Projects' }]}
        kicker="The index"
        title="Projects"
        tagline="Each one written up end to end — the problem it started from, how it was put together, and what came out the other side."
        meta={[
          { label: 'Count', value: `${projects.length} write-ups` },
          { label: 'Span', value: '2021 — 2026' },
        ]}
      />

      <main className={styles.main}>
        <RevealGroup as="ul" className={styles.list}>
          {projects.map(project => (
            <RevealItem as="li" key={project.id}>
              <article className={styles.card}>
                <div className={styles.photo}>
                  <Polaroid
                    alt={`${project.name} screenshot`}
                    caption={project.name}
                    tilt={project.index % 2 ? 'left' : 'right'}
                    size="md"
                    tape="top"
                  />
                </div>

                <div className={styles.text}>
                  <p className={styles.index}>No. {project.index}</p>

                  <h2 className={styles.name}>
                    <Link className={styles.nameLink} href={`/projects/${project.slug}`}>
                      {project.name}
                    </Link>
                  </h2>

                  <p className={styles.subtitle}>{project.subtitle}</p>
                  <p className={styles.description}>{project.description}</p>

                  <ul className={styles.stack}>
                    {project.stack.slice(0, 5).map(tech => (
                      <li className={styles.tech} key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <Link className={styles.button} href={`/projects/${project.slug}`}>
                    Read the full write-up
                    <span className={styles.buttonArrow} aria-hidden>
                      →
                    </span>
                    <span className={styles.srOnly}> about {project.name}</span>
                  </Link>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className={styles.foot}>
          <Link className={styles.footLink} href="/">
            ← Back to the home page
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
