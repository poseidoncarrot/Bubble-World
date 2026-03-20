# Bubble World - Worldbuilding Organization App

A proof-of-concept worldbuilding organization application that combines the structured content management of Notion with visual bubble mapping, featuring an Apple-inspired user interface.

## 🌟 Core Features

### 1. **Dual-View Interface**
- **Tabs View**: Traditional page-based content organization similar to Notion
- **Bubble Map View**: Visual representation of how topics and subtopics connect

### 2. **Apple-Inspired Design**
- Modern, rounded corners and smooth animations
- Clean typography using system fonts
- Light/dark mode support
- Intuitive navigation patterns

### 3. **Worldbuilding Features**
- Create and organize worldbuilding topics (Kingdoms, Magic Systems, Characters, etc.)
- Link pages together to show relationships
- Subsection support for detailed organization
- Visual bubble connections showing topic relationships

### 4. **Interactive Bubble Map**
- **Main Layer**: Shows connections between major topics
- **Subsection Layer**: Deeper view showing how subsections connect across topics
- Zoom and pan functionality
- Click bubbles to navigate to pages

## 🚀 How It Works

### Technical Implementation

#### Frontend Architecture
- **Vanilla JavaScript**: No framework dependencies for maximum compatibility
- **D3.js**: Force-directed graph visualization for bubble maps
- **CSS Variables**: Consistent theming and Apple-inspired design system
- **Responsive Design**: Works on desktop and mobile devices

#### Data Structure
```javascript
{
  id: 'unique-page-id',
  title: 'Page Title',
  content: 'Markdown-style content',
  connections: ['connected-page-id-1', 'connected-page-id-2'],
  subsections: [
    {
      id: 'subsection-id',
      title: 'Subsection Title',
      connections: ['target-subsection-id']
    }
  ]
}
```

#### Bubble Map Visualization
- **Force-Directed Graph**: Uses D3.js force simulation for natural bubble positioning
- **Collision Detection**: Prevents bubbles from overlapping
- **Interactive Elements**: Draggable nodes, zoom controls, click navigation
- **Color Coding**: Each main topic has a unique color for easy identification

### Sample Worldbuilding Data

The app includes a complete fantasy world example with:

- **Kingdoms & Empires**: Azure Empire, Iron Confederacy, Forest Realm
- **Magic Systems**: Elemental Magic, Rune Magic, Blood Magic
- **Key Characters**: Empress Lyra, Master Theron, Elara Swiftwind
- **Geography**: Azure Plains, Iron Mountains, Whispering Woods
- **History**: Timeline with major events and periods

## 🛠️ Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Quick Start
1. **Download/Clone** the repository
2. **Open** `index.html` in your web browser
3. **Start** building your world!

### Development Setup
For local development with live reload:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if available)
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📱 Usage Guide

### Creating Pages
1. Click the **"+ Add Page"** button in the sidebar
2. Enter a title and content
3. Select connected pages from the checklist
4. Click **"Save Page"**

### Navigating Between Views
- Use the **toggle buttons** in the header to switch between Tabs and Bubble Map views
- In Bubble Map view, use **layer controls** to switch between main topics and subsections

### Bubble Map Interaction
- **Click bubbles** to navigate to that page
- **Drag bubbles** to reorganize the layout
- **Use zoom controls** to explore large worlds
- **Switch layers** to see different levels of detail

### Editing Content
- Click any page in the sidebar to load it
- Edit the title directly in the page header
- Edit content in the main text area
- Changes are saved automatically

## 🎯 Proof of Concept Success

This implementation successfully demonstrates:

✅ **Technical Feasibility**
- Bubble map visualization with D3.js force simulation
- Real-time updates when pages are modified
- Smooth transitions between different visualization layers

✅ **UI/UX Design**
- Apple-inspired interface with modern aesthetics
- Intuitive navigation and interaction patterns
- Responsive design for different screen sizes

✅ **Core Functionality**
- Page creation and editing
- Visual linking system
- Two-layer bubble map visualization
- Connection management between topics and subsections

✅ **Data Management**
- Graph-based data structure
- Efficient relationship tracking
- Scalable for larger worldbuilding projects

## 🔧 Technical Architecture

### File Structure
```
Bubble-World/
├── index.html          # Main application entry point
├── styles.css          # Apple-inspired styling and design system
├── app.js             # Core application logic and D3.js visualization
└── README.md          # This documentation
```

### Key Components

#### BubbleWorldApp Class
- Main application controller
- Manages page data and UI state
- Handles view switching and user interactions

#### D3.js Force Simulation
- Creates natural bubble positioning
- Handles collision detection
- Manages zoom and pan interactions

#### CSS Design System
- CSS variables for consistent theming
- Apple-inspired component styles
- Responsive design patterns

## 🚀 Future Enhancements

### Planned Features
- **Real-time Collaboration**: WebSocket support for multiple users
- **Export Functionality**: Export to Markdown, PDF, or custom formats
- **Advanced Search**: Full-text search across all content
- **Templates**: Pre-built worldbuilding templates
- **Media Support**: Images, maps, and other media files
- **Version History**: Track changes over time

### Technical Improvements
- **Database Integration**: PostgreSQL or Neo4j for larger datasets
- **Cloud Sync**: Online synchronization across devices
- **Mobile App**: Native iOS/Android applications
- **API Integration**: Connect with external worldbuilding tools

## 🤝 Contributing

This is a proof-of-concept demonstration. For the full production version, consider:

1. **Framework Migration**: React/Vue.js for better component management
2. **Backend API**: Node.js/Express with WebSocket support
3. **Database**: Graph database for optimal relationship handling
4. **Testing**: Unit tests and integration tests
5. **CI/CD**: Automated deployment and testing pipeline

## 📄 License

MIT License - Feel free to use this code as inspiration for your own worldbuilding applications.

## 🙏 Acknowledgments

- **D3.js**: For the powerful data visualization library
- **Apple Design**: Inspiration for the modern, clean interface
- **Notion/Obsidian**: For demonstrating effective knowledge management patterns
- **Worldbuilding Community**: For providing the use case and requirements

---

**Built with ❤️ for worldbuilders and creative writers**