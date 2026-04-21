import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
  CarouselWrapper,
} from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';

const SLIDE_COUNT = 8;

const btnClass =
  'komc:rounded-md komc:bg-neutral-100 komc:px-3 komc:py-2 hover:komc:bg-neutral-200';

const slideCardClass = clsx(
  'komc:flex komc:h-full komc:min-h-32 komc:items-center komc:justify-center',
  'komc:border komc:rounded-lg komc:border-neutral-300 komc:bg-neutral-100 komc:text-lg komc:font-medium',
);

function CarouselNav({
  orientation,
}: {
  orientation: 'horizontal' | 'vertical';
}) {
  const vertical = orientation === 'vertical';
  return (
    <div
      className={clsx(
        'komc:mt-3 komc:w-full komc:gap-2',
        vertical
          ? 'komc:flex komc:flex-col'
          : 'komc:flex komc:flex-row komc:justify-between',
      )}
    >
      <CarouselPrevious className={btnClass}>이전</CarouselPrevious>
      <CarouselNext className={btnClass}>다음</CarouselNext>
    </div>
  );
}

const meta = {
  component: Carousel,
  title: 'ui-client/Carousel',
  tags: ['ui-client'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    className: { control: 'text' },
    options: { table: { disable: true } },
    plugins: { table: { disable: true } },
    setApi: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
    options: {
      loop: true,
      align: 'start',
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

const storyDecorator: Story['decorators'] = [
  (Story) => (
    <div className="komc:p-4">
      <Story />
    </div>
  ),
];

/** 가로 · 한 번에 1장 */
export const HorizontalOneSlide: Story = {
  name: '가로 · 1장씩',
  parameters: { controls: { disable: true } },
  decorators: storyDecorator,
  render: () => (
    <Carousel
      orientation="horizontal"
      options={{ loop: true, align: 'start' }}
      className="komc:w-full komc:max-w-md komc:h-40"
    >
      <CarouselViewport>
        <CarouselWrapper>
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <CarouselItem key={index} className="komc:basis-full">
              <div className={slideCardClass}>{index + 1}</div>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </CarouselViewport>
      <CarouselNav orientation="horizontal" />
    </Carousel>
  ),
};

/** 가로 · 한 화면에 2장 */
export const HorizontalTwoSlides: Story = {
  name: '가로 · 2장 노출',
  parameters: { controls: { disable: true } },
  decorators: storyDecorator,
  render: () => (
    <Carousel
      orientation="horizontal"
      options={{ loop: true, align: 'start', slidesToScroll: 'auto' }}
      className="komc:w-full komc:max-w-md komc:h-40"
    >
      <CarouselViewport>
        <CarouselWrapper>
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <CarouselItem key={index} className="komc:basis-1/2!">
              <div className={slideCardClass}>{index + 1}</div>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </CarouselViewport>
      <CarouselNav orientation="horizontal" />
    </Carousel>
  ),
};

/** 세로 · 1장씩 · align start */
export const VerticalOneSlideStart: Story = {
  name: '세로 · 1장씩 (align start)',
  parameters: { controls: { disable: true } },
  decorators: storyDecorator,
  render: () => (
    <Carousel
      orientation="vertical"
      options={{ loop: true, align: 'start' }}
      className="komc:h-72 komc:w-full komc:max-w-md"
    >
      <CarouselViewport>
        <CarouselWrapper>
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <CarouselItem key={index} className="komc:basis-full">
              <div className={slideCardClass}>{index + 1}</div>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </CarouselViewport>
      <CarouselNav orientation="vertical" />
    </Carousel>
  ),
};

/** 세로 · 1장씩 · align center */
export const VerticalOneSlideCenter: Story = {
  name: '세로 · 1장씩 (align center)',
  parameters: { controls: { disable: true } },
  decorators: storyDecorator,
  render: () => (
    <Carousel
      orientation="vertical"
      options={{ loop: true, align: 'center' }}
      className="komc:h-72 komc:w-full komc:max-w-md"
    >
      <CarouselViewport>
        <CarouselWrapper>
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <CarouselItem key={index} className="komc:basis-1/2!">
              <div className={slideCardClass}>{index + 1}</div>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </CarouselViewport>
      <CarouselNav orientation="vertical" />
    </Carousel>
  ),
};
