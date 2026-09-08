import type { Editor, Extensions, Node, NodeViewRenderer } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { NodeView as ProseMirrorNodeView } from '@tiptap/pm/view';
import {
  generateHTML,
  generateJSON,
  posToDOMRect,
  ReactNodeView,
  type ReactNodeViewProps,
  type ReactNodeViewRendererOptions,
} from '@tiptap/react';
import type { ComponentType } from 'react';

export const IMAGE_NODE_DRAGGING_ATTR = 'data-image-node-dragging';

const EMPTY_DRAG_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const PREVIEW_SIZE = 300;

const needsFloatingPreview = () =>
  typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);

interface DragPreviewParams {
  src: string;
  dom: HTMLElement;
  dragHandle: HTMLElement;
}

interface PreviewSize {
  width: number;
  height: number;
}

let endFloatingPreview: (() => void) | null = null;
let documentDragEndRefCount = 0;

const nodeImg = (dom: HTMLElement) => {
  const img = dom.querySelector('img');
  return img instanceof HTMLImageElement ? img : null;
};

const readyImg = (dom: HTMLElement) => {
  const img = nodeImg(dom);
  return img && img.complete && img.naturalWidth > 0 ? img : null;
};

const previewSrc = (source: HTMLImageElement | null, src: string) =>
  source?.currentSrc || source?.src || src;

const nodeSrc = (node: PMNode) => (node.attrs.src as string) ?? '';

const getPreviewDimensions = (source: HTMLImageElement | null): PreviewSize => {
  const naturalWidth = source?.naturalWidth ?? 1;
  const naturalHeight = source?.naturalHeight ?? 1;

  if (naturalWidth >= naturalHeight) {
    return {
      width: PREVIEW_SIZE,
      height: Math.round(PREVIEW_SIZE * (naturalHeight / naturalWidth)),
    };
  }

  return {
    width: Math.round(PREVIEW_SIZE * (naturalWidth / naturalHeight)),
    height: PREVIEW_SIZE,
  };
};

const dragOffset = (
  event: DragEvent,
  handle: HTMLElement,
  preview: PreviewSize,
) => {
  const rect = handle.getBoundingClientRect();
  const relX = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0.5;
  const relY = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
  return {
    x: relX * preview.width,
    y: relY * preview.height,
  };
};

const mountOffscreen = (node: HTMLElement) => {
  const box = document.createElement('div');
  box.className =
    'komc:pointer-events-none komc:fixed komc:-top-9999 komc:-left-9999';
  box.appendChild(node);
  document.body.appendChild(box);
  return () => requestAnimationFrame(() => box.remove());
};

const createPreviewImageEl = (
  source: HTMLImageElement | null,
  src: string,
  size: PreviewSize,
) => {
  const img = document.createElement('img');
  img.alt = '';
  img.draggable = false;
  img.className = 'komc:block komc:object-contain';
  img.style.width = `${size.width}px`;
  img.style.height = `${size.height}px`;
  img.src = previewSrc(source, src);
  return img;
};

const suppressNativeGhost = (event: DragEvent) => {
  const img = document.createElement('img');
  img.src = EMPTY_DRAG_GIF;
  const remove = mountOffscreen(img);
  try {
    event.dataTransfer?.setDragImage(img, 0, 0);
  } finally {
    remove();
  }
};

const setTransferDragImage = (
  event: DragEvent,
  source: HTMLImageElement | null,
  src: string,
  size: PreviewSize,
  offset: { x: number; y: number },
) => {
  const img = createPreviewImageEl(source, src, size);
  const remove = mountOffscreen(img);
  try {
    event.dataTransfer?.setDragImage(img, offset.x, offset.y);
  } finally {
    remove();
  }
};

const setFloatingDragPreview = (
  event: DragEvent,
  source: HTMLImageElement | null,
  src: string,
  size: PreviewSize,
  offset: { x: number; y: number },
) => {
  const root = document.createElement('div');
  root.setAttribute('data-floating-drag-preview', '');
  root.className =
    'komc:pointer-events-none komc:fixed komc:z-10000 komc:overflow-hidden komc:opacity-70';
  root.style.width = `${size.width}px`;
  root.style.height = `${size.height}px`;

  const img = createPreviewImageEl(source, src, size);
  img.className = 'komc:block komc:h-full komc:w-full komc:object-contain';
  root.appendChild(img);
  document.body.appendChild(root);

  let stopped = false;

  const move = (e: DragEvent) => {
    if (stopped || (e.clientX === 0 && e.clientY === 0)) {
      return;
    }
    root.style.left = `${e.clientX - offset.x}px`;
    root.style.top = `${e.clientY - offset.y}px`;
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    move(e);
  };

  const stop = () => {
    if (stopped) {
      return;
    }
    stopped = true;
    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('dragend', stop);
    document.removeEventListener('drop', stop);
    root.remove();
    if (endFloatingPreview === stop) {
      endFloatingPreview = null;
    }
  };

  document.addEventListener('dragover', onDragOver);
  document.addEventListener('dragend', stop);
  document.addEventListener('drop', stop);
  endFloatingPreview = stop;
  move(event);
};

export const teardownDragPreview = () => {
  endFloatingPreview?.();
  endFloatingPreview = null;
  document
    .querySelectorAll('[data-floating-drag-preview]')
    .forEach((el) => el.remove());
};

const ensureDocumentDragEndListeners = () => {
  if (documentDragEndRefCount++ > 0) {
    return;
  }
  document.addEventListener('dragend', teardownDragPreview);
  document.addEventListener('drop', teardownDragPreview);
};

const releaseDocumentDragEndListeners = () => {
  if (documentDragEndRefCount <= 0) {
    return;
  }
  documentDragEndRefCount -= 1;
  if (documentDragEndRefCount === 0) {
    document.removeEventListener('dragend', teardownDragPreview);
    document.removeEventListener('drop', teardownDragPreview);
  }
};

const startDragPreview = (event: DragEvent, params: DragPreviewParams) => {
  teardownDragPreview();
  params.dom.setAttribute(IMAGE_NODE_DRAGGING_ATTR, '');

  const source = nodeImg(params.dom);
  const size = getPreviewDimensions(readyImg(params.dom));
  const offset = dragOffset(event, params.dragHandle, size);

  if (needsFloatingPreview()) {
    suppressNativeGhost(event);
    setFloatingDragPreview(event, source, params.src, size, offset);
    return;
  }

  setTransferDragImage(event, source, params.src, size, offset);
};

type ImageNodeViewOptions = Partial<ReactNodeViewRendererOptions>;

class ImageReactNodeView<T = HTMLElement> extends ReactNodeView<T> {
  mount() {
    super.mount();
    ensureDocumentDragEndListeners();
  }

  destroy() {
    releaseDocumentDragEndListeners();
    teardownDragPreview();
    this.dom?.removeAttribute(IMAGE_NODE_DRAGGING_ATTR);
    super.destroy();
  }

  onDragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    const dragHandle =
      target.nodeType === 3
        ? target.parentElement?.closest('[data-drag-handle]')
        : target.closest('[data-drag-handle]');

    if (!this.dom || this.contentDOM?.contains(target) || !dragHandle) {
      return;
    }

    startDragPreview(event, {
      dom: this.dom,
      dragHandle: dragHandle as HTMLElement,
      src: nodeSrc(this.node),
    });

    const pos = this.getPos();
    if (typeof pos !== 'number') {
      return;
    }

    const selection = NodeSelection.create(this.editor.state.doc, pos);
    this.editor.view.dispatch(this.editor.state.tr.setSelection(selection));
  }
}

export function imageNodeViewRenderer<T = HTMLElement>(
  component: ComponentType<ReactNodeViewProps<T>>,
  options?: ImageNodeViewOptions,
): NodeViewRenderer {
  return (props) => {
    if (!(props.editor as { contentComponent?: unknown }).contentComponent) {
      return {} as unknown as ProseMirrorNodeView;
    }

    return new ImageReactNodeView<T>(component, props, options);
  };
}

interface JSONNode {
  type: string;
  content?: JSONNode[];
  [key: string]: unknown;
}

const filterNodes = (node: JSONNode, nodeNames: string[]): JSONNode => {
  if (!node.content || !Array.isArray(node.content)) {
    return node;
  }

  return {
    ...node,
    content: node.content
      .filter((child) => !nodeNames.includes(child.type))
      .map((child) => filterNodes(child, nodeNames)),
  };
};

export const removeNodes = (
  extensions: Extensions | Node[],
  nodeNames: string[],
  html?: string | null,
) => {
  if (!html || nodeNames.length === 0) return html;

  try {
    const json = generateJSON(html, extensions) as JSONNode;
    const filtered = filterNodes(json, nodeNames);
    return generateHTML(filtered, extensions);
  } catch (error) {
    console.error('Failed to remove Tiptap nodes:', error);
    return html;
  }
};

const DEFAULT_FIELDS = ['description', 'desc'] as const;

interface ParseOptions {
  default?: string | null;
}

interface ParseArrayOptions<F extends string> extends ParseOptions {
  fields?: readonly F[];
}

type Input = string | null | undefined | Array<Record<string, unknown>>;

export function parseDescription(
  input: string,
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseOptions,
): string;
export function parseDescription(
  input: null,
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseOptions,
): null;
export function parseDescription(
  input: undefined,
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseOptions,
): undefined;
export function parseDescription(
  input: string | null | undefined,
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseOptions,
): string | null | undefined;
export function parseDescription(
  input: string | null,
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseOptions,
): string | null;
export function parseDescription(
  input: string | undefined,
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseOptions,
): string | undefined;
export function parseDescription<T extends Record<string, unknown>>(
  input: T[],
  extensions: Extensions | Node[],
  nodes: string[],
  options?: ParseArrayOptions<Extract<keyof T, string>>,
): T[];

export function parseDescription(
  input: Input,
  extensions: Extensions | Node[],
  nodes: string[] = [],
  options: ParseArrayOptions<string> = {},
): string | null | undefined | Array<Record<string, unknown>> {
  const { default: defaultValue, fields = DEFAULT_FIELDS } = options;
  const hasDefault = defaultValue !== undefined;

  if (input === null) return null;
  if (input === undefined) return undefined;

  if (typeof input === 'string') {
    const cleaned = removeNodes(extensions, nodes, input);
    return hasDefault ? cleaned || defaultValue : cleaned;
  }

  if (Array.isArray(input)) {
    return input.map((item) => {
      const patch: Record<string, unknown> = {};

      for (const field of fields) {
        if (!(field in item)) continue;

        const raw = item[field];
        if (raw != null && typeof raw !== 'string') continue;

        const cleaned = raw == null ? raw : removeNodes(extensions, nodes, raw);

        patch[field] = hasDefault ? cleaned || defaultValue : cleaned;
      }

      return Object.keys(patch).length > 0 ? { ...item, ...patch } : item;
    });
  }

  return input;
}

interface ComputeAspectRatioParams {
  min: { width: number; height: number };
  max: { width: number; height: number };
  width: number;
  height: number;
  type: 'width' | 'height';
  currentRatio?: number;
}

export type ComputeAspectRatioWarning =
  'width-under-min' | 'width-over-max' | 'height-under-min';

interface ComputeAspectRatioResult {
  width: number;
  height: number;
  result: ComputeAspectRatioWarning | null;
}

export const computeAspectRatio = ({
  min,
  max,
  width,
  height,
  type,
  currentRatio,
}: ComputeAspectRatioParams): ComputeAspectRatioResult => {
  let w = width;
  let h = height;
  let result: ComputeAspectRatioWarning | null = null;
  const ratio =
    typeof currentRatio === 'number' ? currentRatio : width / height;

  if (type === 'width') {
    h = Math.round(width / ratio);

    if (width < min.width) {
      result = 'width-under-min';
    }
    if (width > max.width) {
      result = 'width-over-max';
    }
    if (h < min.height) {
      result = 'height-under-min';
    }
  }
  if (type === 'height') {
    w = Math.round(height * ratio);

    if (height < min.height) {
      result = 'height-under-min';
    }
    if (w < min.width) {
      result = 'width-under-min';
    }
    if (w > max.width) {
      result = 'width-over-max';
    }
  }

  return { width: w, height: h, result };
};

const LARGE_SELECTION_HEIGHT_RATIO = 0.75;

export function isLargeTextSelection(editor: Editor) {
  const { view, state } = editor;
  const { from, to } = state.selection;
  const selectionRect = posToDOMRect(view, from, to);
  const editorRect = view.dom.getBoundingClientRect();
  const docSize = state.doc.content.size;

  return (
    (from <= 1 && to >= docSize - 1) ||
    selectionRect.height >= editorRect.height * LARGE_SELECTION_HEIGHT_RATIO
  );
}

export function visibleSelectionRect(editor: Editor): DOMRect {
  const { view, state } = editor;
  const { from, to } = state.selection;

  const fromCoords = view.coordsAtPos(from);
  const toCoords = view.coordsAtPos(to);

  const editorRect = view.dom.getBoundingClientRect();
  const viewTop = Math.max(editorRect.top, 0);
  const viewBottom = Math.min(editorRect.bottom, window.innerHeight);

  const selTop = Math.min(fromCoords.top, toCoords.top);
  const selBottom = Math.max(fromCoords.bottom, toCoords.bottom);

  const top = Math.max(selTop, viewTop);
  const bottom = Math.min(selBottom, viewBottom);

  const left = editorRect.left;
  const right = editorRect.right;

  const anchorY = (top + bottom) / 2;

  return new DOMRect(left, anchorY, Math.max(right - left, 0), 0);
}
