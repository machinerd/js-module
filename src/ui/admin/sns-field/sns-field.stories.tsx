import { faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SITE_OPTIONS, SnsField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/SnsField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext items={['sns-1']} strategy={verticalListSortingStrategy}>
        <div className="komc:max-w-xl komc:p-6">
          <SnsField
            dragId="sns-1"
            label={{ text: 'SNS' }}
            selectedSns={SITE_OPTIONS[4]!}
            defaultValue="https://instagram.com/example"
            handle={<FontAwesomeIcon icon={faGripVertical} />}
            action={<FontAwesomeIcon icon={faTrash} />}
            onDelete={() => undefined}
          />
        </div>
      </SortableContext>
    </DndContext>
  ),
};
