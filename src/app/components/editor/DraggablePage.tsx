/**
 * DraggablePage component - Individual page item with drag-and-drop support
 * 
 * This component represents a single page in the sidebar that can:
 * - Be clicked to select and navigate to the page
 * - Be dragged to reorder within the same category
 * - Be dragged to move between categories
 * - Show visual feedback when selected or hovering
 * - Display "match" badge when search query matches subsection content
 * - Be deleted via trash icon
 * 
 * Drag-and-Drop Logic:
 * - Uses react-dnd with HTML5 backend
 * - Calculates hover threshold (middle of item) to determine when to swap
 * - Only swaps when mouse crosses the midpoint
 * - Supports both intra-category and inter-category moves
 * - Updates item index and category during drag
 * 
 * TODO: Add keyboard support for selection
 * TODO: Add page preview on hover
 * TODO: Add page metadata display (word count, last edited)
 */

import { useRef } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { Page, Universe } from '../../types';

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

export const DraggablePage = ({ 
  page, 
  index, 
  category, 
  currentPage, 
  universe, 
  searchQuery, 
  setSelectedPage, 
  setDeleteModal, 
  movePage 
}: DraggablePageProps) => {
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
