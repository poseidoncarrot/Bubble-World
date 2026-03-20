// Bubble World - Worldbuilding Organization App
class BubbleWorldApp {
    constructor() {
        this.pages = this.loadSampleData();
        this.currentPage = null;
        this.currentView = 'tabs';
        this.bubbleLayer = 'main';
        this.simulation = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPagesList();
        this.setupBubbleGraph();
    }

    // Sample worldbuilding data
    loadSampleData() {
        return [
            {
                id: 'kingdoms',
                title: 'Kingdoms & Empires',
                content: `# Kingdoms & Empires

## The Azure Empire
- **Capital**: Crystal City
- **Ruler**: Empress Lyra Moonwhisper
- **Military**: The Azure Legion
- **Culture**: Highly magical, focuses on elemental magic

## The Iron Confederacy
- **Capital**: Forgehammer
- **Ruler**: High Council of Smiths
- **Military**: Confederate Guard
- **Culture**: Industrial, master craftsmen

## The Forest Realm
- **Capital**: Greenwood
- **Ruler**: Elder Council
- **Military**: Forest Rangers
- **Culture**: Nature-focused, druidic traditions`,
                connections: ['magic', 'characters', 'geography'],
                subsections: [
                    { id: 'azure-empire', title: 'Azure Empire', connections: ['magic', 'characters'] },
                    { id: 'iron-confederacy', title: 'Iron Confederacy', connections: ['geography'] },
                    { id: 'forest-realm', title: 'Forest Realm', connections: ['magic', 'geography'] }
                ]
            },
            {
                id: 'magic',
                title: 'Magic Systems',
                content: `# Magic Systems

## Elemental Magic
- **Elements**: Fire, Water, Earth, Air
- **Practitioners**: Elemental Mages
- **Limitations**: Requires environmental connection

## Rune Magic
- **Method**: Inscribing magical symbols
- **Practitioners**: Rune Masters
- **Limitations**: Time-consuming preparation

## Blood Magic
- **Method**: Using life force
- **Practitioners**: Blood Mages (forbidden)
- **Limitations**: High personal cost`,
                connections: ['kingdoms', 'characters', 'history'],
                subsections: [
                    { id: 'elemental-magic', title: 'Elemental Magic', connections: ['kingdoms'] },
                    { id: 'rune-magic', title: 'Rune Magic', connections: ['history'] },
                    { id: 'blood-magic', title: 'Blood Magic', connections: ['characters'] }
                ]
            },
            {
                id: 'characters',
                title: 'Key Characters',
                content: `# Key Characters

## Empress Lyra Moonwhisper
- **Role**: Ruler of Azure Empire
- **Abilities**: Master Elemental Mage
- **Personality**: Wise but ruthless when needed
- **Background**: Former adventurer

## Master Theron Ironforge
- **Role**: High Council Member
- **Abilities**: Legendary Smith
- **Personality**: Grumpy but fair
- **Background**: Common-born genius

## Elara Swiftwind
- **Role**: Forest Realm Ambassador
- **Abilities**: Druid Magic
- **Personality**: Peaceful diplomat
- **Background**: Raised by forest spirits`,
                connections: ['kingdoms', 'magic', 'history'],
                subsections: [
                    { id: 'lyra', title: 'Empress Lyra', connections: ['kingdoms', 'magic'] },
                    { id: 'theron', title: 'Master Theron', connections: ['kingdoms'] },
                    { id: 'elara', title: 'Elara Swiftwind', connections: ['magic', 'kingdoms'] }
                ]
            },
            {
                id: 'geography',
                title: 'Geography & Locations',
                content: `# Geography & Locations

## The Azure Plains
- **Location**: Central continent
- **Features**: Vantastic grasslands, crystal formations
- **Inhabitants**: Azure Empire citizens

## The Iron Mountains
- **Location**: Northern region
- **Features**: Rich mineral deposits, volcanic activity
- **Inhabitants**: Mining communities

## The Whispering Woods
- **Location**: Eastern forest
- **Features**: Ancient trees, magical creatures
- **Inhabitants**: Forest dwellers, elves`,
                connections: ['kingdoms', 'magic', 'history'],
                subsections: [
                    { id: 'azure-plains', title: 'Azure Plains', connections: ['kingdoms'] },
                    { id: 'iron-mountains', title: 'Iron Mountains', connections: ['kingdoms'] },
                    { id: 'whispering-woods', title: 'Whispering Woods', connections: ['magic'] }
                ]
            },
            {
                id: 'history',
                title: 'History & Timeline',
                content: `# History & Timeline

## The Age of Founding (1000-800 years ago)
- Establishment of the three major kingdoms
- First magical discoveries
- Formation of trade routes

## The War of Elements (500 years ago)
- Major conflict between kingdoms
- Magical devastation
- Treaty of Crystal City

## The Modern Era (200 years ago to present)
- Period of relative peace
- Technological advancements
- Growing tensions between empires`,
                connections: ['kingdoms', 'magic', 'characters', 'geography'],
                subsections: [
                    { id: 'age-of-founding', title: 'Age of Founding', connections: ['kingdoms', 'geography'] },
                    { id: 'war-of-elements', title: 'War of Elements', connections: ['magic', 'characters'] },
                    { id: 'modern-era', title: 'Modern Era', connections: ['kingdoms'] }
                ]
            }
        ];
    }

    setupEventListeners() {
        // View toggle
        document.getElementById('tabsViewBtn').addEventListener('click', () => this.switchView('tabs'));
        document.getElementById('bubbleViewBtn').addEventListener('click', () => this.switchView('bubble'));

        // Page management
        document.getElementById('addPageBtn').addEventListener('click', () => this.openPageModal());
        document.getElementById('pageForm').addEventListener('submit', (e) => this.savePage(e));
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closePageModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closePageModal());

        // Bubble map controls
        document.getElementById('mainLayerBtn').addEventListener('click', () => this.switchBubbleLayer('main'));
        document.getElementById('subLayerBtn').addEventListener('click', () => this.switchBubbleLayer('sub'));
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('resetZoomBtn').addEventListener('click', () => this.resetZoom());

        // Modal close on outside click
        document.getElementById('pageModal').addEventListener('click', (e) => {
            if (e.target.id === 'pageModal') {
                this.closePageModal();
            }
        });
    }

    switchView(view) {
        this.currentView = view;
        const tabsView = document.getElementById('tabsView');
        const bubbleView = document.getElementById('bubbleView');
        const tabsBtn = document.getElementById('tabsViewBtn');
        const bubbleBtn = document.getElementById('bubbleViewBtn');

        if (view === 'tabs') {
            tabsView.classList.remove('hidden');
            bubbleView.classList.add('hidden');
            tabsBtn.classList.add('active');
            bubbleBtn.classList.remove('active');
        } else {
            tabsView.classList.add('hidden');
            bubbleView.classList.remove('hidden');
            tabsBtn.classList.remove('active');
            bubbleBtn.classList.add('active');
            this.updateBubbleGraph();
        }
    }

    renderPagesList() {
        const pagesList = document.getElementById('pagesList');
        pagesList.innerHTML = '';

        this.pages.forEach(page => {
            const pageItem = document.createElement('div');
            pageItem.className = 'page-item';
            if (this.currentPage && this.currentPage.id === page.id) {
                pageItem.classList.add('active');
            }
            
            pageItem.innerHTML = `
                <h3>${page.title}</h3>
                <p>${page.content.substring(0, 100)}...</p>
            `;
            
            pageItem.addEventListener('click', () => this.loadPage(page));
            pagesList.appendChild(pageItem);
        });
    }

    loadPage(page) {
        this.currentPage = page;
        const pageContent = document.getElementById('pageContent');
        
        pageContent.innerHTML = `
            <div class="page-editor">
                <div class="page-header">
                    <input type="text" class="page-title-input" value="${page.title}" 
                           onchange="app.updatePageTitle('${page.id}', this.value)">
                </div>
                <textarea class="page-content-textarea" 
                          onchange="app.updatePageContent('${page.id}', this.value)">${page.content}</textarea>
            </div>
        `;

        this.renderPagesList();
    }

    updatePageTitle(pageId, newTitle) {
        const page = this.pages.find(p => p.id === pageId);
        if (page) {
            page.title = newTitle;
            this.renderPagesList();
            if (this.currentView === 'bubble') {
                this.updateBubbleGraph();
            }
        }
    }

    updatePageContent(pageId, newContent) {
        const page = this.pages.find(p => p.id === pageId);
        if (page) {
            page.content = newContent;
        }
    }

    openPageModal(page = null) {
        const modal = document.getElementById('pageModal');
        const modalTitle = document.getElementById('modalTitle');
        const titleInput = document.getElementById('pageTitle');
        const contentInput = document.getElementById('pageContent');
        
        if (page) {
            modalTitle.textContent = 'Edit Page';
            titleInput.value = page.title;
            contentInput.value = page.content;
            this.editingPage = page;
        } else {
            modalTitle.textContent = 'Add New Page';
            titleInput.value = '';
            contentInput.value = '';
            this.editingPage = null;
        }
        
        this.renderConnectionsList();
        modal.classList.remove('hidden');
    }

    closePageModal() {
        const modal = document.getElementById('pageModal');
        modal.classList.add('hidden');
        this.editingPage = null;
    }

    renderConnectionsList() {
        const connectionsList = document.getElementById('connectionsList');
        connectionsList.innerHTML = '';

        this.pages.forEach(page => {
            if (this.editingPage && page.id === this.editingPage.id) return;
            
            const checkbox = document.createElement('div');
            checkbox.className = 'connection-checkbox';
            checkbox.innerHTML = `
                <input type="checkbox" id="conn-${page.id}" value="${page.id}"
                       ${this.editingPage && this.editingPage.connections.includes(page.id) ? 'checked' : ''}>
                <label for="conn-${page.id}">${page.title}</label>
            `;
            connectionsList.appendChild(checkbox);
        });
    }

    savePage(e) {
        e.preventDefault();
        const title = document.getElementById('pageTitle').value;
        const content = document.getElementById('pageContent').value;
        
        const connections = Array.from(document.querySelectorAll('#connectionsList input:checked'))
            .map(input => input.value);

        if (this.editingPage) {
            // Update existing page
            this.editingPage.title = title;
            this.editingPage.content = content;
            this.editingPage.connections = connections;
        } else {
            // Create new page
            const newPage = {
                id: title.toLowerCase().replace(/\s+/g, '-'),
                title,
                content,
                connections,
                subsections: []
            };
            this.pages.push(newPage);
        }

        this.renderPagesList();
        this.closePageModal();
        
        if (this.currentView === 'bubble') {
            this.updateBubbleGraph();
        }
    }

    // Bubble Map Implementation
    setupBubbleGraph() {
        const container = document.getElementById('bubbleGraph');
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.svg = d3.select('#bubbleGraph')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        this.g = this.svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(zoom);
        this.zoomBehavior = zoom;
    }

    updateBubbleGraph() {
        const graphData = this.getGraphData();
        
        // Clear existing elements
        this.g.selectAll('*').remove();

        // Create simulation
        this.simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(400, 300))
            .force('collision', d3.forceCollide().radius(30));

        // Create links
        const link = this.g.append('g')
            .selectAll('line')
            .data(graphData.links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        // Create nodes
        const node = this.g.append('g')
            .selectAll('g')
            .data(graphData.nodes)
            .enter().append('g')
            .call(this.drag());

        // Add circles for nodes
        node.append('circle')
            .attr('r', d => d.radius || 20)
            .attr('fill', d => d.color || '#007AFF')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Add labels
        node.append('text')
            .text(d => d.label)
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('pointer-events', 'none');

        // Add tooltips
        node.append('title')
            .text(d => `${d.label}\n${d.description || ''}`);

        // Update positions on tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Click handler for nodes
        node.on('click', (event, d) => {
            if (d.pageId) {
                const page = this.pages.find(p => p.id === d.pageId);
                if (page) {
                    this.switchView('tabs');
                    this.loadPage(page);
                }
            }
        });
    }

    getGraphData() {
        const nodes = [];
        const links = [];

        if (this.bubbleLayer === 'main') {
            // Main topic nodes
            this.pages.forEach(page => {
                nodes.push({
                    id: page.id,
                    label: page.title,
                    pageId: page.id,
                    description: `Main topic with ${page.subsections.length} subsections`,
                    radius: 25,
                    color: this.getNodeColor(page.id)
                });
            });

            // Connections between main topics
            this.pages.forEach(page => {
                page.connections.forEach(connId => {
                    if (this.pages.find(p => p.id === connId)) {
                        links.push({
                            source: page.id,
                            target: connId
                        });
                    }
                });
            });
        } else {
            // Subsection nodes
            this.pages.forEach(page => {
                page.subsections.forEach(sub => {
                    nodes.push({
                        id: sub.id,
                        label: sub.title,
                        pageId: page.id,
                        description: `Subsection of ${page.title}`,
                        radius: 15,
                        color: this.getNodeColor(page.id)
                    });
                });

                // Connections between subsections
                page.subsections.forEach(sub => {
                    sub.connections.forEach(connId => {
                        const targetPage = this.pages.find(p => p.id === connId);
                        if (targetPage) {
                            targetPage.subsections.forEach(targetSub => {
                                links.push({
                                    source: sub.id,
                                    target: targetSub.id
                                });
                            });
                        }
                    });
                });
            });
        }

        return { nodes, links };
    }

    getNodeColor(pageId) {
        const colors = ['#007AFF', '#5856D6', '#FF3B30', '#FF9500', '#34C759'];
        const index = this.pages.findIndex(p => p.id === pageId);
        return colors[index % colors.length];
    }

    drag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }

    switchBubbleLayer(layer) {
        this.bubbleLayer = layer;
        const mainBtn = document.getElementById('mainLayerBtn');
        const subBtn = document.getElementById('subLayerBtn');

        if (layer === 'main') {
            mainBtn.classList.add('active');
            subBtn.classList.remove('active');
        } else {
            mainBtn.classList.remove('active');
            subBtn.classList.add('active');
        }

        this.updateBubbleGraph();
    }

    zoom(scale) {
        this.svg.transition().duration(300).call(
            this.zoomBehavior.scaleBy, scale
        );
    }

    resetZoom() {
        this.svg.transition().duration(300).call(
            this.zoomBehavior.transform,
            d3.zoomIdentity
        );
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BubbleWorldApp();
});
