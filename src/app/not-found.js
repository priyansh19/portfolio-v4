import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { RevealGroup, RevealItem } from '@/components/reveal/reveal';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { navPages } from '@/lib/content';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Page not found',
};

/**
 * A missing page still gets the full nav, footer and a set of onward links —
 * never a dead end.
 */
export default function NotFound() {
  const destinations = [
    { href: '/', label: 'Home', note: 'Back to the front page' },
    { href: '/projects', label: 'Projects', note: 'Every write-up in one place' },
    ...navPages.map(page => ({
      href: page.href,
      note: page.href === '/freelance' ? 'Consulting and engagements' : 'Contributions and repos',
      label: page.label,
    })),
  ];

  return (
    <>
      <Nav />

      <main className={styles.main}>
        <p className={styles.kicker}>Page 404</p>
        <h1 className={styles.title}>This page came loose from the binding.</h1>
        <p className={styles.body}>
          Whatever was here has moved or never existed. Here is everything else.
        </p>

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
