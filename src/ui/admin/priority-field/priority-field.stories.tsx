import { ApiClientProvider } from '../../../providers/api-client';
import { PriorityField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/PriorityField',
  tags: ['ui'],
  argTypes: {
    dataType: {
      control: 'select',
      options: ['1', '2', '3'],
    },
  },
  args: {
    dataType: '1',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ApiClientProvider
      config={{
        apiEndpoint: 'https://example.com',
        cdnEndpoint: 'https://cdn.example.com',
      }}
    >
      <div className="komc:max-w-md komc:p-6">
        <PriorityField
          dataType={args.dataType as '1' | '2' | '3'}
          label={{ text: '우선순위' }}
          defaultValue={1}
        />
      </div>
    </ApiClientProvider>
  ),
};
