import Link from 'next/link';
import { Polaroid } from '@/components/polaroid/polaroid';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { projects } from '@/lib/content';
import styles from './projects.module.css';

/** Three featured on the home page; the full set lives at /projects. */
const featured = projects.slice(0, 3);

export const Projects = () => (
  <section className={styles.section} id="projects">
    <div className={styles.inner}>
      <Reveal>
        <SectionHeading
          eyebrow="Selected work"
          title="Things I built"
          lede="Each one has its own page — the problem it started from, how it was put together, and what came out the other end."
          aside="See every write-up →"
        />
      </Reveal>

      <RevealGroup as="ul" className={styles.grid}>
        {featured.map(project => (
          <RevealItem as="li" key={project.id}>
            <article className={styles.card}>
              <div className={styles.photo}>
                <Polaroid alt={`${project.name} render`} caption={project.subtitle} size="md" />
              </div>

              <p className={styles.index}>No. {project.index}</p>

              <h3 className={styles.name}>
                <Link className={styles.nameLink} href={`/projects/${project.slug}`}>
                  {project.name}
                </Link>
              </h3>

              <p className={styles.description}>{project.description}</p>

              <ul className={styles.stack}>
                {project.stack.slice(0, 3).map(tech => (
                  <li className={styles.tech} key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>

              <Link className={styles.button} href={`/projects/${project.slug}`}>
                Read the full write-up
                <span className={styles.arrow} aria-hidden>
                  ›
                </span>
                <span className={styles.srOnly}> about {project.name}</span>
              </Link>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className={styles.foot}>
        <Link className={styles.footLink} href="/projects">
          See all {projects.length} projects
          <span className={styles.arrow} aria-hidden>
            ›
          </span>
        </Link>
      </div>
    </div>
  </section>
);
