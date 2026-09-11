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

/** Language option for the {@link DropzoneLogo} language tabs. */
export interface DropzoneLanguage {
  /** Language code, matched against `viewLanguages` (e.g. `'ko'`). */
  value: string;
  /** Tab text. */
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
  /**
   * Uploaded file path or URL. When set, a preview linking to the file is
   * shown instead of the drop area.
   */
  src?: string | null;
  /** Alt text of the preview image. */
  alt?: string;
  /**
   * Accept several files. `onDrop` receives `File[]`.
   * @default true
   */
  multiple?: true;
  /**
   * Main text of the drop area. Hidden when `size="logo"`.
   * @default 'Select files'
   */
  placeholder?: string;
  /**
   * Secondary text of the drop area. Hidden when `size="logo"`.
   * @default '(or drop files here)'
   */
  subPlaceholder?: string;
  /** Font Awesome icon in the empty drop area (e.g. `faFile`). */
  fileIcon: IconProp;
  /** Font Awesome icon shown when hovering the preview (e.g. `faLink`). */
  linkIcon: IconProp;
  /** Called with the dropped or selected files. */
  onDrop: (files: File[]) => void;
  /**
   * How the preview image fits its box.
   * @default 'contain'
   */
  objectFit?: VariantProps<typeof imageClasses>['objectFit'];
  /**
   * Box size. `logo` 120×40px (texts hidden) · `sm` 100px · `md` 120px ·
   * `lg` 160px · `xl` 200px tall, full width.
   * @default 'lg'
   */
  size?: VariantProps<typeof imageClasses>['size'];
  /** Currently has no effect. */
  isDragActive?: VariantProps<typeof imageClasses>['isDragActive'];
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
  /**
   * Uploaded file path or URL. When set, a preview linking to the file is
   * shown instead of the drop area.
   */
  src?: string | null;
  /** Alt text of the preview image. */
  alt?: string;
  /** Accept a single file. `onDrop` receives one `File`. */
  multiple: false;
  /**
   * Main text of the drop area. Hidden when `size="logo"`.
   * @default 'Select files'
   */
  placeholder?: string;
  /**
   * Secondary text of the drop area. Hidden when `size="logo"`.
   * @default '(or drop files here)'
   */
  subPlaceholder?: string;
  /** Font Awesome icon in the empty drop area (e.g. `faFile`). */
  fileIcon: IconProp;
  /** Font Awesome icon shown when hovering the preview (e.g. `faLink`). */
  linkIcon: IconProp;
  /** Called with the first dropped or selected file. */
  onDrop: (file: File) => void;
  /**
   * How the preview image fits its box.
   * @default 'contain'
   */
  objectFit?: VariantProps<typeof imageClasses>['objectFit'];
  /**
   * Box size. `logo` 120×40px (texts hidden) · `sm` 100px · `md` 120px ·
   * `lg` 160px · `xl` 200px tall, full width.
   * @default 'lg'
   */
  size?: VariantProps<typeof imageClasses>['size'];
  /** Currently has no effect. */
  isDragActive?: VariantProps<typeof imageClasses>['isDragActive'];
}

/**
 * Props for {@link DropzoneField}. `multiple` decides the `onDrop` signature.
 *
 * Remaining `BaseImage` props (`originalWidth`, `folder`, ...) configure the
 * preview; `originalWidth` defaults to 600.
 */
export type DropzoneFieldProps = BasePropsMultipleTrue | BasePropsMultipleFalse;

/**
 * File drop area without a label or frame. Shows a clickable/droppable area
 * when `src` is empty, and an image preview linking to `src` otherwise.
 *
 * Usually used through {@link Dropzone} or {@link DropzoneLogo}.
 * The preview requires `ApiClientProvider`.
 *
 * @example
 * <DropzoneField
 *   multiple={false}
 *   src={thumbnailUrl}
 *   size="md"
 *   fileIcon={faFile}
 *   linkIcon={faLink}
 *   onDrop={(file) => upload(file)}
 * />
 */
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
  fileIcon,
  linkIcon,
  multiple,
  isDragActive,
  placeholder,
  subPlaceholder,
  onDrop,
  ...restProps
}: DropzoneFieldProps) => {
  return (
    <a
      href={src || ''}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt || 'Open image'}
      className={clsx(innerClasses({ src: Boolean(src), size }))}
    >
      <div className={imageClasses({ objectFit, size })}>
        <BaseImage
          {...(restProps as unknown as ComponentProps<typeof BaseImage>)}
          src={src || ''}
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
  /** Label shown above the field. See `LabelProps`. */
  label?: ComponentProps<typeof Label>;
  /**
   * Always `logo` (120×40px).
   * @default 'logo'
   */
  size?: 'logo';
  /**
   * Initially highlighted language tab (option or its `value`).
   * Only read on mount.
   */
  selectedLanguage?: DropzoneLanguage | string;
  /**
   * `value`s of the `options` to show as tabs.
   * @default ['ko', 'en']
   */
  viewLanguages?: string[];
  /**
   * Language tabs. Shown only when `onSelect` and `onUpdate` or `onDelete`
   * are set.
   * @default []
   */
  options?: DropzoneLanguage[];
  /** Label of a switch next to the logo. The switch shows only when set. */
  valueLabel?: string;
  /** Position of `valueLabel` relative to the switch. */
  valueLabelPlacement?: LabelPlacement;
  /** Switch state. Controlled: update it from `onChecked`. */
  checked?: boolean;
  /** Called when a language tab is clicked. */
  onSelect?: (language: DropzoneLanguage) => void;
  /** Called when the switch is toggled. */
  onChecked?: (checked: boolean) => void;
  /** Shows a delete button and is called when it is clicked. */
  onDelete?: () => void;
  /** Icon/content of the replace button, e.g. `<FontAwesomeIcon icon={faPen} />`. */
  update?: ReactNode;
  /** Icon/content of the delete button, e.g. `<FontAwesomeIcon icon={faTrash} />`. */
  remove?: ReactNode;
};

type DropzoneLogoPropsWithUpdate = DropzoneLogoBaseProps & {
  /** Unique id for the hidden file input. Required with `onUpdate`. */
  id: string;
  /** Shows a replace button and is called with the newly chosen file. */
  onUpdate: (file: File) => void;
};

type DropzoneLogoPropsWithoutUpdate = DropzoneLogoBaseProps & {
  /** Unique id for the hidden file input. Required with `onUpdate`. */
  id?: string;
  onUpdate?: never;
};

/** Props for {@link DropzoneLogo}. `id` is required when `onUpdate` is set. */
export type DropzoneLogoProps =
  DropzoneLogoPropsWithUpdate | DropzoneLogoPropsWithoutUpdate;

/**
 * Framed logo uploader: a small {@link DropzoneField} with optional switch,
 * language tabs, replace and delete buttons.
 *
 * The preview requires `ApiClientProvider`.
 *
 * @example
 * <DropzoneLogo
 *   id="logo-ko"
 *   label={{ text: 'Logo' }}
 *   multiple={false}
 *   src={logo?.path}
 *   fileIcon={faFile}
 *   linkIcon={faLink}
 *   onDrop={upload}
 *   onUpdate={upload}
 *   onDelete={removeLogo}
 *   update={<FontAwesomeIcon icon={faPen} />}
 *   remove={<FontAwesomeIcon icon={faTrash} />}
 *   options={[
 *     { value: 'ko', label: 'Korean' },
 *     { value: 'en', label: 'English' },
 *   ]}
 *   selectedLanguage="ko"
 *   onSelect={(language) => setLanguage(language.value)}
 * />
 */
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

/**
 * Icon button that opens a file picker. Re-selecting the same file still
 * fires `onUpdate`.
 */
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

/** Small icon button for delete actions. */
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

/** Props for {@link Dropzone}. `multiple` decides the `onDrop` signature. */
export type DropzoneProps = DropzoneFieldProps & {
  /** Label shown above the field. See `LabelProps`. */
  label?: ComponentProps<typeof Label>;
  /**
   * Box height. `sm` 100px · `md` 120px · `lg` 160px · `xl` 200px.
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

/**
 * Framed file drop area with an optional {@link Label}. Shows a preview
 * linking to `src` once a file is uploaded.
 *
 * The preview requires `ApiClientProvider`.
 *
 * @example
 * // Multiple files (default)
 * <Dropzone
 *   label={{ text: 'Attachments' }}
 *   fileIcon={faFile}
 *   linkIcon={faLink}
 *   onDrop={(files) => files.forEach(upload)}
 * />
 *
 * @example
 * // Single image with preview
 * <Dropzone
 *   label={{ text: 'Cover', required: true }}
 *   multiple={false}
 *   src={cover?.path}
 *   originalWidth={cover?.width}
 *   objectFit="cover"
 *   fileIcon={faImage}
 *   linkIcon={faLink}
 *   onDrop={(file) => uploadCover(file)}
 * />
 */
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
