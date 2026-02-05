import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { cn } from '../../util';
import { HTMLAttributes } from 'react';

const classes = cva(
  cn(
    'komc:flex komc:items-center',
    'komc:mx-auto komc:min-h-10',
  ),
  {
    variants: {
      maxWidth: {
        none: '',
        sm: 'komc:max-w-sm',
        md: 'komc:max-w-md',
        lg: 'komc:max-w-lg',
        xl: 'komc:max-w-xl',
        '2xl': 'komc:max-w-2xl',
        '3xl': 'komc:max-w-3xl',
        '4xl': 'komc:max-w-4xl',
        '5xl': 'komc:max-w-5xl',
        '6xl': 'komc:max-w-6xl',
        '7xl': 'komc:max-w-7xl',
        '8xl': 'komc:max-w-330',
        full: 'komc:max-w-full',
      },
      size: {
        sm: 'komc:h-10',
        md: 'komc:h-12',
        lg: 'komc:h-14',
        xl: 'komc:h-16',
        '2xl': 'komc:h-18',
        '3xl': 'komc:h-20',
        '4xl': 'komc:h-22',
        '4.25xl': 'komc:h-22.5',
        '5xl': 'komc:h-24',
        '6xl': 'komc:h-26',
        '7xl': 'komc:h-28',
        '8xl': 'komc:h-30',
        full: 'komc:h-full',
      },
    },
    defaultVariants: {
      maxWidth: 'full',
      size: 'xl',
    },
  },
);

export interface HeaderProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  children?: React.ReactNode;
  /**
   * @param maxWidth - Maximum width of the header
   * @default full
   * @property
   * - none: 0
   * - xs: 320px
   * - sm: 384px
   * - md: 448px
   * - lg: 512px
   * - xl: 576px
   * - 2xl: 672px
   * - 3xl: 768px
   * - 4xl: 896px
   * - 5xl: 1024px
   * - 6xl: 1152px
   * - 7xl: 1280px
   * - 8xl: 1320px
   * - full: 100% 
   */
  maxWidth?: VariantProps<typeof classes>['maxWidth'];
  /**
   * @param size - Size of the header
   * @default xl
   * @property
   * - sm: 40px
   * - md: 48px
   * - lg: 56px
   * - xl: 64px
   * - 2xl: 72px
   * - 3xl: 88px
   * - 4xl: 80px
   * - 4.25xl: 90px
   * - 5xl: 96px
   * - 6xl: 104px
   * - 7xl: 112px
   * - 8xl: 120px
   * - full: 100%
   */
  size?: VariantProps<typeof classes>['size'];
}

export default function Header({
  children,
  maxWidth,
  size,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      data-komc
      className={clsx(
        'komc:w-full komc:sticky komc:top-0 komc:z-1000 komc:bg-white',
        'komc:transition-all komc:duration-200',
        className,
      )}
      {...props}
    >
      <div className={classes({ maxWidth, size })}>
        {children}
      </div>
    </header>
  );
}
