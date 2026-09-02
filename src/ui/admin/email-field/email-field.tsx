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

export type EmailFieldProps = TextFieldProps;

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
