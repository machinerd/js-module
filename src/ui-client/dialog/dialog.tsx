'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes, ReactNode, useCallback, useEffect, useState } from 'react';
import { useDelayUnmount } from '../../hooks';

const classes = cva(
  'komc:relative komc:z-10 komc:flex komc:min-h-0 komc:flex-col komc:overflow-hidden komc:w-full komc:max-h-full komc:min-w-0 komc:transition-all komc:duration-300 komc:ease-in-out',
  {
    variants: {
      padding: {
        sm: 'komc:p-2',
        md: 'komc:p-4',
        lg: 'komc:p-6',
        none: 'komc:p-0',
      },
      maxWidth: {
        sm: 'komc:max-w-sm',
        md: 'komc:max-w-md',
        lg: 'komc:max-w-lg',
        xl: 'komc:max-w-xl',
        '2xl': 'komc:max-w-2xl',
        full: 'komc:max-w-full',
      },
    },
    defaultVariants: {
      padding: 'sm',
      maxWidth: 'md',
    },
  },
);

export interface DialogProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  closeOnBackdropClick?: boolean;
  isOpen: boolean;
  zIndex?: number;
  onClose: () => void;
  children: ReactNode;
}

export default function Dialog({
  closeOnBackdropClick = true,
  isOpen,
  zIndex = 10000,
  padding,
  maxWidth,
  className,
  onClose,
  children,
  ...rest
}: DialogProps) {
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
      data-komc
      className="komc:fixed komc:inset-0 komc:flex komc:min-h-0 komc:flex-col komc:overflow-hidden"
      style={{ zIndex }}
    >
      <div className="komc:relative komc:flex komc:min-h-0 komc:flex-1 komc:w-full komc:items-center komc:justify-center">
        <button
          type="button"
          data-state={isAnimating ? 'open' : 'closed'}
          className="komc:fixed komc:inset-0 komc:z-0 komc:cursor-default komc:bg-black/50 komc:transition-opacity komc:duration-300 komc:ease-in-out komc:data-[state=closed]:opacity-0 komc:data-[state=open]:opacity-100"
          onClick={handleBackdropClick}
          aria-label="close dialog"
        />
        <div
          data-state={isAnimating ? 'open' : 'closed'}
          className={`${classes({ padding, maxWidth, className })} komc:data-[state=closed]:opacity-0 komc:data-[state=open]:opacity-100 komc:data-[state=closed]:scale-95 komc:data-[state=open]:scale-100`}
          role="dialog"
          aria-modal="true"
          {...rest}
        >
          {children}
        </div>
      </div>
    </div>
  );
}