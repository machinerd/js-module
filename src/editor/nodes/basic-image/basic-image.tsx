import Image from '@tiptap/extension-image';
import { type NodeViewPlugin } from '../node-view-context';
import { subsetImageNodeView } from '../subset-image/subset-image';
import { mergeAttributes } from '@tiptap/core';
import type { NodeSizePluginOptions } from '../node-size';

export const BasicImage = Image.extend<{
  plugins: NodeViewPlugin[];
  size?: NodeSizePluginOptions;
}>({
  group: 'block',
  atom: true,
  draggable: true,
  addOptions() {
    return {
      ...this.parent?.(),
      plugins: [],
      size: {},
    };
  },
  parseHTML() {
    return [{ tag: 'img' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },
  addAttributes() {
    return {
      ...this.parent?.(),
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
