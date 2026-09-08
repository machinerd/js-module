import { Extension, isNodeSelection } from '@tiptap/core';

export type AlignType = 'left' | 'center' | 'right';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    align: {
      setAlign: (align: AlignType) => ReturnType;
      unsetAlign: () => ReturnType;
    };
  }
}

export const Align = Extension.create<{
  types: string[];
  defaultAlign: AlignType;
}>({
  name: 'align',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultAlign: 'left',
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          align: {
            default: this.options.defaultAlign,
            parseHTML: (el) =>
              el.getAttribute('data-align') ?? this.options.defaultAlign,
            renderHTML: (attrs) => {
              if (!attrs.align || attrs.align === this.options.defaultAlign) {
                return {};
              }

              return {
                'data-align': attrs.align,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setAlign:
        (align) =>
        ({ editor, commands }) => {
          const { selection } = editor.state;

          if (isNodeSelection(selection)) {
            const node = selection.node;
            if (this.options.types.includes(node.type.name)) {
              return commands.updateAttributes(node.type.name, { align });
            }
          }

          const { $from } = selection;

          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (this.options.types.includes(node.type.name)) {
              return commands.updateAttributes(node.type.name, { align });
            }
          }

          return false;
        },
      unsetAlign:
        () =>
        ({ editor, commands }) => {
          const { selection } = editor.state;

          if (isNodeSelection(selection)) {
            const node = selection.node;
            if (this.options.types.includes(node.type.name)) {
              return commands.updateAttributes(node.type.name, {
                align: this.options.defaultAlign,
              });
            }
          }

          const { $from } = selection;

          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (this.options.types.includes(node.type.name)) {
              return commands.updateAttributes(node.type.name, {
                align: this.options.defaultAlign,
              });
            }
          }

          return false;
        },
    };
  },
});
