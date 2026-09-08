import { SelectField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const options = [
  { label: '한국어', value: 'ko' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
];

const meta = {
  title: 'ui/admin/SelectField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="komc:max-w-md komc:h-22 komc:p-6">
      <SelectField
        label={{ text: '언어' }}
        options={options}
        placeholder="언어를 선택하세요"
        defaultValue={options[0]}
      />
    </div>
  ),
};
