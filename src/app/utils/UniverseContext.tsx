import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getServerUrl, supabase } from './supabase';
import { Universe, Page, Subsection } from '../types';
import * as db from './database';

type UniverseContextType = {
  universes: Universe[];
  loading: boolean;
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

const UniverseContext = createContext<UniverseContextType | null>(null);

export const UniverseProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUniverses = useCallback(async () => {
    if (!user) {
      setUniverses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching universes for user:', user.id);
      
      // Check if database functions are available
      if (!db.getUniverses || !db.getPages) {
        throw new Error('Database functions not available');
      }
      
      const universesData = await db.getUniverses(user.id);
      console.log('Universes data:', universesData);
      
      // Load pages for each universe in parallel
      const universesWithPages = await Promise.all(
        universesData.map(async (universe) => {
          try {
            const pages = await db.getPages(universe.id);
            return { ...universe, pages };
          } catch (pageError) {
            console.error(`Failed to load pages for universe ${universe.id}:`, pageError);
            return { ...universe, pages: [] };
          }
        })
      );
      
      console.log('Universes with pages:', universesWithPages);
      setUniverses(universesWithPages);
    } catch (error) {
      console.error('Failed to fetch universes:', error);
      // Fallback to local storage if database fails
      try {
        const localData = localStorage.getItem('the-architect-universes');
        if (localData) {
          console.log('Using fallback local data');
          setUniverses(JSON.parse(localData));
        } else {
          console.log('No local data found, setting empty array');
          setUniverses([]);
        }
      } catch (err) {
        console.error("Failed to parse local universes", err);
        setUniverses([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      fetchUniverses().catch(error => {
        console.error('Error in fetchUniverses:', error);
        setLoading(false);
      });
    } else {
      setUniverses([]);
      setLoading(false);
    }
  }, [session, fetchUniverses]);

  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
      setLoading(false);
    };
  }, []);

  const saveUniverses = useCallback(async (newUniverses: Universe[]) => {
    setUniverses(newUniverses);
    // Only save to localStorage if there are actual changes
    try {
      const currentData = localStorage.getItem('the-architect-universes');
      const newData = JSON.stringify(newUniverses);
      if (currentData !== newData) {
        localStorage.setItem('the-architect-universes', newData);
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
    // Database operations are handled individually in the CRUD functions
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
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
  };

  const reorderUniverses = async (startIndex: number, endIndex: number) => {
    const result = Array.from(universes);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setUniverses(result);
    await saveUniverses(result);
  };

  const reorderPages = async (universeId: string, pageId: string, targetCategory: string | undefined, newIndex: number) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    // Remove the page from its current position
    const pageIndex = universe.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;
    
    const page = { ...universe.pages[pageIndex], category: targetCategory };
    const newPages = Array.from(universe.pages);
    newPages.splice(pageIndex, 1);

    // Find the insertion point in the overall pages array
    // Pages for the targetCategory
    const targetPages = newPages.filter(p => (p.category || '') === (targetCategory || ''));
    
    let globalInsertIndex = newPages.length; // Default to end
    
    if (newIndex < targetPages.length) {
      // Find the global index of the item that currently occupies the newIndex in the target category
      const itemAtNewIndex = targetPages[newIndex];
      globalInsertIndex = newPages.findIndex(p => p.id === itemAtNewIndex.id);
    } else if (targetPages.length > 0) {
      // Insert after the last item of the target category
      const lastItem = targetPages[targetPages.length - 1];
      globalInsertIndex = newPages.findIndex(p => p.id === lastItem.id) + 1;
    } else {
      // If category is empty, just append to the end or beginning
      globalInsertIndex = newPages.length;
    }

    newPages.splice(globalInsertIndex, 0, page);

    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const reorderSubsections = async (universeId: string, pageId: string, startIndex: number, endIndex: number) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const createUniverse = async (name: string, description: string, iconUrl?: string) => {
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
  };

  const updateUniverse = async (universeId: string, updates: Partial<Universe>) => {
    try {
      await db.updateUniverse(universeId, updates);
      const newUniverses = universes.map(u => u.id === universeId ? { ...u, ...updates } : u);
      await saveUniverses(newUniverses);
    } catch (error) {
      console.error('Failed to update universe:', error);
      throw error;
    }
  };

  const deleteUniverse = async (universeId: string) => {
    try {
      await db.deleteUniverse(universeId);
      const newUniverses = universes.filter(u => u.id !== universeId);
      await saveUniverses(newUniverses);
    } catch (error) {
      console.error('Failed to delete universe:', error);
      throw error;
    }
  };

  const addCategory = async (universeId: string, category: string) => {
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        return { ...u, categories: [...(u.categories || []), category] };
      }
      return u;
    });
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const renameCategory = async (universeId: string, oldCategory: string, newCategory: string) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const deleteCategory = async (universeId: string, category: string, deletePages: boolean) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const createPage = async (universeId: string, title: string, description: string, category: string = '') => {
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
  };

  const updatePage = async (universeId: string, pageId: string, updates: Partial<Page>) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const deletePage = async (universeId: string, pageId: string) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const createSubsection = async (universeId: string, pageId: string, title: string, content: string) => {
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
  };

  const updateSubsection = async (universeId: string, pageId: string, subsectionId: string, updates: Partial<Subsection>) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const deleteSubsection = async (universeId: string, pageId: string, subsectionId: string) => {
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
  };

  const contextValue = useMemo(() => ({
    universes, loading, createUniverse, updateUniverse, deleteUniverse,
    addCategory, renameCategory, deleteCategory,
    createPage, updatePage, deletePage,
    createSubsection, updateSubsection, deleteSubsection,
    uploadImage, reorderUniverses, reorderPages, reorderSubsections
  }), [
    universes, loading, createUniverse, updateUniverse, deleteUniverse,
    addCategory, renameCategory, deleteCategory,
    createPage, updatePage, deletePage,
    createSubsection, updateSubsection, deleteSubsection,
    uploadImage, reorderUniverses, reorderPages, reorderSubsections
  ]);

  return (
    <UniverseContext.Provider value={contextValue}>
      {children}
    </UniverseContext.Provider>
  );
};

export const useUniverseStore = () => {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error('useUniverseStore must be used within UniverseProvider');
  return ctx;
};
