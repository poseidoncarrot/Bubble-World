import { useCallback } from 'react';
import { useUniverseData } from '../contexts/UniverseDataContext';
import { Subsection } from '../types';
import * as db from '../utils/database';

export const useSubsectionOperations = () => {
  const { universes, saveUniverses } = useUniverseData();

  const createSubsection = useCallback(async (universeId: string, pageId: string, title: string, content: string) => {
    const newSubsection = await db.createSubsection({
      page_id: pageId,
      title,
      content,
      position: undefined,
      connections: []
    });

    const newUniverses = universes.map(u =>
      u.id === universeId
        ? {
            ...u,
            pages: u.pages.map(p =>
              p.id === pageId ? { ...p, subsections: [...p.subsections, newSubsection] } : p
            )
          }
        : u
    );
    await saveUniverses(newUniverses);
    return newSubsection;
  }, [universes, saveUniverses]);

  const updateSubsection = useCallback(async (universeId: string, pageId: string, subsectionId: string, updates: Partial<Subsection>) => {
    await db.updateSubsection(subsectionId, updates);
    const newUniverses = universes.map(u =>
      u.id === universeId
        ? {
            ...u,
            pages: u.pages.map(p =>
              p.id === pageId
                ? { ...p, subsections: p.subsections.map(s => s.id === subsectionId ? { ...s, ...updates } : s) }
                : p
            )
          }
        : u
    );
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  const deleteSubsection = useCallback(async (universeId: string, pageId: string, subsectionId: string) => {
    await db.deleteSubsection(subsectionId);
    const newUniverses = universes.map(u =>
      u.id === universeId
        ? {
            ...u,
            pages: u.pages.map(p =>
              p.id === pageId ? { ...p, subsections: p.subsections.filter(s => s.id !== subsectionId) } : p
            )
          }
        : u
    );
    await saveUniverses(newUniverses);
  }, [universes, saveUniverses]);

  return {
    createSubsection,
    updateSubsection,
    deleteSubsection
  };
};
