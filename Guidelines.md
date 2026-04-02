# Bubble World Project Guidelines

## Project Overview
Bubble World is a worldbuilding application that allows users to create, organize, and explore fictional universes through interconnected pages, subsections, and visual bubble maps.

## Architecture Guidelines

### Component Structure
- Use functional components with React hooks
- Follow the existing component structure in `/src/app/components/`
- UI components should be placed in `/src/app/components/ui/`
- Business logic components go directly in `/src/app/components/`

### Data Management
- Use Supabase for backend data storage
- Local storage utilities are in `/src/app/utils/storage.ts`
- Type definitions are centralized in `/src/app/types.ts`
- Follow the Universe > Pages > Subsections hierarchy

### Routing
- Use React Router v7 with createBrowserRouter
- Routes are defined in `/src/app/routes.tsx`
- Follow the pattern: `/world/:worldId/editor` and `/world/:worldId/map`

## Design System Guidelines

### UI Framework
- Use Material-UI (@mui/material) for primary components
- Use Radix UI primitives for accessible components
- Tailwind CSS for styling and responsive design
- Lucide React for icons

### Color Scheme
- Primary colors should be consistent with Material-UI theme
- Use semantic colors for different states (success, warning, error)
- Maintain good contrast ratios for accessibility

### Layout Principles
- Use flexbox and grid for responsive layouts
- Avoid absolute positioning unless necessary
- Implement proper spacing using Material-UI spacing system
- Ensure mobile-first responsive design

## Code Quality Guidelines

### TypeScript
- All components must be written in TypeScript
- Use proper type definitions from `/src/app/types.ts`
- Avoid `any` types - use proper interfaces
- Use generic types where appropriate

### State Management
- Use React hooks for local state
- Use React Context for global state (AuthContext)
- Keep state close to where it's used
- Avoid prop drilling by using context when needed

### Performance
- Implement proper memoization for expensive operations
- Use React.lazy() for code splitting large components
- Optimize re-renders with useMemo and useCallback
- Implement proper loading states

## Feature Guidelines

### Worldbuilding Features
- Each Universe contains multiple Pages
- Each Page contains multiple Subsections
- Support visual connections between elements
- Implement drag-and-drop functionality for bubble maps

### Editor Features
- Use rich text editing for content
- Support image uploads for covers and icons
- Implement auto-save functionality
- Provide undo/redo capabilities

### Map Visualization
- Use D3.js or similar for bubble positioning
- Implement force-directed graph layouts
- Support interactive bubble manipulation
- Show connection relationships visually

## Security Guidelines

### Authentication
- Use Supabase Auth for user management
- Implement proper session management
- Protect routes that require authentication
- Handle edge cases for expired sessions

### Data Validation
- Validate all user inputs on both client and server
- Sanitize data before storage
- Implement proper error handling
- Use TypeScript for compile-time validation

## Testing Guidelines

### Unit Testing
- Test all utility functions
- Test component rendering and behavior
- Mock external dependencies
- Aim for high code coverage

### Integration Testing
- Test user workflows end-to-end
- Test data persistence with Supabase
- Test authentication flows
- Test error scenarios

## Development Workflow

### Git Workflow
- Use feature branches for new development
- Write descriptive commit messages
- Create pull requests for review
- Maintain clean commit history

### Code Review
- Review for adherence to guidelines
- Check for performance implications
- Verify accessibility compliance
- Ensure proper error handling

## Deployment Considerations

### Environment Variables
- Keep sensitive data in environment variables
- Use different configs for development/production
- Document required environment variables
- Implement proper secret management

### Build Optimization
- Use Vite for fast development builds
- Implement proper tree shaking
- Optimize bundle size
- Implement proper caching strategies
