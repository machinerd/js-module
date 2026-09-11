import React from 'react';
import { useCarousel } from './carousel-context';
import clsx from 'clsx';

/**
 * Button that scrolls to the previous snap. Disabled automatically when there
 * is no previous snap. Passing `onClick` or `disabled` replaces that behavior.
 *
 * Must be rendered inside `<Carousel>`.
 *
 * @example
 * <CarouselPrevious className="w-auto">Prev</CarouselPrevious>
 */
export default function CarouselPrevious({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      type="button"
      data-komc
      disabled={!canScrollPrev}
      aria-label="previous slide"
      className={clsx('komc:w-full', className)}
      onClick={scrollPrev}
      {...props}
    >
      {children}
    </button>
  );
}
