import React, { useState } from 'react';
import { Page, World } from '@/types';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

type CurrentView = 'editor' | 'map';

interface WorldEditorProps {
  world: World;
  pages: Page[];
  currentPage: Page | null;
  onPageSelect: (page: Page) => void;
  onCreatePage: (title: string, parentPageId?: string) => Promise<Page | null>;
  onSavePage: (page: Page) => Promise<void>;
  isTrial: boolean;
  onToggleView: () => void;
  currentView: CurrentView;
}

export const WorldEditor: React.FC<WorldEditorProps> = ({
  world,
  pages,
  currentPage,
  onPageSelect,
  onCreatePage,
  onToggleView,
  currentView
}) => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>();

  // Build hierarchical page structure
  const buildPageTree = (pages: Page[]): any[] => {
    const pageMap = new Map();
    const rootPages: any[] = [];

    // Create map of all pages
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Build hierarchy
    pages.forEach(page => {
      const pageNode = pageMap.get(page.id);
      if (page.parent_page_id && pageMap.has(page.parent_page_id)) {
        pageMap.get(page.parent_page_id).children.push(pageNode);
      } else {
        rootPages.push(pageNode);
      }
    });

    return rootPages;
  };

  const pageTree = buildPageTree(pages);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const newPage = await onCreatePage(newPageTitle.trim(), selectedParentId);
    if (newPage) {
      setNewPageTitle('');
      setSelectedParentId(undefined);
      setIsCreatingPage(false);
      onPageSelect(newPage);
    }
  };

  const handleContentChange = (content: any) => {
    if (currentPage) {
      // Update page content - this would typically save to backend
      console.log('Content updated:', content);
    }
  };

  const renderPageNode = (node: any, level: number = 0) => (
    <div key={node.id} className="tree-node" style={{ marginLeft: `${level * 16}px` }}>
      <div
        className={`node-content ${
          currentPage?.id === node.id
            ? 'bg-cyan-100/50 text-cyan-900'
            : 'text-slate-600 hover:bg-slate-200/50'
        }`}
        onClick={() => onPageSelect(node)}
      >
        <span className="node-icon">
          {node.children.length > 0 ? (
            <span style={{ fontVariationSettings: 'FILL 1' }}>book</span>
          ) : (
            <span>description</span>
          )}
        </span>
        <span className="node-title">{node.title}</span>
      </div>
      {node.children.map((child: any) => renderPageNode(child, level + 1))}
    </div>
  );

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <aside className="h-full w-72 bg-slate-50/70 backdrop-blur-xl flex flex-col p-4 gap-2 border-r-0 fixed left-0 glass-effect">
        {/* Header Section */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-white">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-cyan-900">{world.title}</h2>
            <p className="text-xs text-on-surface-variant font-normal opacity-70">
              {world.description || 'Worldbuilding project'}
            </p>
          </div>
        </div>

        {/* CTA */}
        {!isCreatingPage ? (
          <button
            onClick={() => setIsCreatingPage(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl mb-6 hover:translate-x-1 transition-transform duration-200 cursor-pointer active:opacity-80"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="font-headline font-bold text-sm tracking-tight">New Entry</span>
          </button>
        ) : (
          <div className="bg-surface-container-low p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-primary mb-3">Create New Page</h3>
            <form onSubmit={handleCreatePage} className="space-y-3">
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/20"
                placeholder="Page title..."
                required
              />
              <select
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value || undefined)}
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No parent (root page)</option>
                {pages.map(page => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-container transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingPage(false);
                    setNewPageTitle('');
                    setSelectedParentId(undefined);
                  }}
                  className="flex-1 bg-surface-container text-primary text-sm font-semibold py-2 rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Tree View */}
        <div className="sidebar-tree">
          {pageTree.map(page => renderPageNode(page))}
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

      {/* Main Content */}
      <main className="ml-72 flex-1 relative overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex justify-between items-center px-6 py-3 shadow-[0_12px_40px_rgba(25,28,29,0.06)]">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tighter text-cyan-900 font-headline">
              The Architect
            </span>
            <div className="hidden md:flex gap-6 items-center">
              <a
                className={`font-headline text-sm tracking-tight pb-1 ${
                  currentView === 'editor'
                    ? 'text-cyan-700 border-b-2 border-cyan-700'
                    : 'text-slate-500 hover:text-cyan-600 transition-colors'
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentView !== 'editor') onToggleView();
                }}
              >
                Editor
              </a>
              <a
                className={`font-headline text-sm tracking-tight pb-1 ${
                  currentView === 'map'
                    ? 'text-cyan-700 border-b-2 border-cyan-700'
                    : 'text-slate-500 hover:text-cyan-600 transition-colors'
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentView !== 'map') onToggleView();
                }}
              >
                Map
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-50/50 transition-colors">
              <span className="material-symbols-outlined text-cyan-900">public</span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-50/50 transition-colors">
              <span className="material-symbols-outlined text-cyan-900">settings</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="pt-20 pb-32">
          {currentPage ? (
            <div className="max-w-4xl mx-auto px-12">
              {/* Page Breadcrumbs */}
              <div className="flex items-center gap-2 text-on-surface-variant text-[11px] uppercase tracking-widest mb-8">
                <span>{world.title}</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-bold">{currentPage.title}</span>
              </div>

              {/* Main Content Area */}
              <div className="space-y-12">
                <header>
                  <h1 className="font-headline text-[3.5rem] font-extrabold tracking-tighter text-on-surface leading-tight mb-4">
                    {currentPage.title}
                  </h1>
                  <p className="text-xl font-body text-on-surface-variant font-light italic leading-relaxed">
                    Start building your world here...
                  </p>
                </header>

                {/* Rich Text Editor */}
                <RichTextEditor
                  content={currentPage?.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your worldbuilding content here..."
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
                    description
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  No Page Selected
                </h3>
                <p className="text-on-surface-variant mb-6">
                  Select a page from the sidebar or create a new one to start editing
                </p>
                <button
                  onClick={() => setIsCreatingPage(true)}
                  className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-container transition-colors"
                >
                  Create First Page
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Editor Toolbar */}
        {currentPage && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 floating-toolbar z-[60]">
            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">format_bold</span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">format_italic</span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">format_list_bulleted</span>
              </button>
            </div>
            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">link</span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">image</span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">table_chart</span>
              </button>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">publish</span>
              Publish
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
