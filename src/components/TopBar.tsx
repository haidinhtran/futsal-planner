import React, { useState } from 'react';
import type { PositionTag, SavedTacticalDiagram } from '../types/futsal';
import { RefreshCw, Save, Plus, Search, Download, FileText, ChevronDown, Sparkles, Edit3, FolderOpen, FilePlus, Trash2 } from 'lucide-react';

export interface PlayerControlsData {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterPosition: 'all' | PositionTag;
  onPositionChange: (pos: 'all' | PositionTag) => void;
  sortBy: 'number' | 'name' | 'total' | 'stamina' | 'attack' | 'defense';
  onSortByChange: (sortBy: any) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onAddPlayer: () => void;
}

export interface DiagramControlsData {
  diagramName: string;
  isDirty: boolean;
  currentDiagramId: string | null;
  savedDiagrams: SavedTacticalDiagram[];
  onSaveDiagram: () => void;
  onLoadDiagram: (id: string) => void;
  onNewDiagram: () => void;
  onDeleteDiagram?: () => void;
}

interface TopBarProps {
  activeTab: 'tactics' | 'players' | 'presentation';
  onResetPreset?: () => void;
  onSaveSquad?: () => void;
  playerControls?: PlayerControlsData | null;
  diagramControls?: DiagramControlsData | null;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onResetPreset, onSaveSquad, playerControls, diagramControls }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const getTabMeta = () => {
    switch (activeTab) {
      case 'tactics':
        return {
          title: 'QUẢN LÝ ĐỘI HÌNH',
          subtitle: '',
        };
      case 'players':
        return {
          title: 'QUẢN LÝ CẦU THỦ',
          subtitle: '',
        };
      case 'presentation':
        return {
          title: 'MÔ PHỎNG CHIẾN THUẬT',
          subtitle: '',
        };
    }
  };

  const meta = getTabMeta();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none shrink-0 min-h-[61px]">
      {/* Title & Subtitle */}
      <div className="shrink-0 flex items-center space-x-2.5">
        <span className="w-3 h-3 bg-blue-600 rounded-xs shrink-0"></span>
        <div>
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg uppercase tracking-wider leading-tight">
            {meta.title}
          </h2>
          {meta.subtitle ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-500 hidden xl:block">
              {meta.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* Dynamic Actions for Tactics Tab */}
      {activeTab === 'tactics' && (
        <div className="flex items-center space-x-2 shrink-0">
          {onResetPreset && (
            <button
              onClick={onResetPreset}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Đặt lại sơ đồ</span>
            </button>
          )}

          {onSaveSquad && (
            <button
              onClick={onSaveSquad}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4.5 sm:py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg border-0 transition-all cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Lưu đội hình</span>
            </button>
          )}
        </div>
      )}

      {/* TOP Dynamic Actions for Players Tab */}
      {activeTab === 'players' && playerControls && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Search Input */}
          <div className="relative w-48 sm:w-60 xl:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên hoặc số áo..."
              value={playerControls.searchTerm}
              onChange={(e) => playerControls.onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Split Export Button Group - Design Token matching Đặt lại sơ đồ */}
          <div className="relative inline-flex items-center rounded-lg shadow-2xs bg-white border border-slate-300">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-r border-slate-200 rounded-l-lg"
              title="Xuất danh sách (.csv / .pdf)"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span>Xuất Danh Sách</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-2 py-1.5 sm:py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer rounded-r-lg"
              title="Tùy chọn xuất file (.csv / .pdf)"
            >
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {isExportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      playerControls.onExportCSV();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Xuất File CSV (.csv)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      playerControls.onExportPDF();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-left"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>Xuất File PDF (.pdf)</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Add Player Primary Button - Design Token matching Lưu đội hình */}
          <button
            onClick={playerControls.onAddPlayer}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4.5 sm:py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg border-0 transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Thêm Cầu Thủ</span>
          </button>
        </div>
      )}

      {/* TOP Dynamic Actions for Presentation (Diagram Simulation) Tab */}
      {activeTab === 'presentation' && diagramControls && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Diagram Name Badge & Rename Action */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 px-3 py-1.5 sm:py-2 rounded-lg text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
            <span className="font-extrabold text-slate-800 max-w-[140px] sm:max-w-[180px] truncate" title={diagramControls.diagramName}>
              {diagramControls.diagramName}
            </span>
            <button
              onClick={diagramControls.onSaveDiagram}
              className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors cursor-pointer"
              title="Đổi tên / Lưu bản vẽ"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {diagramControls.isDirty ? (
              <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                • Chưa lưu
              </span>
            ) : diagramControls.currentDiagramId ? (
              <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Đã lưu
              </span>
            ) : null}
          </div>

          {/* Saved Diagrams Selector Dropdown */}
          <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-sm min-w-[180px] sm:min-w-[210px]">
            <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={diagramControls.currentDiagramId || ''}
              onChange={(e) => diagramControls.onLoadDiagram(e.target.value)}
              className="bg-transparent font-extrabold focus:outline-none cursor-pointer text-slate-800 text-sm w-full min-w-0 pr-4 appearance-none"
            >
              <option value="">-- Bản vẽ đã lưu ({diagramControls.savedDiagrams.length}) --</option>
              {diagramControls.savedDiagrams.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({new Date(d.updatedAt).toLocaleDateString('vi-VN')})
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 pointer-events-none text-slate-400 text-xs">▼</span>
          </div>

          {/* New Diagram Button - Design Token matching Đặt lại sơ đồ */}
          <button
            onClick={diagramControls.onNewDiagram}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all cursor-pointer shadow-2xs shrink-0"
            title="Tạo bản vẽ chiến thuật mới"
          >
            <FilePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span>Bản vẽ mới</span>
          </button>

          {/* Save Diagram Primary Button - Design Token matching Lưu đội hình */}
          <button
            onClick={diagramControls.onSaveDiagram}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4.5 sm:py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg border-0 transition-all cursor-pointer shadow-xs shrink-0"
            title="Lưu bản vẽ"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Lưu Bản Vẽ</span>
          </button>

          {/* Delete Saved Diagram Button */}
          {diagramControls.onDeleteDiagram && diagramControls.currentDiagramId && (
            <button
              onClick={diagramControls.onDeleteDiagram}
              className="p-1.5 sm:p-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg border border-slate-200 hover:border-red-200 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
              title="Xóa bản vẽ này"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      )}
    </header>
  );
};
