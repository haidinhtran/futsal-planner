import React from 'react';
import type { PositionTag } from '../../../types/futsal';
import { POSITION_TAG_CONFIG } from '../../../constants/positionTags';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Download,
  FileText,
} from 'lucide-react';

interface PlayerFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterPosition: 'all' | PositionTag;
  onPositionFilterChange: (pos: 'all' | PositionTag) => void;
  filterRated: 'all' | 'rated' | 'unrated';
  onRatedFilterChange: (rated: 'all' | 'rated' | 'unrated') => void;
  sortBy: 'number' | 'name' | 'total' | 'stamina' | 'attack' | 'defense';
  onSortByChange: (sort: 'number' | 'name' | 'total' | 'stamina' | 'attack' | 'defense') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isExportMenuOpen: boolean;
  onToggleExportMenu: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const PlayerFilterBar: React.FC<PlayerFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filterPosition,
  onPositionFilterChange,
  filterRated,
  onRatedFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  viewMode,
  onViewModeChange,
  isExportMenuOpen,
  onToggleExportMenu,
  onExportCSV,
  onExportPDF,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-3">
      {/* Top row: Search, Filter dropdowns & View Mode Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số áo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm xl:text-base bg-slate-50 border border-slate-200 rounded-btn focus:outline-none focus:border-blue-500 font-semibold"
          />
        </div>

        {/* Position Filter Dropdown */}
        <div className="relative flex items-center shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            value={filterPosition}
            onChange={(e) => onPositionFilterChange(e.target.value as 'all' | PositionTag)}
            className="bg-slate-50 text-slate-800 text-sm xl:text-base font-bold pl-8 pr-7 py-2 rounded-btn border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
          >
            <option value="all">Tất cả vị trí</option>
            {Object.keys(POSITION_TAG_CONFIG)
              .filter((key) => key !== 'AL')
              .map((tag) => (
                <option key={tag} value={tag}>
                  {POSITION_TAG_CONFIG[tag].fullLabel} ({POSITION_TAG_CONFIG[tag].shortLabel})
                </option>
              ))}
          </select>
          <div className="absolute right-2.5 pointer-events-none text-xs">▼</div>
        </div>

        {/* Rated Filter Dropdown */}
        <div className="relative flex items-center shrink-0">
          <select
            value={filterRated}
            onChange={(e) => onRatedFilterChange(e.target.value as 'all' | 'rated' | 'unrated')}
            className="bg-slate-50 text-slate-800 text-sm xl:text-base font-bold px-3 py-2 rounded-btn border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="rated">Đã đánh giá chỉ số</option>
            <option value="unrated">Chưa đánh giá</option>
          </select>
          <div className="absolute right-2.5 pointer-events-none text-xs">▼</div>
        </div>

        {/* Sort Dropdown & Asc/Desc Toggle */}
        <div className="flex items-center space-x-1 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) =>
                onSortByChange(
                  e.target.value as 'number' | 'name' | 'total' | 'stamina' | 'attack' | 'defense'
                )
              }
              className="bg-slate-50 text-slate-800 text-sm xl:text-base font-bold pl-8 pr-7 py-2 rounded-btn border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="number">Xếp theo Số áo</option>
              <option value="name">Xếp theo Tên</option>
              <option value="total">Xếp theo Tổng điểm</option>
              <option value="stamina">Xếp theo Thể lực</option>
              <option value="attack">Xếp theo Tấn công</option>
              <option value="defense">Xếp theo Phòng thủ</option>
            </select>
            <div className="absolute right-2.5 pointer-events-none text-xs">▼</div>
          </div>

          <button
            onClick={onSortOrderToggle}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-btn transition-colors cursor-pointer"
            title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          >
            <span className="text-sm xl:text-base font-black">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          </button>
        </div>

        {/* Grid vs List View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-btn shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-btn-sm transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Lưới Card"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-btn-sm transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Danh sách Bảng"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Export Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={onToggleExportMenu}
            className="flex items-center space-x-1 px-3 py-2 text-sm xl:text-base font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-btn transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Xuất file</span>
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
              <button
                onClick={onExportCSV}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Xuất CSV (Excel)</span>
              </button>
              <button
                onClick={onExportPDF}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span>In / Xuất PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
