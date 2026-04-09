/**
 * Main entry point for the Bubble World application
 * 
 * This file initializes the React 18 application using the new createRoot API.
 * It renders the root App component into the DOM element with id "root".
 * 
 * Application Structure:
 * - React 18 with concurrent rendering
 * - Vite as the build tool and dev server
 * - TypeScript for type safety
 * 
 * TODO: Consider adding error boundary here to catch rendering errors
 * TODO: Add service worker registration for PWA support if needed
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Create a React root and render the App component
// The ! non-null assertion is safe because index.html always has a #root element
createRoot(document.getElementById("root")!).render(<App />);