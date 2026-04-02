import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Globe, Plus, Book, Settings, LogOut, Upload } from 'lucide-react';
import { useUniverseStore } from '../utils/UniverseContext';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useDrag, useDrop } from 'react-dnd';

interface UniverseItemProps {
  universe: any;
  index: number;
  moveUniverse: (dragIndex: number, hoverIndex: number) => void;
  navigate: (path: string) => void;
}

const UniverseItem = ({ universe, index, moveUniverse, navigate }: UniverseItemProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'universe',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveUniverse(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'universe',
    item: () => {
      return { id: universe.id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <button
      ref={ref}
      data-handler-id={handlerId}
      onClick={() => navigate(`/world/${universe.id}/editor`)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.7)] rounded-[32px] border border-[rgba(255,255,255,0.2)] shadow-[0px_12px_40px_0px_rgba(25,28,29,0.06)] p-8 hover:scale-105 transition-transform text-left flex flex-col relative cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-4 mb-4 w-full pointer-events-none">
        {universe.icon ? (
          <ImageWithFallback src={universe.icon} alt={universe.name} className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[#214059]/10" />
        ) : (
          <div className="bg-gradient-to-r from-[#214059] to-[#395771] rounded-full p-4 shrink-0">
            <Book className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#214059] text-[18px] mb-1 truncate">
            {universe.name}
          </h3>
          <p className="font-normal text-[#44474c] text-[12px] opacity-70 line-clamp-2">
            {universe.description || 'No description'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#44474c] opacity-60 pointer-events-none">
        <Book className="w-4 h-4" />
        <span className="text-[12px] font-medium">{universe.pages.length} Pages</span>
      </div>
    </button>
  );
};

export default function WorldsList() {
  const { universes, createUniverse, uploadImage, reorderUniverses, loading: universesLoading } = useUniverseStore();
  const { user, signOut } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUniverseName, setNewUniverseName] = useState('');
  const [newUniverseDescription, setNewUniverseDescription] = useState('');
  const [newUniverseIcon, setNewUniverseIcon] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const moveUniverse = (dragIndex: number, hoverIndex: number) => {
    reorderUniverses(dragIndex, hoverIndex);
  };

  const handleCreateUniverse = async () => {
    if (newUniverseName.trim()) {
      setIsCreating(true);
      try {
        let iconUrl;
        if (newUniverseIcon) {
          iconUrl = await uploadImage(newUniverseIcon);
        }
        const universe = await createUniverse(newUniverseName, newUniverseDescription, iconUrl);
        setNewUniverseName('');
        setNewUniverseDescription('');
        setNewUniverseIcon(null);
        setShowCreateDialog(false);
        navigate(`/world/${universe.id}/editor`);
      } catch (e) {
        console.error(e);
        alert('Failed to create universe');
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative overflow-hidden">
      <div className="absolute inset-0" style={{ 
        backgroundImage: "linear-gradient(141.34deg, rgba(209, 225, 250, 0.3) 0%, rgb(248, 249, 250) 50%, rgba(57, 87, 113, 0.1) 100%)" 
      }} />
      
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        <button onClick={() => signOut()} className="bg-white/50 backdrop-blur-md p-3 rounded-full hover:bg-white/80 transition-colors">
          <LogOut className="w-5 h-5 text-[#214059]" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="flex flex-col items-center gap-2 mb-12">
          <div className="font-extrabold text-[#214059] text-3xl tracking-normal">
            The Architect
          </div>
          <div className="font-medium text-[#44474c] text-[14px] uppercase tracking-wider">
            DESIGN YOUR UNIVERSE
          </div>
        </div>

        {universesLoading ? (
          <div className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.7)] rounded-[48px] border border-[rgba(255,255,255,0.2)] shadow-[0px_12px_40px_0px_rgba(25,28,29,0.06)] p-12 max-w-[480px] w-full">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#214059]"></div>
              <p className="font-normal text-[#44474c] text-[14px]">
                Loading your universes...
              </p>
            </div>
          </div>
        ) : universes.length === 0 ? (
          <div className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.7)] rounded-[48px] border border-[rgba(255,255,255,0.2)] shadow-[0px_12px_40px_0px_rgba(25,28,29,0.06)] p-12 max-w-[480px] w-full">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="bg-gradient-to-r from-[#214059] to-[#395771] rounded-full p-6">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-[#214059] text-[24px] mb-2">
                  Create Your First Universe
                </h2>
                <p className="font-normal text-[#44474c] text-[14px]">
                  Start building your universe by organizing your ideas, characters, locations, and lore.
                </p>
              </div>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-[#214059] to-[#395771] text-white font-semibold px-8 py-4 rounded-full shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Universe
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-bold text-[#214059] text-[32px]">
                Your Universes
              </h1>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-[#214059] to-[#395771] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Universe
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universes.map((universe, index) => (
                <UniverseItem 
                  key={universe.id} 
                  universe={universe} 
                  index={index} 
                  moveUniverse={moveUniverse} 
                  navigate={navigate} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#214059]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h2 className="font-bold text-[#214059] text-[24px] mb-6">
              Create New Universe
            </h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-medium text-[14px] text-[#44474c] mb-2">
                  Universe Icon (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-[#f8f9fa] border-2 border-dashed border-[#d1e1fa] rounded-full w-16 h-16 flex items-center justify-center hover:bg-[#d1e1fa]/20 transition-colors overflow-hidden">
                    {newUniverseIcon ? (
                      <img src={URL.createObjectURL(newUniverseIcon)} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-[#214059]" />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files?.[0]) setNewUniverseIcon(e.target.files[0]);
                    }} />
                  </label>
                  <span className="text-sm text-[#44474c]">Upload an image</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[14px] text-[#44474c] mb-2">
                  Universe Name
                </label>
                <input
                  type="text"
                  value={newUniverseName}
                  onChange={(e) => setNewUniverseName(e.target.value)}
                  placeholder="e.g. The Forgotten Realms (Max 30 chars)"
                  maxLength={30}
                  className="w-full bg-[#f8f9fa] border border-[rgba(33,64,89,0.1)] rounded-2xl px-4 py-3 text-[#214059] focus:outline-none focus:ring-2 focus:ring-[#214059]/20 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-medium text-[14px] text-[#44474c] mb-2">
                  Description
                </label>
                <textarea
                  value={newUniverseDescription}
                  onChange={(e) => setNewUniverseDescription(e.target.value)}
                  placeholder="35 chars per row, 2 rows max"
                  maxLength={70}
                  className="w-full bg-[#f8f9fa] border border-[rgba(33,64,89,0.1)] rounded-2xl px-4 py-3 text-[#214059] focus:outline-none focus:ring-2 focus:ring-[#214059]/20 transition-all resize-none h-24"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 py-3 px-4 rounded-full font-medium text-[#44474c] hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUniverse}
                disabled={!newUniverseName.trim() || isCreating}
                className="flex-1 bg-gradient-to-r from-[#214059] to-[#395771] text-white py-3 px-4 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Universe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}