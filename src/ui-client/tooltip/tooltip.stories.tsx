import { Tooltip } from '.';
import type { TooltipPlacement } from './tooltip-container';
import type { Meta, StoryObj } from '@storybook/react-vite';

const PLACEMENTS: TooltipPlacement[] = [
  'top',
  'bottom',
  'top-start',
  'top-end',
  'bottom-start',
  'bottom-end',
];

const meta = {
  component: Tooltip,
  title: 'ui-client/Tooltip',
  tags: ['ui-client'],
  argTypes: {
    content: { control: 'text' },
    children: { control: 'text', description: '트리거 버튼 라벨' },
    placement: {
      control: 'select',
      options: PLACEMENTS,
    },
    defaultOpen: { control: 'boolean' },
    className: { control: 'text' },
  },
  args: {
    content: '툴팁 본문입니다. 바깥을 클릭하면 닫힙니다.',
    children: '트리거',
    placement: 'top' satisfies TooltipPlacement,
    defaultOpen: false,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const { children, ...tooltipProps } = args;
    return (
      <div className="komc:flex komc:items-center komc:justify-center komc:min-h-56 komc:w-full komc:max-w-2xl komc:mx-auto komc:bg-neutral-100 komc:rounded-xl komc:p-8">
        <Tooltip {...tooltipProps}>
          <button
            type="button"
            className="komc:px-4 komc:py-2 komc:bg-white komc:rounded-lg komc:border komc:border-neutral-200 komc:shadow-sm hover:komc:bg-neutral-50"
          >
            {children}
          </button>
        </Tooltip>
      </div>
    );
  },
};

export const PlacementGrid: Story = {
  name: '배치 미리보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="komc:grid komc:grid-cols-2 sm:komc:grid-cols-3 md:komc:grid-cols-4 komc:gap-6 komc:p-6 komc:bg-neutral-50 komc:rounded-xl komc:min-h-96 komc:items-center komc:justify-items-center">
      {PLACEMENTS.map((placement) => (
        <div key={placement} className="komc:flex komc:items-center komc:justify-center komc:min-h-16 komc:w-full">
          <Tooltip content={`placement: ${placement}`} placement={placement} defaultOpen={false}>
            <button
              type="button"
              className="komc:text-xs komc:px-2 komc:py-1 komc:bg-white komc:rounded komc:border komc:border-neutral-200"
            >
              {placement}
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};
