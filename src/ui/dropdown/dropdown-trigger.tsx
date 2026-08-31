'use client';

import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps } from 'react';
import { cn } from '../../util/common';
import { useDropdown } from './dropdown-context';

export interface DropdownTriggerProps extends ComponentProps<'button'> {
  asChild?: boolean;
}

export function DropdownTrigger({
  asChild = true,
  className,
  type = 'button',
  ...rest
}: DropdownTriggerProps) {
  const { open, refs, getReferenceProps } = useDropdown();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-komc
      data-state={open ? 'open' : 'closed'}
      type={asChild ? undefined : type}
      className={cn(
        !asChild && 'komc:inline-flex komc:items-center komc:outline-none',
        className,
      )}
      {...getReferenceProps({
        ...rest,
        ref: refs.setReference,
      })}
    />
  );
}
