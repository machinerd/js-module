import { Layout } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from '../footer';
import { Header } from '../header';

const meta = {
  component: Layout,
  title: 'ui/layout',
  tags: ['ui', 'components'],
  argTypes: {
    type: {
      control: 'select',
      options: ['main', 'content'],
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Layout type="main" className="komc:bg-neutral-200">
      <Header className="komc:bg-neutral-400!">
        Header Section
      </Header>
      Main Section
      <Layout type="content" className="komc:bg-neutral-300">
        <div className="komc:h-screen">
          Content Layout
        </div>
      </Layout>
      <Footer {...args} className="komc:bg-neutral-400! komc:border-red-500">
        Footer Layout
      </Footer>
    </Layout>
  )
};
