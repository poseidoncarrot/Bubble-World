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

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.3.1** with TypeScript for type safety and performance
- **Vite 6.3.5** for lightning-fast development and optimized builds
- **Tailwind CSS 4.1.12** for utility-first responsive styling
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent, beautiful iconography
- **Motion/Framer Motion** for smooth animations and transitions
- **React DnD** for intuitive drag-and-drop functionality

### Backend Infrastructure
- **Supabase** for authentication, PostgreSQL database, and file storage
- **Edge Functions** for server-side operations and image processing
- **Row Level Security** for granular data access control
- **Real-time Subscriptions** for live data synchronization

### Performance Optimizations
- **Code Splitting**: Automatic bundle optimization with manual chunks
- **Memoization**: Strategic use of React.memo, useMemo, and useCallback
- **Lazy Loading**: On-demand component loading for reduced initial bundle
- **Intelligent Caching**: Smart localStorage caching with change detection
- **Bundle Analysis**: Optimized vendor chunks for better caching

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI primitives (Radix-based)
│   │   ├── figma/           # Figma-specific components
│   │   ├── Editor.tsx       # Main rich text editor
│   │   ├── BubbleMap.tsx    # Interactive bubble visualization
│   │   ├── WorldsList.tsx   # World dashboard
│   │   ├── Login.tsx        # Authentication flow
│   │   └── DeleteConfirmModal.tsx # Confirmation dialogs
│   ├── utils/               # Utility functions and services
│   │   ├── database.ts       # Database operations
│   │   ├── supabase.ts      # Supabase client configuration
│   │   ├── AuthContext.tsx   # Authentication state management
│   │   ├── UniverseContext.tsx # Global universe state
│   │   └── storage.ts       # Local storage utilities
│   ├── services/            # API service layer
│   │   └── auth.ts          # Authentication service
│   ├── types.ts             # TypeScript type definitions
│   ├── routes.tsx           # Application routing configuration
│   ├── App.tsx              # Root application component
│   └── Root.tsx             # Layout and route protection
├── styles/                  # Global styles and Tailwind config
├── assets/                  # Static assets and images
├── supabase/              # Database schema and functions
│   ├── schema.sql           # Database structure
│   └── functions/          # Edge functions
└── imports/                # Generated imports
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** with npm, yarn, or pnpm
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

4. **Set up database**
   - Navigate to your Supabase dashboard
   - Open SQL Editor and run `supabase/schema.sql`
   - Verify all tables and RLS policies are created

5. **Start development**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating Your First World
1. **Sign Up**: Create an account with email verification
2. **Create Universe**: Click "Create New World" on the dashboard
3. **Configure Settings**: Set world name, description, and optional icon
4. **Add Categories**: Organize your world with custom categories

### Building Content
1. **Navigate to Editor**: Click on your world to open the editor
2. **Create Pages**: Add pages with titles and descriptions
3. **Add Subsections**: Create detailed content with rich text editing
4. **Establish Connections**: Link related pages and subsections
5. **Upload Images**: Add cover images and universe icons

### Visual Exploration
1. **Open Map View**: Switch to the "Map" tab for visual representation
2. **Interact with Bubbles**: Drag to reorganize, click to explore
3. **View Connections**: See relationships between world elements
4. **Search Content**: Use search to highlight relevant bubbles

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
```sql
universes {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key)
  name: TEXT
  description: TEXT
  icon: TEXT
  settings: JSONB
  categories: TEXT[]
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

pages {
  id: UUID (Primary Key)
  universe_id: UUID (Foreign Key)
  title: TEXT
  description: TEXT
  cover_image: TEXT
  category: TEXT
  position: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

subsections {
  id: UUID (Primary Key)
  page_id: UUID (Foreign Key)
  title: TEXT
  content: TEXT
  position: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

connections {
  id: UUID (Primary Key)
  universe_id: UUID (Foreign Key)
  source_type: TEXT
  source_id: UUID
  target_type: TEXT
  target_id: UUID
}
```

### TypeScript Interfaces
```typescript
interface Universe {
  id: string;
  name: string;
  description: string;
  icon?: string;
  settings?: UniverseSettings;
  categories?: string[];
  pages: Page[];
  created_at: Date;
  updated_at: Date;
}

interface Page {
  id: string;
  universe_id: string;
  title: string;
  description: string;
  coverImage?: string;
  category?: string;
  position?: { x?: number; y?: number };
  subsections: Subsection[];
  connections: string[];
  created_at: Date;
  updated_at: Date;
}

interface Subsection {
  id: string;
  page_id: string;
  title: string;
  content: string;
  position?: { x?: number; y?: number };
  created_at: Date;
  updated_at: Date;
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```
The optimized build will be in the `dist/` directory.

### Environment Setup
1. **Production Variables**: Set production environment variables
2. **Supabase Production**: Configure Supabase for production use
3. **Deploy**: Upload to your preferred hosting platform

### Deployment Platforms
- **Vercel**: Recommended for seamless integration
- **Netlify**: Alternative static hosting
- **AWS S3 + CloudFront**: For custom infrastructure
- **Docker**: Container-based deployment

### Docker Configuration
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
