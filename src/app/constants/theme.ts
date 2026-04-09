export const THEME_COLORS = {
  primary: '#214059',
  primaryLight: '#395771',
  textPrimary: '#214059',
  textSecondary: '#44474c',
  textMuted: '#6b7280',
  background: '#f8f9fa',
  surface: '#ffffff',
  border: 'rgba(33, 64, 89, 0.1)',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981'
} as const;

export const THEME_CONFIG = {
  names: {
    light: 'Light (Default)',
    dark: 'Dark',
    parchment: 'Parchment'
  },
  backgrounds: {
    light: '#f8f9fa',
    dark: '#1a202c',
    parchment: '#fdf6e3'
  }
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
} as const;

export const VALIDATION_LIMITS = {
  universeName: 30,
  universeDescription: 70,
  pageTitle: 100,
  pageDescription: 200
} as const;

export const DEBOUNCE_DELAY = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

export const INACTIVITY_CONFIG = {
  timeout: 5 * 60 * 1000, // 5 minutes
  warningTime: 30 * 1000, // 30 seconds before logout
  throttleTime: 1000 // 1 second for activity events
} as const;
