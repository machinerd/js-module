'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { type ReactNode } from 'react';
import { DndItem } from '../../dnd';
import { TextField, type TextFieldProps } from '../text-field';

const rowClasses = clsx(
  'komc-series-field',
  'komc:flex komc:items-center komc:gap-4',
  'komc:bg-white komc:shadow-sm komc:rounded-sm',
  'komc:border komc:border-neutral-200 komc:p-4',
  'komc:relative komc:w-full',
);

const slotClasses =
  'komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square komc:[&_svg]:w-3.5 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500';

export type SeriesTextFieldProps = Omit<
  Extract<TextFieldProps, { variant: 'prefix-text' }>,
  'variant'
>;

export interface SeriesFieldProps {
  dragId: string;
  onDelete: () => void;
  handle: ReactNode;
  action: ReactNode;
  items: SeriesTextFieldProps[];
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

export const SeriesField = ({ dragId, ...props }: SeriesFieldProps) => {
  return (
    <DndItem
      id={dragId}
      render={(attributes, listeners) => (
        <SeriesFieldItem
          {...props}
          attributes={attributes}
          listeners={listeners}
        />
      )}
    />
  );
};

export interface SeriesFieldItemProps extends Omit<SeriesFieldProps, 'dragId'> {
  attributes: DraggableAttributes;
  listeners?: SortableListeners;
}

export const SeriesFieldItem = ({
  items,
  attributes,
  listeners,
  onDelete,
  handle,
  action,
}: SeriesFieldItemProps) => {
  return (
    <div data-komc className={rowClasses}>
      <div
        className={clsx(slotClasses, 'komc:cursor-grab')}
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        {handle}
      </div>
      {items.map((item, index) => (
        <TextField
          key={item.id ?? `${item.prefix}-${index}`}
          shadow={false}
          size="xs"
          {...item}
          variant="prefix-text"
        />
      ))}
      <button
        type="button"
        className={clsx(slotClasses, 'komc:cursor-pointer')}
        aria-label="Delete"
        onClick={onDelete}
      >
        {action}
      </button>
    </div>
  );
};
