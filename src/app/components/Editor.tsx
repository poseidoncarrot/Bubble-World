import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Book, Plus, MapIcon, Settings, ChevronDown, ChevronRight, Edit, Trash2, Link as LinkIcon, Image as ImageIcon, Upload, X, ArrowLeft, Pencil, Search, GripVertical, Layers } from 'lucide-react';
import { useUniverseStore } from '../utils/UniverseContext';
import { Universe, Page, Subsection } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useDrag, useDrop, useDragLayer } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';

interface DraggablePageProps {
  page: Page;
  index: number;
  category: string;
  currentPage: Page | null;
  universe: Universe;
  searchQuery: string;
  setSelectedPage: (p: Page) => void;
  setDeleteModal: (m: any) => void;
  movePage: (dragIndex: number, hoverIndex: number, dragCategory: string, hoverCategory: string, pageId: string) => void;
}

const DraggablePage = ({ page, index, category, currentPage, universe, searchQuery, setSelectedPage, setDeleteModal, movePage }: DraggablePageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'page',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!previewRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragCategory = item.category;
      const hoverCategory = category;

      // Moving to self
      if (dragIndex === hoverIndex && dragCategory === hoverCategory) return;

      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragCategory === hoverCategory) {
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      }

      movePage(dragIndex, hoverIndex, dragCategory, hoverCategory, item.id);
      
      item.index = hoverIndex;
      item.category = hoverCategory;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'page',
    item: () => ({ id: page.id, index, category }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);
  drop(previewRef);

  return (
    <button
      ref={previewRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => setSelectedPage(page)}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
        currentPage?.id === page.id
          ? (universe.settings?.theme === 'Dark' ? 'bg-gray-700 text-blue-400 font-medium' : 'bg-[#eef2f6] text-[#214059] font-medium')
          : (universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-[#44474c] hover:bg-gray-50')
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div ref={dragRef} className="cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={e => e.stopPropagation()}>
          <GripVertical className="w-3 h-3" />
        </div>
        <span className="truncate flex-1">{page.title}</span>
      </div>
      {searchQuery.trim() && page.subsections.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())) && (
        <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded ${universe.settings?.theme === 'Dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>match</span>
      )}
      <Trash2 
        className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-red-500 ml-1 cursor-pointer shrink-0" 
        onClick={(e) => {
          e.stopPropagation();
          setDeleteModal({
            isOpen: true,
            type: 'page',
            itemId: page.id,
            itemName: page.title
          });
        }}
      />
    </button>
  );
};

interface CategoryDropZoneProps {
  category: string;
  isExpanded: boolean;
  universe: Universe;
  movePage: (dragIndex: number, hoverIndex: number, dragCategory: string, hoverCategory: string, pageId: string) => void;
  children: React.ReactNode;
}

const CategoryDropZone = ({ category, isExpanded, universe, movePage, children }: CategoryDropZoneProps) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'page',
    drop: (item: any) => {
      // Handle drop logic here
      movePage(item.index, 0, item.category, category, item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  const isUncategorized = !category || category === 'Uncategorized';

  return (
    <div ref={dropRef} className={`space-y-1 transition-colors pb-2 ${isUncategorized ? '' : 'ml-4 border-l-2 pl-2 min-h-[10px]'} ${universe.settings?.theme === 'Dark' ? 'border-gray-600' : 'border-gray-100'} ${isOver ? 'bg-blue-50/50 dark:bg-blue-900/10 rounded-lg' : ''}`}>
      {children}
    </div>
  );
};

interface DraggableSubsectionProps {
  sub: Subsection;
  index: number;
  currentPage: Page;
  universe: Universe;
  setDeleteModal: (m: any) => void;
  updateSubsection: (uId: string, pId: string, sId: string, updates: Partial<Subsection>) => void;
  moveSubsection: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableSubsection = ({ sub, index, currentPage, universe, setDeleteModal, updateSubsection, moveSubsection }: DraggableSubsectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'subsection',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!previewRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveSubsection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'subsection',
    item: () => ({ id: sub.id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);
  drop(previewRef);
  preview(previewRef);

  return (
    <div ref={previewRef} style={{ opacity: isDragging ? 0.5 : 1 }} className={`relative group p-6 -mx-6 rounded-2xl border transition-all 
                                 ${universe.settings?.theme === 'Dark' ? 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50' : 'border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm'}`}>
      <div ref={ref} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 p-1 cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
        <GripVertical className="w-4 h-4" />
      </div>
      <button 
        onClick={() => setDeleteModal({
          isOpen: true,
          type: 'subsection',
          itemId: sub.id,
          itemName: sub.title || 'Subsection',
          parentId: currentPage.id
        })}
        className={`absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg 
                   ${universe.settings?.theme === 'Dark' ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <input
        type="text"
        value={sub.title}
        onChange={(e) => updateSubsection(universe.id, currentPage.id, sub.id, { title: e.target.value })}
        className={`w-full font-bold text-[24px] bg-transparent border-none outline-none mb-4 pl-4
                   ${universe.settings?.theme === 'Dark' ? 'text-gray-200 placeholder-gray-600' : 'text-[#214059] placeholder-gray-300'}`}
        placeholder="Subsection Title"
      />
      <RichTextEditor
        key={sub.id}
        content={sub.content}
        onChange={(val) => updateSubsection(universe.id, currentPage.id, sub.id, { content: val })}
      />
      
      {/* Connections Section within Subsection */}
      <div className="mt-4 p-4 bg-black/5 rounded-xl ml-4">
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon className={`w-4 h-4 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`} />
          <span className={`text-sm font-medium ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`}>Connections</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sub.connections.map(connId => {
            const connectedPage = universe.pages.find(p => p.id === connId) || 
                                  universe.pages.flatMap(p => p.subsections).find(s => s.id === connId);
            return connectedPage ? (
              <span key={connId} className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${universe.settings?.theme === 'Dark' ? 'bg-gray-700 text-blue-300' : 'bg-[#eef2f6] text-[#214059]'}`}>
                {connectedPage.title}
                <button onClick={() => updateSubsection(universe.id, currentPage.id, sub.id, { connections: sub.connections.filter(id => id !== connId) })}>
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
                updateSubsection(universe.id, currentPage.id, sub.id, { connections: [...sub.connections, e.target.value] });
              }
            }}
          >
            <option value="">+ Add Connection</option>
            {universe.pages.filter(p => p.id !== currentPage.id).map(p => (
              <option key={p.id} value={p.id}>Page: {p.title}</option>
            ))}
            {universe.pages.flatMap(p => p.subsections).filter(s => s.id !== sub.id).map(s => (
              <option key={s.id} value={s.id}>Section: {s.title}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

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
  const [renameCategoryValue, setRenameCategoryValue] = useState('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isDraggingPage } = useDragLayer((monitor) => ({
    isDraggingPage: monitor.isDragging() && monitor.getItemType() === 'page'
  }));

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
    if (universe && universe.pages.length > 0 && !selectedPage) {
      setSelectedPage(universe.pages[0]);
    }
  }, [universe, selectedPage]);

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

  if (!universe) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Refreshed selected page
  const currentPage = universe.pages.find(p => p.id === selectedPage?.id) || (universe.pages.length > 0 ? universe.pages[0] : null);

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
    if (newPageTitle.trim()) {
      const page = await createPage(universe.id, newPageTitle, '', newPageCategory);
      setSelectedPage(page);
      setIsCreatingPage(false);
      setNewPageTitle('');
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentPage) {
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

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300"
         style={{ 
           backgroundColor: universe.settings?.theme === 'Dark' ? '#1a202c' : 
                            universe.settings?.theme === 'Parchment' ? '#fdf6e3' : '#f8f9fa'
         }}>
      {/* Left Sidebar */}
      <div className={`w-[300px] flex-shrink-0 border-r flex flex-col z-10 relative transition-colors duration-300
                      ${universe.settings?.theme === 'Dark' ? 'bg-[#2d3748] border-gray-700' : 
                        universe.settings?.theme === 'Parchment' ? 'bg-[#fefcbf] border-[#e2e8f0]' : 
                        'bg-white border-[#e1e3e4]'}`}>
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
              <div className={`text-[10px] opacity-70 uppercase tracking-[0.5px] truncate mt-0.5 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`}>
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
                <CategoryDropZone category="" isExpanded={true} universe={universe} movePage={handleMovePage}>
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
                      movePage={handleMovePage}
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
                  <CategoryDropZone category={category} isExpanded={isExpanded} universe={universe} movePage={handleMovePage}>
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
                        movePage={handleMovePage}
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

        <div className={`p-4 border-t flex items-center justify-between ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 transition-colors ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:text-white' : 'text-[#44474c] hover:text-[#214059]'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)} 
            className={`p-2 rounded-lg transition-colors ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-[#44474c] hover:text-[#214059] hover:bg-gray-100'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

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
                  value={universe.name}
                  onChange={(e) => updateUniverse(universe.id, { name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none text-black" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Universe Description</label>
                <textarea 
                  value={universe.description}
                  onChange={(e) => updateUniverse(universe.id, { description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none resize-none h-24 text-black" 
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
