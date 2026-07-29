import Link from 'next/link';
import styles from './breadcrumbs.module.css';

/**
 * Trail back up to every ancestor, ending on the current page.
 *
 * `crumbs` is [{ label, href }] for ancestors; the last entry is rendered as
 * plain text and marked aria-current since you are already there.
 */
export const Breadcrumbs = ({ crumbs = [] }) => (
  <nav className={styles.nav} aria-label="Breadcrumb">
    <ol className={styles.list}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <li className={styles.item} key={crumb.label}>
            {isLast || !crumb.href ? (
              <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                {crumb.label}
              </span>
            ) : (
              <Link className={styles.link} href={crumb.href}>
                {crumb.label}
              </Link>
            )}

            {!isLast && (
              <span className={styles.separator} aria-hidden>
                /
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
