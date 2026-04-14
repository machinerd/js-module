import { Skeleton } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'ui/Skeleton',
  tags: ['ui'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'square', 'full'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
    },
    width: {
      control: 'text',
      description: 'CSS 길이 문자열 또는 숫자(px)',
    },
    height: {
      control: 'text',
      description: 'CSS 길이 문자열 또는 숫자(px)',
    },
    className: { control: 'text' },
  },
  args: {
    size: 'sm',
    rounded: 'sm',
    width: 200,
    height: undefined,
  },
  decorators: [
    (Story) => (
      <div className="komc:p-4 komc:max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CardPlaceholder: Story = {
  name: '카드형 플레이스홀더',
  args: {
    size: 'md',
    rounded: 'lg',
    width: '100%',
    height: 120,
  },
};

export const AvatarPlaceholder: Story = {
  name: '아바타형',
  args: {
    size: 'square',
    rounded: 'full',
    width: 48,
    height: 48,
  },
};
