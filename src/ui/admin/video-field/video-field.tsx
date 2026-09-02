'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { useSortable } from '@dnd-kit/sortable';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { type ComponentProps, type ReactNode, forwardRef } from 'react';
import { DndItem } from '../../dnd';
import { Label, type LabelProps } from '../label';
import { TextField } from '../text-field';

const classes = cva(
  clsx(
    'komc:flex komc:flex-row komc:items-center komc:gap-x-4',
    'komc:w-full komc:h-15.5 komc:px-4 komc:py-3 komc:rounded-sm',
    'komc:border-[0.6px] komc:border-neutral-300 komc:shadow-field',
  ),
  {
    variants: {
      disabled: {
        true: 'komc:bg-white/40',
        false: 'komc:bg-white',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

const slotClasses =
  'komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square komc:[&_svg]:w-3.5 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500';

export interface VideoFieldProps extends ComponentProps<'input'> {
  label?: Omit<LabelProps, 'children'>;
  dragId: string;
  disabled?: boolean;
  onDelete: () => void;
  handle: ReactNode;
  action: ReactNode;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

export const VideoField = forwardRef<HTMLInputElement, VideoFieldProps>(
  ({ label, dragId, ...props }, ref) => {
    return (
      <DndItem
        id={dragId}
        render={(attributes, listeners) => (
          <Label {...label}>
            <VideoFieldItem
              id={label?.id}
              {...props}
              ref={ref}
              attributes={attributes}
              listeners={listeners}
            />
          </Label>
        )}
      />
    );
  },
);

export interface VideoFieldItemProps extends Omit<VideoFieldProps, 'dragId'> {
  attributes: DraggableAttributes;
  listeners?: SortableListeners;
}

export const VideoFieldItem = forwardRef<HTMLInputElement, VideoFieldItemProps>(
  (
    {
      disabled = false,
      attributes,
      listeners,
      placeholder = 'URL',
      onDelete,
      handle,
      action,
      ...props
    },
    ref,
  ) => {
    return (
      <div data-komc className={classes({ disabled })}>
        <div
          className={clsx(slotClasses, 'komc:cursor-grab')}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          {handle}
        </div>
        <TextField
          {...props}
          size="md"
          disabled={disabled}
          placeholder={placeholder}
          ref={ref}
        />
        <button
          type="button"
          className={clsx(slotClasses, 'komc:cursor-pointer')}
          disabled={disabled}
          aria-label="Delete"
          onClick={onDelete}
        >
          {action}
        </button>
      </div>
    );
  },
);
