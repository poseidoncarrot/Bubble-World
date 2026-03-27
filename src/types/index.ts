// Core data types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface World {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  world_id: string;
  parent_page_id?: string;
  title: string;
  content: any; // Tiptap JSON output
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PageConnection {
  id: string;
  source_page_id: string;
  target_page_id: string;
  connection_type: 'related' | 'sub-section' | 'reference';
  strength: number;
  created_at: string;
}

export interface UserSession {
  id: string;
  session_id: string;
  user_id?: string;
  trial_started_at: string;
  trial_expires_at: string;
  is_premium: boolean;
  created_at: string;
}

// Bubble map types
export interface BubbleNode {
  id: string;
  title: string;
  type: 'main' | 'subsection';
  parentId?: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  image?: string;
  description?: string;
}

export interface BubbleLink {
  source: string | BubbleNode;
  target: string | BubbleNode;
  strength: number;
  type?: 'main' | 'subsection';
}

export interface SimulationNodeDatum extends BubbleNode {
  type: 'main' | 'subsection';
}

// UI State types
export interface AppState {
  user: User | null;
  session: UserSession | null;
  currentWorld: World | null;
  currentPage: Page | null;
  isTrial: boolean;
  trialTimeRemaining: number;
  syncStatus: 'syncing' | 'ready' | 'error';
}

// Search types
export interface SearchResult {
  page: Page;
  matches: ContentMatch[];
  score: number;
}

export interface ContentMatch {
  text: string;
  index: number;
  context: string;
}

// Navigation types
export interface PageNode {
  id: string;
  title: string;
  children: PageNode[];
  level: number;
  page?: Page;
}

// Component props types
export interface SidebarProps {
  pages: PageNode[];
  currentPage: Page | null;
  onPageSelect: (page: Page) => void;
  onNewPage: () => void;
}

export interface EditorProps {
  page: Page | null;
  onSave: (content: any) => void;
  isTrial: boolean;
}

export interface BubbleMapProps {
  pages: Page[];
  connections: PageConnection[];
  onPageSelect: (page: Page) => void;
}

export interface TrialManagerProps {
  onTrialExpire: () => void;
  onSignupPrompt: () => void;
}
