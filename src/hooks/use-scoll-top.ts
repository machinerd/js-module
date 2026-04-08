import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseScrollTopProps {
  enabled?: boolean;
  behavior?: ScrollBehavior;
}

export default function useScrollTop({
  enabled = true,
  behavior = 'smooth',
}: UseScrollTopProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleScrolToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior });
  }, [behavior]);

  useEffect(() => {
    const el = ref.current;

    if (!el || !enabled) {
      setIsVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsVisible(!entry.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [enabled]);

  return { isVisible, handleScrolToTop, ref };
}
