import { ComponentProps, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../util';

const classes = cva(
  cn(
    'komc:flex komc:justify-center komc:items-center komc:gap-x-2',
    'komc:transition-colors komc:duration-200 komc:relative',
    'komc:[&_svg]:transition-colors komc:[&_svg]:duration-200',
    'komc:cursor-pointer komc:disabled:cursor-default',
  ),
  {
    variants: {
      size: {
        xxs: 'komc:h-7.5',
        xs: 'komc:h-8',
        sm: 'komc:h-9',
        md: 'komc:h-10',
        lg: 'komc:h-11',
        xl: 'komc:h-12',
        '2xl': 'komc:h-13',
        '3xl': 'komc:h-14',
        '4xl': 'komc:h-15',
      },
      shadow: {
        none: '',
        sm: 'komc:drop-shadow-sm',
        md: 'komc:drop-shadow-md',
        lg: 'komc:drop-shadow-lg',
        xl: 'komc:drop-shadow-xl',
        '2xl': 'komc:drop-shadow-2xl',
        '3xl': 'komc:drop-shadow-3xl',
      },
      outline: {
        line: 'komc:border',
        solid: 'komc:border komc:border-transparent',
        clear: 'komc:border-none',
      },
      variant: {
        blue: '',
        duo: '',
        white: '',
        gray: '',
        neutral: '',
        night: '',
        black: '',
        sky: '',
        'sky-blue': '',
        indigo: '',
      },
      px: {
        none: 'komc:px-0',
        xs: 'komc:px-0.5',
        sm: 'komc:px-1',
        md: 'komc:px-1.5',
        lg: 'komc:px-2',
        xl: 'komc:px-3',
        '2xl': 'komc:px-4',
        '3xl': 'komc:px-5',
        '4xl': 'komc:px-6',
      },
      rounded: {
        none: 'komc:rounded-none',
        sm: 'komc:rounded-sm',
        md: 'komc:rounded-md',
        lg: 'komc:rounded-lg',
        xl: 'komc:rounded-xl',
        '2xl': 'komc:rounded-2xl',
        '3xl': 'komc:rounded-3xl',
        full: 'komc:rounded-full',
      },
    },
    compoundVariants: [
      {
        outline: 'line',
        variant: 'blue',
        className: cn(
          'komc:border-blue-500 komc:bg-white komc:text-blue-500',
          'komc:hover:border-transparent komc:hover:bg-blue-500 komc:hover:text-white',
          'komc:active:border-transparent komc:active:bg-blue-500 komc:active:text-white',
          'komc:disabled:border-gray-500 komc:disabled:bg-white komc:disabled:text-gray-500',
        ),
      },
      {
        outline: 'line',
        variant: 'duo',
        className: cn(
          'komc:border-blue-500 komc:bg-white komc:text-brand-blck',
          'komc:hover:border-transparent komc:hover:bg-blue-500 komc:hover:text-white',
          'komc:active:border-transparent komc:active:bg-blue-500 komc:active:text-white',
          'komc:disabled:border-gray-500 komc:disabled:bg-white komc:disabled:text-gray-500',
        ),
      },
      {
        outline: 'line',
        variant: 'white',
        className: cn(
          'komc:border-gray-600 komc:bg-white komc:text-brand-blck',
          'komc:hover:bg-gray-200 komc:hover:text-brand-blck',
          'komc:active:bg-gray-200 komc:active:text-brand-blck',
          'komc:disabled:border-gray-500 komc:disabled:bg-white komc:disabled:text-gray-500',
        ),
      },
      {
        outline: 'line',
        variant: 'gray',
        className: cn(
          'komc:border-white komc:bg-transparent komc:text-white',
          'komc:hover:bg-[rgb(199,199,199)] komc:hover:text-white',
          'komc:active:bg-[rgb(199,199,199)] komc:active:text-white',
          'komc:disabled:border-gray-500 komc:disabled:bg-white komc:disabled:text-gray-500',
        ),
      },
      {
        outline: 'line',
        variant: 'neutral',
        className: cn(
          'komc:border-gray-800 komc:bg-transparent komc:text-black',
          'komc:hover:bg-gray-200 komc:hover:text-black',
          'komc:active:bg-gray-200 komc:active:text-black',
          'komc:disabled:border-gray-500 komc:disabled:bg-transparent komc:disabled:text-gray-500',
        ),
      },

      {
        outline: 'solid',
        variant: 'white',
        className: cn(
          'komc:bg-white komc:text-brand-blck',
          'komc:hover:bg-gray-200',
          'komc:active:bg-gray-200',
          'komc:disabled:border-white komc:disabled:bg-gray-50 komc:disabled:text-gray-800',
        ),
      },
      {
        outline: 'solid',
        variant: 'gray',
        className: cn(
          'komc:bg-gray-100 komc:text-blue-500',
          'komc:hover:bg-blue-500 komc:hover:text-white',
          'komc:active:bg-blue-500 komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-50 komc:disabled:text-gray-800',
        ),
      },
      {
        outline: 'solid',
        variant: 'blue',
        className: cn(
          'komc:bg-blue-500 komc:text-white',
          'komc:hover:bg-night-700 komc:hover:text-white',
          'komc:active:bg-night-700 komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-50 komc:disabled:text-gray-800',
        ),
      },
      {
        outline: 'solid',
        variant: 'night',
        className: cn(
          'komc:bg-night-700 komc:text-white',
          'komc:hover:bg-night-800 komc:hover:text-white',
          'komc:active:bg-night-800 komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-50 komc:disabled:text-gray-800',
        ),
      },
      {
        outline: 'solid',
        variant: 'black',
        className: cn(
          'komc:bg-[rgb(95,95,96)] komc:text-white',
          'komc:hover:bg-[rgb(76,76,77)] komc:hover:text-white',
          'komc:active:bg-[rgb(76,76,77)] komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-50 komc:disabled:text-gray-800',
        ),
      },
      {
        outline: 'solid',
        variant: 'sky',
        className: cn(
          'komc:bg-sky-750 komc:text-white',
          'komc:hover:bg-sky-950 komc:hover:text-white',
          'komc:active:bg-sky-950 komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-700',
        ),
      },
      {
        outline: 'solid',
        variant: 'sky-blue',
        className: cn(
          'komc:bg-sky-450 komc:text-white',
          'komc:hover:bg-sky-650 komc:hover:text-white',
          'komc:active:bg-sky-650 komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-700',
        ),
      },
      {
        outline: 'solid',
        variant: 'indigo',
        className: cn(
          'komc:bg-indigo-600 komc:text-white',
          'komc:hover:bg-indigo-700 komc:hover:text-white',
          'komc:active:bg-indigo-700 komc:active:text-white',
          'komc:disabled:border-white komc:disabled:bg-gray-700',
        ),
      },

      {
        outline: 'clear',
        variant: 'sky',
        className: cn(
          'komc:bg-transparent komc:text-[#1890FF]',
          'komc:hover:bg-transparent komc:hover:text-[#1890FF] komc:hover:underline',
          'komc:active:bg-transparent komc:active:text-[#1890FF] komc:active:underline',
          'komc:disabled:border-transparent komc:disabled:bg-transparent komc:disabled:text-gray-500',
        ),
      },
      {
        outline: 'clear',
        variant: 'gray',
        className: cn(
          'komc:bg-transparent komc:text-gray-800',
          'komc:hover:bg-transparent komc:hover:text-gray-800 komc:hover:underline',
          'komc:active:bg-transparent komc:active:text-gray-800 komc:active:underline',
          'komc:disabled:border-transparent komc:disabled:bg-transparent komc:disabled:text-gray-500',
        ),
      },
    ],
    defaultVariants: {
      size: 'md',
      shadow: 'none',
      outline: 'line',
      variant: 'blue',
      px: '2xl',
      rounded: 'sm',
    },
  },
)

interface VariantMap {
  line: 'blue' | 'duo' | 'white' | 'gray' | 'neutral' | 'sky' | 'sky-blue';
  solid: 'white' | 'gray' | 'blue' | 'night' | 'black' | 'sky' | 'sky-blue' | 'indigo';
  clear: 'sky' | 'gray';
};

type BaseProps = Omit<VariantProps<typeof classes>, 'outline' | 'variant'>;

type ButtonProps = ComponentProps<'button'> &
  BaseProps &
  (
    | { outline?: 'line'; variant?: VariantMap['line'] }
    | { outline: 'solid'; variant?: VariantMap['solid'] }
    | { outline: 'clear'; variant?: VariantMap['clear'] }
  ) & {
    asChild?: boolean;
  };

/**
 * Button component
 * @description Button component or Slot component (asChild)
 * @param outline
 * @property
 * - line
 * - solid
 * - clear
 * @param variant
 * @property line
 * - blue
 * - duo
 * - white
 * - gray
 * - neutral
 * - sky
 * - sky-blue
 * @property solid
 * - white
 * - gray
 * - blue
 * - night
 * - black
 * - sky
 * - sky-blue
 * - indigo
 * @property clear
 * - sky
 * - gray
 * @param px
 * @property
 * - none - px-0
 * - xs - px-0.5
 * - sm - px-1
 * - md - px-1.5
 * - lg - px-2
 * - xl - px-3
 * - 2xl - px-4
 * - 3xl - px-5
 * - 4xl - px-6
 * @param rounded
 * @property
 * - none - rounded-none
 * - sm - rounded-sm
 * - md - rounded-md
 * - lg - rounded-lg
 * - xl - rounded-xl
 * - 2xl - rounded-2xl
 * - 3xl - rounded-3xl
 * - full - rounded-full
 * @param size
 * @property
 * - xxs - h-7.5
 * - xs - h-8
 * - sm - h-9
 * - md - h-10
 * - lg - h-11
 * - xl - h-12
 * - 2xl - h-13
 * - 3xl - h-14
 * - 4xl - h-15
 * @param shadow
 * @property
 * - none
 * - sm
 * - md
 * - lg
 * - xl
 * - 2xl
 * - 3xl
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  type = 'button',
  className,
  id,
  size,
  shadow,
  outline,
  variant,
  px,
  rounded,
  asChild,
  ...rest
}, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      {...rest}
      type={type}
      id={id}
      className={classes({
        size,
        shadow,
        outline,
        variant,
        px,
        rounded,
        className,
      })}
    />
  );
});

export default Button;
