import clsx from 'clsx';
import React, { useId } from 'react';
import { cva } from 'class-variance-authority';

/** Where the label sits relative to the switch. */
export type LabelPlacement = 'end' | 'start' | 'top' | 'bottom';

export interface SwitchProps {
  /** Visible label. Clicking it toggles the switch. */
  label?: string;
  /**
   * Label position relative to the switch.
   * @default 'end'
   */
  placement?: LabelPlacement;
  /**
   * On/off state. Controlled: update it from `onChange`.
   * @default false
   */
  checked?: boolean;
  /**
   * Disable interaction and dim the switch.
   * @default false
   */
  disabled?: boolean;
  /** Accessible name when there is no visible `label`. Defaults to `label`. */
  'aria-label'?: string;
  /** Called with the next state when toggled. */
  onChange?(checked: boolean): void;
}

/** @deprecated Use `SwitchProps`. */
export type SwtichProps = SwitchProps;

const classes = cva(clsx('komc:inline-flex komc:items-center'), {
  variants: {
    placement: {
      top: 'komc:flex-col-reverse komc:gap-y-2.5',
      bottom: 'komc:flex-col komc:gap-y-2.5',
      start: 'komc:flex-row-reverse komc:gap-x-2',
      end: 'komc:flex-row komc:gap-x-2',
    },
    disabled: {
      false: 'komc:cursor-pointer',
      true: 'komc:cursor-default komc:opacity-50',
    },
    checked: {
      false: 'komc:[&>button]:bg-gray-300 komc:[&_span]:translate-x-0.5',
      true: 'komc:[&>button]:bg-blue-500 komc:[&_span]:translate-x-4.5',
    },
  },
  defaultVariants: {
    placement: 'end',
    disabled: false,
    checked: false,
  },
});

/**
 * Accessible on/off toggle (`role="switch"`). Controlled — it never changes
 * `checked` by itself. `ref` points to the `<button>`.
 *
 * @example
 * const [enabled, setEnabled] = useState(false);
 *
 * <Switch label="Notifications" checked={enabled} onChange={setEnabled} />
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      label,
      placement = 'end',
      checked = false,
      disabled = false,
      onChange,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const switchId = useId();

    const handleChecked = () => {
      if (disabled) return;
      onChange?.(!checked);
    };

    return (
      <div
        data-komc
        className={clsx(
          classes({
            placement,
            disabled,
            checked,
          }),
        )}
      >
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          disabled={disabled}
          className="komc:flex komc:items-center komc:rounded-full komc:transition komc:w-10 komc:h-6 komc:cursor-pointer komc:disabled:cursor-default"
          aria-checked={checked}
          aria-label={ariaLabel ?? label}
          onClick={handleChecked}
        >
          <span className="komc:size-5 komc:rounded-full komc:bg-white komc:transition komc:shadow-xs" />
        </button>
        {label ? (
          <label
            htmlFor={switchId}
            className="komc:text-xs komc:font-medium komc:text-neutral-500"
          >
            {label}
          </label>
        ) : null}
      </div>
    );
  },
);
