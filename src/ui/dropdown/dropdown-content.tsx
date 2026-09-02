'use client';

import { FloatingPortal } from '@floating-ui/react';
import { type ComponentProps } from 'react';
import { cn } from '../../util/common';
import { useDropdown } from './dropdown-context';

export type DropdownContentProps = ComponentProps<'div'>;

export function DropdownContent({
  className,
  children,
  onMouseDown,
  onClick,
  ...rest
}: DropdownContentProps) {
  const { open, refs, floatingStyles, getFloatingProps, preserveFocus } =
    useDropdown();

  if (!open) return null;

  return (
    <FloatingPortal>
      <div
        data-komc
        {...getFloatingProps({
          ...rest,
          ref: refs.setFloating,
          style: { ...floatingStyles, ...rest.style },
          className: cn('komc:z-50 komc:mt-0.5 komc:drop-shadow-md', className),
          onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
            if (preserveFocus) event.preventDefault();
            onMouseDown?.(event);
          },
          onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            onClick?.(event);
          },
        })}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
