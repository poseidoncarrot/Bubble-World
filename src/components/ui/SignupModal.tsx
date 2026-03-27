import React from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
  timeRemaining: string;
  hasData: boolean;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSignup,
  timeRemaining,
  hasData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">timer</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            Save Your Work?
          </h2>
          <p className="text-on-surface-variant">
            You have {timeRemaining} left in your trial. Create an account to save your worldbuilding progress.
          </p>
        </div>

        {hasData && (
          <div className="bg-surface-container-low p-4 rounded-lg mb-6">
            <p className="text-sm text-on-surface-variant text-center">
              <span className="font-semibold text-primary">You have unsaved work!</span><br />
              Don't lose your creative progress.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onSignup}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Create Account & Save Work
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-surface-container-low text-primary font-semibold py-3 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            Continue with Local Storage
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-on-surface-variant">
            By creating an account, your work will be saved to the cloud and accessible from any device.
          </p>
        </div>
      </div>
    </div>
  );
};
