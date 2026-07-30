import { KineticText } from '@/components/kinetic-text/kinetic-text';
import styles from './section-heading.module.css';

/**
 * Section header. The title flips in line by line in 3D — pretext works out
 * where the lines break so each one can animate independently.
 */
export const SectionHeading = ({ eyebrow, title, lede, aside }) => (
  <header className={styles.heading}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <KineticText as="h2" className={styles.title} text={title} />
    {lede && <p className={styles.lede}>{lede}</p>}
    {aside && <p className={styles.aside}>{aside}</p>}
  </header>
);
