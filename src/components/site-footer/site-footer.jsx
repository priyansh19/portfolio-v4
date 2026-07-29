import Link from 'next/link';
import { links, navPages, profile } from '@/lib/content';
import styles from './site-footer.module.css';

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p className={styles.name}>
        {profile.name}
        <span className={styles.location}>{profile.location}</span>
      </p>

      <nav className={styles.links} aria-label="Footer">
        <Link className={styles.link} href="/">
          Home
        </Link>
        {navPages.map(page => (
          <Link className={styles.link} href={page.href} key={page.href}>
            {page.label}
          </Link>
        ))}
        <a className={styles.link} href={links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className={styles.link} href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </nav>
    </div>
  </footer>
);
