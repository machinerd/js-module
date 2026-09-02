import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import {
  Plugin,
  PluginKey,
  TextSelection,
  type EditorState,
} from '@tiptap/pm/state';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import { CellSelection, TableMap } from '@tiptap/pm/tables';

export interface ActiveControl {
  type: 'col' | 'row';
  index: number;
  rect: DOMRect;
}

export interface TableControlsStorage {
  onControlClick: ((data: ActiveControl) => void) | null;
}

declare module '@tiptap/core' {
  interface Storage {
    tableControls: TableControlsStorage;
  }
}

const tableControlsKey = new PluginKey('tableControls');

const CLASS = {
  activeCell: 'komc-active-cell',
  colControl: 'komc-table-col-control',
  rowControl: 'komc-table-row-control',
} as const;

interface TableControlMeta {
  refresh: true;
}

const getTableContext = (state: EditorState) => {
  try {
    const { selection } = state;
    const { $from } = selection;

    let cellNode: Node | null = null;
    let cellAbsPos = -1;

    for (let d = $from.depth; d >= 0; d--) {
      const node = $from.node(d);
      if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
        cellNode = node;
        cellAbsPos = $from.before(d);
        break;
      }
    }

    if (!cellNode || cellAbsPos === -1) {
      return null;
    }

    let tableNode: Node | null = null;
    let tablePos = -1;

    for (let d = $from.depth - 1; d >= 0; d--) {
      const node = $from.node(d);
      if (node.type.name === 'table') {
        tableNode = node;
        tablePos = d === 0 ? 0 : $from.before(d);
        break;
      }
    }

    if (!tableNode || tablePos === -1) {
      return null;
    }

    const map = TableMap.get(tableNode);
    const cellRelPos = cellAbsPos - tablePos - 1;

    const mapIndex = map.map.indexOf(cellRelPos);
    if (mapIndex === -1) {
      return null;
    }

    const activeRow = Math.floor(mapIndex / map.width);
    const activeCol = mapIndex % map.width;

    return {
      tablePos,
      tableNode,
      map,
      activeRow,
      activeCol,
      activeCellAbsPos: cellAbsPos,
      activeCellNodeSize: cellNode.nodeSize,
    };
  } catch {
    return null;
  }
};

const createControlButton = (
  index: number,
  type: 'col' | 'row',
): HTMLElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = type === 'col' ? CLASS.colControl : CLASS.rowControl;
  button.dataset[type] = String(index);
  button.setAttribute('contenteditable', 'false');
  button.textContent = '⋯';
  button.addEventListener('mousedown', (e) => e.preventDefault());

  return button;
};

const buildTableControlDecorations = (
  state: EditorState,
  editor: Editor,
): DecorationSet => {
  try {
    if (!editor.isFocused || !editor.isActive('table')) {
      return DecorationSet.empty;
    }

    const ctx = getTableContext(state);
    if (!ctx) {
      return DecorationSet.empty;
    }

    const {
      tablePos,
      map,
      activeRow,
      activeCol,
      activeCellAbsPos,
      activeCellNodeSize,
    } = ctx;

    const decorations: Decoration[] = [
      Decoration.node(activeCellAbsPos, activeCellAbsPos + activeCellNodeSize, {
        class: CLASS.activeCell,
      }),
    ];

    const colCellRelPos = map.map[activeCol];
    const colCellAbsPos = tablePos + 1 + colCellRelPos;

    decorations.push(
      Decoration.widget(
        colCellAbsPos + 1,
        () => createControlButton(activeCol, 'col'),
        { side: -1 },
      ),
    );

    const rowCellRelPos = map.map[activeRow * map.width];
    const rowCellAbsPos = tablePos + 1 + rowCellRelPos;

    decorations.push(
      Decoration.widget(
        rowCellAbsPos + 1,
        () => createControlButton(activeRow, 'row'),
        { side: -1 },
      ),
    );

    return DecorationSet.create(state.doc, decorations);
  } catch {
    return DecorationSet.empty;
  }
};

export const TableControls = Extension.create<object, TableControlsStorage>({
  name: 'tableControls',
  addStorage() {
    return {
      onControlClick: null,
    };
  },
  addProseMirrorPlugins() {
    const { editor, storage } = this;

    const refreshDecorations = (view: EditorView) => {
      const meta: TableControlMeta = { refresh: true };
      view.dispatch(view.state.tr.setMeta(tableControlsKey, meta));
    };

    const clearCellSelectionOnBlur = (view: EditorView) => {
      const { state } = view;
      if (!(state.selection instanceof CellSelection)) {
        return;
      }

      const $head = state.selection.$headCell;
      const pos = Math.min($head.pos + 1, state.doc.content.size);
      view.dispatch(
        state.tr.setSelection(TextSelection.create(state.doc, pos)),
      );
    };

    return [
      new Plugin({
        key: tableControlsKey,
        state: {
          init(_, state) {
            return buildTableControlDecorations(state, editor);
          },
          apply(tr, decorations, _oldState, newState) {
            const meta = tr.getMeta(tableControlsKey) as
              TableControlMeta | undefined;
            if (meta?.refresh) {
              return buildTableControlDecorations(newState, editor);
            }

            if (!tr.selectionSet && !tr.docChanged) {
              return decorations;
            }

            if (tr.docChanged && !tr.selectionSet) {
              if (decorations === DecorationSet.empty) {
                return DecorationSet.empty;
              }
              return buildTableControlDecorations(newState, editor);
            }

            return buildTableControlDecorations(newState, editor);
          },
        },
        view() {
          let lastFocused = editor.isFocused;
          let lastActiveTable = editor.isActive('table');

          return {
            update(view) {
              const focused = editor.isFocused;
              const activeTable = editor.isActive('table');

              if (focused === lastFocused && activeTable === lastActiveTable) {
                return;
              }

              lastFocused = focused;
              lastActiveTable = activeTable;
              refreshDecorations(view);
            },
          };
        },
        props: {
          decorations(state) {
            return tableControlsKey.getState(state);
          },
          handleDOMEvents: {
            focus(view) {
              refreshDecorations(view);
              return false;
            },
            blur(view) {
              clearCellSelectionOnBlur(view);
              refreshDecorations(view);
              return false;
            },
            click(_, event) {
              const target = event.target as HTMLElement;
              const colControl = target.closest(`.${CLASS.colControl}`);
              const rowControl = target.closest(`.${CLASS.rowControl}`);

              if (colControl) {
                const col = Number(colControl.getAttribute('data-col'));
                const rect = colControl.getBoundingClientRect();

                storage.onControlClick?.({
                  type: 'col',
                  index: col,
                  rect,
                });

                event.preventDefault();
                return true;
              }

              if (rowControl) {
                const row = Number(rowControl.getAttribute('data-row'));
                const rect = rowControl.getBoundingClientRect();

                storage.onControlClick?.({
                  type: 'row',
                  index: row,
                  rect,
                });

                event.preventDefault();
                return true;
              }

              return false;
            },
          },
        },
      }),
    ];
  },
});
