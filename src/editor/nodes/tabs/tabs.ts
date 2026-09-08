import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TabContentNode, TabTitleNode, TabsNode } from './tabs-node';

export const TABS = {
  name: 'tabs',
  tag: 'tabs',
} as const;

export const TAB_TITLE = {
  name: 'tabTitle',
  tag: 'tab-title',
} as const;

export const TAB_CONTENT = {
  name: 'tabContent',
  tag: 'tab-content',
} as const;

export const Tabs = Node.create({
  name: TABS.name,
  group: 'block',
  content: 'tabTitle+ tabContent+',
  isolating: true,
  parseHTML() {
    return [{ tag: TABS.tag }];
  },
  renderHTML({ HTMLAttributes }) {
    return [TABS.tag, mergeAttributes(HTMLAttributes), 0];
  },
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => ({
          'data-id': attributes.id,
        }),
      },
    };
  },
  addStorage() {
    return {
      activeTabIndices: {} as Record<string, number>,
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(TabsNode);
  },
});

export const TabTitle = Node.create({
  name: TAB_TITLE.name,
  isolating: true,
  defining: true,
  content: 'inline*',
  parseHTML() {
    return [{ tag: TAB_TITLE.tag }];
  },
  renderHTML({ HTMLAttributes }) {
    return [TAB_TITLE.tag, mergeAttributes(HTMLAttributes), 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TabTitleNode);
  },
});

export const TabContent = Node.create({
  name: TAB_CONTENT.name,
  isolating: true,
  defining: true,
  content: 'block+',
  parseHTML() {
    return [{ tag: TAB_CONTENT.tag }];
  },
  renderHTML({ HTMLAttributes }) {
    return [TAB_CONTENT.tag, mergeAttributes(HTMLAttributes), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { $from, empty } = editor.state.selection;

        if (!empty) return false;

        const currentNode = $from.parent;

        if (currentNode.content.size > 0) return false;

        const isInTabContent = $from.node(-1)?.type.name === TAB_CONTENT.name;
        if (!isInTabContent) {
          return false;
        }

        const tabsDepth = $from.depth - 2;
        const tabsNode = $from.node(tabsDepth);

        if (tabsNode.type.name !== TABS.name) {
          return false;
        }

        const tabsPos = $from.before(tabsDepth);
        const afterTabsPos = tabsPos + tabsNode.nodeSize;

        editor.commands.insertContentAt(afterTabsPos, {
          type: 'paragraph',
        });
        editor.commands.setTextSelection(afterTabsPos + 1);

        return true;
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(TabContentNode);
  },
});
