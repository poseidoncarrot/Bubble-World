import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Page } from '@/types';

interface BubbleMapVisualizationProps {
  pages: Page[];
  connections: any[];
  onPageSelect: (page: Page) => void;
  width: number;
  height: number;
}

export const BubbleMapVisualization: React.FC<BubbleMapVisualizationProps> = ({
  pages,
  onPageSelect,
  width,
  height
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Convert pages to bubble nodes
  const createBubbleNodes = () => {
    return pages.map(page => ({
      id: page.id,
      title: page.title,
      type: page.parent_page_id ? 'subsection' : 'main',
      parentId: page.parent_page_id,
      x: Math.random() * width,
      y: Math.random() * height,
    }));
  };

  const createBubbleLinks = () => {
    return pages
      .filter(page => page.parent_page_id)
      .map(page => ({
        source: page.parent_page_id || '',
        target: page.id,
        strength: 1
      }));
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = createBubbleNodes();
    const links = createBubbleLinks();

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (_event: any, d: any) => {
        const page = pages.find(p => p.id === d.id);
        if (page) {
          onPageSelect(page);
        }
      })
      .on('mouseenter', (_event: any, _d: any) => {
        // Hover handling
      })
      .on('mouseleave', () => {
        // Hover end
      });

    // Add circles
    node.append('circle')
      .attr('r', 25)
      .attr('fill', (d: any) => d.type === 'main' ? '#06b6d4' : '#0891b2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add text
    node.append('text')
      .text((d: any) => d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('font-size', '12px')
      .attr('fill', '#1e293b');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [pages, width, height]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};
