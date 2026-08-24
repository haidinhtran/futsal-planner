import React from "react";
import { Sparkles, Edit3, FolderOpen, Trash2 } from "lucide-react";
import type { SavedTacticalDiagram } from "@/types/futsal";

interface HeaderProps {
  isFullscreen: boolean;
  diagramName: string;
  isDirty: boolean;
  currentDiagramId: string | null;
  savedDiagrams: SavedTacticalDiagram[];
  onSaveDiagram: () => void;
  onLoadDiagram: (id: string) => void;
  onDeleteCurrentDiagram: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isFullscreen,
  diagramName,
  isDirty,
  currentDiagramId,
  savedDiagrams,
  onSaveDiagram,
  onLoadDiagram,
  onDeleteCurrentDiagram,
}) => {
  if (isFullscreen) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4">
      {/* Diagram Name Badge & Rename Action */}
      <div className="flex items-center space-x-2 bg-white border border-slate-300 px-3 py-1.5 sm:py-2 rounded-lg text-sm font-medium shadow-sm flex-1 min-w-[200px]">
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
        <span
          className="font-extrabold text-slate-800 truncate flex-1"
          title={diagramName}
        >
          {diagramName}
        </span>
        <button
          onClick={onSaveDiagram}
          className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors cursor-pointer shrink-0"
          title="Đổi tên / Lưu bản vẽ"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {isDirty ? (
          <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 animate-pulse shrink-0">
            • Chưa lưu
          </span>
        ) : currentDiagramId ? (
          <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            ✓ Đã lưu
          </span>
        ) : null}
      </div>

      {/* Saved Diagrams Selector Dropdown */}
      <div className="relative flex items-center bg-white border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-sm min-w-[180px] sm:min-w-[210px] shadow-sm flex-1">
        <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 mr-1.5 shrink-0" />
        <select
          value={currentDiagramId || ""}
          onChange={(e) => onLoadDiagram(e.target.value)}
          className="bg-transparent font-extrabold focus:outline-none cursor-pointer text-slate-800 text-sm w-full min-w-0 pr-4 appearance-none"
        >
          <option value="">
            -- Bản vẽ đã lưu ({savedDiagrams.length}) --
          </option>
          {savedDiagrams.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({new Date(d.updatedAt).toLocaleDateString("vi-VN")})
            </option>
          ))}
        </select>
        <span className="absolute right-2.5 pointer-events-none text-slate-400 text-xs">
          ▼
        </span>
      </div>

      {/* Delete Saved Diagram Button */}
      {currentDiagramId && (
        <button
          onClick={onDeleteCurrentDiagram}
          className="btn-outline-danger shrink-0 p-2 bg-white"
          title="Xóa bản vẽ này"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};
