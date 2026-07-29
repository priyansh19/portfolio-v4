import styles from './polaroid.module.css';

/**
 * A clean device/browser-chrome frame around a screenshot.
 *
 * Kept as `Polaroid` with its original prop surface so every calling page
 * needs no changes — `tilt` and `tape` are no-ops now that the design
 * language is Expo's flat device-mockup card rather than taped scrapbook
 * photos. Drop real images in /public and pass `src`; without one it renders
 * a labelled placeholder rather than a stock photo.
 */
export const Polaroid = ({
  src,
  alt = '',
  caption,
  size = 'md',
  className = '',
  // `tilt` / `tape` absorbed for backward compatibility with existing call
  // sites — no-ops in the flat device-frame treatment.
  ...legacyProps
}) => (
  <figure className={`${styles.frame} ${className}`} data-size={size}>
    <div className={styles.chrome} aria-hidden>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>

    <div className={styles.window}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={src} alt={alt} loading="lazy" />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt || 'Screenshot placeholder'}>
          <span className={styles.placeholderGlyph} aria-hidden>
            ▢
          </span>
          <span className={styles.placeholderText}>{alt || 'preview'}</span>
        </div>
      )}
    </div>

    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>
);
