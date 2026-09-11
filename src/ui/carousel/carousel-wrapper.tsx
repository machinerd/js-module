import React from 'react';
import clsx from 'clsx';
import { useCarousel } from './carousel-context';

/**
 * Flex track that holds the `CarouselItem`s. Lays them out in a row or
 * column depending on `orientation`.
 *
 * Must be the direct child of `CarouselViewport`.
 */
export default function CarouselWrapper({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      data-komc
      className={clsx(
        'komc:flex komc:h-full',
        orientation === 'horizontal'
          ? 'komc:-ml-4'
          : 'komc:-mt-4 komc:flex-col',
        className,
      )}
      {...props}
    />
  );
}
