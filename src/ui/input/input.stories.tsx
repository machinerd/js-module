import { Input } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const prefixNode = (
  <span className="komc:bg-neutral-100 komc:rounded-md komc:px-2 komc:py-1 komc:text-xs komc:text-neutral-600">
    Prefix
  </span>
);
const suffixNode = (
  <span className="komc:bg-neutral-100 komc:rounded-md komc:px-2 komc:py-1 komc:text-xs komc:text-neutral-600">
    Suffix
  </span>
);

const meta = {
  component: Input,
  title: 'ui/Input',
  tags: ['ui'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    defaultValue: { control: 'text' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    outline: {
      control: 'select',
      options: ['line', 'solid', 'clear', 'dashed', 'dotted'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    className: { control: 'text' },
    prefix: { table: { disable: true } },
    surffix: { table: { disable: true } },
  },
  args: {
    placeholder: '입력하세요',
    size: 'lg',
    gap: 'xl',
    outline: 'line',
    rounded: 'lg',
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithPrefix: Story = {
  name: 'Prefix',
  args: {
    placeholder: '검색',
  },
  render: (args) => <Input {...args} prefix={prefixNode} />,
};

export const WithPrefixAndSuffix: Story = {
  name: 'Prefix + Suffix',
  args: {
    placeholder: '검색',
  },
  render: (args) => (
    <Input {...args} prefix={prefixNode} surffix={suffixNode} />
  ),
};
