import React from "react";
import { User, X } from "lucide-react";
import type { Player } from "@/types/futsal";
import { getVietnameseShortName } from "@/utils/pitchHelpers";

interface Props {
  slotId: string;
  mainPlayer: Player | null;
  isFullscreen: boolean;
  isMobile?: boolean;
  onOpenPicker: (slotId: string, mode: "main" | "sub") => void;
  onClearSlot: (slotId: string) => void;
  onDropMain: (e: React.DragEvent, slotId: string) => void;
  onSlotDragStart: (e: React.DragEvent, slotId: string, playerId: string | null) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const PitchStarterCard: React.FC<Props> = ({
  slotId,
  mainPlayer,
  isFullscreen,
  isMobile = false,
  onOpenPicker,
  onClearSlot,
  onDropMain,
  onSlotDragStart,
  onDragOver,
}) => {
  const canOpenPicker = isFullscreen || isMobile;

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDropMain(e, slotId)}
      draggable={!!mainPlayer}
      onDragStart={(e) => onSlotDragStart(e, slotId, mainPlayer?.id || null)}
      onClick={(e) => {
        if (canOpenPicker) {
          e.stopPropagation();
          onOpenPicker(slotId, "main");
        }
      }}
      className={`relative p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 ${
        canOpenPicker ? "cursor-pointer" : ""
      }`}
    >
      {mainPlayer ? (
        <div className="flex flex-col items-center relative text-center">
          <div className="w-full bg-blue-50 border border-blue-200 py-1 px-1.5 mb-1 flex items-center justify-between">
            <span className="text-xs xl:text-sm font-bold text-slate-900 truncate flex-1 min-w-0 pr-1 text-left" title={mainPlayer.name}>
              <span className="font-extrabold text-blue-600">#{mainPlayer.number}</span>
              <span className="text-slate-400 mx-0.5">-</span>
              <span>{getVietnameseShortName(mainPlayer.name)}</span>
            </span>
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClearSlot(slotId);
              }}
              className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 ml-1 cursor-pointer"
              title="Bỏ cầu thủ khỏi vị trí"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {mainPlayer.notes && mainPlayer.notes.trim() !== "" && (
            <div className="w-full px-1 py-0.5 bg-amber-50 border border-amber-200/90 text-amber-900 rounded text-xs font-semibold leading-tight truncate text-left" title={mainPlayer.notes}>
              📝 {mainPlayer.notes}
            </div>
          )}
        </div>
      ) : (
        <div className="py-2.5 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50/90 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
          <User className="w-4 h-4 text-slate-300 mb-0.5" />
          <span className="text-xs font-extrabold text-slate-400">
            {canOpenPicker ? "Chọn đá chính" : "Kéo cầu thủ vào đây"}
          </span>
        </div>
      )}
    </div>
  );
};
