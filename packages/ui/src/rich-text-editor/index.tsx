'use client';

import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';
import { TooltipProvider } from '../tooltip';
import { cn } from '../utils';
import { detectTriggerInEditor } from './detect-trigger';
import { EditorToolbar } from './editor-toolbar';
import type { TemplateVariable } from './template-variables';
import type { RichTextEditorProps } from './types';
import { VariableSuggestionDropdown } from './variable-suggestion-dropdown';

// Rich text editor with optional template-variable suggestions.

const emptyTemplateVariables: TemplateVariable[] = [];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Écrivez ici…',
  className,
  variables = emptyTemplateVariables,
  variableCategories,
  editorRef,
  allowImages = true,
  ariaLabel,
  compact = false,
  footer,
}: RichTextEditorProps) {
  const [suggestion, setSuggestion] = useState<{
    query: string;
    range: { from: number; to: number };
    coords: { left: number; top: number };
    variables: TemplateVariable[];
  } | null>(null);
  const activeSuggestion =
    suggestion?.variables === variables && variables.length > 0
      ? suggestion
      : null;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-emphasis underline cursor-pointer',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ...(allowImages
        ? [Image.configure({ inline: false, allowBase64: true })]
        : []),
    ],
    content: value,
    onCreate: ({ editor: createdEditor }) => {
      editorRef?.(createdEditor);
    },
    onDestroy: () => {
      editorRef?.(null);
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());

      // Detect the {{ pattern for variable suggestions.
      if (variables?.length) {
        const detected = detectTriggerInEditor(ed);
        if (detected) {
          const coords = ed.view.coordsAtPos(detected.range.to);
          setSuggestion({
            query: detected.query,
            range: detected.range,
            coords: { left: coords.left, top: coords.bottom + 4 },
            variables,
          });
        } else {
          setSuggestion(null);
        }
      }
    },
    editorProps: {
      attributes: {
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        class: `prose prose-sm prose-p:my-0 max-w-none ${compact ? 'min-h-[76px]' : 'min-h-[120px]'} max-h-[300px] overflow-y-auto px-3.5 py-2.5 text-[13px] text-[var(--ink)] focus:outline-none`,
      },
    },
  });

  // Refresh suggestions when the selection moves via keys or clicks.
  useEffect(() => {
    if (!editor || !variables?.length) return;

    function handleSelectionUpdate() {
      if (!editor) return;
      const detected = detectTriggerInEditor(editor);
      if (detected) {
        const coords = editor.view.coordsAtPos(detected.range.to);
        setSuggestion({
          query: detected.query,
          range: detected.range,
          coords: { left: coords.left, top: coords.bottom + 4 },
          variables,
        });
      } else {
        setSuggestion(null);
      }
    }

    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, variables]);

  const handleVariableSelect = useCallback(
    (variable: TemplateVariable) => {
      if (!editor || !activeSuggestion) return;
      const tag = `{{ ${variable.key} }}`;
      editor
        .chain()
        .focus()
        .deleteRange(activeSuggestion.range)
        .insertContent(
          variable.linkText
            ? {
                type: 'text',
                text: variable.linkText,
                marks: [{ type: 'link', attrs: { href: tag } }],
              }
            : tag,
        )
        .unsetMark('link')
        .run();
      setSuggestion(null);
    },
    [activeSuggestion, editor],
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL de l’image');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <TooltipProvider>
      <div
        className={cn(
          'overflow-hidden rounded-[var(--radius-card)] border border-[var(--charcoal-a10)] bg-white shadow-[var(--shadow-input)] transition-[border-color,box-shadow] focus-within:border-transparent focus-within:shadow-[var(--focus-ring)]',
          className,
        )}
      >
        <EditorToolbar
          editor={editor}
          onSetLink={setLink}
          onAddImage={addImage}
          allowImages={allowImages}
          compact={compact}
        />
        <EditorContent editor={editor} />
        {footer ? (
          <div className="flex items-center justify-end gap-2 px-2.5 pb-2.5">
            {footer}
          </div>
        ) : null}

        {/* Liquid variable suggestions */}
        {activeSuggestion && (
          <VariableSuggestionDropdown
            variables={variables}
            categories={variableCategories}
            query={activeSuggestion.query}
            coords={activeSuggestion.coords}
            onSelect={handleVariableSelect}
            onClose={() => setSuggestion(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
