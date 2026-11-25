import type { Content } from '@/content/types';
import { ApplicationForm } from './ApplicationForm';
import styles from './Apply.module.css';

/** "Apply to speak" section. Every CTA on the page links here (#apply). */
export function Apply({ c }: { c: Content }) {
  const a = c.apply;
  return (
    <section id="apply" aria-labelledby="apply-title" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.label}>{a.label}</p>
          <h2 id="apply-title" className={styles.heading}>
            {a.heading}
          </h2>
          <p className={styles.intro}>{a.intro}</p>

          <div>
            <h3 className={styles.stepsHeading}>{a.stepsHeading}</h3>
            <ol className={styles.steps}>
              {a.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <ApplicationForm c={{ locale: c.locale, form: c.form }} />
        </div>
      </div>
    </section>
  );
}
