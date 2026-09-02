import { faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { VideoField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/VideoField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext
        items={['video-1']}
        strategy={verticalListSortingStrategy}
      >
        <div className="komc:max-w-xl komc:p-6">
          <VideoField
            dragId="video-1"
            label={{ text: '영상 URL' }}
            defaultValue="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            handle={<FontAwesomeIcon icon={faGripVertical} />}
            action={<FontAwesomeIcon icon={faTrash} />}
            onDelete={() => undefined}
          />
        </div>
      </SortableContext>
    </DndContext>
  ),
};
