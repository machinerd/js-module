import StableText from './stable-text';
import type { Meta, StoryObj } from '@storybook/react-vite';

const sample = '동일한 문장 ABC 123';

const meta: Meta<typeof StableText> = {
  component: StableText,
  title: 'ui/StableText',
  tags: ['ui'],
  argTypes: {
    children: { control: 'text' },
    className: { control: 'text' },
  },
  args: {
    children: sample,
    className: 'komc:font-normal komc:text-base',
  },
  decorators: [
    (Story) => (
      <div className="komc:p-6 komc:min-w-[320px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function WeightRow({
  label,
  className,
  text = sample,
}: {
  label: string;
  className: string;
  text?: string;
}) {
  return (
    <div className="komc:flex komc:flex-col komc:gap-1">
      <span className="komc:text-xs komc:font-medium komc:text-neutral-500">
        {label}
      </span>
      <StableText className={className}>{text}</StableText>
    </div>
  );
}

export const FontWeights: Story = {
  name: 'font-weight 비교',
  render: () => (
    <div className="komc:flex komc:flex-col komc:gap-5 komc:text-lg">
      <WeightRow label="font-light" className="komc:font-light" />
      <WeightRow label="font-normal" className="komc:font-normal" />
      <WeightRow label="font-medium" className="komc:font-medium" />
      <WeightRow label="font-semibold" className="komc:font-semibold" />
      <WeightRow label="font-bold" className="komc:font-bold" />
      <WeightRow label="font-extrabold" className="komc:font-extrabold" />
      <WeightRow label="font-black" className="komc:font-black" />
    </div>
  ),
};

export const FontLight: Story = {
  name: 'font-light',
  args: { children: sample, className: 'komc:font-light komc:text-lg' },
};

export const FontNormal: Story = {
  name: 'font-normal',
  args: { children: sample, className: 'komc:font-normal komc:text-lg' },
};

export const FontBold: Story = {
  name: 'font-bold',
  args: { children: sample, className: 'komc:font-bold komc:text-lg' },
};
