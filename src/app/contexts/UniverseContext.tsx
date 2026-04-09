/**
 * UniverseContext - Combined context for universe data and operations
 * 
 * This file provides a unified interface to both universe data and operations:
 * - useUniverseStore: Combined hook that provides data + operations
 * - UniverseDataProvider: Provider for data (from UniverseDataContext)
 * - UniverseOperationsProvider: Provider for operations (from UniverseOperationsContext)
 * 
 * Architecture:
 * - The original monolithic UniverseContext was split into two contexts:
 *   1. UniverseDataContext: Manages universe data (fetching, caching, localStorage)
 *   2. UniverseOperationsContext: Manages CRUD operations (create, update, delete)
 * - This file provides backward compatibility by combining both
 * 
 * Usage:
 * - Use useUniverseStore() to access both data and operations
 * - Wrap app with both UniverseDataProvider and UniverseOperationsProvider
 * 
 * TODO: Consider merging back into single context if complexity doesn't warrant separation
 */

import { useContext } from 'react';
import { useUniverseData } from './UniverseDataContext';
import { useUniverseOperations } from './UniverseOperationsContext';

// Combined hook that provides the same interface as the original UniverseContext
export const useUniverseStore = () => {
  const { universes, loading } = useUniverseData();
  const operations = useUniverseOperations();
  
  return {
    universes,
    loading,
    ...operations
  };
};

// Re-export for backward compatibility
export { UniverseDataProvider } from './UniverseDataContext';
export { UniverseOperationsProvider } from './UniverseOperationsContext';
