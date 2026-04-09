/**
 * reorder.ts - Reorder utilities for drag-and-drop functionality
 * 
 * This module provides utility functions for reordering items:
 * - reorderPages: Reorder pages within/between categories
 * - reorderUniverses: Reorder universes in dashboard
 * - reorderSubsections: Reorder subsections within a page
 * 
 * reorderPages:
 * - Handles moving pages between categories
 * - Calculates correct insertion index in global array
 * - Preserves page order within categories
 * - Used by drag-and-drop in PageSidebar
 * 
 * reorderUniverses & reorderSubsections:
 * - Generic array reordering using splice
 * - Moves item from startIndex to endIndex
 * - Used by drag-and-drop in dashboard and editor
 * 
 * Algorithm:
 * 1. Remove item from current position
 * 2. Calculate new insertion point
 * 3. Insert at new position
 * 4. Return new array
 * 
 * TODO: Add support for reordering multiple items
 * TODO: Add undo/redo support
 */

import { Page } from '../types';

/**
 * Reorders pages within a pages array based on category and index
 * Used for drag-and-drop functionality in the editor
 */
export const reorderPages = (
  pages: Page[],
  pageId: string,
  targetCategory: string | undefined,
  newIndex: number
): Page[] => {
  // Remove page from its current position
  const pageIndex = pages.findIndex(p => p.id === pageId);
  if (pageIndex === -1) return pages;

  const page = { ...pages[pageIndex], category: targetCategory };
  const newPages = Array.from(pages);
  newPages.splice(pageIndex, 1);

  // Find insertion point in overall pages array
  const targetPages = newPages.filter(p => (p.category || '') === (targetCategory || ''));

  let globalInsertIndex = newPages.length;

  if (newIndex < targetPages.length) {
    const itemAtNewIndex = targetPages[newIndex];
    globalInsertIndex = newPages.findIndex(p => p.id === itemAtNewIndex.id);
  } else if (targetPages.length > 0) {
    const lastItem = targetPages[targetPages.length - 1];
    globalInsertIndex = newPages.findIndex(p => p.id === lastItem.id) + 1;
  }

  newPages.splice(globalInsertIndex, 0, page);
  return newPages;
};

/**
 * Reorders universes in an array by moving an item from startIndex to endIndex
 */
export const reorderUniverses = <T extends { id: string }>(
  items: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Reorders subsections within a page by moving an item from startIndex to endIndex
 */
export const reorderSubsections = <T extends { id: string }>(
  items: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
