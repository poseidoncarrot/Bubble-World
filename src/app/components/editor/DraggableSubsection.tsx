import { useRef, useCallback } from 'react';
import { Trash2, GripVertical, Link as LinkIcon, X } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { Page, Subsection, Universe } from '../../types';
import { RichTextEditor } from '../RichTextEditor';
import { useDebounce } from '../../hooks/useDebounce';

interface DraggableSubsectionProps {
  sub: Subsection;
  index: number;
  currentPage: Page;
  universe: Universe;
  setDeleteModal: (m: any) => void;
  updateSubsection: (uId: string, pId: string, sId: string, updates: Partial<Subsection>) => void;
  moveSubsection: (dragIndex: number, hoverIndex: number) => void;
}

export const DraggableSubsection = ({ 
  sub, 
  index, 
  currentPage, 
  universe, 
  setDeleteModal, 
  updateSubsection, 
  moveSubsection 
}: DraggableSubsectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const debouncedUpdateTitle = useCallback(
    useDebounce((universeId: string, pageId: string, subsectionId: string, title: string) => {
      updateSubsection(universeId, pageId, subsectionId, { title });
    }, 500),
    [updateSubsection]
  );

  const debouncedUpdateContent = useCallback(
    useDebounce((universeId: string, pageId: string, subsectionId: string, content: string) => {
      updateSubsection(universeId, pageId, subsectionId, { content });
    }, 500),
    [updateSubsection]
  );

  const [, drop] = useDrop({
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
      if (!hoverBoundingRect) return;
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
        onChange={(e) => debouncedUpdateTitle(universe.id, currentPage.id, sub.id, e.target.value)}
        className={`w-full font-bold text-[24px] bg-transparent border-none outline-none mb-4 pl-4
                   ${universe.settings?.theme === 'Dark' ? 'text-gray-200 placeholder-gray-600' : 'text-[#214059] placeholder-gray-300'}`}
        placeholder="Subsection Title"
      />
      <RichTextEditor
        key={sub.id}
        content={sub.content}
        onChange={(val) => debouncedUpdateContent(universe.id, currentPage.id, sub.id, val)}
        theme={universe.settings?.theme || 'Light (Default)'}
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
