import { BottomAppBar } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface DemoItem {
  label: string;
  href: string;
}

const defaultLabels = ['홈', '검색', '즐겨찾기', '프로필', '알림', '설정', '더보기', '닫기'];

function itemsForCount(count: number): DemoItem[] {
  return Array.from({ length: count }, (_, i) => ({
    label: defaultLabels[i] ?? `항목 ${i + 1}`,
    href: '#',
  }));
}

interface BottomAppBarDemoProps {
  itemCount: number;
  className?: string;
}

function BottomAppBarDemo({ itemCount, className }: BottomAppBarDemoProps) {
  const items = itemsForCount(Math.min(8, Math.max(2, itemCount)));
  return (
    <div className="komc:relative komc:min-h-48 komc:border komc:border-dashed komc:border-neutral-300 komc:rounded-lg komc:overflow-hidden">
      <div className="komc:p-4 komc:text-sm komc:text-neutral-500">하단 고정 바 미리보기</div>
      <BottomAppBar
        className={className}
        items={items}
        render={(item) => (
          <button
            type="button"
            className="komc:flex komc:flex-col komc:items-center komc:justify-center komc:w-full komc:h-full komc:border-none komc:bg-white komc:text-sm komc:cursor-pointer hover:komc:bg-neutral-50"
          >
            {item.label}
          </button>
        )}
      />
    </div>
  );
}

const meta = {
  component: BottomAppBarDemo,
  title: 'ui/BottomAppBar',
  tags: ['ui'],
  parameters: {
    docs: {
      description: {
        component:
          '실제 사용 시에는 `BottomAppBar`에 `items`와 `render`를 넘깁니다. 아래 컨트롤의 `itemCount`는 스토리 데모 전용입니다.',
      },
    },
  },
  argTypes: {
    itemCount: {
      control: { type: 'number', min: 2, max: 8, step: 1 },
      description: '데모: 탭 개수',
    },
    className: { control: 'text' },
  },
  args: {
    itemCount: 4,
  },
} satisfies Meta<typeof BottomAppBarDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
