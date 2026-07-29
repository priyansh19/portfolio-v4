import { SectionHeading } from '@/components/section-heading/section-heading';
import { skillGroups } from '@/lib/content';
import styles from './skills.module.css';

export const Skills = () => (
  <section className={styles.section} id="skills">
    <div className={styles.inner}>
      <SectionHeading
        eyebrow="Chapter five"
        title="What I work with"
        lede="Model layer down to metal — agent frameworks, cloud platforms, cluster tooling and the data stores underneath."
      />

      <div className={styles.grid}>
        {skillGroups.map(group => (
          <section className={styles.group} key={group.id}>
            <h3 className={styles.groupTitle}>
              {group.title}
              <span className={styles.count}>{group.items.length}</span>
            </h3>
            <ul className={styles.items}>
              {group.items.map(item => (
                <li className={styles.item} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  </section>
);
