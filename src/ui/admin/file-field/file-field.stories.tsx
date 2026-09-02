import {
  faFile,
  faGripVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FileField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const languageOptions = [
  { label: '한국어', value: 'ko' },
  { label: 'English', value: 'en' },
];

const meta = {
  title: 'ui/admin/FileField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext
        items={['file-1']}
        strategy={verticalListSortingStrategy}
      >
        <div className="komc:max-w-2xl komc:p-6">
          <FileField
            dragId="file-1"
            label={{ text: '첨부 파일' }}
            path="https://example.com/demo.pdf"
            defaultValue="demo.pdf"
            fileIcon={faFile}
            options={languageOptions}
            checkedLanguages={['ko']}
            handle={<FontAwesomeIcon icon={faGripVertical} />}
            action={<FontAwesomeIcon icon={faTrash} />}
            onDelete={() => undefined}
          />
        </div>
      </SortableContext>
    </DndContext>
  ),
};
