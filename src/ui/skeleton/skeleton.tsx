import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { cn } from '../../util/common';

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
  width?: string | number;
  height?: string | number;
  size?: VariantProps<typeof classes>['size'];
  rounded?: VariantProps<typeof classes>['rounded'];
}

export default function Skeleton({ size, rounded, width, height, className, ...props }: SkeletonProps) {
  const widthValue = width ? typeof width === 'string' ? width : `${width}px` : undefined;
  const heightValue = height ? typeof height === 'string' ? height : `${height}px` : undefined;

  return (
    <div
      data-komc
      aria-hidden="true"
      className={classes({ size, rounded, className })}
      style={{ width: widthValue, height: heightValue }}
      {...props}
    />
  );
}
