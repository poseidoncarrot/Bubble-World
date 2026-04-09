/**
 * EditorModals component - Modal dialogs for editor operations
 * 
 * This file contains three modal components for the editor:
 * 1. CreateCategoryModal - Dialog for creating new categories
 * 2. RenameCategoryModal - Dialog for renaming existing categories
 * 3. CreatePageModal - Dialog for creating new pages in a specific category
 * 
 * All modals share:
 * - Conditional rendering based on isOpen prop
 * - Backdrop blur overlay
 * - Keyboard support (Enter to submit)
 * - Cancel and confirm buttons
 * - Consistent styling
 * 
 * TODO: Add validation for category names (no duplicates)
 * TODO: Add validation for page names (no duplicates in category)
 * TODO: Add category icon selection
 * TODO: Add page template selection
 */

import React from 'react';

/**
 * CreateCategoryModal - Modal for creating a new category
 * 
 * Allows users to create a new category to organize pages.
 * The category name is entered and submitted via the onCreate callback.
 */
interface CreateCategoryModalProps {
  isOpen: boolean;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  onCreateCategory: () => void;
  onClose: () => void;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  newCategoryName,
  setNewCategoryName,
  onCreateCategory,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[400px]">
        <h3 className="text-xl font-bold text-[#214059] mb-4">New Category</h3>
        <input
          type="text"
          autoFocus
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="e.g. World Bible, Locations..."
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#214059] outline-none text-black"
          onKeyDown={(e) => e.key === 'Enter' && onCreateCategory()}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={onCreateCategory} className="px-4 py-2 bg-[#214059] text-white rounded-lg hover:bg-opacity-90">Create</button>
        </div>
      </div>
    </div>
  );
};

/**
 * RenameCategoryModal - Modal for renaming an existing category
 * 
 * Allows users to rename a category. The new name is entered
 * and submitted via the onRename callback.
 */
interface RenameCategoryModalProps {
  isOpen: boolean;
  renameCategoryValue: string;
  setRenameCategoryValue: (value: string) => void;
  onRenameCategory: () => void;
  onClose: () => void;
}

export const RenameCategoryModal: React.FC<RenameCategoryModalProps> = ({
  isOpen,
  renameCategoryValue,
  setRenameCategoryValue,
  onRenameCategory,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[400px]">
        <h3 className="text-xl font-bold text-[#214059] mb-4">Rename Category</h3>
        <input
          type="text"
          autoFocus
          value={renameCategoryValue}
          onChange={(e) => setRenameCategoryValue(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#214059] outline-none text-black"
          onKeyDown={(e) => e.key === 'Enter' && onRenameCategory()}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={onRenameCategory} className="px-4 py-2 bg-[#214059] text-white rounded-lg hover:bg-opacity-90">Rename</button>
        </div>
      </div>
    </div>
  );
};

/**
 * CreatePageModal - Modal for creating a new page in a category
 * 
 * Allows users to create a new page within a specific category.
 * The page title is entered and submitted via the onCreate callback.
 * The category name is displayed in the modal header for context.
 */
interface CreatePageModalProps {
  isOpen: boolean;
  newPageTitle: string;
  setNewPageTitle: (title: string) => void;
  newPageCategory: string;
  onCreatePage: () => void;
  onClose: () => void;
}

export const CreatePageModal: React.FC<CreatePageModalProps> = ({
  isOpen,
  newPageTitle,
  setNewPageTitle,
  newPageCategory,
  onCreatePage,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[400px]">
        <h3 className="text-xl font-bold text-[#214059] mb-4">New Page in {newPageCategory}</h3>
        <input
          type="text"
          autoFocus
          value={newPageTitle}
          onChange={(e) => setNewPageTitle(e.target.value)}
          placeholder="Page title"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-[#214059] outline-none text-black"
          onKeyDown={(e) => e.key === 'Enter' && onCreatePage()}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={onCreatePage} className="px-4 py-2 bg-[#214059] text-white rounded-lg hover:bg-opacity-90">Create</button>
        </div>
      </div>
    </div>
  );
};
