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

/**
 * Props of one input in {@link SeriesField}: `TextField` props for
 * `variant="prefix-text"` (without `variant`). `prefix` is required.
 */
export type SeriesTextFieldProps = Omit<
  Extract<TextFieldProps, { variant: 'prefix-text' }>,
  'variant'
>;

export interface SeriesFieldProps {
  /** Sortable id. Must match the item's id in the surrounding `DndWrapper`. */
  dragId: string;
  /** Called when the delete button is clicked. */
  onDelete: () => void;
  /** Drag handle content, e.g. `<FontAwesomeIcon icon={faGripVertical} />`. */
  handle: ReactNode;
  /** Delete button content, e.g. `<FontAwesomeIcon icon={faTrash} />`. */
  action: ReactNode;
  /**
   * Inputs shown side by side, each with a `prefix` label (e.g. one per
   * language). Default to `size="xs"` without shadow; override per item.
   */
  items: SeriesTextFieldProps[];
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

/**
 * Sortable row of prefixed text inputs (e.g. a series title per language)
 * with a drag handle and delete button. Has no label.
 *
 * Must be rendered inside `DndWrapper` (or a dnd-kit `SortableContext`).
 *
 * @example
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field, index) => (
 *     <SeriesField
 *       key={field.id}
 *       dragId={field.id}
 *       handle={<FontAwesomeIcon icon={faGripVertical} />}
 *       action={<FontAwesomeIcon icon={faTrash} />}
 *       onDelete={() => remove(index)}
 *       items={[
 *         { prefix: 'KO', ...register(`series.${index}.titleKo`) },
 *         { prefix: 'EN', ...register(`series.${index}.titleEn`) },
 *       ]}
 *     />
 *   ))}
 * </DndWrapper>
 */
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
  /** dnd-kit attributes spread onto the drag handle. */
  attributes: DraggableAttributes;
  /** dnd-kit listeners spread onto the drag handle. */
  listeners?: SortableListeners;
}

/**
 * Row UI of {@link SeriesField} without the sortable wrapper.
 * Use it when you wire dnd-kit yourself.
 */
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
