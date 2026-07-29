import { useCallback, useEffect, useState } from 'react';

/**
 * Breakpoint tokens (px), matching the source portfolio
 */
export const media = {
  desktop: 2080,
  laptop: 1680,
  tablet: 1040,
  mobile: 696,
  mobileS: 400,
};

/**
 * Track whether an element is within the viewport
 */
export function useInViewport(elementRef, unobserveOnIntersect, options = {}) {
  const [intersect, setIntersect] = useState(false);
  const [isUnobserved, setIsUnobserved] = useState(false);

  useEffect(() => {
    if (!elementRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      const { isIntersecting, target } = entry;

      setIntersect(isIntersecting);

      if (isIntersecting && unobserveOnIntersect) {
        observer.unobserve(target);
        setIsUnobserved(true);
      }
    }, options);

    if (!isUnobserved) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [elementRef, unobserveOnIntersect, options, isUnobserved]);

  return intersect;
}

/**
 * Track the window size, accounting for iOS Safari's dynamic viewport
 */
export function useWindowSize() {
  const getSize = useCallback(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  // Server-safe default; the mount effect below replaces it with real numbers.
  const [windowSize, setWindowSize] = useState({ width: 1280, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getSize]);

  return windowSize;
}
