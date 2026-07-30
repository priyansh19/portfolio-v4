import { KineticText } from '@/components/kinetic-text/kinetic-text';
import styles from './section-heading.module.css';
import { FlowParagraph } from '@/components/flow-paragraph/flow-paragraph';

/** Section header. The title flips in line by line in 3D via pretext. */
export const SectionHeading = ({ eyebrow, title, lede, aside }) => (
  <header className={styles.heading}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <KineticText as="h2" className={styles.title} text={title} />
    {lede && <FlowParagraph className={styles.lede} text={lede} />}
    {aside && <p className={styles.aside}>{aside}</p>}
  </header>
);
