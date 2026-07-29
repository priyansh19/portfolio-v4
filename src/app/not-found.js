import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { navPages } from '@/lib/content';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Page not found',
};

const destinationNotes = {
  '/work': 'Five years, four roles',
  '/projects': 'Every write-up in one place',
  '/freelance': 'Consulting and engagements',
  '/open-source': 'Contributions and repos',
  '/about': 'Bio, skills and certifications',
};

/**
 * A missing page still gets the full nav, footer and a set of onward links —
 * never a dead end.
 */
export default function NotFound() {
  const destinations = [
    { href: '/', label: 'Home', note: 'Back to the front page' },
    ...navPages.map(page => ({
      href: page.href,
      label: page.label,
      note: destinationNotes[page.href],
    })),
  ];

  return (
    <>
      <Nav />

      <main className={styles.main}>
        <Reveal>
          <p className={styles.kicker}>404</p>
          <h1 className={styles.title}>This page doesn&rsquo;t exist.</h1>
          <p className={styles.body}>
            Whatever was here has moved or never existed. Here is everything else.
          </p>
        </Reveal>

        <RevealGroup as="ul" className={styles.list}>
          {destinations.map(item => (
            <RevealItem as="li" key={item.href}>
              <Link className={styles.card} href={item.href}>
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={styles.cardNote}>{item.note}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </main>

      <SiteFooter />
    </>
  );
}
