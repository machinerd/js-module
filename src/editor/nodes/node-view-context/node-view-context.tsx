'use client';

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import clsx from 'clsx';
import {
  createContext,
  useContext,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type NodeViewPlugin = ComponentType<NodeViewProps>;

type NodeWithAttrs<TAttrs> = Omit<NodeViewProps['node'], 'attrs'> & {
  attrs: TAttrs;
};

export interface NodeViewValue<TAttrs = Record<string, unknown>> extends Omit<
  NodeViewProps,
  'node' | 'updateAttributes'
> {
  node: NodeWithAttrs<TAttrs>;
  updateAttributes: (attributes: Partial<TAttrs>) => void;
}

const NodeViewContext = createContext<NodeViewProps | null>(null);
const NodeViewPluginContext = createContext<NodeViewPlugin[]>([]);

export function useNodeView<
  TAttrs = Record<string, unknown>,
>(): NodeViewValue<TAttrs> {
  const value = useContext(NodeViewContext);

  if (!value) {
    throw new Error('useNodeView must be used inside a node view');
  }

  return value as NodeViewValue<TAttrs>;
}

export const useNodeViewPlugins = () => useContext(NodeViewPluginContext);

interface NodeViewChromeProps {
  value: NodeViewProps;
  plugins?: NodeViewPlugin[];
  children: ReactNode;
}

export const NodeViewChrome = ({
  value,
  plugins = [],
  children,
}: NodeViewChromeProps) => {
  return (
    <NodeViewContext.Provider value={value}>
      <NodeViewPluginContext.Provider value={plugins}>
        {children}
      </NodeViewPluginContext.Provider>
    </NodeViewContext.Provider>
  );
};

export const withNodeViewChrome = <P extends NodeViewProps>(
  View: ComponentType<P>,
  plugins: NodeViewPlugin[] = [],
) => {
  const NodeViewWithChrome = (props: P) => {
    return (
      <NodeViewChrome value={props} plugins={plugins}>
        <View {...props} />
      </NodeViewChrome>
    );
  };

  return NodeViewWithChrome;
};

const wrapperClasses =
  'komc:relative komc:flex komc:w-full komc:min-w-0 komc:max-w-full komc:flex-row komc:items-center komc:overscroll-none komc:touch-none komc:select-none komc:group';

const frameClasses =
  'komc-node-frame komc:relative komc:flex komc:min-w-0 komc:h-full komc:w-full komc:max-w-full komc:justify-center';

export interface PluginNodeViewProps {
  className?: string;
  frameClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const PluginNodeView = ({
  className,
  frameClassName,
  style,
  children,
}: PluginNodeViewProps) => {
  const value = useContext(NodeViewContext);
  const plugins = useNodeViewPlugins();

  if (!value) {
    throw new Error('PluginNodeView must be used inside a node view');
  }

  return (
    <NodeViewWrapper className={clsx(wrapperClasses, className)}>
      <div className={clsx(frameClasses, frameClassName)} style={style}>
        {children}
        {plugins.map((Plugin, index) => (
          <Plugin key={index} {...value} />
        ))}
      </div>
    </NodeViewWrapper>
  );
};
