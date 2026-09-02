import { useState } from 'react';
import { Switch } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Switch,
  title: 'ui/Switch',
  tags: ['ui'],
  argTypes: {
    label: { control: 'text' },
    placement: {
      control: 'select',
      options: ['end', 'start', 'top', 'bottom'],
    },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: '알림 받기',
    placement: 'end',
    disabled: false,
    checked: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(args.checked ?? false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
};
