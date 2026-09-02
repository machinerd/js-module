'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';
import { type ComponentProps, type ReactNode, forwardRef } from 'react';
import { DndItem } from '../../dnd';
import { Label, type LabelProps } from '../label';
import { TextField, type TextFieldFileVariantColor } from '../text-field';

export interface FileLanguage {
  value: string;
  label: string;
}

const rowClasses = clsx(
  'komc:flex komc:flex-row komc:items-center komc:justify-between komc:gap-x-4',
  'komc:w-full komc:min-w-87.5 komc:h-15 komc:px-4 komc:py-3 komc:shadow-field',
  'komc:rounded-sm komc:border-[0.6px] komc:border-neutral-300 komc:bg-white',
);

const slotClasses =
  'komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square komc:[&_svg]:w-3.5 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500';

export interface FileFieldProps extends ComponentProps<'input'> {
  label?: Omit<LabelProps, 'children'>;
  dragId: string;
  path: string;
  color?: TextFieldFileVariantColor;
  fileIcon: IconProp;
  options?: FileLanguage[];
  checkedLanguages?: FileLanguage[] | string[];
  isAllLanguagesChecked?: boolean;
  onChecked?: (language: FileLanguage, checked: boolean) => void;
  onDelete: () => void;
  handle: ReactNode;
  action: ReactNode;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

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
  attributes: DraggableAttributes;
  listeners?: SortableListeners;
}

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
