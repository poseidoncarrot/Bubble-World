/**
 * Tailwind CSS Configuration
 * 
 * This file configures Tailwind CSS for the Bubble World application:
 * - Content paths for CSS generation
 * - CSS custom properties (CSS variables) for theming
 * - Extended color palette for UI components
 * - Chart color palette for data visualization
 * - Sidebar color palette for navigation
 * 
 * Content Paths:
 * - Scans index.html and all source files for class usage
 * - Supports JS, TS, JSX, TSX files
 * 
 * Theme System:
 * - Uses CSS custom properties for dynamic theming
 * - Supports light/dark mode via CSS variables
 * - Provides semantic color names (background, foreground, etc.)
 * 
 * Color Palettes:
 * - background/foreground: Page background and text
 * - card: Card component colors
 * - popover: Popover/tooltip colors
 * - primary: Primary action colors
 * - secondary: Secondary action colors
 * - muted: Muted/disabled colors
 * - accent: Highlight colors
 * - destructive: Error/danger colors
 * - chart: Data visualization colors (5 variants)
 * - sidebar: Navigation sidebar colors
 * 
 * Usage:
 * - Colors map to CSS variables defined in index.css
 * - Theme switching changes CSS variable values
 * - Tailwind classes use these semantic names
 * 
 * TODO: Add custom animation utilities
 * TODO: Add custom spacing scale
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
    },
  },
  plugins: [],
}
