'use client';

import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const SKIP = Symbol('useEffectOnce.skip');

export function useEffectOnce(
  effect: () => ReturnType<EffectCallback> | typeof SKIP,
  deps?: DependencyList,
) {
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    const result = effect();

    if (result === SKIP) return;

    doneRef.current = true;

    if (typeof result === 'function') {
      return result;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
