'use client';

import useResize, {
  type ResizeDirection,
  type UseResizeProps,
} from '../../../hooks/use-drag-resize';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { memo, useLayoutEffect, useRef, type ComponentProps } from 'react';
import { useNodeView, type NodeViewPlugin } from '../node-view-context';

export interface NodeResizerProps extends Omit<
  ComponentProps<typeof ResizeHandler>,
  'direction'
> {
  directions: ResizeDirection[];
}

export const NodeResizer = ({ directions, ...rest }: NodeResizerProps) => {
  return (
    <>
      {directions.map((direction) => (
        <ResizeHandler key={direction} {...rest} direction={direction} />
      ))}
    </>
  );
};

interface ResizeHandlerProps extends UseResizeProps {
  direction: ResizeDirection;
}

const classes = cva(
  clsx(
    'komc:absolute komc:z-50 komc:flex komc:items-center komc:justify-center',
    'komc:transition-all komc:duration-200 komc:ease-in-out',
    'komc:opacity-0 komc:group-hover:opacity-100',
  ),
  {
    variants: {
      direction: {
        left: 'komc:-left-1 komc:top-[50%] komc:-translate-y-1/2 komc:cursor-ew-resize',
        right:
          'komc:-right-1 komc:top-[50%] komc:-translate-y-1/2 komc:cursor-ew-resize',
        top: 'komc:-top-1 komc:left-[50%] komc:-translate-x-1/2 komc:cursor-ns-resize',
        bottom:
          'komc:-bottom-1 komc:left-[50%] komc:-translate-x-1/2 komc:cursor-ns-resize',
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
  'komc:flex komc:items-center komc:justify-center komc:group/resize',
  {
    variants: {
      direction: {
        left: 'komc:h-14 komc:w-6 komc:[&_div]:h-full komc:[&_div]:w-1.5',
        right: 'komc:h-14 komc:w-6 komc:[&_div]:h-full komc:[&_div]:w-1.5',
        top: 'komc:h-6 komc:w-14 komc:[&_div]:h-1.5 komc:[&_div]:w-full',
        bottom: 'komc:h-6 komc:w-14 komc:[&_div]:h-1.5 komc:[&_div]:w-full',
        'top-left': 'komc:h-6 komc:w-14 komc:[&_div]:h-1.5 komc:[&_div]:w-full',
        'top-right':
          'komc:h-6 komc:w-14 komc:[&_div]:h-1.5 komc:[&_div]:w-full',
        'bottom-left':
          'komc:h-6 komc:w-14 komc:[&_div]:h-1.5 komc:[&_div]:w-full',
        'bottom-right':
          'komc:h-6 komc:w-14 komc:[&_div]:h-1.5 komc:[&_div]:w-full',
      },
    },
    defaultVariants: {
      direction: 'left',
    },
  },
);

export const ResizeHandler = memo(
  ({ direction, ...props }: ResizeHandlerProps) => {
    const events = useResize({
      ...props,
      direction,
      limitSize: { width: true, height: false },
    });

    return (
      <div data-komc className={classes({ direction })}>
        <div
          className={handlerClasses({ direction })}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          {...events}
        >
          <div className="komc:rounded-full komc:border komc:border-white komc:bg-black/40 komc:group-hover/resize:bg-blue-500/50" />
        </div>
      </div>
    );
  },
);

ResizeHandler.displayName = 'ResizeHandler';

export const nodeResizer = (
  options: { directions?: ResizeDirection[] } = {},
): NodeViewPlugin => {
  const directions = options.directions ?? ['left', 'right'];

  return function NodeResizerPlugin() {
    const { node, updateAttributes, editor, getPos } = useNodeView<{
      width: number;
      height: number;
    }>();
    const boundaryRef = useRef<HTMLElement | null>(null);
    const width = Number(node.attrs.width);
    const height = Number(node.attrs.height);

    useLayoutEffect(() => {
      const pos = getPos();
      if (typeof pos !== 'number') {
        return;
      }

      const dom = editor.view.nodeDOM(pos);
      boundaryRef.current = dom instanceof HTMLElement ? dom : null;
    });

    return (
      <NodeResizer
        directions={directions}
        boundaryRef={boundaryRef}
        size={{ width, height }}
        onResize={updateAttributes}
      />
    );
  };
};

export const NodeResizerPlugin = nodeResizer();
