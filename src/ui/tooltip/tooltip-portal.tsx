import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { debounce } from 'lodash-es';
import TooltipContent from './tooltip-content';
import TooltipArrow from './tooltip-arrow';
import { MainPlacement, TooltipPlacement } from './tooltip-container';

const BOX_PADDING = 16;
const ARROW_HALF_WIDTH = 8;
const GAP = BOX_PADDING + ARROW_HALF_WIDTH;

export interface TooltipPortalProps {
  placement: TooltipPlacement
  className?: string;
  content: string;
  open?: boolean;
  hiddenRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
}

const changePlacement = (
  placement: TooltipPlacement,
  newMain: MainPlacement,
): TooltipPlacement => {
  const [, sub] = placement.split('-');

  return sub ? (`${newMain}-${sub}` as TooltipPlacement) : newMain;
};

export default function TooltipPortal({
  placement,
  className,
  content,
  open,
  hiddenRef,
  containerRef,
}: TooltipPortalProps) {
  const [mounted, setMounted] = useState(false);
  const tooltipContentRef = useRef<HTMLDivElement>(null);
  const [dynamicPlacement, setDynamicPlacement] =
    useState<TooltipPlacement>(placement);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = useState({ x: 0, y: 0 });

  const updatePosition = useCallback(
    debounce(() => {
      const container = containerRef?.current;
      const box = hiddenRef.current;

      if (!container || !box) return;

      const containerRect = container.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      const [main, sub] = dynamicPlacement.split('-');

      let top = scrollTop + containerRect.top;
      let left =
        scrollLeft +
        containerRect.left +
        containerRect.width / 2 -
        boxRect.width / 2;

      switch (main) {
        case 'top':
          top -= boxRect.height;
          break;
        case 'bottom':
          top += containerRect.height;
          break;
        case 'left':
          top += containerRect.height / 2 - boxRect.height / 2;
          left -= boxRect.width / 2 + containerRect.width / 2;
          break;
        case 'right':
          top += containerRect.height / 2 - boxRect.height / 2;
          left += boxRect.width / 2 + containerRect.width / 2;
          break;
      }

      if (['top', 'bottom'].includes(main)) {
        switch (sub) {
          case 'start':
            left += boxRect.width / 2 - GAP;
            break;
          case 'end':
            left -= boxRect.width / 2 - GAP;
            break;
        }
      }
      if (['left', 'right'].includes(main)) {
        switch (sub) {
          case 'start':
            top += boxRect.height / 2 + containerRect.height / 2 - GAP;
            break;
          case 'end':
            top -= boxRect.height / 2 + containerRect.height / 2 - GAP;
            break;
        }
      }

      let adjustedLeft = left;
      const viewportWidth = window.innerWidth;
      const margin = 4;

      if (adjustedLeft + boxRect.width > viewportWidth - margin) {
        adjustedLeft = viewportWidth - boxRect.width - margin;
      }
      if (adjustedLeft < margin) {
        adjustedLeft = margin;
      }

      setPosition({ top, left: adjustedLeft });
      setArrowOffset({ x: left - adjustedLeft, y: 0 });
    }, 50),
    [dynamicPlacement],
  );

  const updatePlacement = useCallback(
    debounce(() => {
      if (!hiddenRef.current) return;

      const { top, height } = hiddenRef.current.getBoundingClientRect();

      setDynamicPlacement((prev) => {
        let changedPlacement = placement;

        if (top + height >= window.innerHeight) {
          changedPlacement = changePlacement(prev, 'top');
        } else if (top < 0) {
          changedPlacement = changePlacement(prev, 'bottom');
        }

        return changedPlacement;
      });
    }, 50),
    [placement],
  );

  useEffect(() => {
    setMounted(true);

    updatePlacement();

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePlacement, { passive: true });
    window.addEventListener('resize', updatePlacement);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePlacement);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [updatePosition, updatePlacement]);

  useEffect(() => {
    if (mounted) {
      updatePosition();
    }
  }, [mounted, updatePosition]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <TooltipContent
      ref={tooltipContentRef}
      portal
      data-komc
      placement={dynamicPlacement}
      className={clsx(
        className,
        open ? 'komc:visible komc:opacity-100' : 'komc:opacity-0 komc:invisible',
      )}
      style={{ ...position }}
    >
      <span>{content}</span>
      <TooltipArrow placement={dynamicPlacement} offset={arrowOffset} />
    </TooltipContent>,
    document.body,
  );
}
