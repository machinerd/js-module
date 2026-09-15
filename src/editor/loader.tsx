import type { AnyExtension, Extensions, Node } from '@tiptap/core';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Details, {
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import { Align } from './extensions/align';
import { TableControls } from './extensions/table-controls';
import { TableResize } from './extensions/table-resize';
import { BasicImage } from './nodes/basic-image';
import { CustomHeading } from './nodes/custom-heading';
import type {
  NodeViewPlugin,
  PluginNodeOptions,
} from './nodes/node-view-context';
import { SubsetImage } from './nodes/subset-image';
import { Table, TableCell, TableHeader, TableRow } from './nodes/table';
import { TabContent, Tabs, TabTitle } from './nodes/tabs';

type Config<T> = T extends { configure: (options?: infer O) => unknown }
  ? O
  : never;

const applyConfig = <
  E extends { configure: (options?: never) => AnyExtension },
>(
  extension: E,
  options?: Config<E>,
) => (options ? extension.configure(options) : extension);

const isPluginNode = (ext: AnyExtension): ext is Node<PluginNodeOptions> => {
  if (ext.type !== 'node') {
    return false;
  }

  const options: unknown = ext.options;

  if (typeof options !== 'object' || options === null) {
    return false;
  }

  const { plugins, frame } = options as Partial<PluginNodeOptions>;
  return Array.isArray(plugins) && typeof frame === 'boolean';
};

export interface TextSetOptions {
  textStyleKit?: Config<typeof TextStyleKit>;
  starterKit?: Config<typeof StarterKit>;
  customHeading?: Config<typeof CustomHeading>;
}

export interface MediaSetOptions {
  basicImage?: Config<typeof BasicImage>;
  subsetImage?: Config<typeof SubsetImage>;
  youtube?: Config<typeof Youtube>;
}

export interface TableSetOptions {
  table?: Config<typeof Table>;
  tableRow?: Config<typeof TableRow>;
  tableCell?: Config<typeof TableCell>;
  tableHeader?: Config<typeof TableHeader>;
  tableResize?: Config<typeof TableResize>;
  tableControls?: Config<typeof TableControls>;
}

export interface LayoutSetOptions {
  tabs?: Config<typeof Tabs>;
  tabTitle?: Config<typeof TabTitle>;
  tabContent?: Config<typeof TabContent>;
  align?: Config<typeof Align>;
  details?: Config<typeof Details>;
  detailsContent?: Config<typeof DetailsContent>;
  detailsSummary?: Config<typeof DetailsSummary>;
}

type LoaderSet = 'text' | 'media' | 'table' | 'layout';

export class Loader {
  #extensions: Extensions = [];
  #sets = new Set<LoaderSet>();
  #plugins = new Map<string, NodeViewPlugin[]>();
  #frames = new Map<string, boolean>();

  textset(options: TextSetOptions = {}) {
    if (this.#sets.has('text')) {
      return this;
    }

    this.#sets.add('text');

    this.#extensions.push(
      TextStyleKit.configure({
        color: { types: ['textStyle', 'listItem'] },
        ...options.textStyleKit,
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        },
        heading: false,
        ...options.starterKit,
      }),
      CustomHeading.configure({
        levels: [1, 2, 3],
        ...options.customHeading,
      }),
    );

    return this;
  }

  mediaset(options: MediaSetOptions = {}) {
    if (this.#sets.has('media')) {
      return this;
    }

    this.#sets.add('media');

    this.#extensions.push(
      applyConfig(BasicImage, options.basicImage),
      applyConfig(SubsetImage, options.subsetImage),
      Youtube.configure({
        controls: false,
        nocookie: true,
        width: 480,
        height: 320,
        ...options.youtube,
      }),
    );

    return this;
  }

  tableset(options: TableSetOptions = {}) {
    if (this.#sets.has('table')) {
      return this;
    }

    this.#sets.add('table');

    this.#extensions.push(
      Table.configure({
        resizable: true,
        ...options.table,
      }),
      applyConfig(TableRow, options.tableRow),
      applyConfig(TableCell, options.tableCell),
      applyConfig(TableHeader, options.tableHeader),
      applyConfig(TableResize, options.tableResize),
      applyConfig(TableControls, options.tableControls),
    );

    return this;
  }

  layoutset(options: LayoutSetOptions = {}) {
    if (this.#sets.has('layout')) {
      return this;
    }

    this.#sets.add('layout');

    this.#extensions.push(
      applyConfig(Tabs, options.tabs),
      applyConfig(TabTitle, options.tabTitle),
      applyConfig(TabContent, options.tabContent),
      Align.configure({
        types: ['paragraph', 'heading'],
        defaultAlign: 'left',
        ...options.align,
      }),
      Details.configure({
        persist: true,
        HTMLAttributes: {
          class: 'details',
        },
        ...options.details,
      }),
      applyConfig(DetailsContent, options.detailsContent),
      applyConfig(DetailsSummary, options.detailsSummary),
    );

    return this;
  }

  otherset(extensions: Extensions = []) {
    this.#extensions.push(...extensions);
    return this;
  }

  plugins(nodeName: string, plugins: NodeViewPlugin[]) {
    const prev = this.#plugins.get(nodeName) ?? [];
    this.#plugins.set(nodeName, [...prev, ...plugins]);
    return this;
  }

  frame(nodeName: string, enabled: boolean) {
    this.#frames.set(nodeName, enabled);
    return this;
  }

  init(): Extensions {
    if (process.env.NODE_ENV !== 'production') {
      this.#warnUnknownNodes();
    }

    return this.#extensions.map((ext) => {
      const plugins = this.#plugins.get(ext.name);
      const frame = this.#frames.get(ext.name);

      if ((!plugins && frame === undefined) || !isPluginNode(ext)) {
        return ext;
      }

      const current = ext.options;

      return ext.configure({
        plugins: [...current.plugins, ...(plugins ?? [])],
        frame: frame ?? current.frame,
      });
    });
  }

  #warnUnknownNodes() {
    const pluginNodeNames = new Set(
      this.#extensions.filter(isPluginNode).map((ext) => ext.name),
    );
    const targets = new Set([...this.#plugins.keys(), ...this.#frames.keys()]);

    for (const name of targets) {
      if (!pluginNodeNames.has(name)) {
        console.warn(
          `[Loader] "${name}" is not a registered PluginNode. Check the node name or whether that set is loaded.`,
        );
      }
    }
  }
}
