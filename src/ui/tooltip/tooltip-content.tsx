import { forwardRef, HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { TooltipPlacement } from './tooltip-container';
import clsx from 'clsx';

const classes = cva(
  clsx(
    'komc:z-99 komc:w-max komc:max-w-70 komc:p-2 komc:rounded-md',
    'komc:break-all komc:transition-opacity komc:duration-300 komc:bg-white',
    'komc:drop-shadow-[0px_0.5px_3px_rgba(0,0,0,0.2)] komc:text-xs',
  ),
  {
    variants: {
      portal: {
        true: 'komc:fixed',
        false: 'komc:absolute',
      },
      placement: {
        top: '',
        bottom: '',
        'top-start': '',
        'top-end': '',
        'bottom-start': '',
        'bottom-end': '',
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
    ],
    defaultVariants: {
      placement: 'top',
      portal: false,
    },
  },
);

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  portal?: boolean;
  placement: TooltipPlacement;
  children: React.ReactNode;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ portal, children, className, placement, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-komc
        role="tooltip"
        className={classes({ portal, placement, className })}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export default TooltipContent;
