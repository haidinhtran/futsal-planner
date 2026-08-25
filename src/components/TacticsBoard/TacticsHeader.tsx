import React from "react";
import { createPortal } from "react-dom";
import { RefreshCw, Trash2, Settings, Save, Maximize, Minimize } from "lucide-react";

interface TacticsHeaderProps {
  isFullscreen: boolean;
  onOpenSettings: () => void;
  onResetPreset: () => void;
  onClearAllSlots: () => void;
  onSaveSquad: () => void;
  onToggleFullscreen: () => void;
}

export const TacticsHeader: React.FC<TacticsHeaderProps> = ({
  isFullscreen,
  onOpenSettings,
  onResetPreset,
  onClearAllSlots,
  onSaveSquad,
  onToggleFullscreen,
}) => {
  if (isFullscreen || !document.getElementById("topbar-actions-portal")) return null;

  return createPortal(
    <div className="flex items-center justify-end gap-1.5 sm:gap-2 w-full">
      <button onClick={onResetPreset} className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors" title="Đặt lại sơ đồ">
        <RefreshCw className="btn-icon" />
      </button>
      <button onClick={onClearAllSlots} className="p-1.5 md:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa tất cả">
        <Trash2 className="btn-icon" />
      </button>
      <button onClick={onOpenSettings} className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors" title="Cấu hình">
        <Settings className="btn-icon" />
      </button>
      <button onClick={onToggleFullscreen} className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors" title={isFullscreen ? "Thoát Toàn Màn Hình" : "Toàn Màn Hình"}>
        {isFullscreen ? <Minimize className="btn-icon" /> : <Maximize className="btn-icon" />}
      </button>
      <button onClick={onSaveSquad} className="btn-primary" title="Lưu đội hình">
        <Save className="btn-icon" />
        <span className="btn-label">Lưu đội hình</span>
      </button>
    </div>,
    document.getElementById("topbar-actions-portal")!,
  );
};
