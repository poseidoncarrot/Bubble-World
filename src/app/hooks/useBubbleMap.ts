/**
 * useBubbleMap - Custom hook for bubble map canvas interactions
 * 
 * This hook manages the visual bubble map interface with:
 * - Pan and zoom functionality
 * - Node positioning and dragging
 * - Connection mode for linking nodes
 * - Search filtering
 * - Edge rendering (hierarchy and connections)
 * - Distance constraints between connected nodes
 * 
 * Features:
 * - Pan via mouse drag or scroll
 * - Zoom via Ctrl/Cmd + scroll
 * - Drag nodes to reposition
 * - Connection mode for linking nodes
 * - Search highlights matching nodes
 * - Gentle distance constraints prevent overlap
 * - Position persistence during re-renders
 * 
 * Layout Algorithm:
 * - Pages arranged in a circle around center
 * - Subsections arranged in a ring around parent page
 * - Positions can be overridden by user dragging
 * 
 * TODO: Implement auto-layout algorithm (force-directed)
 * TODO: Add mini-map for navigation
 * TODO: Add fit-to-screen functionality
 * TODO: Add keyboard shortcuts for navigation
 */

import { useMemo, useState, useCallback } from 'react';
import { Universe } from '../types';

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
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());

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
      const defaultPx = centerX + pageRadius * Math.cos(angle);
      const defaultPy = centerY + pageRadius * Math.sin(angle);
      
      // Use stored position if available, otherwise use default
      const storedPos = nodePositions.get(page.id);
      const px = storedPos?.x ?? defaultPx;
      const py = storedPos?.y ?? defaultPy;
      
      const matchesSearch = lowerQuery === '' || page.title.toLowerCase().includes(lowerQuery);
      
      items.push({ id: page.id, type: 'page', title: page.title, x: px, y: py, matchesSearch });

      page.subsections.forEach((sub, j) => {
        const subAngle = angle + ((j - (page.subsections.length - 1) / 2) * 0.4);
        const subRadius = pageRadius + 200;
        const defaultSx = centerX + subRadius * Math.cos(subAngle);
        const defaultSy = centerY + subRadius * Math.sin(subAngle);
        
        // Use stored position if available, otherwise use default
        const storedSubPos = nodePositions.get(sub.id);
        const sx = storedSubPos?.x ?? defaultSx;
        const sy = storedSubPos?.y ?? defaultSy;
        
        const subMatchesSearch = lowerQuery === '' || sub.title.toLowerCase().includes(lowerQuery);
        
        items.push({ id: sub.id, parentId: page.id, type: 'subsection', title: sub.title, x: sx, y: sy, matchesSearch: subMatchesSearch });
      });
    });
    return items;
  }, [universe, searchQuery, nodePositions]);

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
          // Account for bubble centering transforms (-translate-x-1/2 -translate-y-1/2)
          edgesArray.push({ 
            x1: pNode.x, 
            y1: pNode.y, 
            x2: sNode.x, 
            y2: sNode.y, 
            type: 'hierarchy' 
          });
        }
      });
      // Page to Connections
      p.connections.forEach(cId => {
        const cNode = nodes.find(n => n.id === cId);
        if (pNode && cNode) {
          edgesArray.push({ 
            x1: pNode.x, 
            y1: pNode.y, 
            x2: cNode.x, 
            y2: cNode.y, 
            type: 'connection' 
          });
        }
      });
      // Subsection to Connections
      p.subsections.forEach(s => {
        const sNode = nodes.find(n => n.id === s.id);
        s.connections.forEach(cId => {
          const cNode = nodes.find(n => n.id === cId);
          if (sNode && cNode) {
            edgesArray.push({ 
              x1: sNode.x, 
              y1: sNode.y, 
              x2: cNode.x, 
              y2: cNode.y, 
              type: 'connection' 
            });
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

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      // Store the initial mouse position relative to the node's current position
      const nodeScreenX = node.x * zoom + pan.x;
      const nodeScreenY = node.y * zoom + pan.y;
      const dragOffsetX = e.clientX - nodeScreenX;
      const dragOffsetY = e.clientY - nodeScreenY;
      setNodeDragStart({ x: dragOffsetX, y: dragOffsetY });
    }
  }, [nodes, zoom, pan]);

  const handleNodeMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingNode) {
      let newX = (e.clientX - nodeDragStart.x - pan.x) / zoom;
      let newY = (e.clientY - nodeDragStart.y - pan.y) / zoom;

      // Apply gentle distance constraints for connected bubbles
      const draggingNodeData = nodes.find(n => n.id === draggingNode);
      if (draggingNodeData && universe) {
        const minDistance = 120; // Minimum distance between connected bubbles

        // Get all connections for the dragging node
        let allConnections: string[] = [];

        // Check page connections
        const page = universe.pages.find(p => p.id === draggingNode);
        if (page) {
          allConnections = allConnections.concat(page.connections);
        }

        // Check subsection connections
        universe.pages.forEach(p => {
          const subsection = p.subsections.find(s => s.id === draggingNode);
          if (subsection) {
            allConnections = allConnections.concat(subsection.connections);
          }
        });

        // Apply minimum distance constraint (only prevent overlap)
        allConnections.forEach(connectedId => {
          const connectedNode = nodes.find(n => n.id === connectedId);
          if (connectedNode) {
            const currentPos = nodePositions.get(connectedId) || { x: connectedNode.x, y: connectedNode.y };
            const dx = newX - currentPos.x;
            const dy = newY - currentPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only apply minimum distance to prevent overlap
            if (distance < minDistance && distance > 0) {
              const angle = Math.atan2(dy, dx);
              newX = currentPos.x + minDistance * Math.cos(angle);
              newY = currentPos.y + minDistance * Math.sin(angle);
            }
          }
        });
      }

      setNodePositions(prev => {
        const newPositions = new Map(prev);
        newPositions.set(draggingNode, { x: newX, y: newY });
        return newPositions;
      });
    }
  }, [draggingNode, nodeDragStart, pan, zoom, nodes, universe, nodePositions]);

  const handleNodeMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  return {
    // State
    pan,
    zoom,
    isDragging,
    connectingFrom,
    nodes,
    edges,
    draggingNode,
    
    // Actions
    setPan,
    setZoom,
    setConnectingFrom,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNodeNavigate,
    toggleConnectionMode,
    handleNodeMouseDown,
    handleNodeMouseMove,
    handleNodeMouseUp
  };
};
