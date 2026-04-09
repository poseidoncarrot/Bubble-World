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
