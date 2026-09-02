import { AsyncSelectField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface DemoOption {
  label: string;
  value: string;
}

const allOptions: DemoOption[] = [
  { label: '대한민국', value: 'kr' },
  { label: '일본', value: 'jp' },
  { label: '미국', value: 'us' },
  { label: '독일', value: 'de' },
  { label: '프랑스', value: 'fr' },
  { label: '영국', value: 'gb' },
];

const fetcher = async (input: {
  filter?: { keyword?: string };
  page: number;
  pageSize: number;
}) => {
  const keyword = input.filter?.keyword?.toLowerCase() ?? '';
  const filtered = allOptions.filter((option) =>
    option.label.toLowerCase().includes(keyword),
  );
  const start = (input.page - 1) * input.pageSize;
  return {
    list: filtered.slice(start, start + input.pageSize),
    total: filtered.length,
  };
};

const meta = {
  title: 'ui/admin/AsyncSelectField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="komc:max-w-md komc:p-6">
      <AsyncSelectField<DemoOption>
        label={{ text: '국가' }}
        fetcher={fetcher}
        placeholder="국가를 검색하세요"
        defaultValue={allOptions[0]}
      />
    </div>
  ),
};
