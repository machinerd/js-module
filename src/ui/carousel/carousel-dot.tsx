import React from 'react';
import { useCarousel } from './carousel-context';

export default function CarouselDots({
  index,
  children,
  ...props
}: React.ComponentProps<'button'> & { index: number }) {
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
