import { cva, VariantProps } from 'class-variance-authority';
import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDelayUnmount } from '../../hooks/use-delay-unmount';
import { useDialogStack } from '../../hooks/use-dialog-stack';

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

/**
 * Props for {@link Dialog}. Other HTML attributes (`className`,
 * `aria-labelledby`, ...) go to the dialog panel.
 */
export interface DialogProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  /**
   * Close when the dimmed backdrop is clicked.
   * @default true
   */
  closeOnBackdropClick?: boolean;
  /** Whether the dialog is shown. Controlled by the parent. */
  isOpen: boolean;
  /**
   * `z-index` of the fixed overlay.
   * @default 10000
   */
  zIndex?: number;
  /**
   * Called on backdrop click (if enabled) or Escape.
   * Set `isOpen` to `false` here.
   */
  onClose: () => void;
  /** Dialog content. */
  children: ReactNode;
  /**
   * Panel padding. `none` 0 · `sm` 8px · `md` 16px · `lg` 24px.
   * @default 'sm'
   */
  padding?: VariantProps<typeof classes>['padding'];
  /**
   * Panel max width. `sm` 384px · `md` 448px · `lg` 512px · `xl` 576px ·
   * `2xl` 672px · `full` 100%.
   * @default 'md'
   */
  maxWidth?: VariantProps<typeof classes>['maxWidth'];
}

/**
 * Centered modal dialog with a dimmed backdrop and fade/scale transition.
 *
 * - Closes on Escape (only the top-most open dialog) and locks body scroll
 *   while open.
 * - Stays mounted for 300ms after closing to finish the exit animation.
 * - Rendered in place, not in a portal. The panel has no background color;
 *   add one via `className` or in `children`.
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Dialog
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   padding="lg"
 *   className="bg-white rounded-xl"
 * >
 *   <h2>Delete item?</h2>
 *   <Button onClick={() => setOpen(false)}>Cancel</Button>
 * </Dialog>
 */
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
