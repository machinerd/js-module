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
};
