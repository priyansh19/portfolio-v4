import { Nav } from '@/components/nav/nav';
import { PageHeader } from '@/components/page-header/page-header';
import { Polaroid } from '@/components/polaroid/polaroid';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { freelance, links } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: freelance.title,
  description: freelance.intro,
};

export default function FreelancePage() {
  // Each availability line renders only once it has been filled in
  const availabilityRows = [
    { label: 'Status', value: freelance.availability.status },
    { label: 'Capacity', value: freelance.availability.capacity },
    { label: 'Typical engagement', value: freelance.availability.engagementSize },
    { label: 'Rates', value: freelance.availability.rates },
  ].filter(row => row.value);

  return (
    <>
      <Nav />

      <PageHeader
        crumbs={[{ label: freelance.title }]}
        kicker="Independent work"
        title={freelance.title}
        tagline={freelance.tagline}
        meta={[
          { label: 'Period', value: freelance.period },
          { label: 'Through', value: freelance.channel },
          { label: 'Status', value: 'Taking selected work' },
        ]}
      />

      <main className={styles.main}>
        <section className={styles.intro}>
          <div className={styles.introText}>
            <p className="prose">{freelance.intro}</p>

            <dl className={styles.stats}>
              {freelance.stats.map(stat => (
                <div className={styles.stat} key={stat.label}>
                  <dt className={styles.statValue}>{stat.value}</dt>
                  <dd className={styles.statLabel}>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Polaroid
            alt="Consulting or client workshop photo"
            caption="scoping session"
            tilt="right"
            size="lg"
            tape="corner"
          />
        </section>

        {availabilityRows.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Availability</h2>
            <dl className={styles.availability}>
              {availabilityRows.map(row => (
                <div className={styles.availabilityRow} key={row.label}>
                  <dt className={styles.availabilityLabel}>{row.label}</dt>
                  <dd className={styles.availabilityValue}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {freelance.caseStudies.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Case studies</h2>
            <ul className={styles.caseStudies}>
              {freelance.caseStudies.map(study => (
                <li className={styles.caseStudy} key={study.title}>
                  <p className={styles.caseSector}>{study.sector}</p>
                  <h3 className={styles.caseTitle}>{study.title}</h3>
                  <p className={styles.caseBody}>{study.problem}</p>
                  <p className={styles.caseBody}>{study.work}</p>
                  <p className={styles.caseResult}>{study.result}</p>
                  {study.duration && (
                    <p className={styles.caseDuration}>{study.duration}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {freelance.testimonials.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What clients said</h2>
            <ul className={styles.testimonials}>
              {freelance.testimonials.map(item => (
                <li className={styles.testimonial} key={item.quote}>
                  <blockquote className={styles.quote}>{item.quote}</blockquote>
                  <p className={styles.attribution}>{item.attribution}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I take on</h2>
          <ul className={styles.services}>
            {freelance.services.map(service => (
              <li className={styles.service} key={service.id}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceBody}>{service.body}</p>
                <ul className={styles.tags}>
                  {service.tags.map(tag => (
                    <li className={styles.tag} key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How an engagement runs</h2>
          <ol className={styles.process}>
            {freelance.process.map(phase => (
              <li className={styles.phase} key={phase.step}>
                <span className={styles.phaseStep}>{phase.step}</span>
                <div>
                  <h3 className={styles.phaseTitle}>{phase.title}</h3>
                  <p className={styles.phaseBody}>{phase.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Some of what that has meant</h2>
          <ul className={styles.engagements}>
            {freelance.engagements.map(item => (
              <li className={styles.engagement} key={item.title}>
                <h3 className={styles.engagementTitle}>{item.title}</h3>
                <p className={styles.engagementBody}>{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.cta}>
          <p className={styles.ctaHand}>Got something that needs to actually ship?</p>
          <p className={styles.ctaBody}>
            Tell me the problem and the constraints. If it is not something I should take,
            I will say so.
          </p>
          <a className={styles.ctaButton} href={`mailto:${links.email}`}>
            Get in touch
          </a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
