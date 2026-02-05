import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { cn } from '../../util';

const classes = cva(
  cn('komc:w-full komc:animate-pulse komc:bg-gray-200'),
  {
    variants: {
      size: {
        xs: 'komc:h-4',
        sm: 'komc:h-8',
        md: 'komc:h-12',
        lg: 'komc:h-16',
        xl: 'komc:h-20',
        '2xl': 'komc:h-24',
        '3xl': 'komc:h-28',
        square: 'komc:h-auto komc:aspect-square',
        full: 'komc:h-full',
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
    defaultVariants: {
      size: 'sm',
      rounded: 'sm',
    },
  },
);

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  /**
   * @param width - Width of the skeleton
   * @description string or number, number unit is px
   * @default 100
   */
  width?: string | number;
  /**
   * @param height - Height of the skeleton
   * @description string or number, number unit is px
   * @default 100
   */
  height?: string | number;
  /**
   * @param size - Size of the skeleton (height)
   * @default sm
   * @property
   * - xs: 4px
   * - sm: 8px
   * - md: 12px
   * - lg: 16px
   * - xl: 20px
   * - 2xl: 24px
   * - 3xl: 28px
   * - square: 100%
   * - full: 100%
   */
  size?: VariantProps<typeof classes>['size'];
  /**
   * @param rounded - Rounded of the skeleton
   * @default sm
   * @property
   * - none: 0
   * - sm: 2px
   * - md: 6px
   * - lg: 8px
   * - xl: 12px
   * - 2xl: 16px
   * - 3xl: 20px
   * - full: 100%
   */
  rounded?: VariantProps<typeof classes>['rounded'];
}

/**
 * @param size - Size of the skeleton (height)
 * @param rounded - Rounded of the skeleton
 * @param width - Width of the skeleton
 * @param height - Height of the skeleton
 */
export default function Skeleton({ size, rounded, width, height, className, ...props }: SkeletonProps) {
  const widthValue = width ? typeof width === 'string' ? width : `${width}px` : undefined;
  const heightValue = height ? typeof height === 'string' ? height : `${height}px` : undefined;

  return (
    <div
      data-komc
      className={classes({ size, rounded, className })}
      style={{ width: widthValue, height: heightValue }}
      {...props}
    />
  );
}
