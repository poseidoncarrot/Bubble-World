import { useRef, useEffect, memo, useCallback } from 'react';
import React from 'react';
import { Bold, Italic } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface EditorDivProps {
  initialContent: string;
  onInput: (e: React.FormEvent<HTMLDivElement>) => void;
  onBlur: (e: React.FormEvent<HTMLDivElement>) => void;
  innerRef: React.RefObject<HTMLDivElement>;
  theme: string;
}

const EditorDiv = memo(({ initialContent, onInput, onBlur, innerRef, theme }: EditorDivProps) => {
  const getThemeClasses = () => {
    if (theme === 'Dark') {
      return 'bg-gray-800 focus:bg-gray-900 text-gray-200';
    } else if (theme === 'Parchment') {
      return 'bg-[#fdf6e3] focus:bg-[#f5f0dc] text-[#5d5444]';
    } else {
      return 'bg-white focus:bg-white text-[#44474c]';
    }
  };

  return (
    <div
      ref={innerRef}
      contentEditable
      className={`rich-text-editor-content p-4 min-h-[150px] outline-none leading-relaxed transition-colors ${getThemeClasses()}`}
      style={{
        color: 'inherit',
        fontFamily: 'inherit',
      }}
      onBlur={onBlur}
      onInput={onInput}
      dangerouslySetInnerHTML={{ __html: initialContent }}
    />
  );
}, () => true); // Never re-render from props

export const RichTextEditor = React.memo(({ content, onChange, theme }: { content: string, onChange: (c: string) => void, theme: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const onChangeRef = useRef(onChange);
  
  // Update onChange ref when it changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current && content !== contentRef.current) {
      editorRef.current.innerHTML = content;
      contentRef.current = content;
    }
  }, [content]);

  const applyFormat = useCallback((formatType: string, value?: string) => {
    if (!editorRef.current) return;
    
    // Ensure editor has focus before executing commands
    editorRef.current.focus();
    
    // Always use execCommand for better compatibility and cursor preservation
    if (formatType === 'bold') {
      document.execCommand('bold', false);
    } else if (formatType === 'italic') {
      document.execCommand('italic', false);
    } else if (formatType === 'formatBlock' && value) {
      document.execCommand('formatBlock', false, value);
    } else if (formatType === 'foreColor' && value) {
      document.execCommand('foreColor', false, value);
    }
    
    // Update content after a short delay to ensure the command took effect
    setTimeout(() => {
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        contentRef.current = html;
        onChangeRef.current(html);
      }
    }, 10);
  }, []);

  const handleInput = useCallback(
    useDebounce((e: React.FormEvent<HTMLDivElement>) => {
      const html = e.currentTarget.innerHTML;
      contentRef.current = html;
      onChangeRef.current(html);
    }, 150), // 150ms debounce
    []
  );

  const getContainerClasses = () => {
    if (theme === 'Dark') {
      return 'border-gray-700 bg-gray-800';
    } else if (theme === 'Parchment') {
      return 'border-[#d4c5a0] bg-[#fdf6e3]';
    } else {
      return 'border-[rgba(33,64,89,0.1)] bg-white';
    }
  };

  const getToolbarClasses = () => {
    if (theme === 'Dark') {
      return 'border-gray-700 bg-gray-900';
    } else if (theme === 'Parchment') {
      return 'border-[#d4c5a0] bg-[#f5f0dc]';
    } else {
      return 'border-[rgba(33,64,89,0.1)] bg-[#f8f9fa]';
    }
  };

  const getButtonClasses = () => {
    if (theme === 'Dark') {
      return 'hover:bg-gray-700 text-gray-300';
    } else if (theme === 'Parchment') {
      return 'hover:bg-[#e8dcc0] text-[#5d5444]';
    } else {
      return 'hover:bg-gray-200 text-[#214059]';
    }
  };

  const getSelectClasses = () => {
    if (theme === 'Dark') {
      return 'text-gray-300 hover:bg-gray-700';
    } else if (theme === 'Parchment') {
      return 'text-[#5d5444] hover:bg-[#e8dcc0]';
    } else {
      return 'text-[#214059] hover:bg-gray-200';
    }
  };

  const getDividerClasses = () => {
    if (theme === 'Dark') {
      return 'bg-gray-700';
    } else if (theme === 'Parchment') {
      return 'bg-[#d4c5a0]';
    } else {
      return 'bg-gray-300';
    }
  };

  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm ${getContainerClasses()}`}>
      <style>{`
        .rich-text-editor-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .rich-text-editor-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .rich-text-editor-content h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; }
        .rich-text-editor-content p { margin-bottom: 0.5em; }
        .rich-text-editor-content b, .rich-text-editor-content strong { font-weight: bold; }
        .rich-text-editor-content i, .rich-text-editor-content em { font-style: italic; }
      `}</style>
      <div className={`flex flex-wrap items-center gap-2 p-2 border-b ${getToolbarClasses()}`}>
        <button 
          onClick={() => applyFormat('bold')} 
          className={`p-1.5 rounded transition-colors ${getButtonClasses()}`} 
          title="Bold"
          aria-label="Bold text"
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button 
          onClick={() => applyFormat('italic')} 
          className={`p-1.5 rounded transition-colors ${getButtonClasses()}`} 
          title="Italic"
          aria-label="Italic text"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className={`w-px h-4 mx-1 ${getDividerClasses()}`} />
        <select 
          onChange={(e) => applyFormat('formatBlock', e.target.value)} 
          className={`bg-transparent text-sm font-medium outline-none cursor-pointer p-1 rounded ${getSelectClasses()}`}
          aria-label="Text format"
        >
          <option value="p">Normal text</option>
          <option value="h2">Large text</option>
          <option value="h1">Huge text</option>
        </select>
        <div className={`w-px h-4 mx-1 ${getDividerClasses()}`} />
        <select 
          onChange={(e) => applyFormat('foreColor', e.target.value)} 
          className={`bg-transparent text-sm font-medium outline-none cursor-pointer p-1 rounded ${getSelectClasses()}`}
          aria-label="Text color"
        >
          <option value="#214059">Black (Default)</option>
          <option value="#e53e3e">Red</option>
          <option value="#3182ce">Blue</option>
          <option value="#38a169">Green</option>
          <option value="#805ad5">Purple</option>
          <option value="#d30fdd">Magenta</option>
        </select>
      </div>
      <EditorDiv
        innerRef={editorRef}
        initialContent={content}
        onInput={handleInput}
        onBlur={handleInput}
        theme={theme}
      />
    </div>
  );
});
