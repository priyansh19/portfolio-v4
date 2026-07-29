import styles from './section-heading.module.css';

/** Section header styled as a notebook chapter opener. */
export const SectionHeading = ({ eyebrow, title, lede, aside }) => (
  <header className={styles.heading}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 className={styles.title}>{title}</h2>
    {lede && <p className={styles.lede}>{lede}</p>}
    {aside && <p className={styles.aside}>{aside}</p>}
  </header>
);
