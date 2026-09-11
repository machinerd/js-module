'use client';

import clsx from 'clsx';
import {
  type ComponentProps,
  type ComponentType,
  type ForwardedRef,
  type PropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import {
  type ArrayPath,
  Controller,
  type Control,
  type FieldValues,
  type Path,
  useFieldArray,
} from 'react-hook-form';
import { Label } from '../label';

/**
 * Props added by {@link withExtraField}.
 *
 * @template T Form values type.
 */
export interface ExtraFieldProps<T extends FieldValues = FieldValues> {
  /** `control` from `useForm`. */
  control: Control<T>;
  /**
   * Form path of the array holding the extra values (e.g. `'aliases'`).
   * Managed with `useFieldArray`.
   */
  extraFieldName: Path<T>;
  /**
   * Value of a newly added extra field.
   * @default ''
   */
  defaultValue?: string;
  /** Add button content, e.g. `<FontAwesomeIcon icon={faPlus} />`. */
  add: ReactNode;
  /** Remove button content, e.g. `<FontAwesomeIcon icon={faXmark} />`. */
  remove: ReactNode;
}

export interface BaseHOCProps {
  /** Label passed to the main field only. */
  label?: ComponentProps<typeof Label>;
}

/**
 * Wraps a field component so users can add and remove extra copies of it,
 * stored as an array in react-hook-form.
 *
 * The returned component renders:
 * - the main field with all passed props and `ref`;
 * - one extra field per array item, connected via `Controller`. Extra
 *   fields only receive `value`/`onChange`/`onBlur`/`name`/`ref`, so other
 *   props (`label`, `size`, ...) apply to the main field only;
 * - an add button (top-right) and a remove button per extra field (on hover).
 *
 * @template T Form values type.
 * @template F Props of the wrapped component.
 *
 * @example
 * // Define once, outside components
 * const ExtraTextField = withExtraField<
 *   FormValues,
 *   ComponentProps<typeof TextField>
 * >(TextField);
 *
 * // In the form
 * <ExtraTextField
 *   control={control}
 *   extraFieldName="aliases"
 *   add={<FontAwesomeIcon icon={faPlus} />}
 *   remove={<FontAwesomeIcon icon={faXmark} />}
 *   label={{ text: 'Name' }}
 *   {...register('name')}
 * />
 */
export function withExtraField<T extends FieldValues, F>(
  Component: ComponentType<F>,
) {
  type Props = PropsWithoutRef<F> & ExtraFieldProps<T> & BaseHOCProps;

  return forwardRef<unknown, Props>((props, ref) => {
    const {
      control,
      extraFieldName,
      defaultValue,
      add,
      remove: removeAction,
      ...rest
    } = props;
    const { fields, append, remove } = useFieldArray({
      control,
      name: extraFieldName as ArrayPath<T>,
    });

    return (
      <div
        data-komc
        className="komc:flex komc:flex-col komc:gap-y-4 komc:w-full komc:relative"
      >
        <Component {...(rest as F)} ref={ref as ForwardedRef<unknown>} />
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="komc:flex komc:items-center komc:w-full komc:relative komc:group/item"
          >
            <Controller
              name={`${extraFieldName}.${index}` as Path<T>}
              control={control}
              render={({ field: itemField }) => {
                return (
                  <Component {...(itemField as unknown as F & Partial<F>)} />
                );
              }}
            />
            <button
              type="button"
              className={clsx(
                'komc:flex komc:justify-center komc:w-7.5 komc:h-7.5 komc:bg-red-50 komc:rounded-sm komc:items-center',
                'komc:right-1 komc:top-1 komc:absolute komc:cursor-pointer',
                'komc:opacity-0 komc:group-hover/item:opacity-100 komc:focus-visible:opacity-100 komc:focus-within:opacity-100',
                'komc:[&_svg]:w-4 komc:[&_svg]:h-4 komc:[&_svg]:text-red-500',
              )}
              aria-label="Delete"
              onClick={() => remove(index)}
            >
              {removeAction}
            </button>
          </div>
        ))}
        <button
          type="button"
          className={clsx(
            'komc:flex komc:justify-center komc:w-7.5 komc:h-7.5 komc:bg-blue-100 komc:rounded-sm komc:items-center',
            'komc:right-0 komc:top-0 komc:absolute komc:cursor-pointer',
            'komc:[&_svg]:w-4 komc:[&_svg]:h-4',
          )}
          aria-label="Add"
          onClick={() =>
            append((defaultValue || '') as never, {
              shouldFocus: true,
            })
          }
        >
          {add}
        </button>
      </div>
    );
  });
}
