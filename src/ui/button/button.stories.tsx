import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const outlineOptions = ['line', 'solid', 'clear'] as const;
const variantLine = [
  'blue',
  'duo',
  'white',
  'gray',
  'neutral',
  'sky',
  'sky-blue',
] as const;
const variantSolid = [
  'white',
  'gray',
  'blue',
  'night',
  'black',
  'sky',
  'sky-blue',
  'indigo',
] as const;
const variantClear = ['gray', 'sky'] as const;
const allVariants = [
  ...new Set([...variantLine, ...variantSolid, ...variantClear]),
];

const meta = {
  component: Button,
  title: 'ui/Button',
  tags: ['ui'],
  argTypes: {
    children: { control: 'text', description: '버튼 라벨' },
    disabled: { control: 'boolean' },
    asChild: {
      control: 'boolean',
      description: 'true면 Slot으로 자식 요소에 스타일만 전달',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    outline: {
      control: 'select',
      options: outlineOptions,
    },
    variant: {
      control: 'select',
      options: allVariants,
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    px: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
    },
    className: { control: 'text' },
  },
  args: {
    children: 'Button',
    disabled: false,
    asChild: false,
    type: 'button' as const,
    outline: 'line',
    variant: 'blue',
    size: 'md',
    shadow: 'none',
    px: '2xl',
    rounded: 'sm',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AsLink: Story = {
  name: 'asChild 링크',
  args: {
    asChild: true,
    outline: 'solid',
    variant: 'sky',
    children: undefined,
  },
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        외부 링크
      </a>
    </Button>
  ),
  argTypes: {
    children: { table: { disable: true } },
    asChild: { table: { disable: true } },
  },
};

export const VariantsGallery: Story = {
  name: '조합 갤러리',
  parameters: {
    controls: { disable: true },
  },
  args: {
    children: '라벨',
    disabled: false,
  },
  render: (args) => (
    <div className="komc:flex komc:flex-col komc:gap-6">
      <section>
        <h4 className="komc:mb-2 komc:font-semibold">outline: line</h4>
        <div className="komc:grid komc:grid-cols-2 komc:md:grid-cols-4 komc:lg:grid-cols-5 komc:gap-3 komc:w-full">
          {variantLine.map((v) => (
            <Button key={v} {...args} outline="line" variant={v}>
              {v}
            </Button>
          ))}
        </div>
      </section>
      <section>
        <h4 className="komc:mb-2 komc:font-semibold">outline: solid</h4>
        <div className="komc:grid komc:grid-cols-2 komc:md:grid-cols-4 komc:gap-3 komc:w-full">
          {variantSolid.map((v) => (
            <Button key={v} {...args} outline="solid" variant={v}>
              {v}
            </Button>
          ))}
        </div>
      </section>
      <section>
        <h4 className="komc:mb-2 komc:font-semibold">outline: clear</h4>
        <div className="komc:flex komc:flex-wrap komc:gap-3">
          {variantClear.map((v) => (
            <Button key={v} {...args} outline="clear" variant={v}>
              {v}
            </Button>
          ))}
        </div>
      </section>
    </div>
  ),
};
