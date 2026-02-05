import { cva, VariantProps } from 'class-variance-authority';

const classes = cva('komc:w-full komc:mx-auto komc:relative',
  {
    variants: {
      type: {
        main: 'komc:flex komc:flex-col',
        content: 'komc:grow komc:my-0',
      },
      maxWidth: {
        none: '',
        xs: 'komc:max-w-xs komc:xl:max-w-full',
        sm: 'komc:max-w-sm komc:xl:max-w-full',
        md: 'komc:max-w-md komc:xl:max-w-full',
        lg: 'komc:max-w-lg komc:xl:max-w-full',
        xl: 'komc:max-w-xl komc:xl:max-w-full',
        '2xl': 'komc:max-w-2xl komc:xl:max-w-full',
        '3xl': 'komc:max-w-3xl komc:xl:max-w-full',
        full: 'komc:max-w-full',
      },
    },
    defaultVariants: {
      type: 'main',
      maxWidth: 'full',
    },
  },
);

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  /**
   * @param type - Type of the layout
   * @default main
   * @property
   * - main: flex column
   * - content: grow my-0
   */
  type?: VariantProps<typeof classes>['type'];
  /**
   * @param maxWidth - Maximum width of the layout
   * @default full
   * @property
   * - none: 0
   * - xs: 320px (>=1280px: 100%)
   * - sm: 384px (>=1280px: 100%)
   * - md: 448px (>=1280px: 100%)
   * - lg: 512px (>=1280px: 100%)
   * - xl: 576px (>=1280px: 100%)
   * - 2xl: 672px (>=1280px: 100%)
   * - 3xl: 768px (>=1280px: 100%)
   * - full: 100%
   */
  maxWidth?: VariantProps<typeof classes>['maxWidth'];
}

export default function Layout({
  children,
  className,
  type,
  maxWidth,
  ...props
}: LayoutProps) {
  return (
    <div
      data-komc
      className={classes({ type, maxWidth, className })}
      {...props}
    >
      {children}
    </div>
  );
}
