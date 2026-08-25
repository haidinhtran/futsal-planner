import React from "react";
import { createPortal } from "react-dom";
import { RefreshCw, Trash2, Settings, Save, MoreVertical, Maximize, Minimize } from "lucide-react";
import { TacticsMobileMenu } from "./TacticsMobileMenu";

interface TacticsHeaderProps {
  isSticky: boolean;
  isFullscreen: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  isMoreMenuOpen: boolean;
  onSetIsMoreMenuOpen: (val: boolean) => void;
  onOpenSettings: () => void;
  onResetPreset: () => void;
  onClearAllSlots: () => void;
  onSaveSquad: () => void;
  onToggleFullscreen: () => void;
}

export const TacticsHeader: React.FC<TacticsHeaderProps> = ({
  isSticky,
  isFullscreen,
  sentinelRef,
  isMoreMenuOpen,
  onSetIsMoreMenuOpen,
  onOpenSettings,
  onResetPreset,
  onClearAllSlots,
  onSaveSquad,
  onToggleFullscreen,
}) => {
  return (
    <>
      {document.getElementById("topbar-actions-portal") &&
        createPortal(
          <div className={`items-center justify-end gap-1.5 sm:gap-2 w-full ${isSticky ? "flex" : "hidden md:flex"}`}>
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
        )}

      <div ref={sentinelRef} className="w-full h-[1px]" />

      <div className="md:hidden w-full max-w-[1920px] mx-auto layout-page-container pt-1 pb-3 border-b border-slate-200 mb-4">
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="relative sm:hidden">
            <button
              onClick={() => onSetIsMoreMenuOpen(!isMoreMenuOpen)}
              className="btn-outline px-2 py-2.5 flex items-center justify-center shrink-0 shadow-xs rounded-lg"
              title="Thêm tùy chọn"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
            <TacticsMobileMenu
              isOpen={isMoreMenuOpen}
              isFullscreen={isFullscreen}
              onClose={() => onSetIsMoreMenuOpen(false)}
              onOpenSettings={onOpenSettings}
              onResetPreset={onResetPreset}
              onClearAllSlots={onClearAllSlots}
              onToggleFullscreen={onToggleFullscreen}
            />
          </div>
          <button onClick={onSaveSquad} className="btn-primary flex-1 sm:flex-none justify-center py-2.5 text-sm whitespace-nowrap">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Lưu đội hình</span>
          </button>
        </div>
      </div>
    </>
  );
};
