import { useState, useEffect, useCallback } from 'react';
import { Page, World, UserSession } from '@/types';
import { LocalStorageManager } from '@/services/localStorage';

export const useDataManager = (session: UserSession | null) => {
  const [storage, setStorage] = useState<LocalStorageManager | null>(null);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'ready' | 'error'>('ready');

  // Initialize storage manager
  useEffect(() => {
    if (session) {
      const storageManager = new LocalStorageManager(session.session_id);
      setStorage(storageManager);
      
      // Load existing data
      const existingWorlds = storageManager.getWorlds();
      setWorlds(existingWorlds);
      
      if (existingWorlds.length > 0) {
        setCurrentWorld(existingWorlds[0]);
        const worldPages = storageManager.getPages(existingWorlds[0].id);
        setPages(worldPages);
      }
    }
  }, [session]);

  // Auto-save every 5 minutes
  useEffect(() => {
    if (!storage) return;

    const interval = setInterval(() => {
      // Trigger auto-save for current page if it exists
      if (currentPage) {
        savePage(currentPage);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [storage, currentPage]);

  // World operations
  const createWorld = useCallback(async (title: string, description?: string) => {
    if (!storage) return null;

    setSyncStatus('syncing');
    
    const newWorld: World = {
      id: crypto.randomUUID(),
      user_id: session?.id || 'trial',
      title,
      description,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    storage.saveWorld(newWorld);
    setWorlds(prev => [...prev, newWorld]);
    setCurrentWorld(newWorld);
    setPages([]);
    setCurrentPage(null);
    
    setSyncStatus('ready');
    return newWorld;
  }, [storage, session?.id]);

  const updateWorld = useCallback(async (worldId: string, updates: Partial<World>) => {
    if (!storage) return;

    setSyncStatus('syncing');
    
    const world = storage.getWorld(worldId);
    if (world) {
      const updatedWorld = { ...world, ...updates, updated_at: new Date().toISOString() };
      storage.saveWorld(updatedWorld);
      
      setWorlds(prev => prev.map(w => w.id === worldId ? updatedWorld : w));
      if (currentWorld?.id === worldId) {
        setCurrentWorld(updatedWorld);
      }
    }
    
    setSyncStatus('ready');
  }, [storage, currentWorld]);

  const deleteWorld = useCallback(async (worldId: string) => {
    if (!storage) return;

    setSyncStatus('syncing');
    
    storage.deleteWorld(worldId);
    setWorlds(prev => prev.filter(w => w.id !== worldId));
    setPages([]);
    setCurrentPage(null);
    
    if (currentWorld?.id === worldId) {
      // Set to next available world or null
      const remainingWorlds = worlds.filter(w => w.id !== worldId);
      setCurrentWorld(remainingWorlds.length > 0 ? remainingWorlds[0] : null);
    }
    
    setSyncStatus('ready');
  }, [storage, currentWorld, worlds]);

  // Page operations
  const createPage = useCallback(async (title: string, parentPageId?: string) => {
    if (!storage || !currentWorld) return null;

    setSyncStatus('syncing');
    
    const newPage: Page = {
      id: crypto.randomUUID(),
      world_id: currentWorld.id,
      parent_page_id: parentPageId,
      title,
      content: { type: 'doc', content: [] }, // Empty Tiptap document
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    storage.savePage(newPage);
    setPages(prev => [...prev, newPage]);
    
    setSyncStatus('ready');
    return newPage;
  }, [storage, currentWorld]);

  const savePage = useCallback(async (page: Page) => {
    if (!storage) return;

    setSyncStatus('syncing');
    
    const updatedPage = { ...page, updated_at: new Date().toISOString() };
    storage.savePage(updatedPage);
    
    setPages(prev => prev.map(p => p.id === page.id ? updatedPage : p));
    if (currentPage?.id === page.id) {
      setCurrentPage(updatedPage);
    }
    
    setSyncStatus('ready');
  }, [storage, currentPage]);

  const deletePage = useCallback(async (pageId: string) => {
    if (!storage || !currentWorld) return;

    setSyncStatus('syncing');
    
    storage.deletePage(currentWorld.id, pageId);
    setPages(prev => prev.filter(p => p.id !== pageId));
    
    if (currentPage?.id === pageId) {
      setCurrentPage(null);
    }
    
    setSyncStatus('ready');
  }, [storage, currentWorld, currentPage]);

  // Navigation
  const selectWorld = useCallback((world: World) => {
    if (!storage) return;

    setCurrentWorld(world);
    const worldPages = storage.getPages(world.id);
    setPages(worldPages);
    setCurrentPage(null);
  }, [storage]);

  const selectPage = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  // Utility functions
  const hasData = useCallback(() => {
    return storage ? storage.hasData() : false;
  }, [storage]);

  const exportData = useCallback(() => {
    return storage ? storage.exportData() : { worlds: [], pages: [] };
  }, [storage]);

  return {
    // Data
    worlds,
    currentWorld,
    pages,
    currentPage,
    syncStatus,
    
    // World operations
    createWorld,
    updateWorld,
    deleteWorld,
    selectWorld,
    
    // Page operations
    createPage,
    savePage,
    deletePage,
    selectPage,
    
    // Utilities
    hasData,
    exportData
  };
};
