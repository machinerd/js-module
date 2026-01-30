import { Dispatch, RefObject, SetStateAction, useCallback, useEffect } from 'react';

export interface UseOutsideClickProps {
  ref: RefObject<HTMLElement | null>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function useOutsideClick({ ref, setOpen }: UseOutsideClickProps) {
  const handleOutsideClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    [ref, setOpen],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [handleOutsideClick]);
}
