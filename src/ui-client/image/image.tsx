import clsx from 'clsx';
import {
  forwardRef,
} from 'react';
import useSubsetImage, {
  type UseSubsetImageProps,
  type UseSubsetImagePropsWithoutApiClient,
} from '../../hooks/use-subset-image';
import { Skeleton } from '../../ui/skeleton';
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

export type ImageSubsetProps = {
  layout?: 'intrinsic' | 'stretch';
  skeleton?: boolean;
  emptyNode?: React.ReactNode;
  emptyNodeClassName?: string;
  skeletonClassName?: string;
};
export type ImageProps = UseSubsetImageProps & ImageSubsetProps
export type ImagePropsWithoutApiClient = UseSubsetImagePropsWithoutApiClient & ImageSubsetProps

export const BaseImage = forwardRef<HTMLImageElement, UseSubsetImageProps>(({
  ...rest
}, ref) => {
  const { ref: combinedRef, imageProps } = useSubsetImage({ ref, ...rest });

  return <img ref={combinedRef} {...imageProps} />;
});

const Image = forwardRef<HTMLImageElement, ImageProps>(({
  skeleton = true,
  layout = 'stretch',
  fallbackSrc,
  className,
  emptyNode,
  emptyNodeClassName,
  skeletonClassName,
  ...rest
}, ref) => {
  const { ref: combinedRef, isLoad, isError, imageProps } = useSubsetImage({
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
    if (rest.fill) return <EmptyNode className={emptyNodeClassName}>{emptyNode}</EmptyNode>;

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
        className={clsx(classes({ fill: rest.fill, className }), skeleton && !isLoad ? 'komc:invisible' : 'komc:visible')}
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
});

export interface EmptyNodeProps {
  children: React.ReactNode;
  className?: string;
}

export const EmptyNode = ({ children, className }: EmptyNodeProps) => {
  return (
    <div
      data-komc
      role="alert"
      className={clsx("komc:flex komc:justify-center komc:items-center komc:w-full komc:h-full komc:bg-gray-100 komc:absolute komc:inset-0 komc:p-1", className)}
    >
      {children}
    </div>
  );
};

export default Image;
