import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Search, ZoomIn, ZoomOut, Link as LinkIcon, Edit3, X, ChevronDown, ChevronRight, Book, ArrowLeft, Settings, Trash2 } from 'lucide-react';
import { useUniverseStore } from '../utils/UniverseContext';
import { Page, Subsection } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export default function BubbleMap() {
  const { worldId: universeId } = useParams();
  const navigate = useNavigate();
  const { universes, updatePage, updateSubsection, updateUniverse, deleteUniverse, deleteCategory } = useUniverseStore();
  const universe = universes.find(u => u.id === universeId);

  const [searchQuery, setSearchQuery] = useState('');
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([]));
  
  // Local state for universe settings to prevent fast typing bugs
  const [localUniverseName, setLocalUniverseName] = useState('');
  const [localUniverseDescription, setLocalUniverseDescription] = useState('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Separate debounced update functions to prevent field interference
  const debouncedUpdateUniverseName = useMemo(
    () => {
      let timeoutId: NodeJS.Timeout;
      return (universeId: string, name: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateUniverse(universeId, { name });
        }, 500);
      };
    },
    [updateUniverse]
  );
  
  const debouncedUpdateUniverseDescription = useMemo(
    () => {
      let timeoutId: NodeJS.Timeout;
      return (universeId: string, description: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateUniverse(universeId, { description });
        }, 500);
      };
    },
    [updateUniverse]
  );
  
  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup will be handled by the debounced functions' internal clearTimeout
    };
  }, []);
  
  // Sync local state with universe data when universe changes
  useEffect(() => {
    if (universe) {
      setLocalUniverseName(universe.name);
      setLocalUniverseDescription(universe.description);
    }
  }, [universe]);

  const [connectingFrom, setConnectingFrom] = useState<{ type: 'page' | 'subsection', id: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'category' | 'page' | 'subsection' | 'universe';
    itemId: string;
    itemName: string;
  }>({
    isOpen: false,
    type: 'universe',
    itemId: '',
    itemName: ''
  });

  const categories = useMemo(() => {
    if (!universe) return [];
    return universe.categories || [];
  }, [universe]);

  if (!universe) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Generate nodes positions (simple layout: circle for pages, ring for subsections)
  const nodes = useMemo(() => {
    if (!universe) return [];
    
    const pages = universe.pages;
    const items: Array<{ id: string, type: 'page' | 'subsection', title: string, x: number, y: number, parentId?: string, matchesSearch: boolean }> = [];
    
    const centerX = 0;
    const centerY = 0;
    const pageRadius = 400;

    const lowerQuery = searchQuery.toLowerCase();

    pages.forEach((page, i) => {
      const angle = (i / pages.length) * 2 * Math.PI;
      const px = centerX + pageRadius * Math.cos(angle);
      const py = centerY + pageRadius * Math.sin(angle);
      
      const matchesSearch = lowerQuery === '' || page.title.toLowerCase().includes(lowerQuery);
      
      items.push({ id: page.id, type: 'page', title: page.title, x: px, y: py, matchesSearch });

      page.subsections.forEach((sub, j) => {
        const subAngle = angle + ((j - (page.subsections.length - 1) / 2) * 0.4);
        const subRadius = pageRadius + 200;
        const sx = centerX + subRadius * Math.cos(subAngle);
        const sy = centerY + subRadius * Math.sin(subAngle);
        
        const subMatchesSearch = lowerQuery === '' || sub.title.toLowerCase().includes(lowerQuery);
        
        items.push({ id: sub.id, parentId: page.id, type: 'subsection', title: sub.title, x: sx, y: sy, matchesSearch: subMatchesSearch });
      });
    });
    return items;
  }, [universe, searchQuery]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.min(Math.max(0.1, z - e.deltaY * 0.01), 3));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan on middle mouse or if clicking background
    if (e.target === containerRef.current || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleNodeClick = async (node: typeof nodes[0]) => {
    if (connectingFrom) {
      if (connectingFrom.id !== node.id) {
        // Create connection
        if (connectingFrom.type === 'page') {
          const fromPage = universe.pages.find(p => p.id === connectingFrom.id);
          if (fromPage && !fromPage.connections.includes(node.id)) {
            await updatePage(universe.id, fromPage.id, { connections: [...fromPage.connections, node.id] });
          }
        } else {
          // Find subsection's page
          const fromPage = universe.pages.find(p => p.subsections.some(s => s.id === connectingFrom.id));
          const fromSub = fromPage?.subsections.find(s => s.id === connectingFrom.id);
          if (fromPage && fromSub && !fromSub.connections.includes(node.id)) {
            await updateSubsection(universe.id, fromPage.id, fromSub.id, { connections: [...fromSub.connections, node.id] });
          }
        }
      }
      setConnectingFrom(null);
    }
  };

  const toggleConnectionMode = (node: typeof nodes[0]) => {
    if (connectingFrom?.id === node.id) {
      setConnectingFrom(null);
    } else {
      setConnectingFrom({ type: node.type, id: node.id });
    }
  };

  // Extract edges
  const edges = useMemo(() => {
    const edgesArray: Array<{ x1: number, y1: number, x2: number, y2: number, type: 'hierarchy' | 'connection' }> = [];
    universe.pages.forEach(p => {
      // Page to Subsections (hierarchy)
      const pNode = nodes.find(n => n.id === p.id);
      p.subsections.forEach(s => {
        const sNode = nodes.find(n => n.id === s.id);
        if (pNode && sNode) {
          edgesArray.push({ x1: pNode.x, y1: pNode.y, x2: sNode.x, y2: sNode.y, type: 'hierarchy' });
        }
      });
      // Page to Connections
      p.connections.forEach(cId => {
        const cNode = nodes.find(n => n.id === cId);
        if (pNode && cNode) {
          edgesArray.push({ x1: pNode.x, y1: pNode.y, x2: cNode.x, y2: cNode.y, type: 'connection' });
        }
      });
      // Subsection to Connections
      p.subsections.forEach(s => {
        const sNode = nodes.find(n => n.id === s.id);
        s.connections.forEach(cId => {
          const cNode = nodes.find(n => n.id === cId);
          if (sNode && cNode) {
            edgesArray.push({ x1: sNode.x, y1: sNode.y, x2: cNode.x, y2: cNode.y, type: 'connection' });
          }
        });
      });
    });
    return edgesArray;
  }, [universe.pages, nodes]);

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300"
         style={{ 
           backgroundColor: universe.settings?.theme === 'Dark' ? '#1a202c' : 
                            universe.settings?.theme === 'Parchment' ? '#fdf6e3' : '#f8f9fa'
         }}>
      {/* Sidebar */}
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
              <div className={`text-[10px] opacity-70 uppercase tracking-[0.5px] line-clamp-2 mt-0.5 ${universe.settings?.theme === 'Dark' ? 'text-gray-400' : 'text-[#44474c]'}`}>
                {universe.description || 'Universe Setting'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex border-b ${universe.settings?.theme === 'Dark' ? 'border-gray-700' : 'border-[#e1e3e4]'}`}>
          <Link
            to={`/world/${universeId}/editor`}
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {universe.pages.filter(p => !p.category || p.category === 'Uncategorized').length > 0 && (
            <div className="space-y-1">
              {universe.pages.filter(p => !p.category || p.category === 'Uncategorized').map(page => (
                <div key={page.id} className={`text-sm py-1 px-2 rounded cursor-pointer font-medium ${universe.settings?.theme === 'Dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-[#44474c] hover:bg-gray-100'}`}
                     onClick={() => {
                       const node = nodes.find(n => n.id === page.id);
                       if (node) {
                         setPan({ x: -node.x * zoom + window.innerWidth / 2, y: -node.y * zoom + window.innerHeight / 2 });
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
                             setPan({ x: -node.x * zoom + window.innerWidth / 2, y: -node.y * zoom + window.innerHeight / 2 });
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

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
                <line key="active" x1={n.x} y1={n.y} x2={n.x + 100} y2={n.y - 100} stroke="blue" strokeWidth={2} strokeDasharray="5,5" /> // Dummy representation
              ))
            )}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 transition-all cursor-pointer group ${
                node.type === 'page' ? 'w-32 h-32 bg-white border-[#214059]' : 'w-24 h-24 bg-[#f8f9fa] border-gray-300'
              } ${!node.matchesSearch ? 'opacity-20' : ''} ${connectingFrom?.id === node.id ? 'ring-4 ring-blue-500' : ''}`}
              style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
              onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
            >
              <div className="font-bold text-[12px] text-[#214059] px-2 leading-tight">
                {node.title}
              </div>
              
              {/* Node Actions Overlay */}
              <div className="absolute -bottom-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleConnectionMode(node); }}
                  className={`p-1.5 rounded-full shadow-sm text-white ${connectingFrom?.id === node.id ? 'bg-red-500 hover:bg-red-600' : 'bg-[#214059] hover:bg-[#164e63]'}`}
                >
                  {connectingFrom?.id === node.id ? <X className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex items-center bg-white/80 backdrop-blur rounded-full shadow-lg p-1 border border-gray-200">
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-3 text-gray-600 hover:text-[#214059] hover:bg-gray-100 rounded-full">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => setZoom(z => Math.max(0.1, z - 0.2))} className="p-3 text-gray-600 hover:text-[#214059] hover:bg-gray-100 rounded-full">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>

        {connectingFrom && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="text-sm font-medium">Select a node to connect</span>
            <button onClick={() => setConnectingFrom(null)} className="p-1 hover:bg-blue-600 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto text-black">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-[#214059] text-[24px]">Universe Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Universe Name</label>
                <input 
                  type="text" 
                  value={localUniverseName}
                  maxLength={30}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalUniverseName(value);
                    if (universe?.id) {
                      debouncedUpdateUniverseName(universe.id, value);
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none text-black" 
                  placeholder="Max 30 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Universe Description</label>
                <textarea 
                  value={localUniverseDescription}
                  maxLength={70}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalUniverseDescription(value);
                    if (universe?.id) {
                      debouncedUpdateUniverseDescription(universe.id, value);
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none resize-none h-24 text-black" 
                  placeholder="35 chars per row, 2 rows max"
                  rows={2}
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
        onConfirm={async (options) => {
          if (deleteModal.type === 'universe') {
            await deleteUniverse(universe.id);
            navigate('/');
          } else if (deleteModal.type === 'category') {
            await deleteCategory(universe.id, deleteModal.itemId, options?.deletePages || false);
          }
          setDeleteModal(prev => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        isDarkTheme={universe.settings?.theme === 'Dark'}
      />
    </div>
  );
}
