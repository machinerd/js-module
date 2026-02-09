import { BottomAppBar } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';

interface Item {
  label: string;
  href: string;
}

const meta: Meta<typeof BottomAppBar<Item>> = {
  component: BottomAppBar,
  title: 'ui/bottom-app-bar',
  tags: ['ui', 'components'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Search', href: '/' },
      { label: 'Favorite', href: '/' },
      { label: 'Profile', href: '/' },
    ],
    render: (item: Item) => {
      return (
        <button
          type="button"
          className="komc:border-none komc:bg-white komc:cursor-pointer komc:hover:bg-neutral-50"
        >
          {item.label}
        </button>
      );
    },
  },
  render: (args) => {
    return (
      <div className='komc:flex komc:flex-col komc:w-full komc:h-screen bg-neutral-100 komc:overflow-hidden'>
        <div className='komc:flex-1 komc:bg-neutral-200'></div>
        <BottomAppBar {...args} />
      </div>
    );
  },
};
