'use client';

import { useState, useEffect } from 'react';

export function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [keepMounted, setKeepMounted] = useState(isMounted);

  useEffect(() => {
    if (isMounted) {
      setKeepMounted(true);
      return;
    }

    const timeoutId = setTimeout(() => setKeepMounted(false), delayTime);
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime]);

  return isMounted || keepMounted;
}
