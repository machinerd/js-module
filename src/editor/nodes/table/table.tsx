import {
  Table as TableNode,
  TableRow as TableRowNode,
  TableCell as TableCellNode,
  TableHeader as TableHeaderNode,
} from '@tiptap/extension-table';

const sanitizeSpan = (raw: string | null): number => {
  if (raw === null) return 1;
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n >= 1 && n <= 1000 ? n : 1;
};

const spanAttr = (attrName: 'colspan' | 'rowspan') => ({
  default: 1,
  parseHTML: (el: HTMLElement) => sanitizeSpan(el.getAttribute(attrName)),
});

export const Table = TableNode.configure({ resizable: true });

export const TableRow = TableRowNode;

export const TableCell = TableCellNode.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      colspan: spanAttr('colspan'),
      rowspan: spanAttr('rowspan'),
    };
  },
});

export const TableHeader = TableHeaderNode.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      colspan: spanAttr('colspan'),
      rowspan: spanAttr('rowspan'),
    };
  },
});
