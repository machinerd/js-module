import { ConditionalWrapper } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const highlightWrapper = (children: React.ReactNode) => (
  <div className="komc:border-2 komc:border-blue-500 komc:bg-blue-50 komc:p-4 komc:rounded-lg">
    {children}
  </div>
);

const plainWrapper = (children: React.ReactNode) => (
  <div className="komc:border komc:border-neutral-200 komc:p-4 komc:rounded-md">
    {children}
  </div>
);

const meta = {
  component: ConditionalWrapper,
  title: 'ui/ConditionalWrapper',
  tags: ['ui'],
  argTypes: {
    condition: {
      control: 'boolean',
      description: 'true면 wrapper로 감쌉니다',
    },
    children: { control: 'text' },
    wrapper: { table: { disable: true } },
  },
  args: {
    condition: true,
    children: '감싸진 콘텐츠',
    wrapper: highlightWrapper,
  },
} satisfies Meta<typeof ConditionalWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PlainBorder: Story = {
  name: 'Plain border wrapper',
  args: {
    condition: true,
    children: '얇은 테두리 wrapper 예시',
  },
  render: (args) => (
    <ConditionalWrapper {...args} wrapper={plainWrapper}>
      {args.children}
    </ConditionalWrapper>
  ),
};

export const ConditionFalse: Story = {
  name: 'condition false',
  args: {
    condition: false,
    children: 'wrapper 없이 children만',
  },
};
