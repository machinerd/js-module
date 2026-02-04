import { forwardRef } from 'react';
import { cn } from '../../util/common';
import { cva, VariantProps } from 'class-variance-authority';

const classes = cva(
  cn(
    'komc:flex komc:items-center komc:w-full komc:px-2 komc:box-border',
    'komc:[&>input]:outline-none komc:[&>input]:w-full',
    'komc:[&>input]:focus:ring-0 komc:[&>input]:focus:ring-offset-0',
    'komc:[&>input]:border-none komc:[&>input]:h-full',
    'komc:[&>input]:p-0 komc:[&>input]:m-0',
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
      },
    },
  },
);

export interface InputProps
  extends
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'prefix' | 'surffix' | 'size'
  >,
  VariantProps<typeof classes> {
  /**
   * @param size - Height of the input
   * @default lg - 44px
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
   * @param gap - Gap between the input and the prefix/suffix
   * @default xl - 20px
   * @property
   * - none: 0
   * - xs: 4px
   * - sm: 8px
   * - md: 12px
   * - lg: 16px
   * - xl: 20px
   */
  gap?: VariantProps<typeof classes>['gap'];
  outline?: VariantProps<typeof classes>['outline'];
  /**
   * @param rounded - Border radius of the input
   * @default lg
   * @property
   * - none: 0
   * - sm: 2px
   * - md: 6px
   * - lg: 8px
   * - xl: 12px
   * - 2xl: 16px
   */
  rounded?: VariantProps<typeof classes>['rounded'];
  prefix?: React.ReactNode;
  surffix?: React.ReactNode;
}

/**
 * @param prefix - Prefix of the input
 * @param surffix - Surffix of the input
 * @param size - Size of the input
 * @param gap - Gap between the input and the prefix/suffix
 * @param outline - Outline of the input
 * @param rounded - Border radius of the input
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      prefix = null,
      surffix = null,
      size = 'lg',
      gap = 'xl',
      outline = 'line',
      rounded = 'lg',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={classes({
          size,
          gap,
          outline,
          rounded,
          className,
        })}
      >
        {prefix}
        <input ref={ref} type="text" {...props} />
        {surffix}
      </div>
    );
  },
);

export default Input;
