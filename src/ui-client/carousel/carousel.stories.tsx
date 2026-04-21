import {
  Carousel,
  CarouselDot,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselWrapper,
} from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';

type CarouselStoryArgs = React.ComponentProps<typeof Carousel> & {
  loop: boolean;
  align: 'start' | 'center' | 'end';
  slideCount: number;
};

const meta = {
  component: Carousel,
  title: 'ui-client/Carousel',
  tags: ['ui-client'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    loop: {
      control: 'boolean',
      description: 'Embla `options.loop`',
      table: { category: 'Embla' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Embla `options.align`',
      table: { category: 'Embla' },
    },
    slideCount: {
      control: { type: 'number', min: 2, max: 12, step: 1 },
      description: '데모 슬라이드 개수',
      table: { category: 'Story' },
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
      align: 'center',
    }
  },
} satisfies Meta<CarouselStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const { orientation, options, className, ...rest } = args;
    const count = Math.min(12, Math.max(2, 5));
    return (
      <Carousel
        {...rest}
        orientation={orientation}
        options={options}
        className={clsx(
          'komc:w-full komc:max-w-md',
          orientation === 'vertical' ? 'komc:h-56' : 'komc:h-40',
          className,
        )}
      >
        <CarouselWrapper>
          {Array.from({ length: count }).map((_, index) => (
            <CarouselItem key={index} className="komc:basis-1/2!">
              <div
                className={clsx(
                  'komc:flex komc:h-full komc:min-h-32 komc:items-center komc:justify-center',
                  'komc:border komc:rounded-lg komc:border-neutral-300 komc:bg-neutral-100 komc:text-lg komc:font-medium',
                )}
              >
                {index + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselWrapper>
        <div className="komc:flex komc:justify-between komc:gap-2 komc:mt-3 komc:w-full">
          <CarouselPrevious className="komc:rounded-md komc:bg-neutral-100 komc:px-3 komc:py-2 hover:komc:bg-neutral-200">
            이전
          </CarouselPrevious>
          <CarouselNext className="komc:rounded-md komc:bg-neutral-100 komc:px-3 komc:py-2 hover:komc:bg-neutral-200">
            다음
          </CarouselNext>
        </div>
        <div className='komc:flex komc:justify-center komc:gap-1.5 komc:w-full komc:mt-2'>
          <CarouselDots className="komc:flex komc:justify-center komc:items-center komc:w-4 komc:aspect-square komc:rounded-full komc:bg-neutral-300 komc:text-xs komc:font-medium komc:text-neutral-600 komc:data-[selected=true]:bg-blue-500 komc:data-[selected=true]:text-white">
            {(index) => {
              return (
                <span>{index + 1}</span>
              )
            }}
          </CarouselDots>
        </div>
        <div className='komc:flex komc:justify-center komc:gap-1.5 komc:w-full komc:mt-2'>
          <CarouselDots className="komc:flex komc:justify-center komc:items-center komc:w-4 komc:aspect-square komc:rounded-full komc:bg-neutral-300 komc:text-xs komc:font-medium komc:text-neutral-600 komc:data-[selected=true]:bg-blue-500 komc:data-[selected=true]:text-white" />
        </div>
        <div className='komc:flex komc:justify-center komc:gap-1.5 komc:w-full komc:mt-2'>
          {Array.from({ length: count }).map((_, i) => {
            return (
              <CarouselDot key={i} index={i} className='komc:flex komc:justify-center komc:items-center komc:w-4 komc:aspect-square komc:rounded-full komc:bg-neutral-300 komc:text-xs komc:font-medium komc:text-neutral-600 komc:data-[selected=true]:bg-blue-500 komc:data-[selected=true]:text-white'>
                {i + 1}
              </CarouselDot>
            )
          })}
        </div>
      </Carousel>
    );
  },
  decorators: [
    (Story) => (
      <div className="komc:p-4">
        <Story />
      </div>
    ),
  ],
};
