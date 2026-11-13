import type { Editor } from '@tiptap/react';
import type { ReactNode } from 'react';
import type {
  TemplateVariable,
  TemplateVariableCategoryOption,
} from './template-variables';

export type VariableItem = TemplateVariable;
export type VariableCategory = TemplateVariableCategoryOption;

export type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variables?: TemplateVariable[];
  /** Headings for `variables`, in display order; defaults to the built-in categories. */
  variableCategories?: readonly TemplateVariableCategoryOption[];
  editorRef?: (editor: Editor | null) => void;
  allowImages?: boolean;
  ariaLabel?: string;
  /** Essentials-only single-row toolbar for short-form content such as notes. */
  compact?: boolean;
  /** Rendered inside the editor frame below the content, e.g. a submit row. */
  footer?: ReactNode;
};
