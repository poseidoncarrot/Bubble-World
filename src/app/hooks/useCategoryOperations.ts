/**
 * useCategoryOperations - Custom hook for category management
 * 
 * This hook provides operations for managing page categories:
 * - Add new categories to a universe
 * - Rename existing categories (updates all pages in category)
 * - Delete categories (with option to delete or move pages)
 * 
 * Operations:
 * - addCategory: Adds a new category to the universe's category list
 * - renameCategory: Renames a category and updates all pages with that category
 * - deleteCategory: Removes a category, optionally deleting all pages in it
 * 
 * Delete Behavior:
 * - If deletePages=true: All pages in category are deleted
 * - If deletePages=false: Pages are moved to "Uncategorized"
 * 
 * Data Flow:
 * 1. Operation modifies universe state
 * 2. Updates affected pages if needed
 * 3. Saves to localStorage via useUniverseData
 * 
 * TODO: Add category reordering
 * TODO: Add category color coding
 * TODO: Add nested categories
 */

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
