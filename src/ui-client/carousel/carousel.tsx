import { ComponentProps, KeyboardEvent, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselApi, CarouselContext, CarouselProps as CarouselContextProps } from "./carousel-context";
import { cn } from "../../util";

export interface CarouselProps extends ComponentProps<'div'>, CarouselContextProps {
  orientation?: 'horizontal' | 'vertical';
  options?: CarouselContextProps['options'];
  setApi?: CarouselContextProps['setApi'];
  plugins?: CarouselContextProps['plugins'];
}

export default function Carousel({
  orientation = 'horizontal',
  options,
  setApi,
  plugins,
  className,
  children,
  ...props
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...options,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (orientation === 'horizontal') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      } else {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          scrollNext();
        }
      }
    },
    [scrollPrev, scrollNext, orientation],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        options,
        orientation:
          orientation || (options?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        data-komc
        role="region"
        aria-label="carousel"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn('komc:relative', className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}
