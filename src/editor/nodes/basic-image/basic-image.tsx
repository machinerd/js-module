import Image, { type ImageOptions } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import {
  createPluginNodeOptions,
  createPluginNodeView,
  type PluginNodeOptions,
} from '../node-view-context';
import { SubsetImageNodeView } from '../subset-image/subset-image';
import { imageNodeViewRenderer } from '../../../util/editor';

export type BasicImageOptions = ImageOptions & PluginNodeOptions;

export const BasicImage = Image.extend<BasicImageOptions>({
  group: 'block',
  atom: true,
  draggable: true,
  addOptions() {
    return {
      ...(this.parent?.() as ImageOptions),
      ...createPluginNodeOptions(),
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
    return createPluginNodeView(
      SubsetImageNodeView,
      this.options,
      imageNodeViewRenderer,
    );
  },
});
