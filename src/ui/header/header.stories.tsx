import { Header } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from '../footer';

const meta = {
  component: Header,
  title: 'ui/header',
  tags: ['ui', 'components'],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className='komc:flex komc:flex-col komc:w-full komc:h-full komc:relative'>
      <Header {...args} className='komc:bg-gray-300'>
        Sticky Header Section
      </Header>
      <main className='komc:flex komc:justify-center komc:p-40 komc:min-h-400 komc:bg-gray-100'>
        Main Section
      </main>
      <Footer className="komc:bg-neutral-400">
        Footer Layout
      </Footer>
    </div>
  )
};
