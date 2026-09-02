import {
  faGripVertical,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ApiClientProvider } from '../../../providers/api-client';
import { ImageListField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'ui/admin/ImageListField',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <ApiClientProvider
      config={{
        apiEndpoint: 'https://example.com',
        cdnEndpoint: 'https://cdn.example.com',
      }}
    >
      <DndContext collisionDetection={closestCenter}>
        <SortableContext
          items={['image-1']}
          strategy={verticalListSortingStrategy}
        >
          <div className="komc:max-w-xs komc:p-6">
            <ImageListField
              dragId="image-1"
              src="https://picsum.photos/id/1015/600/400"
              alt="데모 이미지"
              originalWidth={600}
              handle={<FontAwesomeIcon icon={faGripVertical} />}
              update={<FontAwesomeIcon icon={faPen} />}
              action={<FontAwesomeIcon icon={faTrash} />}
              onDelete={() => undefined}
              onUpdate={() => undefined}
            />
          </div>
        </SortableContext>
      </DndContext>
    </ApiClientProvider>
  ),
};
