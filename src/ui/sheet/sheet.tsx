import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { useDelayUnmount } from '../../hooks/use-delay-unmount';
import { cva } from 'class-variance-authority';
import { useDialogStack } from '../../hooks/use-dialog-stack';

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
  /** Whether the sheet is shown. Controlled by the parent. */
  isOpen: boolean;
  /**
   * Called on backdrop click (if enabled) or Escape.
   * Set `isOpen` to `false` here.
   */
  onClose: () => void;
  /**
   * Screen edge the sheet slides in from.
   * @default 'bottom'
   */
  direction?: Direction;
  /**
   * Size along the slide axis (height for top/bottom, width for left/right).
   * - `full`: 100%
   * - `half`: 50% of the viewport
   * - `auto`: fits content, up to 90% of the viewport
   *
   * For a fixed size, use `auto` with `className` (e.g. `w-[320px]`).
   * @default 'full'
   */
  size?: Size;
  /** Sheet content. */
  children: React.ReactNode;
  /** Class name for the sliding panel (white background by default). */
  className?: string;
  /**
   * Close when the dimmed backdrop is clicked.
   * @default true
   */
  closeOnBackdropClick?: boolean;
  /**
   * `z-index` of the overlay.
   * @default 1001
   */
  zIndex?: number;
}

/**
 * Panel that slides in from a screen edge over a dimmed backdrop
 * (bottom sheet, side drawer, ...).
 *
 * - Closes on Escape (only the top-most open sheet/dialog) and locks body
 *   scroll while open.
 * - Stays mounted for 300ms after closing to finish the exit animation.
 * - Rendered in place, not in a portal.
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Sheet isOpen={open} onClose={() => setOpen(false)} size="half">
 *   <FilterForm onApply={() => setOpen(false)} />
 * </Sheet>
 *
 * @example
 * // Right drawer with fixed width
 * <Sheet
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   direction="right"
 *   size="auto"
 *   className="w-[320px]"
 * >
 *   <Nav />
 * </Sheet>
 */
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

  useDialogStack(isOpen, onClose);

  useEffect(() => {
    if (isOpen && shouldRender) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setIsAnimating(false);
    }
  }, [isOpen, shouldRender]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  if (!shouldRender) return null;

  return (
    <aside
      data-komc
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
      <section
        data-state={isAnimating ? 'open' : 'closed'}
        className={clsx(
          positionClasses({ direction, className }),
          sizeClasses({ direction, size }),
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </section>
    </aside>
  );
}
