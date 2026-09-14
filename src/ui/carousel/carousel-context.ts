import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import React from 'react';

/** Embla carousel instance. `undefined` until the viewport mounts. */
export type CarouselApi = UseEmblaCarouselType[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
/** Embla options (`loop`, `align`, `slidesToScroll`, ...). */
export type CarouselOptions = UseCarouselParameters[0];
/** Embla plugins (e.g. `Autoplay()`). */
export type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps {
  /**
   * Embla options such as `loop`, `align`, `slidesToScroll`.
   * `axis` is ignored — use `orientation` instead.
   */
  options?: CarouselOptions;
  /** Embla plugins, e.g. `[Autoplay({ delay: 3000 })]`. */
  plugins?: CarouselPlugin;
  /**
   * Scroll direction. Also sets arrow-key navigation
   * (left/right or up/down) and slide spacing.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Receives the Embla API once it is ready, for controlling the carousel
   * from outside (e.g. `api.scrollTo(2)`).
   */
  setApi?: (api: CarouselApi) => void;
}

/** Value returned by {@link useCarousel}. */
export type CarouselContextProps = {
  /** Ref attached to the viewport element by `CarouselViewport`. */
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  /** Embla API. `undefined` until the viewport mounts. */
  api: ReturnType<typeof useEmblaCarousel>[1];
  /** Scroll to the previous snap. */
  scrollPrev: () => void;
  /** Scroll to the next snap. */
  scrollNext: () => void;
  /** Whether a previous snap exists. Used to disable `CarouselPrevious`. */
  canScrollPrev: boolean;
  /** Whether a next snap exists. Used to disable `CarouselNext`. */
  canScrollNext: boolean;
  /** Scroll to the snap at `index` (0-based). */
  scrollTo: (index: number) => void;
  /** Number of scroll snaps (pages), not slides. */
  dots: number;
  /** Index of the current snap (0-based). */
  selectedScrollSnap: number;
} & CarouselProps;

export const CarouselContext = React.createContext<CarouselContextProps | null>(
  null,
);

/**
 * Reads carousel state and controls. Use it to build custom navigation
 * or indicators.
 *
 * @throws If called outside `<Carousel>`.
 *
 * @example
 * const Counter = () => {
 *   const { selectedScrollSnap, dots } = useCarousel();
 *   return <span>{`${selectedScrollSnap + 1} / ${dots}`}</span>;
 * };
 */
export function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}
