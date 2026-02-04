import { ConditionalWrapper } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: ConditionalWrapper,
  title: 'ui/conditional-wrapper',
  tags: ['ui', 'components'],
  argTypes: {
    condition: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ConditionalWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const True: Story = {
  args: {
    condition: true,
    wrapper: (children) => (
      <div className="komc:bg-blue-500 komc:text-white komc:p-4 komc:rounded-md">
        {children}
      </div>
    ),
    children: <div>Hello</div>,
  },
};

export const False: Story = {
  args: {
    condition: false,
    wrapper: (children) => <div>{children}</div>,
    children: <div>Hello</div>,
  },
};
