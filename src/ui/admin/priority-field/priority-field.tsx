'use client';

import clsx from 'clsx';
import {
  type ComponentProps,
  type FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Label } from '../label';
import { useApiClient } from '../../../providers/api-client';

/**
 * Type code sent as `type` to the priority-position API
 * (`/assist/priority-current-position`).
 */
export type PriorityDataType = '1' | '2' | '3';

/** Result of the priority-position API. */
export interface RankProp {
  /** Total count returned by the API. */
  total: number;
  /** Rank of the entered priority, in descending order. */
  rank: number;
}

/**
 * Props for {@link PriorityField}. Native input attributes (`value`,
 * `onChange`, `name`, ...) go to the `<input type="number">`.
 */
export interface PriorityFieldProps extends ComponentProps<'input'> {
  /** Type code sent to the API when looking up the rank. */
  dataType: PriorityDataType;
  /**
   * Fetch and show `rank / total` under the input as the value changes.
   * (Spelled `Lank`.)
   * @default false
   */
  usePriorityLank?: boolean;
  /** Class name for the bordered wrapper around the input. */
  wrapperClassName?: string;
  /** Label shown above the field. See `LabelProps`. */
  label?: ComponentProps<typeof Label>;
  /**
   * Class name for the `<input>`. Replaces its default classes
   * (right-aligned, no spinner) instead of merging.
   */
  className?: string;
}

/**
 * Right-aligned number input for a priority. With `usePriorityLank`, shows
 * `rank / total` for the entered value, fetched from the API on every input
 * and whenever `value` changes.
 *
 * Requires `ApiClientProvider`, even when `usePriorityLank` is off.
 * `onInput` is used internally and cannot be overridden.
 *
 * @example
 * <PriorityField
 *   dataType="1"
 *   usePriorityLank
 *   label={{ text: 'Priority' }}
 *   {...register('priority', { valueAsNumber: true })}
 * />
 */
export const PriorityField = forwardRef<HTMLInputElement, PriorityFieldProps>(
  (
    { usePriorityLank, dataType, label = {}, wrapperClassName, ...props },
    ref,
  ) => {
    const apiClient = useApiClient();
    const { text, ...labelProps } = label;
    const [rankInfo, setRankInfo] = useState<RankProp | null>(null);

    const fetchRank = useCallback(
      async (priority: number) => {
        try {
          const result = await apiClient.api.getPriorityPosition(
            priority,
            dataType,
          );
          setRankInfo(result);
        } catch {
          setRankInfo(null);
        }
      },
      [apiClient, dataType],
    );

    useEffect(() => {
      if (usePriorityLank && !isNaN(Number(props.value))) {
        fetchRank(Number(props.value));
      }
    }, [usePriorityLank, props.value, dataType, fetchRank]);

    const handleChange = (e: FormEvent<HTMLInputElement>) => {
      const val = Number(e.currentTarget.value);
      if (usePriorityLank && !isNaN(val)) {
        fetchRank(val);
      }
    };

    return (
      <Label text={text} {...labelProps}>
        <div
          data-komc
          className={clsx(
            'komc:border-[0.6px] komc:border-neutral-300 komc:rounded-lg komc:bg-white',
            'komc:py-3 komc:px-4',
            'komc:h-11.5',
            wrapperClassName,
          )}
        >
          <input
            ref={ref}
            type="number"
            className={clsx(
              'komc:w-full komc:h-full',
              'komc:text-right komc:outline-none komc:border-none komc:bg-transparent komc:[&::-webkit-outer-spin-button]:appearance-none komc:[&::-webkit-inner-spin-button]:appearance-none',
              'komc:text-lg komc:font-normal',
            )}
            {...props}
            onInput={handleChange}
          />
        </div>
        {usePriorityLank && rankInfo && (
          <div className="komc:text-right">
            <span className="komc:text-xs komc:text-neutral-500">
              {rankInfo?.rank} / {rankInfo?.total}
            </span>
          </div>
        )}
      </Label>
    );
  },
);
