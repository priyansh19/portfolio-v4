import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GeometricForm } from '@/components/geometric-form/geometric-form';
import { Nav } from '@/components/nav/nav';
import { PageHeader } from '@/components/page-header/page-header';
import { Polaroid } from '@/components/polaroid/polaroid';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { projectBySlug, projects } from '@/lib/content';
import styles from './page.module.css';

const evidenceLabel = {
  proprietary: 'Client work — not public',
  'open-source': 'Open source',
  academic: 'Academic',
};

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projectBySlug(slug);

  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} — ${project.subtitle}`,
      description: project.description,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projectBySlug(slug);

  if (!project) notFound();

  const position = projects.findIndex(item => item.id === project.id);
  const previous = position > 0 ? projects[position - 1] : null;
  const next = position < projects.length - 1 ? projects[position + 1] : null;

  return (
    <>
      <Nav />

      <PageHeader
        crumbs={[{ label: 'Projects', href: '/projects' }, { label: project.name }]}
        kicker={`No. ${project.index} — ${project.subtitle}`}
        title={project.name}
        tagline={project.tagline}
        meta={[
          { label: 'Year', value: project.year },
          { label: 'Context', value: project.context },
          { label: 'Role', value: project.role },
        ]}
        visual={<GeometricForm shape={project.shape} />}
      />

      <main className={styles.main}>
        <div className={styles.layout}>
          <article className={styles.article}>
            <section className={styles.block}>
              <h2 className={styles.blockTitle}>The problem</h2>
              <div className="prose">
                {project.problem.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className={styles.block}>
              <h2 className={styles.blockTitle}>How it was built</h2>
              <ol className={styles.steps}>
                {project.approach.map((step, index) => (
                  <li className={styles.step} key={step.title}>
                    <span className={styles.stepNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className={styles.stepBody}>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepText}>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {project.architecture && (
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>How it fits together</h2>
                <p className={styles.caption}>{project.architecture.caption}</p>

                <ol className={styles.diagram}>
                  {project.architecture.layers.map(layer => (
                    <li className={styles.layer} key={layer.id}>
                      <span className={styles.layerLabel}>{layer.label}</span>
                      <span className={styles.layerNodes}>
                        {layer.nodes.map(node => (
                          <span className={styles.node} key={node}>
                            {node}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className={styles.block}>
              <h2 className={styles.blockTitle}>Worth noting</h2>
              <ul className={styles.highlights}>
                {project.highlights.map(item => (
                  <li className={styles.highlight} key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className={styles.sidebar}>
            {/* Two shots of the project, taped at opposing angles */}
            <div className={styles.photos}>
              {project.photos.map((photo, index) => (
                <Polaroid
                  key={photo.alt}
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  tilt={index % 2 ? 'left' : 'right'}
                  tape={index % 2 ? 'top' : 'corner'}
                  size="lg"
                />
              ))}
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Evidence</h2>
              <p className={styles.evidenceKind} data-kind={project.evidence.kind}>
                {evidenceLabel[project.evidence.kind]}
              </p>
              <p className={styles.evidenceNote}>{project.evidence.note}</p>

              {project.evidence.paper && (
                <a className={styles.repoLink} href={project.evidence.paper}>
                  Read the dissertation →
                </a>
              )}
              {project.repo && (
                <a
                  className={styles.repoLink}
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View the repository →
                </a>
              )}
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Outcomes</h2>
              <dl className={styles.outcomes}>
                {project.outcomes.map(outcome => (
                  <div className={styles.outcome} key={outcome.label}>
                    <dt className={styles.outcomeValue}>{outcome.value}</dt>
                    <dd className={styles.outcomeLabel}>{outcome.label}</dd>
                    {outcome.basis && (
                      <dd className={styles.outcomeBasis}>{outcome.basis}</dd>
                    )}
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Built with</h2>
              <ul className={styles.stack}>
                {project.stack.map(tech => (
                  <li className={styles.tech} key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {/* Jump straight to any other project, not just the neighbours */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Other projects</h2>
              <ul className={styles.jumpList}>
                {projects
                  .filter(item => item.id !== project.id)
                  .map(item => (
                    <li key={item.id}>
                      <Link className={styles.jumpLink} href={`/projects/${item.slug}`}>
                        <span className={styles.jumpIndex}>{item.index}</span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>

        <nav className={styles.pager} aria-label="Other projects">
          {previous ? (
            <Link className={styles.pagerLink} href={`/projects/${previous.slug}`}>
              <span className={styles.pagerLabel}>← Previous</span>
              <span className={styles.pagerName}>{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}

          <Link className={styles.pagerUp} href="/projects">
            All projects
          </Link>

          {next ? (
            <Link className={`${styles.pagerLink} ${styles.pagerNext}`} href={`/projects/${next.slug}`}>
              <span className={styles.pagerLabel}>Next →</span>
              <span className={styles.pagerName}>{next.name}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>

      <SiteFooter />
    </>
  );
}
