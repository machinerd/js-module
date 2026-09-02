import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { CellSelection, columnResizingPluginKey } from '@tiptap/pm/tables';

const FADE_MS = 200;

const PLUGIN_KEY = 'columnResizeHandleFade';
const CLASS = {
  handle: 'column-resize-handle',
  stable: 'resize-handle-stable',
  ghost: 'column-resize-handle-ghost',
  ghostLayer: 'column-resize-handle-ghost-layer',
} as const;

const columnResizeHandleFadeKey = new PluginKey(PLUGIN_KEY);

const getAllResizeHandles = (root: ParentNode) => [
  ...root.querySelectorAll<HTMLElement>(`.${CLASS.handle}`),
];

const prepareHandleForFadeIn = (el: HTMLElement) => {
  if (el.dataset.resizeFadeBound === 'true') {
    return;
  }
  el.dataset.resizeFadeBound = 'true';
  el.classList.remove(CLASS.stable);
};

const prepareAllHandlesForFadeIn = (root: ParentNode) => {
  getAllResizeHandles(root).forEach(prepareHandleForFadeIn);
};

const stabilizeHandles = (root: ParentNode) => {
  getAllResizeHandles(root).forEach((el) => {
    el.dataset.resizeFadeBound = 'true';
    el.classList.add(CLASS.stable);
  });
};

const getGhostMount = (view: EditorView): HTMLElement => {
  let el: HTMLElement | null = view.dom;

  while (el && el !== document.body) {
    const { overflow, overflowY } = getComputedStyle(el);
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflow === 'auto' ||
      overflow === 'scroll'
    ) {
      return el;
    }
    el = el.parentElement;
  }

  return (
    (view.dom.closest('.editor-wrapper') as HTMLElement | null) ??
    view.dom.parentElement ??
    view.dom
  );
};

const syncGhostLayerBounds = (layer: HTMLElement, mount: HTMLElement) => {
  const rect = mount.getBoundingClientRect();
  layer.style.position = 'fixed';
  layer.style.top = `${rect.top}px`;
  layer.style.left = `${rect.left}px`;
  layer.style.width = `${rect.width}px`;
  layer.style.height = `${rect.height}px`;
  layer.style.overflow = 'hidden';
  layer.style.pointerEvents = 'none';
  layer.style.zIndex = '20';
};

const ensureGhostLayer = (
  view: EditorView,
): { layer: HTMLElement; mount: HTMLElement } => {
  const mount = getGhostMount(view);
  const existing = mount.querySelector(`:scope > .${CLASS.ghostLayer}`);
  let layer: HTMLElement;

  if (existing instanceof HTMLElement) {
    layer = existing;
  } else {
    layer = document.createElement('div');
    layer.className = CLASS.ghostLayer;
    layer.setAttribute('data-komc', '');
    mount.appendChild(layer);
  }

  syncGhostLayerBounds(layer, mount);
  return { layer, mount };
};

const clearGhosts = (view: EditorView) => {
  const { layer } = ensureGhostLayer(view);
  layer.querySelectorAll(`.${CLASS.ghost}`).forEach((ghost) => ghost.remove());
};

const spawnResizeHandleGhost = (
  rect: DOMRect,
  layer: HTMLElement,
  mountRect: DOMRect,
) => {
  if (rect.width === 0 && rect.height === 0) {
    return;
  }

  const ghost = document.createElement('div');
  ghost.className = CLASS.ghost;
  ghost.style.top = `${rect.top - mountRect.top}px`;
  ghost.style.left = `${rect.left - mountRect.left}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  layer.appendChild(ghost);

  const remove = () => ghost.remove();
  ghost.addEventListener('animationend', remove, { once: true });
  window.setTimeout(remove, FADE_MS + 50);
};

const spawnResizeHandleGhosts = (rects: DOMRect[], view: EditorView) => {
  const { layer, mount } = ensureGhostLayer(view);
  const mountRect = mount.getBoundingClientRect();
  rects.forEach((rect) => spawnResizeHandleGhost(rect, layer, mountRect));
};

const snapshotHandleRects = (view: EditorView): DOMRect[] =>
  getAllResizeHandles(view.dom).map((handle) => handle.getBoundingClientRect());

const isColumnResizing = (state: EditorState) =>
  Boolean(columnResizingPluginKey.getState(state)?.dragging);

const shouldBlockColumnResize = (view: EditorView): boolean =>
  view.hasFocus() && view.state.selection instanceof CellSelection;

const clearColumnResizeHandle = (view: EditorView) => {
  const pluginState = columnResizingPluginKey.getState(view.state);
  if (pluginState && pluginState.activeHandle > -1) {
    view.dispatch(
      view.state.tr.setMeta(columnResizingPluginKey, { setHandle: -1 }),
    );
  }
};

const isHandleRelatedNode = (node: Node): boolean => {
  if (!(node instanceof HTMLElement)) return false;
  if (node.classList.contains(CLASS.handle)) return true;
  return node.querySelector(`.${CLASS.handle}`) !== null;
};

const createResizeHandleObserver = (view: EditorView) => {
  let lastHandleRects: DOMRect[] = [];
  let trackRafId: number | null = null;
  let handlesVisible = false;
  let isFadingOut = false;
  let fadeOutQueued = false;

  const stopTracking = () => {
    if (trackRafId !== null) {
      cancelAnimationFrame(trackRafId);
      trackRafId = null;
    }
  };

  const trackHandleRects = () => {
    const rects = snapshotHandleRects(view);
    if (rects.length === 0) {
      trackRafId = null;
      return;
    }

    lastHandleRects = rects;
    trackRafId = requestAnimationFrame(trackHandleRects);
  };

  const startTracking = () => {
    if (trackRafId !== null) {
      return;
    }
    trackHandleRects();
  };

  const beginFadeOut = (rects: DOMRect[]) => {
    if (isFadingOut || rects.length === 0 || isColumnResizing(view.state)) {
      return;
    }

    isFadingOut = true;
    handlesVisible = false;
    lastHandleRects = [];
    stopTracking();

    clearGhosts(view);
    spawnResizeHandleGhosts(rects, view);

    window.setTimeout(() => {
      isFadingOut = false;
    }, FADE_MS + 100);
  };

  const queueFadeOut = () => {
    if (fadeOutQueued || isFadingOut || !handlesVisible) {
      return;
    }

    const rects = [...lastHandleRects];
    if (rects.length === 0) {
      return;
    }

    fadeOutQueued = true;
    handlesVisible = false;

    queueMicrotask(() => {
      fadeOutQueued = false;

      if (
        getAllResizeHandles(view.dom).length > 0 ||
        isColumnResizing(view.state)
      ) {
        handlesVisible = true;
        isFadingOut = false;
        startTracking();
        return;
      }

      beginFadeOut(rects);
    });
  };

  const onHandlesAppeared = () => {
    const count = getAllResizeHandles(view.dom).length;
    if (count === 0) {
      return;
    }

    fadeOutQueued = false;
    isFadingOut = false;
    handlesVisible = true;

    const handles = getAllResizeHandles(view.dom);
    const needsFadeIn = handles.some(
      (el) => el.dataset.resizeFadeBound !== 'true',
    );

    if (needsFadeIn) {
      prepareAllHandlesForFadeIn(view.dom);
    } else {
      stabilizeHandles(view.dom);
    }

    startTracking();
  };

  const syncHandleVisibility = () => {
    if (isColumnResizing(view.state)) {
      if (getAllResizeHandles(view.dom).length > 0) {
        fadeOutQueued = false;
        isFadingOut = false;
        handlesVisible = true;
        stabilizeHandles(view.dom);
        startTracking();
      }
      return;
    }

    const count = getAllResizeHandles(view.dom).length;

    if (count > 0) {
      onHandlesAppeared();
      return;
    }

    if (!handlesVisible || isFadingOut || fadeOutQueued) {
      return;
    }

    queueFadeOut();
  };

  const observer = new MutationObserver((mutations) => {
    let hasHandleChange = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (isHandleRelatedNode(node)) {
          hasHandleChange = true;
          break;
        }
      }
      if (hasHandleChange) break;
      for (const node of m.removedNodes) {
        if (isHandleRelatedNode(node)) {
          hasHandleChange = true;
          break;
        }
      }
      if (hasHandleChange) break;
    }

    if (hasHandleChange) {
      syncHandleVisibility();
    }
  });

  observer.observe(view.dom, { childList: true, subtree: true });

  if (getAllResizeHandles(view.dom).length > 0) {
    prepareAllHandlesForFadeIn(view.dom);
    handlesVisible = true;
    startTracking();
  }

  return {
    update(_view: EditorView, prevState: EditorState) {
      const wasDragging = isColumnResizing(prevState);
      const isDragging = isColumnResizing(view.state);

      if (wasDragging === isDragging) {
        return;
      }

      requestAnimationFrame(() => {
        syncHandleVisibility();
      });
    },
    destroy() {
      observer.disconnect();
      stopTracking();
      clearGhosts(view);
    },
  };
};

export const TableResize = Extension.create({
  name: PLUGIN_KEY,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: columnResizeHandleFadeKey,
        props: {
          handleDOMEvents: {
            mousemove(view) {
              if (!shouldBlockColumnResize(view)) {
                return false;
              }
              clearColumnResizeHandle(view);
              return true;
            },
            mousedown(view) {
              if (!shouldBlockColumnResize(view)) {
                return false;
              }
              const pluginState = columnResizingPluginKey.getState(view.state);
              if (pluginState && pluginState.activeHandle > -1) {
                clearColumnResizeHandle(view);
                return true;
              }
              return false;
            },
          },
        },
        view(view) {
          return createResizeHandleObserver(view);
        },
      }),
    ];
  },
});
