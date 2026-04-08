import Image from './image';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Image> = {
  component: Image,
  title: 'ui-client/Image',
  tags: ['ui-client'],
};

export default meta;

type Story = StoryObj<typeof Image>;

export const UsageGuide: Story = {
  name: '문서',
  tags: ['docs-only'],
  render: () => <></>,
};
