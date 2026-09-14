'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { type ComponentProps } from 'react';
import Select, { type ClassNamesConfig, type GroupBase } from 'react-select';
import { Label, type LabelProps } from '../label';

export const controlClasses = cva(
  'komc:gap-x-2.5 komc:h-full! komc:border-[0.6px]! komc:shadow-field komc:form-field!',
  {
    variants: {
      rounded: {
        sm: 'komc:rounded-sm!',
        md: 'komc:rounded-md!',
        lg: 'komc:rounded-lg!',
        xl: 'komc:rounded-xl!',
      },
    },
    defaultVariants: {
      rounded: 'lg',
    },
  },
);

export const valueContainerClasses = cva(
  'komc:gap-2 komc:pl-4! komc:pr-0! komc:m-0!',
  {
    variants: {
      size: {
        none: 'komc:py-0!',
        sm: 'komc:py-2!',
        md: 'komc:py-2.5!',
        lg: 'komc:py-2.75!',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/**
 * Props for {@link SelectField}. Accepts all `react-select` props
 * (`options`, `value`, `onChange`, `getOptionLabel`, ...).
 *
 * @template T Option type.
 * @template F `true` for multi-select (`isMulti`).
 */
export interface SelectFieldProps<T, F extends boolean = false>
  extends
    ComponentProps<typeof Select<T, F>>,
    VariantProps<typeof valueContainerClasses>,
    VariantProps<typeof controlClasses> {
  /** Label shown above the select. See `LabelProps`. */
  label?: Omit<LabelProps, 'children'>;
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
 * Builds the `react-select` `classNames` used by the admin select fields.
 * Use it to style a custom `react-select` the same way.
 *
 * @template T Option type.
 * @template F `true` for multi-select.
 */
export const baseClassNames = <T, F extends boolean = false>({
  size,
  rounded,
}: VariantProps<typeof valueContainerClasses> &
  VariantProps<typeof controlClasses>): ClassNamesConfig<
  T,
  F,
  GroupBase<T>
> => {
  return {
    control: (base) =>
      clsx(
        base.className,
        controlClasses({ rounded }),
        base.isFocused && 'komc-active',
      ),
    valueContainer: (base) =>
      clsx(base.className, valueContainerClasses({ size })),
    input: (base) => clsx(base.className, 'komc:h-full komc:p-0! komc:m-0!'),
    placeholder: (base) => clsx(base.className, 'komc:h-full'),
    clearIndicator: (base) => clsx(base.className, 'komc:p-2.5! komc:pl-0!'),
    indicatorSeparator: (base) =>
      clsx(base.className, 'komc:my-3.5! komc:bg-neutral-100!'),
    dropdownIndicator: (base) => clsx(base.className, 'komc:px-2.5!'),
    multiValue: (base) =>
      clsx(base.className, 'komc:h-full komc:p-0! komc:m-0!'),
    menu: (base) => clsx(base.className, 'komc:z-10001!'),
  };
};

/**
 * `react-select` styled for admin forms, with an optional {@link Label}.
 *
 * Passing `classNames` replaces the built-in styles entirely.
 * Options without `label`/`value` keys need `getOptionLabel` and
 * `getOptionValue`.
 *
 * @template T Option type.
 * @template F `true` for multi-select (`isMulti`).
 *
 * @example
 * const options = [
 *   { label: 'Korean', value: 'ko' },
 *   { label: 'English', value: 'en' },
 * ];
 *
 * <SelectField
 *   label={{ text: 'Language', required: true }}
 *   options={options}
 *   value={language}
 *   onChange={setLanguage}
 * />
 *
 * @example
 * // With react-hook-form
 * <Controller
 *   control={control}
 *   name="category"
 *   render={({ field }) => (
 *     <SelectField
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       options={categories}
 *       getOptionLabel={(c) => c.name}
 *       getOptionValue={(c) => String(c.id)}
 *     />
 *   )}
 * />
 */
export const SelectField = <T, F extends boolean = false>({
  label,
  size = 'md',
  rounded = 'lg',
  isMulti,
  className,
  ...props
}: SelectFieldProps<T, F>) => {
  return (
    <Label {...label}>
      <div data-komc>
        <Select<T, F>
          isMulti={isMulti}
          className={clsx('komc:text-lg', className)}
          classNames={baseClassNames<T, F>({ size, rounded })}
          {...props}
        />
      </div>
    </Label>
  );
};
