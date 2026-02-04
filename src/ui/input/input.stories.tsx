import { Input } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Input,
  title: 'ui/input',
  tags: ['ui', 'components'],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Input',
    className: 'komc:focus:border-neutral-300',
  },
};

export const Prefix: Story = {
  args: {
    placeholder: 'Search',
    prefix: (
      <div className="komc:bg-neutral-100 komc:rounded-md komc:p-1 komc:px-2 komc:text-xs">
        Prefix
      </div>
    ),
  },
};

export const Surffix: Story = {
  args: {
    placeholder: 'Search',
    prefix: (
      <div className="komc:bg-neutral-100 komc:rounded-md komc:p-1 komc:px-2 komc:text-xs">
        Prefix
      </div>
    ),
    surffix: (
      <div className="komc:bg-neutral-100 komc:rounded-md komc:p-1 komc:px-2 komc:text-xs">
        Surffix
      </div>
    ),
  },
};
