'use client';

import {
  type ChangeEvent,
  type InputHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextField, type TextFieldProps } from '../text-field';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const checkInvalid = (
  text?: InputHTMLAttributes<HTMLInputElement>['value'],
) => {
  const value = String(text);
  return value === '' || value === 'undefined' || emailRegex.test(value);
};

/**
 * Props for {@link EmailField}. Same as `TextFieldProps`; `type` is always
 * `"email"`.
 *
 * `label.helpText` (default `'Invalid Email'`) and `label.helpTextColor`
 * (default `'error'`) are shown only while the value is invalid.
 */
export type EmailFieldProps = TextFieldProps;

/**
 * `TextField` that checks the email format as you type and shows an error
 * style and help text while invalid. An empty value counts as valid.
 *
 * The check is visual only — it does not block form submission; add your
 * own validation rules for that.
 *
 * - `size` defaults to `'lg'`; `placeholder` to `'example@exaple.com'`.
 * - Only callback refs are forwarded (e.g. from `register()`);
 *   `useRef` objects are not attached.
 *
 * @example
 * <EmailField
 *   label={{ id: 'email', text: 'Email', required: true }}
 *   {...register('email')}
 * />
 */
export const EmailField = forwardRef<HTMLInputElement, EmailFieldProps>(
  ({ label = {}, size = 'lg', ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
      helpText = 'Invalid Email',
      helpTextColor = 'error',
      ...labelProps
    } = label;
    const [invalid, setInvalid] = useState(
      !checkInvalid(props.defaultValue || props.value),
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      props.onChange?.(e);
      setInvalid(!checkInvalid(value));
    };

    const handleRef = useCallback(
      (r: HTMLInputElement | null) => {
        inputRef.current = r;
        if (typeof ref === 'function') {
          ref(r);
        }
      },
      [ref],
    );

    useEffect(() => {
      if (inputRef.current?.value) {
        setInvalid(!checkInvalid(inputRef.current.value));
      }
    }, []);

    useEffect(() => {
      if (props.defaultValue || props.value) {
        setInvalid(!checkInvalid(props.defaultValue || props.value));
      }
    }, [props.defaultValue, props.value]);

    return (
      <TextField
        label={{
          helpTextColor: invalid ? helpTextColor : 'default',
          helpText: invalid ? helpText : '',
          ...labelProps,
        }}
        placeholder="example@exaple.com"
        size={size}
        id={labelProps.id}
        invalid={invalid}
        {...props}
        type="email"
        onChange={handleChange}
        ref={handleRef}
      />
    );
  },
);
