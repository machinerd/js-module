'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { type ComponentProps, type ReactNode, forwardRef } from 'react';
import { DndItem } from '../../dnd';
import { Label, type LabelProps } from '../label';
import { TextField, type TextFieldFileVariantColor } from '../text-field';

/** Language checkbox option of {@link FileField}. */
export interface FileLanguage {
  /** Language code (e.g. `'ko'`). */
  value: string;
  /** Checkbox text. */
  label: string;
}

const rowClasses = clsx(
  'komc:flex komc:flex-row komc:items-center komc:justify-between komc:gap-x-4',
  'komc:w-full komc:min-w-87.5 komc:h-15 komc:px-4 komc:py-3 komc:shadow-field',
  'komc:rounded-sm komc:border-[0.6px] komc:border-neutral-300 komc:bg-white',
);

const slotClasses =
  'komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square komc:[&_svg]:w-3.5 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500';

/**
 * Props for {@link FileField}. Native input attributes (`value`, `onChange`,
 * `name`, ...) go to the file name input.
 */
export interface FileFieldProps extends ComponentProps<'input'> {
  /**
   * Label shown above the row. `label.id` becomes the input's `id`.
   * See `LabelProps`.
   */
  label?: Omit<LabelProps, 'children'>;
  /**
   * Sortable id. Must match the item's id in the surrounding `DndWrapper`
   * (e.g. `field.id` from `useFieldArray`).
   */
  dragId: string;
  /** File URL opened in a new tab by the file link. */
  path: string;
  /**
   * File link background tint.
   * @default 'green'
   */
  color?: TextFieldFileVariantColor;
  /** Font Awesome icon of the file link (e.g. `faFile`). */
  fileIcon: IconProp;
  /**
   * Languages shown as checkboxes after the input.
   * @default []
   */
  options?: FileLanguage[];
  /**
   * Initially checked languages (options or their `value`s).
   * Only read on mount.
   * @default []
   */
  checkedLanguages?: FileLanguage[] | string[];
  /**
   * Hide the language checkboxes.
   * @default false
   */
  isAllLanguagesChecked?: boolean;
  /** Called when a language checkbox changes. */
  onChecked?: (language: FileLanguage, checked: boolean) => void;
  /** Called when the delete button is clicked. */
  onDelete: () => void;
  /** Drag handle content, e.g. `<FontAwesomeIcon icon={faGripVertical} />`. */
  handle: ReactNode;
  /** Delete button content, e.g. `<FontAwesomeIcon icon={faTrash} />`. */
  action: ReactNode;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

/**
 * Sortable row for an attached file: drag handle, file link + name input,
 * optional language checkboxes and a delete button.
 *
 * Must be rendered inside `DndWrapper` (or a dnd-kit `SortableContext`).
 * `ref` points to the name input.
 *
 * @example
 * const { fields, move, remove } = useFieldArray({ control, name: 'files' });
 *
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field, index) => (
 *     <FileField
 *       key={field.id}
 *       dragId={field.id}
 *       path={field.url}
 *       fileIcon={faFile}
 *       handle={<FontAwesomeIcon icon={faGripVertical} />}
 *       action={<FontAwesomeIcon icon={faTrash} />}
 *       onDelete={() => remove(index)}
 *       {...register(`files.${index}.name`)}
 *     />
 *   ))}
 * </DndWrapper>
 */
export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  ({ label, dragId, ...props }, ref) => {
    return (
      <DndItem
        id={dragId}
        render={(attributes, listeners) => (
          <Label {...label}>
            <FileFieldItem
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

export interface FileFieldItemProps extends Omit<FileFieldProps, 'dragId'> {
  /** dnd-kit attributes spread onto the drag handle. */
  attributes: DraggableAttributes;
  /** dnd-kit listeners spread onto the drag handle. */
  listeners?: SortableListeners;
}

/**
 * Row UI of {@link FileField} without the sortable wrapper and label.
 * Use it when you wire dnd-kit yourself.
 */
export const FileFieldItem = forwardRef<HTMLInputElement, FileFieldItemProps>(
  (
    {
      path,
      color = 'green',
      fileIcon,
      options = [],
      checkedLanguages = [],
      isAllLanguagesChecked = false,
      attributes,
      listeners,
      onChecked,
      onDelete,
      handle,
      action,
      ...props
    },
    ref,
  ) => {
    return (
      <div data-komc className={rowClasses}>
        <div className="komc:flex komc:flex-row komc:items-center komc:gap-x-4 komc:w-full">
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
            shadow={false}
            className="komc:max-w-100"
            size="sm"
            variant="file"
            path={path}
            color={color}
            fileIcon={fileIcon}
            ref={ref}
          />
          {!isAllLanguagesChecked &&
            options.map((language) => (
              <label
                key={language.value}
                className="komc:flex komc:flex-row komc:gap-x-2 komc:cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={checkedLanguages.some((item) =>
                    typeof item === 'string'
                      ? item === language.value
                      : item.value === language.value,
                  )}
                  onChange={(event) =>
                    onChecked?.(language, event.target.checked)
                  }
                />
                <span className="komc:text-sm komc:text-neutral-800 komc:whitespace-nowrap">
                  {language.label}
                </span>
              </label>
            ))}
        </div>
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
  },
);
