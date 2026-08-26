import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { useDelayUnmount } from '../../hooks';
import { cva } from 'class-variance-authority';

const positionClasses = cva(
  clsx(
    'komc:absolute komc:bg-white komc:flex komc:flex-col komc:shadow-2xl',
    'komc:transition-transform komc:duration-300 komc:ease-in-out',
  ),
  {
    variants: {
      direction: {
        top: 'komc:top-0 komc:left-0 komc:right-0 komc:-translate-y-full komc:data-[state=open]:translate-y-0',
        bottom:
          'komc:bottom-0 komc:left-0 komc:right-0 komc:translate-y-full komc:data-[state=open]:translate-y-0',
        left: 'komc:top-0 komc:bottom-0 komc:left-0 komc:-translate-x-full komc:data-[state=open]:translate-x-0',
        right:
          'komc:top-0 komc:bottom-0 komc:right-0 komc:translate-x-full komc:data-[state=open]:translate-x-0',
      },
    },
  },
);

const sizeClasses = cva('', {
  variants: {
    size: {
      full: '',
      half: '',
      auto: '',
    },
    direction: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
  },
  compoundVariants: [
    {
      size: 'full',
      direction: 'top',
      className: 'komc:h-full',
    },
    {
      size: 'full',
      direction: 'bottom',
      className: 'komc:h-full',
    },
    {
      size: 'full',
      direction: 'left',
      className: 'komc:w-full',
    },
    {
      size: 'full',
      direction: 'right',
      className: 'komc:w-full',
    },
    {
      size: 'half',
      direction: 'top',
      className: 'komc:h-[50dvh]',
    },
    {
      size: 'half',
      direction: 'bottom',
      className: 'komc:h-[50dvh]',
    },
    {
      size: 'half',
      direction: 'left',
      className: 'komc:w-[50dvw]',
    },
    {
      size: 'half',
      direction: 'right',
      className: 'komc:w-[50dvw]',
    },
    {
      size: 'auto',
      direction: 'top',
      className: 'komc:h-auto komc:max-h-[90dvh]',
    },
    {
      size: 'auto',
      direction: 'bottom',
      className: 'komc:h-auto komc:max-h-[90dvh]',
    },
    {
      size: 'auto',
      direction: 'left',
      className: 'komc:w-auto komc:max-w-[90dvw]',
    },
    {
      size: 'auto',
      direction: 'right',
      className: 'komc:w-auto komc:max-w-[90dvw]',
    },
  ],
});

type Direction = 'top' | 'bottom' | 'left' | 'right';
type Size = 'full' | 'half' | 'auto';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: Direction;
  size?: Size;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  zIndex?: number;
}

export default function Sheet({
  isOpen,
  onClose,
  direction = 'bottom',
  size = 'full',
  children,
  className,
  closeOnBackdropClick = true,
  zIndex = 1001,
}: SheetProps) {
  const shouldRender = useDelayUnmount(isOpen, 300);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && shouldRender) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setIsAnimating(false);
    }
  }, [isOpen, shouldRender]);

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  if (!shouldRender) return null;

  return (
    <div
      className="komc:fixed komc:inset-0 komc:flex komc:justify-center komc:items-center"
      style={{ zIndex }}
    >
      <button
        type="button"
        data-state={isAnimating ? 'open' : 'closed'}
        className={clsx(
          'komc:absolute komc:inset-0 komc:w-full komc:h-full komc:bg-black/40 komc:cursor-default',
          'komc:transition-opacity komc:duration-300 komc:ease-in-out',
          'komc:opacity-0 komc:data-[state=open]:opacity-100',
        )}
        onClick={handleBackdropClick}
        aria-label="close sheet"
      />
      <div
        data-state={isAnimating ? 'open' : 'closed'}
        className={clsx(
          positionClasses({ direction, className }),
          sizeClasses({ direction, size }),
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
