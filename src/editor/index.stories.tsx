import { Loader } from '.';
import { EditorProvider } from '../providers/editor';
import { Label } from '../ui/admin/label';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import { useMemo, useState } from 'react';

const DESC_FIELD_WIDTH = 829;

interface EditorStoryArgs {
  textset: boolean;
  mediaset: boolean;
  tableset: boolean;
  layoutset: boolean;
}

const createExtensions = (args: EditorStoryArgs) => {
  const loader = new Loader();

  if (args.textset) {
    loader.textset();
  }
  if (args.mediaset) {
    loader.mediaset();
  }
  if (args.tableset) {
    loader.tableset();
  }
  if (args.layoutset) {
    loader.layoutset();
  }

  return loader.init();
};

const meta = {
  title: 'editor/Editor',
  tags: ['editor'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    textset: {
      control: 'boolean',
      description: 'TextStyleKit, StarterKit, CustomHeading',
    },
    mediaset: {
      control: 'boolean',
      description: 'BasicImage, SubsetImage, Youtube',
    },
    tableset: {
      control: 'boolean',
      description: 'Table, TableResize, TableControls',
    },
    layoutset: {
      control: 'boolean',
      description: 'Tabs, Align, Details',
    },
  },
  args: {
    textset: true,
    mediaset: true,
    tableset: true,
    layoutset: true,
  },
} satisfies Meta<EditorStoryArgs>;

export default meta;

type Story = StoryObj<EditorStoryArgs>;

function EditorPlayground({
  textset,
  mediaset,
  tableset,
  layoutset,
}: EditorStoryArgs) {
  const [, setHtml] = useState('');
  const extensions = useMemo(
    () => createExtensions({ textset, mediaset, tableset, layoutset }),
    [layoutset, mediaset, tableset, textset],
  );

  const editor = useEditor({
    immediatelyRender: true,
    extensions,
    content: '',
    editorProps: {
      attributes: {
        class: 'komc:min-h-25',
      },
    },
    onUpdate: ({ editor: instance }) => {
      setHtml(instance.getHTML());
    },
  });

  return (
    <div className="komc:min-h-dvh komc:bg-white komc:p-6">
      <div className="komc:mx-auto" style={{ maxWidth: DESC_FIELD_WIDTH }}>
        <Label text="본문">
          <EditorProvider editor={editor}>
            <div className="komc:relative">
              <div
                className={clsx(
                  'editor-wrapper komc:@container/tiptap-wrapper',
                  'komc:relative komc:mt-2 komc:h-auto komc:w-full komc:rounded-lg komc:px-2.25 komc:py-3',
                  'komc:border-[0.6px] komc:border-neutral-300 komc:shadow-field',
                  'komc:transition-all komc:duration-200 komc:ease-in-out',
                  'komc:focus-within:border-blue-500 komc:focus-within:ring-4 komc:focus-within:ring-indigo-200',
                )}
              >
                {editor ? (
                  <EditorContent editor={editor} />
                ) : (
                  <div className="komc:h-25 komc:w-full komc:animate-pulse komc:rounded-lg komc:bg-neutral-50" />
                )}
              </div>
            </div>
          </EditorProvider>
        </Label>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args: EditorStoryArgs) => (
    <EditorPlayground
      key={`${args.textset}-${args.mediaset}-${args.tableset}-${args.layoutset}`}
      {...args}
    />
  ),
};
