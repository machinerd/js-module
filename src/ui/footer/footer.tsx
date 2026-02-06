import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const classes = cva(
  'komc:flex komc:flex-col komc:w-full komc:mx-auto',
  {
    variants: {
      maxWidth: {
        none: '',
        xs: 'komc:max-w-xs',
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
        full: 'komc:max-w-full',
      },
    },
    defaultVariants: {
      maxWidth: 'full',
    },
  },
);

export interface FooterProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  /**
   * @param maxWidth - Maximum width of the footer
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
   * - full: 100%
   */
  maxWidth?: VariantProps<typeof classes>['maxWidth'];
}

export default function Footer({
  className,
  children,
  maxWidth,
  ...props
}: FooterProps) {
  return (
    <footer
      data-komc
      className={clsx(
        'komc:block komc:w-full komc:h-full',
        'komc:bg-white komc:border-t komc:border-neutral-200',
        className,
      )}
      {...props}
    >
      <div className={classes({ maxWidth })}>
        {children}
      </div>
    </footer>
  );
}
