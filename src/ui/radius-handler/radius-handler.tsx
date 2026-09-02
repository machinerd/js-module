'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import clsx from 'clsx';

const TRACK_SIZE = 12;

export interface RadiusHandlerProps {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
}

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
      className="flex items-center w-full h-7 bg-neutral-50 rounded-md px-1 shadow-sm"
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={trackRef}
        className="flex w-full h-2 bg-white rounded-full relative select-none touch-none"
      >
        <motion.div
          className="flex shrink-0 aspect-square top-0 left-0 z-2 absolute select-none touch-none"
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
              'w-full h-full bg-orange-500 rounded-full absolute -top-0.5 left-0 cursor-grab',
              isDragging && 'cursor-grabbing',
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
        'flex w-fit bg-white text-xs rounded-md px-2 relative',
        'absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 drop-shadow-md',
        isDragging ? 'visible' : 'invisible',
      )}
    >
      {`${value}%`}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid white',
        }}
      />
    </div>
  );
};
