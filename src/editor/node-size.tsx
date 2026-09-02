'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { cn } from '../util/common';
import { RESIZE_CONSTANTS } from '../hooks/use-drag-resize';
import {
  computeAspectRatio,
  type ComputeAspectRatioWarning,
} from '../util/format';

const MIN_SIZE = {
  width: RESIZE_CONSTANTS.DEFAULT_WIDTH,
  height: RESIZE_CONSTANTS.DEFAULT_HEIGHT,
};

export interface NodeSizeProps {
  width?: number;
  height?: number;
  maxWidth: number;
  edit?: boolean;
  onEditChange?: (edit: boolean) => void;
  onChange?: (size: { width: number; height: number }) => void;
}

function nextAspectSize(
  width: number,
  height: number,
  type: 'width' | 'height',
  currentRatio: number,
  maxWidth: number,
) {
  return computeAspectRatio({
    min: MIN_SIZE,
    max: { width: maxWidth, height: Number.POSITIVE_INFINITY },
    width,
    height,
    type,
    currentRatio,
  });
}

export function NodeSize({
  width = 0,
  height = 0,
  maxWidth,
  edit,
  onEditChange,
  onChange,
}: NodeSizeProps) {
  const isControlled = edit !== undefined;
  const [uncontrolledEdit, setUncontrolledEdit] = useState(false);
  const isEdit = isControlled ? edit : uncontrolledEdit;

  const [w, setW] = useState(width);
  const [h, setH] = useState(height);
  const [warning, setWarning] = useState<ComputeAspectRatioWarning | null>(
    null,
  );
  const aspectRatioRef = useRef(width && height ? width / height : 1);

  const setIsEdit = (next: boolean) => {
    if (!isControlled) setUncontrolledEdit(next);
    onEditChange?.(next);
  };

  const handleEdit = () => {
    if (isEdit) return;

    setIsEdit(true);

    if (width && height) {
      aspectRatioRef.current = width / height;
    }
  };

  const handleChangeWidth = (event: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(event.target.value)) return;

    const {
      width: nextWidth,
      height: nextHeight,
      result,
    } = nextAspectSize(
      Number(event.target.value),
      h,
      'width',
      aspectRatioRef.current,
      maxWidth,
    );

    setW(nextWidth);
    setH(nextHeight);
    setWarning(result);
  };

  const handleChangeHeight = (event: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(event.target.value)) return;

    const {
      width: nextWidth,
      height: nextHeight,
      result,
    } = nextAspectSize(
      w,
      Number(event.target.value),
      'height',
      aspectRatioRef.current,
      maxWidth,
    );

    setW(nextWidth);
    setH(nextHeight);
    setWarning(result);
  };

  const handleSave = () => {
    if (warning || w < MIN_SIZE.width || w > maxWidth || h < MIN_SIZE.height) {
      return;
    }

    setIsEdit(false);
    onChange?.({ width: w, height: h });
  };

  useEffect(() => {
    setW(width);
    setH(height);

    if (width && height) {
      aspectRatioRef.current = width / height;
    }

    const { result: widthResult } = nextAspectSize(
      width,
      height,
      'width',
      aspectRatioRef.current,
      maxWidth,
    );
    const { result: heightResult } = nextAspectSize(
      width,
      height,
      'height',
      aspectRatioRef.current,
      maxWidth,
    );

    setWarning(widthResult || heightResult || null);
  }, [width, height, isEdit, maxWidth]);

  return (
    <div
      className={cn(
        'komc:flex komc:flex-col komc:justify-center komc:items-center',
        'komc:text-base komc:text-center komc:text-black komc:absolute',
        isEdit
          ? 'komc:opacity-100 komc:-inset-1.5 komc:bg-white/60 komc:z-20'
          : cn(
            'komc:z-10 komc:opacity-0 komc:group-hover:opacity-100',
            'komc:top-1/2 komc:-translate-y-1/2 komc:left-1/2 komc:-translate-x-1/2',
          ),
      )}
    >
      {!isEdit && (
        <button
          type="button"
          className="komc:absolute komc:inset-0 komc:cursor-pointer"
          onClick={handleEdit}
          aria-label="노드 크기 수정"
        />
      )}
      <div
        className={cn(
          'komc:flex komc:flex-row komc:justify-center komc:items-center komc:gap-x-1 komc:relative',
          !isEdit && 'komc:cursor-pointer',
        )}
      >
        <div className="komc:inline komc:relative">
          <AutoWidthInput
            shouldFocus={isEdit}
            value={w}
            onChange={handleChangeWidth}
            disabled={!isEdit}
          />
        </div>
        <span>x</span>
        <div className="komc:inline komc:relative">
          <AutoWidthInput
            value={h}
            onChange={handleChangeHeight}
            disabled={!isEdit}
          />
        </div>
        {isEdit && warning && (
          <span
            className="komc:flex komc:shrink-0 komc:justify-center komc:items-center komc:w-5 komc:h-5 komc:ml-1 komc:text-red-600"
            aria-label="입력값이 허용 범위를 벗어났습니다"
          >
            <WarningIcon />
          </span>
        )}
        {isEdit && !warning && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleSave();
            }}
            className={cn(
              'komc:flex komc:shrink-0 komc:justify-center komc:items-center',
              'komc:w-5 komc:h-5 komc:ml-1 komc:rounded',
              'komc:bg-blue-500 komc:text-white komc:hover:bg-blue-600 komc:cursor-pointer',
            )}
          >
            <CheckIcon />
          </button>
        )}
      </div>
    </div>
  );
}

interface AutoWidthInputProps {
  shouldFocus?: boolean;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function AutoWidthInput({
  shouldFocus,
  value,
  onChange,
  disabled,
}: AutoWidthInputProps) {
  const [inputWidth, setInputWidth] = useState(30);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth || 30);
    }
  }, [value]);

  useEffect(() => {
    if (!disabled && shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, shouldFocus]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="komc:absolute komc:invisible komc:whitespace-pre komc:text-base komc:pointer-events-none"
      >
        {value || ' '}
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={5}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="komc:text-center komc:text-base komc:outline-none komc:bg-transparent komc:disabled:pointer-events-none"
        style={{ width: `${inputWidth + 8}px` }}
      />
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="M8 4.5v5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.9" fill="white" />
    </svg>
  );
}
