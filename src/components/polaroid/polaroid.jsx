import styles from './polaroid.module.css';

/**
 * A warm editorial figure plate — a captioned image treated like a magazine
 * illustration rather than a scrapbook photo. `tilt` and `tape` are accepted
 * for backward compatibility with calling pages but are no-ops in this
 * design language; the plate always sits flat with a hairline frame.
 *
 * Drop real images in /public/photos and pass `src`. Without one it renders a
 * labelled placeholder rather than a stock photo, so it is obvious what is
 * still missing.
 */
export const Polaroid = ({
  src,
  alt = '',
  caption,
  // Kept for API compatibility with calling pages — no longer applied.
  tilt = 'left',
  tape = 'top',
  size = 'md',
  className = '',
}) => (
  <figure className={`${styles.plate} ${className}`} data-size={size}>
    <div className={styles.window}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={src} alt={alt} loading="lazy" />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt || 'Image placeholder'}>
          <span className={styles.placeholderMark} aria-hidden>
            <svg width="22" height="22" viewBox="0 0 48 48">
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={i}
                  x="22.5"
                  y="4"
                  width="3"
                  height="16"
                  rx="1.5"
                  fill="currentColor"
                  transform={`rotate(${i * 45} 24 24)`}
                />
              ))}
            </svg>
          </span>
          <span className={styles.placeholderText}>{alt || 'figure'}</span>
        </div>
      )}
    </div>

    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>
);
