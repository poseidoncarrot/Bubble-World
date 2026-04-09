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
      { index: true, Component: WorldsList },
      {
        path: 'world/:worldId',
        children: [
          { index: true, Component: Editor },
          { path: 'editor', Component: Editor },
          { path: 'map', Component: BubbleMap },
        ]
      },
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
