import { Page, World, UserSession } from '@/types';

const STORAGE_PREFIX = 'bubble-world';

export class LocalStorageManager {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  // Session management
  saveSession(session: UserSession): void {
    localStorage.setItem(`${STORAGE_PREFIX}-session-${this.sessionId}`, JSON.stringify(session));
  }

  getSession(): UserSession | null {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-session-${this.sessionId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // World management
  saveWorld(world: World): void {
    localStorage.setItem(`${STORAGE_PREFIX}-${this.sessionId}-world-${world.id}`, JSON.stringify(world));
  }

  getWorld(worldId: string): World | null {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-${this.sessionId}-world-${worldId}`);
    return stored ? JSON.parse(stored) : null;
  }

  getWorlds(): World[] {
    const worlds: World[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(`${STORAGE_PREFIX}-${this.sessionId}-world-`)) {
        const world = JSON.parse(localStorage.getItem(key)!);
        worlds.push(world);
      }
    });

    return worlds.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  deleteWorld(worldId: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}-${this.sessionId}-world-${worldId}`);
    
    // Also delete all pages for this world
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`${STORAGE_PREFIX}-${this.sessionId}-page-`) && key.includes(`-${worldId}-`)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Page management
  savePage(page: Page): void {
    localStorage.setItem(`${STORAGE_PREFIX}-${this.sessionId}-page-${page.world_id}-${page.id}`, JSON.stringify(page));
  }

  getPage(worldId: string, pageId: string): Page | null {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-${this.sessionId}-page-${worldId}-${pageId}`);
    return stored ? JSON.parse(stored) : null;
  }

  getPages(worldId: string): Page[] {
    const pages: Page[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(`${STORAGE_PREFIX}-${this.sessionId}-page-${worldId}-`)) {
        const page = JSON.parse(localStorage.getItem(key)!);
        pages.push(page);
      }
    });

    return pages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  deletePage(worldId: string, pageId: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}-${this.sessionId}-page-${worldId}-${pageId}`);
  }

  // Utility methods
  clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`${STORAGE_PREFIX}-${this.sessionId}-`)) {
        localStorage.removeItem(key);
      }
    });
  }

  exportData(): { worlds: World[], pages: Page[] } {
    return {
      worlds: this.getWorlds(),
      pages: this.getWorlds().flatMap(world => this.getPages(world.id))
    };
  }

  importData(data: { worlds: World[], pages: Page[] }): void {
    // Clear existing data
    this.clearAll();

    // Import worlds
    data.worlds.forEach(world => {
      this.saveWorld(world);
    });

    // Import pages
    data.pages.forEach(page => {
      this.savePage(page);
    });
  }

  // Check if data exists
  hasData(): boolean {
    const keys = Object.keys(localStorage);
    return keys.some(key => key.startsWith(`${STORAGE_PREFIX}-${this.sessionId}-`));
  }
}

// Utility functions
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(`${STORAGE_PREFIX}-current-session`);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(`${STORAGE_PREFIX}-current-session`, sessionId);
  }
  return sessionId;
};

export const clearCurrentSession = (): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}-current-session`);
};
