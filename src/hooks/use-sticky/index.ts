'use client';

import { useEffect, useState } from 'react';

function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  let parent = el.parentElement;
  while (parent) {
    const { overflowY, overflow } = getComputedStyle(parent);
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflow === 'auto' ||
      overflow === 'scroll'
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

export function useSticky() {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sentinel) return;

    const root = findScrollContainer(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rootTop = entry.rootBounds?.top ?? 0;
        const isAbove = entry.boundingClientRect.top < rootTop;
        setIsStuck(!entry.isIntersecting && isAbove);
      },
      { root, threshold: 0, rootMargin: '0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel]);

  return { sentinelRef: setSentinel, isStuck };
}
