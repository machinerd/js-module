import React from "react";
import { cn } from "../../util";
import { useCarousel } from "./carousel-context";

export default function CarouselWrapper({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      data-komc
      className="komc:h-full komc:overflow-hidden"
    >
      <div
        className={cn(
          'komc:flex komc:h-full',
          orientation === 'horizontal' ? 'komc:-ml-4' : 'komc:-mt-4 komc:flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
}
