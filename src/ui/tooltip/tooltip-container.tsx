import { forwardRef, HTMLAttributes, useRef, useState } from 'react';
import TooltipTrigger from './tooltip-trigger';
import { useOutsideClick } from '../../hooks/common';
import TooltipContent from './tooltip-content';
import clsx from 'clsx';
import TooltipPortal from './tooltip-portal';

type SubPlacement = 'start' | 'end';
export type MainPlacement = 'top' | 'bottom';
export type TooltipPlacement =
  MainPlacement | `${MainPlacement}-${SubPlacement}`;

export interface TooltipContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  content: string;
  placement?: TooltipPlacement;
  defaultOpen?: boolean;
}

const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(
  ({
    children,
    content,
    defaultOpen = false,
    className,
    placement = 'top',
  }) => {
    const [open, setOpen] = useState(defaultOpen);
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLDivElement>(null);

    useOutsideClick({ ref: containerRef, setOpen });

    return (
      <div
        ref={containerRef}
        data-komc
        className="komc:flex komc:shrink-0 komc:relative komc:overflow-hidden komc:w-fit komc:h-fit"
      >
        <TooltipTrigger setOpen={setOpen}>{children}</TooltipTrigger>
        <TooltipPortal
          placement={placement}
          className={className}
          open={open}
          content={content}
          hiddenRef={hiddenRef}
          containerRef={containerRef}
        />
        <TooltipContent
          ref={hiddenRef}
          role="presentation"
          aria-hidden="true"
          placement={placement}
          className={clsx('komc:opacity-0 komc:invisible', className)}
        >
          <span>{content}</span>
        </TooltipContent>
      </div>
    );
  },
);

export default TooltipContainer;
