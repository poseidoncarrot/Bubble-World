import { useRef, useEffect, memo } from 'react';
import { Bold, Italic, Type, Palette } from 'lucide-react';

const EditorDiv = memo(({ initialContent, onInput, onBlur, innerRef }: any) => (
  <div
    ref={innerRef}
    contentEditable
    className="rich-text-editor-content p-4 min-h-[150px] outline-none leading-relaxed transition-colors focus:bg-white text-[#44474c] dark:text-gray-200 dark:focus:bg-gray-800"
    style={{
      color: 'inherit',
      fontFamily: 'inherit',
    }}
    onBlur={onBlur}
    onInput={onInput}
    dangerouslySetInnerHTML={{ __html: initialContent }}
  />
), () => true); // Never re-render from props

export function RichTextEditor({ content, onChange }: { content: string, onChange: (c: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);

  useEffect(() => {
    if (editorRef.current && content !== contentRef.current) {
      editorRef.current.innerHTML = content;
      contentRef.current = content;
    }
  }, [content]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      const html = editorRef.current.innerHTML;
      contentRef.current = html;
      onChange(html);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    contentRef.current = html;
    onChange(html);
  };

  return (
    <div className="border border-[rgba(33,64,89,0.1)] rounded-xl overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <style>{`
        .rich-text-editor-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .rich-text-editor-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .rich-text-editor-content h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; }
        .rich-text-editor-content p { margin-bottom: 0.5em; }
        .rich-text-editor-content b, .rich-text-editor-content strong { font-weight: bold; }
        .rich-text-editor-content i, .rich-text-editor-content em { font-style: italic; }
      `}</style>
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[rgba(33,64,89,0.1)] bg-[#f8f9fa] dark:bg-gray-900 dark:border-gray-700">
        <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-[#214059] dark:text-gray-300 transition-colors" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-[#214059] dark:text-gray-300 transition-colors" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
        <select onChange={(e) => execCommand('formatBlock', e.target.value)} className="bg-transparent text-sm font-medium text-[#214059] dark:text-gray-300 outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded">
          <option value="P">Normal text</option>
          <option value="H2">Large text</option>
          <option value="H1">Huge text</option>
        </select>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
        <select onChange={(e) => execCommand('foreColor', e.target.value)} className="bg-transparent text-sm font-medium text-[#214059] dark:text-gray-300 outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded">
          <option value="#214059">Default Color</option>
          <option value="#e53e3e">Red</option>
          <option value="#3182ce">Blue</option>
          <option value="#38a169">Green</option>
          <option value="#805ad5">Purple</option>
          <option value="#d69e2e">Magenta</option>
        </select>
      </div>
      <EditorDiv
        innerRef={editorRef}
        initialContent={content}
        onInput={handleInput}
        onBlur={handleInput}
      />
    </div>
  );
}
