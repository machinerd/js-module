import { Tooltip } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Tooltip,
  title: 'ui/tooltip',
  tags: ['ui', 'components'],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    children: 'hover me',
    placement: 'top',
    className: 'komc:bg-black! komc:text-white komc:rounded-md komc:text-xs',
  },
  render: (args) => {
    return (
      <div className="komc:grid komc:grid-cols-4 komc:w-full komc:h-400 komc:bg-gray-100">
        {Array.from({ length: 32 }).map((_, index) => (
          <div key={index} className="komc:xl:p-10 komc:p-4 komc:w-fit">
            <Tooltip {...args} />
          </div>
        ))}
      </div>
    );
  },
}
