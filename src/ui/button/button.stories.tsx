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
    variant: 'default',
    onClick: () => alert('button clicked'),
  },
};

export const Ghost: Story = {
  args: {
    children: 'Button',
    outline: 'clear',
    variant: 'ghost',
    onClick: () => alert('button clicked'),
  },
};

export const Blue: Story = {
  args: {
    children: 'Button',
    variant: 'blue',
    onClick: () => alert('button clicked'),
  },
};

export const Night: Story = {
  args: {
    children: 'Button',
    variant: 'night',
    onClick: () => alert('button clicked'),
  },
};

export const Charcoal: Story = {
  args: {
    children: 'Button',
    variant: 'charcoal',
    onClick: () => alert('button clicked'),
  },
};

export const Slate: Story = {
  args: {
    children: 'Button',
    variant: 'slate',
    onClick: () => alert('button clicked'),
  },
};

export const Red: Story = {
  args: {
    children: 'Button',
    variant: 'red',
    onClick: () => alert('button clicked'),
  },
};

export const Yellow: Story = {
  args: {
    children: 'Button',
    variant: 'yellow',
    onClick: () => alert('button clicked'),
  },
};

export const Black: Story = {
  args: {
    children: 'Button',
    variant: 'black',
    onClick: () => alert('button clicked'),
  },
};
