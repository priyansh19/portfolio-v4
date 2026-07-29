import { ExperienceSequence } from '@/components/experience-sequence/experience-sequence';
import { Nav } from '@/components/nav/nav';
import { PageHeader } from '@/components/page-header/page-header';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { careerNarrative, experience, experienceNote } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: 'Work',
  description:
    'Five years across infrastructure as code, production Kubernetes platforms and enterprise GenAI delivery.',
};

export default function WorkPage() {
  return (
    <>
      <Nav />

      <PageHeader
        crumbs={[{ label: 'Work' }]}
        kicker="Experience"
        title="Where I've worked"
        tagline="Five years at one company, moving from Terraform modules to leading enterprise GenAI delivery — plus consulting alongside it."
        meta={[
          { label: 'Span', value: 'May 2021 — present' },
          { label: 'Roles', value: `${experience.length} positions` },
          { label: 'Based', value: 'Dubai, UAE' },
        ]}
      />

      <main className={styles.main}>
        <section className={styles.narrative}>
          <h2 className={styles.narrativeTitle}>{careerNarrative.title}</h2>
          <div className="prose">
            {careerNarrative.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The roles</h2>

          {experienceNote && <p className={styles.note}>{experienceNote}</p>}

          <ExperienceSequence />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
