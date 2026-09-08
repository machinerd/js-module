import { ConditionalEitherWrapper } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const trueWrapper = (children: React.ReactNode) => (
  <div className="komc:border-2 komc:border-blue-500 komc:bg-blue-50 komc:p-4 komc:rounded-lg">
    {children}
  </div>
);

const falseWrapper = (children: React.ReactNode) => (
  <div className="komc:border komc:border-neutral-200 komc:p-4 komc:rounded-md">
    {children}
  </div>
);

const meta = {
  component: ConditionalEitherWrapper,
  title: 'ui/ConditionalEitherWrapper',
  tags: ['ui'],
  argTypes: {
    condition: { control: 'boolean' },
    children: { control: 'text' },
    trueWrapper: { table: { disable: true } },
    falseWrapper: { table: { disable: true } },
  },
  args: {
    condition: true,
    children: '조건에 따라 다른 wrapper',
    trueWrapper,
    falseWrapper,
  },
} satisfies Meta<typeof ConditionalEitherWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
