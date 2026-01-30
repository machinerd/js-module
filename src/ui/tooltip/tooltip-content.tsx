import { forwardRef, HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { TooltipPlacement } from './tooltip-container';
import { cn } from '../../util';

const classes = cva(
  cn(
    'komc:absolute komc:z-99 komc:w-max komc:max-w-70 komc:p-2',
    'komc:break-all komc:transition-opacity komc:duration-300 komc:bg-white',
    'komc:drop-shadow-[0px_0.5px_3px_rgba(0,0,0,0.2)]',
  ),
  {
    variants: {
      portal: {
        true: '',
        false: '',
      },
      placement: {
        top: '',
        bottom: '',
        left: '',
        right: '',
        'top-start': '',
        'top-end': '',
        'bottom-start': '',
        'bottom-end': '',
        'left-start': '',
        'left-end': '',
        'right-start': '',
        'right-end': '',
      },
    },
    compoundVariants: [
      {
        portal: true,
        placement: 'top',
        className: 'komc:-translate-y-2',
      },
      {
        portal: true,
        placement: 'bottom',
        className: 'komc:translate-y-2',
      },
      {
        portal: true,
        placement: 'left',
        className: 'komc:-translate-x-2',
      },
      {
        portal: true,
        placement: 'right',
        className: 'komc:translate-x-2',
      },
      {
        portal: true,
        placement: 'top-start',
        className: 'komc:-translate-y-2',
      },
      {
        portal: true,
        placement: 'top-end',
        className: 'komc:-translate-y-2',
      },
      {
        portal: true,
        placement: 'bottom-start',
        className: 'komc:translate-y-2',
      },
      {
        portal: true,
        placement: 'bottom-end',
        className: 'komc:translate-y-2',
      },
      {
        portal: true,
        placement: 'left-start',
        className: 'komc:-translate-x-2',
      },
      {
        portal: true,
        placement: 'left-end',
        className: 'komc:-translate-x-2',
      },
      {
        portal: true,
        placement: 'right-start',
        className: 'komc:translate-x-2',
      },
      {
        portal: true,
        placement: 'right-end',
        className: 'komc:translate-x-2',
      },
      {
        portal: false,
        placement: 'top',
        className: 'komc:bottom-full komc:left-1/2 komc:-translate-x-1/2',
      },
      {
        portal: false,
        placement: 'bottom',
        className: 'komc:top-full komc:left-1/2 komc:-translate-x-1/2',
      },
      {
        portal: false,
        placement: 'left',
        className: 'komc:right-full komc:top-1/2 komc:-translate-y-1/2',
      },
      {
        portal: false,
        placement: 'right',
        className: 'komc:left-full komc:top-1/2 komc:-translate-y-1/2',
      },
      {
        portal: false,
        placement: 'top-start',
        className: 'komc:bottom-full komc:left-0',
      },
      {
        portal: false,
        placement: 'top-end',
        className: 'komc:bottom-full komc:right-0',
      },
      {
        portal: false,
        placement: 'bottom-start',
        className: 'komc:top-full komc:left-0',
      },
      {
        portal: false,
        placement: 'bottom-end',
        className: 'komc:top-full komc:right-0',
      },
      {
        portal: false,
        placement: 'left-start',
        className: 'komc:right-full komc:top-0',
      },
      {
        portal: false,
        placement: 'left-end',
        className: 'komc:right-full komc:bottom-0',
      },
      {
        portal: false,
        placement: 'right-start',
        className: 'komc:left-full komc:top-0',
      },
      {
        portal: false,
        placement: 'right-end',
        className: 'komc:left-full komc:bottom-0',
      },
    ],
    defaultVariants: {
      placement: 'top',
      portal: false,
    },
  }
);

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  portal?: boolean;
  placement: TooltipPlacement;
  children: React.ReactNode;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(({ portal, children, className, placement, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="tooltip"
      className={classes({ portal, placement, className })}
      {...props}
    >
      {children}
    </div>
  );
});

export default TooltipContent;
