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

export interface ExtraFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  extraFieldName: Path<T>;
  defaultValue?: string;
  add: ReactNode;
  remove: ReactNode;
}

export interface BaseHOCProps {
  label?: ComponentProps<typeof Label>;
}

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
