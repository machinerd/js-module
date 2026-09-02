'use client';

import { type NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

export function TabsNode(props: NodeViewProps) {
  const [, forceUpdate] = useState({});

  const titles: string[] = [];
  props.node.forEach((child) => {
    if (child.type.name === 'tabTitle') {
      titles.push(child.textContent);
    }
  });

  const tabsId = useMemo(
    () => props.node.attrs.id || crypto.randomUUID(),
    [props.node.attrs.id],
  );

  const pos = props.getPos();
  const isSelected = (() => {
    if (typeof pos !== 'number') return false;
    const { from, to } = props.editor.state.selection;
    const nodeStart = pos;
    const nodeEnd = pos + props.node.nodeSize;
    return from >= nodeStart && to <= nodeEnd;
  })();

  useEffect(() => {
    if (!props.node.attrs.id) {
      props.updateAttributes({ id: tabsId });
    }
  }, [props.node.attrs.id, props.updateAttributes, tabsId, props]);

  const tabsExtension = props.editor.extensionManager.extensions.find(
    (ext) => ext.name === 'tabs',
  );
  const storage = tabsExtension?.storage as
    { activeTabIndices: Record<string, number> } | undefined;
  const activeIndex = storage?.activeTabIndices?.[tabsId] ?? 0;

  const handleTabClick = (index: number) => {
    if (storage) {
      if (!storage.activeTabIndices) {
        storage.activeTabIndices = {};
      }
      storage.activeTabIndices[tabsId] = index;
      props.editor.view.dispatch(props.editor.state.tr);
    }
  };

  useEffect(() => {
    const handleUpdate = () => forceUpdate({});
    props.editor.on('transaction', handleUpdate);
    return () => {
      props.editor.off('transaction', handleUpdate);
    };
  }, [props.editor]);

  return (
    <NodeViewWrapper>
      <div
        data-komc
        className={clsx(
          'komc:p-1 komc:rounded komc:w-full komc:@container',
          props.editor.isEditable && 'komc:border',
          props.editor.isEditable &&
            (isSelected
              ? 'komc:border-gray-700 komc:shadow'
              : 'komc:border-gray-500'),
        )}
      >
        <div className="komc:grid komc:grid-cols-2 komc:gap-2 komc:@3xl:grid-cols-4">
          {titles.map((title, index) => (
            <button
              type="button"
              key={`tab-button-${index}`}
              onClick={() => handleTabClick(index)}
              className={clsx(
                index === activeIndex && 'komc-active',
                'komc:cursor-pointer komc:px-2 komc:py-1 komc:border komc:outline-0',
                'komc:rounded-sm komc:transition-colors komc:duration-300',
                index === activeIndex
                  ? 'komc:border-brand-blue-01 komc:bg-brand-blue-01 komc:text-white'
                  : 'komc:border-blue-500 komc:text-black komc:bg-gray-100 komc:hover:bg-gray-500',
              )}
            >
              {title}
            </button>
          ))}
        </div>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
}

export function TabTitleNode() {
  return (
    <NodeViewWrapper className="komc:hidden">
      <NodeViewContent />
    </NodeViewWrapper>
  );
}

export function TabContentNode(props: NodeViewProps) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleUpdate = () => forceUpdate({});
    props.editor.on('transaction', handleUpdate);
    return () => {
      props.editor.off('transaction', handleUpdate);
    };
  }, [props.editor]);

  const pos = props.getPos();

  if (typeof pos !== 'number') {
    return (
      <NodeViewWrapper>
        <NodeViewContent />
      </NodeViewWrapper>
    );
  }

  const $pos = props.editor.state.doc.resolve(pos);
  const parentNode = $pos.parent;
  const tabsId = parentNode.attrs.id as string;

  const tabsExtension = props.editor.extensionManager.extensions.find(
    (ext) => ext.name === 'tabs',
  );
  const storage = tabsExtension?.storage as
    { activeTabIndices: Record<string, number> } | undefined;
  const activeIndex = storage?.activeTabIndices?.[tabsId] ?? 0;

  let myIndex = 0;
  for (let i = 0; i < $pos.index(); i++) {
    const sibling = parentNode.child(i);
    if (sibling.type.name === 'tabContent') {
      myIndex++;
    }
  }
  const isActive = myIndex === activeIndex;

  return (
    <NodeViewWrapper className={clsx(!isActive && 'komc:hidden')}>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
