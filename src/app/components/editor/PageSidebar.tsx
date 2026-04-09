import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Plus, ChevronDown, ChevronRight, Edit, Trash2, Search, GripVertical, Layers, Pencil, ArrowLeft, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDragLayer } from 'react-dnd';
import { Page, Universe } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { DraggablePage } from './DraggablePage';
import { CategoryDropZone } from './CategoryDropZone';

interface PageSidebarProps {
  universe: Universe;
  currentPage: Page | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPage: Page | null;
  setSelectedPage: (page: Page) => void;
  setDeleteModal: (modal: any) => void;
  expandedCategories: Set<string>;
  setExpandedCategories: (categories: Set<string>) => void;
  isCreatingPage: boolean;
  setIsCreatingPage: (creating: boolean) => void;
  isCreatingCategory: boolean;
  setIsCreatingCategory: (creating: boolean) => void;
  isRenamingCategory: boolean;
  setIsRenamingCategory: (renaming: boolean) => void;
  newPageCategory: string;
  setNewPageCategory: (category: string) => void;
  newPageTitle: string;
  setNewPageTitle: (title: string) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  categoryToRename: string;
  setCategoryToRename: (category: string) => void;
  renameCategoryValue: string;
  setRenameCategoryValue: (value: string) => void;
  handleCreatePage: () => void;
  handleCreateCategory: () => void;
  handleRenameCategory: () => void;
  movePage: (dragIndex: number, hoverIndex: number, dragCategory: string, hoverCategory: string, pageId: string) => void;
  onNavigateBack: () => void;
  onOpenSettings: () => void;
  addCategory: (universeId: string, category: string) => Promise<void>;
  renameCategory: (universeId: string, oldCategory: string, newCategory: string) => Promise<void>;
}

export const PageSidebar = ({
  universe,
  currentPage,
  searchQuery,
  setSearchQuery,
  selectedPage,
  setSelectedPage,
  setDeleteModal,
  expandedCategories,
  setExpandedCategories,
  isCreatingPage,
  setIsCreatingPage,
  isCreatingCategory,
  setIsCreatingCategory,
  isRenamingCategory,
  setIsRenamingCategory,
  newPageCategory,
  setNewPageCategory,
  newPageTitle,
  setNewPageTitle,
  newCategoryName,
  setNewCategoryName,
  categoryToRename,
  setCategoryToRename,
  renameCategoryValue,
  setRenameCategoryValue,
  handleCreatePage,
  handleCreateCategory,
  handleRenameCategory,
  movePage,
  onNavigateBack,
  onOpenSettings,
  addCategory,
  renameCategory
}: PageSidebarProps) => {
  const { isDraggingPage } = useDragLayer((monitor) => ({
    isDraggingPage: monitor.isDragging() && monitor.getItemType() === 'page'
  }));

  const categories = useMemo(() => {
    if (!universe) return [];
    return Array.from(new Set(universe.categories || []));
  }, [universe]);

  const filteredPages = useMemo(() => {
    if (!universe) return [];
    if (!searchQuery.trim()) return universe.pages;
    const lower = searchQuery.toLowerCase();
    return universe.pages.filter(p => 
      p.title.toLowerCase().includes(lower) || 
      p.subsections.some(s => s.title.toLowerCase().includes(lower))
    );
  }, [universe, searchQuery]);

  return (
    <div className={`w-[300px] flex-shrink-0 border-r flex flex-col z-10 relative transition-colors duration-300
                    ${universe.settings?.theme === 'Dark' ? 'bg-[#2d3748] border-gray-700' : 
                      universe.settings?.theme === 'Parchment' ? 'bg-[#fefcbf] border-[#e2e8f0]' : 
                      'bg-white border-[#e1e3e4]'}`}>
      {/* Header */}
      <div className={`p-6 border-b flex items-center justify-between ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
        <div className="flex items-center gap-3">
          {universe.icon ? (
            <ImageWithFallback src={universe.icon} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="bg-[#395771] rounded-full p-2 shrink-0">
              <Book className="w-5 h-5 text-[#aecdeb]" />
            </div>
          )}
          <div className="min-w-0">
            <div className={`font-bold text-[14px] truncate ${universe.settings?.theme === 'Dark' ? 'text-white' : 'text-[#164e63]'}`}>
              {universe.name}
            </div>
            <div className={`text-[10px] opacity-70 uppercase tracking-[0.5px] line-clamp-2 mt-0.5 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`}>
              {universe.description || 'Universe Setting'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`flex border-b ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
        <div className={`flex-1 py-3 px-4 font-semibold text-[12px] border-b-2 text-center
                        ${universe.settings?.theme === 'Dark' ? 'text-blue-400 border-blue-400' : 'text-[#214059] border-[#214059]'}`}>
          Editor
        </div>
        <Link
          to={`/world/${universe.id}/map`}
          className={`flex-1 py-3 px-4 font-semibold text-[12px] opacity-60 hover:opacity-100 text-center
                     ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#44474c]'}`}
        >
          Map
        </Link>
      </div>

      {/* Search */}
      <div className={`p-4 border-b ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-opacity-50 transition-all
                        ${universe.settings?.theme === 'Dark' 
                          ? 'bg-[#1a202c] border-gray-600 focus-within:border-blue-500 focus-within:ring-blue-500/50' 
                          : 'bg-white border-[#e1e3e4] focus-within:border-[#214059] focus-within:ring-[#214059]'}`}>
          <Search className={`w-4 h-4 shrink-0 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-gray-400'}`} />
          <input 
            type="text" 
            placeholder="Search pages & sections..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-transparent outline-none text-sm
                       ${universe.settings?.theme === 'Dark' ? 'text-gray-200 placeholder-gray-500' : 'text-[#214059] placeholder-gray-400'}`}
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {(filteredPages.filter(p => !p.category || p.category === 'Uncategorized').length > 0 || isDraggingPage) && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CategoryDropZone category="" isExpanded={true} universe={universe} movePage={movePage}>
                {filteredPages.filter(p => !p.category || p.category === 'Uncategorized').map((page, index) => (
                  <DraggablePage 
                    key={page.id} 
                    page={page} 
                    index={index} 
                    category=""
                    currentPage={currentPage}
                    universe={universe}
                    searchQuery={searchQuery}
                    setSelectedPage={setSelectedPage}
                    setDeleteModal={setDeleteModal}
                    movePage={movePage}
                  />
                ))}
                {filteredPages.filter(p => !p.category || p.category === 'Uncategorized').length === 0 && isDraggingPage && (
                  <div className={`mx-2 my-1 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 px-3 py-2 transition-colors ${universe.settings?.theme === 'Dark' ? 'border-gray-600 bg-gray-800/50' : 'border-blue-300 bg-blue-50/50'}`}>
                    <Layers className={`w-4 h-4 shrink-0 ${universe.settings?.theme === 'Dark' ? 'text-gray-500' : 'text-blue-500'}`} />
                    <span className={`text-xs font-medium ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-blue-600'}`}>Drop page here to remove from category</span>
                  </div>
                )}
              </CategoryDropZone>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        {categories.filter(c => c !== 'Uncategorized').map(category => {
          const catPages = filteredPages.filter(p => p.category === category);
          if (searchQuery.trim() && catPages.length === 0) return null;
          const isExpanded = searchQuery.trim() ? true : expandedCategories.has(category);
          
          return (
            <div key={category} className="space-y-1 mb-6">
              <div 
                className="flex items-center gap-2 px-2 py-1 cursor-pointer group"
                onClick={() => {
                  const next = new Set(expandedCategories);
                  if (next.has(category)) next.delete(category);
                  else next.add(category);
                  setExpandedCategories(next);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`} />
                )}
                <span className={`text-xs font-semibold tracking-wider uppercase ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#44474c]'}`}>{category}</span>
                
                <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryToRename(category);
                      setRenameCategoryValue(category);
                      setIsRenamingCategory(true);
                    }}
                    className={`p-1 rounded ${universe.settings?.theme === 'Dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <Pencil className={`w-3 h-3 ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#214059]'}`} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewPageCategory(category);
                      setIsCreatingPage(true);
                    }}
                    className={`p-1 rounded ${universe.settings?.theme === 'Dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <Plus className={`w-3 h-3 ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#214059]'}`} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({
                        isOpen: true,
                        type: 'category',
                        itemId: category,
                        itemName: category
                      });
                    }}
                    className={`p-1 rounded ${universe.settings?.theme === 'Dark' ? 'hover:bg-gray-600 hover:text-red-400' : 'hover:bg-gray-100 hover:text-red-500'}`}
                  >
                    <Trash2 className={`w-3 h-3 ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#214059]'}`} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <CategoryDropZone category={category} isExpanded={isExpanded} universe={universe} movePage={movePage}>
                  {catPages.map((page, index) => (
                    <DraggablePage 
                      key={page.id} 
                      page={page} 
                      index={index} 
                      category={category}
                      currentPage={currentPage}
                      universe={universe}
                      searchQuery={searchQuery}
                      setSelectedPage={setSelectedPage}
                      setDeleteModal={setDeleteModal}
                      movePage={movePage}
                    />
                  ))}
                  {catPages.length === 0 && !searchQuery.trim() && (
                    <div className="text-xs text-gray-400 italic px-3 py-1">No pages</div>
                  )}
                </CategoryDropZone>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setIsCreatingCategory(true)}
          className={`mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors font-medium border border-dashed
                     ${universe.settings?.theme === 'Dark' 
                       ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                       : 'text-[#214059] border-[#214059]/30 hover:bg-[#f8f9fa]'}`}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t flex items-center justify-between ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
        <button
          onClick={onNavigateBack}
          className={`flex items-center gap-2 transition-colors ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:text-white' : 'text-[#44474c] hover:text-[#214059]'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Dashboard</span>
        </button>
        <button 
          onClick={onOpenSettings} 
          className={`p-2 rounded-lg transition-colors ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-[#44474c] hover:text-[#214059] hover:bg-gray-100'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
