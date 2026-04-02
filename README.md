# Bubble World

A creative worldbuilding application that allows users to create, organize, and explore fictional universes through interconnected pages, subsections, and visual bubble maps.

## 🌟 Features

- **World Creation**: Build rich fictional universes with custom settings, categories, and themes
- **Hierarchical Organization**: Structure your world with Universes > Pages > Subsections
- **Visual Mapping**: Explore connections between elements through interactive bubble maps
- **Rich Content Editor**: Create detailed content with rich text editing capabilities
- **Drag & Drop**: Intuitive bubble map manipulation with drag-and-drop functionality
- **Authentication**: Secure user authentication via Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Framework**: Material-UI (@mui/material) + Radix UI
- **Styling**: Tailwind CSS 4.1.12
- **Backend**: Supabase (authentication & database)
- **State Management**: React Hooks + Context API
- **Routing**: React Router v7
- **Drag & Drop**: react-dnd with HTML5Backend

### Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Editor.tsx       # Main editor component
│   │   ├── BubbleMap.tsx    # Visual bubble map
│   │   ├── WorldsList.tsx   # World listing
│   │   └── Login.tsx        # Authentication
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # Local storage helpers
│   │   ├── supabase.ts      # Supabase client
│   │   └── seedData.ts      # Sample data
│   ├── types.ts             # TypeScript type definitions
│   ├── routes.tsx           # Application routing
│   ├── App.tsx              # Root application component
│   └── Root.tsx             # Layout component
├── styles/                  # Global styles
└── imports/                 # Generated imports
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account and project

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Creating a World

1. Sign in with your account
2. Click "Create New World" on the main dashboard
3. Fill in world details (name, description, icon)
4. Configure world settings and categories

### Building Content

1. Navigate to your world's editor
2. Create pages with titles and descriptions
3. Add subsections with rich content
4. Establish connections between related elements

### Visual Mapping

1. Switch to the "Map" view for your world
2. Drag bubbles to reorganize the layout
3. Click connections to explore relationships
4. Use the map to discover new content connections

## 🎨 Design System

### UI Components

- **Material-UI**: Primary component library
- **Radix UI**: Accessible primitives
- **Lucide React**: Icon system
- **Tailwind CSS**: Utility-first styling

### Theme Customization

The application uses a customizable theme system. Modify the theme in:

```typescript
// src/app/utils/theme.ts
export const theme = createTheme({
  palette: {
    primary: {
      main: '#your-primary-color',
    },
    // ... other theme customizations
  },
});
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🗄️ Database Schema

### Core Tables

- **universes**: World containers with settings
- **pages**: Content pages within universes  
- **subsections**: Detailed content sections
- **connections**: Relationships between elements

### Data Model

```typescript
interface Universe {
  id: string;
  name: string;
  description: string;
  icon?: string;
  pages: Page[];
  settings?: UniverseSettings;
  categories?: string[];
}

interface Page {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  subsections: Subsection[];
  connections: string[];
  category?: string;
}

interface Subsection {
  id: string;
  title: string;
  content: string;
  connections: string[];
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

1. Set production environment variables
2. Configure Supabase for production
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend services
- [Material-UI](https://mui.com/) for the component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/Bubble-World/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Built with ❤️ for creative worldbuilders and storytellers.
