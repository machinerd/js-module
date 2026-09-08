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

export interface AdditionalType {
  page: number;
  pageSize: number;
}

export interface AsyncSelectFieldProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Input extends BaseInput = BaseInput,
>
  extends
    StateManagerProps<Option, IsMulti, GroupBase<Option>>,
    VariantProps<typeof valueContainerClasses>,
    VariantProps<typeof controlClasses> {
  label?: ComponentProps<typeof Label>;
  fetcher: (input: Input) => Promise<{ list: Option[]; total: number }>;
  defaultValue?: OnChangeValue<Option, IsMulti>;
  onChange?: (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>,
  ) => void;
}

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
