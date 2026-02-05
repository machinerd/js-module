import { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../util';

const classes = cva(
  cn(
    'komc:inline-flex komc:justify-center komc:items-center komc:w-full',
    'komc:transition-colors komc:duration-200 komc:relative',
    'komc:*:transition-colors komc:*:duration-200',
    'komc:disabled:cursor-default komc:disabled:opacity-50 komc:disabled:pointer-events-none',
    'komc:whitespace-nowrap komc:shrink-0 komc:outline-none',
  ),
  {
    variants: {
      size: {
        xs: 'komc:h-7.5',
        sm: 'komc:h-8',
        base: 'komc:h-9',
        md: 'komc:h-10',
        lg: 'komc:h-11',
        xl: 'komc:h-12',
        '2xl': 'komc:h-13',
        '3xl': 'komc:h-14',
      },
      gap: {
        none: 'komc:gap-0',
        xs: 'komc:gap-1',
        sm: 'komc:gap-2',
        md: 'komc:gap-3',
        lg: 'komc:gap-4',
        xl: 'komc:gap-5',
      },
      outline: {
        line: 'komc:border',
        solid: 'komc:border-transparent',
        clear: 'komc:border-none',
        dashed: 'komc:border-dashed',
        dotted: 'komc:border-dotted',
      },
      rounded: {
        none: 'komc:rounded-none',
        sm: 'komc:rounded-sm',
        md: 'komc:rounded-md',
        lg: 'komc:rounded-lg',
        xl: 'komc:rounded-xl',
        '2xl': 'komc:rounded-2xl',
        '2.5xl': 'komc:rounded-[20px]',
        '3xl': 'komc:rounded-3xl',
        full: 'komc:rounded-full',
      },
      variant: {
        default: '',
        ghost: 'komc:bg-transparent komc:text-neutral-900',
        white: 'komc:bg-white komc:text-neutral-900 komc:hover:bg-neutral-100',
        blue: 'komc:bg-blue-500 komc:text-white komc:hover:bg-blue-600',
        night: 'komc:bg-[#2c5cb7] komc:text-white komc:hover:bg-[#26539F]',
        charcoal: 'komc:bg-[#36454F] komc:text-white komc:hover:bg-[#2E3A43]',
        slate: 'komc:bg-[#4A5565] komc:text-white komc:hover:bg-[#424A57]',
        red: 'komc:bg-[#C8313A] komc:text-white komc:hover:bg-[#B02B33]',
        yellow: 'komc:bg-[#E7FF14] komc:text-black komc:hover:bg-[#D4E600]',
        black:
          'komc:bg-[rgb(95,95,96)] komc:text-white komc:hover:bg-[rgb(76,76,77)] komc:active:bg-[rgb(76,76,77)]',
      },
    },
    defaultVariants: {
      size: undefined,
      outline: undefined,
      rounded: undefined,
      variant: undefined,
    },
  },
);

export interface ButtonProps
  extends
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'suffix' | 'prefix'>,
  VariantProps<typeof classes> {
  /**
   * @param size - Height of the button
   * @default md - 40px
   * @property
   * - xs: 30px
   * - sm: 32px
   * - base: 36px
   * - md: 40px
   * - lg: 44px
   * - xl: 48px
   * - 2xl: 52px
   * - 3xl: 56px
   */
  size?: VariantProps<typeof classes>['size'];
  /**
   * @param gap - Gap between the button and the content
   * @default sm - 8px
   * @property
   * - none: 0
   * - xs: 4px
   * - sm: 8px
   * - md: 12px
   * - lg: 16px
   * - xl: 20px
   */
  gap?: VariantProps<typeof classes>['gap'];
  /**
   * @param rounded - Border radius of the button
   * @default sm
   * @property
   * - none: 0
   * - sm: 2px
   * - md: 6px
   * - lg: 8px
   * - xl: 12px
   * - 2xl: 16px
   * - 2.5xl: 20px
   * - 3xl: 24px
   * - full: 100%
   */
  rounded?: VariantProps<typeof classes>['rounded'];
  /**
   * @param variant - Variant of the button
   * @default blue
   * @property
   * - default
   * - ghost
   * - white
   * - blue
   * - night
   * - charcoal
   * - slate
   * - red
   * - yellow
   * - black
   */
  variant?: VariantProps<typeof classes>['variant'];
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * @param size - Size of the button
 * @param gap - Gap between the button and the content
 * @param outline - Outline of the button
 * @param rounded - Border radius of the button
 * @param variant - Variant of the button
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children = 'button',
      type = 'button',
      size = 'md',
      gap = 'sm',
      outline = 'line',
      rounded = 'sm',
      variant = 'blue',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-komc
        className={classes({
          size,
          outline,
          gap,
          rounded,
          variant,
          className,
        })}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
