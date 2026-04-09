import { useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useUniverseData } from '../contexts/UniverseDataContext';
import { Universe } from '../types';
import * as db from '../utils/database';
import { reorderUniverses as reorderUniversesUtil } from '../utils/reorder';

export const useUniverseOperations = () => {
  const { user } = useAuth();
  const { universes, saveUniverses } = useUniverseData();

  const createUniverse = useCallback(async (name: string, description: string, iconUrl?: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const newUniverse = await db.createUniverse({
        user_id: user.id,
        name,
        description,
        icon: iconUrl,
        pages: [],
        categories: [],
        settings: {
          theme: 'Light (Default)',
          font: 'Sans Serif (Modern)',
          color: '#214059'
        }
      });

      const newUniverses = [...universes, newUniverse];
      await saveUniverses(newUniverses);
      return newUniverse;
    } catch (error) {
      console.error('Failed to create universe:', error);
      throw error;
    }
  }, [user, universes, saveUniverses]);

  const updateUniverse = useCallback(async (universeId: string, updates: Partial<Universe>) => {
    try {
      await db.updateUniverse(universeId, updates);
      const newUniverses = universes.map(u => u.id === universeId ? { ...u, ...updates } : u);
      await saveUniverses(newUniverses);
    } catch (error) {
      console.error('Failed to update universe:', error);
      throw error;
    }
  }, [universes, saveUniverses]);

  const deleteUniverse = useCallback(async (universeId: string) => {
    try {
      await db.deleteUniverse(universeId);
      const newUniverses = universes.filter(u => u.id !== universeId);
      await saveUniverses(newUniverses);
    } catch (error) {
      console.error('Failed to delete universe:', error);
      throw error;
    }
  }, [universes, saveUniverses]);

  const reorderUniverses = useCallback(async (startIndex: number, endIndex: number) => {
    const result = reorderUniversesUtil(universes, startIndex, endIndex);
    await saveUniverses(result);
  }, [universes, saveUniverses]);

  return {
    createUniverse,
    updateUniverse,
    deleteUniverse,
    reorderUniverses
  };
};
