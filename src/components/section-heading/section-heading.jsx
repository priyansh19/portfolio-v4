import styles from './section-heading.module.css';

/**
 * Editorial section header. Pass `tone="dark"` when the section sits on a
 * surface-dark band, so the title and lede flip to the on-dark palette.
 */
export const SectionHeading = ({ eyebrow, title, lede, aside, tone = 'light' }) => (
  <header className={styles.heading} data-tone={tone}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 className={styles.title}>{title}</h2>
    {lede && <p className={styles.lede}>{lede}</p>}
    {aside && <p className={styles.aside}>{aside}</p>}
  </header>
);
