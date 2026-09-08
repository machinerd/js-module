import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DndItem } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const ids = ['item-1', 'item-2', 'item-3'];

const meta = {
  component: DndItem,
  title: 'ui/DndItem',
  tags: ['ui'],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof DndItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="komc:flex komc:flex-col komc:gap-2 komc:max-w-sm komc:p-6">
          {ids.map((id) => (
            <DndItem
              key={id}
              id={id}
              render={(attributes, listeners) => (
                <div
                  className="komc:flex komc:items-center komc:gap-3 komc:p-3 komc:bg-white komc:border komc:border-neutral-200 komc:rounded-sm"
                  {...attributes}
                  {...listeners}
                >
                  <FontAwesomeIcon icon={faGripVertical} />
                  <span>{id}</span>
                </div>
              )}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  ),
};
