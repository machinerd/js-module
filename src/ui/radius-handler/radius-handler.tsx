'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import clsx from 'clsx';

const TRACK_SIZE = 12;

export interface RadiusHandlerProps {
  /**
   * Minimum value.
   * @default 0
   */
  min?: number;
  /**
   * Maximum value. A `value` above it is clamped and reported via
   * `onChange`.
   * @default 100
   */
  max?: number;
  /**
   * Current value. Sets the thumb position and the tooltip text, so update
   * it from `onChange`.
   * @default 0
   */
  value?: number;
  /** Called with the new integer value while dragging. */
  onChange?: (value: number) => void;
}

/**
 * Horizontal slider for a percentage-like value (e.g. border radius).
 * Shows a `{value}%` tooltip while dragging.
 *
 * @example
 * const [radius, setRadius] = useState(0);
 *
 * <RadiusHandler value={radius} onChange={setRadius} max={50} />
 */
export default function RadiusHandler({
  min = 0,
  max = 100,
  value = 0,
  onChange = () => {},
}: RadiusHandlerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number } },
  ) => {
    if (!trackRef.current) {
      return;
    }

    const trackWidth = trackRef.current.offsetWidth - TRACK_SIZE;
    let newX =
      info.point.x - trackRef.current.getBoundingClientRect().left - 10;
    newX = Math.max(0, Math.min(trackWidth, newX));

    const newValue = Math.round((newX / trackWidth) * (max - min) + min);
    const clampedValue = Math.max(min, Math.min(max, newValue));

    onChange?.(clampedValue);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number } },
  ) => {
    setIsDragging(false);

    if (!trackRef.current) {
      return;
    }

    const trackWidth = trackRef.current.offsetWidth - TRACK_SIZE;
    let newX =
      info.point.x - trackRef.current.getBoundingClientRect().left - 10;
    newX = Math.max(0, Math.min(trackWidth, newX));

    x.set(newX);
  };

  useEffect(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.offsetWidth - TRACK_SIZE;
      const adjustedValue = Math.min(value, max);

      if (adjustedValue !== value) {
        onChange?.(adjustedValue);
      }

      const initialX = ((adjustedValue - min) / (max - min)) * trackWidth;

      x.set(initialX);
    }
  }, [value, min, max, x, onChange]);

  return (
    <div
      data-komc
      className="komc:flex komc:items-center komc:w-full komc:h-7 komc:bg-neutral-50 komc:rounded-md komc:px-1 komc:shadow-sm"
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={trackRef}
        className="komc:flex komc:w-full komc:h-2 komc:bg-white komc:rounded-full komc:relative komc:select-none komc:touch-none"
      >
        <motion.div
          className="komc:flex komc:shrink-0 komc:aspect-square komc:top-0 komc:left-0 komc:z-2 komc:absolute komc:select-none komc:touch-none"
          style={{ x, width: `${TRACK_SIZE}px`, height: `${TRACK_SIZE}px` }}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          dragConstraints={trackRef}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          <div
            className={clsx(
              'komc:w-full komc:h-full komc:bg-orange-500 komc:rounded-full komc:absolute komc:-top-0.5 komc:left-0 komc:cursor-grab',
              isDragging && 'komc:cursor-grabbing',
            )}
          >
            <RadiusSliderTooltip isDragging={isDragging} value={value} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const RadiusSliderTooltip = ({
  isDragging,
  value,
}: {
  isDragging: boolean;
  value: number;
}) => {
  return (
    <div
      className={clsx(
        'komc:flex komc:w-fit komc:bg-white komc:text-xs komc:rounded-md komc:px-2',
        'komc:absolute komc:bottom-full komc:left-1/2 komc:-translate-x-1/2 komc:-translate-y-1 komc:drop-shadow-md',
        isDragging ? 'komc:visible' : 'komc:invisible',
      )}
    >
      {`${value}%`}
      <div
        className="komc:absolute komc:top-full komc:left-1/2 komc:-translate-x-1/2 komc:w-0 komc:h-0"
        style={{
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid white',
        }}
      />
    </div>
  );
};
