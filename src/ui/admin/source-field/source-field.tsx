'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { useSortable } from '@dnd-kit/sortable';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { type ComponentProps, type ReactNode, forwardRef } from 'react';
import type { ActionMeta, MenuPlacement } from 'react-select';
import { DndItem } from '../../dnd';
import { Label, type LabelProps } from '../label';
import { SelectField } from '../select-field';
import { TextField } from '../text-field';

/** Language option of {@link SourceField}. */
export interface SourceLanguage {
  /** Display name. */
  label: string;
  /** Language code (e.g. `'ko'`). */
  value: string;
}

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

/**
 * Props for {@link SourceField}. Native input attributes (`value`,
 * `onChange`, `name`, ...) go to the URL input.
 */
export interface SourceFieldProps extends Omit<
  ComponentProps<'input'>,
  'onSelect' | 'defaultValue'
> {
  /**
   * Label shown above the row. `label.id` becomes the input's `id`.
   * See `LabelProps`.
   */
  label?: Omit<LabelProps, 'children'>;
  /** Sortable id. Must match the item's id in the surrounding `DndWrapper`. */
  dragId: string;
  /**
   * Disable the select, input and delete button.
   * @default false
   */
  disabled?: boolean;
  /** Language options of the select. */
  options: SourceLanguage[];
  /** Initially selected language. Only read on mount. */
  defaultValue?: SourceLanguage | null;
  /** Initial URL input value (uncontrolled). */
  inputDefaultValue?: ComponentProps<'input'>['defaultValue'];
  /** Where the language menu opens. Defaults to react-select's `'bottom'`. */
  menuPlacement?: MenuPlacement;
  /** Called when the delete button is clicked. */
  onDelete: () => void;
  /** Drag handle content, e.g. `<FontAwesomeIcon icon={faGripVertical} />`. */
  handle: ReactNode;
  /** Delete button content, e.g. `<FontAwesomeIcon icon={faTrash} />`. */
  action: ReactNode;
  /** Called when a language is picked. */
  onSelect?: (
    newValue: SourceLanguage | null,
    actionMeta: ActionMeta<SourceLanguage>,
  ) => void;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

/**
 * Sortable row for a source link: drag handle, language select
 * (not searchable), URL input and delete button.
 *
 * Must be rendered inside `DndWrapper` (or a dnd-kit `SortableContext`).
 * `ref` points to the URL input; `placeholder` defaults to `'URL'`.
 *
 * @example
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field, index) => (
 *     <SourceField
 *       key={field.id}
 *       dragId={field.id}
 *       options={languages}
 *       defaultValue={languages.find((l) => l.value === field.language)}
 *       onSelect={(language) =>
 *         setValue(`sources.${index}.language`, language?.value)
 *       }
 *       handle={<FontAwesomeIcon icon={faGripVertical} />}
 *       action={<FontAwesomeIcon icon={faTrash} />}
 *       onDelete={() => remove(index)}
 *       {...register(`sources.${index}.url`)}
 *     />
 *   ))}
 * </DndWrapper>
 */
export const SourceField = forwardRef<HTMLInputElement, SourceFieldProps>(
  ({ label, dragId, ...props }, ref) => {
    return (
      <DndItem
        id={dragId}
        render={(attributes, listeners) => (
          <Label {...label}>
            <SourceFieldItem
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

export interface SourceFieldItemProps extends Omit<SourceFieldProps, 'dragId'> {
  /** dnd-kit attributes spread onto the drag handle. */
  attributes: DraggableAttributes;
  /** dnd-kit listeners spread onto the drag handle. */
  listeners?: SortableListeners;
}

/**
 * Row UI of {@link SourceField} without the sortable wrapper and label.
 * Use it when you wire dnd-kit yourself.
 */
export const SourceFieldItem = forwardRef<
  HTMLInputElement,
  SourceFieldItemProps
>(
  (
    {
      disabled = false,
      placeholder = 'URL',
      attributes,
      listeners,
      options,
      defaultValue,
      inputDefaultValue,
      menuPlacement,
      onDelete,
      onSelect,
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
        <div className="komc:flex komc:flex-row komc:items-center komc:gap-x-2.5 komc:w-full">
          <SelectField<SourceLanguage>
            size="sm"
            rounded="sm"
            placeholder="Language"
            className="komc:min-w-30.75 komc:max-w-30.75"
            menuPlacement={menuPlacement}
            isSearchable={false}
            isDisabled={disabled}
            options={options}
            defaultValue={defaultValue}
            onChange={onSelect}
          />
          <TextField
            {...props}
            size="md"
            disabled={disabled}
            placeholder={placeholder}
            defaultValue={inputDefaultValue}
            ref={ref}
          />
        </div>
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
