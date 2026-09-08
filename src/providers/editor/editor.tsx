import type { Editor } from '@tiptap/core';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

interface EditorContextValue {
  editor: Editor | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
  editor: Editor | null;
  children: ReactNode;
}

export function EditorProvider({ editor, children }: EditorProviderProps) {
  const value = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }

  return context;
}

export function useRequiredEditor() {
  const { editor } = useEditorContext();

  if (!editor) {
    throw new Error('Editor is not available');
  }

  return editor;
}

export function useOptionalEditor() {
  return useEditorContext().editor;
}
