import { forwardRef, HTMLAttributes, useRef, useState } from 'react';
import TooltipTrigger from './tooltip-trigger';
import { useOutsideClick } from '../../hooks/use-outside-click';
import TooltipContent from './tooltip-content';
import clsx from 'clsx';
import TooltipPortal from './tooltip-portal';

type SubPlacement = 'start' | 'end';
export type MainPlacement = 'top' | 'bottom';
/**
 * `top`/`bottom` centers the tooltip over/under the trigger.
 * `-start` puts the arrow near the tooltip's left edge (tooltip extends to
 * the right); `-end` puts it near the right edge.
 */
export type TooltipPlacement =
  MainPlacement | `${MainPlacement}-${SubPlacement}`;

/**
 * Props for `Tooltip`. Only `className` is used from the HTML attributes;
 * the rest are ignored.
 */
export interface TooltipContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element. Hover, focus or click opens the tooltip. */
  children: React.ReactNode;
  /** Tooltip text. Plain text only. */
  content: string;
  /**
   * Preferred side. Flips between top and bottom when there is not enough
   * space.
   * @default 'top'
   */
  placement?: TooltipPlacement;
  /**
   * Open on first render.
   * @default false
   */
  defaultOpen?: boolean;
  /** Class name for the tooltip bubble (not the trigger). */
  className?: string;
}

/**
 * Text tooltip shown on hover, focus or click of `children`, rendered in a
 * portal and kept in the viewport on scroll/resize. Closes on mouse leave,
 * blur or outside click.
 *
 * @example
 * <Tooltip content="Copied to clipboard" placement="bottom">
 *   <button type="button">Copy</button>
 * </Tooltip>
 */
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
