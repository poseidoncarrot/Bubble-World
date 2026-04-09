import { Universe } from '../types';
import * as db from '../utils/database';

export class UniverseService {
  static async createUniverse(data: {
    user_id: string;
    name: string;
    description: string;
    icon?: string;
  }): Promise<Universe> {
    const universeData = {
      ...data,
      pages: [],
      categories: [],
      settings: {
        theme: 'Light (Default)',
        font: 'Sans Serif (Modern)',
        color: '#214059'
      }
    };
    return await db.createUniverse(universeData);
  }

  static async updateUniverse(universeId: string, updates: Partial<Universe>): Promise<void> {
    return await db.updateUniverse(universeId, updates);
  }

  static async deleteUniverse(universeId: string): Promise<void> {
    return await db.deleteUniverse(universeId);
  }

  static async getUniverses(userId: string): Promise<Universe[]> {
    return await db.getUniverses(userId);
  }

  static validateUniverseName(name: string): { isValid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Universe name is required' };
    }
    
    if (name.length > 30) {
      return { isValid: false, error: 'Universe name must be 30 characters or less' };
    }
    
    if (name.trim().length !== name.length) {
      return { isValid: false, error: 'Universe name cannot start or end with whitespace' };
    }
    
    return { isValid: true };
  }

  static validateUniverseDescription(description: string): { isValid: boolean; error?: string } {
    if (description.length > 70) {
      return { isValid: false, error: 'Description must be 70 characters or less' };
    }
    
    return { isValid: true };
  }
}
