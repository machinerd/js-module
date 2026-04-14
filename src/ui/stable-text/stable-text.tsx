import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export default function StableText({
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children: string | number;
}) {
  return (
    <span
      {...props}
      data-komc
      data-text={`${children}`}
      className={clsx(
        'komc:inline-flex komc:flex-col komc:justify-center komc:items-center',
        'komc:after:content-[attr(data-text)] komc:after:font-bold',
        'komc:after:h-0 komc:after:invisible komc:after:overflow-hidden',
        'komc:after:select-none komc:after:pointer-events-none',
        className,
      )}
    >
      {children}
    </span>
  );
}
