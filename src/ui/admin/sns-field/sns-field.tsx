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

/** Symbols identifying SNS sites. Match them against `SnsSiteOption.value`. */
export const SnsSite = {
  Other: Symbol('sns-site.other'),
  Naver: Symbol('sns-site.naver'),
  Kakao: Symbol('sns-site.kakao'),
  Facebook: Symbol('sns-site.facebook'),
  Instagram: Symbol('sns-site.instagram'),
  LinkedIn: Symbol('sns-site.linkedin'),
  WhatsApp: Symbol('sns-site.whatsapp'),
  Skype: Symbol('sns-site.skype'),
  WeChat: Symbol('sns-site.wechat'),
  YouTube: Symbol('sns-site.youtube'),
  Twitter: Symbol('sns-site.twitter'),
  Tistory: Symbol('sns-site.tistory'),
} as const;

export type SnsSite = (typeof SnsSite)[keyof typeof SnsSite];

/** SNS site option of {@link SnsField}. */
export interface SnsSiteOption {
  /** Display name. */
  label: string;
  /** Numeric site code. Also used as the option's select value. */
  site: number;
  /** Matching {@link SnsSite} symbol. */
  value?: symbol;
}

/**
 * Default SNS options (Korean labels). `site` codes go from 0 (Other)
 * in steps of 10.
 */
export const SITE_OPTIONS: SnsSiteOption[] = [
  { label: '기타', site: 0, value: SnsSite.Other },
  { label: '네이버', site: 10, value: SnsSite.Naver },
  { label: '카카오', site: 20, value: SnsSite.Kakao },
  { label: '페이스북', site: 30, value: SnsSite.Facebook },
  { label: '인스타그램', site: 40, value: SnsSite.Instagram },
  { label: '링크드인', site: 50, value: SnsSite.LinkedIn },
  { label: '왓츠앱', site: 60, value: SnsSite.WhatsApp },
  { label: '스카이프', site: 70, value: SnsSite.Skype },
  { label: '위챗', site: 80, value: SnsSite.WeChat },
  { label: '유튜브', site: 90, value: SnsSite.YouTube },
  { label: '트위터', site: 100, value: SnsSite.Twitter },
  { label: '티스토리', site: 110, value: SnsSite.Tistory },
];

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
 * Props for {@link SnsField}. Native input attributes (`value`, `onChange`,
 * `name`, ...) go to the URL input.
 */
export interface SnsFieldProps extends Omit<
  ComponentProps<'input'>,
  'onSelect'
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
  /**
   * Initially selected site: an option, its `SnsSite` symbol, or its
   * numeric `site` code. Only read on mount.
   */
  selectedSns: SnsSiteOption | symbol | number;
  /**
   * Site options.
   * @default SITE_OPTIONS
   */
  options?: SnsSiteOption[];
  /**
   * Where the site menu opens.
   * @default 'top'
   */
  menuPlacement?: MenuPlacement;
  /** Called when the delete button is clicked. */
  onDelete: () => void;
  /** Drag handle content, e.g. `<FontAwesomeIcon icon={faGripVertical} />`. */
  handle: ReactNode;
  /** Delete button content, e.g. `<FontAwesomeIcon icon={faTrash} />`. */
  action: ReactNode;
  /** Called when a site is picked. */
  onSelect?: (
    newValue: SnsSiteOption | null,
    actionMeta: ActionMeta<SnsSiteOption>,
  ) => void;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

const resolveSelectedSns = (
  selectedSns: SnsSiteOption | symbol | number,
  options: SnsSiteOption[],
): SnsSiteOption | undefined => {
  if (typeof selectedSns === 'number') {
    return options.find((option) => option.site === selectedSns);
  }
  if (typeof selectedSns === 'symbol') {
    return options.find((option) => option.value === selectedSns);
  }
  return selectedSns;
};

/**
 * Sortable row for an SNS link: drag handle, site select, URL input and
 * delete button.
 *
 * Must be rendered inside `DndWrapper` (or a dnd-kit `SortableContext`).
 * `ref` points to the URL input; `placeholder` defaults to `'URL'`.
 *
 * @example
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field, index) => (
 *     <SnsField
 *       key={field.id}
 *       dragId={field.id}
 *       selectedSns={field.site}
 *       onSelect={(option) =>
 *         option && setValue(`sns.${index}.site`, option.site)
 *       }
 *       handle={<FontAwesomeIcon icon={faGripVertical} />}
 *       action={<FontAwesomeIcon icon={faTrash} />}
 *       onDelete={() => remove(index)}
 *       {...register(`sns.${index}.url`)}
 *     />
 *   ))}
 * </DndWrapper>
 */
export const SnsField = forwardRef<HTMLInputElement, SnsFieldProps>(
  ({ label, dragId, ...props }, ref) => {
    return (
      <DndItem
        id={dragId}
        render={(attributes, listeners) => (
          <Label {...label}>
            <SnsFieldItem
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

export interface SnsFieldItemProps extends Omit<SnsFieldProps, 'dragId'> {
  /** dnd-kit attributes spread onto the drag handle. */
  attributes: DraggableAttributes;
  /** dnd-kit listeners spread onto the drag handle. */
  listeners?: SortableListeners;
}

/**
 * Row UI of {@link SnsField} without the sortable wrapper and label.
 * Use it when you wire dnd-kit yourself.
 */
export const SnsFieldItem = forwardRef<HTMLInputElement, SnsFieldItemProps>(
  (
    {
      disabled = false,
      placeholder = 'URL',
      attributes,
      listeners,
      selectedSns,
      options = SITE_OPTIONS,
      menuPlacement = 'top',
      onDelete,
      onSelect,
      handle,
      action,
      ...props
    },
    ref,
  ) => {
    const defaultValue = resolveSelectedSns(selectedSns, options);

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
          <SelectField<SnsSiteOption>
            size="sm"
            rounded="sm"
            placeholder="Language"
            className="komc:min-w-37.5 komc:max-w-37.5"
            menuPlacement={menuPlacement}
            isDisabled={disabled}
            options={options}
            defaultValue={defaultValue}
            getOptionValue={(option) => String(option.site)}
            onChange={onSelect}
          />
          <TextField
            {...props}
            size="md"
            disabled={disabled}
            placeholder={placeholder}
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
