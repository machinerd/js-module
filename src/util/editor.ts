/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Editor,
  Extension,
  generateHTML,
  generateJSON,
  Node,
  posToDOMRect,
} from '@tiptap/core';

interface JSONNode {
  type: string;
  content?: JSONNode[];
  [key: string]: any;
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
  nodeNames: string[],
  extensions: Array<Extension | Node> = [],
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

type Input =
  | string
  | null
  | undefined
  | string
  | null
  | undefined
  | Array<Record<string, any>>;

export function parseDescription(
  input: string,
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseOptions,
): string;
export function parseDescription(
  input: null,
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseOptions,
): null;
export function parseDescription(
  input: undefined,
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseOptions,
): undefined;
export function parseDescription(
  input: string | null | undefined,
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseOptions,
): string | null | undefined;
export function parseDescription(
  input: string | null,
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseOptions,
): string | null;
export function parseDescription(
  input: string | undefined,
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseOptions,
): string | undefined;
export function parseDescription<T extends Record<string, any>>(
  input: T[],
  extensions: Array<Extension | Node>,
  excludeNodes: string[],
  options?: ParseArrayOptions<Extract<keyof T, string>>,
): T[];

export function parseDescription(
  input: Input,
  extensions: Array<Extension | Node> = [],
  excludeNodes: string[] = [],
  options: ParseArrayOptions<string> = {},
): string | null | undefined | Array<Record<string, any>> {
  const { default: defaultValue, fields = DEFAULT_FIELDS } = options;
  const hasDefault = defaultValue !== undefined;

  if (input === null) return null;
  if (input === undefined) return undefined;

  if (typeof input === 'string') {
    const cleaned = removeNodes(excludeNodes, extensions, input);
    return hasDefault ? cleaned || defaultValue : cleaned;
  }

  if (Array.isArray(input)) {
    return input.map((item) => {
      const patch: Record<string, any> = {};

      for (const field of fields) {
        if (!(field in item)) continue;

        const raw = item[field];
        if (raw != null && typeof raw !== 'string') continue;

        const cleaned =
          raw == null ? raw : removeNodes(excludeNodes, extensions, raw);

        patch[field] = hasDefault ? cleaned || defaultValue : cleaned;
      }

      return Object.keys(patch).length > 0 ? { ...item, ...patch } : item;
    });
  }

  return input;
}

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
