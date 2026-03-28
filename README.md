# 🫧 Bubble World

A modern worldbuilding application with trial-first access, rich text editing, and interactive bubble map visualization.

## 📁 Repository Structure

```
Bubble-World/
├── bubble-world-app/          # Complete React application
│   ├── src/                   # Source code
│   ├── supabase/              # Database migrations
│   ├── scripts/               # Setup utilities
│   └── README.md              # App-specific documentation
├── mockups/                   # UI design mockups
│   ├── login-screen.html
│   ├── editor-screen.html
│   └── bubble-map-screen.html
├── MVP_DESIGN_FINAL.md        # Complete MVP design specification
├── MVP_Design_Process.md      # Design process documentation
└── README.md                  # This file
```

## 🚀 Quick Start

The main application is in the `bubble-world-app/` directory.

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for cloud storage)

### Automated Setup
```bash
cd bubble-world-app
./scripts/setup.sh
```

### Manual Setup
See [bubble-world-app/README.md](./bubble-world-app/README.md) for detailed setup instructions.

## 📋 Design Documents

- **[MVP_DESIGN_FINAL.md](./MVP_DESIGN_FINAL.md)** - Complete MVP specification
- **[MVP_Design_Process.md](./MVP_Design_Process.md)** - Design process and decisions
- **[mockups/](./mockups/)** - HTML mockups of UI designs

## 🎯 Core Features

- **Trial-first access**: Start building immediately, no signup required
- **5-minute trial timer**: Experience the full app instantly
- **Rich text editor**: Full-featured editor with tables and images
- **Bubble map visualization**: Interactive D3.js force-directed graph
- **Hierarchical navigation**: Tree-style sidebar for pages
- **Search functionality**: Global search across all content
- **Glass morphism UI**: Modern, Apple-inspired design
- **Dual storage**: Local storage for trials, Supabase for accounts

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Rich Text**: Tiptap with ProseMirror
- **Visualization**: D3.js force-directed graphs
- **Backend**: Supabase (PostgreSQL)
- **Build**: Vite

## 📱 Implementation Status

✅ **Complete MVP Implementation** - All features implemented and ready for production

- ✅ Trial experience with timer and exit intent
- ✅ Rich text editor with full formatting
- ✅ Interactive bubble map visualization
- ✅ Global search functionality
- ✅ Hierarchical page navigation
- ✅ Glass morphism UI design
- ✅ Supabase integration
- ✅ Auto-save and data persistence
- ✅ TypeScript throughout
- ✅ Production deployment ready

## 🚀 Deployment

See [bubble-world-app/DEPLOYMENT.md](./bubble-world-app/DEPLOYMENT.md) for comprehensive deployment instructions.

## 📄 License

[Your License]

---

**🫧 Ready to start worldbuilding!**