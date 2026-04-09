/**
 * BubbleSidebar component - Navigation sidebar for bubble map view
 * 
 * This component provides the left sidebar in the bubble map with:
 * - Universe header with icon and description
 * - Navigation tabs (Editor/Map)
 * - Search functionality for nodes
 * - Category-based node organization
 * - Node navigation (click to pan to node on canvas)
 * - Category management (delete)
 * - Theme-aware styling
 * 
 * Features:
 * - Expandable/collapsible categories
 * - Search filters nodes by title
 * - Click node to pan canvas to that node
 * - "Uncategorized" section for nodes without categories
 * - Visual feedback during navigation
 * 
 * Navigation Logic:
 * - When a node is clicked, the canvas pans to center that node
 * - Uses node coordinates (x, y) to calculate pan offset
 * - Nodes are filtered to find matching coordinates
 * 
 * TODO: Add node count per category
 * TODO: Add category color coding
 * TODO: Add node position indicator
 * TODO: Implement nested categories
 */

import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Trash2, Book, ArrowLeft, Settings } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Universe } from '../../types';

interface BubbleSidebarProps {
  universe: Universe;
  worldId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedCategories: Set<string>;
  setExpandedCategories: (categories: Set<string>) => void;
  nodes: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  onNodeNavigate: (nodeId: string) => void;
  onDeleteCategory: (category: string) => void;
  onNavigateBack: () => void;
  onOpenSettings: () => void;
}

export const BubbleSidebar = ({
  universe,
  worldId,
  searchQuery,
  setSearchQuery,
  expandedCategories,
  setExpandedCategories,
  nodes,
  onNodeNavigate,
  onDeleteCategory,
  onNavigateBack,
  onOpenSettings
}: BubbleSidebarProps) => {
  const categories = universe.categories || [];

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
        <Link
          to={`/world/${worldId}/editor`}
          className={`flex-1 py-3 px-4 font-semibold text-[12px] opacity-60 hover:opacity-100 text-center
                     ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#44474c]'}`}
        >
          Editor
        </Link>
        <div className={`flex-1 py-3 px-4 font-semibold text-[12px] border-b-2 text-center
                        ${universe.settings?.theme === 'Dark' ? 'text-blue-400 border-blue-400' : 'text-[#214059] border-[#214059]'}`}>
          Map
        </div>
      </div>

      {/* Search */}
      <div className={`p-4 border-b ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a4a8]" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none ${universe.settings?.theme === 'Dark' ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-400/50' : 'bg-[#f1f3f4] text-black focus:ring-2 focus:ring-[#214059]/20'}`}
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {universe.pages.filter(p => !p.category || p.category === 'Uncategorized').length > 0 && (
          <div className="space-y-1">
            {universe.pages.filter(p => !p.category || p.category === 'Uncategorized').map(page => (
              <div key={page.id} className={`text-sm py-1 px-2 rounded cursor-pointer font-medium ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-[#44474c] hover:bg-gray-100'}`}
                   onClick={() => {
                     const node = nodes.find(n => n.id === page.id);
                     if (node) {
                       onNodeNavigate(page.id);
                     }
                   }}
              >
                {page.title}
              </div>
            ))}
          </div>
        )}

        {categories.filter(c => c !== 'Uncategorized').map(category => (
          <div key={category} className="space-y-1">
            <div 
              className="flex items-center gap-2 px-2 py-1 cursor-pointer group"
              onClick={() => {
                const next = new Set(expandedCategories);
                if (next.has(category)) next.delete(category);
                else next.add(category);
                setExpandedCategories(next);
              }}
            >
              {expandedCategories.has(category) ? (
                <ChevronDown className={`w-4 h-4 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`} />
              ) : (
                <ChevronRight className={`w-4 h-4 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`} />
              )}
              <span className={`text-xs font-semibold tracking-wider uppercase ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#44474c]'}`}>{category}</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1">
                {category !== 'Uncategorized' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category);
                    }}
                    className={`p-1 rounded ${universe.settings?.theme === 'Dark' ? 'hover:bg-gray-600 hover:text-red-400' : 'hover:bg-gray-100 hover:text-red-500'}`}
                  >
                    <Trash2 className={`w-3 h-3 ${universe.settings?.theme === 'Dark' ? 'text-gray-300' : 'text-[#214059]'}`} />
                  </button>
                )}
              </div>
            </div>
            
            {expandedCategories.has(category) && (
              <div className={`space-y-1 ml-6 border-l-2 pl-2 ${universe.settings?.theme === 'Dark' ? 'border-gray-600' : 'border-gray-100'}`}>
                {universe.pages.filter(p => (p.category || 'Uncategorized') === category).map(page => (
                  <div key={page.id} className={`text-sm py-1 px-2 rounded cursor-pointer ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-[#44474c] hover:bg-gray-100'}`}
                       onClick={() => {
                         const node = nodes.find(n => n.id === page.id);
                         if (node) {
                           onNodeNavigate(page.id);
                         }
                       }}
                  >
                    {page.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
