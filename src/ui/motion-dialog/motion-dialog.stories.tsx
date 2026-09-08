import { useState } from 'react';
import { Button } from '../button';
import { MotionDialog, type MotionDialogProps } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const MotionDialogDemo = (args: MotionDialogProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="komc:p-8">
      <Button
        type="button"
        outline="line"
        variant="blue"
        size="md"
        onClick={() => setOpen(true)}
      >
        다이얼로그 열기
      </Button>
      <MotionDialog {...args} isOpen={open} onClose={() => setOpen(false)}>
        <p className="komc:text-sm komc:text-neutral-600">
          가상 콘텐츠입니다. 배경 클릭이나 닫기 버튼으로 닫을 수 있습니다.
        </p>
      </MotionDialog>
    </div>
  );
};

const meta = {
  component: MotionDialog,
  title: 'ui/MotionDialog',
  tags: ['ui'],
  argTypes: {
    isOpen: { table: { disable: true } },
    onClose: { table: { disable: true } },
    children: { table: { disable: true } },
    title: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    animation: {
      control: 'select',
      options: ['scale', 'slide', 'fade', 'slide-up'],
    },
    showCloseButton: { control: 'boolean' },
    closeOnBackdropClick: { control: 'boolean' },
  },
  args: {
    isOpen: false,
    onClose: () => undefined,
    children: null,
    title: '안내',
    size: 'md',
    animation: 'scale',
    showCloseButton: true,
    closeOnBackdropClick: true,
  },
} satisfies Meta<typeof MotionDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <MotionDialogDemo {...args} />,
};
