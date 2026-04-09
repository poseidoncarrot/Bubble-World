import { Universe, Page, Subsection, Connection } from '../types';

// Enhanced type definitions with better type safety

export interface DeleteModalState {
  isOpen: boolean;
  type: 'category' | 'page' | 'subsection' | 'universe';
  itemId: string;
  itemName: string;
  parentId?: string;
}

export interface UniverseFormData {
  name: string;
  description: string;
  icon?: string;
}

export interface PageFormData {
  title: string;
  description: string;
  category?: string;
  coverImage?: string;
}

export interface SubsectionFormData {
  title: string;
  content: string;
}

export interface DragItem {
  id: string;
  index: number;
  type: string;
  category?: string;
}

export interface DropTarget {
  index: number;
  category?: string;
}

// React DnD monitor types
export interface DragMonitor {
  isDragging(): boolean;
  getItem(): DragItem;
  getItemType(): string;
  getClientOffset(): { x: number; y: number } | null;
  getDifferenceFromInitialOffset(): { x: number; y: number } | null;
}

export interface DropMonitor {
  isOver(): boolean;
  canDrop(): boolean;
  getItem(): DragItem;
}

export interface BubbleNode {
  id: string;
  type: 'page' | 'subsection';
  title: string;
  x: number;
  y: number;
  parentId?: string;
  matchesSearch: boolean;
}

export interface BubbleEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'hierarchy' | 'connection';
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  background: string;
  surface: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'created_at' | 'updated_at';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  search?: string;
  category?: string;
  theme?: string;
}

// Enhanced component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Database operation types
export type CreateOperation<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateOperation<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>;

// Enhanced universe types
export type CreateUniverseData = CreateOperation<Universe> & { user_id: string };
export type UpdateUniverseData = UpdateOperation<Universe>;
export type CreatePageData = CreateOperation<Page> & { universe_id: string };
export type UpdatePageData = UpdateOperation<Page>;
export type CreateSubsectionData = CreateOperation<Subsection> & { page_id: string };
export type UpdateSubsectionData = UpdateOperation<Subsection>;
export type CreateConnectionData = CreateOperation<Connection> & { universe_id: string };

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ValidationError extends AppError {
  field?: string;
  value?: unknown;
}

// Service layer types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}

// Event types
export interface ActivityEvent {
  type: string;
  timestamp: number;
  data?: unknown;
}

// Hook return types
export interface UseDebounceReturn<T extends (...args: any[]) => any> {
  (this: any, ...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}
