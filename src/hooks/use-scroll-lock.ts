import { useCallback, useEffect } from 'react';

type ScrollLockType = 'mouse' | 'touch';

export interface UseScrollLockProps {
  open: boolean;
  type?: readonly ScrollLockType[];
}

const DEFAULT_TYPES: readonly ScrollLockType[] = ['mouse', 'touch'];

export default function useScrollLock({
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
      document.body.classList.add('overflow-hidden');
      document.addEventListener('wheel', preventWheelScroll, {
        passive: false,
      });
    } else {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('wheel', preventWheelScroll);
    }

    if (lockTouch) {
      document.addEventListener('touchmove', preventTouchScroll, {
        passive: false,
      });
    } else {
      document.removeEventListener('touchmove', preventTouchScroll);
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('touchmove', preventTouchScroll);
      document.removeEventListener('wheel', preventWheelScroll);
    };
  }, [open, type, preventTouchScroll, preventWheelScroll]);
}
