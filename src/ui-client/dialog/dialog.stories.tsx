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

function DialogPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="komc:bg-white komc:rounded-xl komc:p-4 komc:shadow-lg komc:min-w-[min(100%,320px)] komc:max-w-md">
      <h2 className="komc:text-lg komc:font-semibold komc:mb-2">알림</h2>
      <p className="komc:text-neutral-600 komc:text-sm komc:mb-4">
        트리거 버튼으로 연 모달입니다. 배경을 누르거나 Esc, 또는 아래 버튼으로 닫을 수 있습니다.
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
