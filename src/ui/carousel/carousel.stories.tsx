import { Carousel, CarouselItem, CarouselNext, CarouselPrevious, CarouselWrapper } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';

const meta = {
  component: Carousel,
  title: 'ui/carousel',
  tags: ['ui', 'components'],
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: {
      loop: true,
    },
  },
  render: (args) => {
    return (
      <Carousel {...args} orientation="horizontal" className="komc:w-full komc:h-50 komc:max-w-sm">
        <CarouselWrapper>
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <CarouselItem key={index}>
                <div
                  className={clsx(
                    'komc:flex komc:h-full komc:items-center komc:justify-center',
                    'komc:border komc:rounded-lg komc:border-black komc:bg-neutral-100',
                  )}
                >
                  {index}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselWrapper>
        <div className="komc:flex komc:justify-between komc:gap-1 komc:w-full komc:mt-1">
          <CarouselPrevious className="komc:bg-neutral-100 komc:hover:bg-neutral-200 komc:p-2 komc:rounded-md">
            Prev
          </CarouselPrevious>
          <CarouselNext className="komc:bg-neutral-100 komc:hover:bg-neutral-200 komc:p-2 komc:rounded-md">
            Next
          </CarouselNext>
        </div>
      </Carousel>
    );
  }
};
