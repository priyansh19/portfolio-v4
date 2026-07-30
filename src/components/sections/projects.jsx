import Link from 'next/link';
import { Polaroid } from '@/components/polaroid/polaroid';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { projects } from '@/lib/content';
import styles from './projects.module.css';
import { FlowParagraph } from '@/components/flow-paragraph/flow-paragraph';

/** Three featured on the home page; the full set lives at /projects. */
const featured = projects.slice(0, 3);

export const Projects = () => (
  <section className={styles.section} id="projects">
    <div className={styles.inner}>
      <SectionHeading
        eyebrow="Projects"
        title="Things I built"
        lede="Each one has its own page — the problem it started from, how it was put together, and what came out the other end."
      />

      <RevealGroup as="ul" className={styles.list}>
        {featured.map(project => (
          <RevealItem as="li" key={project.id}>
            <article className={styles.card}>
              <div className={styles.photo}>
                <Polaroid
                  alt={`${project.name} screenshot`}
                  caption={project.name}
                  size="md"
                />
              </div>

              <div className={styles.text}>
                <p className={styles.index}>No. {project.index}</p>

                {/* The heading links too, so the card has a real target for
                    assistive tech and search, not just the button. */}
                <h3 className={styles.name}>
                  <Link className={styles.nameLink} href={`/projects/${project.slug}`}>
                    {project.name}
                  </Link>
                </h3>

                <p className={styles.subtitle}>{project.subtitle}</p>
                <FlowParagraph className={styles.description} text={project.description} />

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
                  <span className="srOnly"> about {project.name}</span>
                </Link>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className={styles.foot}>
        <Link className={styles.footLink} href="/projects">
          See all {projects.length} projects →
        </Link>
      </Reveal>
    </div>
  </section>
);
