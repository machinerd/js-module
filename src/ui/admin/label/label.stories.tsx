import {
  faChevronDown,
  faChevronUp,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { Label } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Label,
  title: 'ui/admin/Label',
  tags: ['ui'],
  argTypes: {
    text: { control: 'text' },
    helpText: { control: 'text' },
    required: { control: 'boolean' },
    defaultCollapsed: { control: 'boolean' },
    collapse: { control: false },
    actions: { control: false },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    helpTextColor: {
      control: 'select',
      options: ['default', 'primary', 'warning', 'error'],
    },
  },
  args: {
    id: 'name',
    text: '이름',
    helpText: '실명을 입력하세요',
    required: false,
    defaultCollapsed: true,
    gap: 'sm',
    helpTextColor: 'default',
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="komc:max-w-md komc:p-6">
      <Label {...args} helpTextPrefixIcon={faCircleInfo}>
        <input
          id={args.id}
          className="komc:h-9 komc:px-3 komc:border komc:border-neutral-300 komc:rounded-sm"
          placeholder="홍길동"
        />
      </Label>
    </div>
  ),
};

export const WithCollapse: Story = {
  render: (args) => (
    <div className="komc:max-w-md komc:p-6">
      <Label
        {...args}
        helpTextPrefixIcon={faCircleInfo}
        collapse={(isCollapsed) => (isCollapsed ? faChevronUp : faChevronDown)}
      >
        <input
          id={args.id}
          className="komc:h-9 komc:px-3 komc:border komc:border-neutral-300 komc:rounded-sm"
          placeholder="홍길동"
        />
      </Label>
    </div>
  ),
};
