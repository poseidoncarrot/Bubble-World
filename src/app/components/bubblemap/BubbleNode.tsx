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
  onNodeClick: (node: BubbleNodeProps['node']) => void;
  onToggleConnection: (node: BubbleNodeProps['node']) => void;
  universeTheme?: string;
}

export const BubbleNode = ({ 
  node, 
  connectingFrom, 
  onNodeClick, 
  onToggleConnection,
  universeTheme 
}: BubbleNodeProps) => {
  const isDarkTheme = universeTheme === 'Dark';
  
  return (
    <div 
      key={node.id}
      className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 transition-all cursor-pointer group ${
        node.type === 'page' ? 'w-32 h-32 bg-white border-[#214059]' : 'w-24 h-24 bg-[#f8f9fa] border-gray-300'
      } ${!node.matchesSearch ? 'opacity-20' : ''} ${connectingFrom?.id === node.id ? 'ring-4 ring-blue-500' : ''}`}
      style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
      onClick={(e) => { e.stopPropagation(); onNodeClick(node); }}
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
