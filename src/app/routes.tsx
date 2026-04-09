/**
 * Application routing configuration using React Router's createBrowserRouter
 * 
 * Route Structure:
 * 
 * / (Root layout with auth guards)
 * ├── / (index) - WorldsList - Shows all user's worlds
 * ├── /world/:worldId/
 * │   ├── / (index) - Editor - Default editor view for a world
 * │   ├── /editor - Editor - Explicit editor route
 * │   └── /map - BubbleMap - Visual bubble map view
 * ├── /login - Login - User authentication
 * ├── /forgot-password - ForgotPassword - Password recovery
 * └── /reset-password - ResetPassword - Password reset form
 * 
 * Key Design Decisions:
 * - Nested routes for world-specific views (editor and map)
 * - Both /world/:worldId and /world/:worldId/editor point to Editor for convenience
 * - All routes wrapped in Root component for authentication
 * - Dynamic :worldId parameter for world-specific routes
 * 
 * TODO: Consider adding 404 Not Found route
 * TODO: Add route transitions/animations
 * TODO: Consider lazy loading route components for better performance
 */

import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import WorldsList from './components/WorldsList';
import Editor from './components/Editor';
import BubbleMap from './components/BubbleMap';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      // Home route - shows list of all worlds
      { index: true, Component: WorldsList },
      // World-specific routes with nested views
      {
        path: 'world/:worldId',
        children: [
          // Default view for a world is the editor
          { index: true, Component: Editor },
          // Explicit editor route
          { path: 'editor', Component: Editor },
          // Visual bubble map view
          { path: 'map', Component: BubbleMap },
        ]
      },
      // Authentication routes
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'forgot-password',
        Component: ForgotPassword
      },
      {
        path: 'reset-password',
        Component: ResetPassword
      }
    ]
  }
]);
