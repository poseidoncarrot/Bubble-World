/**
 * CategoryDropZone component - Drop zone for category-based page organization
 * 
 * This component wraps page lists to enable drag-and-drop between categories:
 * - Accepts dropped pages from other categories
 * - Provides visual feedback when hovering with a dragged page
 * - Handles the drop logic to move pages between categories
 * - Styles differently for "Uncategorized" vs named categories
 * 
 * Features:
 * - Visual highlight when page is dragged over
 * - Moves pages to position 0 when dropped in a category
 * - Left border indentation for named categories
 * - Theme-aware styling
 * 
 * Drop Logic:
 * - When a page is dropped, it's moved to the target category
 * - Page is placed at the top of the category (index 0)
 * - Category is updated in the page's data
 * 
 * TODO: Add drop position indicator (above/below)
 * TODO: Add animation when page is dropped
 * TODO: Show page count in category header
 */

import { useRef, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { Universe } from '../../types';

interface CategoryDropZoneProps {
  category: string;
  isExpanded: boolean;
  universe: Universe;
  movePage: (dragIndex: number, hoverIndex: number, dragCategory: string, hoverCategory: string, pageId: string) => void;
  children: ReactNode;
}

export const CategoryDropZone = ({ 
  category, 
  isExpanded, 
  universe, 
  movePage, 
  children 
}: CategoryDropZoneProps) => {
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
