'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { navPages, navSections, profile } from '@/lib/content';
import styles from './nav.module.css';

export const Nav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = pathname === '/';

  // Anchors resolve against the home page from anywhere in the site
  const sectionHref = id => (onHome ? `#${id}` : `/#${id}`);

  // '/projects' should stay lit on '/projects/blastr', but '/' must not match everything
  const isCurrent = href =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const close = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" onClick={close}>
          <span className={styles.brandMark} aria-hidden>
            {profile.firstName?.[0] ?? profile.name[0]}
          </span>
          <span className={styles.brandName}>{profile.name}</span>
        </Link>

        <nav className={styles.tabs} aria-label="Primary">
          <ul className={styles.tabList}>
            {navPages.map(item => (
              <li key={item.href}>
                <Link
                  className={styles.tab}
                  href={item.href}
                  data-current={isCurrent(item.href)}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle className={styles.toggle} />
          {navSections.map(item => (
            <a className={styles.cta} href={sectionHref(item.id)} key={item.id}>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.sheet}>
          <ul className={styles.sheetList}>
            {navPages.map(item => (
              <li key={item.href}>
                <Link className={styles.sheetLink} href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
            {navSections.map(item => (
              <li key={item.id}>
                <a className={styles.sheetLink} href={sectionHref(item.id)} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
