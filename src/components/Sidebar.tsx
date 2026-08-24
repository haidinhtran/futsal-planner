import React from 'react';
import { Users, Layout, PenTool, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: 'tactics' | 'players' | 'presentation' | 'settings';
  setActiveTab: (tab: 'tactics' | 'players' | 'presentation' | 'settings') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const isExpanded = !isCollapsed;

  const renderNavItem = (
    id: 'tactics' | 'players' | 'presentation' | 'settings',
    label: string,
    IconComponent: React.ComponentType<any>
  ) => {
    const isActive = activeTab === id;

    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center rounded-lg text-sm transition-all cursor-pointer group ${isActive
          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
          : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-200/80'
          }`}
        title={!isExpanded ? label : undefined}
      >
        {/* Icon wrapper - Seamless single block without separate inner background */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive
            ? 'text-white bg-transparent'
            : 'bg-transparent text-slate-500 group-hover:text-blue-700'
            }`}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        {/* Text Label */}
        <span
          className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? 'opacity-100 max-w-xs ml-2 pr-3' : 'opacity-0 max-w-0 ml-0 pointer-events-none'
            }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <aside
      className={`${isExpanded ? 'w-64' : 'w-16'
        } fixed top-0 bottom-0 left-0 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-4 select-none transition-all duration-200 overflow-y-auto overflow-x-hidden`}
    >
      {/* Floating Collapse Arrow Button - Fixed position avoids overflow clipping */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className={`fixed top-5 w-6 h-6 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-md rounded-full flex items-center justify-center transition-all z-50 cursor-pointer ${isExpanded ? 'left-64 -ml-3' : 'left-16 -ml-3'}`}
        title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-6">
        {/* Logo & Brand Title Header - Stationary 32px center alignment (px-3 = 12px + 20px = 32px) */}
        <div className="relative flex items-center px-3 py-1">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-8 h-8 fill-blue-600">
              <path d="M60,31.46c0-.17,0-.34,0-.51v-.06c0-.21,0-.42,0-.62v0c0-.55-.08-1.09-.15-1.63s-.11-.81-.17-1.22l-.09-.49c-.05-.32-.12-.64-.19-1s-.09-.37-.13-.56a2.68,2.68,0,0,0-.07-.27l-1.89.69h0c.08.32.16.64.22,1s.1.45.13.68c.08.4.14.81.19,1.22s.1.81.13,1.22h0l-2.8,4.82-4.7-7.49v-8.6l4.89,1.84.36.74a.61.61,0,0,1,0,.12c.12.27.24.54.35.81s.24.57.34.86.22.58.31.87l1.87-.68-.36-1c-.13-.34-.27-.68-.41-1s-.29-.67-.44-1-.29-.62-.45-.93-.37-.7-.58-1-.24-.43-.37-.64a3.23,3.23,0,0,0-.3-.49A29.3,29.3,0,0,0,54,14.61,28.61,28.61,0,0,0,44.89,7.1L44.72,7c-.91-.45-1.84-.87-2.79-1.23h0l-1-.37L40,5.14c-.59-.18-1.19-.33-1.8-.47l-.59-.13c-.36-.08-.73-.14-1.09-.2s-.75-.12-1.12-.16l-.9-.1L34,4l-.65,0c-.44,0-.89,0-1.33,0s-.89,0-1.33,0L30,4l-.55,0-.9.1c-.37,0-.75.1-1.12.16s-.73.12-1.09.2c-.81.17-1.61.37-2.39.6l-.83.26-1,.37h0A27.77,27.77,0,0,0,19.28,7a.56.56,0,0,1-.17.09A27.61,27.61,0,0,0,10,14.61,24,24,0,0,0,8.31,17a3.23,3.23,0,0,0-.3.49c-.13.21-.26.42-.37.64-.37.64-.71,1.3-1,2-.15.33-.3.66-.44,1s-.28.67-.41,1l-.36,1,1.87.68c.1-.29.2-.58.31-.87a9,9,0,0,1,.34-.86c.1-.27.22-.54.35-.81a.61.61,0,0,0,.05-.12c.11-.25.23-.5.35-.74h0l4.89-1.83v8.6l-.54.87L8.87,34.71l-2.8-4.82h0c0-.41.07-.83.12-1.23s.11-.82.19-1.22c0-.23.08-.46.13-.68s.13-.64.21-1L4.83,25.1c0,.09,0,.18-.07.27s-.09.37-.13.56-.13.64-.19,1c0,.16-.06.32-.08.49-.07.41-.13.81-.18,1.22s-.1.94-.13,1.42c0,.07,0,.14,0,.21a0,0,0,0,0,0,0c0,.2,0,.41,0,.62V31c0,.17,0,.34,0,.51s0,.36,0,.54c0,.48,0,1,0,1.44s0,.86.09,1.28.06.58.1.87c.1.77.23,1.54.4,2.29.07.37.15.73.24,1.09a.65.65,0,0,1,0,.13c.11.41.23.82.35,1.23s.29.87.44,1.3A26.31,26.31,0,0,0,8,46.53a26.2,26.2,0,0,0,3.23,4.31c.19.22.39.43.59.64l.25.24c.34.35.7.69,1.06,1l.06.06c.31.28.63.55,1,.82A27,27,0,0,0,17.47,56a23.9,23.9,0,0,0,2.39,1.29,21.71,21.71,0,0,0,2.39,1l.3.11.76.26c.44.15.89.28,1.34.4l.73.19c.35.09.71.17,1.07.24l1.13.2.66.09.1,0,.86.1.27,0c.34,0,.69.06,1,.08h.15c.44,0,.89,0,1.34,0s.9,0,1.34,0h.15c.35,0,.7,0,1-.08l.27,0,.86-.1.1,0,.66-.09,1.13-.2,1.07-.24.73-.19c.45-.12.9-.25,1.34-.4l.76-.26.3-.11a24.17,24.17,0,0,0,2.39-1A26.13,26.13,0,0,0,46.53,56a29.33,29.33,0,0,0,3.29-2.35c.33-.27.65-.54,1-.82l.06-.06c.66-.6,1.3-1.24,1.9-1.9A28.34,28.34,0,0,0,56,46.53a28,28,0,0,0,2.36-4.9c.15-.43.3-.86.44-1.3s.24-.82.35-1.23a.5.5,0,0,0,0-.13c.09-.36.17-.72.24-1.09.17-.75.3-1.52.4-2.29,0-.29.07-.58.1-.87s.07-.85.09-1.28,0-1,0-1.44C60,31.82,60,31.64,60,31.46ZM40.15,7.28h0a23.88,23.88,0,0,1,3.39,1.39c.55.26,1.08.55,1.6.85h0a26.11,26.11,0,0,1,3.55,2.51l.17.15a25.5,25.5,0,0,1,3,3c.06.07.11.14.17.2.28.34.55.68.81,1l.33.46c.2.28.4.56.59.85h0l-4.88-1.83L42,10.31h0l-1.79-3h0Zm-3.07,33.3H26.92l-3.14-9.66L32,25l8.22,6Zm.27,2,3.95,5.93h0L36,54.39H28.05L22.7,48.52l3.95-5.94ZM22.52,29.37l-6.95-2.56v-8.7l6.63-5.35,8.8,2.4v8.05ZM33,23.21v-8l8.8-2.4,6.63,5.35v8.7l-7,2.56ZM26.62,6.54c.35-.08.71-.15,1.07-.21l.17,0A23.36,23.36,0,0,1,31,6h.12L32,6l.88,0H33a24.92,24.92,0,0,1,3.14.32l.17,0,1.07.2h0l2.74,4.61L33,13.08l-1,.27-1-.27-7.12-1.93ZM10.24,17.73h0a25.8,25.8,0,0,1,5.92-6.4,24.36,24.36,0,0,1,2.7-1.8h0a17.55,17.55,0,0,1,1.6-.85,23.88,23.88,0,0,1,3.39-1.39h0l-1.8,3h0l-6.93,5.6Zm1.54,30.64v0a25.26,25.26,0,0,1-2.71-4.07c-.17-.29-.31-.58-.45-.87s-.29-.59-.42-.89c-.27-.6-.51-1.21-.73-1.84A25.44,25.44,0,0,1,6,33.82L8,37.12l4.09,8.29ZM10,36.7l5-8,6.79,2.5h0l3.29,10.11-4,6L13.8,44.44ZM25.69,56.39l-.94.61c-.62-.17-1.24-.38-1.84-.61-.19-.06-.38-.14-.57-.22A25.57,25.57,0,0,1,20,55.08c-.4-.22-.8-.43-1.18-.66a25.2,25.2,0,0,1-3.21-2.23l0,0a24.71,24.71,0,0,1-1.94-1.75h0L14,46.65l6.9,2.8,4.49,4.94,1.27,1.4Zm10.42,1.3c-.6.09-1.2.18-1.81.24s-1.53.1-2.3.1-1.54,0-2.3-.1-1.51-.17-2.26-.3h0l1.88-1.23h5.32l1.88,1.23Zm12.35-5.53,0,0a27.79,27.79,0,0,1-3.21,2.23c-.39.23-.78.45-1.18.66-.77.4-1.57.76-2.38,1.09l-.57.22c-.6.23-1.21.43-1.84.61l-.94-.61-.92-.6,1.27-1.4,4.49-4.94,6.9-2.8.35,3.75C49.78,51,49.13,51.6,48.46,52.16Zm1.74-7.72L43,47.38l-1.84-2.76-2.18-3.27h0l3.29-10.1h0L49,28.73l5,8Zm6.33-3.72c-.22.63-.46,1.24-.73,1.84l-.42.89-.45.87a26.48,26.48,0,0,1-2.71,4l-.27-3L56,37.12,58,33.82A25.45,25.45,0,0,1,56.53,40.72Z"></path>
            </svg>
          </div>
          <div
            className={`transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs ml-2.5' : 'opacity-0 max-w-0 ml-0 pointer-events-none'
              }`}
          >
            <h1 className="text-h3 text-slate-900 leading-none whitespace-nowrap">FTSP</h1>
            <p className="text-body text-slate-500 mt-0.5 whitespace-nowrap">
              ftsp.haitran.dev
            </p>
          </div>
        </div>

        {/* Navigation List - 100% Stationary Icon Center Alignment (X=32px) in BOTH modes */}
        <nav className="space-y-1.5 px-3">
          {renderNavItem('tactics', 'Quản Lý Đội Hình', Layout)}
          {renderNavItem('players', 'Quản Lý Cầu Thủ', Users)}
          {renderNavItem('presentation', 'Mô Phỏng Chiến Thuật', PenTool)}
        </nav>
      </div>

      {/* Settings & Footer Section */}
      <div className="space-y-3 pt-3 border-t border-slate-200 px-3">
        {/* Settings Navigation Item */}
        <nav className="space-y-1.5">
          {renderNavItem('settings', 'Cài đặt hệ thống', Settings)}
        </nav>

        {/* Footer Credit - Hidden in Collapsed state */}
        <div
          className={`px-1 text-xs font-semibold text-slate-400 leading-tight transition-all duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 pointer-events-none'
            }`}
        >
          by AI - hẹ hẹ
        </div>
      </div>
    </aside>
  );
};
