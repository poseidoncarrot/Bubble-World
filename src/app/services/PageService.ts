import { Page } from '../types';
import * as db from '../utils/database';

export class PageService {
  static async createPage(data: {
    universe_id: string;
    title: string;
    description: string;
    category?: string;
  }): Promise<Page> {
    const pageData = {
      ...data,
      subsections: [],
      connections: []
    };
    return await db.createPage(pageData);
  }

  static async updatePage(pageId: string, updates: Partial<Page>): Promise<Page> {
    return await db.updatePage(pageId, updates);
  }

  static async deletePage(pageId: string): Promise<void> {
    return await db.deletePage(pageId);
  }

  static async getPages(universeId: string): Promise<Page[]> {
    return await db.getPages(universeId);
  }

  static validatePageTitle(title: string): { isValid: boolean; error?: string } {
    if (!title || title.trim().length === 0) {
      return { isValid: false, error: 'Page title is required' };
    }
    
    if (title.length > 100) {
      return { isValid: false, error: 'Page title must be 100 characters or less' };
    }
    
    return { isValid: true };
  }

  static validatePageDescription(description: string): { isValid: boolean; error?: string } {
    if (description.length > 500) {
      return { isValid: false, error: 'Description must be 500 characters or less' };
    }
    
    return { isValid: true };
  }

  static reorderPages(
    pages: Page[], 
    pageId: string, 
    targetCategory: string | undefined, 
    newIndex: number
  ): Page[] {
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
  }
}
