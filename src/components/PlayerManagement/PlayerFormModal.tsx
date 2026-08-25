import React from "react";
import { createPortal } from "react-dom";
import { X, Check, AlertCircle } from "lucide-react";
import type { Player } from "@/types/futsal";
import { PlayerBasicInfoInputs } from "./PlayerBasicInfoInputs";
import { PlayerPositionCheckboxes } from "./PlayerPositionCheckboxes";
import { PlayerStatsSliders } from "./PlayerStatsSliders";

interface Props {
  isOpen: boolean;
  editingPlayer: Partial<Player> | null;
  isExisting: boolean;
  errorMsg: string | null;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onChangePlayer: (player: Partial<Player>) => void;
  onClearError: () => void;
  calculateTotal: (p: Player) => number;
}

export const PlayerFormModal: React.FC<Props> = ({
  isOpen, editingPlayer, isExisting, errorMsg,
  onClose, onSave, onChangePlayer, onClearError, calculateTotal,
}) => {
  if (!isOpen || !editingPlayer) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl rounded-none shadow-2xl border-0 sm:border sm:border-slate-200 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs shrink-0" />
            <h3 className="text-h3 text-slate-900 tracking-wide">
              {isExisting ? "CHỈNH SỬA CẦU THỦ" : "THÊM CẦU THỦ MỚI"}
            </h3>
          </div>
          <button
            type="button" onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={onSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <PlayerBasicInfoInputs
              editingPlayer={editingPlayer}
              onChangePlayer={onChangePlayer}
              onClearError={onClearError}
            />

            <PlayerPositionCheckboxes
              selectedPositions={editingPlayer.positions || []}
              onChange={(positions) => onChangePlayer({ ...editingPlayer, positions })}
            />

            <PlayerStatsSliders
              player={editingPlayer}
              onChange={onChangePlayer}
              calculateTotal={calculateTotal}
            />
          </div>

          {/* Fixed Sticky Footer Always Visible on Screen */}
          <div className="p-3.5 sm:p-4 bg-white sm:bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2.5 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-4">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-5 py-2.5 rounded-lg border-0 shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cầu Thủ</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
