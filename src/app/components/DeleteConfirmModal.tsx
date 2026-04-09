/**
 * DeleteConfirmModal component - Confirmation dialog for delete operations
 * 
 * This component provides a safety confirmation before deleting:
 * - Categories (with option to delete or move pages)
 * - Pages
 * - Subsections
 * - Universes
 * 
 * Special Features:
 * - For category deletion, offers two options:
 *   1. Move pages to "Uncategorized" (default)
 *   2. Delete all pages in the category
 * - Theme-aware styling (Light/Dark)
 * - Backdrop blur for modal overlay
 * 
 * Security:
 * - Prevents accidental deletions
 * - Makes destructive actions explicit
 * - Cannot be undone (as stated in UI)
 * 
 * TODO: Add undo functionality with toast notification
 * TODO: Add password confirmation for universe deletion
 * TODO: Show list of items that will be affected
 */

import React, { useState } from 'react';

type DeleteType = 'category' | 'page' | 'subsection' | 'universe';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  type: DeleteType;
  itemName: string;
  onConfirm: (options?: { deletePages?: boolean }) => void;
  onCancel: () => void;
  isDarkTheme?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  type,
  itemName,
  onConfirm,
  onCancel,
  isDarkTheme = false
}: DeleteConfirmModalProps) {
  const [deletePages, setDeletePages] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`rounded-2xl p-6 w-[400px] shadow-2xl ${isDarkTheme ? 'bg-[#1a1f2e] text-gray-200' : 'bg-white text-gray-800'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-[#214059]'}`}>
          Delete {type === 'subsection' ? 'Section' : type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        
        <p className="mb-4 text-sm opacity-90">
          Are you sure you want to delete <strong>{itemName}</strong>? This action is permanent and cannot be undone.
        </p>

        {type === 'category' && (
          <div className="mb-6 space-y-3">
            <p className="text-sm font-semibold mb-2">What should happen to pages in this category?</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={!deletePages} 
                onChange={() => setDeletePages(false)}
                className="w-4 h-4 text-[#214059]"
              />
              <span className="text-sm">Move them to Uncategorized</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-red-500">
              <input 
                type="radio" 
                checked={deletePages} 
                onChange={() => setDeletePages(true)}
                className="w-4 h-4 text-red-500"
              />
              <span className="text-sm">Delete all pages in this category</span>
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onCancel} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkTheme ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(type === 'category' ? { deletePages } : undefined)} 
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
