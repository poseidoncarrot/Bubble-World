import { useCallback } from 'react';
import { useUniverseData } from '../contexts/UniverseDataContext';

export const useCategoryOperations = () => {
  const { universes, saveUniverses } = useUniverseData();

  const addCategory = useCallback(async (universeId: string, category: string) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    const newCategories = [...(universe.categories || []), category];
    const newUniverses = universes.map(u => u.id === universeId ? { ...u, categories: newCategories } : u);
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const renameCategory = useCallback(async (universeId: string, oldCategory: string, newCategory: string) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    const newCategories = universe.categories?.map(c => c === oldCategory ? newCategory : c) || [];
    const newPages = universe.pages.map(p => p.category === oldCategory ? { ...p, category: newCategory } : p);

    const newUniverses = universes.map(u =>
      u.id === universeId ? { ...u, categories: newCategories, pages: newPages } : u
    );
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const deleteCategory = useCallback(async (universeId: string, category: string, deletePages: boolean) => {
    const universe = universes.find(u => u.id === universeId);
    if (!universe) return;

    let newPages = universe.pages;
    if (deletePages) {
      newPages = universe.pages.filter(p => p.category !== category);
    } else {
      newPages = universe.pages.map(p => p.category === category ? { ...p, category: undefined } : p);
    }

    const newCategories = universe.categories?.filter(c => c !== category) || [];
    const newUniverses = universes.map(u =>
      u.id === universeId ? { ...u, categories: newCategories, pages: newPages } : u
    );
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  return {
    addCategory,
    renameCategory,
    deleteCategory
  };
};
