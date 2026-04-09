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
