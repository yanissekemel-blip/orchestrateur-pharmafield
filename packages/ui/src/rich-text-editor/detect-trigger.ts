import type { useEditor } from '@tiptap/react';

// Detect a {{ trigger before the cursor.

export function detectTriggerInEditor(editor: ReturnType<typeof useEditor>) {
  if (!editor) return null;
  const { state } = editor;
  const { from } = state.selection;

  // Inspect at most 50 characters before the cursor.
  const start = Math.max(0, from - 50);
  const textBefore = state.doc.textBetween(start, from, '\n');
  // Liquid keys are namespaced (`contact.first_name`) and may follow a space.
  const match = textBefore.match(/\{\{\s*([\w.]*)$/);

  if (!match) return null;

  const matchStart = from - match[0].length;
  return {
    query: match[1] ?? '',
    range: { from: matchStart, to: from },
  };
}
