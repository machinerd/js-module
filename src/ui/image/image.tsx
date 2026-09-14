/* eslint-disable jsx-a11y/alt-text */
import clsx from 'clsx';
import { forwardRef } from 'react';
import {
  useSubsetImage,
  type UseSubsetImageProps,
} from '../../hooks/use-subset-image';
import { Skeleton } from '../skeleton';
import { cva } from 'class-variance-authority';

const classes = cva('', {
  variants: {
    fill: {
      true: 'komc:w-full komc:h-full komc:absolute komc:inset-0',
      false: '',
    },
  },
  defaultVariants: {
    fill: false,
  },
});

/** Loading/empty-state options added by {@link Image} on top of `BaseImage`. */
export interface ImageSubsetProps {
  /**
   * Wrapper sizing when `fill` is not set.
   * - `stretch`: wrapper fills its parent (`100%` × `100%`).
   * - `intrinsic`: wrapper is fixed to `width` × `height` px.
   *
   * @default 'stretch'
   */
  layout?: 'intrinsic' | 'stretch';
  /**
   * Show a pulsing skeleton until the image loads. `false` shows the image
   * immediately.
   * @default true
   */
  skeleton?: boolean;
  /**
   * Shown instead of the image when every source failed and no
   * `fallbackSrc` is set (or `src` is empty).
   */
  emptyNode?: React.ReactNode;
  /** Class name for the `emptyNode` container. */
  emptyNodeClassName?: string;
  /** Class name for the skeleton. */
  skeletonClassName?: string;
}

/**
 * Props for {@link Image}. Other `<img>` attributes (`alt`, `loading`, ...)
 * are passed through; `loading` defaults to `'lazy'`.
 *
 * Size is required in one of two forms:
 * - `width` + `height` (px), or
 * - `fill` + `sizes` — the image covers its nearest positioned parent.
 *
 * Image source props:
 * - `src` (required): CDN-relative path or absolute URL.
 * - `originalWidth` (required): width of the uploaded original in px.
 *   Only subsets up to this width are requested.
 * - `folder`: CDN folder, `'media'` (default) or `'static'`.
 * - `origin`: `true` skips subsets and loads the original only.
 * - `fallbackSrc`: last source tried before giving up.
 */
export type ImageProps = UseSubsetImageProps & ImageSubsetProps;

/**
 * Plain `<img>` with CDN resolution and responsive subset `srcSet`, without
 * skeleton or empty-state UI. See {@link Image} for the props.
 *
 * Requires `ApiClientProvider`.
 */
export const BaseImage = forwardRef<HTMLImageElement, UseSubsetImageProps>(
  ({ ...rest }, ref) => {
    const { ref: combinedRef, imageProps } = useSubsetImage({ ref, ...rest });

    return <img ref={combinedRef} {...imageProps} />;
  },
);

/**
 * Image served from the media CDN with responsive WebP subsets, a loading
 * skeleton and an optional empty state.
 *
 * - Relative `src` (e.g. `'2024/01/photo.jpg'`) is resolved against the CDN;
 *   URLs starting with `http`, `blob:` or `data:` are used as-is.
 * - On error it retries in order: subset `srcSet` → original WebP → `src` →
 *   `fallbackSrc`. Without `fallbackSrc`, `emptyNode` is shown once all
 *   sources fail (or immediately if `src` is empty).
 * - `className` goes to the `<img>`. `onError` is handled internally.
 *
 * Requires `ApiClientProvider`.
 *
 * @example
 * <Image
 *   src={media.path}
 *   alt={media.alt}
 *   width={320}
 *   height={180}
 *   originalWidth={media.width}
 *   className="object-cover"
 * />
 *
 * @example
 * // Fill a positioned parent
 * <div className="relative aspect-video">
 *   <Image
 *     fill
 *     sizes="(max-width: 768px) 100vw, 50vw"
 *     src={media.path}
 *     originalWidth={media.width}
 *     emptyNode={<span>No image</span>}
 *   />
 * </div>
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      skeleton = true,
      layout = 'stretch',
      fallbackSrc,
      className,
      emptyNode,
      emptyNodeClassName,
      skeletonClassName,
      ...rest
    },
    ref,
  ) => {
    const {
      ref: combinedRef,
      isLoad,
      isError,
      imageProps,
    } = useSubsetImage({
      ref,
      fallbackSrc,
      forceLoad: !skeleton,
      ...rest,
    });

    const fixedBoxStyle =
      !rest.fill && layout === 'intrinsic'
        ? { width: `${rest.width}px`, height: `${rest.height}px` }
        : undefined;

    const fixedBoxClass = clsx(
      'komc:flex komc:justify-center komc:items-center komc:relative komc:min-h-0',
      !rest.fill && layout === 'stretch' && 'komc:w-full komc:h-full',
    );

    if (!fallbackSrc && isError && emptyNode) {
      if (rest.fill)
        return (
          <EmptyNode className={emptyNodeClassName}>{emptyNode}</EmptyNode>
        );

      return (
        <div data-komc style={fixedBoxStyle} className={fixedBoxClass}>
          <EmptyNode className={emptyNodeClassName}>{emptyNode}</EmptyNode>
        </div>
      );
    }

    if (rest.fill) {
      return (
        <>
          <img
            ref={combinedRef}
            {...imageProps}
            className={clsx(
              'komc:w-full komc:h-full komc:absolute komc:inset-0',
              skeleton && !isLoad ? 'komc:invisible' : 'komc:visible',
              className,
            )}
          />
          <div
            data-komc
            className={clsx(
              'komc:w-full komc:h-full komc:absolute komc:inset-0',
              skeleton && !isLoad ? 'komc:block' : 'komc:hidden',
            )}
          >
            <Skeleton size="full" className={skeletonClassName} />
          </div>
        </>
      );
    }

    return (
      <div data-komc style={fixedBoxStyle} className={fixedBoxClass}>
        <img
          ref={combinedRef}
          {...imageProps}
          className={clsx(
            classes({ fill: rest.fill, className }),
            skeleton && !isLoad ? 'komc:invisible' : 'komc:visible',
          )}
        />
        <div
          className={clsx(
            'komc:w-full komc:h-full komc:absolute komc:inset-0',
            skeleton && !isLoad ? 'komc:block' : 'komc:hidden',
          )}
        >
          <Skeleton size="full" className={skeletonClassName} />
        </div>
      </div>
    );
  },
);

export interface EmptyNodeProps {
  /** Placeholder content, e.g. an icon or text. */
  children: React.ReactNode;
  /** Class name for the container. */
  className?: string;
}

/**
 * Gray placeholder box that covers its positioned parent (`absolute inset-0`).
 * Used by {@link Image} for `emptyNode`.
 */
export const EmptyNode = ({ children, className }: EmptyNodeProps) => {
  return (
    <div
      data-komc
      role="alert"
      className={clsx(
        'komc:flex komc:justify-center komc:items-center komc:w-full komc:h-full komc:bg-gray-100 komc:absolute komc:inset-0 komc:p-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Image;
