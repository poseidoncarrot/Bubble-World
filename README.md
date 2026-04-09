# Bubble World

A sophisticated worldbuilding application that empowers users to create, organize, and explore fictional universes through interconnected pages, subsections, and interactive visual bubble maps.

## 🌟 Features

### Core Functionality
- **World Creation**: Build rich fictional universes with custom settings, categories, and themes
- **Hierarchical Organization**: Structure your world with Universes > Pages > Subsections
- **Visual Mapping**: Explore connections between elements through interactive bubble maps
- **Rich Content Editor**: Create detailed content with advanced rich text editing
- **Drag & Drop**: Intuitive bubble map manipulation with smooth animations
- **Real-time Sync**: Live synchronization across multiple devices

### User Experience
- **Authentication**: Secure user authentication via Supabase with email verification
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices
- **Dark/Light Themes**: Customizable themes with smooth transitions
- **Offline Support**: Local storage fallback for offline resilience
- **Performance Optimized**: Fast loading and smooth interactions

### Advanced Features
- **Connection Management**: Create and manage relationships between world elements
- **Image Upload**: Custom universe icons and page cover images
- **Search Functionality**: Quick search across all world content
- **Auto-save**: Debounced automatic saving with conflict resolution
- **Category Organization**: Organize pages into custom categories
- **Password Reset**: Complete forgot password flow with secure token handling

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.3.1** with TypeScript for type safety and performance
- **Vite 6.0.5** for lightning-fast development and optimized builds
- **Tailwind CSS 3.4.17** for utility-first responsive styling
- **Radix UI** for accessible component primitives (48+ components)
- **Lucide React** for consistent, beautiful iconography
- **Motion 12.23.24** for smooth animations and transitions
- **React DnD 16.0.1** for intuitive drag-and-drop functionality
- **React Router 6.28.0** for client-side routing
- **Material UI 7.3.5** for additional UI components

### Backend Infrastructure
- **Supabase** for authentication, PostgreSQL database, and file storage
- **Row Level Security (RLS)** for granular data access control
- **Storage Buckets** for image uploads (universe icons, page covers)
- **Edge Functions** for server-side operations and image processing
- **Real-time Subscriptions** for live data synchronization

### Modular Architecture
The application follows a modular architecture with clear separation of concerns:

#### Custom Hooks (src/app/hooks/)
- **useUniverseOperations** - Universe CRUD and reordering operations
- **useCategoryOperations** - Category management (add, rename, delete)
- **usePageOperations** - Page CRUD and reordering operations
- **useSubsectionOperations** - Subsection CRUD operations
- **useBubbleMap** - Bubble map visualization and interaction logic
- **useDebounce** - Debounced value updates for performance
- **useDragAndDrop** - Drag and drop functionality for reordering

#### Contexts (src/app/contexts/)
- **AuthContext** - Authentication state and session management
- **UniverseDataContext** - Universe data fetching and caching
- **UniverseOperationsContext** - All CRUD operations (aggregates modular hooks)
- **ThemeContext** - Theme management (light/dark/parchment)
- **ModalContext** - Modal state management

#### Services (src/app/services/)
- **auth.ts** - Authentication service with Supabase
- **UniverseService** - Universe business logic
- **PageService** - Page business logic and validation
- **ValidationService** - Input validation rules
- **ErrorService** - Error handling and user feedback

#### Utilities (src/app/utils/)
- **database.ts** - Database operations with type-safe transforms
- **database.types.ts** - Database schema type definitions
- **reorder.ts** - Shared reorder utilities for drag-and-drop
- **storage.ts** - Local storage utilities for offline resilience
- **supabase.ts** - Supabase client configuration

### Performance Optimizations
- **Code Splitting**: Automatic bundle optimization with manual chunks
- **Memoization**: Strategic use of React.memo, useMemo, and useCallback
- **Lazy Loading**: On-demand component loading for reduced initial bundle
- **Intelligent Caching**: Smart localStorage caching with change detection
- **Bundle Analysis**: Optimized vendor chunks for better caching
- **Debounced Updates**: Performance-optimized auto-save with 500ms debounce
- **Type Safety**: Strict TypeScript with no implicit any types

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI primitives (48+ Radix components)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...          # Additional UI components
│   │   ├── editor/          # Editor-specific components
│   │   │   ├── PageSidebar.tsx      # Page navigation sidebar
│   │   │   ├── DraggablePage.tsx    # Draggable page items
│   │   │   ├── DraggableSubsection.tsx
│   │   │   ├── EditorContent.tsx    # Main editor content area
│   │   │   ├── EditorModals.tsx     # Editor modal dialogs
│   │   │   ├── EditorSettings.tsx   # Universe settings panel
│   │   │   └── CategoryDropZone.tsx # Category drop zone
│   │   ├── bubblemap/        # Bubble map components
│   │   │   ├── BubbleCanvas.tsx     # Canvas for bubble visualization
│   │   │   ├── BubbleNode.tsx       # Individual bubble nodes
│   │   │   └── BubbleSidebar.tsx    # Map sidebar with search
│   │   ├── figma/           # Figma-specific components
│   │   │   └── ImageWithFallback.tsx
│   │   ├── shared/          # Shared components
│   │   ├── Editor.tsx       # Main rich text editor component
│   │   ├── BubbleMap.tsx    # Interactive bubble visualization
│   │   ├── WorldsList.tsx   # World dashboard with drag-reorder
│   │   ├── Login.tsx        # Authentication flow
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── DeleteConfirmModal.tsx
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx           # Authentication state
│   │   ├── UniverseDataContext.tsx   # Universe data fetching
│   │   ├── UniverseOperationsContext.tsx # CRUD operations
│   │   ├── ThemeContext.tsx          # Theme management
│   │   └── ModalContext.tsx          # Modal state
│   ├── hooks/               # Custom React hooks
│   │   ├── useUniverseOperations.ts   # Universe CRUD
│   │   ├── useCategoryOperations.ts   # Category management
│   │   ├── usePageOperations.ts       # Page CRUD
│   │   ├── useSubsectionOperations.ts # Subsection CRUD
│   │   ├── useBubbleMap.ts            # Bubble map logic
│   │   ├── useDebounce.ts             # Debounced updates
│   │   └── useDragAndDrop.ts         # Drag and drop
│   ├── services/            # Business logic layer
│   │   ├── auth.ts          # Authentication service
│   │   ├── UniverseService.ts
│   │   ├── PageService.ts   # Page validation
│   │   ├── ValidationService.ts
│   │   ├── ErrorService.ts  # Error handling
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── database.ts       # Database operations
│   │   ├── database.types.ts # DB type definitions
│   │   ├── reorder.ts        # Reorder utilities
│   │   ├── storage.ts       # Local storage
│   │   ├── supabase.ts      # Supabase client
│   │   ├── AuthContext.tsx  # Auth context (legacy)
│   │   ├── useInactivityTracker.ts
│   │   └── seedData.ts
│   ├── types.ts             # TypeScript type definitions
│   ├── types/               # Type modules
│   │   └── enhanced.ts      # Enhanced type definitions
│   ├── constants/           # Application constants
│   ├── routes.tsx           # Application routing
│   ├── App.tsx              # Root component
│   ├── Root.tsx             # Layout and route protection
│   └── main.tsx             # Application entry point
├── supabase/                # Database and storage
│   ├── schema.sql           # Database schema with RLS policies
│   ├── setup-universe-icons-storage.sql # Storage bucket setup
│   └── functions/           # Edge functions
│       ├── server/          # Server functions
│       └── universe-icon-proxy/
├── styles/                  # Global styles
├── assets/                  # Static assets
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── tailwind.config.js       # Tailwind configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 24.x** (specified in package.json engines)
- **Supabase account** and project setup
- **Modern web browser** with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Bubble-World.git
   cd Bubble-World
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Get these values from your Supabase dashboard:
   - Go to Project Settings > API
   - Copy Project URL and anon public key

4. **Set up database**
   - Navigate to your Supabase dashboard
   - Open SQL Editor and run `supabase/schema.sql`
   - Verify all tables and RLS policies are created
   - Run `supabase/setup-universe-icons-storage.sql` to set up image storage

5. **Start development**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating Your First World
1. **Sign Up**: Create an account with email verification
   - Enter your email, password, and name
   - Check your email for confirmation code
   - Confirm your account to activate it
2. **Create Universe**: Click "Create New World" on the dashboard
   - Enter world name and description
   - Optionally upload a custom icon
   - Set theme preferences (Light, Dark, Parchment)
3. **Configure Settings**: Set world name, description, and optional icon
4. **Add Categories**: Organize your world with custom categories (e.g., Characters, Locations, Events)

### Building Content
1. **Navigate to Editor**: Click on your world to open the editor
2. **Create Pages**: Add pages with titles and descriptions
   - Select a category or create a new one
   - Add pages using the sidebar
   - Drag and drop to reorder pages
3. **Add Subsections**: Create detailed content with rich text editing
   - Add subsections to pages
   - Use rich text editor for formatting (bold, italic, headings)
   - Auto-save ensures your work is never lost
4. **Establish Connections**: Link related pages and subsections
   - Use the connection mode in bubble map
   - Click on bubbles to create visual connections
5. **Upload Images**: Add cover images and universe icons
   - Upload images to Supabase storage
   - Images are automatically optimized and served via CDN

### Visual Exploration
1. **Open Map View**: Switch to the "Map" tab for visual representation
2. **Interact with Bubbles**: Drag to reorganize, click to explore
   - Pan and zoom the canvas
   - Drag bubbles to reposition them
   - Positions are saved automatically
3. **View Connections**: See relationships between world elements
   - Hierarchical connections (page to subsections)
   - Custom connections (page to page, subsection to subsection)
4. **Search Content**: Use search to highlight relevant bubbles
   - Filter by title or content
   - Non-matching bubbles are dimmed

## 🎨 Design System

### Component Architecture
- **Accessible Components**: Built on Radix UI primitives
- **Consistent Styling**: Tailwind CSS with design tokens
- **Theme Support**: CSS custom properties for theming
- **Responsive Design**: Mobile-first approach with breakpoints

### Color Palette
- **Primary**: `#214059` (Deep Navy)
- **Secondary**: `#395771` (Steel Blue)
- **Accent**: `#d1e1fa` (Light Blue)
- **Neutral**: `#44474c` (Dark Gray)
- **Background**: `#f8f9fa` (Light Gray)

### Typography
- **Headings**: System fonts with proper fallbacks
- **Body**: Optimized for readability
- **Code**: Monospace fonts for technical content

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

### Development Environment
- **Hot Reload**: Instant feedback during development
- **TypeScript**: Strict mode with comprehensive type checking
- **Build Optimization**: Automatic code splitting and tree shaking
- **Error Handling**: Comprehensive error boundaries and logging

### Code Standards
- **TypeScript**: Strict mode with no implicit any
- **Functional Components**: Modern React hooks exclusively
- **Performance**: Memoized components and optimized re-renders
- **Accessibility**: WCAG 2.1 AA compliance

## 🗄️ Database Schema

### Core Tables

**profiles**
```sql
- id: UUID (Primary Key, references auth.users)
- full_name: TEXT
- avatar_url: TEXT
- updated_at: TIMESTAMP
```
Stores user profile information with automatic creation on signup.

**universes**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key, references auth.users)
- name: TEXT (NOT NULL)
- description: TEXT
- icon: TEXT (URL to Supabase Storage)
- settings: JSONB (theme, font, color preferences)
- categories: TEXT[] (custom category names)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
Represents a fictional world with hierarchical content and customizable settings.

**pages**
```sql
- id: UUID (Primary Key)
- universe_id: UUID (Foreign Key, references universes)
- title: TEXT (NOT NULL)
- description: TEXT
- cover_image: TEXT (URL to Supabase Storage)
- category: TEXT (references universe categories)
- position: JSONB (x, y coordinates for bubble map)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
Top-level content items within a universe, organized by category.

**subsections**
```sql
- id: UUID (Primary Key)
- page_id: UUID (Foreign Key, references pages)
- title: TEXT (NOT NULL)
- content: TEXT (rich HTML content)
- position: JSONB (x, y coordinates for bubble map)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
Detailed content sections within pages with rich text editing.

**connections**
```sql
- id: UUID (Primary Key)
- universe_id: UUID (Foreign Key, references universes)
- source_type: TEXT ('page' | 'subsection')
- source_id: UUID
- target_type: TEXT ('page' | 'subsection')
- target_id: UUID
```
Relationships between pages and subsections for visual mapping.

### Row Level Security (RLS)
All tables have RLS policies ensuring:
- Users can only access their own data
- Public read access is disabled for security
- Cascade delete on foreign key relationships
- Automatic profile creation on user signup

## 🔍 Feature Deep Dive

### Authentication System
**How it works:**
- Uses Supabase Auth with JWT-based authentication
- Email confirmation required for new accounts
- Password reset flow with secure tokens
- Session management with automatic token refresh
- Protected routes redirect unauthenticated users to login

**Implementation:**
- `services/auth.ts` - Authentication service layer
- `utils/AuthContext.tsx` - React context for auth state
- `components/Login.tsx` - Login/Register/Forgot Password UI
- Supabase automatically handles session management

### Universe Management
**How it works:**
- Users can create multiple fictional universes
- Each universe has customizable settings (theme, font, color)
- Custom icons can be uploaded via Supabase Storage
- Categories organize pages within universes
- Drag-and-drop reordering on the dashboard

**Implementation:**
- `hooks/useUniverseOperations.ts` - Universe CRUD operations
- `utils/database.ts` - Database operations with type-safe transforms
- `components/WorldsList.tsx` - Dashboard with drag-reorder
- React DnD for drag-and-drop functionality

### Page & Subsection Management
**How it works:**
- Pages are top-level content items within universes
- Subsections provide detailed content within pages
- Rich text editor supports formatting (bold, italic, headings)
- Auto-save with 500ms debounce prevents data loss
- Categories organize pages in the sidebar

**Implementation:**
- `hooks/usePageOperations.ts` - Page CRUD operations
- `hooks/useSubsectionOperations.ts` - Subsection CRUD operations
- `components/editor/` - Editor component suite
- `components/RichTextEditor.tsx` - Rich text editor with execCommand

### Bubble Map Visualization
**How it works:**
- Interactive canvas with pan and zoom
- Pages displayed in a circular layout
- Subsections displayed in rings around parent pages
- Hierarchical and custom connections visualized
- Drag bubbles to reposition (positions saved)
- Search highlights matching bubbles

**Implementation:**
- `hooks/useBubbleMap.ts` - Bubble map state and logic
- `components/bubblemap/` - Bubble map component suite
- Canvas-based rendering with SVG for connections
- Physics-based layout algorithm

### Category System
**How it works:**
- Custom categories organize pages (e.g., Characters, Locations)
- Categories can be added, renamed, and deleted
- Pages can be moved between categories via drag-and-drop
- Deleting a category offers option to delete or keep pages
- Categories are stored as arrays in the universe record

**Implementation:**
- `hooks/useCategoryOperations.ts` - Category management
- `components/editor/CategoryDropZone.tsx` - Category drop zone
- React DnD for category-based page reordering

### Reorder System
**How it works:**
- Shared reorder utilities for consistent behavior
- Universes can be reordered on the dashboard
- Pages can be reordered within categories
- Subsections can be reordered within pages
- Reorder operations update database immediately

**Implementation:**
- `utils/reorder.ts` - Shared reorder utilities
- `hooks/useDragAndDrop.ts` - Drag-and-drop coordination
- Type-safe reorder functions for all entity types

### Image Upload System
**How it works:**
- Universe icons uploaded to Supabase Storage bucket
- Bucket configured with RLS policies for user isolation
- Images served via Supabase CDN
- Fallback to local blob URL if server unreachable
- Public read access for icons (configured in storage policies)

**Implementation:**
- `supabase/setup-universe-icons-storage.sql` - Storage bucket setup
- Edge function for image upload proxy
- `components/figma/ImageWithFallback.tsx` - Image component with fallback

### Theme System
**How it works:**
- Three themes: Light (default), Dark, Parchment
- Theme preference stored in universe settings
- CSS custom properties for theme colors
- Smooth transitions between themes
- Theme affects editor background and text colors

**Implementation:**
- `contexts/ThemeContext.tsx` - Theme state management
- Tailwind CSS with custom theme classes
- CSS custom properties for dynamic theming

### Offline Resilience
**How it works:**
- localStorage fallback for offline access
- Change detection prevents unnecessary writes
- Data synced to Supabase when connection restored
- Optimistic updates for responsive UI
- Conflict resolution with server as source of truth

**Implementation:**
- `utils/storage.ts` - Local storage utilities
- `contexts/UniverseDataContext.tsx` - Data syncing logic
- Change detection before localStorage writes

## 🛠️ Implementation Guide from Scratch

### Step 1: Set Up Supabase Project
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API
3. Copy your Project URL and anon public key
4. Enable email confirmation in Authentication settings
5. Enable password reset in Authentication settings

### Step 2: Configure Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Run `supabase/schema.sql` to create all tables
3. Verify tables: profiles, universes, pages, subsections, connections
4. Run `supabase/setup-universe-icons-storage.sql` to set up image storage
5. Verify storage bucket `universe-icons` is created with RLS policies

### Step 3: Clone and Configure Project
```bash
# Clone the repository
git clone https://github.com/your-username/Bubble-World.git
cd Bubble-World

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Step 5: Test Authentication Flow
1. Navigate to `http://localhost:5173/login`
2. Click "Create an account"
3. Enter email, password, and name
4. Check your email for confirmation code
5. Enter confirmation code to activate account
6. Verify you're redirected to the worlds dashboard

### Step 6: Create Your First Universe
1. Click "Create New World" on the dashboard
2. Enter world name (e.g., "Middle Earth")
3. Enter description
4. Optionally upload an icon
5. Click create
6. Verify universe appears on dashboard

### Step 7: Build Content
1. Click on your universe to enter the editor
2. Create a category (e.g., "Characters")
3. Add a page to the category
4. Add subsections to the page
5. Use rich text editor to add content
6. Test auto-save (wait 500ms after typing)
7. Switch to Map view to visualize connections

### Step 8: Test Bubble Map
1. Click "Map" tab in the editor
2. Verify pages and subsections are displayed as bubbles
3. Drag bubbles to reposition them
4. Test pan and zoom with mouse wheel
5. Use search to filter bubbles
6. Create connections between elements

### Step 9: Test Category Management
1. Add a new category in the sidebar
2. Rename an existing category
3. Drag pages between categories
4. Delete a category (choose to keep or delete pages)
5. Verify all operations persist

### Step 10: Test Theme System
1. Open universe settings
2. Switch between Light, Dark, and Parchment themes
3. Verify theme applies to editor and map
4. Reload page to verify theme persistence

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build
npm run build:analyze # Build with bundle analysis
```

### Development Environment
- **Hot Reload**: Instant feedback during development with Vite
- **TypeScript**: Strict mode with comprehensive type checking
- **Build Optimization**: Automatic code splitting and tree shaking
- **Error Handling**: Comprehensive error boundaries and logging

### Code Standards
- **TypeScript**: Strict mode with no implicit any types
- **Functional Components**: Modern React hooks exclusively
- **Performance**: Memoized components and optimized re-renders
- **Accessibility**: WCAG 2.1 AA compliance
- **Modularization**: Extract logic to hooks and services
- **Type Safety**: All functions and components fully typed

### Adding New Features
1. **Create Type Definitions**: Define interfaces in `src/app/types.ts`
2. **Add Database Operations**: Add functions to `src/app/utils/database.ts`
3. **Create Service Layer**: Add business logic to `src/app/services/`
4. **Create Custom Hook**: Extract logic to `src/app/hooks/`
5. **Build Components**: Create UI components in `src/app/components/`
6. **Update Contexts**: Add operations to appropriate context
7. **Add Routes**: Update `src/app/routes.tsx` if needed
8. **Test Thoroughly**: Test all new functionality

### Modular Architecture Pattern
The application follows a modular architecture pattern:

```
Component → Custom Hook → Service → Database
```

- **Components**: Handle UI and user interaction
- **Custom Hooks**: Encapsulate reusable logic and state
- **Services**: Handle business logic and validation
- **Database**: Type-safe data operations

This separation ensures:
- Testable business logic
- Reusable hooks across components
- Clear separation of concerns
- Easy maintenance and scaling

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Quick Deploy with GitHub Integration
1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository
2. **Connect to Vercel**: 
   - Sign up/login to [Vercel](https://vercel.com)
   - Click "New Project" and connect your GitHub account
   - Select your Bubble-World repository
3. **Configure Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```
4. **Deploy**: Click "Deploy" - Vercel will automatically detect the Vite configuration
5. **Custom Domain** (Optional): Add your custom domain in Vercel dashboard

#### Manual Vercel CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

#### Environment Setup for Vercel
- **Production Variables**: Set in Vercel dashboard under Settings > Environment Variables
- **Supabase Production**: Ensure your Supabase project is in production mode
- **Custom Domain**: Configure in Vercel dashboard if needed

### Other Deployment Platforms

#### Production Build
```bash
npm run build
```
The optimized build will be in the `dist/` directory.

#### Alternative Platforms
- **Netlify**: Static hosting with drag-and-drop deployment
- **AWS S3 + CloudFront**: For custom infrastructure
- **Docker**: Container-based deployment

#### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed
- Ensure accessibility compliance
- Verify performance impact

### Code Review Process
- **TypeScript Compliance**: All type errors must be resolved
- **Performance Review**: Check for performance implications
- **Security Review**: Verify security best practices
- **Accessibility**: Ensure WCAG compliance
- **Documentation**: Update docs for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Supabase](https://supabase.com/)** - Backend as a Service platform
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev/)** - Beautiful icon library
- **[Motion](https://motion.dev/)** - Animation library for React
- **[React DnD](https://react-dnd.github.io/react-dnd/)** - Drag and drop for React

## 📞 Support & Community

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/your-username/Bubble-World/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/Bubble-World/discussions)
- **Documentation**: Check this README and `/docs` folder

### Bug Reports
When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed reproduction steps
- **Environment**: Browser, OS, and version information
- **Console Errors**: Any error messages from browser console

### Feature Requests
- **Use Case**: Describe the problem you're trying to solve
- **Proposed Solution**: How you envision the feature working
- **Alternatives**: Any alternative approaches considered
- **Priority**: Low/Medium/High priority assessment

---

Built with ❤️ for creative worldbuilders, storytellers, and imaginative minds everywhere.
