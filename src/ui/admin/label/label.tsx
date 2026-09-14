'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { useState, type ReactNode } from 'react';

const classes = cva('komc:flex komc:flex-col komc:w-full', {
  variants: {
    required: {
      true: clsx(
        'komc:[&>label>span:first-child]:after:content-["*"]',
        'komc:[&>label>span:first-child]:after:text-red-500',
        'komc:[&>label>span:first-child]:after:ml-1',
        'komc:[&>button>span:first-child]:after:content-["*"]',
        'komc:[&>button>span:first-child]:after:text-red-500',
        'komc:[&>button>span:first-child]:after:ml-1',
      ),
      false: '',
    },
    gap: {
      sm: 'komc:gap-y-2.5',
      md: 'komc:gap-y-3',
      lg: 'komc:gap-y-4',
      xl: 'komc:gap-y-4.5',
    },
  },
  defaultVariants: {
    required: false,
  },
});

const helpClasses = cva(
  'komc:flex komc:flex-row komc:items-center komc:gap-1 komc:ml-5',
  {
    variants: {
      helpTextColor: {
        default: 'komc:text-neutral-500',
        primary: 'komc:text-blue-500',
        warning: 'komc:text-yellow-500',
        error: 'komc:text-red-500',
      },
    },
    defaultVariants: {
      helpTextColor: 'default',
    },
  },
);

/**
 * Props for {@link Label}. Field components accept these as their `label`
 * prop, e.g. `<TextField label={{ text: 'Name', required: true }} />`.
 */
export interface LabelProps
  extends VariantProps<typeof classes>, VariantProps<typeof helpClasses> {
  /**
   * Label text. When empty, only `children` is rendered — no label,
   * help text or actions.
   */
  text?: string;
  /** Extra controls shown after the text, separated by a divider. */
  actions?: ReactNode | null;
  /**
   * Initial visibility of `children` when `collapse` is set.
   * Note: `true` means the content is **shown**, `false` hidden.
   * @default true
   */
  defaultCollapsed?: boolean;
  /** Small hint shown next to the label text. */
  helpText?: string;
  /** Font Awesome icon shown before `helpText`. */
  helpTextPrefixIcon?: IconProp | null;
  /**
   * Makes the content collapsible and returns the toggle button icon.
   * Receives `true` while the content is shown.
   *
   * @example
   * collapse={(shown) => (shown ? faChevronUp : faChevronDown)}
   */
  collapse?: (collapsed: boolean) => IconProp;
  /** Class name for the outer container. */
  className?: string;
  /** `htmlFor` of the `<label>`. Falls back to `id`. */
  htmlFor?: string;
  /**
   * Id of the field this label describes. Field components use it as
   * the input's `id`, so the label is linked automatically.
   */
  id?: string;
  /** The field. */
  children?: ReactNode;
  /**
   * Append a red `*` to the label text.
   * @default false
   */
  required?: VariantProps<typeof classes>['required'];
  /**
   * Vertical gap between label and field. `sm` 10px · `md` 12px ·
   * `lg` 16px · `xl` 18px.
   * @default 'sm'
   */
  gap?: VariantProps<typeof classes>['gap'];
  /**
   * `helpText` color: `default` gray · `primary` blue · `warning` yellow ·
   * `error` red.
   * @default 'default'
   */
  helpTextColor?: VariantProps<typeof helpClasses>['helpTextColor'];
}

/**
 * Form label with optional required mark, help text, action slot and
 * collapsible content. Renders just `children` when `text` is empty.
 *
 * Usually used through a field's `label` prop rather than directly.
 *
 * @example
 * <Label
 *   id="title"
 *   text="Title"
 *   required
 *   helpText="Up to 50 characters"
 *   helpTextPrefixIcon={faCircleInfo}
 * >
 *   <input id="title" />
 * </Label>
 */
export const Label = ({
  htmlFor,
  id,
  text,
  actions = null,
  collapse,
  defaultCollapsed = true,
  helpText,
  helpTextPrefixIcon = null,
  helpTextColor = 'default',
  children = null,
  required = false,
  className,
  gap = 'sm',
}: LabelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggleCollapse = () => {
    if (collapse) {
      setIsCollapsed((prev) => !prev);
    }
  };

  if (!text) {
    return <>{children}</>;
  }

  if (collapse) {
    return (
      <div
        data-komc
        className={classes({
          className,
          required,
          gap,
        })}
      >
        <label
          htmlFor={htmlFor || id}
          className="komc:flex komc:flex-row komc:flex-wrap komc:items-center"
        >
          <span className="komc:text-lg komc:text-neutral-600">{text}</span>
          {actions && (
            <div className="komc:flex komc:flex-row komc:gap-x-2 komc:mx-2">
              <div className="komc:h-4.5 komc:border-l komc:border-neutral-100" />
              {actions}
            </div>
          )}
          {helpText && (
            <div className={helpClasses({ helpTextColor })}>
              {helpTextPrefixIcon && (
                <div className="komc:flex komc:shrink-0 komc:justify-center komc:items-center komc:w-3.25 komc:h-3.5">
                  <FontAwesomeIcon
                    icon={helpTextPrefixIcon}
                    className="komc:w-3.25 komc:h-3.5 komc:text-sm"
                  />
                </div>
              )}
              <span className="komc:text-xs">{helpText}</span>
            </div>
          )}
          <button
            type="button"
            className="komc:flex komc:shrink-0 komc:justify-center komc:items-center komc:w-7 komc:h-7 komc:ml-auto komc:rounded-sm komc:bg-neutral-50"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCollapse();
            }}
          >
            <FontAwesomeIcon
              icon={collapse(isCollapsed)}
              className="komc:w-3.25 komc:h-3.5 komc:text-sm"
            />
          </button>
        </label>
        {isCollapsed && children}
      </div>
    );
  }

  return (
    <div
      data-komc
      className={classes({
        className,
        required,
        gap,
      })}
    >
      <label
        htmlFor={htmlFor || id}
        className="komc:flex komc:flex-row komc:flex-wrap komc:items-center"
      >
        <span className="komc:text-lg komc:text-neutral-600">{text}</span>
        {actions && (
          <div className="komc:flex komc:flex-row komc:gap-x-2 komc:mx-2">
            <div className="komc:h-4.5 komc:border-l komc:border-neutral-100" />
            {actions}
          </div>
        )}
        {helpText && (
          <div className={helpClasses({ helpTextColor })}>
            {helpTextPrefixIcon && (
              <div className="komc:flex komc:shrink-0 komc:justify-center komc:items-center komc:w-3.25 komc:h-3.5">
                <FontAwesomeIcon
                  icon={helpTextPrefixIcon}
                  className="komc:w-3.25 komc:h-3.5 komc:text-sm"
                />
              </div>
            )}
            <span className="komc:text-xs">{helpText}</span>
          </div>
        )}
      </label>
      {children}
    </div>
  );
};
