import { Reveal } from '@/components/reveal/reveal';
import { SectionHeading } from '@/components/section-heading/section-heading';
import { contactMeta, links } from '@/lib/content';
import styles from './contact.module.css';

const channels = [
  { id: 'email', label: 'Email', value: links.email, href: `mailto:${links.email}` },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/priyansh19', href: links.linkedin },
  { id: 'github', label: 'GitHub', value: '@priyansh19', href: links.github },
  { id: 'tsenta', label: 'Profile', value: 'tsenta.com', href: links.tsenta },
];

export const Contact = () => (
  <section className={styles.section} id="contact">
    <div className={styles.inner}>
      <SectionHeading
        eyebrow="Last page"
        title="Sign my book"
        lede="Open to consulting engagements and full-time forward-deployed roles. Email is the fastest way to reach me."
      />

      <Reveal className={styles.layout}>
        <ul className={styles.channels}>
          {channels.map(channel => (
            <li className={styles.channel} key={channel.id}>
              <a
                className={styles.channelLink}
                href={channel.href}
                target={channel.id === 'email' ? undefined : '_blank'}
                rel={channel.id === 'email' ? undefined : 'noreferrer noopener'}
              >
                <span className={styles.channelLabel}>{channel.label}</span>
                <span className={styles.channelValue}>{channel.value}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.note}>
          <p className={styles.noteHand}>
            Stay in touch — and tell me what you are building.
          </p>

          <dl className={styles.expect}>
            <div className={styles.expectRow}>
              <dt className={styles.expectLabel}>Timezone</dt>
              <dd className={styles.expectValue}>{contactMeta.timezone}</dd>
            </div>
            {contactMeta.responseTime && (
              <div className={styles.expectRow}>
                <dt className={styles.expectLabel}>Reply within</dt>
                <dd className={styles.expectValue}>{contactMeta.responseTime}</dd>
              </div>
            )}
          </dl>

          <p className={styles.helpfulTitle}>Helpful to include</p>
          <ul className={styles.helpful}>
            {contactMeta.helpful.map(item => (
              <li className={styles.helpfulItem} key={item}>
                {item}
              </li>
            ))}
          </ul>

          <a className={styles.cta} href={`mailto:${links.email}`}>
            Start a conversation
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);
