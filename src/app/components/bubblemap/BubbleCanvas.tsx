import { useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { BubbleNode } from './BubbleNode';

interface BubbleCanvasProps {
  nodes: Array<{
    id: string;
    type: 'page' | 'subsection';
    title: string;
    x: number;
    y: number;
    matchesSearch: boolean;
  }>;
  edges: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    type: 'hierarchy' | 'connection';
  }>;
  pan: { x: number; y: number };
  zoom: number;
  connectingFrom: { type: 'page' | 'subsection'; id: string } | null;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onNodeClick: (node: any) => void;
  onToggleConnection: (node: any) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCancelConnection: () => void;
  universeTheme?: string;
}

export const BubbleCanvas = ({
  nodes,
  edges,
  pan,
  zoom,
  connectingFrom,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onNodeClick,
  onToggleConnection,
  onZoomIn,
  onZoomOut,
  onCancelConnection,
  universeTheme
}: BubbleCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div 
        className="absolute inset-0 origin-center transition-transform duration-75"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {/* Edges */}
        <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-none">
          {edges.map((e, i) => (
            <line 
              key={i} 
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
              stroke={e.type === 'hierarchy' ? 'rgba(33,64,89,0.1)' : 'rgba(239,68,68,0.4)'} 
              strokeWidth={e.type === 'hierarchy' ? 2 : 1.5}
              strokeDasharray={e.type === 'connection' ? '5,5' : 'none'}
            />
          ))}
          {/* Active connecting line */}
          {connectingFrom && (
            nodes.filter(n => n.id === connectingFrom.id).map(n => (
              <line key="active" x1={n.x} y1={n.y} x2={n.x + 100} y2={n.y - 100} stroke="blue" strokeWidth={2} strokeDasharray="5,5" />
            ))
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <BubbleNode
            key={node.id}
            node={node}
            connectingFrom={connectingFrom}
            onNodeClick={onNodeClick}
            onToggleConnection={onToggleConnection}
            universeTheme={universeTheme}
          />
        ))}
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-6 right-6 flex items-center bg-white/80 backdrop-blur rounded-full shadow-lg p-1 border border-gray-200">
        <button onClick={onZoomIn} className="p-3 text-gray-600 hover:text-[#214059] hover:bg-gray-100 rounded-full">
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button onClick={onZoomOut} className="p-3 text-gray-600 hover:text-[#214059] hover:bg-gray-100 rounded-full">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {connectingFrom && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-sm font-medium">Select a node to connect</span>
          <button onClick={onCancelConnection} className="p-1 hover:bg-blue-600 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
