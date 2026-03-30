import React from 'react';
import { Page, World } from '@/types';
import { BubbleMapVisualization } from '@/components/bubble-map/BubbleMapVisualization';

interface BubbleMapProps {
  world: World;
  pages: Page[];
  onPageSelect: (page: Page) => void;
  onToggleView: () => void;
  currentView: 'editor' | 'map';
}

export const BubbleMap: React.FC<BubbleMapProps> = ({
  world,
  pages,
  onPageSelect,
  onToggleView: _onToggleView,
  currentView: _currentView
}) => {

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <aside className="h-full w-64 bg-slate-50/70 backdrop-blur-xl flex flex-col p-4 gap-2 border-r-0 fixed left-0 glass-effect">
        {/* Header Section */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-white">
            <span className="material-symbols-outlined">public</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-cyan-900">{world.title}</h2>
            <p className="text-xs text-on-surface-variant font-normal opacity-70">
              Bubble Map View
            </p>
          </div>
        </div>

        {/* Navigation Tree View */}
        <div className="sidebar-tree">
          {pages
            .filter(page => !page.parent_page_id)
            .map(page => (
              <div key={page.id} className="tree-node">
                <div className="node-content bg-cyan-100/50 text-cyan-900">
                  <span className="node-icon" style={{ fontVariationSettings: 'FILL 1' }}>
                    book
                  </span>
                  <span className="node-title">{page.title}</span>
                </div>
                {pages
                  .filter(p => p.parent_page_id === page.id)
                  .map(subPage => (
                    <div
                      key={subPage.id}
                      className="tree-node"
                      style={{ marginLeft: '16px' }}
                    >
                      <div className="node-content text-slate-600 hover:bg-slate-200/50">
                        <span className="node-icon">description</span>
                        <span className="node-title">{subPage.title}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-200/50 rounded-xl cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-200/50 rounded-xl cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">delete</span>
            <span>Trash</span>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-64 h-screen canvas-grid relative overflow-hidden bg-surface">
        {/* Bubble Map Visualization */}
        <BubbleMapVisualization
          pages={pages}
          connections={[]}
          onPageSelect={onPageSelect}
          width={800}
          height={600}
        />
      </main>
    </div>
  );
};
