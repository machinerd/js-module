import React from "react";
import { useCarousel } from "./carousel-context";
import clsx from "clsx";

export default function CarouselNext({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      type="button"
      data-komc
      disabled={!canScrollNext}
      className={clsx('komc:w-full', className)}
      onClick={scrollNext}
      {...props}
    >
      {children}
    </button>
  );
}
