import { forwardRef } from 'react';
import clsx from 'clsx';
import { cva, VariantProps } from 'class-variance-authority';

const classes = cva(
  clsx(
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

/**
 * Props for {@link Input}. Native input attributes go to the `<input>`;
 * `className` goes to the wrapper.
 */
export interface InputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'prefix' | 'surffix' | 'size'
    >,
    VariantProps<typeof classes> {
  /**
   * Height. `xs` 30px · `sm` 32px · `base` 36px · `md` 40px · `lg` 44px ·
   * `xl` 48px · `2xl` 52px · `3xl` 56px.
   * @default 'lg'
   */
  size?: VariantProps<typeof classes>['size'];
  /**
   * Gap between `prefix`, input and `surffix`.
   * `none` 0 · `xs` 4px · `sm` 8px · `md` 12px · `lg` 16px · `xl` 20px.
   * @default 'xl'
   */
  gap?: VariantProps<typeof classes>['gap'];
  /**
   * Border style of the wrapper.
   * @default 'line'
   */
  outline?: VariantProps<typeof classes>['outline'];
  /**
   * Border radius of the wrapper.
   * @default 'lg'
   */
  rounded?: VariantProps<typeof classes>['rounded'];
  /** Content before the input, e.g. an icon. */
  prefix?: React.ReactNode;
  /**
   * Content after the input, e.g. a unit or clear button.
   * Note the spelling: `surffix`, not `suffix`.
   */
  surffix?: React.ReactNode;
}

/**
 * Text input with a bordered wrapper and optional leading/trailing content.
 * `ref` points to the `<input>`; `type` defaults to `"text"`.
 *
 * @example
 * <Input
 *   placeholder="Search"
 *   prefix={<SearchIcon />}
 *   surffix={<kbd>⌘K</kbd>}
 *   value={keyword}
 *   onChange={(e) => setKeyword(e.target.value)}
 * />
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
