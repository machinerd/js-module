import { Button } from '.';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Button,
  title: 'ui/button',
  tags: ['ui', 'components'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    outline: 'line',
    variant: 'gray',
  },
  render: (args) => {
    return (
      <div className='komc:flex komc:flex-col komc:gap-4'>
        <h4>{'outline: line'}</h4>
        <div className='komc:grid komc:grid-cols-5 komc:gap-4 komc:w-full'>
          <Button {...args} outline='line' variant='blue' />
          <Button {...args} outline='line' variant='duo' />
          <Button {...args} outline='line' variant='white' />
          <Button {...args} outline='line' variant='gray' />
          <Button {...args} outline='line' variant='neutral' />
        </div>
        <h4>{'outline: solid'}</h4>
        <div className='komc:grid komc:grid-cols-5 komc:gap-4 komc:w-full'>
          <Button {...args} outline='solid' variant='white' />
          <Button {...args} outline='solid' variant='gray' />
          <Button {...args} outline='solid' variant='blue' />
          <Button {...args} outline='solid' variant='night' />
          <Button {...args} outline='solid' variant='black' />
          <Button {...args} outline='solid' variant='sky' />
          <Button {...args} outline='solid' variant='sky-blue' />
          <Button {...args} outline='solid' variant='indigo' />
        </div>
        <h4>{'outline: clear'}</h4>
        <div className='komc:grid komc:grid-cols-5 komc:gap-4 komc:w-full'>
          <Button {...args} outline='clear' variant='gray' />
          <Button {...args} outline='clear' variant='sky' />
        </div>
        <h4>{'Slot asChild (Button as a link)'}</h4>
        <div className='komc:grid komc:grid-cols-5 komc:gap-4 komc:w-full'>
          <Button {...args} outline="solid" variant="sky" asChild>
            <a href='https://www.google.com' target='_blank' rel='noopener noreferrer'>Google</a>
          </Button>
        </div>
      </div>
    );
  },
};
