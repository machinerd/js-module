/* eslint-disable no-nested-ternary */
'use client';

import clsx from 'clsx';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { RESIZE_CONSTANTS } from '../../../hooks/use-drag-resize';
import {
  computeAspectRatio,
  type ComputeAspectRatioWarning,
} from '../../../util/editor';
import { useNodeView, type NodeViewPlugin } from '../node-view-context';

export interface NodeSizeProps {
  width?: number;
  height?: number;
  edit?: boolean;
  setEdit?: (edit: boolean) => void;
  onChange?: (size: { width: number; height: number }) => void;
  onExitEdit?: () => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

const WARNING_COPY: Record<
  ComputeAspectRatioWarning,
  (value: number) => string
> = {
  'width-under-min': (value) => `Minimum width is ${value}px`,
  'width-over-max': (value) => `Maximum width is ${value}px`,
  'height-under-min': (value) => `Minimum height is ${value}px`,
};

export const NodeSize = ({
  width = 0,
  height = 0,
  edit = false,
  setEdit = () => {},
  onChange,
  onExitEdit,
  minWidth = RESIZE_CONSTANTS.DEFAULT_WIDTH,
  minHeight = RESIZE_CONSTANTS.DEFAULT_HEIGHT,
  maxWidth,
  maxHeight,
  className,
}: NodeSizeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const [w, setW] = useState(width);
  const [h, setH] = useState(height);
  const [warning, setWarning] = useState<ComputeAspectRatioWarning | null>(
    null,
  );
  const aspectRatioRef = useRef(width && height ? width / height : 1);

  const resolvedMaxWidth = maxWidth ?? parentWidth ?? Number.POSITIVE_INFINITY;
  const resolvedMaxHeight = maxHeight ?? Number.POSITIVE_INFINITY;

  const aspectParams = useMemo(
    () => ({
      min: { width: minWidth, height: minHeight },
      max: { width: resolvedMaxWidth, height: resolvedMaxHeight },
    }),
    [minHeight, minWidth, resolvedMaxHeight, resolvedMaxWidth],
  );

  useLayoutEffect(() => {
    if (maxWidth != null) {
      return;
    }

    const parent = rootRef.current?.parentElement;
    const container = parent?.parentElement ?? parent;
    if (!container) {
      return;
    }

    const update = () => {
      setParentWidth(container.clientWidth);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [maxWidth]);

  useEffect(() => {
    const parent = rootRef.current?.parentElement;
    if (!parent) {
      return;
    }

    const handleLeave = () => {
      if (!edit) {
        return;
      }

      setEdit(false);
      onExitEdit?.();
    };

    parent.addEventListener('mouseleave', handleLeave);
    return () => parent.removeEventListener('mouseleave', handleLeave);
  }, [edit, onExitEdit, setEdit]);

  const handleEdit = () => {
    if (!edit) {
      setEdit(true);

      if (width && height) {
        aspectRatioRef.current = width / height;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (edit) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEdit();
    }
  };

  const handleChangeWidth = (event: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(event.target.value)) return;

    const nextW = Number(event.target.value);
    const {
      width: nextWidth,
      height: nextHeight,
      result,
    } = computeAspectRatio({
      ...aspectParams,
      width: nextW,
      height: h,
      type: 'width',
      currentRatio: aspectRatioRef.current,
    });

    setW(nextWidth);
    setH(nextHeight);
    setWarning(result);
  };

  const handleChangeHeight = (event: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(event.target.value)) return;

    const nextH = Number(event.target.value);
    const {
      width: nextWidth,
      height: nextHeight,
      result,
    } = computeAspectRatio({
      ...aspectParams,
      width: w,
      height: nextH,
      type: 'height',
      currentRatio: aspectRatioRef.current,
    });

    setW(nextWidth);
    setH(nextHeight);
    setWarning(result);
  };

  const handleSave = () => {
    if (warning || w < minWidth || w > resolvedMaxWidth || h < minHeight) {
      return;
    }

    setEdit(false);
    onChange?.({ width: w, height: h });
  };

  useEffect(() => {
    setW(width);
    setH(height);

    if (width && height) {
      aspectRatioRef.current = width / height;
    }

    const { result: widthResult } = computeAspectRatio({
      ...aspectParams,
      width,
      height,
      type: 'width',
      currentRatio: aspectRatioRef.current,
    });
    const { result: heightResult } = computeAspectRatio({
      ...aspectParams,
      width,
      height,
      type: 'height',
      currentRatio: aspectRatioRef.current,
    });

    setWarning(widthResult || heightResult || null);
  }, [aspectParams, edit, height, width]);

  const warningValue =
    warning === 'width-over-max'
      ? resolvedMaxWidth
      : warning === 'height-under-min'
        ? minHeight
        : minWidth;

  return (
    <div
      ref={rootRef}
      data-komc
      role={edit ? undefined : 'button'}
      tabIndex={edit ? undefined : 0}
      className={clsx(
        'komc:absolute komc:flex komc:flex-col komc:items-center komc:justify-center',
        'komc:text-center komc:text-base komc:text-black',
        edit
          ? 'komc:z-55 komc:-inset-1.5 komc:bg-white/60 komc:opacity-100'
          : clsx(
              'komc:top-1/2 komc:left-1/2 komc:z-40 komc:-translate-x-1/2',
              'komc:-translate-y-1/2 komc:opacity-0 komc:group-hover:opacity-100',
            ),
        className,
      )}
      onClick={handleEdit}
      onKeyDown={handleKeyDown}
    >
      <div
        className={clsx(
          'komc:relative komc:flex komc:flex-row komc:items-center komc:justify-center komc:gap-x-1',
          !edit && 'komc:cursor-pointer',
        )}
      >
        <div className="komc:relative komc:inline">
          <AutoWidthInput
            label="Width"
            focus={edit}
            value={w}
            onChange={handleChangeWidth}
            disabled={!edit}
          />
        </div>
        <span>x</span>
        <div className="komc:relative komc:inline">
          <AutoWidthInput
            label="Height"
            value={h}
            onChange={handleChangeHeight}
            disabled={!edit}
          />
        </div>
        {edit && (
          <button
            type="button"
            aria-label="Save size"
            onClick={(event) => {
              event.stopPropagation();
              handleSave();
            }}
            disabled={Boolean(warning)}
            className={clsx(
              'komc:ml-1 komc:flex komc:h-5 komc:w-5 komc:shrink-0 komc:cursor-pointer',
              'komc:items-center komc:justify-center komc:rounded komc:bg-blue-500',
              'komc:text-white komc:hover:bg-blue-600',
              'komc:disabled:pointer-events-none komc:disabled:hidden',
            )}
          >
            <CheckIcon />
          </button>
        )}
        {edit && warning && (
          <div className="komc:absolute komc:top-6 komc:text-xs komc:whitespace-nowrap komc:text-red-600">
            {WARNING_COPY[warning](warningValue)}
          </div>
        )}
      </div>
    </div>
  );
};

interface AutoWidthInputProps {
  label: string;
  focus?: boolean;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const AutoWidthInput = ({
  label,
  focus = false,
  value,
  onChange,
  disabled,
}: AutoWidthInputProps) => {
  const [width, setWidth] = useState(30);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.offsetWidth || 30);
    }
  }, [value]);

  useEffect(() => {
    if (focus && !disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, focus]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="komc:pointer-events-none komc:invisible komc:absolute komc:whitespace-pre komc:text-base"
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
        aria-label={label}
        className="komc:bg-transparent komc:text-center komc:text-base komc:outline-none komc:disabled:pointer-events-none"
        style={{ width: `${width + 8}px` }}
      />
    </>
  );
};

const CheckIcon = () => (
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface NodeSizePluginOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const nodeSize = (
  options: NodeSizePluginOptions = {},
): NodeViewPlugin => {
  return function NodeSizePlugin() {
    const { node, updateAttributes, editor, getPos } = useNodeView<{
      width: number;
      height: number;
    }>();
    const [edit, setEdit] = useState(false);
    const [containerWidth, setContainerWidth] = useState<number>();
    const width = Number(node.attrs.width);
    const height = Number(node.attrs.height);

    useLayoutEffect(() => {
      if (options.maxWidth != null) {
        return;
      }

      const pos = getPos();
      if (typeof pos !== 'number') {
        return;
      }

      const dom = editor.view.nodeDOM(pos);
      if (!(dom instanceof HTMLElement)) {
        return;
      }

      const update = () => {
        setContainerWidth(dom.clientWidth);
      };

      update();
      const observer = new ResizeObserver(update);
      observer.observe(dom);
      return () => observer.disconnect();
    }, [editor, getPos]);

    return (
      <NodeSize
        width={width}
        height={height}
        edit={edit}
        setEdit={setEdit}
        onChange={updateAttributes}
        onExitEdit={() => editor.commands.focus()}
        minWidth={options.minWidth}
        minHeight={options.minHeight}
        maxWidth={options.maxWidth ?? containerWidth}
        maxHeight={options.maxHeight}
      />
    );
  };
};

export const NodeSizePlugin = nodeSize();
