import React from 'react';
import { X } from 'lucide-react';
import { Universe } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

interface EditorSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  universe: Universe;
  localUniverseName: string;
  setLocalUniverseName: (name: string) => void;
  localUniverseDescription: string;
  setLocalUniverseDescription: (description: string) => void;
  updateUniverse: (universeId: string, updates: Partial<Universe>) => Promise<void>;
  onDeleteUniverse: () => void;
}

export const EditorSettings: React.FC<EditorSettingsProps> = ({
  isOpen,
  onClose,
  universe,
  localUniverseName,
  setLocalUniverseName,
  localUniverseDescription,
  setLocalUniverseDescription,
  updateUniverse,
  onDeleteUniverse
}) => {
  const debouncedUpdateUniverseName = useDebounce(
    (universeId: string, name: string) => {
      updateUniverse(universeId, { name });
    },
    500
  );
  
  const debouncedUpdateUniverseDescription = useDebounce(
    (universeId: string, description: string) => {
      updateUniverse(universeId, { description });
    },
    500
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-[#214059] text-[24px]">Universe Settings</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400" /></button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Universe Name</label>
            <input 
              type="text" 
              value={localUniverseName}
              maxLength={30}
              onChange={(e) => {
                const value = e.target.value;
                setLocalUniverseName(value);
                if (universe?.id) {
                  debouncedUpdateUniverseName(universe.id, value);
                }
              }}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none text-black" 
              placeholder="Max 30 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Universe Description</label>
            <textarea 
              value={localUniverseDescription}
              maxLength={70}
              onChange={(e) => {
                const value = e.target.value;
                setLocalUniverseDescription(value);
                if (universe?.id) {
                  debouncedUpdateUniverseDescription(universe.id, value);
                }
              }}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none resize-none h-24 text-black" 
              placeholder="35 chars per row, 2 rows max"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select 
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-black outline-none"
              value={universe.settings?.theme || 'Light (Default)'}
              onChange={(e) => updateUniverse(universe.id, { settings: { ...universe.settings, theme: e.target.value } })}
            >
              <option value="Light (Default)">Light (Default)</option>
              <option value="Dark">Dark</option>
              <option value="Parchment">Parchment</option>
            </select>
          </div>
          <div className="pt-4 border-t">
            <button onClick={() => {
              onClose();
              onDeleteUniverse();
            }} className="text-red-500 hover:underline font-medium text-sm">
              Delete Universe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
