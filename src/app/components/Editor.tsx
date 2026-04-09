/**
 * Editor component - Main interface for editing universe content
 * 
 * This component provides a comprehensive editor for managing universe content:
 * - Page management (create, edit, delete, reorder)
 * - Category management (organize pages into groups)
 * - Subsection management within pages
 * - Rich text editing for content
 * - Page connections (link pages together)
 * - Cover image upload
 * - Theme switching (Light, Dark, Parchment)
 * - Universe settings
 * 
 * Architecture:
 * - Uses UniverseContext for data and operations
 * - PageSidebar for navigation and page management
 * - Debounced updates to prevent rapid-fire API calls
 * - Drag-and-drop for reordering pages and subsections
 * - RichTextEditor for content editing
 * 
 * TODO: Add autosave with visual indicator
 * TODO: Implement collaborative editing
 * TODO: Add version history
 * TODO: Add export functionality (PDF, Markdown)
 * TODO: Add keyboard shortcuts
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Link as LinkIcon, Image as ImageIcon, Upload, X, Settings } from 'lucide-react';
import { useUniverseStore } from '../contexts/UniverseContext';
import { Universe, Page, Subsection } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { PageSidebar } from './editor/PageSidebar';
import { DraggableSubsection } from './editor/DraggableSubsection';
import { useDebounce } from '../hooks/useDebounce';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

export default function Editor() {
  const { worldId: universeId } = useParams();
  const navigate = useNavigate();
  const { universes, createPage, updatePage, deletePage, createSubsection, updateSubsection, deleteSubsection, uploadImage, addCategory, renameCategory, deleteCategory, updateUniverse, deleteUniverse, reorderPages, reorderSubsections } = useUniverseStore();
  
  const universe = universes.find(u => u.id === universeId);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([]));
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isRenamingCategory, setIsRenamingCategory] = useState(false);
  
  const [newPageCategory, setNewPageCategory] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [categoryToRename, setCategoryToRename] = useState('');
  
  // Local state for universe settings to prevent fast typing bugs
  const [localUniverseName, setLocalUniverseName] = useState('');
  const [localUniverseDescription, setLocalUniverseDescription] = useState('');
  const [renameCategoryValue, setRenameCategoryValue] = useState('');
  
  // Use custom hooks
  const debouncedUpdateUniverseName = useDebounce(
    (universeId: string, name: string) => {
      updateUniverse(universeId, { name });
    },
    500
  );
  
  const debouncedUpdateUniverseDescription = useDebounce(
    (universeId: string, description: string) => {
      updateUniverse(universeId, { description });
    },
    500
  );
  
  const { movePage, moveSubsection } = useDragAndDrop();
  
  // Sync local state with universe data when universe changes
  useEffect(() => {
    if (universe) {
      setLocalUniverseName(universe.name);
      setLocalUniverseDescription(universe.description);
    }
  }, [universe]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'category' | 'page' | 'subsection' | 'universe';
    itemId: string;
    itemName: string;
    parentId?: string;
  }>({
    isOpen: false,
    type: 'page',
    itemId: '',
    itemName: ''
  });

  useEffect(() => {
    if (universe && universe.pages && universe.pages.length > 0 && !selectedPage) {
      setSelectedPage(universe.pages[0]);
    }
  }, [universe, selectedPage]);

  // Refreshed selected page
  const currentPage = universe?.pages?.find(p => p.id === selectedPage?.id) || (universe?.pages && universe.pages.length > 0 ? universe.pages[0] : null);

  const handleCreateCategory = async () => {
    if (newCategoryName.trim() && universe) {
      await addCategory(universe.id, newCategoryName);
      setExpandedCategories(new Set([...expandedCategories, newCategoryName]));
      setIsCreatingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleRenameCategory = async () => {
    if (renameCategoryValue.trim() && categoryToRename && universe) {
      await renameCategory(universe.id, categoryToRename, renameCategoryValue);
      setIsRenamingCategory(false);
      setCategoryToRename('');
      setRenameCategoryValue('');
    }
  };

  const handleCreatePage = async () => {
    if (newPageTitle.trim() && universe) {
      const page = await createPage(universe.id, newPageTitle, '', newPageCategory);
      setSelectedPage(page);
      setIsCreatingPage(false);
      setNewPageTitle('');
    }
  };

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

  const handleDeleteConfirm = async (options?: { deletePages?: boolean }) => {
    if (!universe) return;
    
    const { type, itemId, parentId } = deleteModal;
    
    if (type === 'page') {
      await deletePage(universe.id, itemId);
      if (selectedPage?.id === itemId) setSelectedPage(null);
    } else if (type === 'subsection' && parentId) {
      await deleteSubsection(universe.id, parentId, itemId);
    } else if (type === 'category') {
      await deleteCategory(universe.id, itemId, options?.deletePages || false);
    } else if (type === 'universe') {
      await deleteUniverse(universe.id);
      navigate('/');
    }
    
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleMovePage = (dragIndex: number, hoverIndex: number, dragCategory: string, hoverCategory: string, pageId: string) => {
    if (!universe) return;
    reorderPages(universe.id, pageId, hoverCategory === 'Uncategorized' ? '' : hoverCategory, hoverIndex);
  };

  const handleMoveSubsection = (dragIndex: number, hoverIndex: number) => {
    if (!universe || !currentPage) return;
    reorderSubsections(universe.id, currentPage.id, dragIndex, hoverIndex);
  };

  if (!universe) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300"
         style={{ 
           backgroundColor: universe.settings?.theme === 'Dark' ? '#1a202c' : 
                            universe.settings?.theme === 'Parchment' ? '#fdf6e3' : '#f8f9fa'
         }}>
      {/* Page Sidebar */}
      <PageSidebar
        universe={universe}
        currentPage={currentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        setDeleteModal={setDeleteModal}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        isCreatingPage={isCreatingPage}
        setIsCreatingPage={setIsCreatingPage}
        isCreatingCategory={isCreatingCategory}
        setIsCreatingCategory={setIsCreatingCategory}
        isRenamingCategory={isRenamingCategory}
        setIsRenamingCategory={setIsRenamingCategory}
        newPageCategory={newPageCategory}
        setNewPageCategory={setNewPageCategory}
        newPageTitle={newPageTitle}
        setNewPageTitle={setNewPageTitle}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        categoryToRename={categoryToRename}
        setCategoryToRename={setCategoryToRename}
        renameCategoryValue={renameCategoryValue}
        setRenameCategoryValue={setRenameCategoryValue}
        handleCreatePage={handleCreatePage}
        handleCreateCategory={handleCreateCategory}
        handleRenameCategory={handleRenameCategory}
        movePage={handleMovePage}
        onNavigateBack={() => navigate('/')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        addCategory={addCategory}
        renameCategory={renameCategory}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        {currentPage ? (
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
                onChange={(e) => updatePage(universe.id, currentPage.id, { title: e.target.value })}
                className={`w-full font-bold text-[48px] bg-transparent border-none outline-none mb-4 ${universe.settings?.theme === 'Dark' ? 'text-white placeholder-gray-600' : 'text-[#214059] placeholder-gray-300'}`}
                placeholder="Page Title"
              />
              <textarea
                value={currentPage.description}
                onChange={(e) => updatePage(universe.id, currentPage.id, { description: e.target.value })}
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
                    moveSubsection={handleMoveSubsection}
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
        ) : (
          <div className="flex items-center justify-center h-full text-[#44474c]">
            Select or create a page to begin editing
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreatingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-xl font-bold text-[#214059] mb-4">New Category</h3>
            <input
              type="text"
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. World Bible, Locations..."
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#214059] outline-none text-black"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsCreatingCategory(false)} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleCreateCategory} className="px-4 py-2 bg-[#214059] text-white rounded-lg hover:bg-opacity-90">Create</button>
            </div>
          </div>
        </div>
      )}

      {isRenamingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-xl font-bold text-[#214059] mb-4">Rename Category</h3>
            <input
              type="text"
              autoFocus
              value={renameCategoryValue}
              onChange={(e) => setRenameCategoryValue(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#214059] outline-none text-black"
              onKeyDown={(e) => e.key === 'Enter' && handleRenameCategory()}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsRenamingCategory(false)} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleRenameCategory} className="px-4 py-2 bg-[#214059] text-white rounded-lg hover:bg-opacity-90">Rename</button>
            </div>
          </div>
        </div>
      )}

      {isCreatingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-xl font-bold text-[#214059] mb-4">New Page in {newPageCategory}</h3>
            <input
              type="text"
              autoFocus
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="Page title"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#214059] outline-none text-black"
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsCreatingPage(false)} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleCreatePage} className="px-4 py-2 bg-[#214059] text-white rounded-lg hover:bg-opacity-90">Create</button>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-[#214059] text-[24px]">Universe Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Universe Name</label>
                <input 
                  type="text" 
                  value={localUniverseName}
                  maxLength={30}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalUniverseName(value);
                    if (universe?.id) {
                      debouncedUpdateUniverseName(universe.id, value);
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none text-black" 
                  placeholder="Max 30 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Universe Description</label>
                <textarea 
                  value={localUniverseDescription}
                  maxLength={70}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalUniverseDescription(value);
                    if (universe?.id) {
                      debouncedUpdateUniverseDescription(universe.id, value);
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none resize-none h-24 text-black" 
                  placeholder="35 chars per row, 2 rows max"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-black outline-none"
                  value={universe.settings?.theme || 'Light (Default)'}
                  onChange={(e) => updateUniverse(universe.id, { settings: { ...universe.settings, theme: e.target.value } })}
                >
                  <option value="Light (Default)">Light (Default)</option>
                  <option value="Dark">Dark</option>
                  <option value="Parchment">Parchment</option>
                </select>
              </div>
              <div className="pt-4 border-t">
                <button onClick={() => {
                  setIsSettingsOpen(false);
                  setDeleteModal({
                    isOpen: true,
                    type: 'universe',
                    itemId: universe.id,
                    itemName: universe.name
                  });
                }} className="text-red-500 hover:underline font-medium text-sm">
                  Delete Universe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        type={deleteModal.type}
        itemName={deleteModal.itemName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        isDarkTheme={universe.settings?.theme === 'Dark'}
      />
    </div>
  );
}
