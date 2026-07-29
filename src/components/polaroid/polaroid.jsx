import styles from './polaroid.module.css';

/**
 * A product-screenshot tile: a white card with a 16px radius framing an
 * image, matching the design system's product-mockup-card treatment.
 *
 * `tilt` and `tape` are accepted so existing call sites keep working, but
 * they are no-ops here — Intercom's mockup cards sit flat, untaped.
 *
 * Drop real images in /public/photos and pass `src`. Without one it renders a
 * labelled placeholder rather than a stock photo, so it is obvious what is
 * still missing.
 */
export const Polaroid = ({
  src,
  alt = '',
  caption,
  // tilt/tape are accepted for API compatibility but are intentional no-ops
  // in the Intercom treatment — see file header.
  size = 'md',
  className = '',
}) => (
  <figure className={`${styles.polaroid} ${className}`} data-size={size}>
    <div className={styles.window}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={src} alt={alt} loading="lazy" />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt || 'Photo placeholder'}>
          <span className={styles.placeholderMark} aria-hidden>
            ▢
          </span>
          <span className={styles.placeholderText}>{alt || 'photo'}</span>
        </div>
      )}
    </div>

    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>
);
