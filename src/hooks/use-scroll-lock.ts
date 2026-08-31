'use client';

import { useCallback, useEffect } from 'react';

type ScrollLockType = 'mouse' | 'touch';

export interface UseScrollLockProps {
  open: boolean;
  type?: readonly ScrollLockType[];
}

const DEFAULT_TYPES: readonly ScrollLockType[] = ['mouse', 'touch'];

let mouseLockCount = 0;
let savedOverflow: string | undefined;

function acquireMouseLock() {
  if (mouseLockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  mouseLockCount += 1;
}

function releaseMouseLock() {
  mouseLockCount = Math.max(0, mouseLockCount - 1);
  if (mouseLockCount === 0) {
    document.body.style.overflow = savedOverflow || 'unset';
    savedOverflow = undefined;
  }
}

export function useScrollLock({
  open,
  type = DEFAULT_TYPES,
}: UseScrollLockProps) {
  const preventTouchScroll = useCallback((e: TouchEvent) => {
    e.preventDefault();
  }, []);

  const preventWheelScroll = useCallback((e: WheelEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const lockMouse = open && type.includes('mouse');
    const lockTouch = open && type.includes('touch');

    if (lockMouse) {
      acquireMouseLock();
      document.addEventListener('wheel', preventWheelScroll, {
        passive: false,
      });
    }

    if (lockTouch) {
      document.addEventListener('touchmove', preventTouchScroll, {
        passive: false,
      });
    }

    return () => {
      if (lockMouse) {
        releaseMouseLock();
        document.removeEventListener('wheel', preventWheelScroll);
      }

      if (lockTouch) {
        document.removeEventListener('touchmove', preventTouchScroll);
      }
    };
  }, [open, type, preventTouchScroll, preventWheelScroll]);
}
