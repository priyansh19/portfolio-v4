import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import styles from './page-header.module.css';

/**
 * Masthead for the blog-style sub-pages. Always carries a breadcrumb trail so
 * home and the parent page are one click away from anywhere in the site.
 */
export const PageHeader = ({ crumbs = [], kicker, title, tagline, meta = [] }) => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, ...crumbs]} />

      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h1 className={styles.title}>{title}</h1>
      {tagline && <p className={styles.tagline}>{tagline}</p>}

      {meta.length > 0 && (
        <dl className={styles.meta}>
          {meta.map(item => (
            <div className={styles.metaItem} key={item.label}>
              <dt className={styles.metaLabel}>{item.label}</dt>
              <dd className={styles.metaValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  </header>
);
