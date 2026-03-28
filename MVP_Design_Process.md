# Bubble World - MVP Design Document

## 🎯 MVP Core Features (Initial Proposal)

Based on the POC success, here are the core features I believe should be in the MVP:

### Essential Features
1. **User Authentication** - Simple email/password login
2. **World Creation** - Users can create multiple worlds
3. **Rich Text Editor** - Bold, italic, headers, lists, links
4. **Page Management** - Create, edit, delete pages within worlds
5. **Visual Bubble Map** - Interactive connections between pages
6. **Basic Search** - Find pages and content
7. **Export/Import** - Backup and share worlds

### Nice-to-Have (Possibly Post-MVP)
- Real-time collaboration
- Advanced formatting (tables, embeds)
- Template system
- Version history

---

## 🔄 Iterative Design Process

### Round 1: Initial MVP Plan

**Question for you:** Before I dive deep into technical details, what are your thoughts on this initial MVP scope? Are there any features you consider absolutely essential that I missed, or anything that seems unnecessary for the first version?

---

## 📊 Research Findings

### Data Storage Recommendation: **Supabase**
Based on research, **Supabase** is the clear choice for MVP:

**Why Supabase:**
- **Free Tier**: 2 projects, 500MB DB storage, 50K MAU, 1GB file storage
- **PostgreSQL**: Superior for graph-like worldbuilding data
- **Real-time**: Built-in WebSocket support for future collaboration
- **Auth**: Complete authentication system included
- **Pricing**: $0-25/month for Pro tier - very startup-friendly
- **Row Level Security**: Perfect for multi-user worlds

**Database Schema (Draft):**
```sql
-- Users
CREATE TABLE users (id uuid PRIMARY KEY, email text UNIQUE, created_at timestamp);

-- Worlds (users can have multiple worlds)
CREATE TABLE worlds (
  id uuid PRIMARY KEY, 
  user_id uuid REFERENCES users(id),
  title text,
  description text,
  created_at timestamp
);

-- Pages within worlds
CREATE TABLE pages (
  id uuid PRIMARY KEY,
  world_id uuid REFERENCES worlds(id),
  title text,
  content jsonb, -- Rich text editor output
  created_at timestamp,
  updated_at timestamp
);

-- Connections between pages
CREATE TABLE page_connections (
  id uuid PRIMARY KEY,
  source_page_id uuid REFERENCES pages(id),
  target_page_id uuid REFERENCES pages(id),
  connection_type text -- 'related', 'sub-section', etc.
);
```

### Rich Text Editor Recommendation: **Tiptap**
Research clearly shows **Tiptap** is the best choice:

**Why Tiptap:**
- **Most Popular**: ~1.2M weekly downloads (2026 leader)
- **ProseMirror-based**: Most powerful editing engine
- **Great Developer Experience**: Clean API, excellent TypeScript support
- **Extension Ecosystem**: 50+ official extensions
- **Collaboration Ready**: Tiptap Cloud for real-time editing
- **Used by**: Substack, Linear, GitLab, Vercel

**Extensions We'll Use:**
- `@tiptap/starter-kit` (basic formatting)
- `@tiptap/extension-link` (internal/external links)
- `@tiptap/extension-image` (worldbuilding images)
- `@tiptap/extension-table` (organized data)
- `@tiptap/extension-placeholder` (user guidance)

### Authentication Strategy: **Supabase Auth**
- **Email/Password**: Traditional signup
- **Social Login**: Google, GitHub (optional)
- **Magic Links**: Passwordless option
- **Row Level Security**: Automatic data protection

---

## 🤔 Questions for You

1. **Authentication Priority**: Should users be able to try the app without creating an account, or require signup immediately?

2. **World Scope**: Should users have one "world" per account, or be able to create multiple worlds?

3. **Collaboration**: Is real-time collaboration essential for MVP, or can we start with single-user and add collaboration later?

4. **Mobile vs Desktop**: Should we prioritize mobile web experience or focus on desktop first?

5. **Export Formats**: What export formats are most important? (Markdown, PDF, JSON, etc.)

---

## 📋 User Flow (Draft)

### Current Thinking:
1. **Landing Page** → Sign up/Login
2. **World Dashboard** → List of user's worlds
3. **World Editor** → Tabs view + Bubble map
4. **Page Editor** → Rich text editing
5. **Settings** → Account and world management

**Does this flow make sense, or would you structure it differently?**

---

## 🎨 Visual Design Analysis (Google Stitch)

The Google Stitch designs perfectly align with our Apple-inspired vision. Key insights:

### **Login Screen Design**
- **Glass morphism effect** with backdrop blur
- **Floating auth card** with subtle shadows
- **Social login options** (Apple, Google)
- **Minimalist branding** with "The Architect" title
- **Gradient backgrounds** with architectural imagery

### **Editor UI Design**
- **Fixed sidebar** with world navigation tree
- **Main content area** with rich text editing
- **Floating toolbar** with formatting options
- **Breadcrumbs** for navigation hierarchy
- **Status bar** with sync indicators

### **Bubble Map UI Design**
- **Infinite canvas** with grid background
- **Interactive nodes** with hover effects
- **Connection lines** between related topics
- **Layer switching** (high-level vs deep layer)
- **Zoom controls** and mini-map
- **Context tooltips** on node hover

### **Design System Extracted**
```css
/* Key Design Tokens */
--primary: #214059 (deep blue)
--primary-container: #395771 (lighter blue)
--surface: #f8f9fa (light background)
--surface-container: #edeeef (card background)
--on-surface: #191c1d (text)
--outline: #75777d (borders)
--border-radius: 1rem (rounded corners)
--backdrop-blur: 20px (glass effect)
```

---

## 🔄 Iterative Design Process

### Round 3: Design-Refined MVP Plan

Based on the Google Stitch designs, I'm updating our MVP with specific UI patterns:

#### **Confirmed UI Components:**
1. **Glass Morphism Design** - Backdrop blur effects throughout
2. **Fixed Sidebar Navigation** - Tree-style world navigation
3. **Floating Toolbar** - Context-sensitive formatting tools
4. **Infinite Canvas Bubble Map** - D3.js with zoom/pan
5. **Status Bar** - Sync status and recent items
6. **Contextual Tooltips** - Rich hover information

#### **Updated Technical Stack:**
- **Frontend**: React + TypeScript + Tailwind CSS
- **Design System**: Custom CSS variables matching Stitch designs
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Editor**: Tiptap with custom toolbar
- **Visualization**: D3.js force-directed graphs
- **Deployment**: Vercel + Supabase

---

## 🤔 Questions for You (Round 3 - ANSWERED)

The designs are gorgeous and give us clear direction. Your answers provide final clarity:

### **1. Authentication Flow: TRIAL-FIRST**
**Decision**: Allow 5-minute trial before signup prompt
- **Trial Experience**: Users can try full app functionality immediately
- **Timing**: 5-minute timer OR exit intent (whichever comes first)
- **Save Option**: Prompt to sign up to save work
- **Fallback**: If no signup, save to localStorage/cache
- **Implementation**: Supabase Auth + localStorage for trial data

### **2. World Scope: MULTI-WORLD READY, SINGLE-WORLD MVP**
**Decision**: Multiple worlds per account, but MVP limited to one world creation
- **Architecture**: Design for multiple worlds from start
- **MVP Limit**: Users can only create 1 world initially
- **Database**: Support for multiple worlds (user_id foreign key)
- **Post-MVP**: Enable multiple world creation

### **3. Collaboration: SINGLE-USER ONLY**
**Decision**: No real-time collaboration in MVP
- **Focus**: Single-user experience optimized
- **Post-MVP**: Add real-time collaboration with Supabase real-time

### **4. Export Formats: NOT PRIORITY**
**Decision**: Export functionality post-MVP
- **Focus**: Core worldbuilding features first
- **Post-MVP**: Add Markdown, PDF, JSON export

### **5. User Flow: CONFIRMED**
**Decision**: Current user flow (line 118) is approved

---

## 📋 User Flow (Finalized)

### **Confirmed Flow:**
1. **Landing Page** → **5-minute trial** (full app access) OR immediate login
2. **Trial Experience** → Full functionality with timer/exit intent tracking
3. **Signup Prompt** → "Save your work? Sign up or continue with local cache"
4. **World Dashboard** → List of worlds (1 world max in MVP)
5. **World Editor** → Hierarchical sidebar + main content + floating toolbar
6. **Page Creation** → Rich text editor with tables, images, links
7. **Bubble Map View** → Expandable main bubbles showing subsections
8. **Connection Management** → Visual linking + hierarchical relationships
9. **Data Persistence** → Supabase (if signed up) OR localStorage (trial)

---

## 🎯 MVP Scope Refinement (Final)

### **Must-Have (MVP - Desktop Only)**
- **5-minute trial experience** with full app access
- **Trial timer + exit intent** tracking
- **Email/password authentication** (no social login)
- **Local storage fallback** for trial users
- **Single world creation** (multi-world ready)
- Rich text editing (bold, italic, links, headers, lists, **tables, images**)
- **Hierarchical page navigation** (sidebar tree structure)
- Visual bubble map with **expandable bubbles**
- Basic search
- Floating toolbar with table/image support
- Status bar with sync status
- **Desktop-only experience**

### **Should-Have (If Time Allows)**
- Multiple worlds (enable creation limit)
- Export functionality
- Social login
- Keyboard shortcuts
- Advanced bubble map interactions

### **Won't-Have (Post-MVP)**
- Real-time collaboration
- Advanced formatting (embeds, special formatting)
- Version history
- Mobile responsiveness
- Offline support (beyond localStorage)
- Advanced search filters

**This focused scope is perfect for a 3-4 month desktop MVP timeline.**

---

## 🛠️ Implementation Plan

### **Phase 1: Foundation (Month 1)**
- Set up Supabase backend and auth
- Implement design system with Tailwind
- Create basic React components
- **Build trial experience with timer + exit intent**
- Build login/authentication flow

### **Phase 2: Core Editor (Month 2)**
- Implement Tiptap rich text editor with **tables and images**
- Create **hierarchical sidebar navigation**
- Build page CRUD operations with **parent-child relationships**
- Add floating toolbar with full formatting options
- **Implement localStorage fallback for trial users**

### **Phase 3: Bubble Map (Month 3)**
- Implement D3.js force-directed graph with **expandable bubbles**
- Add zoom/pan controls
- Create **expand/collapse interactions** for main bubbles
- Sync with hierarchical page data

### **Phase 4: Polish & Launch (Month 4)**
- Add search functionality
- Implement status bar
- **Desktop-only optimization** (no mobile responsive)
- **Trial-to-paid conversion flow**
- Testing and deployment

---

*This is a living document. I'll update it based on your feedback and continue refining MVP scope.*
