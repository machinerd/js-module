import { HTMLAttributes, useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { TooltipPlacement } from './tooltip-container';
import clsx from 'clsx';

const classes = cva(
  clsx(
    'komc:absolute komc:w-2 komc:h-2 komc:bg-inherit',
    'komc:transition-opacity komc:duration-300',
  ),
  {
    variants: {
      placement: {
        top: clsx('komc:top-full komc:-mt-1 komc:left-1/2'),
        bottom: clsx('komc:bottom-full komc:-mb-1 komc:left-1/2'),
        'top-start': clsx('komc:top-full komc:-mt-1 komc:left-5'),
        'top-end': clsx('komc:top-full komc:-mt-1 komc:right-5'),
        'bottom-start': clsx('komc:bottom-full komc:-mb-1 komc:left-5'),
        'bottom-end': clsx('komc:bottom-full komc:-mb-1 komc:right-5'),
      },
    },
    defaultVariants: {
      placement: 'top',
    },
  },
);

export interface TooltipArrowProps extends HTMLAttributes<HTMLDivElement> {
  placement?: TooltipPlacement;
  offset?: { x: number; y: number };
}

const TooltipArrow = ({
  placement,
  className,
  offset,
  ...props
}: TooltipArrowProps) => {
  const rorate = useMemo(() => {
    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        return 'rotate(45deg)';
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        return 'rotate(225deg)';
      default:
        return 'rotate(45deg)';
    }
  }, [placement]);

  return (
    <div
      className={classes({ placement, className })}
      style={{
        transform: `translate(${offset?.x}px, ${offset?.y}px) ${rorate}`,
      }}
      {...props}
    />
  );
};

export default TooltipArrow;
