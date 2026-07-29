import { Nav } from '@/components/nav/nav';
import { PageHeader } from '@/components/page-header/page-header';
import { Polaroid } from '@/components/polaroid/polaroid';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { certifications, education, profile, skillGroups } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: 'About',
  description: profile.headline,
};

/** Skills a certification actually backs — factual signal, not self-assessment. */
const certBacked = {
  ai: ['AI-102', 'AI-900'],
  cloud: ['AZ-104', 'AZ-900', 'AI-102'],
  devops: ['CKA', 'CKAD', 'AZ-400'],
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      <PageHeader
        crumbs={[{ label: 'About' }]}
        kicker="Who you are talking to"
        title="About me"
        tagline={profile.headline}
        meta={[
          { label: 'Based', value: profile.location },
          { label: 'Timezone', value: profile.timezone },
          { label: 'Status', value: profile.status.headline },
        ]}
      />

      <main className={styles.main}>
        <div className={styles.layout}>
          <div className={styles.prose}>
            <p>
              I spend my time where research meets production. That has meant leading a
              team of ten through 20+ enterprise RAG rollouts, designing an LLM gateway
              that turned a multi-week deployment into an afternoon, and hardening the
              Kubernetes estate those systems run on.
            </p>
            <p>
              The parts I care about are the unglamorous ones — document-level access
              control that actually holds, evaluation you can trust, cost curves that do
              not surprise anyone at the end of the quarter, and rollbacks that work on the
              first try.
            </p>
            <p>
              Currently based in {profile.location}, having wrapped an M.Sc. in Artificial
              Intelligence, and taking on selected consulting work.
            </p>

            <blockquote>
              The model is rarely the bottleneck. Identity, tenancy, evaluation, cost and
              rollback are.
            </blockquote>
          </div>

          <aside className={styles.side}>
            <Polaroid
              alt="Graduation or campus photo"
              caption="Heriot-Watt, 2026"
              tilt="right"
              size="lg"
              tape="corner"
            />
          </aside>
        </div>

        {/* Education and certifications sit side by side across the full width
            rather than stacking in a narrow column beside short prose. */}
        <div className={styles.credentials}>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>Education</h2>
            <ul className={styles.educationList}>
              {education.map(item => (
                <li className={styles.educationItem} key={item.id}>
                  <p className={styles.degree}>{item.degree}</p>
                  <p className={styles.school}>{item.school}</p>
                  <p className={styles.period}>{item.period}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>
              Certifications
              <span className={styles.count}>{certifications.length}</span>
            </h2>
            <ul className={styles.certList}>
              {certifications.map(cert => (
                <li className={styles.cert} key={cert.id}>
                  <span className={styles.certCode}>{cert.code}</span>
                  <span className={styles.certName}>{cert.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I work with</h2>
          <p className={styles.sectionNote}>
            Grouped by layer rather than ranked. Where a certification backs a group, it is
            named — that is verifiable, unlike a self-assigned skill rating.
          </p>

          <div className={styles.grid}>
            {skillGroups.map(group => (
              <section className={styles.group} key={group.id}>
                <h3 className={styles.groupTitle}>
                  {group.title}
                  <span className={styles.count}>{group.items.length}</span>
                </h3>

                {certBacked[group.id] && (
                  <p className={styles.backed}>
                    Certified: {certBacked[group.id].join(', ')}
                  </p>
                )}

                <ul className={styles.items}>
                  {group.items.map(item => (
                    <li className={styles.item} key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
