import { faFile, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { TextField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/TextField',
  tags: ['ui'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
  args: {
    placeholder: '이름을 입력하세요',
    disabled: false,
    size: 'lg',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="komc:max-w-md komc:p-6">
      <TextField
        label={{ text: '이름' }}
        placeholder={args.placeholder as string}
        disabled={args.disabled as boolean}
        size={args.size as 'xs' | 'sm' | 'md' | 'lg'}
      />
    </div>
  ),
};

export const Search: Story = {
  render: () => (
    <div className="komc:max-w-md komc:p-6">
      <TextField
        variant="search"
        label={{ text: '검색' }}
        placeholder="검색어를 입력하세요"
        searchIcon={faMagnifyingGlass}
      />
    </div>
  ),
};

export const File: Story = {
  render: () => (
    <div className="komc:max-w-md komc:p-6">
      <TextField
        variant="file"
        label={{ text: '파일' }}
        path="https://example.com/demo.pdf"
        defaultValue="demo.pdf"
        fileIcon={faFile}
      />
    </div>
  ),
};
