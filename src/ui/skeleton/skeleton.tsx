/* eslint-disable no-nested-ternary */
import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import clsx from 'clsx';

const classes = cva(clsx('komc:w-full komc:animate-pulse komc:bg-gray-200'), {
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
});

/**
 * Props for {@link Skeleton}. Other HTML attributes go to the `<div>`.
 * Passing `style` replaces the `width`/`height` styles.
 */
export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof classes> {
  /**
   * CSS width. Numbers are px (`200` → `'200px'`). Full width if omitted.
   */
  width?: string | number;
  /**
   * CSS height. Numbers are px. Overrides the height from `size`.
   */
  height?: string | number;
  /**
   * Preset height. `xs` 16px · `sm` 32px · `md` 48px · `lg` 64px ·
   * `xl` 80px · `2xl` 96px · `3xl` 112px · `square` 1:1 aspect ratio ·
   * `full` 100%.
   * @default 'sm'
   */
  size?: VariantProps<typeof classes>['size'];
  /**
   * Border radius.
   * @default 'sm'
   */
  rounded?: VariantProps<typeof classes>['rounded'];
}

/**
 * Pulsing gray placeholder shown while content loads. Hidden from assistive
 * technology.
 *
 * @example
 * <Skeleton size="md" rounded="lg" />
 *
 * @example
 * // Avatar
 * <Skeleton size="square" rounded="full" width={48} />
 */
export default function Skeleton({
  size,
  rounded,
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  const widthValue = width
    ? typeof width === 'string'
      ? width
      : `${width}px`
    : undefined;
  const heightValue = height
    ? typeof height === 'string'
      ? height
      : `${height}px`
    : undefined;

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
