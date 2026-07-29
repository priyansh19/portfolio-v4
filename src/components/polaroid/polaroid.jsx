import styles from './polaroid.module.css';

/**
 * A taped-down photo with a handwritten caption.
 *
 * Drop real images in /public/photos and pass `src`. Without one it renders a
 * labelled placeholder rather than a stock photo, so it is obvious what is
 * still missing.
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
    data-size={size}
  >
    {tape !== 'none' && <span className={styles.tape} data-tape={tape} aria-hidden />}

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
