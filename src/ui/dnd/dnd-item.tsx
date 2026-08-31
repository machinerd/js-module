'use client';

import { DraggableAttributes } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

type SortableListeners = ReturnType<typeof useSortable>['listeners'];

interface DndItemProps {
  id: string;
  render: (
    attributes: DraggableAttributes,
    listeners?: SortableListeners,
  ) => ReactNode;
}

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
