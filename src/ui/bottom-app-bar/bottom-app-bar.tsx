import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import React from 'react';

const classes = cva('komc:grid', {
  variants: {
    size: {
      auto: '',
      xxs: 'komc:min-h-10',
      xs: 'komc:min-h-12',
      'xs-caption': 'komc:min-h-12.5',
      caption: 'komc:min-h-13',
      sm: 'komc:min-h-14',
      'sm-base': 'komc:min-h-15',
      base: 'komc:min-h-16',
      'base-lg': 'komc:min-h-17',
      lg: 'komc:min-h-18',
    },
  },
  defaultVariants: {
    size: 'sm-base',
  },
});

/**
 * Props for {@link BottomAppBar}.
 *
 * Other HTML attributes (`className`, `style`, ...) go to the outer `<nav>`.
 *
 * @template T Item type passed to `render`.
 */
export interface BottomAppBarProps<T>
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof classes> {
  /** Items to render. Each item gets an equal-width grid column. */
  items: T[];
  /**
   * Renders one item. The result is placed directly inside a `<ul>`,
   * so return an `<li>` for valid markup.
   */
  render: (item: T) => React.ReactNode;
  /**
   * Minimum bar height.
   * `xxs` 40px · `xs` 48px · `xs-caption` 50px · `caption` 52px · `sm` 56px ·
   * `sm-base` 60px · `base` 64px · `base-lg` 68px · `lg` 72px · `auto` none.
   * @default 'sm-base'
   */
  size?: VariantProps<typeof classes>['size'];
}

/**
 * Navigation bar fixed to the bottom of the viewport.
 *
 * @template T Item type passed to `render`.
 *
 * @example
 * const tabs = [
 *   { label: 'Home', href: '/' },
 *   { label: 'Search', href: '/search' },
 * ];
 *
 * <BottomAppBar
 *   items={tabs}
 *   render={(tab) => (
 *     <li>
 *       <a href={tab.href}>{tab.label}</a>
 *     </li>
 *   )}
 * />
 */
export default function BottomAppBar<T>({
  className,
  items,
  render,
  size,
  ...props
}: BottomAppBarProps<T>): React.ReactNode {
  return (
    <nav
      data-komc
      aria-label="bottom app bar"
      className={clsx(
        'komc:fixed komc:bottom-0 komc:left-0 komc:right-0',
        'komc:border-t komc:border-neutral-200 komc:bg-white komc:z-10',
        className,
      )}
      {...props}
    >
      <ul
        className={classes({ size })}
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item, index) => {
          return <React.Fragment key={index}>{render(item)}</React.Fragment>;
        })}
      </ul>
    </nav>
  );
}
