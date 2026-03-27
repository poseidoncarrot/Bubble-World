import React from 'react';
import { Page } from '@/types';

interface StatusBarProps {
  syncStatus: 'syncing' | 'ready' | 'error';
  currentPage: Page | null;
  isTrial: boolean;
  timeRemaining: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  syncStatus,
  currentPage,
  isTrial,
  timeRemaining
}) => {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'sync';
      case 'ready':
        return 'cloud_done';
      case 'error':
        return 'cloud_off';
      default:
        return 'cloud_done';
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-yellow-600';
      case 'ready':
        return 'text-cyan-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-cyan-600';
    }
  };

  return (
    <div className="status-bar">
      {/* Sync Status */}
      <div className="flex flex-col items-center gap-1 cursor-pointer scale-105 duration-300">
        <span className={`material-symbols-outlined text-[16px] font-bold ${getSyncColor()}`}>
          {getSyncIcon()}
        </span>
        <span className={`font-inter text-[10px] uppercase tracking-widest font-bold ${getSyncColor()}`}>
          Sync: {syncStatus.charAt(0).toUpperCase() + syncStatus.slice(1)}
        </span>
      </div>

      {/* Current Page */}
      {currentPage && (
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-cyan-500 transition-all">
          <span className="material-symbols-outlined text-[16px] text-slate-400">
            article
          </span>
          <span className="font-inter text-[10px] uppercase tracking-widest text-slate-400">
            {currentPage.title.length > 15 
              ? currentPage.title.substring(0, 15) + '...'
              : currentPage.title
            }
          </span>
        </div>
      )}

      {/* Trial Timer */}
      {isTrial && (
        <div className="flex flex-col items-center gap-1 cursor-pointer text-orange-600 font-bold scale-105">
          <span className="material-symbols-outlined text-[16px]">
            timer
          </span>
          <span className="font-inter text-[10px] uppercase tracking-widest">
            {timeRemaining}
          </span>
        </div>
      )}

      {/* Recent Items (placeholder) */}
      <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-cyan-500 transition-all">
        <span className="material-symbols-outlined text-[16px] text-slate-400">
          history
        </span>
        <span className="font-inter text-[10px] uppercase tracking-widest text-slate-400">
          Recent
        </span>
      </div>

      {/* Settings */}
      <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-cyan-500 transition-all">
        <span className="material-symbols-outlined text-[16px] text-slate-400">
          update
        </span>
        <span className="font-inter text-[10px] uppercase tracking-widest text-slate-400">
          History
        </span>
      </div>
    </div>
  );
};
