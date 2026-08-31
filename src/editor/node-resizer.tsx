'use client';

import { cva } from 'class-variance-authority';
import { memo } from 'react';
import { cn } from '../util/common';
import {
  useDragResize,
  type ResizeDirection,
  type ResizeHandleProps,
  type UseDragResizeProps,
} from '../hooks/use-drag-resize';

export interface NodeResizerProps extends UseDragResizeProps {
  directions: ResizeDirection[];
}

const positionClasses = cva(
  cn(
    'komc:flex komc:justify-center komc:items-center komc:absolute komc:z-50',
    'komc:transition-all komc:duration-200 komc:ease-in-out',
    'komc:opacity-0 komc:group-hover:opacity-100',
  ),
  {
    variants: {
      direction: {
        left: 'komc:-left-1 komc:cursor-ew-resize komc:top-1/2 komc:-translate-y-1/2',
        right:
          'komc:-right-1 komc:cursor-ew-resize komc:top-1/2 komc:-translate-y-1/2',
        top: 'komc:-top-1 komc:cursor-ns-resize komc:left-1/2 komc:-translate-x-1/2',
        bottom:
          'komc:-bottom-1 komc:cursor-ns-resize komc:left-1/2 komc:-translate-x-1/2',
        'top-left': 'komc:-top-1 komc:left-1 komc:cursor-nw-resize',
        'top-right': 'komc:-top-1 komc:right-1 komc:cursor-ne-resize',
        'bottom-left': 'komc:-bottom-1 komc:left-1 komc:cursor-sw-resize',
        'bottom-right': 'komc:-bottom-1 komc:right-1 komc:cursor-se-resize',
      },
    },
    defaultVariants: {
      direction: 'left',
    },
  },
);

const handlerClasses = cva(
  'komc:flex komc:justify-center komc:items-center komc:group/resize',
  {
    variants: {
      direction: {
        left: 'komc:w-6 komc:h-14 komc:*:w-1.5 komc:*:h-full',
        right: 'komc:w-6 komc:h-14 komc:*:w-1.5 komc:*:h-full',
        top: 'komc:w-14 komc:h-6 komc:*:w-full komc:*:h-1.5',
        bottom: 'komc:w-14 komc:h-6 komc:*:w-full komc:*:h-1.5',
        'top-left': 'komc:w-14 komc:h-6 komc:*:w-full komc:*:h-1.5',
        'top-right': 'komc:w-14 komc:h-6 komc:*:w-full komc:*:h-1.5',
        'bottom-left': 'komc:w-14 komc:h-6 komc:*:w-full komc:*:h-1.5',
        'bottom-right': 'komc:w-14 komc:h-6 komc:*:w-full komc:*:h-1.5',
      },
    },
    defaultVariants: {
      direction: 'left',
    },
  },
);

export function NodeResizer({
  directions,
  limitSize = { width: true, height: false },
  ...props
}: NodeResizerProps) {
  const { getHandleProps, isResizing } = useDragResize({
    ...props,
    limitSize,
  });

  return (
    <>
      {directions.map((direction) => (
        <ResizeHandler
          key={direction}
          direction={direction}
          isResizing={isResizing}
          {...getHandleProps(direction)}
        />
      ))}
    </>
  );
}

interface ResizeHandlerProps extends ResizeHandleProps {
  direction: ResizeDirection;
  isResizing: boolean;
}

const ResizeHandler = memo(function ResizeHandler({
  direction,
  isResizing,
  style,
  ...events
}: ResizeHandlerProps) {
  return (
    <div
      className={cn(
        positionClasses({ direction }),
        isResizing && 'komc:opacity-100',
      )}
    >
      <div
        className={handlerClasses({ direction })}
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        style={style}
        {...events}
      >
        <div className="komc:border komc:border-white komc:bg-black/40 komc:rounded-full komc:group-hover/resize:bg-blue-500/50" />
      </div>
    </div>
  );
});
