import React from "react";
import { Settings, RefreshCw, Trash2, Maximize, Minimize } from "lucide-react";

interface Props {
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onResetPreset: () => void;
  onClearAllSlots: () => void;
  onToggleFullscreen: () => void;
}

export const TacticsMobileMenu: React.FC<Props> = ({
  isOpen,
  isFullscreen,
  onClose,
  onOpenSettings,
  onResetPreset,
  onClearAllSlots,
  onToggleFullscreen,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
        <button
          onClick={() => {
            onClose();
            onToggleFullscreen();
          }}
          className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 text-slate-500" />
          ) : (
            <Maximize className="w-4 h-4 text-slate-500" />
          )}
          <span>{isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}</span>
        </button>
        <button
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 border-t border-slate-100"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Cấu hình</span>
        </button>
        <button
          onClick={() => {
            onClose();
            onResetPreset();
          }}
          className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 border-t border-slate-100"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Đặt lại sơ đồ</span>
        </button>
        <button
          onClick={() => {
            onClose();
            onClearAllSlots();
          }}
          className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 border-t border-slate-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Xóa tất cả</span>
        </button>
      </div>
    </>
  );
};
