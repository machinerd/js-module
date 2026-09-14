import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import {
  type ComponentProps,
  type InputEventHandler,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { Label, type LabelProps } from '../label';

const classes = cva(
  clsx(
    'komc:w-full komc:py-3 komc:m-0 komc:text-lg komc:leading-5.5',
    'komc:focus:form-field komc-active',
    'komc:bg-white komc:border-[0.6px] komc:border-neutral-300 komc:relative',
    'komc:outline-none komc-no-scrollbar',
  ),
  {
    variants: {
      size: {
        xs: 'komc:min-h-8 komc:rounded-sm komc:px-2.5',
        sm: 'komc:min-h-8.5 komc:rounded-sm komc:px-4',
        md: 'komc:min-h-9.5 komc:rounded-sm komc:px-4',
        lg: 'komc:min-h-11.5 komc:rounded-lg komc:px-4',
      },
      invalid: {
        true: 'komc-error',
        false: '',
      },
      shadow: {
        true: 'komc:shadow-field',
        false: '',
      },
      resize: {
        none: 'komc:resize-none',
        auto: 'komc:resize',
      },
    },
    defaultVariants: {
      size: 'lg',
      invalid: false,
      shadow: true,
      resize: 'auto',
    },
  },
);

/**
 * Props for {@link TextareaField}. Native textarea attributes (`value`,
 * `onChange`, `rows`, ...) and `className` go to the `<textarea>`.
 */
export interface TextareaFieldProps
  extends
    Omit<ComponentProps<'textarea'>, 'size' | 'ref' | 'color'>,
    VariantProps<typeof classes> {
  /**
   * Label shown above the field. `label.id` becomes the textarea's `id`,
   * linking the two. See `LabelProps`.
   */
  label?: Omit<LabelProps, 'children'>;
  /** Reserved; `'default'` is the only style. */
  variant?: 'default';
  /**
   * Minimum height and horizontal padding. `xs` 32px · `sm` 34px ·
   * `md` 38px · `lg` 46px.
   * @default 'lg'
   */
  size?: VariantProps<typeof classes>['size'];
  /**
   * Show the error border style.
   * @default false
   */
  invalid?: VariantProps<typeof classes>['invalid'];
  /**
   * Show the field shadow.
   * @default true
   */
  shadow?: VariantProps<typeof classes>['shadow'];
  /**
   * `auto` lets the user drag to resize; `none` disables it.
   * @default 'auto'
   */
  resize?: VariantProps<typeof classes>['resize'];
}

/**
 * Admin textarea that grows with its content, with an optional
 * {@link Label}. Starts at one row and resizes on input and whenever
 * `value`/`defaultValue` changes.
 *
 * `ref` points to the `<textarea>` (object and callback refs).
 *
 * @example
 * <TextareaField
 *   label={{ id: 'summary', text: 'Summary' }}
 *   resize="none"
 *   placeholder="Write a short summary"
 *   {...register('summary')}
 * />
 */
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, size, className, invalid, shadow, resize, ...props }, ref) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const setRef = (el: HTMLTextAreaElement | null) => {
    innerRef.current = el;
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleOnInputTextarea: InputEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    adjustHeight(event.currentTarget);
    props.onInput?.(event);
  };

  useEffect(() => {
    adjustHeight(innerRef.current);
  }, [props.value, props.defaultValue]);

  return (
    <Label {...label}>
      <textarea
        data-komc
        ref={setRef}
        id={label?.id}
        rows={1}
        className={classes({ size, invalid, className, shadow, resize })}
        {...props}
        onInput={handleOnInputTextarea}
      />
    </Label>
  );
});
