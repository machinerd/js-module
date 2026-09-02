import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { omit } from 'lodash-es';
import { type ComponentProps, forwardRef } from 'react';
import { Label, type LabelProps } from '../label';

export type TextFieldFileVariantColor = 'green' | 'blue' | 'red';

const inputClasses = cva(
  clsx('komc:w-full komc:h-full komc:py-0 komc:m-0 komc:outline-none'),
  {
    variants: {
      size: {
        xs: 'komc:text-xs',
        sm: 'komc:text-sm',
        md: 'komc:text-base',
        lg: 'komc:text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const classes = cva(
  clsx(
    'komc:flex komc:flex-row komc:items-center komc:w-full',
    'komc:focus-within:form-field komc-active',
    'komc:border-[0.6px] komc:border-neutral-300 komc:overflow-hidden komc:relative',
  ),
  {
    variants: {
      size: {
        xs: 'komc:h-8.5 komc:rounded-sm komc:[&>input]:px-2.5',
        sm: 'komc:h-9 komc:rounded-sm komc:[&>input]:px-4',
        md: 'komc:h-9.5 komc:rounded-sm komc:[&>input]:px-4',
        lg: 'komc:h-11.5 komc:rounded-lg komc:[&>input]:px-4',
      },
      invalid: {
        true: 'komc-error',
        false: '',
      },
      shadow: {
        true: 'komc:shadow-field',
        false: '',
      },
      disabled: {
        true: 'komc:bg-gray-50 komc:ring-0! komc:border-neutral-300!',
        false: 'komc:bg-white',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
      shadow: true,
      disabled: false,
    },
  },
);

const dateClasses = cva(
  clsx(
    'komc:flex komc:items-center komc:absolute komc:right-0 komc:bg-white',
    'komc:h-full komc:pl-2.5 komc:pr-4 komc:pointer-events-none',
  ),
  {
    variants: {
      size: {
        xs: 'komc:px-2.5',
        sm: 'komc:pl-2.5 komc:pr-4',
        md: 'komc:pl-2.5 komc:pr-4',
        lg: 'komc:pl-2.5 komc:pr-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const fileLinkClasses = cva(
  clsx(
    'komc:flex komc:items-center komc:h-full komc:px-4 komc:border-r-[0.6px]',
    'komc:border-neutral-300 komc:cursor-pointer',
  ),
  {
    variants: {
      color: {
        green: 'komc:bg-green-50 komc:[&>div>svg]:text-green-500',
        blue: 'komc:bg-blue-50 komc:[&>div>svg]:text-blue-500',
        red: 'komc:bg-red-50 komc:[&>div>svg]:text-red-500',
      },
    },
    defaultVariants: {
      color: 'green',
    },
  },
);

const suffixDateClasses = cva(
  clsx(
    'komc:absolute komc:left-0 komc:w-80 komc:px-4 komc:text-brand-black-01!',
    'komc:flex komc:items-center komc:py-1 komc:bg-transparent',
  ),
  {
    variants: {
      size: {
        xs: 'komc:h-8',
        sm: 'komc:h-8.5',
        md: 'komc:h-9',
        lg: 'komc:h-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

interface BaseProps
  extends
    Omit<ComponentProps<'input'>, 'size' | 'ref' | 'color'>,
    VariantProps<typeof classes> {
  label?: Omit<LabelProps, 'children'>;
  disabled?: boolean;
  dateIcon?: IconProp;
  handleDateClear?: never;
}

interface DefaultProps extends BaseProps {
  variant?: 'default';
}

interface SearchProps extends BaseProps {
  variant: 'search';
  searchIcon: IconProp;
}

interface FileProps extends BaseProps {
  variant: 'file';
  path: string;
  color?: TextFieldFileVariantColor;
  fileIcon: IconProp;
}

interface PrefixTextProps extends BaseProps {
  variant: 'prefix-text';
  prefix: string;
  id?: string;
}

interface SuffixTextProps extends BaseProps {
  variant: 'suffix-text';
  suffix: string;
  id?: string;
}

interface SuffixDateProps extends Omit<BaseProps, 'handleDateClear'> {
  variant: 'select-date';
  handleDateClear: () => void;
  clearIcon: IconProp;
  inputlabel?: string;
  min?: string | number;
  max?: string | number;
}

export type TextFieldProps =
  | DefaultProps
  | FileProps
  | SearchProps
  | PrefixTextProps
  | SuffixTextProps
  | SuffixDateProps;

const fieldOnlyKeys = [
  'variant',
  'path',
  'color',
  'prefix',
  'suffix',
  'searchIcon',
  'fileIcon',
  'clearIcon',
  'inputlabel',
  'onKeyDown',
] as const;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      type = 'text',
      size,
      className,
      invalid,
      shadow,
      disabled,
      dateIcon,
      handleDateClear,
      ...props
    },
    ref,
  ) => {
    const inputId = label?.id;
    const inputProps = omit(props, fieldOnlyKeys);

    return (
      <Label {...label}>
        <div
          data-komc
          tabIndex={-1}
          className={classes({
            size,
            invalid,
            className,
            shadow,
            disabled,
          })}
        >
          {props.variant === 'file' && (
            <FileLink
              path={props.path}
              color={props.color}
              fileIcon={props.fileIcon}
            />
          )}
          {props.variant === 'prefix-text' && (
            <PrefixText id={inputId} prefix={props.prefix} />
          )}
          {props.variant === 'search' && (
            <PrefixSearch searchIcon={props.searchIcon} />
          )}
          <Input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={inputClasses({ size })}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
              }
              props.onKeyDown?.(event);
            }}
            {...inputProps}
          />
          {props.variant === 'select-date' && handleDateClear && (
            <SuffixDate
              size={size}
              inputlabel={props.inputlabel}
              handleDateClear={handleDateClear}
              clearIcon={props.clearIcon}
            />
          )}
          {type === 'date' && dateIcon && (
            <div className={dateClasses({ size })}>
              <FontAwesomeIcon
                className="komc:w-4! komc:h-4.5! komc:text-neutral-500"
                icon={dateIcon}
              />
            </div>
          )}
          {props.variant === 'suffix-text' && (
            <SuffixText id={inputId} suffix={props.suffix} />
          )}
        </div>
      </Label>
    );
  },
);

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  (props, ref) => {
    return <input ref={ref} className={clsx(props.className)} {...props} />;
  },
);

const FileLink = ({
  path,
  color,
  fileIcon,
}: Pick<FileProps, 'path' | 'color' | 'fileIcon'>) => {
  return (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open file"
      className={fileLinkClasses({ color })}
    >
      <div className="komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square">
        <FontAwesomeIcon className="komc:w-4 komc:h-4" icon={fileIcon} />
      </div>
    </a>
  );
};

const PrefixText = ({ prefix, id }: Pick<PrefixTextProps, 'prefix' | 'id'>) => {
  return (
    <div className="komc:flex komc:flex-row komc:items-center komc:gap-2.5 komc:h-full komc:pl-2.5">
      <span
        id={id ? `${id}-prefix` : undefined}
        className="komc:text-neutral-600 komc:text-lg komc:leading-[1.2] komc:whitespace-nowrap"
      >
        {prefix}
      </span>
      <span className="komc:w-px komc:h-4.5 komc:bg-gray-500" />
    </div>
  );
};

const SuffixText = ({ suffix, id }: Pick<SuffixTextProps, 'suffix' | 'id'>) => {
  return (
    <div className="komc:flex komc:flex-row komc:items-center komc:gap-2.5 komc:h-full komc:pr-2.5">
      <span className="komc:w-px komc:h-4.5 komc:bg-gray-500" />
      <span
        id={id ? `${id}-suffix` : undefined}
        className="komc:text-neutral-500 komc:font-bold komc:text-lg komc:leading-[1.2] komc:whitespace-nowrap"
      >
        {suffix}
      </span>
    </div>
  );
};

const SuffixDate = ({
  inputlabel,
  handleDateClear,
  size,
  clearIcon,
}: Pick<
  SuffixDateProps,
  'inputlabel' | 'handleDateClear' | 'size' | 'clearIcon'
>) => {
  return (
    <>
      <div className={suffixDateClasses({ size })}>{inputlabel}</div>
      {inputlabel && (
        <>
          <button
            className="komc:absolute komc:w-5 komc:h-5 komc:top-[calc(50%-10px)] komc:right-14 komc:cursor-pointer komc:flex komc:items-center komc:justify-center"
            type="button"
            aria-label="Clear date"
            onClick={handleDateClear}
          >
            <FontAwesomeIcon
              icon={clearIcon}
              className="komc:text-neutral-200 komc:text-base"
            />
          </button>
          <div className="komc:w-0.5 komc:h-4.5 komc:rounded komc:bg-gray-500 komc:absolute komc:top-[calc(50%-9px)] komc:right-11" />
        </>
      )}
    </>
  );
};

const PrefixSearch = ({ searchIcon }: Pick<SearchProps, 'searchIcon'>) => {
  return (
    <div className="komc:ml-4 komc:pr-1 komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square">
      <FontAwesomeIcon
        className="komc:w-4 komc:h-4 komc:text-gray-800 komc:font-normal"
        icon={searchIcon}
      />
    </div>
  );
};
