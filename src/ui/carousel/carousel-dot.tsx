import React from 'react';
import { useCarousel } from './carousel-context';

/**
 * Single button that scrolls to snap `index`. Use when you render indicators
 * yourself; otherwise use `CarouselDots`.
 *
 * Has `data-selected="true"` while its snap is current, for styling.
 * Passing `onClick` replaces the scroll behavior.
 *
 * Must be rendered inside `<Carousel>`.
 *
 * @example
 * const { dots } = useCarousel();
 *
 * {Array.from({ length: dots }, (_, i) => (
 *   <CarouselDot key={i} index={i} className="data-[selected=true]:bg-black" />
 * ))}
 */
export default function CarouselDots({
  index,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  /** Snap index to scroll to (0-based). */
  index: number;
}) {
  const { selectedScrollSnap, scrollTo } = useCarousel();

  return (
    <button
      type="button"
      data-komc
      data-selected={selectedScrollSnap === index}
      aria-label={`go to slide ${index + 1}`}
      onClick={() => scrollTo(index)}
      {...props}
    >
      {children}
    </button>
  );
}
