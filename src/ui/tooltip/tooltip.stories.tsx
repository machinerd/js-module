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
            className="komc:px-4 komc:py-2 komc:bg-white komc:rounded-lg komc:border komc:border-neutral-200 komc:shadow-sm komc:hover:bg-neutral-50"
          >
            {children}
          </button>
        </Tooltip>
      </div>
    );
  },
};

const slideUpKeyframes = `
@keyframes tooltip-story-slide-up {
  from {
    transform: translateY(28px);
    opacity: 0.75;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

export const AfterSlideUpAnimation: Story = {
  name: '슬라이드 업 애니메이션 후 툴팁',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '아래에서 위로 살짝 올라오는 애니메이션이 끝난 뒤 트리거에 호버해 툴팁 위치가 맞는지 확인합니다. (애니메이션 중에는 세로만 어긋날 수 있음)',
      },
    },
  },
  render: () => (
    <>
      <style>{`${slideUpKeyframes}
        .tooltip-story-slide-up {
          animation: tooltip-story-slide-up 0.85s ease-out forwards;
        }
      `}</style>
      <div className="komc:flex komc:min-h-96 komc:w-full komc:items-center komc:justify-center komc:bg-neutral-100 komc:rounded-xl komc:p-10">
        <div className="tooltip-story-slide-up komc:w-fit">
          <Tooltip
            content="슬라이드 업이 끝난 뒤 이 툴팁이 트리거에 맞게 보이는지 확인하세요."
            placement="top"
          >
            <button
              type="button"
              className="komc:px-4 komc:py-2 komc:bg-white komc:rounded-lg komc:border komc:border-neutral-200 komc:shadow-sm komc:hover:bg-neutral-50"
            >
              호버하여 툴팁
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  ),
};

export const LongScrollPage: Story = {
  name: '긴 페이지 스크롤',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story:
          '세로로 긴 페이지를 스크롤하며 위·아래 각 트리거에 호버해, 스크롤 위치와 관계없이 툴팁이 올바르게 따라오는지 확인합니다.',
      },
    },
  },
  render: () => (
    <div className="komc:w-full komc:bg-neutral-100 komc:pb-32">
      <div className="komc:sticky komc:top-0 komc:z-10 komc:border-b komc:border-neutral-200 komc:bg-neutral-100/95 komc:px-6 komc:py-4 komc:backdrop-blur-sm">
        <p className="komc:mx-auto komc:max-w-2xl komc:text-sm komc:text-neutral-600">
          아래로 스크롤한 뒤 하단 블록의 버튼에 호버해 보세요.{' '}
          <span className="komc:text-neutral-800 komc:font-medium">
            window 스크롤 시 툴팁 위치 갱신
          </span>
          동작을 확인할 수 있습니다.
        </p>
      </div>
      <div className="komc:mx-auto komc:flex komc:max-w-2xl komc:flex-col">
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="komc:flex komc:min-h-[28vh] komc:items-center komc:justify-center komc:border-b komc:border-neutral-200/60 komc:px-4"
          >
            <Tooltip
              content={`${i + 1}번째 블록 — placement: top · 스크롤 후에도 트리거 옆에 맞는지 확인하세요.`}
              placement="top"
            >
              <button
                type="button"
                className="komc:px-4 komc:py-2 komc:bg-white komc:rounded-lg komc:border komc:border-neutral-200 komc:shadow-sm komc:hover:bg-neutral-50"
              >
                블록 {i + 1} · 호버
              </button>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const PlacementGrid: Story = {
  name: '배치 미리보기',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="komc:grid komc:grid-cols-2 komc:sm:grid-cols-3 komc:md:grid-cols-4 komc:gap-6 komc:p-6 komc:bg-neutral-50 komc:rounded-xl komc:min-h-96 komc:items-center komc:justify-items-center">
      {PLACEMENTS.map((placement) => (
        <div
          key={placement}
          className="komc:flex komc:items-center komc:justify-center komc:min-h-16 komc:w-full"
        >
          <Tooltip
            content={`placement: ${placement}`}
            placement={placement}
            defaultOpen={false}
          >
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
