import { faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SeriesField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/SeriesField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext
        items={['series-1']}
        strategy={verticalListSortingStrategy}
      >
        <div className="komc:max-w-xl komc:p-6">
          <SeriesField
            dragId="series-1"
            handle={<FontAwesomeIcon icon={faGripVertical} />}
            action={<FontAwesomeIcon icon={faTrash} />}
            onDelete={() => undefined}
            items={[
              { prefix: 'KO', defaultValue: '한국어 제목' },
              { prefix: 'EN', defaultValue: 'English title' },
            ]}
          />
        </div>
      </SortableContext>
    </DndContext>
  ),
};
