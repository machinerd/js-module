import { forwardRef, HTMLAttributes, useRef, useState } from 'react';
import TooltipTrigger from './tooltip-trigger';
import { useOutsideClick } from '../../../hooks';
import TooltipContent from './tooltip-content';
import clsx from 'clsx';
import TooltipPortal from './tooltip-portal';

type SubPlacement = 'start' | 'end';
export type MainPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipPlacement = MainPlacement | `${MainPlacement}-${SubPlacement}`;

export interface TooltipContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @param children - Trigger element
   */
  children: React.ReactNode;
  /**
   * @param content - Tooltip content
   */
  content: string;
  /**
   * @param placement - Placement of the tooltip
   * @default top
   * @property
   * - top
   * - bottom
   * - left
   * - right
   * - top-start
   * - top-end
   * - bottom-start
   * - bottom-end
   * - left-start
   * - left-end
   * - right-start
   * - right-end
   */
  placement?: TooltipPlacement;
  /**
   * @param defaultOpen - Default open state of the tooltip
   * @default false
   * @property
   * - true: Open the tooltip
   * - false: Close the tooltip
   */
  defaultOpen?: boolean;
}

/**
 * @param children - Trigger element
 * @param content - Tooltip content
 * @param defaultOpen - Default open state of the tooltip
 * @param placement - Placement of the tooltip
 */
const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(
  ({
    children,
    content,
    defaultOpen = false,
    className,
    placement = 'top',
  }, _ref) => {
    const [open, setOpen] = useState(defaultOpen);
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLDivElement>(null);

    useOutsideClick({ ref: containerRef, setOpen })

    return (
      <div
        ref={containerRef}
        data-komc
        className="komc:flex komc:shrink-0 komc:relative komc:overflow-hidden komc:w-fit komc:h-fit"
      >
        <TooltipTrigger setOpen={setOpen}>
          {children}
        </TooltipTrigger>
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
          placement={placement}
          className={clsx('komc:opacity-0 komc:invisible', className)}
        >
          <span>{content}</span>
        </TooltipContent>
      </div>
    );
  }
);

export default TooltipContainer;
