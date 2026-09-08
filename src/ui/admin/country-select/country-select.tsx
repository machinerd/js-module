'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { createContext, useContext, useMemo, type ComponentProps } from 'react';
import {
  components,
  type ClassNamesConfig,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type IndicatorSeparatorProps,
  type OptionProps,
  type PlaceholderProps,
  type SingleValueProps,
} from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import { CountryFlag } from '../../country-flag';

export interface Additional {
  page: number;
  pageSize: number;
}

export interface CountrySelectOption {
  id: number;
  alpha2Code?: string | null;
  callingCode?: string | null;
  nameEn?: string | null;
  nameEnAlias1?: string | null;
  nameEnAlias2?: string | null;
  nameKo?: string | null;
}

export const COUNTRY_KR: CountrySelectOption = {
  id: 212,
  alpha2Code: 'KR',
  callingCode: '82',
  nameEn: 'The Republic of Korea',
  nameEnAlias1: 'South Korea',
  nameEnAlias2: 'S.Korea',
  nameKo: '대한민국',
};

const getCountryOptionLabel = (option: CountrySelectOption, locale: string) => {
  const names = [option.nameEnAlias2, option.nameEnAlias1, option.nameEn];

  if (locale === 'ko') {
    names.unshift(option.nameKo);
  }

  return names.find((name) => name) || String(option.id);
};

interface CountrySelectUiValue {
  locale: string;
  clearIcon: IconProp;
  dropdownIcon: IconProp;
}

const CountrySelectUiContext = createContext<CountrySelectUiValue | null>(null);

const useCountrySelectUi = () => {
  const value = useContext(CountrySelectUiContext);
  if (!value) {
    throw new Error('CountrySelectUiContext not found');
  }
  return value;
};

export const defaultCountrySelectClassNames: ClassNamesConfig<
  CountrySelectOption,
  boolean,
  GroupBase<CountrySelectOption>
> = {
  control: (base) =>
    clsx(
      base.className,
      'komc:gap-x-2 komc:w-40 komc:h-11.5 komc:border-[0.6px]! komc:rounded-lg! komc:px-3 komc:shadow-field',
      'komc:form-field!',
      base.isFocused && 'komc-active',
      base.isDisabled && 'komc:bg-gray-50!',
    ),
  valueContainer: (base) => clsx(base.className, 'komc:p-0!'),
  singleValue: (base) => clsx(base.className, 'komc:m-0!'),
  menu: (base) => clsx(base.className, 'komc:min-w-52.5'),
  input: (base) => clsx(base.className, 'komc:m-0! komc:p-0!'),
  indicatorsContainer: (base) => clsx(base.className, 'komc:gap-x-2'),
  indicatorSeparator: (base) =>
    clsx(base.className, 'komc:h-4 komc:m-auto! komc:bg-neutral-100!'),
  clearIndicator: (base) => clsx(base.className, 'komc:p-0!'),
  dropdownIndicator: (base) => clsx(base.className, 'komc:p-0!'),
};

export const CountryOption = <Option extends CountrySelectOption>(
  props: OptionProps<Option, boolean, GroupBase<Option>>,
) => {
  const { locale } = useCountrySelectUi();

  return (
    <components.Option {...props}>
      <div className="komc:flex komc:gap-2 komc:text-xs">
        <CountryFlagElement {...props.data} />
        <div>{getCountryOptionLabel(props.data, locale)}</div>
        <div className="komc:text-neutral-500">+{props.data.callingCode}</div>
      </div>
    </components.Option>
  );
};

export const CountryClearIndicator = <Option extends CountrySelectOption>(
  props: ClearIndicatorProps<Option, boolean, GroupBase<Option>>,
) => {
  const { clearIcon } = useCountrySelectUi();

  return (
    <components.ClearIndicator {...props}>
      <FontAwesomeIcon
        icon={clearIcon}
        className="komc:w-3.5 komc:h-4"
        aria-hidden
      />
    </components.ClearIndicator>
  );
};

export const CountryDropdownIndicator = <Option extends CountrySelectOption>(
  props: DropdownIndicatorProps<Option, boolean, GroupBase<Option>>,
) => {
  const { dropdownIcon } = useCountrySelectUi();

  return (
    <components.DropdownIndicator {...props}>
      <FontAwesomeIcon
        icon={dropdownIcon}
        className="komc:w-3.5 komc:h-4"
        aria-hidden
      />
    </components.DropdownIndicator>
  );
};

export const CountryIndicatorSeparator = <Option extends CountrySelectOption>(
  props: IndicatorSeparatorProps<Option, boolean, GroupBase<Option>>,
) => {
  return (
    <components.IndicatorSeparator {...props}>
      <div className="komc:border komc:border-neutral-100" />
    </components.IndicatorSeparator>
  );
};

export const CountrySingleValue = <Option extends CountrySelectOption>(
  props: SingleValueProps<Option, boolean, GroupBase<Option>>,
) => {
  return (
    <components.SingleValue {...props}>
      <div className="komc:flex komc:flex-row komc:items-center komc:gap-x-3">
        <CountryFlagElement {...props.data} />
        <div className="komc:text-xs komc:text-neutral-500 komc:truncate">
          +{props.data.callingCode}
        </div>
      </div>
    </components.SingleValue>
  );
};

export const CountryPlaceholder = <Option extends CountrySelectOption>(
  props: PlaceholderProps<Option, boolean, GroupBase<Option>>,
) => {
  return (
    <components.Placeholder {...props}>
      <span className="komc:text-xs">{props.children}</span>
    </components.Placeholder>
  );
};

export const CountryFlagElement = (props: CountrySelectOption) => {
  return (
    <div className="komc:shrink-0 komc:h-6">
      <CountryFlag countryCode={props.alpha2Code || ''} />
    </div>
  );
};

const defaultComponents = {
  Option: CountryOption,
  SingleValue: CountrySingleValue,
  Placeholder: CountryPlaceholder,
  ClearIndicator: CountryClearIndicator,
  DropdownIndicator: CountryDropdownIndicator,
  IndicatorSeparator: CountryIndicatorSeparator,
};

export interface CountrySelectProps<
  Option extends CountrySelectOption = CountrySelectOption,
  IsMulti extends boolean = false,
> extends ComponentProps<
  typeof AsyncPaginate<Option, GroupBase<Option>, Additional, IsMulti>
> {
  locale?: string;
  clearIcon: IconProp;
  dropdownIcon: IconProp;
}

export const CountrySelect = <
  Option extends CountrySelectOption = CountrySelectOption,
  IsMulti extends boolean = false,
>({
  isMulti = false as IsMulti,
  placeholder = false,
  additional = { page: 1, pageSize: 10 },
  components: selectComponents = defaultComponents,
  classNames = defaultCountrySelectClassNames as ClassNamesConfig<
    Option,
    IsMulti,
    GroupBase<Option>
  >,
  locale = 'en',
  clearIcon,
  dropdownIcon,
  ...props
}: CountrySelectProps<Option, IsMulti>) => {
  const ui = useMemo(
    () => ({ locale, clearIcon, dropdownIcon }),
    [locale, clearIcon, dropdownIcon],
  );

  return (
    <CountrySelectUiContext.Provider value={ui}>
      <div data-komc>
        <AsyncPaginate
          isClearable
          isSearchable
          isMulti={isMulti}
          placeholder={placeholder}
          additional={additional}
          components={selectComponents}
          classNames={classNames}
          {...props}
        />
      </div>
    </CountrySelectUiContext.Provider>
  );
};
