import { forwardRef } from 'react';
import { cn } from '../../util/common';
import { cva, VariantProps } from 'class-variance-authority';

const classes = cva(
  cn(
    'komc:flex komc:items-center komc:w-full komc:px-2',
    'komc:[&>input]:outline-none komc:[&>input]:w-full',
    'komc:[&>input]:focus:ring-0 komc:[&>input]:focus:ring-offset-0',
    'komc:[&>input]:h-full',
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
  size?: VariantProps<typeof classes>['size'];
  gap?: VariantProps<typeof classes>['gap'];
  outline?: VariantProps<typeof classes>['outline'];
  rounded?: VariantProps<typeof classes>['rounded'];
  prefix?: React.ReactNode;
  surffix?: React.ReactNode;
}

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
        data-komc
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
