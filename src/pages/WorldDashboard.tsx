import React, { useState } from 'react';
import { World } from '@/types';

interface WorldDashboardProps {
  worlds: World[];
  currentWorld: World | null;
  onSelectWorld: (world: World) => void;
  onCreateWorld: (title: string, description?: string) => Promise<World | null>;
  isTrial: boolean;
  timeRemaining: string;
}

export const WorldDashboard: React.FC<WorldDashboardProps> = ({
  worlds,
  currentWorld,
  onSelectWorld,
  onCreateWorld,
  isTrial,
  timeRemaining
}) => {
  const [isCreatingWorld, setIsCreatingWorld] = useState(false);
  const [worldTitle, setWorldTitle] = useState('');
  const [worldDescription, setWorldDescription] = useState('');

  const handleCreateWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldTitle.trim()) return;

    setIsCreatingWorld(true);
    const newWorld = await onCreateWorld(worldTitle.trim(), worldDescription.trim() || undefined);
    
    if (newWorld) {
      setWorldTitle('');
      setWorldDescription('');
      setIsCreatingWorld(false);
      onSelectWorld(newWorld);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(25,28,29,0.06)] flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-cyan-900 font-headline">
            The Architect
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isTrial && (
            <div className="flex items-center gap-2 text-orange-600">
              <span className="material-symbols-outlined text-[20px]">timer</span>
              <span className="font-semibold">{timeRemaining}</span>
            </div>
          )}
          <button className="p-2 rounded-full hover:bg-slate-50/50 transition-colors">
            <span className="material-symbols-outlined text-cyan-900">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-on-surface mb-2 font-headline">
              Your Worlds
            </h1>
            <p className="text-on-surface-variant">
              Create and manage your worldbuilding projects
            </p>
          </div>

          {/* Create New World */}
          <div className="mb-8">
            {!isCreatingWorld ? (
              <button
                onClick={() => setIsCreatingWorld(true)}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <span className="material-symbols-outlined text-[24px]">add_circle</span>
                <span className="text-lg">Create New World</span>
              </button>
            ) : (
              <div className="bg-surface-container p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-primary mb-4">Create New World</h3>
                <form onSubmit={handleCreateWorld} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      World Title *
                    </label>
                    <input
                      type="text"
                      value={worldTitle}
                      onChange={(e) => setWorldTitle(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter world title..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Description
                    </label>
                    <textarea
                      value={worldDescription}
                      onChange={(e) => setWorldDescription(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      placeholder="Describe your world..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-container transition-colors"
                    >
                      Create World
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingWorld(false);
                        setWorldTitle('');
                        setWorldDescription('');
                      }}
                      className="flex-1 bg-surface-container-low text-primary font-semibold py-2 rounded-lg hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Worlds Grid */}
          {worlds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worlds.map((world) => (
                <div
                  key={world.id}
                  onClick={() => onSelectWorld(world)}
                  className={`bg-surface-container rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${
                    currentWorld?.id === world.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[24px]">
                        public
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {formatDate(world.updated_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-on-surface mb-2 font-headline">
                    {world.title}
                  </h3>
                  
                  {world.description && (
                    <p className="text-sm text-on-surface-variant line-clamp-3">
                      {world.description}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] mr-1">
                      edit
                    </span>
                    Last modified {formatDate(world.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
                  folder_open
                </span>
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">
                No Worlds Yet
              </h3>
              <p className="text-on-surface-variant mb-6">
                Create your first world to start building your universe
              </p>
              <button
                onClick={() => setIsCreatingWorld(true)}
                className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-container transition-colors"
              >
                Create Your First World
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
