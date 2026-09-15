'use client';

import {
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditorState,
  type NodeViewProps,
  type NodeViewRenderer,
  type ReactNodeViewProps,
} from '@tiptap/react';
import clsx from 'clsx';
import {
  createContext,
  useContext,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/** 플러그인은 ref 없는 NodeViewProps를 받음 */
export type NodeViewPlugin = ComponentType<NodeViewProps>;

/** ReactNodeViewRenderer에 넘길 수 있는 뷰 컴포넌트 */
export type NodeViewComponent = ComponentType<ReactNodeViewProps>;

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

export interface PluginNodeOptions {
  /** 주입할 플러그인 (기본 없음) */
  plugins: NodeViewPlugin[];
  /** komc-node-frame 래퍼 사용 여부 */
  frame: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

const NodeViewContext = createContext<NodeViewProps | null>(null);
const NodeViewPluginContext = createContext<NodeViewPlugin[]>([]);
const NodeViewFrameContext = createContext<boolean>(true);

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
export const useNodeViewFrame = () => useContext(NodeViewFrameContext);

/** 에디터 편집 가능 여부 (setEditable 변경에도 반응) */
export const useNodeViewEditable = () => {
  const { editor } = useNodeView();

  return useEditorState({
    editor,
    selector: ({ editor: e }) => e.isEditable,
  });
};

interface NodeViewChromeProps {
  value: NodeViewProps;
  plugins?: NodeViewPlugin[];
  frame?: boolean;
  children: ReactNode;
}

export const NodeViewChrome = ({
  value,
  plugins = [],
  frame = true,
  children,
}: NodeViewChromeProps) => (
  <NodeViewContext.Provider value={value}>
    <NodeViewPluginContext.Provider value={plugins}>
      <NodeViewFrameContext.Provider value={frame}>
        {children}
      </NodeViewFrameContext.Provider>
    </NodeViewPluginContext.Provider>
  </NodeViewContext.Provider>
);

export const withNodeViewChrome = (
  View: NodeViewComponent,
  plugins: NodeViewPlugin[] = [],
  frame = true,
) => {
  const NodeViewWithChrome = (props: ReactNodeViewProps) => {
    const { ref: _ref, ...value } = props;

    return (
      <NodeViewChrome value={value} plugins={plugins} frame={frame}>
        <View {...props} />
      </NodeViewChrome>
    );
  };

  NodeViewWithChrome.displayName = `WithNodeViewChrome(${
    View.displayName || View.name || 'View'
  })`;

  return NodeViewWithChrome;
};

/* -------------------------------------------------------------------------- */
/*                               PluginNodeView                               */
/* -------------------------------------------------------------------------- */

const wrapperClasses =
  'komc:relative komc:flex komc:w-full komc:min-w-0 komc:max-w-full komc:flex-row komc:items-center komc:overscroll-none komc:touch-none komc:select-none komc:group';

/** 크기를 담당하는 박스 (frame 여부와 무관하게 항상 렌더) */
const boxClasses =
  'komc:flex komc:min-w-0 komc:h-full komc:w-full komc:max-w-full';

/** 프레임 전용 스타일 */
const frameClasses = 'komc-node-frame komc:relative komc:justify-center';

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
  const frame = useNodeViewFrame();

  if (!value) {
    throw new Error('PluginNodeView must be used inside a node view');
  }

  return (
    <NodeViewWrapper className={clsx(wrapperClasses, className)}>
      <div
        className={clsx(boxClasses, frame && frameClasses, frameClassName)}
        style={style}
      >
        {children}
        {plugins.map((Plugin, index) => (
          <Plugin key={index} {...value} />
        ))}
      </div>
    </NodeViewWrapper>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 PluginNode                                 */
/* -------------------------------------------------------------------------- */

export const createPluginNodeOptions = (): PluginNodeOptions => ({
  plugins: [],
  frame: true,
});

export const PluginNode = Node.create<PluginNodeOptions>({
  name: 'pluginNode',
  addOptions() {
    return createPluginNodeOptions();
  },
});

export type NodeViewRendererFactory = (
  component: NodeViewComponent,
) => NodeViewRenderer;

/** 자식 노드의 addNodeView에서 호출 */
export const createPluginNodeView = (
  View: NodeViewComponent,
  options: PluginNodeOptions,
  renderer: NodeViewRendererFactory = (component) =>
    ReactNodeViewRenderer(component),
) => renderer(withNodeViewChrome(View, options.plugins, options.frame));
