import styles from './polaroid.module.css';

/**
 * A flat, hairline-bordered media tile.
 *
 * Drop real images in /public/photos and pass `src`. Without one it renders a
 * labelled placeholder rather than a stock photo, so it is obvious what is
 * still missing.
 *
 * `tilt` and `tape` are accepted for API compatibility with callers but are
 * no-ops in this design — Mintlify's flat language has no room for taped,
 * rotated photo frames. They are still threaded through as data attributes
 * so nothing errors if a future pass wants them back.
 */
export const Polaroid = ({
  src,
  alt = '',
  caption,
  tilt = 'left',
  tape = 'top',
  size = 'md',
  className = '',
}) => (
  <figure
    className={`${styles.polaroid} ${className}`}
    data-tilt={tilt}
    data-tape={tape}
    data-size={size}
  >
    <div className={styles.window}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={src} alt={alt} loading="lazy" />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt || 'Photo placeholder'}>
          <span className={styles.placeholderMark} aria-hidden>
            ✦
          </span>
          <span className={styles.placeholderText}>{alt || 'photo'}</span>
        </div>
      )}
    </div>

    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>
);
