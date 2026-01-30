import { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '.';

const meta = {
  component: Skeleton,
  title: 'ui/skeleton',
  tags: ['ui', 'components'],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'sm',
    rounded: 'sm',
  },
};
