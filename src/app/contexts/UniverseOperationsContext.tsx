import { createContext, useContext, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { getServerUrl } from '../utils/supabase';
import { Universe, Page, Subsection } from '../types';
import { useUniverseOperations as useUniverseOps } from '../hooks/useUniverseOperations';
import { useCategoryOperations } from '../hooks/useCategoryOperations';
import { usePageOperations } from '../hooks/usePageOperations';
import { useSubsectionOperations } from '../hooks/useSubsectionOperations';

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

  const universeOps = useUniverseOps();
  const categoryOps = useCategoryOperations();
  const pageOps = usePageOperations();
  const subsectionOps = useSubsectionOperations();

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
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }, [user]);

  const value = {
    ...universeOps,
    ...categoryOps,
    ...pageOps,
    ...subsectionOps,
    uploadImage
  };

  return (
    <UniverseOperationsContext.Provider value={value}>
      {children}
    </UniverseOperationsContext.Provider>
  );
};

export const useUniverseOperations = () => {
  const ctx = useContext(UniverseOperationsContext);
  if (!ctx) throw new Error('useUniverseOperations must be used within UniverseOperationsProvider');
  return ctx;
};
