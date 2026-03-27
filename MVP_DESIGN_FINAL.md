# Bubble World - MVP Technical Design Document

## 🎯 Executive Summary

Bubble World is a worldbuilding organization application that combines structured content management with visual bubble mapping. This document outlines the technical specifications for the Minimum Viable Product (MVP) focused on desktop users.

**Key Innovation**: Trial-first approach with 5-minute full access, then conversion prompt to save work.

---

## 🏗️ Technical Architecture

### **Technology Stack**

#### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components based on Google Stitch designs
- **Rich Text Editor**: Tiptap with ProseMirror
- **Visualization**: D3.js force-directed graphs
- **State Management**: React Context + useReducer
- **Build Tool**: Vite

#### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (post-MVP)
- **API**: Supabase auto-generated REST APIs

#### Deployment
- **Frontend**: Vercel
- **Backend**: Supabase (managed)
- **Domain**: Custom domain with SSL

---

## 🎨 UI Design Mockups

### **Login Screen Design**
📁 **Live Mockup**: [View Login Screen](./mockups/login-screen.html)

**Key Features:**
- **Glass morphism effect** with backdrop blur and subtle shadows
- **Floating auth card** with email/password fields
- **Minimalist branding** with "The Architect" title
- **Gradient background** with architectural imagery
- **Social login options** (Apple, Google) - disabled for MVP
- **Trial-first approach** - users can try immediately

**Implementation Notes:**
- Uses Tailwind CSS with custom design tokens
- Backdrop blur: `backdrop-filter: blur(20px)`
- Responsive design with max-width container
- Form validation and error states

---

### **Editor Screen Design**
📁 **Live Mockup**: [View Editor Screen](./mockups/editor-screen.html)

**Key Features:**
- **Fixed sidebar navigation** with hierarchical tree structure
- **Main content area** with rich text editing capabilities
- **Floating toolbar** with formatting options (bold, italic, lists, links, tables, images)
- **Breadcrumbs** for navigation hierarchy
- **Hero image section** with change cover functionality
- **Status bar** with sync indicators and recent items

**Component Breakdown:**
- **Sidebar**: World navigation with expandable sections
- **Header**: App title and navigation toggle
- **Editor**: Tiptap rich text editor with custom toolbar
- **Footer**: Status bar with sync state and recent pages

---

### **Bubble Map Screen Design**
📁 **Live Mockup**: [View Bubble Map Screen](./mockups/bubble-map-screen.html)

**Key Features:**
- **Infinite canvas** with grid background pattern
- **Interactive bubble nodes** with hover effects and images
- **Connection lines** between related topics
- **Layer switching** (high-level vs deep layer)
- **Zoom controls** and mini-map for navigation
- **Context tooltips** on node hover with detailed information
- **Sidebar navigation** for world sections

**Interactive Elements:**
- **Main bubbles**: Expand to show subsections (History, Flora, etc.)
- **Sub-bubbles**: Appear on hover with smooth transitions
- **Connection lines**: Dashed lines showing relationships
- **Zoom controls**: + / - buttons and reset view
- **Layer toggle**: Switch between high-level and deep layer views

---

## 🎨 Design System

### **Color Palette (Extracted from Google Stitch)**
```css
:root {
  --primary: #214059;           /* Deep blue */
  --primary-container: #395771; /* Lighter blue */
  --surface: #f8f9fa;            /* Light background */
  --surface-container: #edeeef;  /* Card background */
  --on-surface: #191c1d;         /* Text */
  --outline: #75777d;            /* Borders */
  --border-radius: 1rem;         /* Rounded corners */
  --backdrop-blur: 20px;         /* Glass effect */
}
```

### **UI Components**
- **Glass Morphism**: Backdrop blur effects throughout
- **Floating Elements**: Toolbars and modals with shadows
- **Hierarchical Navigation**: Tree-style sidebar
- **Interactive Bubbles**: Hover effects and transitions
- **Status Bar**: Bottom sync indicators

---

## 📊 Database Schema

### **Core Tables**

```sql
-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Worlds (multi-world ready, single-world MVP)
CREATE TABLE worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  settings jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Pages with hierarchical structure
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  parent_page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb NOT NULL, -- Tiptap JSON output
  metadata jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Page connections for bubble map
CREATE TABLE page_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  target_page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  connection_type text DEFAULT 'related',
  strength integer DEFAULT 1,
  created_at timestamp DEFAULT now()
);

-- User sessions for trial tracking
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  trial_started_at timestamp DEFAULT now(),
  trial_expires_at timestamp DEFAULT (now() + interval '5 minutes'),
  is_premium boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

### **Indexes**
```sql
CREATE INDEX idx_pages_world_id ON pages(world_id);
CREATE INDEX idx_pages_parent_id ON pages(parent_page_id);
CREATE INDEX idx_connections_source ON page_connections(source_page_id);
CREATE INDEX idx_connections_target ON page_connections(target_page_id);
CREATE INDEX idx_sessions_session_id ON user_sessions(session_id);
```

---

## 🔐 Authentication & Trial System

### **Trial Flow**
1. **Anonymous Session**: Generate unique session ID
2. **5-Minute Timer**: Full app access with countdown
3. **Exit Intent Detection**: Mouse leaving viewport triggers prompt
4. **Conversion Prompt**: Small centered UI modal asking to sign up or continue locally
5. **Local Storage Fallback**: If no signup, save all changes to browser cache

### **Trial-to-Paid Migration**
- **If user leaves before 5 minutes**: All edits are automatically saved to localStorage
- **If user doesn't sign up**: Continue with local storage, all data preserved in browser
- **Signup prompt UI**: Centered modal with options to "Create Account" or "Sign In" to save work

### **Conflict Resolution**
- **Same email signup**: Alert user that account exists, offer "Go to Login" or "Use Different Email"

### **Implementation Details**
```typescript
// Trial Manager
class TrialManager {
  private sessionId: string;
  private trialExpiry: Date;
  private timer: NodeJS.Timeout;
  
  startTrial() {
    this.sessionId = generateUUID();
    this.trialExpiry = new Date(Date.now() + 5 * 60 * 1000);
    this.startTimer();
    this.setupExitIntent();
  }
  
  private startTimer() {
    this.timer = setInterval(() => {
      if (Date.now() >= this.trialExpiry.getTime()) {
        this.showSignupPrompt();
      }
    }, 1000);
  }
  
  private setupExitIntent() {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) {
        this.showSignupPrompt();
      }
    });
  }
}
```

---

## 📝 Rich Text Editor

### **Tiptap Configuration**
```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const editor = useEditor({
  extensions: [
    StarterKit,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Image.configure({
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'editor-link',
      },
    }),
  ],
  content: '',
  onUpdate: ({ editor }) => {
    const json = editor.getJSON();
    // Save to database or localStorage
  },
});
```

### **Floating Toolbar**
```typescript
const Toolbar = () => (
  <div className="floating-toolbar">
    <button onClick={() => editor?.chain().focus().toggleBold().run()}>
      <FormatBold />
    </button>
    <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
      <FormatItalic />
    </button>
    <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
      <FormatH2 />
    </button>
    <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>
      <FormatListBulleted />
    </button>
    <button onClick={() => insertTable()}>
      <TableChart />
    </button>
    <button onClick={() => insertImage()}>
      <Image />
    </button>
    <button onClick={() => insertLink()}>
      <Link />
    </button>
  </div>
);
```

---

## 🫧 Bubble Map Visualization

### **D3.js Force-Directed Graph**
```typescript
interface BubbleNode {
  id: string;
  title: string;
  type: 'main' | 'subsection';
  parentId?: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface BubbleLink {
  source: string | BubbleNode;
  target: string | BubbleNode;
  strength: number;
}

class BubbleMap {
  private simulation: d3.Simulation<BubbleNode, BubbleLink>;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  
  constructor(container: HTMLElement, data: { nodes: BubbleNode[], links: BubbleLink[] }) {
    this.setupSVG(container);
    this.setupSimulation(data);
    this.renderNodes();
    this.renderLinks();
  }
  
  private setupSimulation(data: { nodes: BubbleNode[], links: BubbleLink[] }) {
    this.simulation = d3.forceSimulation<BubbleNode>(data.nodes)
      .force('link', d3.forceLink<BubbleNode, BubbleLink>(data.links)
        .id(d => d.id)
        .distance(d => d.type === 'main' ? 150 : 80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(400, 300))
      .force('collision', d3.forceCollide().radius(d => d.type === 'main' ? 40 : 25));
  }
  
  private renderNodes() {
    const nodes = this.svg.selectAll('.node')
      .data(this.simulation.nodes())
      .enter().append('g')
      .attr('class', 'node')
      .call(this.drag());
    
    nodes.append('circle')
      .attr('r', d => d.type === 'main' ? 35 : 20)
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    nodes.append('text')
      .text(d => d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .attr('font-size', d => d.type === 'main' ? '12px' : '10px');
    
    nodes.on('click', (event, d) => this.handleNodeClick(d));
  }
  
  private handleNodeClick(node: BubbleNode) {
    if (node.type === 'main') {
      this.toggleSubsections(node.id);
    } else {
      // Navigate to page
      window.location.hash = `page/${node.id}`;
    }
  }
  
  private toggleSubsections(parentId: string) {
    // Expand/collapse subsections
    const subsections = this.simulation.nodes().filter(n => n.parentId === parentId);
    subsections.forEach(sub => {
      sub.fx = sub.fx ? null : sub.x;
      sub.fy = sub.fy ? null : sub.y;
    });
    this.simulation.alpha(0.3).restart();
  }
}
```

---

## 🗂️ Hierarchical Navigation

### **Sidebar Tree Component**
```typescript
interface PageNode {
  id: string;
  title: string;
  children: PageNode[];
  level: number;
}

const SidebarTree: React.FC<{ pages: PageNode[] }> = ({ pages }) => {
  const renderNode = (node: PageNode, level: number = 0) => (
    <div key={node.id} className="tree-node" style={{ marginLeft: `${level * 16}px` }}>
      <div className="node-content">
        <span className="node-icon">
          {node.children.length > 0 ? '📁' : '📄'}
        </span>
        <span className="node-title">{node.title}</span>
      </div>
      {node.children.map(child => renderNode(child, level + 1))}
    </div>
  );
  
  return (
    <div className="sidebar-tree">
      {pages.map(page => renderNode(page))}
    </div>
  );
};
```

---

## 💾 Data Persistence

### **Dual Storage Strategy**
- **Trial users**: All data saved to localStorage automatically
- **Signed-in users**: Data saved to Supabase cloud database
- **Auto-save frequency**: Every 5 minutes for all users
- **Sync status**: "Sync: Ready" means last save was successful
```typescript
class DataManager {
  private isTrial: boolean;
  private sessionId: string;
  
  constructor(isTrial: boolean, sessionId?: string) {
    this.isTrial = isTrial;
    this.sessionId = sessionId || generateUUID();
  }
  
  async savePage(page: PageData): Promise<void> {
    if (this.isTrial) {
      this.saveToLocalStorage(page);
    } else {
      await this.saveToSupabase(page);
    }
  }
  
  private saveToLocalStorage(page: PageData): void {
    const key = `bubble-world-${this.sessionId}-page-${page.id}`;
    localStorage.setItem(key, JSON.stringify(page));
  }
  
  private async saveToSupabase(page: PageData): Promise<void> {
    const { data, error } = await supabase
      .from('pages')
      .upsert({
        id: page.id,
        world_id: page.worldId,
        parent_page_id: page.parentPageId,
        title: page.title,
        content: page.content,
        metadata: page.metadata,
      });
    
    if (error) throw error;
  }
  
  async loadPage(pageId: string): Promise<PageData | null> {
    if (this.isTrial) {
      return this.loadFromLocalStorage(pageId);
    } else {
      return await this.loadFromSupabase(pageId);
    }
  }
}
```

---

## 🔍 Search Implementation

### **Full-Text Search**
```typescript
class SearchManager {
  private pages: PageData[] = [];
  
  async indexPages(pages: PageData[]): Promise<void> {
    this.pages = pages;
  }
  
  search(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    this.pages.forEach(page => {
      const titleMatch = page.title.toLowerCase().includes(query.toLowerCase());
      const contentMatch = this.searchContent(page.content, query);
      
      if (titleMatch || contentMatch.length > 0) {
        results.push({
          page,
          matches: contentMatch,
          score: this.calculateScore(titleMatch, contentMatch),
        });
      }
    });
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  private searchContent(content: any, query: string): ContentMatch[] {
    const matches: ContentMatch[] = [];
    const text = this.extractTextFromContent(content);
    const regex = new RegExp(query, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
        context: this.getContext(text, match.index, 50),
      });
    }
    
    return matches;
  }
}
```

---

## 🚀 Performance Optimizations

### **Code Splitting**
```typescript
// Lazy load heavy components
const BubbleMap = lazy(() => import('./components/BubbleMap'));
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

// Route-based splitting
const routes = [
  {
    path: '/',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/world/:id',
    component: lazy(() => import('./pages/WorldEditor')),
  },
];
```

### **Virtual Scrolling**
```typescript
// For large page lists
import { FixedSizeList as List } from 'react-window';

const PageList: React.FC<{ pages: PageData[] }> = ({ pages }) => (
  <List
    height={600}
    itemCount={pages.length}
    itemSize={40}
    itemData={pages}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <PageItem page={data[index]} />
      </div>
    )}
  </List>
);
```

---

## 📱 Responsive Strategy (Desktop-Only MVP)

### **Viewport Constraints**
```css
/* Desktop-only styles */
@media (max-width: 1024px) {
  .app-container {
    transform: scale(0.8);
    transform-origin: top left;
  }
}

@media (max-width: 768px) {
  .app-container {
    transform: scale(0.6);
  }
}

/* Hide mobile-specific elements */
.mobile-only {
  display: none !important;
}
```

---

## 🔧 Development Workflow

### **Environment Setup**
```bash
# Frontend
npm create vite@latest bubble-world -- --template react-ts
cd bubble-world
npm install @supabase/supabase-js @tiptap/react @tiptap/starter-kit @tiptap/extension-table @tiptap/extension-image @tiptap/extension-link d3 react-window

# Supabase
npx supabase init
npx supabase start
```

### **Project Structure**
```
bubble-world/
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

---

## � Business Logic

### **World Management**
- **World creation**: No minimum required information
- **Empty world cleanup**: Worlds with no content are deleted when user leaves page
- **User permissions**: No difference between account types - only determines cloud vs local storage
- **Content rules**: To be defined later, no restrictions in MVP

### **User Account Types**
- **Trial users**: Full functionality, data saved locally
- **Account users**: Full functionality, data saved to cloud
- **No paid tier**: All features available to all users

---

## 🎯 UI/UX Interactions

### **Editor Shortcuts**
- **Undo**: Ctrl+Z
- **Redo**: Ctrl+Shift+Z
- **Standard text editing shortcuts**: Ctrl+C, Ctrl+V, Ctrl+X, etc.

---

## 📈 Success Metrics
- **Trial Conversion Rate**: % of trial users who sign up
- **Time to First World**: Average time to create first world
- **Page Creation Rate**: Average pages created per user
- **Bubble Map Usage**: % of users using bubble map feature
- **Session Duration**: Average time spent in app

### **Technical Metrics**
- **Page Load Time**: < 2 seconds initial load
- **Search Response**: < 500ms for search queries
- **Auto-save Frequency**: Every 5 minutes
- **Memory Usage**: < 100MB for typical world

---

## 🚀 Launch Plan

### **Phase 1: Foundation (Month 1)**
- Supabase setup and database schema
- React app structure and design system
- Trial system implementation
- Basic authentication flow

### **Phase 2: Core Features (Month 2)**
- Rich text editor with tables/images
- Hierarchical navigation
- Page CRUD operations
- Local storage fallback

### **Phase 3: Visualization (Month 3)**
- D3.js bubble map implementation
- Expandable bubble interactions
- Connection visualization
- Search functionality

### **Phase 4: Polish & Launch (Month 4)**
- Performance optimization
- Trial-to-paid conversion flow
- Testing and bug fixes
- Production deployment

---

## 🔄 Post-MVP Roadmap

### **Version 2.0**
- Multiple worlds per user
- Real-time collaboration
- Mobile responsiveness
- Export functionality

### **Version 3.0**
- Advanced search filters
- Version history
- Template system
- Social features

---

## 📋 Conclusion

This MVP design provides a solid foundation for Bubble World with a clear path to market. The trial-first approach maximizes user acquisition while the technical architecture ensures scalability. The focus on desktop users allows for rapid development while maintaining high-quality user experience.

**Next Steps**: Begin Phase 1 development with Supabase setup and React application structure.

---

*Document Version: 1.0*
*Last Updated: March 2026*
*Author: Bubble World Development Team*
