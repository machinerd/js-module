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

export interface BottomAppBarProps<T>
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof classes> {
  items: T[];
  render: (item: T) => React.ReactNode;
}

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
