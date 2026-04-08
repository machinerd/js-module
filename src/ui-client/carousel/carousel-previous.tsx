import React from "react";
import { useCarousel } from "./carousel-context";
import clsx from "clsx";

export default function CarouselPrevious({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      type="button"
      data-komc
      disabled={!canScrollPrev}
      aria-label="previous slide"
      className={clsx('komc:w-full', className)}
      onClick={scrollPrev}
      {...props}
    >
      {children}
    </button>
  );
}
