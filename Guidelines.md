# Bubble World Project Guidelines

## Project Overview
Bubble World is a sophisticated worldbuilding application that enables users to create, organize, and explore fictional universes through interconnected pages, subsections, and visual bubble maps. The application emphasizes performance, type safety, and user experience.

## Architecture Guidelines

### Component Structure
- **Functional Components**: Use modern React hooks exclusively
- **Component Organization**:
  - `/src/app/components/ui/` - Reusable UI primitives
  - `/src/app/components/` - Business logic components
  - `/src/app/components/figma/` - Figma-specific components
- **File Naming**: PascalCase for components, kebab-case for utilities
- **Export Strategy**: Named exports for components, default for main components

### Data Management
- **Primary Storage**: Supabase PostgreSQL with Row Level Security
- **Local Fallback**: localStorage with intelligent change detection
- **Type Definitions**: Centralized in `/src/app/types.ts`
- **Data Hierarchy**: Universe > Pages > Subsections > Connections
- **State Management**: React Context + hooks for global state
- **Caching**: Optimistic updates with localStorage persistence

### Routing Architecture
- **Router**: React Router v7 with createBrowserRouter
- **Route Definitions**: `/src/app/routes.tsx`
- **Route Patterns**:
  - `/` - Worlds list dashboard
  - `/login` - Authentication
  - `/world/:worldId/editor` - Main editor
  - `/world/:worldId/map` - Visual bubble map
- **Navigation**: Programmatic navigation with proper state management

### Authentication Flow
- **Provider**: Supabase Auth with JWT tokens
- **Session Management**: Automatic token refresh and cleanup
- **Protected Routes**: Route guards with loading states
- **User Profiles**: Automatic profile creation on signup

## Design System Guidelines

### UI Framework Stack
- **Base**: Tailwind CSS 4.1.12 for utility-first styling
- **Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography
- **Animations**: Motion/Framer Motion for smooth transitions
- **Drag & Drop**: React DnD with HTML5Backend

### Design Principles
- **Color Palette**: Consistent with brand identity (#214059 primary)
- **Typography**: System fonts with proper fallbacks
- **Spacing**: Tailwind spacing scale (4px base unit)
- **Responsiveness**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels

### Component Patterns
- **Composition**: Prefer composition over inheritance
- **Props Interface**: TypeScript interfaces for all component props
- **Default Props**: ES6 default parameters over defaultProps
- **Styling**: Tailwind classes with conditional logic
- **State**: Local state with hooks, global state with Context

## Code Quality Guidelines

### TypeScript Standards
- **Strict Mode**: All files must pass strict TypeScript checks
- **Type Coverage**: No `any` types except for external APIs
- **Interface Definitions**: Centralized in `/src/app/types.ts`
- **Generic Types**: Use generics where appropriate for reusability
- **Utility Types**: Leverage TypeScript utility types (Partial, Pick, Omit)

### React Best Practices
- **Hooks Only**: No class components
- **Custom Hooks**: Extract complex logic into reusable hooks
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Effect Cleanup**: Always return cleanup functions from useEffect
- **Dependency Arrays**: Accurate dependency arrays for all hooks

### Performance Optimization
- **Code Splitting**: Lazy load heavy components with React.lazy
- **Bundle Optimization**: Manual chunks for vendor libraries
- **Memoization**: Memoize expensive calculations and renders
- **Debouncing**: Debounce user inputs and API calls
- **Virtualization**: Consider for large lists (future enhancement)

### Error Handling
- **Error Boundaries**: Implement for component error recovery
- **Graceful Degradation**: Fallbacks for failed operations
- **User Feedback**: Clear error messages with actionable steps
- **Logging**: Structured error logging for debugging
- **Recovery**: Automatic retry where appropriate

## Security Guidelines

### Authentication Security
- **Token Management**: Secure JWT storage and automatic refresh
- **Session Validation**: Validate tokens on critical operations
- **Logout**: Complete session cleanup on logout
- **Route Protection**: Server-side validation for protected routes

### Data Security
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Prevention**: Proper input sanitization and output encoding
- **Row Level Security**: Database-level access controls
- **Data Encryption**: HTTPS for all communications

### Privacy Protection
- **Data Minimization**: Collect only necessary user data
- **Local Storage**: Sensitive data not stored in localStorage
- **Third-Party**: Minimal third-party dependencies with vetting
- **Compliance**: GDPR-friendly data handling practices

## Feature Implementation Guidelines

### Worldbuilding Features
- **Data Modeling**: Hierarchical structure with bidirectional relationships
- **Real-time Updates**: Live synchronization across connected clients
- **Offline Support**: Local storage fallback with conflict resolution
- **Import/Export**: Future consideration for data portability
- **Collaboration**: Multi-user editing capabilities (future)

### Editor Features
- **Rich Text**: Custom rich text editor with formatting options
- **Auto-Save**: Debounced automatic saving
- **Version History**: Track changes for undo/redo functionality
- **Media Handling**: Image uploads with optimization
- **Keyboard Shortcuts**: Accessibility-focused keyboard navigation

### Map Visualization
- **Force Layout**: Physics-based bubble positioning
- **Interactive Controls**: Zoom, pan, and bubble manipulation
- **Connection Visualization**: Clear relationship indicators
- **Performance**: Canvas-based rendering for large maps
- **Search Integration**: Visual highlighting of search results

## Testing Strategy

### Unit Testing
- **Component Testing**: React Testing Library for component behavior
- **Utility Testing**: Jest for pure function testing
- **Mock Strategy**: Mock external dependencies (Supabase, APIs)
- **Coverage Target**: 80%+ code coverage for critical paths

### Integration Testing
- **User Workflows**: End-to-end testing with Playwright
- **API Integration**: Test Supabase integration points
- **Authentication Flows**: Complete auth journey testing
- **Error Scenarios**: Test failure modes and recovery

### Performance Testing
- **Bundle Analysis**: Regular bundle size monitoring
- **Runtime Performance**: Component render performance
- **Memory Leaks**: Monitor for memory leaks in long-running sessions
- **Network Performance**: API call optimization and caching

## Development Workflow

### Git Workflow
- **Branch Strategy**: Feature branches from main
- **Commit Convention**: Conventional commits with semantic messages
- **Pull Requests**: Required for all changes with code review
- **CI/CD**: Automated testing and deployment on merge

### Code Review Process
- **TypeScript Compliance**: All type errors must be resolved
- **Performance Impact**: Review for performance regressions
- **Security Review**: Check for security vulnerabilities
- **Accessibility**: Verify WCAG compliance
- **Documentation**: Update documentation for API changes

### Development Environment
- **Local Development**: Hot reload with Vite dev server
- **Environment Variables**: Proper .env file management
- **Database**: Local Supabase instance or development project
- **Debugging**: React DevTools and browser dev tools integration

## Deployment Guidelines

### Build Optimization
- **Production Build**: Optimized bundles with tree shaking
- **Asset Optimization**: Image compression and lazy loading
- **Code Splitting**: Intelligent chunk splitting for caching
- **Service Worker**: Consider for offline capabilities (future)

### Environment Management
- **Configuration**: Environment-specific configurations
- **Secrets Management**: Secure handling of API keys and secrets
- **Monitoring**: Error tracking and performance monitoring
- **Scaling**: Consider CDN and horizontal scaling needs

### Deployment Platforms
- **Primary**: Vercel for seamless deployment and automatic scaling
- **Static Hosting**: Netlify, or similar for frontend-only deployment
- **Backend**: Supabase for managed backend services
- **CI/CD**: GitHub Actions or similar for automated deployment
- **Rollback**: Strategy for quick rollback on deployment issues

### Vercel Deployment Guidelines
- **Configuration**: Use `vercel.json` for build and deployment settings
- **Environment Variables**: Set in Vercel dashboard, not in code
- **Automatic Detection**: Vercel automatically detects Vite configuration
- **Preview Deployments**: Automatic preview deployments for pull requests
- **Custom Domains**: Configure in Vercel dashboard with automatic SSL
- **Performance**: Leverage Vercel Edge Network for global CDN

### Vercel Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: Vite (auto-detected)
- **Node Version**: 18.x or higher
- **Environment Variables**: Use Vercel dashboard for production secrets

### Vercel Best Practices
- **Preview Deployments**: Enable for all pull requests
- **Environment Separation**: Use different environments for dev/staging/prod
- **Performance Monitoring**: Enable Vercel Analytics
- **Error Tracking**: Configure error reporting for production
- **Custom Headers**: Use `vercel.json` for security headers and caching

## Maintenance and Evolution

### Regular Maintenance
- **Dependency Updates**: Regular security and feature updates
- **Performance Monitoring**: Track bundle size and runtime performance
- **User Feedback**: Collect and analyze user feedback
- **Security Audits**: Regular security dependency scanning

### Future Enhancements
- **Real-time Collaboration**: Multi-user editing capabilities
- **Advanced Visualization**: More sophisticated map layouts
- **Mobile App**: Native mobile application development
- **AI Integration**: AI-powered content suggestions
- **Analytics**: User behavior analytics and insights

These guidelines ensure the Bubble World project maintains high code quality, security, performance, and user experience standards while enabling sustainable long-term development.
