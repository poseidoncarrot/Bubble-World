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
