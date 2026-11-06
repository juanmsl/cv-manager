// Campo de texto con formato, al estilo Notion: se escribe en Markdown y se ve
// ya formateado (**negrilla**, *cursiva*, "- " lista, "1. " lista numerada).
// Al seleccionar texto aparece una barra para aplicar formato. El valor se
// guarda como Markdown y las plantillas lo muestran con <Rich> (shared.tsx).
import { useEffect, useId, useRef } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Placeholder } from '@tiptap/extensions';
import { useT } from '../i18n';

interface Props {
  label: string;
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  hint?: string;
  /** Alto mínimo aproximado, en líneas. */
  rows?: number;
}

export function RichField({ label, value, onChange, placeholder, hint, rows = 3 }: Props) {
  const { t } = useT();
  const id = useId();
  // Último Markdown emitido: distingue lo que escribe la persona de un cambio
  // externo (importar, restaurar el ejemplo, abrir un archivo).
  const last = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        underline: false,
        link: { openOnClick: false, autolink: true, linkOnPaste: true },
      }),
      Markdown,
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class: 'rich-input',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': `${id}-label`,
        ...(hint ? { 'aria-describedby': `${id}-hint` } : {}),
        style: `min-height: ${rows * 1.5 + 1}em`,
      },
    },
    onUpdate: ({ editor }) => {
      const md = editor.isEmpty ? '' : editor.getMarkdown();
      last.current = md;
      onChange(md);
    },
  });

  useEffect(() => {
    if (!editor || value === last.current) return;
    last.current = value;
    editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
          }
        : null,
  });

  return (
    <div className="field">
      <span id={`${id}-label`}>{label}</span>
      <div className="rich">
        {editor && (
          <BubbleMenu editor={editor} className="rich-menu" options={{ placement: 'top' }}>
            <button
              type="button"
              aria-label={t('rich.bold')}
              title={`${t('rich.bold')} (⌘B)`}
              aria-pressed={!!state?.bold}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <b>B</b>
            </button>
            <button
              type="button"
              aria-label={t('rich.italic')}
              title={`${t('rich.italic')} (⌘I)`}
              aria-pressed={!!state?.italic}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <i>I</i>
            </button>
            <button
              type="button"
              aria-label={t('rich.bullets')}
              title={t('rich.bullets')}
              aria-pressed={!!state?.bullet}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <circle cx="2.5" cy="3.5" r="1.1" fill="currentColor" />
                <circle cx="2.5" cy="7" r="1.1" fill="currentColor" />
                <circle cx="2.5" cy="10.5" r="1.1" fill="currentColor" />
                <path d="M5.5 3.5h7M5.5 7h7M5.5 10.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t('rich.numbers')}
              title={t('rich.numbers')}
              aria-pressed={!!state?.ordered}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <text x="0.5" y="5" fontSize="4.6" fill="currentColor" fontWeight="600">1</text>
                <text x="0.5" y="11.6" fontSize="4.6" fill="currentColor" fontWeight="600">2</text>
                <path d="M5.5 3.5h7M5.5 10h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
      <em className="field-hint" id={`${id}-hint`}>
        {hint ? `${hint} · ` : ''}
        {t('rich.hint')}
      </em>
    </div>
  );
}
