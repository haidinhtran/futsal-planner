import React from 'react';
import { useTopbar } from '../context/TopbarContext';

export const Topbar: React.FC = () => {
  const { topbarContent } = useTopbar();

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs h-[52px] flex items-center px-3 sm:px-5 transition-all duration-200 shrink-0">
      <div className="w-full max-w-[2200px] mx-auto flex items-center justify-between">
        <div id="topbar-portal-root" className="w-full flex items-center">
          {topbarContent}
        </div>
      </div>
    </header>
  );
};
