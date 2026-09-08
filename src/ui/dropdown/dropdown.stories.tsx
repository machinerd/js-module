import { useState, type ComponentProps } from 'react';
import { Button } from '../button';
import Dropdown, { useDropdown } from './dropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Dropdown,
  title: 'ui-client/Dropdown',
  tags: ['ui-client'],
  argTypes: {
    trigger: { table: { disable: true } },
    children: { table: { disable: true } },
    reference: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    boundary: { table: { disable: true } },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'right',
      ],
    },
    offset: { control: 'number' },
    maxHeight: { control: 'number' },
    preserveFocus: { control: 'boolean' },
    className: { control: 'text' },
  },
  args: {
    children: null,
    placement: 'bottom-start',
    offset: 8,
    maxHeight: 300,
    preserveFocus: true,
    className: '',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

function MenuPanel() {
  const { close } = useDropdown();

  return (
    <div className="komc:min-w-40 komc:rounded-lg komc:border komc:border-neutral-200 komc:bg-white komc:py-1">
      {['복제', '삭제', '속성'].map((label) => (
        <button
          key={label}
          type="button"
          className="komc:block komc:w-full komc:px-3 komc:py-2 komc:text-left komc:text-sm komc:hover:bg-neutral-100"
          onClick={close}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function TriggerDemo(props: ComponentProps<typeof Dropdown>) {
  return (
    <div className="komc:flex komc:min-h-56 komc:items-center komc:justify-center komc:p-8">
      <Dropdown {...props} trigger={<Button size="sm">메뉴 열기</Button>}>
        <MenuPanel />
      </Dropdown>
    </div>
  );
}

function ReferenceDemo() {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  return (
    <div className="komc:relative komc:min-h-72 komc:p-8">
      <p className="komc:mb-4 komc:text-sm komc:text-neutral-500">
        컨트롤을 누르면 그 위치에서 열립니다. 입력창 포커스는 유지됩니다.
      </p>
      <input
        defaultValue="포커스를 여기 두고 컨트롤을 눌러 보세요"
        className="komc:mb-6 komc:w-full komc:rounded-md komc:border komc:border-neutral-300 komc:px-3 komc:py-2 komc:text-sm"
      />
      <button
        type="button"
        className="komc:flex komc:h-5 komc:w-5 komc:items-center komc:justify-center komc:rounded komc:border komc:border-neutral-400 komc:bg-white komc:text-xs"
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={(event) => {
          setRect(event.currentTarget.getBoundingClientRect());
          setOpen(true);
        }}
      >
        ⋯
      </button>
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        reference={rect ? { getBoundingClientRect: () => rect } : undefined}
      >
        <MenuPanel />
      </Dropdown>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => <TriggerDemo {...args} />,
};

export const VirtualReference: Story = {
  name: '가상 기준점',
  render: () => <ReferenceDemo />,
};
