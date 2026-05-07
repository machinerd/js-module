import { RefObject, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import TooltipContent from './tooltip-content';
import TooltipArrow from './tooltip-arrow';
import { MainPlacement, TooltipPlacement } from './tooltip-container';

const BOX_PADDING = 16;
const ARROW_HALF_WIDTH = 8;
const GAP = BOX_PADDING + ARROW_HALF_WIDTH;
const LAYOUT_STABLE_FRAMES = 2;
const LAYOUT_TRACK_MAX_FRAMES = 180;

export interface TooltipPortalProps {
  placement: TooltipPlacement;
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
  const [dynamicPlacement, setDynamicPlacement] = useState<TooltipPlacement>(placement);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateLayout = useCallback(() => {
    const container = containerRef.current;
    const box = hiddenRef.current;

    if (!container || !box) return;

    const containerRect = container.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();

    let currentPlacement = placement;
    const [main] = currentPlacement.split('-');

    const spaceAbove = containerRect.top;
    const spaceBelow = window.innerHeight - containerRect.bottom;

    if (main === 'bottom' && spaceBelow < boxRect.height && spaceAbove >= boxRect.height) {
      currentPlacement = changePlacement(currentPlacement, 'top');
    } else if (main === 'top' && spaceAbove < boxRect.height && spaceBelow >= boxRect.height) {
      currentPlacement = changePlacement(currentPlacement, 'bottom');
    }

    setDynamicPlacement(currentPlacement);

    const [newMain, newSub] = currentPlacement.split('-');
    let top = containerRect.top;
    let left = containerRect.left + containerRect.width / 2 - boxRect.width / 2;

    switch (newMain) {
      case 'top':
        top -= boxRect.height;
        break;
      case 'bottom':
        top += containerRect.height;
        break;
    }

    switch (newSub) {
      case 'start':
        left += boxRect.width / 2 - GAP;
        break;
      case 'end':
        left -= boxRect.width / 2 - GAP;
        break;
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
  }, [placement, containerRef, hiddenRef]);

  useEffect(() => {
    if (!mounted || !open) return;

    console.log('updateLayout');

    let cancelled = false;
    let throttleRafId = 0;
    let layoutRafId = 0;
    let ticking = false;

    updateLayout();

    const handleScrollOrResize = () => {
      if (!ticking) {
        throttleRafId = requestAnimationFrame(() => {
          if (!cancelled) updateLayout();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    let frame = 0;
    let stableCount = 0;
    let lastKey = '';

    const trackLayoutShift = () => {
      if (cancelled || frame >= LAYOUT_TRACK_MAX_FRAMES) return;

      const el = containerRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const key = `${r.top.toFixed(4)},${r.left.toFixed(4)},${r.width.toFixed(4)},${r.height.toFixed(4)}`;

        if (key === lastKey) {
          stableCount += 1;
        } else {
          stableCount = 0;
          lastKey = key;
          updateLayout();
        }
      }

      if (stableCount < LAYOUT_STABLE_FRAMES) {
        frame += 1;
        layoutRafId = requestAnimationFrame(trackLayoutShift);
      }
    };

    layoutRafId = requestAnimationFrame(trackLayoutShift);

    return () => {
      cancelled = true;
      cancelAnimationFrame(throttleRafId);
      cancelAnimationFrame(layoutRafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [mounted, open, updateLayout, containerRef]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <TooltipContent
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