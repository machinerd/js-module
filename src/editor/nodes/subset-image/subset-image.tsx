'use client';

import { mergeAttributes, type NodeViewProps } from '@tiptap/react';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { Image } from '../../../ui/image';
import { imageNodeViewRenderer } from '../../../util/editor';
import {
  createPluginNodeView,
  PluginNode,
  PluginNodeView,
  useNodeViewEditable,
} from '../node-view-context';
import type { AlignType } from '../../extensions/align';
import clsx from 'clsx';

export const SUBSET_IMAGE = {
  name: 'imageNode',
  tag: 'image-node',
};

export type SubsetImagePosition = AlignType;

export interface SubsetImageAttrs {
  src: string;
  alt: string;
  width: number;
  height: number;
  imagePosition: AlignType;
  imageRadius: number;
  originalWidth: number;
}

const classes = cva('', {
  variants: {
    imagePosition: {
      center: 'komc:justify-center',
      right: 'komc:justify-end',
      left: 'komc:justify-start',
    },
  },
  defaultVariants: {
    imagePosition: 'left',
  },
});

export const SubsetImageNodeView = ({ node }: NodeViewProps) => {
  const {
    src,
    alt = '',
    width = 0,
    height = 0,
    imagePosition = 'left',
    imageRadius = 0,
    originalWidth = 1280,
  } = node.attrs;
  const isEditable = useNodeViewEditable();
  const numericWidth = useMemo(() => Number(width), [width]);
  const numericHeight = useMemo(() => Number(height), [height]);
  const numericOriginalWidth = useMemo(
    () => Number(originalWidth),
    [originalWidth],
  );
  const numericImageRadius = useMemo(() => Number(imageRadius), [imageRadius]);

  return (
    <PluginNodeView
      className={classes({ imagePosition })}
      style={{ width: `min(${numericWidth}px, 100%)` }}
    >
      <div
        className={clsx(
          'komc:h-full komc:w-full komc:overflow-hidden',
          isEditable ? 'komc:cursor-grab' : 'komc:cursor-default',
        )}
        style={{ borderRadius: `${numericImageRadius}%` }}
        data-drag-handle={isEditable ? 'true' : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={numericWidth}
          height={numericHeight}
          fallbackSrc={src}
          originalWidth={numericOriginalWidth}
          className="komc:m-0! komc:h-auto komc:w-full komc:object-contain komc:object-center komc:p-0!"
        />
      </div>
    </PluginNodeView>
  );
};

export const SubsetImage = PluginNode.extend({
  name: SUBSET_IMAGE.name,
  group: 'block',
  atom: true,
  draggable: true,
  parseHTML() {
    return [{ tag: SUBSET_IMAGE.tag }];
  },
  renderHTML({ HTMLAttributes }) {
    return [SUBSET_IMAGE.tag, mergeAttributes(HTMLAttributes)];
  },
  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      width: { default: 400 },
      height: { default: 400 },
      imagePosition: { default: 'left' },
      imageRadius: { default: 0 },
      originalWidth: { default: 1280 },
    };
  },
  addNodeView() {
    return createPluginNodeView(
      SubsetImageNodeView,
      this.options,
      imageNodeViewRenderer,
    );
  },
});
