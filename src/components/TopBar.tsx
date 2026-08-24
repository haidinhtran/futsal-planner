import React, { useState } from "react";
import type { PositionTag } from "../types/futsal";
import {
  RefreshCw,
  Save,
  Plus,
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  FilePlus,
} from "lucide-react";

export interface PlayerControlsData {
  filterPosition: "all" | PositionTag;
  onPositionChange: (pos: "all" | PositionTag) => void;
  sortBy: "number" | "name" | "total" | "stamina" | "attack" | "defense";
  onSortByChange: (sortBy: any) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onExportXLSX: () => void;
  onExportPDF: () => void;
  onAddPlayer: () => void;
}

export interface DiagramControlsData {
  onSaveDiagram: () => void;
  onLoadDiagram: (id: string) => void;
  onNewDiagram: () => void;
}

interface TopBarProps {
  activeTab: "tactics" | "players" | "presentation" | "settings";
  onResetPreset?: () => void;
  onSaveSquad?: () => void;
  playerControls?: PlayerControlsData | null;
  diagramControls?: DiagramControlsData | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onResetPreset,
  onSaveSquad,
  playerControls,
  diagramControls,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const getTabMeta = () => {
    switch (activeTab) {
      case "tactics":
        return {
          title: "QUẢN LÝ ĐỘI HÌNH",
          subtitle: "",
        };
      case "players":
        return {
          title: "QUẢN LÝ CẦU THỦ",
          subtitle: "",
        };
      case "presentation":
        return {
          title: "MÔ PHỎNG CHIẾN THUẬT",
          subtitle: "",
        };
      case "settings":
        return {
          title: "CÀI ĐẶT HỆ THỐNG",
          subtitle: "",
        };
    }
  };

  const meta = getTabMeta();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 layout-page-container py-2.5 flex flex-wrap items-center justify-between gap-3 select-none shrink-0 min-h-[61px]">
      {/* Title & Subtitle */}
      <div className="shrink-0 flex items-center space-x-2.5">
        <span className="w-3 h-3 bg-blue-600 rounded-xs shrink-0"></span>
        <div>
          <h2 className="text-h2 text-slate-900 leading-tight">
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
      {activeTab === "tactics" && (
        <div className="flex items-center space-x-2 shrink-0">
          {onResetPreset && (
            <button
              onClick={onResetPreset}
              className="btn-outline"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Đặt lại sơ đồ</span>
            </button>
          )}

          {onSaveSquad && (
            <button
              onClick={onSaveSquad}
              className="btn-primary"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Lưu đội hình</span>
            </button>
          )}
        </div>
      )}

      {/* TOP Dynamic Actions for Players Tab */}
      {activeTab === "players" && playerControls && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Split Export Button Group - Design Token matching Đặt lại sơ đồ */}
          <div className="relative inline-flex items-center rounded-lg shadow-2xs bg-white border border-slate-300">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-r border-slate-200 rounded-l-lg"
              title="Xuất danh sách (.xlsx / .pdf)"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="">Xuất Danh Sách</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-2 py-1.5 sm:py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer rounded-r-lg"
              title="Tùy chọn xuất file (.xlsx / .pdf)"
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
                      playerControls.onExportXLSX();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span>Xuất File XLSX (.xlsx)</span>
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
            className="btn-primary shrink-0 !px-3 sm:!px-4"
            title="Thêm Cầu Thủ"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="">Thêm Cầu Thủ</span>
          </button>
        </div>
      )}

      {/* TOP Dynamic Actions for Presentation (Diagram Simulation) Tab */}
      {activeTab === "presentation" && diagramControls && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          {/* New Diagram Button - Design Token matching Đặt lại sơ đồ */}
          <button
            onClick={diagramControls.onNewDiagram}
            className="btn-outline shrink-0 !px-3 sm:!px-4"
            title="Tạo bản vẽ chiến thuật mới"
          >
            <FilePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span className="">Bản vẽ mới</span>
          </button>

          {/* Save Diagram Primary Button - Design Token matching Lưu đội hình */}
          <button
            onClick={diagramControls.onSaveDiagram}
            className="btn-primary shrink-0 !px-3 sm:!px-4"
            title="Lưu bản vẽ"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="">Lưu Bản Vẽ</span>
          </button>
        </div>
      )}
    </header>
  );
};
