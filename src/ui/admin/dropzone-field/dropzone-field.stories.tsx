import {
  faArrowUpRightFromSquare,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { Dropzone } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/Dropzone',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="komc:max-w-md komc:p-6">
      <Dropzone
        label={{ text: '파일' }}
        fileIcon={faFile}
        linkIcon={faArrowUpRightFromSquare}
        placeholder="파일을 선택하세요"
        subPlaceholder="또는 여기로 드롭"
        onDrop={() => undefined}
      />
    </div>
  ),
};
