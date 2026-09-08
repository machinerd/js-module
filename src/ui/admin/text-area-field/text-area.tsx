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

export interface TextareaFieldProps
  extends
    Omit<ComponentProps<'textarea'>, 'size' | 'ref' | 'color'>,
    VariantProps<typeof classes> {
  label?: Omit<LabelProps, 'children'>;
  variant?: 'default';
}

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
