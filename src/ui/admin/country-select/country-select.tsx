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

/** Pagination state passed between `loadOptions` calls. */
export interface Additional {
  /** 1-based page number. */
  page: number;
  /** Items per page. */
  pageSize: number;
}

/** Country option shape expected by {@link CountrySelect}. */
export interface CountrySelectOption {
  /** Unique country id. */
  id: number;
  /** ISO 3166-1 alpha-2 code (e.g. `'KR'`). Used for the flag. */
  alpha2Code?: string | null;
  /** Calling code without `+` (e.g. `'82'`). */
  callingCode?: string | null;
  /** Official English name. Last fallback for the option label. */
  nameEn?: string | null;
  /** Common English name. Used for the label before `nameEn`. */
  nameEnAlias1?: string | null;
  /** Short English name. Preferred English label. */
  nameEnAlias2?: string | null;
  /** Korean name. Preferred label when `locale` is `'ko'`. */
  nameKo?: string | null;
}

/** Preset option for South Korea. Handy as a default value. */
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

/**
 * Default `classNames` of {@link CountrySelect}. Spread it when you pass
 * your own `classNames`, since that prop replaces the defaults.
 */
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

/**
 * Menu option: flag, localized name and calling code.
 * One of the default `components` of {@link CountrySelect}; only works
 * inside it.
 */
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

/**
 * Clear button using `clearIcon`.
 * One of the default `components` of {@link CountrySelect}; only works
 * inside it.
 */
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

/**
 * Dropdown arrow using `dropdownIcon`.
 * One of the default `components` of {@link CountrySelect}; only works
 * inside it.
 */
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

/** Divider between the indicators. One of the default `components`. */
export const CountryIndicatorSeparator = <Option extends CountrySelectOption>(
  props: IndicatorSeparatorProps<Option, boolean, GroupBase<Option>>,
) => {
  return (
    <components.IndicatorSeparator {...props}>
      <div className="komc:border komc:border-neutral-100" />
    </components.IndicatorSeparator>
  );
};

/**
 * Selected value: flag and calling code only.
 * One of the default `components` of {@link CountrySelect}.
 */
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

/** Small-text placeholder. One of the default `components`. */
export const CountryPlaceholder = <Option extends CountrySelectOption>(
  props: PlaceholderProps<Option, boolean, GroupBase<Option>>,
) => {
  return (
    <components.Placeholder {...props}>
      <span className="komc:text-xs">{props.children}</span>
    </components.Placeholder>
  );
};

/** Flag for a country option, sized for the select. */
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

/**
 * Props for {@link CountrySelect}. Accepts all `react-select-async-paginate`
 * props; `loadOptions` is required in practice.
 *
 * @template Option Country option type.
 * @template IsMulti `true` for multi-select (`isMulti`).
 */
export interface CountrySelectProps<
  Option extends CountrySelectOption = CountrySelectOption,
  IsMulti extends boolean = false,
> extends ComponentProps<
  typeof AsyncPaginate<Option, GroupBase<Option>, Additional, IsMulti>
> {
  /**
   * Label language. `'ko'` prefers `nameKo`; anything else uses
   * `nameEnAlias2` → `nameEnAlias1` → `nameEn`.
   * @default 'en'
   */
  locale?: string;
  /** Font Awesome icon for the clear button (e.g. `faXmark`). */
  clearIcon: IconProp;
  /** Font Awesome icon for the dropdown arrow (e.g. `faChevronDown`). */
  dropdownIcon: IconProp;
}

/**
 * Searchable, paginated country picker showing flags and calling codes.
 * Clearable and searchable by default; no placeholder unless passed.
 *
 * - `loadOptions(search, prevOptions, additional)` must resolve to
 *   `{ options, hasMore, additional: { page: page + 1, pageSize } }`.
 *   The first call gets `additional = { page: 1, pageSize: 10 }`; it is
 *   typed as optional, so give it a default.
 * - Options have no `value` key, so pass `getOptionValue` (e.g. by `id`)
 *   for react-select to tell options apart.
 * - Passing `components` or `classNames` replaces the defaults; spread the
 *   exported `Country*` components or `defaultCountrySelectClassNames` to
 *   extend them.
 *
 * @template Option Country option type.
 * @template IsMulti `true` for multi-select (`isMulti`).
 *
 * @example
 * <CountrySelect
 *   locale="ko"
 *   clearIcon={faXmark}
 *   dropdownIcon={faChevronDown}
 *   loadOptions={async (search, _prev, additional = { page: 1, pageSize: 10 }) => {
 *     const { page, pageSize } = additional;
 *     const { list, total } = await api.countries.list({
 *       filter: { keyword: search },
 *       page,
 *       pageSize,
 *     });
 *     return {
 *       options: list,
 *       hasMore: total > page * pageSize,
 *       additional: { page: page + 1, pageSize },
 *     };
 *   }}
 *   getOptionValue={(country) => String(country.id)}
 *   defaultValue={COUNTRY_KR}
 *   onChange={(country) => setValue('countryId', country?.id)}
 * />
 */
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
