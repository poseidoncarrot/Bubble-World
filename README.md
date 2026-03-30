# Bubble World MVP

A worldbuilding organization application that combines structured content management with visual bubble mapping.

## Potential Future Ideas
- **Separation of User Database Storage**: Every user's sign-in should not be linked together
- **Connection of Worlds**: Different worlds can be connected together, like how ideas within them are connected

## 🎯 Features

### Core MVP Features
- **Trial-first approach**: 5-minute full access without signup
- **Rich text editing**: Tables, images, and formatting tools
- **Hierarchical navigation**: Tree-style sidebar for world organization
- **Bubble map visualization**: Interactive force-directed graph of world connections
- **Dual storage**: Local storage for trials, cloud storage for accounts
- **Auto-save**: Every 5 minutes to prevent data loss

### UI Features
- **Glass morphism design**: Modern, Apple-inspired interface
- **Desktop-only focus**: Optimized for desktop experience
- **Real-time sync status**: Visual indicators for save state
- **Responsive interactions**: Hover effects and smooth transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for cloud storage)

### Option 1: Automated Setup
```bash
# Clone the repository
git clone <repository-url>
cd bubble-world-app

# Run the setup script
./scripts/setup.sh
```

### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd bubble-world-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
cp .env.example .env.local

# Add your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
   - Enable authentication providers

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Rich Text**: Tiptap with ProseMirror
- **Visualization**: D3.js force-directed graphs
- **Backend**: Supabase (PostgreSQL)
- **Build Tool**: Vite

### Project Structure
```
bubble-world-app/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── editor/          # Rich text editor components
│   │   ├── bubble-map/      # D3.js visualization
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API and data services
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── supabase/
│   ├── migrations/          # Database migrations
│   ├── functions/           # Edge functions
│   └── seed.sql            # Sample data
└── docs/                   # Documentation
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts and authentication
- **worlds**: Worldbuilding projects
- **pages**: Hierarchical content pages
- **page_connections**: Relationships between pages
- **user_sessions**: Trial session tracking

## 🔐 Authentication

### Trial Flow
1. **Anonymous Session**: Generate unique session ID
2. **5-Minute Timer**: Full app access with countdown
3. **Exit Intent Detection**: Mouse leaving viewport triggers prompt
4. **Conversion Prompt**: "Save your work? Sign up or continue locally"
5. **Local Storage Fallback**: If no signup, save to localStorage

### Account Types
- **Trial Users**: Full functionality, data saved locally
- **Account Users**: Full functionality, data saved to cloud
- **No Paid Tier**: All features available to all users

## 📝 Usage Guide

### Creating Your First World

1. **Start Trial**: Click "Try for 5 minutes" on the login screen
2. **Create World**: Click "Create New World" on the dashboard
3. **Add Pages**: Use the sidebar to create hierarchical content
4. **Edit Content**: Use the rich text editor with formatting tools
5. **Visualize**: Switch to Map view to see bubble connections
6. **Save Work**: Sign up to save to cloud or continue locally

### Navigation
- **Dashboard**: List and manage worlds
- **Editor**: Create and edit content with rich text
- **Map**: Visual bubble map of world connections
- **Sidebar**: Hierarchical navigation tree

### Keyboard Shortcuts
- **Undo**: Ctrl+Z
- **Redo**: Ctrl+Shift+Z
- **Standard shortcuts**: Ctrl+C, Ctrl+V, Ctrl+X

## 🎨 Design System

### Color Palette
```css
--primary: #214059;           /* Deep blue */
--primary-container: #395771; /* Lighter blue */
--surface: #f8f9fa;            /* Light background */
--surface-container: #edeeef;  /* Card background */
--on-surface: #191c1d;         /* Text */
--outline: #75777d;            /* Borders */
```

### Typography
- **Headlines**: Manrope (bold, extra-bold)
- **Body**: Inter (regular, medium)
- **Labels**: Inter (semibold)

### UI Components
- **Glass Morphism**: Backdrop blur effects throughout
- **Floating Elements**: Toolbars and modals with shadows
- **Interactive Bubbles**: Hover effects and transitions
- **Status Bar**: Bottom sync indicators

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL migrations
3. Enable authentication providers
4. Configure CORS settings
5. Update environment variables

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy load heavy components
- **Virtual Scrolling**: For large page lists
- **Auto-save**: Every 5 minutes with debouncing
- **Memory Management**: Cleanup strategies for large datasets

### Metrics
- **Page Load Time**: < 2 seconds initial load
- **Search Response**: < 500ms for search queries
- **Auto-save Frequency**: Every 5 minutes
- **Memory Usage**: < 100MB for typical world

## 🚀 Deployment

### Production Deployment
1. **Build the application**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

3. **Configure Supabase**
   - Update CORS origins
   - Enable production auth providers
   - Set up custom domain

### Environment Setup
- **Frontend**: Vercel (recommended)
- **Backend**: Supabase (managed)
- **Domain**: Custom domain with SSL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend and authentication
- **Tiptap** - Rich text editing
- **D3.js** - Data visualization
- **Tailwind CSS** - Styling framework
- **Google Stitch** - Design inspiration

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](./docs/)
- Review the [FAQ](./docs/faq.md)

---

**Built with ❤️ for worldbuilders and storytellers**
