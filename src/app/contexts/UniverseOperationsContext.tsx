import { createContext, useContext, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { getServerUrl, supabase } from '../utils/supabase';
import { Universe, Page, Subsection } from '../types';
import { useUniverseData } from './UniverseDataContext';
import * as db from '../utils/database';

type UniverseOperationsContextType = {
  createUniverse: (name: string, description: string, iconUrl?: string) => Promise<Universe>;
  updateUniverse: (universeId: string, updates: Partial<Universe>) => Promise<void>;
  deleteUniverse: (universeId: string) => Promise<void>;
  addCategory: (universeId: string, category: string) => Promise<void>;
  renameCategory: (universeId: string, oldCategory: string, newCategory: string) => Promise<void>;
  deleteCategory: (universeId: string, category: string, deletePages: boolean) => Promise<void>;
  createPage: (universeId: string, title: string, description: string, category?: string) => Promise<Page>;
  updatePage: (universeId: string, pageId: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (universeId: string, pageId: string) => Promise<void>;
  createSubsection: (universeId: string, pageId: string, title: string, content: string) => Promise<Subsection>;
  updateSubsection: (universeId: string, pageId: string, subsectionId: string, updates: Partial<Subsection>) => Promise<void>;
  deleteSubsection: (universeId: string, pageId: string, subsectionId: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  reorderUniverses: (startIndex: number, endIndex: number) => Promise<void>;
  reorderPages: (universeId: string, pageId: string, targetCategory: string | undefined, newIndex: number) => Promise<void>;
  reorderSubsections: (universeId: string, pageId: string, startIndex: number, endIndex: number) => Promise<void>;
};

const UniverseOperationsContext = createContext<UniverseOperationsContextType | null>(null);

export const UniverseOperationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { universes, saveUniverses } = useUniverseData();

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', `${user.id}/${Date.now()}_${file.name}`);

    try {
      const res = await fetch(`${getServerUrl()}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.url;
    } catch (e) {
      console.error('Failed to upload image', e);
      // Fallback to local blob URL if server is unreachable
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }, [user]);

  const reorderUniverses = useCallback(async (startIndex: number, endIndex: number) => {
    const result = Array.from(universes);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    await saveUniverses(result);
  }, [universes, saveUniverses]);

  const reorderPages = useCallback(async (universeId: string, pageId: string, targetCategory: string | undefined, newIndex: number) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    // Remove page from its current position
    const pageIndex = universe.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;
    
    const page = { ...universe.pages[pageIndex], category: targetCategory };
    const newPages = Array.from(universe.pages);
    newPages.splice(pageIndex, 1);

    // Find insertion point in overall pages array
    // Pages for targetCategory
    const targetPages = newPages.filter(p => (p.category || '') === (targetCategory || ''));
    
    let globalInsertIndex = newPages.length; // Default to end
    
    if (newIndex < targetPages.length) {
      // Find global index of item that currently occupies newIndex in target category
      const itemAtNewIndex = targetPages[newIndex];
      globalInsertIndex = newPages.findIndex(p => p.id === itemAtNewIndex.id);
    } else if (targetPages.length > 0) {
      // Insert after last item of target category
      const lastItem = targetPages[targetPages.length - 1];
      globalInsertIndex = newPages.findIndex(p => p.id === lastItem.id) + 1;
    } else {
      // If category is empty, just append to end or beginning
      globalInsertIndex = newPages.length;
    }

    newPages.splice(globalInsertIndex, 0, page);

    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const reorderSubsections = useCallback(async (universeId: string, pageId: string, startIndex: number, endIndex: number) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    const pageIndex = universe.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const page = universe.pages[pageIndex];
    const newSubsections = Array.from(page.subsections);
    const [removed] = newSubsections.splice(startIndex, 1);
    newSubsections.splice(endIndex, 0, removed);

    const newPages = Array.from(universe.pages);
    newPages[pageIndex] = { ...page, subsections: newSubsections };

    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const createUniverse = useCallback(async (name: string, description: string, iconUrl?: string) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      const newUniverse = await db.createUniverse({
        user_id: user.id,
        name,
        description,
        icon: iconUrl,
        pages: [],
        categories: [],
        settings: {
          theme: 'Light (Default)',
          font: 'Sans Serif (Modern)',
          color: '#214059'
        }
      });
      
      const newUniverses = [...universes, newUniverse];
      await saveUniverses(newUniverses);
      return newUniverse;
    } catch (error) {
      console.error('Failed to create universe:', error);
      throw error;
    }
  }, [user, universes, saveUniverses]);

  const updateUniverse = useCallback(async (universeId: string, updates: Partial<Universe>) => {
    try {
      await db.updateUniverse(universeId, updates);
      const newUniverses = universes.map(u => u.id === universeId ? { ...u, ...updates } : u);
      await saveUniverses(newUniverses);
    } catch (error) {
      console.error('Failed to update universe:', error);
      throw error;
    }
  }, [universes, saveUniverses]);

  const deleteUniverse = useCallback(async (universeId: string) => {
    try {
      await db.deleteUniverse(universeId);
      const newUniverses = universes.filter(u => u.id !== universeId);
      await saveUniverses(newUniverses);
    } catch (error) {
      console.error('Failed to delete universe:', error);
      throw error;
    }
  }, [universes, saveUniverses]);

  const addCategory = useCallback(async (universeId: string, category: string) => {
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        return { ...u, categories: [...(u.categories || []), category] };
      }
      return u;
    });
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const renameCategory = useCallback(async (universeId: string, oldCategory: string, newCategory: string) => {
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        return {
          ...u,
          categories: (u.categories || []).map(c => c === oldCategory ? newCategory : c),
          pages: u.pages.map(p => ({
            ...p,
            category: p.category === oldCategory ? newCategory : p.category
          }))
        };
      }
      return u;
    });
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const deleteCategory = useCallback(async (universeId: string, category: string, deletePages: boolean) => {
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        return {
          ...u,
          categories: (u.categories || []).filter(c => c !== category),
          pages: deletePages 
            ? u.pages.filter(p => p.category !== category)
            : u.pages.map(p => ({
                ...p,
                category: p.category === category ? '' : p.category
              }))
        };
      }
      return u;
    });
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const createPage = useCallback(async (universeId: string, title: string, description: string, category: string = '') => {
    try {
      const newPage = await db.createPage({
        universe_id: universeId,
        title,
        description,
        category,
        subsections: [],
        connections: []
      });
      
      const newUniverses = universes.map(u => {
        if (u.id === universeId) {
          return { ...u, pages: [...u.pages, newPage] };
        }
        return u;
      });
      await saveUniverses(newUniverses);
      return newPage;
    } catch (error) {
      console.error('Failed to create page:', error);
      throw error;
    }
  }, [universes, saveUniverses]);

  const updatePage = useCallback(async (universeId: string, pageId: string, updates: Partial<Page>) => {
    let uIndex = universes.findIndex(u => u.id === universeId);
    if (uIndex === -1) return;
    let oldUniverse = universes[uIndex];
    let pIndex = oldUniverse.pages.findIndex(p => p.id === pageId);
    if (pIndex === -1) return;
    let oldPage = oldUniverse.pages[pIndex];

    let newPages = oldUniverse.pages.map(p => ({ ...p }));

    if (updates.connections) {
      const added = updates.connections.filter(c => !oldPage.connections.includes(c));
      const removed = oldPage.connections.filter(c => !updates.connections!.includes(c));
      
      const updateBidir = (targetId: string, sourceId: string, isAdd: boolean) => {
        newPages = newPages.map(p => {
          let updatedP = false;
          let conns = p.connections;
          if (p.id === targetId) {
            if (isAdd && !conns.includes(sourceId)) { conns = [...conns, sourceId]; updatedP = true; }
            if (!isAdd && conns.includes(sourceId)) { conns = conns.filter(id => id !== sourceId); updatedP = true; }
          }
          
          let subsModified = false;
          let newSubs = p.subsections.map(s => {
            if (s.id === targetId) {
              let sConns = s.connections;
              if (isAdd && !sConns.includes(sourceId)) { sConns = [...sConns, sourceId]; subsModified = true; }
              if (!isAdd && sConns.includes(sourceId)) { sConns = sConns.filter(id => id !== sourceId); subsModified = true; }
              return { ...s, connections: sConns };
            }
            return s;
          });
          
          if (updatedP || subsModified) {
            return { ...p, connections: updatedP ? conns : p.connections, subsections: subsModified ? newSubs : p.subsections };
          }
          return p;
        });
      };

      added.forEach(c => updateBidir(c, pageId, true));
      removed.forEach(c => updateBidir(c, pageId, false));
    }

    newPages = newPages.map(p => p.id === pageId ? { ...p, ...updates } : p);
    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const deletePage = useCallback(async (universeId: string, pageId: string) => {
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        const pages = u.pages.filter(p => p.id !== pageId).map(p => ({
          ...p,
          connections: p.connections.filter(c => c !== pageId),
          subsections: p.subsections.map(s => ({
            ...s,
            connections: s.connections.filter(c => c !== pageId)
          }))
        }));
        return { ...u, pages };
      }
      return u;
    });
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const createSubsection = useCallback(async (universeId: string, pageId: string, title: string, content: string) => {
    try {
      const newSubsection = await db.createSubsection({
        page_id: pageId,
        title,
        content,
        connections: []
      });
      
      const newUniverses = universes.map(u => {
        if (u.id === universeId) {
          return {
            ...u,
            pages: u.pages.map(p => {
              if (p.id === pageId) {
                return { ...p, subsections: [...p.subsections, newSubsection] };
              }
              return p;
            })
          };
        }
        return u;
      });
      await saveUniverses(newUniverses);
      return newSubsection;
    } catch (error) {
      console.error('Failed to create subsection:', error);
      throw error;
    }
  }, [universes, saveUniverses]);

  const updateSubsection = useCallback(async (universeId: string, pageId: string, subsectionId: string, updates: Partial<Subsection>) => {
    let uIndex = universes.findIndex(u => u.id === universeId);
    if (uIndex === -1) return;
    let oldUniverse = universes[uIndex];
    let pIndex = oldUniverse.pages.findIndex(p => p.id === pageId);
    if (pIndex === -1) return;
    let sIndex = oldUniverse.pages[pIndex].subsections.findIndex(s => s.id === subsectionId);
    if (sIndex === -1) return;
    
    let oldSub = oldUniverse.pages[pIndex].subsections[sIndex];
    let newPages = oldUniverse.pages.map(p => ({ ...p }));

    if (updates.connections) {
      const added = updates.connections.filter(c => !oldSub.connections.includes(c));
      const removed = oldSub.connections.filter(c => !updates.connections!.includes(c));
      
      const updateBidir = (targetId: string, sourceId: string, isAdd: boolean) => {
        newPages = newPages.map(p => {
          let updatedP = false;
          let conns = p.connections;
          if (p.id === targetId) {
            if (isAdd && !conns.includes(sourceId)) { conns = [...conns, sourceId]; updatedP = true; }
            if (!isAdd && conns.includes(sourceId)) { conns = conns.filter(id => id !== sourceId); updatedP = true; }
          }
          
          let subsModified = false;
          let newSubs = p.subsections.map(s => {
            if (s.id === targetId) {
              let sConns = s.connections;
              if (isAdd && !sConns.includes(sourceId)) { sConns = [...sConns, sourceId]; subsModified = true; }
              if (!isAdd && sConns.includes(sourceId)) { sConns = sConns.filter(id => id !== sourceId); subsModified = true; }
              return { ...s, connections: sConns };
            }
            return s;
          });
          
          if (updatedP || subsModified) {
            return { ...p, connections: updatedP ? conns : p.connections, subsections: subsModified ? newSubs : p.subsections };
          }
          return p;
        });
      };

      added.forEach(c => updateBidir(c, subsectionId, true));
      removed.forEach(c => updateBidir(c, subsectionId, false));
    }

    newPages = newPages.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          subsections: p.subsections.map(s => s.id === subsectionId ? { ...s, ...updates } : s)
        };
      }
      return p;
    });

    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const deleteSubsection = useCallback(async (universeId: string, pageId: string, subsectionId: string) => {
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        return {
          ...u,
          pages: u.pages.map(p => {
            return {
              ...p,
              connections: p.connections.filter(c => c !== subsectionId),
              subsections: p.subsections.filter(s => s.id !== subsectionId || p.id !== pageId).map(s => ({
                ...s,
                connections: s.connections.filter(c => c !== subsectionId)
              }))
            };
          })
        };
      }
      return u;
    });
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const contextValue = {
    createUniverse, updateUniverse, deleteUniverse,
    addCategory, renameCategory, deleteCategory,
    createPage, updatePage, deletePage,
    createSubsection, updateSubsection, deleteSubsection,
    uploadImage, reorderUniverses, reorderPages, reorderSubsections
  };

  return (
    <UniverseOperationsContext.Provider value={contextValue}>
      {children}
    </UniverseOperationsContext.Provider>
  );
};

export const useUniverseOperations = () => {
  const ctx = useContext(UniverseOperationsContext);
  if (!ctx) throw new Error('useUniverseOperations must be used within UniverseOperationsProvider');
  return ctx;
};
