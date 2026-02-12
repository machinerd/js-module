import { Footer } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from '../header';

const meta = {
  component: Footer,
  title: 'ui/footer',
  tags: ['ui', 'components'],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className='komc:flex komc:flex-col komc:w-full komc:h-full komc:relative'>
      <Header className='komc:bg-gray-300'>
        Sticky Header Section
      </Header>
      <main className='komc:flex komc:justify-center komc:p-40 komc:min-h-400 komc:bg-gray-100'>
        Main Section
      </main>
      <Footer {...args} className="komc:bg-neutral-400">
        Footer Layout
      </Footer>
    </div>
  ),
};
