import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Page } from '@/types';

interface RichTextEditorProps {
  page: Page | null;
  onSave: (content: any) => void;
  isTrial: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  page,
  onSave,
  isTrial
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'editor-table-cell',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
        draggable: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your worldbuilding content here...',
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: page?.content || { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      if (page) {
        onSave({ ...page, content: json });
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  });

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!editor) return;

    // Ctrl/Cmd + Z for undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      editor.chain().focus().undo().run();
    }

    // Ctrl/Cmd + Shift + Z for redo
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') {
      event.preventDefault();
      editor.chain().focus().redo().run();
    }

    // Ctrl/Cmd + S for save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (page && editor) {
        onSave({ ...page, content: editor.getJSON() });
      }
    }
  }, [editor, page, onSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Update editor content when page changes
  useEffect(() => {
    if (editor && page && page.content) {
      editor.commands.setContent(page.content);
    }
  }, [page, editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    
    editor.chain().focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;
    
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!editor) return;
    
    const url = prompt('Enter link URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const MenuBar = () => (
    <div className="floating-toolbar">
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${
            editor?.isActive('bold') ? 'bg-slate-200 text-primary' : 'text-slate-600'
          }`}
          title="Bold (Ctrl+B)"
        >
          <span className="material-symbols-outlined text-[18px]">format_bold</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${
            editor?.isActive('italic') ? 'bg-slate-200 text-primary' : 'text-slate-600'
          }`}
          title="Italic (Ctrl+I)"
        >
          <span className="material-symbols-outlined text-[18px]">format_italic</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${
            editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-primary' : 'text-slate-600'
          }`}
          title="Heading 2"
        >
          <span className="material-symbols-outlined text-[18px]">format_h2</span>
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${
            editor?.isActive('bulletList') ? 'bg-slate-200 text-primary' : 'text-slate-600'
          }`}
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${
            editor?.isActive('orderedList') ? 'bg-slate-200 text-primary' : 'text-slate-600'
          }`}
          title="Numbered List"
        >
          <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${
            editor?.isActive('blockquote') ? 'bg-slate-200 text-primary' : 'text-slate-600'
          }`}
          title="Quote"
        >
          <span className="material-symbols-outlined text-[18px]">format_quote</span>
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <button
          onClick={insertLink}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title="Insert Link"
        >
          <span className="material-symbols-outlined text-[18px]">link</span>
        </button>
        <button
          onClick={insertImage}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title="Insert Image"
        >
          <span className="material-symbols-outlined text-[18px]">image</span>
        </button>
        <button
          onClick={insertTable}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title="Insert Table"
        >
          <span className="material-symbols-outlined text-[18px]">table_chart</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <span className="material-symbols-outlined text-[18px]">undo</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Shift+Z)"
        >
          <span className="material-symbols-outlined text-[18px]">redo</span>
        </button>
      </div>
    </div>
  );

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
              description
            </span>
          </div>
          <h3 className="text-xl font-semibold text-on-surface mb-2">
            No Page Selected
          </h3>
          <p className="text-on-surface-variant">
            Select a page from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MenuBar />
      <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_12px_40px_rgba(25,28,29,0.06)] min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span>Characters: {editor?.storage.characterCount.characters() || 0}</span>
          <span>Words: {editor?.storage.characterCount.words() || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">info</span>
          <span>Ctrl+S to save • Ctrl+Z to undo • Ctrl+Shift+Z to redo</span>
        </div>
      </div>
    </div>
  );
};
