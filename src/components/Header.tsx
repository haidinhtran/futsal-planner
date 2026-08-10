import React, { useRef } from 'react';
import { Users, Layout, PenTool, Download, Upload, RotateCcw, ShieldCheck } from 'lucide-react';
import { storageService } from '../services/storageService';

interface HeaderProps {
  activeTab: 'players' | 'tactics' | 'presentation';
  setActiveTab: (tab: 'players' | 'tactics' | 'presentation') => void;
  onDataRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onDataRefresh }) => {
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

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu 14 cầu thủ & đội hình về mặc định?')) {
      storageService.resetAllData();
      onDataRefresh();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight">Futsal Tactics & Squad Planner</h1>
              <p className="text-xs text-slate-500 font-medium">Quản lý cầu thủ & Thiết kế thế trận Futsal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab('tactics')}
              className={`flex items-center space-x-2 px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'tactics'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Thiết kế Thế trận</span>
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center space-x-2 px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'players'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản lý Cầu thủ</span>
            </button>

            <button
              onClick={() => setActiveTab('presentation')}
              className={`flex items-center space-x-2 px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'presentation'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Diễn giải Chiến thuật</span>
            </button>
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleExport}
              title="Xuất file JSON sao lưu"
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất File</span>
            </button>

            <button
              onClick={handleImportClick}
              title="Nhập file JSON sao lưu"
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nhập File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleReset}
              title="Khôi phục dữ liệu ban đầu"
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200/70 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mặc định</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
