import { World, Page, Subsection } from '../types';

const STORAGE_KEY = 'architect_worlds';

export const getWorlds = (): World[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWorlds = (worlds: World[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds));
};

export const getWorld = (worldId: string): World | undefined => {
  const worlds = getWorlds();
  return worlds.find(w => w.id === worldId);
};

export const createWorld = (name: string, description: string): World => {
  const worlds = getWorlds();
  const newWorld: World = {
    id: Date.now().toString(),
    name,
    description,
    pages: []
  };
  worlds.push(newWorld);
  saveWorlds(worlds);
  return newWorld;
};

export const updateWorld = (worldId: string, updates: Partial<World>): void => {
  const worlds = getWorlds();
  const index = worlds.findIndex(w => w.id === worldId);
  if (index !== -1) {
    worlds[index] = { ...worlds[index], ...updates };
    saveWorlds(worlds);
  }
};

export const deletePage = (worldId: string, pageId: string): void => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  if (world) {
    world.pages = world.pages.filter(p => p.id !== pageId);
    saveWorlds(worlds);
  }
};

export const createPage = (worldId: string, title: string, description: string): Page => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (!world) throw new Error('World not found');
  
  const newPage: Page = {
    id: Date.now().toString(),
    title,
    description,
    subsections: [],
    connections: []
  };
  
  world.pages.push(newPage);
  saveWorlds(worlds);
  return newPage;
};

export const updatePage = (worldId: string, pageId: string, updates: Partial<Page>): void => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (world) {
    const pageIndex = world.pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      world.pages[pageIndex] = { ...world.pages[pageIndex], ...updates };
      saveWorlds(worlds);
    }
  }
};

export const createSubsection = (worldId: string, pageId: string, title: string, content: string): Subsection => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (!world) throw new Error('World not found');
  
  const page = world.pages.find(p => p.id === pageId);
  if (!page) throw new Error('Page not found');
  
  const newSubsection: Subsection = {
    id: Date.now().toString(),
    title,
    content,
    connections: []
  };
  
  page.subsections.push(newSubsection);
  saveWorlds(worlds);
  return newSubsection;
};

export const updateSubsection = (worldId: string, pageId: string, subsectionId: string, updates: Partial<Subsection>): void => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (world) {
    const page = world.pages.find(p => p.id === pageId);
    if (page) {
      const subsectionIndex = page.subsections.findIndex(s => s.id === subsectionId);
      if (subsectionIndex !== -1) {
        page.subsections[subsectionIndex] = { ...page.subsections[subsectionIndex], ...updates };
        saveWorlds(worlds);
      }
    }
  }
};

export const deleteSubsection = (worldId: string, pageId: string, subsectionId: string): void => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (world) {
    const page = world.pages.find(p => p.id === pageId);
    if (page) {
      page.subsections = page.subsections.filter(s => s.id !== subsectionId);
      saveWorlds(worlds);
    }
  }
};

export const togglePageConnection = (worldId: string, fromPageId: string, toPageId: string): void => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (world) {
    const fromPage = world.pages.find(p => p.id === fromPageId);
    if (fromPage) {
      const connectionIndex = fromPage.connections.indexOf(toPageId);
      if (connectionIndex === -1) {
        fromPage.connections.push(toPageId);
      } else {
        fromPage.connections.splice(connectionIndex, 1);
      }
      saveWorlds(worlds);
    }
  }
};

export const toggleSubsectionConnection = (worldId: string, pageId: string, fromSubsectionId: string, toSubsectionId: string): void => {
  const worlds = getWorlds();
  const world = worlds.find(w => w.id === worldId);
  
  if (world) {
    const page = world.pages.find(p => p.id === pageId);
    if (page) {
      const fromSubsection = page.subsections.find(s => s.id === fromSubsectionId);
      if (fromSubsection) {
        const connectionIndex = fromSubsection.connections.indexOf(toSubsectionId);
        if (connectionIndex === -1) {
          fromSubsection.connections.push(toSubsectionId);
        } else {
          fromSubsection.connections.splice(connectionIndex, 1);
        }
        saveWorlds(worlds);
      }
    }
  }
};
