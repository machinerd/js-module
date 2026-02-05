import { Header } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Layout } from '../layout';
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
    <Layout type="main" className="komc:bg-neutral-200">
      <Header {...args} className="komc:bg-neutral-400!">
        Header Section
      </Header>
      Main Section
      <Layout type="content" className="komc:bg-neutral-300">
        <div className="komc:h-screen">
          Content Layout
        </div>
      </Layout>
      <Footer className="komc:bg-neutral-400! komc:border-red-500">
        Footer Layout
      </Footer>
    </Layout>
  )
};
