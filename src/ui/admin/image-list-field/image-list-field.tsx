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
  label?: ComponentProps<typeof Label>;
  src: string;
  alt?: string;
  className?: string;
  originalWidth?: number;
  dragId: string;
  objectFit?: VariantProps<typeof objectFitClasses>['objectFit'];
  onDelete: () => void;
  onUpdate: (file: File) => void;
  handle: ReactNode;
  update: ReactNode;
  action: ReactNode;
}

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

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
  attributes: DraggableAttributes;
  listeners?: SortableListeners;
}

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
