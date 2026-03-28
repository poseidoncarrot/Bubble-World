import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTrialManager } from '@/hooks/useTrialManager';
import { useDataManager } from '@/hooks/useDataManager';
import { LoginPage } from '@/pages/LoginPage';
import { WorldDashboard } from '@/pages/WorldDashboard';
import { WorldEditor } from '@/pages/WorldEditor';
import { BubbleMap } from '@/pages/BubbleMap';
import { SignupModal } from '@/components/ui/SignupModal';
import { StatusBar } from '@/components/ui/StatusBar';

type CurrentView = 'editor' | 'map';

function App() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentView, setCurrentView] = useState<CurrentView>('editor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Trial management
  const {
    session,
    timeRemaining,
    formattedTime,
    isExpired,
    isTrialActive,
    convertToPremium
  } = useTrialManager(
    () => {
      // Trial expired - show signup modal
      setShowSignupModal(true);
    },
    () => {
      // Exit intent - show signup modal
      if (isTrialActive) {
        setShowSignupModal(true);
      }
    }
  );

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
    hasData
  } = useDataManager(session, !isAuthenticated);

  // Handle signup completion
  const handleSignupComplete = useCallback(() => {
    setIsAuthenticated(true);
    setShowSignupModal(false);
    convertToPremium();
  }, [convertToPremium]);

  // Handle login
  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    // Clear session and redirect to login
  }, []);

  // If no session yet, show loading
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen flex flex-col">
        {/* Main App Content */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            {/* Login/Signup Route */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />

            {/* Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <WorldDashboard 
                  worlds={worlds}
                  currentWorld={currentWorld}
                  onSelectWorld={selectWorld}
                  onCreateWorld={createWorld}
                  isTrial={isTrialActive}
                  timeRemaining={formattedTime}
                />
              } 
            />

            {/* Editor Route */}
            <Route 
              path="/world/:worldId/editor" 
              element={
                currentWorld ? (
                  <WorldEditor 
                    world={currentWorld}
                    pages={pages}
                    currentPage={currentPage}
                    onPageSelect={selectPage}
                    onCreatePage={createPage}
                    onSavePage={savePage}
                    isTrial={isTrialActive}
                    onToggleView={() => setCurrentView('map')}
                    currentView={currentView}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />

            {/* Bubble Map Route */}
            <Route 
              path="/world/:worldId/map" 
              element={
                currentWorld ? (
                  <BubbleMap 
                    world={currentWorld}
                    pages={pages}
                    onPageSelect={selectPage}
                    onToggleView={() => setCurrentView('editor')}
                    currentView={currentView}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />

            {/* Default Route */}
            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              } 
            />
          </Routes>
        </div>

        {/* Status Bar */}
        <StatusBar 
          syncStatus={syncStatus}
          currentPage={currentPage}
          isTrial={isTrialActive}
          timeRemaining={formattedTime}
        />

        {/* Signup Modal */}
        {showSignupModal && (
          <SignupModal
            isOpen={showSignupModal}
            onClose={() => setShowSignupModal(false)}
            onSignup={handleSignupComplete}
            timeRemaining={formattedTime}
            hasData={hasData()}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
