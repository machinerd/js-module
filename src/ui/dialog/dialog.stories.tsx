/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { Button } from '../../ui/button';
import Dialog from './dialog';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  component: Dialog,
  title: 'ui-client/Dialog',
  tags: ['ui-client'],
  argTypes: {
    isOpen: { table: { disable: true } },
    onClose: { table: { disable: true } },
    children: { table: { disable: true } },
    closeOnBackdropClick: { control: 'boolean' },
    zIndex: { control: 'number' },
    padding: {
      control: 'select',
      options: ['sm', 'none'],
    },
    className: { control: 'text' },
  },
  args: {
    closeOnBackdropClick: true,
    zIndex: 10000,
    padding: 'sm',
    className: '',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function LongContentDialogPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="komc:flex komc:min-h-0 komc:flex-1 komc:flex-col komc:overflow-hidden komc:bg-white komc:shadow-lg komc:w-full komc:min-w-[min(100%,320px)]">
      <div className="komc:shrink-0 komc:px-4 komc:pt-4">
        <h2 className="komc:text-lg komc:font-semibold komc:mb-2">
          긴 세로 콘텐츠
        </h2>
        <p className="komc:text-neutral-500 komc:text-xs">
          모달은 화면을 넘지 않습니다. 아래 본문이 길면 이 영역만
          스크롤됩니다(레이아웃은 콘텐츠에서 정의).
        </p>
      </div>
      <div className="komc:flex-1 komc:min-h-0 komc:overflow-y-auto komc:px-4 komc:py-3 komc:space-y-3">
        {Array.from({ length: 36 }, (_, i) => (
          <p
            key={i}
            className="komc:text-neutral-700 komc:text-sm komc:leading-relaxed"
          >
            {i + 1}. 세로로 긴 본문을 시뮬레이션하는 문단입니다. 이용 약관,
            개인정보 처리방침, FAQ 등 긴 텍스트가 들어갈 때 모달이 화면 높이를
            넘지 않고 스크롤로 탐색할 수 있는지 확인할 수 있습니다.
          </p>
        ))}
      </div>
      <div className="komc:flex komc:shrink-0 komc:justify-end komc:gap-2 komc:border-t komc:border-neutral-200 komc:px-4 komc:py-3">
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
    </div>
  );
}

function DialogPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="komc:bg-white komc:rounded-xl komc:p-4 komc:shadow-lg komc:min-w-[min(100%,320px)] komc:max-w-md">
      <h2 className="komc:text-lg komc:font-semibold komc:mb-2">알림</h2>
      <p className="komc:text-neutral-600 komc:text-sm komc:mb-4">
        트리거 버튼으로 연 모달입니다. 배경을 누르거나 Esc, 또는 아래 버튼으로
        닫을 수 있습니다.
      </p>
      <div className="komc:flex komc:justify-end komc:gap-2">
        <Button
          type="button"
          outline="line"
          variant="gray"
          size="sm"
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          type="button"
          outline="solid"
          variant="blue"
          size="sm"
          onClick={onClose}
        >
          확인
        </Button>
      </div>
    </div>
  );
}

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
            다이얼로그 열기
          </Button>
        </div>
        <Dialog {...args} isOpen={open} onClose={() => setOpen(false)}>
          <DialogPanel onClose={() => setOpen(false)} />
        </Dialog>
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
            다이얼로그 열기
          </Button>
          <p className="komc:text-xs komc:text-neutral-500">
            배경을 눌러도 닫히지 않습니다.
          </p>
        </div>
        <Dialog {...args} isOpen={open} onClose={() => setOpen(false)}>
          <DialogPanel onClose={() => setOpen(false)} />
        </Dialog>
      </div>
    );
  },
};

export const LongVerticalContent: Story = {
  name: '긴 세로 콘텐츠',
  args: {
    maxWidth: '2xl',
    padding: 'none',
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
            긴 콘텐츠 다이얼로그 열기
          </Button>
          <p className="komc:text-xs komc:text-neutral-500 komc:text-center komc:max-w-md">
            모달은 뷰포트 안에 맞고, 긴 본문은 내부 스크롤로 처리하는
            예시입니다.
          </p>
        </div>
        <Dialog {...args} isOpen={open} onClose={() => setOpen(false)}>
          <LongContentDialogPanel onClose={() => setOpen(false)} />
        </Dialog>
      </div>
    );
  },
};
