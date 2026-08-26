/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { Button } from '../button';
import Sheet from './sheet';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Sheet> = {
  component: Sheet,
  title: 'ui-client/Sheet',
  tags: ['ui-client'],
  argTypes: {
    isOpen: { table: { disable: true } },
    onClose: { table: { disable: true } },
    children: { table: { disable: true } },
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    size: {
      control: 'select',
      options: ['full', 'half', 'auto'],
    },
    closeOnBackdropClick: { control: 'boolean' },
    zIndex: { control: 'number' },
    className: { control: 'text' },
  },
  args: {
    direction: 'bottom',
    size: 'half',
    closeOnBackdropClick: true,
    zIndex: 1001,
    className: '',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function SheetPanel({
  onClose,
  label,
}: {
  onClose: () => void;
  label?: string;
}) {
  return (
    <div className="komc:p-4 komc:flex komc:flex-col komc:gap-3 komc:h-full komc:min-h-0 komc:overflow-auto">
      <div className="komc:flex komc:justify-between komc:items-center komc:gap-2">
        <h2 className="komc:text-lg komc:font-semibold">{label ?? 'Sheet'}</h2>
        <Button
          type="button"
          outline="line"
          variant="gray"
          size="sm"
          onClick={onClose}
        >
          닫기
        </Button>
      </div>
      <p className="komc:text-sm komc:text-neutral-600">
        화면 가장자리에서 슬라이드되는 패널입니다. 배경을 누르거나 Esc로 닫을 수
        있습니다.
      </p>
    </div>
  );
}

export const UsageGuide: Story = {
  name: '문서',
  tags: ['docs-only'],
  render: () => <></>,
};

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="komc:min-h-screen komc:w-full komc:bg-neutral-100 komc:p-8">
        <div className="komc:flex komc:justify-center komc:items-start">
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="md"
            onClick={() => setOpen(true)}
          >
            Sheet 열기
          </Button>
        </div>
        <Sheet {...args} isOpen={open} onClose={() => setOpen(false)}>
          <SheetPanel onClose={() => setOpen(false)} />
        </Sheet>
      </div>
    );
  },
};

export const SizeFull: Story = {
  name: '크기 · full',
  args: {
    direction: 'bottom',
    size: 'full',
    className: '',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="komc:min-h-screen komc:w-full komc:bg-neutral-100 komc:p-8">
        <div className="komc:flex komc:flex-col komc:items-center komc:gap-2">
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="md"
            onClick={() => setOpen(true)}
          >
            full 높이 Sheet 열기
          </Button>
          <p className="komc:text-xs komc:text-neutral-500">
            size=&quot;full&quot; — 하단(또는 상단) 축으로 뷰포트 높이를
            채웁니다.
          </p>
        </div>
        <Sheet {...args} isOpen={open} onClose={() => setOpen(false)}>
          <SheetPanel label="size=full" onClose={() => setOpen(false)} />
        </Sheet>
      </div>
    );
  },
};

export const SizeCustom320: Story = {
  name: '크기 · 커스텀 320px',
  args: {
    direction: 'right',
    size: 'auto',
    className: 'komc:w-[320px] komc:max-w-[320px] komc:shrink-0',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="komc:min-h-screen komc:w-full komc:bg-neutral-100 komc:p-8">
        <div className="komc:flex komc:flex-col komc:items-center komc:gap-2">
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="md"
            onClick={() => setOpen(true)}
          >
            320px 너비 Sheet 열기
          </Button>
          <p className="komc:text-xs komc:text-neutral-500">
            size=&quot;auto&quot;에{' '}
            <code className="komc:font-mono komc:text-xs">className</code>으로
            너비를 고정한 예입니다.
          </p>
        </div>
        <Sheet {...args} isOpen={open} onClose={() => setOpen(false)}>
          <SheetPanel label="우측 · 320px" onClose={() => setOpen(false)} />
        </Sheet>
      </div>
    );
  },
};

export const Directions: Story = {
  name: '방향별',
  render: () => {
    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<
      'top' | 'bottom' | 'left' | 'right'
    >('bottom');

    const openToward = (d: typeof direction) => {
      setDirection(d);
      setOpen(true);
    };

    return (
      <div className="komc:min-h-screen komc:w-full komc:bg-neutral-100 komc:p-8">
        <div className="komc:flex komc:flex-wrap komc:justify-center komc:gap-2">
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="sm"
            onClick={() => openToward('top')}
          >
            위
          </Button>
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="sm"
            onClick={() => openToward('bottom')}
          >
            아래
          </Button>
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="sm"
            onClick={() => openToward('left')}
          >
            왼쪽
          </Button>
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="sm"
            onClick={() => openToward('right')}
          >
            오른쪽
          </Button>
        </div>
        <Sheet
          direction={direction}
          size="half"
          isOpen={open}
          onClose={() => setOpen(false)}
        >
          <SheetPanel
            label={`방향: ${direction}`}
            onClose={() => setOpen(false)}
          />
        </Sheet>
      </div>
    );
  },
};

export const NoBackdropClose: Story = {
  name: '배경 클릭으로 닫기 비활성',
  args: {
    closeOnBackdropClick: false,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="komc:min-h-screen komc:w-full komc:bg-neutral-100 komc:p-8">
        <div className="komc:flex komc:flex-col komc:items-center komc:gap-2">
          <Button
            type="button"
            outline="line"
            variant="blue"
            size="md"
            onClick={() => setOpen(true)}
          >
            Sheet 열기
          </Button>
          <p className="komc:text-xs komc:text-neutral-500">
            배경을 눌러도 닫히지 않습니다. Esc 또는 패널의 닫기를 사용하세요.
          </p>
        </div>
        <Sheet {...args} isOpen={open} onClose={() => setOpen(false)}>
          <SheetPanel onClose={() => setOpen(false)} />
        </Sheet>
      </div>
    );
  },
};
