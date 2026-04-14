import React from "react";
import { cn } from "../../util";
import { useCarousel } from "./carousel-context";

export default function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      data-komc
      className={cn(
        'komc:min-w-0 komc:shrink-0 komc:grow-0 komc:basis-full',
        orientation === 'horizontal' ? 'komc:pl-4' : 'komc:pt-4',
        className,
      )}
      {...props}
    />
  );
}
