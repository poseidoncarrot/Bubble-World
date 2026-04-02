import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getServerUrl, supabase } from './supabase';
import { Universe, Page, Subsection } from '../types';

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

  useEffect(() => {
    if (session) {
      fetchUniverses();
    } else {
      setUniverses([]);
      setLoading(false);
    }
  }, [session]);

  const fetchUniverses = async () => {
    try {
      // First try to load from local storage to prevent blank screen if fetch fails
      const localData = localStorage.getItem('the-architect-universes');
      if (localData) {
        try {
          setUniverses(JSON.parse(localData));
        } catch (err) {
          console.error("Failed to parse local universes", err);
        }
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.access_token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${getServerUrl()}/universes`, {
        headers: { Authorization: `Bearer ${currentSession.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const serverUniverses = data.data || [];
        setUniverses(serverUniverses);
        localStorage.setItem('the-architect-universes', JSON.stringify(serverUniverses));
      } else {
        const text = await res.text();
        if (res.status !== 401) console.error('Failed to fetch universes remotely', text);
      }
    } catch (e) {
      console.warn('Network error when fetching universes remotely', e);
      // If there's a TypeError (e.g. Failed to fetch), we just rely on the local storage loaded above
    } finally {
      setLoading(false);
    }
  };

  const saveUniverses = async (newUniverses: Universe[]) => {
    setUniverses(newUniverses);
    localStorage.setItem('the-architect-universes', JSON.stringify(newUniverses));
    
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession?.access_token) return;
    try {
      const res = await fetch(`${getServerUrl()}/universes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ universes: newUniverses })
      });
      if (!res.ok) {
        const text = await res.text();
        if (res.status !== 401) {
          console.error('Failed to save universes remotely', text);
        }
      }
    } catch (e) {
      console.warn('Network error when saving universes remotely', e);
    }
  };

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
    const newUniverse: Universe = {
      id: crypto.randomUUID(),
      name,
      description,
      icon: iconUrl,
      pages: [],
      categories: [], // default to empty
      settings: {
        theme: 'Light (Default)',
        font: 'Sans Serif (Modern)',
        color: '#214059'
      }
    };
    const newUniverses = [...universes, newUniverse];
    await saveUniverses(newUniverses);
    return newUniverse;
  };

  const updateUniverse = async (universeId: string, updates: Partial<Universe>) => {
    const newUniverses = universes.map(u => u.id === universeId ? { ...u, ...updates } : u);
    setUniverses(newUniverses); // Update locally immediately
    await saveUniverses(newUniverses);
  };

  const deleteUniverse = async (universeId: string) => {
    const newUniverses = universes.filter(u => u.id !== universeId);
    setUniverses(newUniverses); // Update locally immediately
    await saveUniverses(newUniverses);
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
    const newPage: Page = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      subsections: [],
      connections: []
    };
    const newUniverses = universes.map(u => {
      if (u.id === universeId) {
        return { ...u, pages: [...u.pages, newPage] };
      }
      return u;
    });
    await saveUniverses(newUniverses);
    return newPage;
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
    const newSubsection: Subsection = {
      id: crypto.randomUUID(),
      title,
      content,
      connections: []
    };
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
    setUniverses(newUniverses);
    await saveUniverses(newUniverses);
    return newSubsection;
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

  return (
    <UniverseContext.Provider value={{
      universes, loading, createUniverse, updateUniverse, deleteUniverse,
      addCategory, renameCategory, deleteCategory,
      createPage, updatePage, deletePage,
      createSubsection, updateSubsection, deleteSubsection,
      uploadImage, reorderUniverses, reorderPages, reorderSubsections
    }}>
      {children}
    </UniverseContext.Provider>
  );
};

export const useUniverseStore = () => {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error('useUniverseStore must be used within UniverseProvider');
  return ctx;
};
