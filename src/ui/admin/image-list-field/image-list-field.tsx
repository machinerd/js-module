'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { useSortable } from '@dnd-kit/sortable';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import {
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { DndItem } from '../../dnd';
import { Image } from '../../image';
import { Label } from '../label';

const objectFitClasses = cva('', {
  variants: {
    objectFit: {
      cover: 'komc:object-cover',
      contain: 'komc:object-contain',
      fill: 'komc:object-fill',
      none: 'komc:object-none',
      'scale-down': 'komc:object-scale-down',
    },
  },
  defaultVariants: {
    objectFit: 'cover',
  },
});

const slotClasses =
  'komc:flex komc:shrink-0 komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:aspect-square komc:cursor-pointer komc:[&_svg]:w-3.5 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500';

export interface ImageListFieldProps {
  /** Label shown above the card. See `LabelProps`. */
  label?: ComponentProps<typeof Label>;
  /**
   * Image path (CDN-relative) or URL. When it changes, the preview resets
   * to it.
   */
  src: string;
  /** Alt text of the preview. */
  alt?: string;
  /** Class name for the preview `<img>`. */
  className?: string;
  /**
   * Width of the original image in px, used to pick CDN subsets.
   * @default 600
   */
  originalWidth?: number;
  /**
   * Sortable id. Must match the item's id in the surrounding `DndWrapper`.
   * Also used for the hidden file input id, so it must be unique on the page.
   */
  dragId: string;
  /**
   * How the preview fits its 144px-tall box.
   * @default 'cover'
   */
  objectFit?: VariantProps<typeof objectFitClasses>['objectFit'];
  /** Called when the delete button is clicked. */
  onDelete: () => void;
  /**
   * Called with the new file chosen via the replace button. The preview
   * switches to the file immediately.
   */
  onUpdate: (file: File) => void;
  /** Drag handle content, e.g. `<FontAwesomeIcon icon={faGripVertical} />`. */
  handle: ReactNode;
  /** Replace button content, e.g. `<FontAwesomeIcon icon={faPen} />`. */
  update: ReactNode;
  /** Delete button content, e.g. `<FontAwesomeIcon icon={faTrash} />`. */
  action: ReactNode;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

/**
 * Sortable image card: header with drag handle, replace and delete buttons,
 * and a preview that opens the image in a new tab.
 *
 * Must be rendered inside `DndWrapper` (or a dnd-kit `SortableContext`).
 * Requires `ApiClientProvider`.
 *
 * @example
 * const { fields, move, remove } = useFieldArray({
 *   control,
 *   name: 'images',
 * });
 *
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field, index) => (
 *     <ImageListField
 *       key={field.id}
 *       dragId={field.id}
 *       src={field.path}
 *       originalWidth={field.width}
 *       handle={<FontAwesomeIcon icon={faGripVertical} />}
 *       update={<FontAwesomeIcon icon={faPen} />}
 *       action={<FontAwesomeIcon icon={faTrash} />}
 *       onUpdate={(file) => replaceImage(index, file)}
 *       onDelete={() => remove(index)}
 *     />
 *   ))}
 * </DndWrapper>
 */
export const ImageListField = ({
  label,
  dragId,
  ...props
}: ImageListFieldProps) => {
  return (
    <DndItem
      id={dragId}
      render={(attributes, listeners) => (
        <Label {...label}>
          <ImageListFieldItem
            {...props}
            dragId={dragId}
            attributes={attributes}
            listeners={listeners}
          />
        </Label>
      )}
    />
  );
};

export interface ImageListFieldItemProps extends ImageListFieldProps {
  /** dnd-kit attributes spread onto the drag handle. */
  attributes: DraggableAttributes;
  /** dnd-kit listeners spread onto the drag handle. */
  listeners?: SortableListeners;
}

/**
 * Card UI of {@link ImageListField} without the sortable wrapper and label.
 * Use it when you wire dnd-kit yourself.
 */
export const ImageListFieldItem = ({
  dragId,
  src = '',
  alt = '',
  objectFit = 'cover',
  className,
  originalWidth,
  onUpdate,
  onDelete,
  handle,
  update,
  action,
  attributes,
  listeners,
}: ImageListFieldItemProps) => {
  const [preview, setPreview] = useState(src);
  const fileInputId = `${dragId}-file-input`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpdate(file);
    }
  };

  useEffect(() => {
    setPreview(src);
  }, [src]);

  return (
    <div
      data-komc
      className={clsx(
        'komc:flex komc:flex-col komc:w-full komc:h-auto',
        'komc:rounded-sm komc:border-[0.6px] komc:border-neutral-100 komc:bg-neutral-50',
        'komc:shadow-field komc:overflow-hidden',
      )}
    >
      <div
        className={clsx(
          'komc:flex komc:flex-row komc:justify-between komc:items-center komc:gap-x-3',
          'komc:w-full komc:h-9 komc:px-3 komc:py-2 komc:bg-white',
        )}
      >
        <button
          type="button"
          aria-label="Drag to reorder"
          className={clsx(slotClasses, 'komc:cursor-grab')}
          {...attributes}
          {...listeners}
        >
          {handle}
        </button>
        <div className="komc:flex komc:flex-row komc:items-center komc:gap-x-3 komc:ml-auto">
          <label htmlFor={fileInputId} className="komc:cursor-pointer">
            <input
              type="file"
              id={fileInputId}
              className="komc:hidden"
              aria-label="Replace file"
              onClick={(e) => {
                (e.target as HTMLInputElement).value = '';
              }}
              onChange={handleChange}
            />
            <div className="komc:flex komc:items-center komc:justify-center komc:w-5 komc:h-5 komc:aspect-square komc:[&_svg]:w-5 komc:[&_svg]:h-4 komc:[&_svg]:text-neutral-500">
              {update}
            </div>
          </label>
          <button
            type="button"
            aria-label="Delete"
            className={slotClasses}
            onClick={onDelete}
          >
            {action}
          </button>
        </div>
      </div>
      <a
        href={preview || ''}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={alt || 'Open image'}
        className="komc:w-full komc:h-36 komc:relative"
      >
        <Image
          fill
          sizes="250px"
          originalWidth={originalWidth || 600}
          src={preview}
          alt={alt}
          className={objectFitClasses({ objectFit, className })}
        />
      </a>
    </div>
  );
};
