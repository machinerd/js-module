import clsx from 'clsx';
import { HTMLAttributes } from 'react';

/**
 * Text whose width does not change when its font weight changes.
 * Reserves the width of the bold version, so switching to bold on hover or
 * selection (e.g. tabs, menu items) causes no layout shift.
 *
 * @example
 * <button className="hover:font-bold aria-selected:font-bold">
 *   <StableText>Settings</StableText>
 * </button>
 */
export default function StableText({
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Text to render. Only strings and numbers are supported. */
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
