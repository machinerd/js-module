import React from 'react';
import { useCarousel } from './carousel-context';
import clsx from 'clsx';

/**
 * Button that scrolls to the next snap. Disabled automatically when there is
 * no next snap. Passing `onClick` or `disabled` replaces that behavior.
 *
 * Must be rendered inside `<Carousel>`.
 *
 * @example
 * <CarouselNext className="w-auto">Next</CarouselNext>
 */
export default function CarouselNext({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      type="button"
      data-komc
      disabled={!canScrollNext}
      aria-label="next slide"
      className={clsx('komc:w-full', className)}
      onClick={scrollNext}
      {...props}
    >
      {children}
    </button>
  );
}
