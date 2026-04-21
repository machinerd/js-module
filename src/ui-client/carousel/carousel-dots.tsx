import React from 'react';
import { useCarousel } from './carousel-context';

export default function CarouselDots({
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & { children?: (index: number) => React.ReactNode }) {
  const { dots, selectedScrollSnap, scrollTo } = useCarousel();

  return (
    <>
      {Array.from({ length: dots }).map((_, i) => (
        (
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
        )
      ))}
    </>
  );
}
