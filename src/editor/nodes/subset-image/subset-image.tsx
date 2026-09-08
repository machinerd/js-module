'use client';

import { mergeAttributes, Node, type NodeViewProps } from '@tiptap/react';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { Image } from '../../../ui/image';
import { imageNodeViewRenderer } from '../../../util/editor';
import {
  PluginNodeView,
  withNodeViewChrome,
  type NodeViewPlugin,
} from '../node-view-context';
import { NodeResizerPlugin } from '../node-resize';
import { nodeSize, type NodeSizePluginOptions } from '../node-size';
import type { AlignType } from '../../extensions/align';

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

export const imageNodePlugins = (
  size?: NodeSizePluginOptions,
): NodeViewPlugin[] => [nodeSize(size), NodeResizerPlugin];

export const IMAGE_NODE_PLUGINS: NodeViewPlugin[] = imageNodePlugins();

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
        className="komc:h-full komc:w-full komc:overflow-hidden"
        style={{ borderRadius: `${numericImageRadius}%` }}
        data-drag-handle="true"
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

export const subsetImageNodeView = (
  plugins: NodeViewPlugin[] = [],
  size?: NodeSizePluginOptions,
) =>
  imageNodeViewRenderer(
    withNodeViewChrome(SubsetImageNodeView, [
      ...imageNodePlugins(size),
      ...plugins,
    ]),
  );

export const SubsetImage = Node.create<{
  plugins: NodeViewPlugin[];
  size?: NodeSizePluginOptions;
}>({
  name: SUBSET_IMAGE.name,
  group: 'block',
  atom: true,
  draggable: true,
  addOptions() {
    return {
      plugins: [],
      size: {},
    };
  },
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
    return subsetImageNodeView(this.options.plugins, this.options.size);
  },
});
