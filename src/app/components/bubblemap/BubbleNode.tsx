/**
 * BubbleNode component - Individual node in the bubble map
 * 
 * This component represents a single node (page or subsection) in the visual map:
 * - Displays as a circular bubble with title
 * - Can be dragged to reposition
 * - Can be clicked to navigate to editor
 * - Can be connected to other nodes
 * - Shows visual feedback during drag and connection mode
 * - Different sizes for pages vs subsections
 * - Search highlighting (dimmed if not matching)
 * 
 * Visual States:
 * - Normal: White/light background with border
 * - Hover: Slight scale increase
 * - Dragging: Scale up, shadow increase, z-index boost
 * - Connecting: Blue ring highlight
 * - Search mismatch: 20% opacity
 * 
 * Actions:
 * - Click: Navigate to node in editor
 * - Drag: Reposition node on canvas
 * - Link button: Enter/exit connection mode
 * 
 * TODO: Add node icons based on type
 * TODO: Add node color coding
 * TODO: Add connection count badge
 * TODO: Add node preview on hover
 */

import { Link as LinkIcon, X } from 'lucide-react';

interface BubbleNodeProps {
  node: {
    id: string;
    type: 'page' | 'subsection';
    title: string;
    x: number;
    y: number;
    matchesSearch: boolean;
  };
  connectingFrom: { type: 'page' | 'subsection'; id: string } | null;
  draggingNode: string | null;
  onNodeClick: (node: BubbleNodeProps['node']) => void;
  onToggleConnection: (node: BubbleNodeProps['node']) => void;
  onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  universeTheme?: string;
}

export const BubbleNode = ({ 
  node, 
  connectingFrom, 
  draggingNode,
  onNodeClick, 
  onToggleConnection,
  onNodeMouseDown,
  universeTheme 
}: BubbleNodeProps) => {
  const isDarkTheme = universeTheme === 'Dark';
  const isDragging = draggingNode === node.id;
  
  return (
    <div 
      key={node.id}
      data-node="true"
      className={`absolute top-0 left-0 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 transition-all cursor-move group ${
        node.type === 'page' ? 'w-32 h-32 bg-white border-[#214059]' : 'w-24 h-24 bg-[#f8f9fa] border-gray-300'
      } ${!node.matchesSearch ? 'opacity-20' : ''} ${connectingFrom?.id === node.id ? 'ring-4 ring-blue-500' : ''} ${isDragging ? 'z-50 scale-110 shadow-2xl' : 'hover:scale-105'}`}
      style={{ 
        transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`,
        transition: isDragging ? 'none' : 'transform 0.2s'
      }}
      onClick={(e) => { 
        if (!isDragging) {
          e.stopPropagation(); 
          onNodeClick(node); 
        }
      }}
      onMouseDown={(e) => { 
        e.stopPropagation(); 
        onNodeMouseDown(e, node.id); 
      }}
    >
      <div className="font-bold text-[12px] text-[#214059] px-2 leading-tight">
        {node.title}
      </div>
      
      {/* Node Actions Overlay */}
      <div className="absolute -bottom-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleConnection(node); }}
          className={`p-1.5 rounded-full shadow-sm text-white ${connectingFrom?.id === node.id ? 'bg-red-500 hover:bg-red-600' : 'bg-[#214059] hover:bg-[#164e63]'}`}
        >
          {connectingFrom?.id === node.id ? <X className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
