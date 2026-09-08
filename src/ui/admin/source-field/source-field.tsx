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

export interface SourceLanguage {
  label: string;
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

export interface SourceFieldProps extends Omit<
  ComponentProps<'input'>,
  'onSelect' | 'defaultValue'
> {
  label?: Omit<LabelProps, 'children'>;
  dragId: string;
  disabled?: boolean;
  options: SourceLanguage[];
  defaultValue?: SourceLanguage | null;
  inputDefaultValue?: ComponentProps<'input'>['defaultValue'];
  menuPlacement?: MenuPlacement;
  onDelete: () => void;
  handle: ReactNode;
  action: ReactNode;
  onSelect?: (
    newValue: SourceLanguage | null,
    actionMeta: ActionMeta<SourceLanguage>,
  ) => void;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

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
  attributes: DraggableAttributes;
  listeners?: SortableListeners;
}

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
