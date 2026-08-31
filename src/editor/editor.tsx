import React, { forwardRef, useEffect } from 'react';
import { EditorContent, useEditor, UseEditorOptions } from '@tiptap/react';
import type { Editor as EditorType } from '@tiptap/react';
import { EditorProvider } from './provider';
import clsx from 'clsx';
import { Skeleton } from '../ui';

interface Props extends UseEditorOptions {
  plugins?: React.ReactNode;
  editorRef?: React.MutableRefObject<EditorType | null>;
  editorClassName?: string;
  value?: string | null;
  className?: string;
  onChange?: (value: string, context: EditorType) => void;
}

export const Editor = forwardRef<HTMLDivElement, Props>(
  (
    {
      plugins,
      editorRef,
      editorClassName = '',
      value,
      className,
      onChange,
      immediatelyRender = true,
      content,
      editorProps,
      onCreate,
      onUpdate,
      ...props
    },
    ref,
  ) => {
    const existingAttributes =
      editorProps?.attributes && typeof editorProps.attributes === 'object'
        ? editorProps.attributes
        : undefined;

    const editor = useEditor({
      immediatelyRender,
      ...props,
      content: content ?? value ?? '',
      editorProps: {
        ...editorProps,
        attributes: {
          ...existingAttributes,
          class: clsx(
            editorClassName,
            existingAttributes &&
              'class' in existingAttributes &&
              existingAttributes.class,
          ),
        },
      },
      onCreate: (event) => {
        if (editorRef) {
          editorRef.current = event.editor;
        }
        onCreate?.(event);
      },
      onUpdate: (event) => {
        onChange?.(event.editor.getHTML(), event.editor);
        onUpdate?.(event);
      },
    });

    useEffect(() => {
      if (!editorRef) return;
      editorRef.current = editor ?? null;

      return () => {
        if (editorRef.current === editor) {
          editorRef.current = null;
        }
      };
    }, [editor, editorRef]);

    useEffect(() => {
      if (!editor || typeof value !== 'string') return;
      if (editor.isDestroyed || editor.isFocused) return;

      const current = editor.getHTML();
      if (current === value) return;

      editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);

    return (
      <EditorProvider editor={editor}>
        <div data-komc className="komc:relative">
          {editor && plugins}
          <div
            ref={ref}
            data-komc
            className={clsx(
              'komc:@container/komc-editor editor-wrapper',
              'komc:w-full komc:h-auto komc:relative',
              'komc:border-[0.6px] komc:border-neutral-300',
              'komc:transition-all komc:duration-200 komc:ease-in-out',
              'komc:focus-within:border-blue-500 komc:focus-within:ring-4',
              className,
            )}
          >
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <Skeleton className="komc:w-full komc:min-h-25" />
            )}
          </div>
        </div>
      </EditorProvider>
    );
  },
);
