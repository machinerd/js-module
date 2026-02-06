import { ComponentProps, KeyboardEvent, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselApi, CarouselContext, CarouselProps as CarouselContextProps } from "./carousel-context";
import { cn } from "../../../util";

export interface CarouselProps extends ComponentProps<'div'>, CarouselContextProps {
  /**
   * @param orientation - Orientation of the carousel
   * @default horizontal
   * @property
   * - horizontal
   * - vertical
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * @param options - Options of the carousel
   * @default {}
   */
  options?: CarouselContextProps['options'];
  /**
   * @param setApi - Set the API of the carousel
   * @default undefined
   */
  setApi?: CarouselContextProps['setApi'];
  /**
   * @param plugins - Plugins of the carousel
   * @default []
   */
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
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
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
        onKeyDownCapture={handleKeyDown}
        className={cn('komc:relative', className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}
