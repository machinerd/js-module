import { TextareaField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: TextareaField,
  title: 'ui/admin/TextareaField',
  tags: ['ui'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    resize: {
      control: 'select',
      options: ['none', 'auto'],
    },
  },
  args: {
    placeholder: '소개를 입력하세요',
    disabled: false,
    size: 'lg',
    resize: 'auto',
    defaultValue: '가상 소개 문구입니다.',
  },
} satisfies Meta<typeof TextareaField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="komc:max-w-md komc:p-6">
      <TextareaField {...args} label={{ text: '소개' }} />
    </div>
  ),
};
