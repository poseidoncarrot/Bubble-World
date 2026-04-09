import { useCallback } from 'react';
import { useUniverseData } from '../contexts/UniverseDataContext';
import { Page } from '../types';
import * as db from '../utils/database';
import { reorderPages as reorderPagesUtil, reorderSubsections as reorderSubsectionsUtil } from '../utils/reorder';

export const usePageOperations = () => {
  const { universes, saveUniverses } = useUniverseData();

  const createPage = useCallback(async (universeId: string, title: string, description: string, category?: string) => {
    const newPage = await db.createPage({
      universe_id: universeId,
      title,
      description,
      category,
      coverImage: undefined,
      subsections: [],
      connections: [],
      position: undefined
    });

    const newUniverses = universes.map(u =>
      u.id === universeId ? { ...u, pages: [...u.pages, newPage] } : u
    );
    await saveUniverses(newUniverses);
    return newPage;
  }, [universes, saveUniverses]);

  const updatePage = useCallback(async (universeId: string, pageId: string, updates: Partial<Page>) => {
    await db.updatePage(pageId, updates);
    const newUniverses = universes.map(u =>
      u.id === universeId
        ? { ...u, pages: u.pages.map(p => p.id === pageId ? { ...p, ...updates } : p) }
        : u
    );
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const deletePage = useCallback(async (universeId: string, pageId: string) => {
    await db.deletePage(pageId);
    const newUniverses = universes.map(u =>
      u.id === universeId ? { ...u, pages: u.pages.filter(p => p.id !== pageId) } : u
    );
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const reorderPages = useCallback(async (universeId: string, pageId: string, targetCategory: string | undefined, newIndex: number) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    const newPages = reorderPagesUtil(universe.pages, pageId, targetCategory, newIndex);
    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const reorderSubsections = useCallback(async (universeId: string, pageId: string, startIndex: number, endIndex: number) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    const pageIndex = universe.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const page = universe.pages[pageIndex];
    const newSubsections = reorderSubsectionsUtil(page.subsections, startIndex, endIndex);

    const newPages = Array.from(universe.pages);
    newPages[pageIndex] = { ...page, subsections: newSubsections };

    const newUniverses = universes.map(u => u.id === universeId ? { ...u, pages: newPages } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  return {
    createPage,
    updatePage,
    deletePage,
    reorderPages,
    reorderSubsections
  };
};
