import React, { useRef } from 'react';
import { Users, Layout, PenTool, Download, Upload, LogIn, LogOut, Cloud } from 'lucide-react';
import { storageService } from '../services/storageService';
import type { UserProfile } from '../services/supabaseService';

interface HeaderProps {
  activeTab: 'players' | 'tactics' | 'presentation';
  setActiveTab: (tab: 'players' | 'tactics' | 'presentation') => void;
  onDataRefresh: () => void;
  userProfile?: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDataRefresh,
  userProfile,
  onOpenAuthModal,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    storageService.exportBackup();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await storageService.importBackup(file);
        alert('Nhập dữ liệu thành công!');
        onDataRefresh();
      } catch (err: any) {
        alert(err.message || 'Lỗi nhập dữ liệu!');
      }
      e.target.value = '';
    }
  };

  return (
    <>
      {/* Top Header Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12 7 9.5 9.5 10.5 13 13.5 13 14.5 9.5 12 7" fill="currentColor" />
                  <path d="M12 7V2" />
                  <path d="M9.5 9.5 5 7" />
                  <path d="M10.5 13 7.5 17.5" />
                  <path d="M13.5 13 16.5 17.5" />
                  <path d="M14.5 9.5 19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-blue-600 tracking-tight leading-none">
                  FTSP
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold hidden sm:block">
                  Futsal Tactics & Squad Planner
                </p>
              </div>
            </div>

            {/* Main Navigation Tabs (Desktop / Tablet) */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setActiveTab('tactics')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'tactics'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Thiết Kế Thế Trận</span>
              </button>

              <button
                onClick={() => setActiveTab('players')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'players'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Quản Lý Cầu Thủ</span>
              </button>

              <button
                onClick={() => setActiveTab('presentation')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'presentation'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Diễn Giải Chiến Thuật</span>
              </button>
            </nav>

            {/* Secondary Actions & User Auth */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Export/Import JSON */}
              <button
                onClick={handleExport}
                className="flex items-center space-x-1 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Xuất dữ liệu LocalStorage ra file JSON"
              >
                <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Xuất JSON</span>
              </button>

              <button
                onClick={handleImportClick}
                className="flex items-center space-x-1 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Nhập dữ liệu từ file JSON"
              >
                <Upload className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Nhập JSON</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />

              <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>

              {/* Supabase User Auth Badge */}
              {userProfile ? (
                <div className="flex items-center space-x-1.5 bg-blue-50 border border-blue-200/80 px-2.5 py-1.5 rounded-xl">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.fullName}
                      className="w-5 h-5 rounded-full object-cover border border-blue-300"
                    />
                  ) : (
                    <Cloud className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-blue-900 max-w-[100px] sm:max-w-[140px] truncate hidden sm:inline">
                    {userProfile.fullName}
                  </span>
                  <button
                    onClick={onLogout}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer ml-1"
                    title="Đăng xuất khỏi Supabase"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  title="Đăng nhập tài khoản Supabase"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1 flex items-center justify-around shadow-lg pb-safe">
        <button
          onClick={() => setActiveTab('tactics')}
          className={`flex flex-col items-center space-y-0.5 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'tactics' ? 'text-blue-600 font-black scale-105' : 'text-slate-500 font-bold hover:text-slate-900'
          }`}
        >
          <Layout className="w-5 h-5" />
          <span className="text-[10px]">Thế Trận</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`flex flex-col items-center space-y-0.5 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'players' ? 'text-blue-600 font-black scale-105' : 'text-slate-500 font-bold hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Cầu Thủ</span>
        </button>

        <button
          onClick={() => setActiveTab('presentation')}
          className={`flex flex-col items-center space-y-0.5 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'presentation' ? 'text-blue-600 font-black scale-105' : 'text-slate-500 font-bold hover:text-slate-900'
          }`}
        >
          <PenTool className="w-5 h-5" />
          <span className="text-[10px]">Diễn Giải</span>
        </button>
      </div>
    </>
  );
};
