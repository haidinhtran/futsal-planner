import React, { useRef, useState, useEffect } from 'react';
import {
  Layout,
  Users,
  PenTool,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';
import { storageService } from '../services/storageService';

import { FtspLogoIcon } from '../assets/icons/FtspLogoIcon';

interface SidebarProps {
  activeTab: 'players' | 'tactics' | 'presentation';
  setActiveTab: (tab: 'players' | 'tactics' | 'presentation') => void;
  onDataRefresh: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onDataRefresh }) => {
  // Sidebar expanded / collapsed state (Mode 1: Collapsed default, Mode 2: Expanded)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showToolsMenu, setShowToolsMenu] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Close tools popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = () => {
    storageService.exportBackup();
    setShowToolsMenu(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setShowToolsMenu(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await storageService.importBackup(file);
        alert('Nhập dữ liệu thành công!');
        onDataRefresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Lỗi nhập dữ liệu!';
        alert(message);
      }
      e.target.value = '';
    }
  };

  const handleReset = () => {
    setShowToolsMenu(false);
    if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu 14 cầu thủ & đội hình về mặc định?')) {
      storageService.resetAllData();
      onDataRefresh();
    }
  };

  const navItems = [
    {
      id: 'tactics' as const,
      label: 'Thiết Kế Thế Trận',
      icon: Layout,
    },
    {
      id: 'players' as const,
      label: 'Quản Lý Cầu Thủ',
      icon: Users,
    },
    {
      id: 'presentation' as const,
      label: 'Diễn Giải Chiến Thuật',
      icon: PenTool,
    },
  ];

  return (
    <>
      {/* Hidden File Input for Data Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (Fixed Left Sidebar for md+ screens)          */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 left-0 z-40 bg-slate-900 border-r border-slate-800/90 shadow-xl transition-all duration-300 select-none shrink-0 ${
          isExpanded ? 'w-64' : 'w-[64px]'
        }`}
      >
        {/* BRAND LOGO HEADER */}
        <div className="h-[52px] flex items-center justify-between px-2.5 border-b border-slate-800/80 shrink-0">
          {isExpanded ? (
            <div className="flex items-center space-x-2.5 px-2 overflow-hidden">
              <div className="w-9 h-9 rounded-btn bg-blue-600 shadow-md shadow-blue-500/30 flex items-center justify-center p-1.5 shrink-0 text-white">
                <FtspLogoIcon />
              </div>
              <div className="truncate">
                <h1 className="text-base font-black text-white tracking-tight leading-none">FTSP</h1>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5 truncate">
                  Futsal Planner
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center group relative">
              <div className="w-10 h-10 rounded-btn bg-blue-600 shadow-md shadow-blue-500/30 flex items-center justify-center p-2 text-white cursor-pointer hover:scale-105 transition-transform">
                <FtspLogoIcon />
              </div>
              {/* Tooltip for Logo in Collapsed Mode */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-slate-950 text-white text-xs font-black px-3 py-1.5 rounded-btn shadow-xl whitespace-nowrap border border-slate-800">
                  FTSP - Futsal Planner
                </div>
                <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -left-1 top-1/2 -translate-y-1/2 border-l border-b border-slate-800"></div>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION ITEMS LIST */}
        <nav className="flex-1 px-2 py-3 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center transition-all cursor-pointer rounded-btn ${
                    isExpanded ? 'px-3 py-2.5 justify-start space-x-3' : 'p-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/90 font-bold'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {isExpanded && <span className="text-xs truncate tracking-tight">{item.label}</span>}
                </button>

                {/* MODE 1 TOOLTIP: Displayed on Hover when Sidebar is Collapsed (!isExpanded) */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                    <div className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-btn shadow-xl whitespace-nowrap border border-slate-800">
                      {item.label}
                    </div>
                    <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -left-1 top-1/2 -translate-y-1/2 border-l border-b border-slate-800"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* DATA / TOOLS SECTION ("Công cụ") */}
        <div className="px-2 py-2 border-t border-slate-800/80 shrink-0 relative" ref={toolsMenuRef}>
          <div className="relative group">
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className={`w-full flex items-center transition-all cursor-pointer rounded-btn border ${
                isExpanded ? 'px-3 py-2 justify-start space-x-3' : 'p-2.5 justify-center'
              } ${
                showToolsMenu
                  ? 'bg-slate-800 text-blue-400 border-blue-500/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80'
              }`}
            >
              <Wrench className="w-5 h-5 text-slate-300 shrink-0" />
              {isExpanded && <span className="text-xs font-bold truncate">Công cụ</span>}
            </button>

            {/* Tooltip for Công cụ in Collapsed Mode */}
            {!isExpanded && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-btn shadow-xl whitespace-nowrap border border-slate-800">
                  Công cụ & Tùy chọn dữ liệu
                </div>
                <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -left-1 top-1/2 -translate-y-1/2 border-l border-b border-slate-800"></div>
              </div>
            )}
          </div>

          {/* Tools Menu Popover / Dropdown */}
          {showToolsMenu && (
            <div
              className={`absolute bottom-full mb-2 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                isExpanded ? 'left-3 right-3' : 'left-full ml-2 w-48'
              }`}
            >
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-800 mb-1">
                Quản lý dữ liệu
              </div>
              <button
                onClick={handleExport}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Xuất JSON</span>
              </button>
              <button
                onClick={handleImportClick}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Nhập JSON</span>
              </button>
              <div className="h-px bg-slate-800 my-1"></div>
              <button
                onClick={handleReset}
                className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>Khôi phục Mặc định</span>
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR COLLAPSE / EXPAND TOGGLE BUTTON */}
        <div className="p-2 border-t border-slate-800/80 shrink-0">
          <div className="relative group">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-btn border border-slate-700/80 transition-all cursor-pointer shadow-2xs ${
                isExpanded ? 'space-x-2' : ''
              }`}
              title={isExpanded ? 'Thu gọn thanh bên' : 'Mở rộng thanh bên'}
            >
              {isExpanded ? (
                <>
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-slate-300">Thu gọn</span>
                </>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Tooltip for Toggle Button in Collapsed Mode */}
            {!isExpanded && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-btn shadow-xl whitespace-nowrap border border-slate-800">
                  Mở rộng thanh bên
                </div>
                <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -left-1 top-1/2 -translate-y-1/2 border-l border-b border-slate-800"></div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE BAR (< md screens)                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 bg-slate-100 rounded-xl cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-blue-600 text-base">FTSP</span>
        </div>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-600 bg-slate-50'
                }`}
              >
                <IconComp className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full shadow-2xl p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg text-blue-600">FTSP</span>
                  <span className="text-xs text-slate-400 font-bold">Futsal Planner</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Công cụ dữ liệu
              </div>
              <button
                onClick={handleExport}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-blue-500" />
                <span>Xuất JSON</span>
              </button>
              <button
                onClick={handleImportClick}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl flex items-center space-x-2"
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Nhập JSON</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4 text-red-500" />
                <span>Khôi phục Mặc định</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};
