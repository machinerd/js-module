import React from 'react';
import { cn } from '../../util/common';
import { useCarousel } from './carousel-context';

export default function CarouselViewport({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { carouselRef } = useCarousel();

  return (
    <div
      ref={carouselRef}
      data-komc
      className={cn('komc:h-full komc:overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}
