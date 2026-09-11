import React from 'react';
import { useCarousel } from './carousel-context';

/**
 * Renders one button per scroll snap. Clicking a button scrolls to that snap.
 *
 * Every button receives the same props (`className`, ...) and has
 * `data-selected="true"` while its snap is current, for styling.
 *
 * Must be rendered inside `<Carousel>`.
 *
 * @example
 * <CarouselDots className="size-2 rounded-full bg-gray-300 data-[selected=true]:bg-black" />
 *
 * @example
 * <CarouselDots>{(index) => index + 1}</CarouselDots>
 */
export default function CarouselDots({
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & {
  /** Renders the content of each button. Receives the snap index (0-based). */
  children?: (index: number) => React.ReactNode;
}) {
  const { dots, selectedScrollSnap, scrollTo } = useCarousel();

  return (
    <>
      {Array.from({ length: dots }).map((_, i) => (
        <button
          key={i}
          type="button"
          data-komc
          data-selected={selectedScrollSnap === i}
          aria-label={`go to slide ${i + 1}`}
          onClick={() => scrollTo(i)}
          {...props}
        >
          {children?.(i)}
        </button>
      ))}
    </>
  );
}
