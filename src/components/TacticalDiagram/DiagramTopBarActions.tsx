import React from "react";
import { createPortal } from "react-dom";
import { FilePlus, Save, Sparkles, FolderOpen, Trash2 } from "lucide-react";
import type { SavedTacticalDiagram } from "@/types/futsal";

interface Props {
  isFullscreen: boolean;
  diagramName: string;
  isDirty: boolean;
  currentDiagramId: string | null;
  savedDiagrams: SavedTacticalDiagram[];
  onNewDiagram: () => void;
  onSaveDiagram: () => void;
  onLoadDiagram: (id: string) => void;
  onDeleteCurrentDiagram: () => void;
}

export const DiagramTopBarActions: React.FC<Props> = ({
  isFullscreen,
  diagramName,
  isDirty,
  currentDiagramId,
  savedDiagrams,
  onNewDiagram,
  onSaveDiagram,
  onLoadDiagram,
  onDeleteCurrentDiagram,
}) => {
  if (isFullscreen || !document.getElementById("topbar-actions-portal"))
    return null;

  return createPortal(
    <div className="flex items-center justify-end gap-1.5 sm:gap-2 w-full">
      <div className="hidden sm:flex items-center space-x-1.5 px-2 h-[38px] text-sm font-medium max-w-[140px] lg:max-w-[180px]">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span
          className="font-extrabold text-slate-800 truncate"
          title={diagramName}
        >
          {diagramName}
        </span>
        {isDirty ? (
          <span
            className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"
            title="Chưa lưu"
          />
        ) : currentDiagramId ? (
          <span
            className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
            title="Đã lưu"
          />
        ) : null}
      </div>

      <div className="relative flex items-center bg-white border border-slate-300 rounded-lg px-2 h-[38px] text-sm w-[130px] sm:w-[140px] lg:w-[180px] shadow-xs">
        <FolderOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
        <select
          value={currentDiagramId || ""}
          onChange={(e) => onLoadDiagram(e.target.value)}
          className="bg-transparent font-extrabold focus:outline-none cursor-pointer text-slate-800 text-xs w-full min-w-0 pr-4 appearance-none"
        >
          <option value="">-- Bản vẽ --</option>
          {savedDiagrams.map((d) => (
            <option key={d.id} value={d.id} title={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <span className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">
          ▼
        </span>
      </div>

      <button
        onClick={onNewDiagram}
        className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
        title="Bản vẽ mới"
      >
        <FilePlus className="btn-icon" />
      </button>

      {currentDiagramId && (
        <button
          onClick={onDeleteCurrentDiagram}
          className="p-1.5 md:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Xóa bản vẽ này"
        >
          <Trash2 className="btn-icon" />
        </button>
      )}

      <button
        onClick={onSaveDiagram}
        className="btn-primary"
        title="Lưu bản vẽ"
      >
        <Save className="btn-icon" />
        <span className="btn-label">Lưu bản vẽ</span>
      </button>
    </div>,
    document.getElementById("topbar-actions-portal")!,
  );
};
