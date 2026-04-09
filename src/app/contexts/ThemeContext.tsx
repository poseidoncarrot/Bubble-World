import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Universe } from '../types';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void;
  getThemeClasses: () => {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  universe?: Universe;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, universe }) => {
  const [currentTheme, setCurrentTheme] = useState(universe?.settings?.theme || 'Light (Default)');

  const setTheme = useCallback((theme: string) => {
    setCurrentTheme(theme);
  }, []);

  const getThemeClasses = useCallback(() => {
    const isDark = currentTheme === 'Dark';
    const isParchment = currentTheme === 'Parchment';
    
    return {
      background: isDark ? '#1a202c' : isParchment ? '#fdf6e3' : '#f8f9fa',
      surface: isDark ? '#2d3748' : isParchment ? '#f5f0dc' : '#ffffff',
      text: isDark ? '#ffffff' : isParchment ? '#5d5444' : '#214059',
      textSecondary: isDark ? '#a0aec0' : isParchment ? '#8b7355' : '#44474c',
      border: isDark ? '#4a5568' : isParchment ? '#d4c5a0' : 'rgba(33, 64, 89, 0.1)'
    };
  }, [currentTheme]);

  const value = {
    currentTheme,
    setTheme,
    getThemeClasses
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
