import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps, forwardRef, type ReactNode } from 'react';
import { cn } from '../util/common';

const classes = cva(
  cn(
    'komc:group komc:relative komc:after:pointer-events-none',
    'komc:after:transition-opacity komc:after:duration-200 komc:after:ease-in-out',
    'komc:after:content-[""] komc:after:rounded-(--node-radius)',
    'komc:after:absolute komc:after:-inset-1.5 komc:after:z-1',
  ),
  {
    variants: {
      selected: {
        true: 'komc:after:bg-[#2383E2]/14 komc:after:opacity-100',
        false: 'komc:after:opacity-0',
      },
      hoverable: {
        true: cn(
          'komc:*:data-komc-node-clip:transition-opacity',
          'komc:*:data-komc-node-clip:duration-200',
          'komc:*:data-komc-node-clip:ease-in-out',
          'komc:*:data-komc-node-clip:outline-gray-700',
          'komc:*:data-komc-node-clip:-outline-offset-1',
          'komc:*:data-komc-node-clip:outline-0',
          'komc:hover:*:data-komc-node-clip:opacity-70',
          'komc:*:data-komc-node-clip:opacity-100',
          'komc:hover:z-1',
        ),
        false: '',
      },
      draggable: {
        true: 'komc:cursor-grab komc:active:cursor-grabbing komc:touch-none',
        false: 'komc:select-none',
      },
    },
    defaultVariants: {
      selected: false,
      hoverable: false,
      draggable: false,
    },
    compoundVariants: [
      {
        selected: true,
        hoverable: true,
        class: 'komc:*:data-komc-node-clip:outline-none',
      },
      {
        selected: false,
        hoverable: true,
        class: 'komc:hover:*:data-komc-node-clip:outline-3',
      },
    ],
  },
);

export type NodeFrameProps = ComponentProps<'div'> &
  VariantProps<typeof classes> & {
    radius?: number;
    overlay?: ReactNode;
  };

export const NodeFrame = forwardRef<HTMLDivElement, NodeFrameProps>(
  (
    {
      selected,
      hoverable,
      draggable,
      radius = 0,
      overlay,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{ ['--node-radius' as string]: `${radius}%`, ...style }}
        className={cn(classes({ selected, hoverable, draggable }), className)}
        {...rest}
        data-drag-handle={draggable ? '' : undefined}
      >
        <div
          data-komc-node-clip=""
          className="komc:w-full komc:h-full komc:relative komc:overflow-hidden"
          style={{ borderRadius: `${radius}%` }}
        >
          {children}
        </div>
        {overlay != null && (
          <div
            className="komc:absolute komc:inset-0 komc:z-2 komc:pointer-events-none komc:**:pointer-events-auto"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {overlay}
          </div>
        )}
      </div>
    );
  },
);

NodeFrame.displayName = 'NodeFrame';
