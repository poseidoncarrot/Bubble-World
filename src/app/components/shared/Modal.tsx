/**
 * Modal component - Reusable modal dialog with sub-components
 * 
 * This component provides a flexible modal system with:
 * - Modal container with backdrop blur
 * - ModalHeader with title and close button
 * - ModalBody for content
 * - ModalFooter for action buttons
 * - Conditional rendering based on isOpen
 * - Custom className support
 * 
 * Features:
 * - Fixed positioning with z-index for layering
 * - Backdrop blur for focus
 * - Centered content
 * - Responsive max-width
 * - Accessible close button
 * 
 * Usage Pattern:
 * <Modal isOpen={show} onClose={close}>
 *   <ModalHeader title="Title" onClose={close} />
 *   <ModalBody>Content</ModalBody>
 *   <ModalFooter>Actions</ModalFooter>
 * </Modal>
 * 
 * TODO: Add animation on open/close
 * TODO: Add size variants (sm, md, lg, xl)
 * TODO: Add escape key to close
 * TODO: Add click outside to close
 * TODO: Add aria attributes for accessibility
 */

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal - Main container component
 * 
 * Renders nothing when isOpen is false.
 * When open, displays a backdrop overlay with centered content.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl ${className}`}>
        {children}
      </div>
    </div>
  );
};

/**
 * ModalHeader - Header section with title and close button
 * 
 * Displays the modal title and an X button to close the modal.
 * The close button calls the onClose callback.
 */
interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-[#214059]">{title}</h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

/**
 * ModalBody - Main content section
 * 
 * Wraps the modal content with bottom margin for spacing.
 */
interface ModalBodyProps {
  children: React.ReactNode;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

/**
 * ModalFooter - Action buttons section
 * 
 * Displays action buttons (e.g., Cancel, Confirm) with right alignment.
 * Uses flexbox with gap for consistent button spacing.
 */
interface ModalFooterProps {
  children: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return <div className="flex justify-end gap-2">{children}</div>;
};
