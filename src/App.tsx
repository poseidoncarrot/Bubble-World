import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDataManager } from '@/hooks/useDataManager';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { WorldDashboard } from '@/pages/WorldDashboard';
import { WorldEditor } from '@/pages/WorldEditor';
import { BubbleMap } from '@/pages/BubbleMap';
import { StatusBar } from '@/components/ui/StatusBar';
import { supabase } from '@/services/supabase';

type CurrentView = 'editor' | 'map';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('editor');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setSessionUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setSessionUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data management
  const {
    worlds,
    currentWorld,
    pages,
    currentPage,
    syncStatus,
    createWorld,
    createPage,
    savePage,
    selectWorld,
    selectPage,
  } = useDataManager(sessionUser ? { id: sessionUser.id } as any : null);

  // If auth is still loading, show spinner
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  const showStatusBar = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="h-screen flex flex-col pt-0">
      {/* Main App Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={() => {}} />} 
          />

          {/* Register Route */}
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={() => {}} />} 
          />

          {/* Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WorldDashboard 
                  worlds={worlds}
                  currentWorld={currentWorld}
                  onSelectWorld={selectWorld}
                  onCreateWorld={createWorld}
                />
              </ProtectedRoute>
            } 
          />

          {/* Editor Route */}
          <Route 
            path="/world/:worldId/editor" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                {currentWorld ? (
                  <WorldEditor 
                    world={currentWorld}
                    pages={pages}
                    currentPage={currentPage}
                    onPageSelect={selectPage}
                    onCreatePage={createPage}
                    onSavePage={savePage}
                    isTrial={false}
                    onToggleView={() => setCurrentView('map')}
                    currentView={currentView}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />

          {/* Bubble Map Route */}
          <Route 
            path="/world/:worldId/map" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                {currentWorld ? (
                  <BubbleMap 
                    world={currentWorld}
                    pages={pages}
                    onPageSelect={selectPage}
                    onToggleView={() => setCurrentView('editor')}
                    currentView={currentView}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>

      {/* Status Bar */}
      {showStatusBar && (
        <StatusBar 
          syncStatus={syncStatus}
          currentPage={currentPage}
          isTrial={false}
          timeRemaining=""
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
