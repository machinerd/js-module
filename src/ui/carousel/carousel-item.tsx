import React from 'react';
import clsx from 'clsx';
import { useCarousel } from './carousel-context';

/**
 * A single slide. Takes the full viewport width (or height) by default;
 * override the flex basis via `className` to show several at once
 * (e.g. `basis-1/2`).
 *
 * Must be rendered inside `CarouselWrapper`.
 */
export default function CarouselItem({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      data-komc
      role="group"
      aria-roledescription="slide"
      className={clsx(
        'komc:min-w-0 komc:shrink-0 komc:grow-0 komc:basis-full',
        orientation === 'horizontal' ? 'komc:pl-4' : 'komc:pt-4',
        className,
      )}
      {...props}
    />
  );
}
