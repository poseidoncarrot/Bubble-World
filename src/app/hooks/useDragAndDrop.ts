import { useCallback } from 'react';
import { useDragLayer } from 'react-dnd';

export const useDragAndDrop = () => {
  const { isDraggingPage } = useDragLayer((monitor) => ({
    isDraggingPage: monitor.isDragging() && monitor.getItemType() === 'page'
  }));

  const movePage = useCallback((
    dragIndex: number, 
    hoverIndex: number, 
    dragCategory: string, 
    hoverCategory: string, 
    pageId: string,
    reorderPages: (universeId: string, pageId: string, targetCategory: string | undefined, newIndex: number) => Promise<void>,
    universeId: string
  ) => {
    reorderPages(universeId, pageId, hoverCategory === 'Uncategorized' ? '' : hoverCategory, hoverIndex);
  }, []);

  const moveSubsection = useCallback((
    dragIndex: number, 
    hoverIndex: number,
    reorderSubsections: (universeId: string, pageId: string, startIndex: number, endIndex: number) => Promise<void>,
    universeId: string,
    pageId: string
  ) => {
    reorderSubsections(universeId, pageId, dragIndex, hoverIndex);
  }, []);

  return {
    isDraggingPage,
    movePage,
    moveSubsection
  };
};
