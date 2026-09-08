import { EmailField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/EmailField',
  tags: ['ui'],
  args: {
    placeholder: 'example@example.com',
    defaultValue: 'demo@example.com',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="komc:max-w-md komc:p-6">
      <EmailField
        label={{ text: '이메일' }}
        placeholder={args.placeholder as string}
        defaultValue={args.defaultValue as string}
      />
    </div>
  ),
};
