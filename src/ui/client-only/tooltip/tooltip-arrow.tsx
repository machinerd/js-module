import { HTMLAttributes, useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { TooltipPlacement } from './tooltip-container';
import { cn } from '../../../util';

const classes = cva(
  cn(
    'komc:absolute komc:w-2 komc:h-2 komc:bg-inherit',
    'komc:transition-opacity komc:duration-300',
  ),
  {
    variants: {
      placement: {
        top: cn(
          'komc:top-full komc:-mt-1 komc:left-1/2',
        ),
        bottom: cn(
          'komc:bottom-full komc:-mb-1 komc:left-1/2',
        ),
        left: cn(
          'komc:left-full komc:-ml-1 komc:top-1/2',
        ),
        right: cn(
          'komc:right-full komc:-mr-1 komc:top-1/2',
        ),
        'top-start': cn(
          'komc:top-full komc:-mt-1 komc:left-5',
        ),
        'top-end': cn(
          'komc:top-full komc:-mt-1 komc:right-5',
        ),
        'bottom-start': cn(
          'komc:bottom-full komc:-mb-1 komc:left-5',
        ),
        'bottom-end': cn(
          'komc:bottom-full komc:-mb-1 komc:right-5',
        ),
        'left-start': cn(
          'komc:left-full komc:-ml-1 komc:top-3',
        ),
        'left-end': cn(
          'komc:left-full komc:-ml-1 komc:bottom-3',
        ),
        'right-start': cn(
          'komc:right-full komc:-mr-1 komc:top-3',
        ),
        'right-end': cn(
          'komc:right-full komc:-mr-1 komc:bottom-3',
        ),
      },
    },
    defaultVariants: {
      placement: 'top',
    },
  }
);

export interface TooltipArrowProps extends HTMLAttributes<HTMLDivElement> {
  placement?: TooltipPlacement;
  offset?: { x: number; y: number };
}

const TooltipArrow = ({ placement, className, offset, style, ...props }: TooltipArrowProps) => {
  const rorate = useMemo(() => {
    switch (placement) {
      case 'top':
        return 'rotate(45deg)';
      case 'bottom':
        return 'rotate(225deg)';
      case 'left':
        return 'rotate(-45deg)';
      case 'right':
        return 'rotate(135deg)';
      case 'top-start':
        return 'rotate(45deg)';
      case 'top-end':
        return 'rotate(45deg)';
      case 'bottom-start':
        return 'rotate(225deg)';
      case 'bottom-end':
        return 'rotate(225deg)';
      case 'left-start':
        return 'rotate(-45deg)';
      case 'left-end':
        return 'rotate(-45deg)';
      case 'right-start':
        return 'rotate(135deg)';
      case 'right-end':
        return 'rotate(135deg)';
      default:
        return 'rotate(45deg)';
    }
  }, [placement]);

  return (
    <div
      className={classes({ placement, className })}
      style={{ transform: `translate(${offset?.x}px, ${offset?.y}px) ${rorate}` }}
      {...props}
    />
  );
};

export default TooltipArrow;
