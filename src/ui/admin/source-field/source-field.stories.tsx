import { faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SourceField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const languageOptions = [
  { label: '한국어', value: 'ko' },
  { label: 'English', value: 'en' },
];

const meta = {
  title: 'ui/admin/SourceField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext
        items={['source-1']}
        strategy={verticalListSortingStrategy}
      >
        <div className="komc:max-w-xl komc:p-6">
          <SourceField
            dragId="source-1"
            label={{ text: '출처' }}
            options={languageOptions}
            defaultValue={languageOptions[0]}
            inputDefaultValue="https://example.com/article"
            handle={<FontAwesomeIcon icon={faGripVertical} />}
            action={<FontAwesomeIcon icon={faTrash} />}
            onDelete={() => undefined}
          />
        </div>
      </SortableContext>
    </DndContext>
  ),
};
