import { CountryFlag } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: CountryFlag,
  title: 'ui/CountryFlag',
  tags: ['ui'],
  argTypes: {
    countryCode: { control: 'text' },
  },
  args: {
    countryCode: 'KR',
  },
} satisfies Meta<typeof CountryFlag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
