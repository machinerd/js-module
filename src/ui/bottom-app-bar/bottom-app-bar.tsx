import clsx from 'clsx';
import React from 'react';

export interface BottomAppBarProps<
  T,
> extends React.HTMLAttributes<HTMLElement> {
  items: T[];
  render: (item: T) => React.ReactNode;
}

/**
 * @param items - Items to render
 * @param render - Render function
 */
export default function BottomAppBar<T>({
  className,
  items,
  render,
  ...props
}: BottomAppBarProps<T>): React.ReactNode {
  return (
    <nav
      className={clsx(
        'komc:fixed komc:bottom-0 komc:left-0 komc:right-0 komc:box-border',
        'komc:border-t komc:border-neutral-200 komc:bg-white komc:z-10',
        className,
      )}
      {...props}
    >
      <div
        className="komc:grid komc:min-h-15 komc:p-0"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item, index) => {
          return <React.Fragment key={index}>{render(item)}</React.Fragment>;
        })}
      </div>
    </nav>
  );
}
