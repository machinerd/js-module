'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

export interface LimitSize {
  width: boolean;
  height: boolean;
}

export interface ResizeHandleProps {
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: React.PointerEvent<HTMLElement>) => void;
  style: { touchAction: 'none' };
}

export interface UseDragResizeProps {
  boundaryRef?: React.RefObject<HTMLElement | null>;
  size: Size;
  keepAspectRatio?: boolean;
  limitSize?: LimitSize;
  minSize?: Size;
  maxSize?: Size;
  onResize?: (size: Size) => void;
  onResizeEnd?: (size: Size) => void;
}

interface DragSession {
  pointerId: number;
  startX: number;
  startY: number;
  startSize: Size;
  direction: ResizeDirection;
  lastSize: Size;
}

interface ResizeOptions {
  boundaryRef?: React.RefObject<HTMLElement | null>;
  size: Size;
  keepAspectRatio: boolean;
  limitSize: LimitSize;
  minSize: Size;
  maxSize?: Size;
  onResize?: (size: Size) => void;
  onResizeEnd?: (size: Size) => void;
}

const DEFAULT_MIN_SIZE: Size = {
  width: RESIZE_CONSTANTS.DEFAULT_WIDTH,
  height: RESIZE_CONSTANTS.DEFAULT_HEIGHT,
};

const DEFAULT_LIMIT_SIZE: LimitSize = { width: true, height: true };

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined) next = Math.max(next, min);
  if (max !== undefined) next = Math.min(next, max);
  return next;
}

function calculateRawSize(
  direction: ResizeDirection,
  startSize: Size,
  deltaX: number,
  deltaY: number,
): Size {
  const next = { ...startSize };

  if (direction.includes('left')) next.width = startSize.width - deltaX;
  if (direction.includes('right')) next.width = startSize.width + deltaX;
  if (direction.includes('top')) next.height = startSize.height - deltaY;
  if (direction.includes('bottom')) next.height = startSize.height + deltaY;

  return next;
}

function resolveMaxSize(
  boundary: DOMRect | undefined,
  limitSize: LimitSize,
  maxSize?: Size,
): { width?: number; height?: number } {
  const widths: number[] = [];
  const heights: number[] = [];

  if (maxSize?.width !== undefined) widths.push(maxSize.width);
  if (maxSize?.height !== undefined) heights.push(maxSize.height);

  if (boundary) {
    if (limitSize.width) widths.push(boundary.width);
    if (limitSize.height) heights.push(boundary.height);
  }

  return {
    width: widths.length ? Math.min(...widths) : undefined,
    height: heights.length ? Math.min(...heights) : undefined,
  };
}

function applyAspectRatio(
  size: Size,
  direction: ResizeDirection,
  ratio: number,
): Size {
  const { width, height } = size;

  if (direction === 'left' || direction === 'right') {
    return { width, height: width / ratio };
  }

  if (direction === 'top' || direction === 'bottom') {
    return { width: height * ratio, height };
  }

  const fromWidth = { width, height: width / ratio };
  const fromHeight = { width: height * ratio, height };
  const widthDelta = Math.abs(fromWidth.height - height);
  const heightDelta = Math.abs(fromHeight.width - width);

  return widthDelta <= heightDelta ? fromWidth : fromHeight;
}

function fitSize(
  size: Size,
  minSize: Size,
  maxSize: { width?: number; height?: number },
  ratio: number | null,
): Size {
  if (!ratio) {
    return {
      width: Math.ceil(clamp(size.width, minSize.width, maxSize.width)),
      height: Math.ceil(clamp(size.height, minSize.height, maxSize.height)),
    };
  }

  let { width, height } = size;

  if (width <= 0 || height <= 0) {
    width = minSize.width;
    height = minSize.width / ratio;
  }

  const scaleDown = Math.min(
    maxSize.width !== undefined ? maxSize.width / width : 1,
    maxSize.height !== undefined ? maxSize.height / height : 1,
    1,
  );
  width *= scaleDown;
  height *= scaleDown;

  const scaleUp = Math.max(
    width < minSize.width ? minSize.width / width : 1,
    height < minSize.height ? minSize.height / height : 1,
    1,
  );
  width *= scaleUp;
  height *= scaleUp;

  const fitMax = Math.min(
    maxSize.width !== undefined ? maxSize.width / width : 1,
    maxSize.height !== undefined ? maxSize.height / height : 1,
    1,
  );
  width *= fitMax;
  height *= fitMax;

  return { width: Math.ceil(width), height: Math.ceil(height) };
}

function computeSize(
  event: PointerEvent | React.PointerEvent,
  session: DragSession,
  options: ResizeOptions,
): Size {
  const raw = calculateRawSize(
    session.direction,
    session.startSize,
    event.clientX - session.startX,
    event.clientY - session.startY,
  );

  const ratio =
    options.keepAspectRatio && session.startSize.height > 0
      ? session.startSize.width / session.startSize.height
      : null;

  const sized = ratio ? applyAspectRatio(raw, session.direction, ratio) : raw;
  const maxSize = resolveMaxSize(
    options.boundaryRef?.current?.getBoundingClientRect(),
    options.limitSize,
    options.maxSize,
  );

  return fitSize(sized, options.minSize, maxSize, ratio);
}

export function useDragResize({
  boundaryRef,
  size,
  keepAspectRatio = true,
  minSize = DEFAULT_MIN_SIZE,
  maxSize,
  limitSize = DEFAULT_LIMIT_SIZE,
  onResize,
  onResizeEnd,
}: UseDragResizeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const sessionRef = useRef<DragSession | null>(null);
  const optionsRef = useRef<ResizeOptions>({
    boundaryRef,
    size,
    keepAspectRatio,
    limitSize,
    minSize,
    maxSize,
    onResize,
    onResizeEnd,
  });

  useEffect(() => {
    optionsRef.current = {
      boundaryRef,
      size,
      keepAspectRatio,
      limitSize,
      minSize,
      maxSize,
      onResize,
      onResizeEnd,
    };
  });

  const endResize = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const session = sessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;

    sessionRef.current = null;
    setIsResizing(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    optionsRef.current.onResizeEnd?.(session.lastSize);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const session = sessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;

      const nextSize = computeSize(event, session, optionsRef.current);
      session.lastSize = nextSize;
      optionsRef.current.onResize?.(nextSize);
    },
    [],
  );

  useEffect(() => {
    return () => {
      sessionRef.current = null;
    };
  }, []);

  const getHandleProps = useCallback(
    (direction: ResizeDirection): ResizeHandleProps => ({
      onPointerDown: (event) => {
        if (event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);

        const currentSize = optionsRef.current.size;
        const startSize = {
          width: currentSize.width,
          height: currentSize.height,
        };

        sessionRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startSize,
          direction,
          lastSize: startSize,
        };
        setIsResizing(true);
      },
      onPointerMove,
      onPointerUp: endResize,
      onPointerCancel: endResize,
      style: { touchAction: 'none' },
    }),
    [onPointerMove, endResize],
  );

  return {
    isResizing,
    getHandleProps,
  };
}
