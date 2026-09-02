/* eslint-disable no-nested-ternary */
'use client';

import React, { useCallback, useEffect, useRef } from 'react';

export const RESIZE_CONSTANTS = {
  DEFAULT_WIDTH: 200,
  DEFAULT_HEIGHT: 100,
};

export type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface Size {
  width: number;
  height: number;
}

interface LimitSize {
  width: boolean;
  height: boolean;
}

export interface UseResizeProps {
  boundaryRef: React.RefObject<HTMLElement | null>;
  size: Size;
  keepAspectRatio?: boolean;
  limitSize?: LimitSize;
  minSize?: Size;
  maxSize?: Size;
  direction?: ResizeDirection;
  onResize?: (size: Size) => void;
}

type ResizeEvent = MouseEvent | TouchEvent;
type ResizeReactEvent = React.MouseEvent | React.TouchEvent;

const getEventCoordinates = (e: ResizeEvent) => ({
  x: 'touches' in e ? e.touches[0].screenX : e.screenX,
  y: 'touches' in e ? e.touches[0].screenY : e.screenY,
});

const calculateNewSize = (
  direction: ResizeDirection,
  startSize: Size,
  deltaX: number,
  deltaY: number,
): Size => {
  const newSize = { ...startSize };

  switch (direction) {
    case 'top-left':
      newSize.width = startSize.width - deltaX;
      newSize.height = startSize.height - deltaY;
      break;
    case 'top-right':
      newSize.width = startSize.width + deltaX;
      newSize.height = startSize.height - deltaY;
      break;
    case 'bottom-left':
      newSize.width = startSize.width - deltaX;
      newSize.height = startSize.height + deltaY;
      break;
    case 'bottom-right':
      newSize.width = startSize.width + deltaX;
      newSize.height = startSize.height + deltaY;
      break;
    case 'left':
      newSize.width = startSize.width - deltaX;
      break;
    case 'right':
      newSize.width = startSize.width + deltaX;
      break;
    case 'top':
      newSize.height = startSize.height - deltaY;
      break;
    case 'bottom':
      newSize.height = startSize.height + deltaY;
      break;
  }

  return newSize;
};

const limitSizeToBoundaries = (
  newSize: Size,
  boundary: DOMRect,
  maxSize?: Size,
  limitSize?: LimitSize,
): Size => {
  const limitedSize = { ...newSize };

  if (limitSize?.width || limitSize?.height) {
    const maxWidth = maxSize?.width
      ? Math.min(maxSize.width, boundary.width)
      : boundary.width;
    const maxHeight = maxSize?.height
      ? Math.min(maxSize.height, boundary.height)
      : boundary.height;

    if (limitSize.width) {
      limitedSize.width = Math.min(limitedSize.width, maxWidth);
    }
    if (limitSize.height) {
      limitedSize.height = Math.min(limitedSize.height, maxHeight);
    }
  }

  return limitedSize;
};

function clamp(val: number, min?: number, max?: number) {
  if (min !== undefined) val = Math.max(val, min);
  if (max !== undefined) val = Math.min(val, max);
  return val;
}

function getBoundaryMaxSize(
  boundary: DOMRect | undefined,
  limitSize: LimitSize,
  maxSize?: Size,
) {
  return {
    width:
      maxSize?.width !== undefined
        ? maxSize.width
        : boundary && limitSize.width
          ? boundary.width
          : undefined,
    height:
      maxSize?.height !== undefined
        ? maxSize.height
        : boundary && limitSize.height
          ? boundary.height
          : undefined,
  };
}

function getAspectRatioSize(
  direction: ResizeDirection,
  width: number,
  height: number,
  ratio: number,
) {
  if (['left', 'right'].includes(direction || '')) {
    return { width, height: Math.round(width / ratio) };
  }
  if (['top', 'bottom'].includes(direction || '')) {
    return { width: Math.round(height * ratio), height };
  }
  if (width / ratio <= height) {
    return { width, height: Math.round(width / ratio) };
  } else {
    return { width: Math.round(height * ratio), height };
  }
}

export default function useResize({
  boundaryRef,
  size,
  keepAspectRatio = true,
  minSize = {
    width: RESIZE_CONSTANTS.DEFAULT_WIDTH,
    height: RESIZE_CONSTANTS.DEFAULT_HEIGHT,
  },
  maxSize,
  limitSize = { width: true, height: true },
  direction = 'top',
  onResize,
}: UseResizeProps) {
  const moveHandlerRef = useRef<((e: ResizeEvent) => void) | null>(null);
  const endHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (moveHandlerRef.current) {
        document.removeEventListener('mousemove', moveHandlerRef.current);
        document.removeEventListener('touchmove', moveHandlerRef.current);
      }
      if (endHandlerRef.current) {
        document.removeEventListener('mouseup', endHandlerRef.current);
        document.removeEventListener('touchend', endHandlerRef.current);
      }
    };
  }, []);

  const handleResize = useCallback(
    (newSize: Size) => {
      const limitedSize = {
        width: Math.ceil(
          Math.max(
            minSize.width,
            Math.min(newSize.width, maxSize?.width ?? Infinity),
          ),
        ),
        height: Math.ceil(
          Math.max(
            minSize.height,
            Math.min(newSize.height, maxSize?.height ?? Infinity),
          ),
        ),
      };
      onResize?.(limitedSize);
    },
    [onResize, minSize, maxSize],
  );

  const handleMove = useCallback(
    (
      moveEvent: ResizeEvent,
      params: {
        startX: number;
        startY: number;
        startSize: Size;
        direction: ResizeDirection;
      },
    ) => {
      if ('touches' in moveEvent) moveEvent.preventDefault();

      const { startX, startY, startSize, direction } = params;
      const { x: currentX, y: currentY } = getEventCoordinates(moveEvent);
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      let newSize = calculateNewSize(direction, startSize, deltaX, deltaY);

      if (keepAspectRatio) {
        const ratio = startSize.width / startSize.height;
        const boundary = boundaryRef.current?.getBoundingClientRect();
        const { width: maxWidth, height: maxHeight } = getBoundaryMaxSize(
          boundary,
          limitSize,
          maxSize,
        );

        const width = clamp(newSize.width, minSize.width, maxWidth);
        const height = clamp(newSize.height, minSize.height, maxHeight);

        const { width: newWidth, height: newHeight } = getAspectRatioSize(
          direction,
          width,
          height,
          ratio,
        );

        if (newWidth < minSize.width || newHeight < minSize.height) {
          return;
        }

        newSize = { width: newWidth, height: newHeight };
      }

      if (limitSize.width || limitSize.height) {
        const boundary = boundaryRef.current?.getBoundingClientRect();
        if (boundary) {
          newSize = limitSizeToBoundaries(
            newSize,
            boundary,
            maxSize,
            limitSize,
          );
        }
      }

      handleResize(newSize);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limitSize, maxSize, handleResize, keepAspectRatio, minSize],
  );

  const handleResizeStart = useCallback(
    (e: ResizeReactEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();

      const params = {
        startX: 'touches' in e ? e.touches[0].screenX : e.screenX,
        startY: 'touches' in e ? e.touches[0].screenY : e.screenY,
        startSize: { ...size },
        direction,
      };

      if (moveHandlerRef.current) {
        document.removeEventListener('mousemove', moveHandlerRef.current);
        document.removeEventListener('touchmove', moveHandlerRef.current);
      }
      if (endHandlerRef.current) {
        document.removeEventListener('mouseup', endHandlerRef.current);
        document.removeEventListener('touchend', endHandlerRef.current);
      }

      moveHandlerRef.current = (moveEvent: ResizeEvent) =>
        handleMove(moveEvent, params);
      endHandlerRef.current = () => {
        if (moveHandlerRef.current) {
          document.removeEventListener('mousemove', moveHandlerRef.current);
          document.removeEventListener('touchmove', moveHandlerRef.current);
          moveHandlerRef.current = null;
        }
        if (endHandlerRef.current) {
          document.removeEventListener('mouseup', endHandlerRef.current);
          document.removeEventListener('touchend', endHandlerRef.current);
          endHandlerRef.current = null;
        }
      };

      document.addEventListener('mousemove', moveHandlerRef.current);
      document.addEventListener('touchmove', moveHandlerRef.current, {
        passive: false,
      });
      document.addEventListener('mouseup', endHandlerRef.current, {
        once: true,
      });
      document.addEventListener('touchend', endHandlerRef.current, {
        once: true,
      });
    },
    [size, handleMove],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handleResizeStart(e, direction);
    },
    [handleResizeStart, direction],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      handleResizeStart(e, direction);
    },
    [handleResizeStart, direction],
  );

  return {
    onMouseDown,
    onTouchStart,
  };
}
