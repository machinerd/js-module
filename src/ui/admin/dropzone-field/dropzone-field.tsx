'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import {
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { BaseImage } from '../../image';
import { Switch, type LabelPlacement } from '../../switch';
import { Label } from '../label';

export interface DropzoneLanguage {
  value: string;
  label: string;
}

const imageClasses = cva(
  clsx(
    'komc:flex komc:justify-center komc:items-center komc:w-full komc:h-full',
    'komc:relative komc:overflow-hidden komc:group-hover:opacity-20 komc:z-0',
  ),
  {
    variants: {
      isDragActive: {
        true: 'komc:opacity-20',
        false: '',
      },
      objectFit: {
        contain: 'komc:[&_img]:object-contain',
        cover: 'komc:[&_img]:object-cover',
        fill: 'komc:[&_img]:object-fill',
        none: 'komc:[&_img]:object-none',
        'scale-down': 'komc:[&_img]:object-scale-down',
      },
      size: {
        logo: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    defaultVariants: {
      isDragActive: false,
      objectFit: 'contain',
      size: 'lg',
    },
  },
);

const innerClasses = cva(
  clsx(
    'komc:flex komc:justify-center komc:items-center',
    'komc:border-[0.6px] komc:border-neutral-300 komc:rounded-lg',
    'komc:cursor-pointer komc:relative komc:group komc:overflow-hidden',
  ),
  {
    variants: {
      src: {
        true: 'komc:border-none komc:bg-transparent',
        false: 'komc:border-dashed komc:bg-[#FBFBFD]',
      },
      size: {
        logo: 'komc:w-30 komc:h-10',
        sm: 'komc:w-full komc:h-25',
        md: 'komc:w-full komc:h-30',
        lg: 'komc:w-full komc:h-40',
        xl: 'komc:w-full komc:h-50',
      },
    },
    defaultVariants: {
      src: false,
    },
    compoundVariants: [
      {
        size: 'logo',
        src: true,
        className: 'komc:border-solid',
      },
    ],
  },
);

interface BasePropsMultipleTrue
  extends
    VariantProps<typeof imageClasses>,
    Partial<
      Omit<
        ComponentProps<typeof BaseImage>,
        'src' | 'alt' | 'onDrop' | 'onSelect'
      >
    > {
  src?: string | null;
  alt?: string;
  multiple?: true;
  placeholder?: string;
  subPlaceholder?: string;
  fileIcon: IconProp;
  linkIcon: IconProp;
  onDrop: (files: File[]) => void;
}

interface BasePropsMultipleFalse
  extends
    VariantProps<typeof imageClasses>,
    Partial<
      Omit<
        ComponentProps<typeof BaseImage>,
        'src' | 'alt' | 'onDrop' | 'onSelect'
      >
    > {
  src?: string | null;
  alt?: string;
  multiple: false;
  placeholder?: string;
  subPlaceholder?: string;
  fileIcon: IconProp;
  linkIcon: IconProp;
  onDrop: (file: File) => void;
}

export type DropzoneFieldProps = BasePropsMultipleTrue | BasePropsMultipleFalse;

export const DropzoneField = (props: DropzoneFieldProps) => {
  const { src = '', ...rest } = props;

  if (src) {
    return <DropzoneFieldLinkContainer {...rest} src={src} />;
  }

  return <DropzoneFieldInputContainer {...props} />;
};

const DropzoneFieldLinkContainer = ({
  src = '',
  alt = '',
  objectFit = 'contain',
  size = 'lg',
  originalWidth,
  linkIcon,
  ...restProps
}: Pick<
  DropzoneFieldProps,
  | 'alt'
  | 'objectFit'
  | 'size'
  | 'originalWidth'
  | 'fill'
  | 'width'
  | 'height'
  | 'sizes'
  | 'fallbackSrc'
  | 'linkIcon'
> & {
  src: string;
}) => {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt || 'Open image'}
      className={clsx(innerClasses({ src: Boolean(src), size }))}
    >
      <div className={imageClasses({ objectFit, size })}>
        <BaseImage
          {...(restProps as ComponentProps<typeof BaseImage>)}
          src={src}
          alt={alt}
          originalWidth={originalWidth || 600}
          className="komc:w-full komc:h-full"
        />
      </div>
      <div className="komc:flex komc:flex-col komc:items-center komc:justify-center komc:gap-1 komc:w-full komc:p-1 komc:absolute komc:group-hover:opacity-100 komc:opacity-0">
        <FontAwesomeIcon
          className="komc:w-4 komc:h-4 komc:aspect-square komc:text-neutral-300"
          icon={linkIcon}
        />
      </div>
    </a>
  );
};

const DropzoneFieldInputContainer = ({
  src = '',
  size = 'lg',
  placeholder = 'Select files',
  subPlaceholder = '(or drop files here)',
  fileIcon,
  ...props
}: DropzoneFieldProps) => {
  const multiple = props.multiple ?? true;

  const handleDrop = (files: File[] = []) => {
    if (props.multiple === false) {
      const file = files[0];
      if (file) props.onDrop(file);
    } else {
      props.onDrop(files);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
  });

  return (
    <div
      className={clsx(innerClasses({ src: Boolean(src), size }))}
      {...getRootProps()}
    >
      <input {...getInputProps({ multiple })} />
      <div className="komc:flex komc:flex-col komc:items-center komc:justify-center komc:gap-1 komc:w-full komc:p-1 komc:absolute">
        <FontAwesomeIcon
          className="komc:w-4 komc:h-4 komc:aspect-square komc:text-neutral-300"
          icon={fileIcon}
        />
        {size !== 'logo' && (
          <>
            <p className="komc:w-full komc:text-center komc:text-[16px] komc:leading-[1.2] komc:font-medium komc:text-neutral-600 komc:truncate">
              {placeholder}
            </p>
            <p className="komc:w-full komc:text-center komc:text-xs komc:leading-[1.2] komc:text-neutral-600 komc:truncate">
              {subPlaceholder}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

type DropzoneLogoBaseProps = DropzoneFieldProps & {
  label?: ComponentProps<typeof Label>;
  size?: 'logo';
  selectedLanguage?: DropzoneLanguage | string;
  viewLanguages?: string[];
  options?: DropzoneLanguage[];
  valueLabel?: string;
  valueLabelPlacement?: LabelPlacement;
  checked?: boolean;
  onSelect?: (language: DropzoneLanguage) => void;
  onChecked?: (checked: boolean) => void;
  onDelete?: () => void;
  update?: ReactNode;
  remove?: ReactNode;
};

type DropzoneLogoPropsWithUpdate = DropzoneLogoBaseProps & {
  id: string;
  onUpdate: (file: File) => void;
};

type DropzoneLogoPropsWithoutUpdate = DropzoneLogoBaseProps & {
  id?: string;
  onUpdate?: never;
};

export type DropzoneLogoProps =
  DropzoneLogoPropsWithUpdate | DropzoneLogoPropsWithoutUpdate;

export const DropzoneLogo = ({
  label,
  id,
  size = 'logo',
  valueLabel,
  valueLabelPlacement,
  viewLanguages = ['ko', 'en'],
  options = [],
  selectedLanguage,
  checked,
  onChecked,
  onUpdate,
  onDelete,
  onSelect,
  update,
  remove,
  ...field
}: DropzoneLogoProps) => {
  const [previewLanguage, setPreviewLanguage] = useState(selectedLanguage);

  const handleSelect = (language: DropzoneLanguage) => {
    setPreviewLanguage(language);
    onSelect?.(language);
  };

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onUpdate?.(file);
    }
  };

  return (
    <Label {...label}>
      <div
        data-komc
        className={clsx(
          'komc:flex komc:flex-row komc:items-center',
          'komc:gap-x-2.5 komc:min-w-30 komc:w-full komc:h-auto',
          'komc:p-4 komc:border-[0.6px] komc:border-neutral-300 komc:rounded-lg komc:shadow-field',
        )}
      >
        <DropzoneField {...field} size={size} />
        {valueLabel && (
          <div className="komc:flex komc:items-center komc:ml-2.5">
            <Switch
              label={valueLabel}
              placement={valueLabelPlacement}
              checked={checked}
              onChange={onChecked}
            />
          </div>
        )}
        {(onUpdate || onDelete) && (
          <div className="komc:flex komc:flex-row komc:items-center komc:gap-x-2.5 komc:ml-auto">
            {onSelect && (
              <div className="komc:flex komc:flex-row komc:gap-x-3 komc:p-1 komc:rounded-sm komc:bg-gray-400">
                {options
                  .filter((language) => viewLanguages?.includes(language.value))
                  .map((language) => {
                    const compareLanguage =
                      typeof previewLanguage === 'string'
                        ? previewLanguage === language.value
                        : previewLanguage?.value === language.value;

                    return (
                      <button
                        key={language.value}
                        type="button"
                        className={clsx(
                          'komc:flex komc:justify-center komc:items-center komc:w-20 komc:h-7.5',
                          'komc:rounded-sm komc:text-sm komc:font-medium komc:cursor-pointer',
                          compareLanguage
                            ? 'komc:bg-white komc:text-blue-700'
                            : 'komc:bg-transparent komc:text-neutral-500',
                        )}
                        onClick={() => handleSelect(language)}
                      >
                        <span>{language.label}</span>
                      </button>
                    );
                  })}
              </div>
            )}
            <div className="komc:h-4 komc:border-r komc:border-neutral-100 komc:rounded-full" />
            {onUpdate && id && (
              <UpdateButton id={id} onUpdate={handleUpdate}>
                {update}
              </UpdateButton>
            )}
            {onDelete && (
              <DeleteButton onDelete={onDelete}>{remove}</DeleteButton>
            )}
          </div>
        )}
      </div>
    </Label>
  );
};

export const UpdateButton = ({
  id,
  onUpdate,
  children,
}: {
  id: string;
  onUpdate: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}) => {
  return (
    <label htmlFor={id} className="komc:cursor-pointer">
      <input
        id={id}
        type="file"
        className="komc:hidden"
        aria-label="Replace file"
        onClick={(e) => {
          (e.target as HTMLInputElement).value = '';
        }}
        onChange={onUpdate}
      />
      <div className="komc:flex komc:items-center komc:justify-center komc:w-5 komc:h-5 komc:aspect-square komc:cursor-pointer komc:[&_svg]:w-4 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500">
        {children}
      </div>
    </label>
  );
};

export const DeleteButton = ({
  onDelete,
  children,
}: {
  onDelete: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      type="button"
      className="komc:flex komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square komc:cursor-pointer komc:[&_svg]:w-3.5 komc:[&_svg]:h-3.5 komc:[&_svg]:text-neutral-500"
      aria-label="Delete"
      onClick={onDelete}
    >
      {children}
    </button>
  );
};

export type DropzoneProps = DropzoneFieldProps & {
  label?: ComponentProps<typeof Label>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const Dropzone = ({ label, ...field }: DropzoneProps) => {
  return (
    <Label {...label}>
      <div
        data-komc
        className={clsx(
          'komc:flex komc:flex-row komc:items-center',
          'komc:gap-x-2.5 komc:min-w-30 komc:w-full komc:h-auto',
          'komc:p-4 komc:border-[0.6px] komc:border-neutral-300 komc:rounded-lg komc:shadow-field',
        )}
      >
        <DropzoneField {...field} />
      </div>
    </Label>
  );
};
