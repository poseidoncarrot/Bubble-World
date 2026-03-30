import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Page, PageConnection } from '@/types';

interface BubbleNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  type: 'main' | 'subsection';
  parentId?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  image?: string;
  description?: string;
  level: number;
}

interface BubbleLink extends d3.SimulationLinkDatum<BubbleNode> {
  source: string | BubbleNode;
  target: string | BubbleNode;
  strength: number;
}

interface BubbleMapVisualizationProps {
  pages: Page[];
  connections: PageConnection[];
  onPageSelect: (page: Page) => void;
  currentPage?: Page | null;
  width?: number;
  height?: number;
}

export const BubbleMapVisualization: React.FC<BubbleMapVisualizationProps> = ({
  pages,
  connections,
  onPageSelect,
  width = 800,
  height = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [currentLayer, setCurrentLayer] = useState<'high-level' | 'deep'>('high-level');

  // Convert pages to bubble nodes
  const createBubbleNodes = (): BubbleNode[] => {
    const nodes: BubbleNode[] = [];
    
    // Main pages (no parent)
    pages
      .filter(page => !page.parent_page_id)
      .forEach(page => {
        nodes.push({
          id: page.id,
          title: page.title,
          type: 'main',
          level: 0,
          x: width / 2 + (Math.random() - 0.5) * 200,
          y: height / 2 + (Math.random() - 0.5) * 200,
        });
      });

    // Sub-pages
    pages
      .filter(page => page.parent_page_id)
      .forEach(page => {
        nodes.push({
          id: page.id,
          title: page.title,
          type: 'subsection',
          parentId: page.parent_page_id,
          level: 1,
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height / 2 + (Math.random() - 0.5) * 100,
        });
      });

    return nodes;
  };

  // Convert connections to bubble links
  const createBubbleLinks = (): BubbleLink[] => {
    return connections
      .filter(conn => currentLayer === 'deep' || conn.connection_type === 'related')
      .map(conn => ({
        source: conn.source_page_id,
        target: conn.target_page_id,
        strength: conn.strength,
      }));
  };

  useEffect(() => {
    if (!svgRef.current || pages.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create nodes and links
    const nodes = createBubbleNodes();
    const links = createBubbleLinks();

    // Create simulation
    const simulation = d3.forceSimulation<BubbleNode>(nodes)
      .force('link', d3.forceLink<BubbleNode, BubbleLink>(links)
        .id(d => d.id)
        .distance(d => (d.source as BubbleNode).type === 'main' ? 150 : 80)
        .strength(l => l.strength / 10))
      .force('charge', d3.forceManyBody<BubbleNode>().strength(d => d.type === 'main' ? -800 : -400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<BubbleNode>()
        .radius(d => d.type === 'main' ? 45 : 25)
        .strength(0.7));

    // Create container for zoom and pan
    const container = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'line-connection')
      .attr('stroke', '#c5c6cd')
      .attr('stroke-dasharray', '4')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.4);

    // Create node groups
    const node = container.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'bubble-node group')
      .call(d3.drag<SVGGElement, BubbleNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add bubbles to nodes
    node.append('circle')
      .attr('r', d => d.type === 'main' ? 35 : 20)
      .attr('fill', d => {
        if (selectedNode === d.id) return '#214059';
        if (hoveredNode === d.id) return '#395771';
        return d.type === 'main' ? '#abcae8' : '#d4e4fc';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        const page = pages.find(p => p.id === d.id);
        if (page) onPageSelect(page);
        setSelectedNode(d.id);
      })
      .on('mouseenter', (_event, d) => {
        setHoveredNode(d.id);
        
        // Show subsections on hover for main nodes
        if (d.type === 'main' && currentLayer === 'high-level') {
          const subsections = nodes.filter(n => n.parentId === d.id);
          subsections.forEach(sub => {
            sub.fx = (sub.x || 0) + (Math.random() - 0.5) * 50;
            sub.fy = (sub.y || 0) + (Math.random() - 0.5) * 50;
          });
          simulation.alpha(0.3).restart();
        }
      })
      .on('mouseleave', (_event, d) => {
        setHoveredNode(null);
        
        // Hide subsections when not hovering
        if (d.type === 'main' && currentLayer === 'high-level') {
          const subsections = nodes.filter(n => n.parentId === d.id);
          subsections.forEach(sub => {
            sub.fx = null;
            sub.fy = null;
          });
          simulation.alpha(0.3).restart();
        }
      });

    // Add text labels
    node.append('text')
      .text(d => d.title.length > 12 ? d.title.substring(0, 12) + '...' : d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', d => d.type === 'main' ? '#ffffff' : '#214059')
      .attr('font-size', d => d.type === 'main' ? '12px' : '10px')
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'bubble-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(255, 255, 255, 0.95)')
      .style('backdrop-filter', 'blur(10px)')
      .style('border', '1px solid #e1e3e4')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('box-shadow', '0 4px 20px rgba(0, 0, 0, 0.1)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('transition', 'opacity 0.2s');

    node.on('mouseover', (event, d) => {
      const page = pages.find(p => p.id === d.id);
      if (page) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip.html(`
          <div style="font-weight: 600; color: #214059; margin-bottom: 4px;">${d.title}</div>
          <div style="font-size: 12px; color: #666;">${d.type === 'main' ? 'Main Topic' : 'Sub-section'}</div>
          ${(page as any).description ? `<div style="font-size: 11px; color: #888; margin-top: 4px; max-width: 200px;">${(page as any).description}</div>` : ''}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      }
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as BubbleNode).x || 0)
        .attr('y1', d => (d.source as BubbleNode).y || 0)
        .attr('x2', d => (d.target as BubbleNode).x || 0)
        .attr('y2', d => (d.target as BubbleNode).y || 0);

      node
        .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    // Layer switching
    const updateLayer = (layer: 'high-level' | 'deep') => {
      setCurrentLayer(layer);
      
      if (layer === 'high-level') {
        // Hide subsections
        nodes.filter(n => n.type === 'subsection').forEach(n => {
          n.fx = width / 2;
          n.fy = height / 2;
        });
      } else {
        // Show all nodes
        nodes.forEach(n => {
          n.fx = null;
          n.fy = null;
        });
      }
      
      simulation.alpha(0.3).restart();
    };

    // Expose updateLayer function to parent
    (svgRef.current as any).updateLayer = updateLayer;

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [pages, connections, width, height, onPageSelect, currentLayer]);

  // Zoom controls
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    svg.transition().call(zoom.scaleBy, 1.2);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    svg.transition().call(zoom.scaleBy, 0.8);
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    svg.transition().call(zoom.transform, d3.zoomIdentity);
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-primary">add</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-primary">remove</span>
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
          title="Reset View"
        >
          <span className="material-symbols-outlined text-primary">center_focus_strong</span>
        </button>
      </div>

      {/* Layer Toggle */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/80 backdrop-blur-md p-1 rounded-full shadow-lg border border-white/50">
          <button
            onClick={() => setCurrentLayer('high-level')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition-all ${
              currentLayer === 'high-level'
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:text-primary'
            }`}
          >
            HIGH-LEVEL
          </button>
          <button
            onClick={() => setCurrentLayer('deep')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition-all ${
              currentLayer === 'deep'
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:text-primary'
            }`}
          >
            DEEP LAYER
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/50">
          <div className="text-xs font-semibold text-primary mb-1">BUBBLE MAP STATS</div>
          <div className="text-[10px] text-slate-600 space-y-1">
            <div>Main Topics: {pages.filter(p => !p.parent_page_id).length}</div>
            <div>Sub-sections: {pages.filter(p => p.parent_page_id).length}</div>
            <div>Connections: {connections.length}</div>
            <div>Current Layer: {currentLayer.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
