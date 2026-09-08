import { ApiClientProvider } from '../../providers/api-client';
import Image from './image';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Image,
  title: 'ui-client/Image',
  tags: ['ui-client'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    originalWidth: { control: 'number' },
  },
  args: {
    src: 'https://picsum.photos/id/1015/600/400',
    alt: '데모 이미지',
    width: 300,
    height: 200,
    originalWidth: 600,
  },
} satisfies Meta<typeof Image>;

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
      <div className="komc:p-6 komc:w-[300px] komc:h-[200px]">
        <Image {...args} />
      </div>
    </ApiClientProvider>
  ),
};
