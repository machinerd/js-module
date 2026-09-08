import { UrlField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/UrlField',
  tags: ['ui'],
  args: {
    placeholder: 'https://example.com',
    defaultValue: 'https://example.com',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="komc:max-w-md komc:p-6">
      <UrlField
        label={{ text: 'URL' }}
        placeholder={args.placeholder as string}
        defaultValue={args.defaultValue as string}
      />
    </div>
  ),
};
