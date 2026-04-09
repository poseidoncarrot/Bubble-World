/**
 * ModalContext - Modal state management
 * 
 * This context manages the state of modals throughout the application:
 * - Delete confirmation modal state
 * - Type-safe modal state management
 * - Helper functions for common modal operations
 * 
 * Modal State:
 * - isOpen: Whether the modal is currently visible
 * - type: Type of item being deleted (page, category, subsection, universe)
 * - itemId: ID of the item to delete
 * - itemName: Display name of the item
 * - parentId: Optional parent ID (for subsections)
 * 
 * Helper Functions:
 * - setDeleteModal: Update modal state with partial updates
 * - closeDeleteModal: Close the delete modal
 * - openDeleteModal: Open the delete modal with pre-populated data
 * 
 * Usage:
 * - Use useModal() to access modal state and functions
 * - Call openDeleteModal() to show confirmation dialog
 * - Call closeDeleteModal() to hide dialog
 * 
 * TODO: Add support for multiple modal types
 * TODO: Add modal queue for nested modals
 * TODO: Add animation state management
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DeleteModalState } from '../types/enhanced';

interface ModalContextType {
  deleteModal: DeleteModalState;
  setDeleteModal: (modal: Partial<DeleteModalState>) => void;
  closeDeleteModal: () => void;
  openDeleteModal: (type: DeleteModalState['type'], itemId: string, itemName: string, parentId?: string) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [deleteModal, setDeleteModalState] = useState<DeleteModalState>({
    isOpen: false,
    type: 'page',
    itemId: '',
    itemName: ''
  });

  const setDeleteModal = useCallback((modal: Partial<DeleteModalState>) => {
    setDeleteModalState(prev => ({ ...prev, ...modal }));
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const openDeleteModal = useCallback((
    type: DeleteModalState['type'], 
    itemId: string, 
    itemName: string, 
    parentId?: string
  ) => {
    setDeleteModalState({
      isOpen: true,
      type,
      itemId,
      itemName,
      parentId
    });
  }, []);

  const value = {
    deleteModal,
    setDeleteModal,
    closeDeleteModal,
    openDeleteModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};
