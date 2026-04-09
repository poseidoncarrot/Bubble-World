/**
 * Root App component that sets up the provider hierarchy for the entire application
 * 
 * Provider Stack (from outer to inner):
 * 1. DndProvider - Enables drag and drop functionality using HTML5 backend
 * 2. AuthProvider - Manages user authentication state across the app
 * 3. UniverseDataProvider - Provides universe/world data to components
 * 4. UniverseOperationsProvider - Provides operations for manipulating universe data
 * 5. RouterProvider - Handles client-side routing with React Router
 * 
 * This layered approach ensures that:
 * - Drag and drop is available throughout the app
 * - Authentication state is accessible to all components
 * - Universe data can be fetched and cached centrally
 * - Universe operations (create, update, delete) are managed in one place
 * - Routing works with all the above providers available
 * 
 * TODO: Consider adding a ErrorBoundary wrapper to catch rendering errors
 * TODO: Add a loading state component for initial data loading
 */

import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './utils/AuthContext';
import { UniverseDataProvider, UniverseOperationsProvider } from './contexts/UniverseContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <UniverseDataProvider>
          <UniverseOperationsProvider>
            <RouterProvider router={router} />
          </UniverseOperationsProvider>
        </UniverseDataProvider>
      </AuthProvider>
    </DndProvider>
  );
}
