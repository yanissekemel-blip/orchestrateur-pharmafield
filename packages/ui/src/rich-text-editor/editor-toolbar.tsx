import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeSquare,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
} from 'lucide-react';
import { cn } from '../utils';
import { ToolbarButton, ToolbarSeparator } from './toolbar-button';

interface EditorToolbarProps {
  editor: Editor;
  onSetLink: () => void;
  onAddImage: () => void;
  allowImages?: boolean;
  compact?: boolean;
}

export function EditorToolbar({
  editor,
  onSetLink,
  onAddImage,
  allowImages = true,
  compact = false,
}: EditorToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-0.5',
        compact
          ? 'border-b border-[var(--line-2)] px-2 py-1.5'
          : 'm-1.5 rounded-[var(--radius-card)] bg-[var(--charcoal-a06)] p-[3px]',
      )}
    >
      {!compact && (
        <>
          {/* Headings */}
          <ToolbarButton
            pressed={editor.isActive('heading', { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            label="Titre 1"
          >
            <Heading1 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            pressed={editor.isActive('heading', { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            label="Titre 2"
          >
            <Heading2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            pressed={editor.isActive('heading', { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            label="Titre 3"
          >
            <Heading3 className="size-4" />
          </ToolbarButton>

          <ToolbarSeparator />
        </>
      )}
      {/* Text formatting */}
      <ToolbarButton
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        label="Gras"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        label="Italique"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        label="Souligné"
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        label="Barré"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('highlight')}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        label="Surligner"
      >
        <Highlighter className="size-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Lists & blocks */}
      <ToolbarButton
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        label="Liste à puces"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        label="Liste numérotée"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        label="Citation"
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('code')}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        label="Code en ligne"
      >
        <Code className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        pressed={editor.isActive('codeBlock')}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        label="Bloc de code"
      >
        <CodeSquare className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
        label="Ligne horizontale"
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {!compact && (
        <>
          {/* Alignment */}
          <ToolbarButton
            pressed={editor.isActive({ textAlign: 'left' })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign('left').run()
            }
            label="Aligner à gauche"
          >
            <AlignLeft className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            pressed={editor.isActive({ textAlign: 'center' })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign('center').run()
            }
            label="Centrer"
          >
            <AlignCenter className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            pressed={editor.isActive({ textAlign: 'right' })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign('right').run()
            }
            label="Aligner à droite"
          >
            <AlignRight className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            pressed={editor.isActive({ textAlign: 'justify' })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign('justify').run()
            }
            label="Justifier"
          >
            <AlignJustify className="size-4" />
          </ToolbarButton>

          <ToolbarSeparator />
        </>
      )}
      {/* Link & Image */}
      <ToolbarButton
        pressed={editor.isActive('link')}
        onPressedChange={onSetLink}
        label="Lien"
      >
        <LinkIcon className="size-4" />
      </ToolbarButton>
      {editor.isActive('link') && (
        <ToolbarButton
          onPressedChange={() => editor.chain().focus().unsetLink().run()}
          label="Supprimer le lien"
        >
          <Unlink className="size-4" />
        </ToolbarButton>
      )}
      {allowImages && (
        <ToolbarButton onPressedChange={onAddImage} label="Image (URL)">
          <ImageIcon className="size-4" />
        </ToolbarButton>
      )}

      {!compact && (
        <>
          <ToolbarSeparator />

          {/* Undo / Redo */}
          <ToolbarButton
            onPressedChange={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            label="Annuler"
          >
            <Undo className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onPressedChange={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            label="Rétablir"
          >
            <Redo className="size-4" />
          </ToolbarButton>
        </>
      )}
    </div>
  );
}
