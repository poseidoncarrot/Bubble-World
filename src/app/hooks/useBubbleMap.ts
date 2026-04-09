import { useMemo, useState, useCallback } from 'react';
import { Page, Subsection, Universe } from '../types';

interface BubbleNode {
  id: string;
  type: 'page' | 'subsection';
  title: string;
  x: number;
  y: number;
  parentId?: string;
  matchesSearch: boolean;
}

interface BubbleEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'hierarchy' | 'connection';
}

export const useBubbleMap = (universe: Universe | undefined, searchQuery: string) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<{ type: 'page' | 'subsection', id: string } | null>(null);

  // Generate nodes positions (simple layout: circle for pages, ring for subsections)
  const nodes = useMemo((): BubbleNode[] => {
    if (!universe) return [];
    
    const pages = universe.pages;
    const items: BubbleNode[] = [];
    
    const centerX = 0;
    const centerY = 0;
    const pageRadius = 400;

    const lowerQuery = searchQuery.toLowerCase();

    pages.forEach((page, i) => {
      const angle = (i / pages.length) * 2 * Math.PI;
      const px = centerX + pageRadius * Math.cos(angle);
      const py = centerY + pageRadius * Math.sin(angle);
      
      const matchesSearch = lowerQuery === '' || page.title.toLowerCase().includes(lowerQuery);
      
      items.push({ id: page.id, type: 'page', title: page.title, x: px, y: py, matchesSearch });

      page.subsections.forEach((sub, j) => {
        const subAngle = angle + ((j - (page.subsections.length - 1) / 2) * 0.4);
        const subRadius = pageRadius + 200;
        const sx = centerX + subRadius * Math.cos(subAngle);
        const sy = centerY + subRadius * Math.sin(subAngle);
        
        const subMatchesSearch = lowerQuery === '' || sub.title.toLowerCase().includes(lowerQuery);
        
        items.push({ id: sub.id, parentId: page.id, type: 'subsection', title: sub.title, x: sx, y: sy, matchesSearch: subMatchesSearch });
      });
    });
    return items;
  }, [universe, searchQuery]);

  // Extract edges
  const edges = useMemo((): BubbleEdge[] => {
    if (!universe) return [];
    
    const edgesArray: BubbleEdge[] = [];
    universe.pages.forEach(p => {
      // Page to Subsections (hierarchy)
      const pNode = nodes.find(n => n.id === p.id);
      p.subsections.forEach(s => {
        const sNode = nodes.find(n => n.id === s.id);
        if (pNode && sNode) {
          edgesArray.push({ x1: pNode.x, y1: pNode.y, x2: sNode.x, y2: sNode.y, type: 'hierarchy' });
        }
      });
      // Page to Connections
      p.connections.forEach(cId => {
        const cNode = nodes.find(n => n.id === cId);
        if (pNode && cNode) {
          edgesArray.push({ x1: pNode.x, y1: pNode.y, x2: cNode.x, y2: cNode.y, type: 'connection' });
        }
      });
      // Subsection to Connections
      p.subsections.forEach(s => {
        const sNode = nodes.find(n => n.id === s.id);
        s.connections.forEach(cId => {
          const cNode = nodes.find(n => n.id === cId);
          if (sNode && cNode) {
            edgesArray.push({ x1: sNode.x, y1: sNode.y, x2: cNode.x, y2: cNode.y, type: 'connection' });
          }
        });
      });
    });
    return edgesArray;
  }, [universe?.pages, nodes]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.min(Math.max(0.1, z - e.deltaY * 0.01), 3));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only pan on middle mouse or if clicking background
    if (e.target === e.currentTarget || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleNodeNavigate = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setPan({ x: -node.x * zoom + window.innerWidth / 2, y: -node.y * zoom + window.innerHeight / 2 });
    }
  }, [nodes, zoom]);

  const toggleConnectionMode = useCallback((node: BubbleNode) => {
    if (connectingFrom?.id === node.id) {
      setConnectingFrom(null);
    } else {
      setConnectingFrom({ type: node.type, id: node.id });
    }
  }, [connectingFrom]);

  return {
    // State
    pan,
    zoom,
    isDragging,
    connectingFrom,
    nodes,
    edges,
    
    // Actions
    setPan,
    setZoom,
    setConnectingFrom,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNodeNavigate,
    toggleConnectionMode
  };
};
