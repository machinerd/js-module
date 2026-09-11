'use client';

import { DraggableAttributes } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

interface DndItemProps {
  /**
   * Sortable id. Must match an id passed to the surrounding sortable list
   * (e.g. `field.id` from `useFieldArray` when using `DndWrapper`).
   */
  id: string;
  /**
   * Renders the item. Spread `attributes` and `listeners` onto the drag
   * handle — or onto the root to make the whole item draggable.
   */
  render: (
    attributes: DraggableAttributes,
    listeners?: SortableListeners,
  ) => ReactNode;
}

/**
 * Sortable list item for dnd-kit. Handles the move transform and
 * dims itself while dragging.
 *
 * Must be rendered inside a `DndContext` + `SortableContext`, usually
 * provided by `DndWrapper`.
 *
 * @example
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field) => (
 *     <DndItem
 *       key={field.id}
 *       id={field.id}
 *       render={(attributes, listeners) => (
 *         <div className="flex gap-2">
 *           <button type="button" {...attributes} {...listeners}>⠿</button>
 *           <span>{field.name}</span>
 *         </div>
 *       )}
 *     />
 *   ))}
 * </DndWrapper>
 */
export function DndItem({ id, render }: DndItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      data-komc
      style={{
        width: '100%',
        zIndex: isDragging ? '100' : 'auto',
        opacity: isDragging ? 0.7 : 1,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      {render(attributes, listeners)}
    </div>
  );
}
