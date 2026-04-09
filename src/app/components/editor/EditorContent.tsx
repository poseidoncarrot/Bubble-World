/**
 * EditorContent component - Main content area for editing pages
 * 
 * This component displays the editable content of a selected page:
 * - Cover image with upload functionality
 * - Page title (editable with debounced updates)
 * - Page description (editable with debounced updates)
 * - Page connections (links to other pages/subsections)
 * - List of draggable subsections
 * - Add subsection button
 * 
 * Features:
 * - Debounced title and description updates (500ms)
 * - Cover image upload via file input
 * - Connection management (add/remove links)
 * - Theme-aware styling
 * - Empty state when no page is selected
 * 
 * TODO: Add page metadata (word count, reading time)
 * TODO: Add page version history
 * TODO: Add page templates
 * TODO: Add collaborative editing indicators
 * TODO: Add keyboard shortcuts
 */

import React, { useCallback } from 'react';
import { Plus, Link as LinkIcon, ImageIcon, Upload, X } from 'lucide-react';
import { Page, Universe } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { DraggableSubsection } from './DraggableSubsection';
import { useDebounce } from '../../hooks/useDebounce';

interface EditorContentProps {
  currentPage: Page | null;
  universe: Universe;
  updatePage: (universeId: string, pageId: string, updates: Partial<Page>) => Promise<void>;
  updateSubsection: (universeId: string, pageId: string, subsectionId: string, updates: Partial<any>) => Promise<void>;
  createSubsection: (universeId: string, pageId: string, title: string, content: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  setDeleteModal: (modal: any) => void;
  moveSubsection: (dragIndex: number, hoverIndex: number) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  currentPage,
  universe,
  updatePage,
  updateSubsection,
  createSubsection,
  uploadImage,
  setDeleteModal,
  moveSubsection
}) => {
  const debouncedUpdateTitle = useCallback(
    useDebounce((universeId: string, pageId: string, title: string) => {
      updatePage(universeId, pageId, { title });
    }, 500),
    [updatePage]
  );

  const debouncedUpdateDescription = useCallback(
    useDebounce((universeId: string, pageId: string, description: string) => {
      updatePage(universeId, pageId, { description });
    }, 500),
    [updatePage]
  );
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentPage && universe) {
      try {
        const url = await uploadImage(e.target.files[0]);
        await updatePage(universe.id, currentPage.id, { coverImage: url });
      } catch (err) {
        alert('Upload failed');
      }
    }
  };

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full text-[#44474c]">
        Select or create a page to begin editing
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div>
        {/* Cover Image */}
        <div className="h-64 bg-gray-200 relative group">
          {currentPage.coverImage ? (
            <ImageWithFallback src={currentPage.coverImage} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#214059]/20 to-[#395771]/20 flex items-center justify-center text-[#214059]/50">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
          <label className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-medium shadow-sm">
            <Upload className="w-4 h-4" /> Change Cover
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadCover} />
          </label>
        </div>

        <div className="max-w-4xl mx-auto px-12 py-12">
          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => debouncedUpdateTitle(universe.id, currentPage.id, e.target.value)}
            className={`w-full font-bold text-[48px] bg-transparent border-none outline-none mb-4 ${universe.settings?.theme === 'Dark' ? 'text-white placeholder-gray-600' : 'text-[#214059] placeholder-gray-300'}`}
            placeholder="Page Title"
          />
          <textarea
            value={currentPage.description}
            onChange={(e) => debouncedUpdateDescription(universe.id, currentPage.id, e.target.value)}
            className={`w-full text-[18px] bg-transparent border-none outline-none resize-none min-h-[100px] ${universe.settings?.theme === 'Dark' ? 'text-gray-300 placeholder-gray-600' : 'text-[#44474c] placeholder-gray-400'}`}
            placeholder="Write a short description..."
          />

          {/* Main Page Connections */}
          <div className="mt-4 mb-12 p-4 bg-black/5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className={`w-4 h-4 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`} />
              <span className={`text-sm font-medium ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`}>Page Connections</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPage.connections.map(connId => {
                const connectedPage = universe.pages.find(p => p.id === connId) || 
                                      universe.pages.flatMap(p => p.subsections).find(s => s.id === connId);
                return connectedPage ? (
                  <span key={connId} className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${universe.settings?.theme === 'Dark' ? 'bg-gray-700 text-blue-300' : 'bg-[#eef2f6] text-[#214059]'}`}>
                    {connectedPage.title}
                    <button onClick={() => updatePage(universe.id, currentPage.id, { connections: currentPage.connections.filter(id => id !== connId) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
              <select 
                className={`text-sm rounded-full px-3 py-1 outline-none cursor-pointer ${universe.settings?.theme === 'Dark' ? 'bg-gray-700 text-gray-300' : 'bg-white shadow-sm border border-gray-200'}`}
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    updatePage(universe.id, currentPage.id, { connections: [...currentPage.connections, e.target.value] });
                  }
                }}
              >
                <option value="">+ Add Connection</option>
                {universe.pages.filter(p => p.id !== currentPage.id).map(p => (
                  <option key={p.id} value={p.id}>Page: {p.title}</option>
                ))}
                {universe.pages.flatMap(p => p.subsections).map(s => (
                  <option key={s.id} value={s.id}>Section: {s.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {currentPage.subsections.map((sub, index) => (
              <DraggableSubsection
                key={sub.id}
                sub={sub}
                index={index}
                currentPage={currentPage}
                universe={universe}
                setDeleteModal={setDeleteModal}
                updateSubsection={updateSubsection}
                moveSubsection={moveSubsection}
              />
            ))}
          </div>

          <button
            onClick={() => createSubsection(universe.id, currentPage.id, 'New Subsection', '')}
            className={`mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed transition-all font-medium
                       ${universe.settings?.theme === 'Dark' 
                         ? 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800' 
                         : 'text-[#214059]/60 border-[#214059]/20 hover:text-[#214059] hover:bg-[#214059]/5'}`}
          >
            <Plus className="w-5 h-5" />
            Add Subsection
          </button>
        </div>
      </div>
    </div>
  );
};
