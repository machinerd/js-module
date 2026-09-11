'use client';

import { type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { type ComponentProps, useEffect, useState } from 'react';
import type {
  ActionMeta,
  GroupBase,
  OnChangeValue,
  OptionsOrGroups,
} from 'react-select';
import type { Props as StateManagerProps } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { BaseInput } from '../../../util/fetcher';
import { Label } from '../label';
import {
  baseClassNames,
  controlClasses,
  valueContainerClasses,
} from '../select-field';

/** Pagination state passed between `loadOptions` calls. */
export interface AdditionalType {
  /** 1-based page number. */
  page: number;
  /** Items per page. */
  pageSize: number;
}

/**
 * Props for {@link AsyncSelectField}. Accepts `react-select` props
 * (`placeholder`, `getOptionLabel`, `isClearable`, ...) except `value`,
 * `onChange` and `loadOptions`, which are managed internally.
 *
 * @template Option Option type returned by `fetcher`.
 * @template IsMulti `true` for multi-select (`isMulti`).
 * @template Input Input type `fetcher` receives.
 */
export interface AsyncSelectFieldProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Input extends BaseInput = BaseInput,
>
  extends
    StateManagerProps<Option, IsMulti, GroupBase<Option>>,
    VariantProps<typeof valueContainerClasses>,
    VariantProps<typeof controlClasses> {
  /** Label shown above the select. See `LabelProps`. */
  label?: ComponentProps<typeof Label>;
  /**
   * Loads one page of options. Called on open, on search and when scrolling
   * to the end of the menu.
   *
   * Receives `{ filter: { keyword }, page, pageSize }` (`page` starts at 1,
   * `pageSize` is 10) and must resolve to `{ list, total }`. More pages are
   * requested while `total > page * pageSize`.
   */
  fetcher: (input: Input) => Promise<{ list: Option[]; total: number }>;
  /**
   * Initial selection. Re-applied whenever it changes to a truthy value,
   * so it can be set after async data loads.
   */
  defaultValue?: OnChangeValue<Option, IsMulti>;
  /** Called with the new selection. */
  onChange?: (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  /**
   * Vertical padding of the value area. `none` 0 · `sm` 8px · `md` 10px ·
   * `lg` 11px.
   * @default 'md'
   */
  size?: VariantProps<typeof valueContainerClasses>['size'];
  /**
   * Border radius of the control.
   * @default 'lg'
   */
  rounded?: VariantProps<typeof controlClasses>['rounded'];
}

/**
 * Select that searches and pages options from the server
 * (`react-select-async-paginate`), with an optional {@link Label}.
 *
 * The selection is kept in internal state: set the initial value with
 * `defaultValue` and read changes from `onChange`. A `value` prop is ignored.
 *
 * @template Option Option type returned by `fetcher`.
 * @template IsMulti `true` for multi-select (`isMulti`).
 *
 * @example
 * <AsyncSelectField<User>
 *   label={{ text: 'Author' }}
 *   fetcher={(input) => api.users.list(input)} // → { list, total }
 *   getOptionLabel={(user) => user.name}
 *   getOptionValue={(user) => String(user.id)}
 *   defaultValue={post.author}
 *   onChange={(user) => setValue('authorId', user?.id)}
 * />
 */
export const AsyncSelectField = <
  Option = unknown,
  IsMulti extends boolean = false,
>({
  label,
  size = 'md',
  rounded = 'lg',
  isMulti,
  className,
  onChange,
  defaultValue,
  fetcher,
  ...props
}: AsyncSelectFieldProps<Option, IsMulti>) => {
  const [value, setValue] = useState<OnChangeValue<Option, IsMulti>>();

  const loadOptions = async (
    search: string,
    _prevOptions: OptionsOrGroups<Option, GroupBase<Option>>,
    additional: AdditionalType = { page: 1, pageSize: 10 },
  ) => {
    const { list, total } = await fetcher({
      filter: {
        keyword: search,
      },
      page: additional.page,
      pageSize: additional.pageSize,
    });
    const hasMore = total > additional.page * additional.pageSize;
    return {
      options: list,
      hasMore,
      additional: {
        page: additional.page + 1,
        pageSize: additional.pageSize,
      },
    };
  };

  const handleChange = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>,
  ) => {
    setValue(newValue);
    onChange?.(newValue, actionMeta);
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Label {...label}>
      <div data-komc>
        <AsyncPaginate
          isMulti={isMulti}
          className={clsx(
            'komc:text-lg komc:leading-[1.2] komc:placeholder:leading-[1.2]',
            className,
          )}
          classNames={baseClassNames<Option, IsMulti>({ size, rounded })}
          {...props}
          onChange={handleChange}
          value={value}
          loadOptions={loadOptions}
        />
      </div>
    </Label>
  );
};
