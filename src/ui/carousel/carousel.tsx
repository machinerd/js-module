import {
  ComponentProps,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  CarouselApi,
  CarouselContext,
  CarouselProps as CarouselContextProps,
} from './carousel-context';
import clsx from 'clsx';

export interface CarouselProps
  extends ComponentProps<'div'>, CarouselContextProps {
  /**
   * Scroll direction. Also sets arrow-key navigation
   * (left/right or up/down) and slide spacing.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Embla options such as `loop`, `align`, `slidesToScroll`.
   * `axis` is ignored — use `orientation` instead.
   */
  options?: CarouselContextProps['options'];
  /**
   * Receives the Embla API once it is ready, for controlling the carousel
   * from outside (e.g. `api.scrollTo(2)`).
   */
  setApi?: CarouselContextProps['setApi'];
  /** Embla plugins, e.g. `[Autoplay({ delay: 3000 })]`. */
  plugins?: CarouselContextProps['plugins'];
}

/**
 * Root of an Embla-based carousel. Provides state to the `Carousel*` parts
 * and {@link useCarousel}, and handles arrow-key navigation when focused.
 *
 * Structure: `Carousel` > `CarouselViewport` > `CarouselWrapper` >
 * `CarouselItem`. Navigation parts (`CarouselPrevious`, `CarouselNext`,
 * `CarouselDots`, `CarouselDot`) can go anywhere inside `Carousel`.
 *
 * @example
 * <Carousel options={{ loop: true, align: 'start' }}>
 *   <CarouselViewport>
 *     <CarouselWrapper>
 *       {slides.map((slide) => (
 *         <CarouselItem key={slide.id}>{slide.content}</CarouselItem>
 *       ))}
 *     </CarouselWrapper>
 *   </CarouselViewport>
 *   <CarouselPrevious>Prev</CarouselPrevious>
 *   <CarouselNext>Next</CarouselNext>
 *   <CarouselDots className="data-[selected=true]:bg-black">
 *     {(index) => index + 1}
 *   </CarouselDots>
 * </Carousel>
 */
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
  const [dots, setDots] = useState(0);
  const [selectedScrollSnap, setSelectedScrollSnap] = useState(0);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedScrollSnap(api.selectedScrollSnap());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const getDots = useCallback(() => {
    setDots(api?.scrollSnapList().length || 0);
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
    getDots();

    api.on('reInit', getDots);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, getDots, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        options,
        orientation:
          orientation || (options?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        scrollTo,
        dots,
        selectedScrollSnap,
      }}
    >
      <div
        data-komc
        role="region"
        aria-label="carousel"
        aria-roledescription="carousel"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={clsx('komc:relative', className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}
