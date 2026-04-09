import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useUniverseStore } from '../contexts/UniverseContext';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { BubbleSidebar } from './bubblemap/BubbleSidebar';
import { BubbleCanvas } from './bubblemap/BubbleCanvas';
import { useBubbleMap } from '../hooks/useBubbleMap';
import { useDebounce } from '../hooks/useDebounce';

export default function BubbleMap() {
  const { worldId: universeId } = useParams();
  const navigate = useNavigate();
  const { universes, updatePage, updateSubsection, updateUniverse, deleteUniverse, deleteCategory } = useUniverseStore();
  const universe = universes.find(u => u.id === universeId);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([]));
  
  // Local state for universe settings to prevent fast typing bugs
  const [localUniverseName, setLocalUniverseName] = useState('');
  const [localUniverseDescription, setLocalUniverseDescription] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Use custom hooks
  const debouncedUpdateUniverseName = useDebounce(
    (universeId: string, name: string) => {
      updateUniverse(universeId, { name });
    },
    500
  );
  
  const debouncedUpdateUniverseDescription = useDebounce(
    (universeId: string, description: string) => {
      updateUniverse(universeId, { description });
    },
    500
  );

  const {
    pan,
    zoom,
    connectingFrom,
    nodes,
    edges,
    draggingNode,
    setConnectingFrom,
    setZoom,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNodeNavigate,
    toggleConnectionMode,
    handleNodeMouseDown,
    handleNodeMouseMove,
    handleNodeMouseUp
  } = useBubbleMap(universe, searchQuery);

  // Sync local state with universe data when universe changes
  useEffect(() => {
    if (universe) {
      setLocalUniverseName(universe.name);
      setLocalUniverseDescription(universe.description);
    }
  }, [universe]);

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

  if (!universe) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

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

  const handleDeleteConfirm = async (options?: { deletePages?: boolean }) => {
    if (!universe) return;
    
    const { type, itemId } = deleteModal;
    
    if (type === 'universe') {
      await deleteUniverse(universe.id);
      navigate('/');
    } else if (type === 'category') {
      await deleteCategory(universe.id, itemId, options?.deletePages || false);
    }
    
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300"
         style={{ 
           backgroundColor: universe.settings?.theme === 'Dark' ? '#1a202c' : 
                            universe.settings?.theme === 'Parchment' ? '#fdf6e3' : '#f8f9fa'
         }}>
      {/* Sidebar */}
      <BubbleSidebar
        universe={universe}
        worldId={universeId || ''}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        nodes={nodes}
        onNodeNavigate={handleNodeNavigate}
        onDeleteCategory={(category) => {
          setDeleteModal({
            isOpen: true,
            type: 'category',
            itemId: category,
            itemName: category
          });
        }}
        onNavigateBack={() => navigate('/')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Canvas Area */}
      <BubbleCanvas
        nodes={nodes}
        edges={edges}
        pan={pan}
        zoom={zoom}
        connectingFrom={connectingFrom}
        draggingNode={draggingNode}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onNodeClick={handleNodeClick}
        onToggleConnection={toggleConnectionMode}
        onNodeMouseDown={handleNodeMouseDown}
        onNodeMouseMove={handleNodeMouseMove}
        onNodeMouseUp={handleNodeMouseUp}
        onZoomIn={() => zoom < 3 && setZoom(z => z + 0.2)}
        onZoomOut={() => zoom > 0.1 && setZoom(z => z - 0.2)}
        onCancelConnection={() => setConnectingFrom(null)}
        universeTheme={universe.settings?.theme}
      />

      {/* Settings Modal */}
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
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        isDarkTheme={universe.settings?.theme === 'Dark'}
      />
    </div>
  );
}
