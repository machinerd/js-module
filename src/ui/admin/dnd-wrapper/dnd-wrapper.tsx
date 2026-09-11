'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import React, { ComponentProps, useMemo } from 'react';
import { UseFieldArrayMove } from 'react-hook-form';

/**
 * Props for {@link DndWrapper}.
 *
 * Any other `DndContext` prop (`onDragStart`, `modifiers`, ...) is forwarded as-is.
 *
 * @template T Item type. Must have a string `id` (e.g. `fields` from `useFieldArray`).
 */
interface DndWrapperProps<T> extends ComponentProps<typeof DndContext> {
  /**
   * Items to sort. Pass `fields` from `useFieldArray`, not `watch()` values —
   * each item's `id` is used as the sortable id.
   */
  items: T[];
  /**
   * Called as `move(from, to)` when an item is dropped on another item.
   * Pass `move` from `useFieldArray`.
   */
  move: UseFieldArrayMove;
  /**
   * Sortable items, usually `DndItem`s. Each item's `id` must match an `id` in `items`.
   */
  children: React.ReactNode;
  /**
   * Replaces the built-in reorder handler: if passed, `move` is NOT called.
   */
  onDragEnd?: ComponentProps<typeof DndContext>['onDragEnd'];
}

/**
 * Drag-and-drop sortable list wired to react-hook-form's `useFieldArray`.
 *
 * Supports pointer and keyboard dragging. On drop, reorders the field array via `move`.
 *
 * @template T Item type. Must have a string `id`.
 *
 * @example
 * const { fields, move } = useFieldArray({ control, name: 'images' });
 *
 * <DndWrapper items={fields} move={move}>
 *   {fields.map((field, index) => (
 *     <DndItem
 *       key={field.id}
 *       id={field.id}
 *       render={(attributes, listeners) => (
 *         <ImageRow index={index} {...attributes} {...listeners} />
 *       )}
 *     />
 *   ))}
 * </DndWrapper>
 */
export const DndWrapper = <T extends { id: string }>({
  items,
  move,
  children,
  ...props
}: DndWrapperProps<T>) => {
  const ids = useMemo(() => items.map((item) => String(item.id)), [items]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));

    if (from === -1 || to === -1) return;

    move(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      {...props}
    >
      <SortableContext items={ids}>{children}</SortableContext>
    </DndContext>
  );
};
