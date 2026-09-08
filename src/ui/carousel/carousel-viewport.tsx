import React from 'react';
import clsx from 'clsx';
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
      className={clsx('komc:h-full komc:overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}
