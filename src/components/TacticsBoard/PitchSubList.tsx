import React from "react";
import { Users, ChevronUp, X } from "lucide-react";
import type { Player } from "@/types/futsal";
import { getVietnameseShortName, getRoleBorderLeftClass } from "@/utils/pitchHelpers";

interface PitchSubListProps {
  slotId: string;
  role: string;
  subPlayers: Player[];
  isFullscreen: boolean;
  isMobile?: boolean;
  onPromoteSubToMain?: (slotId: string, subPlayerId: string) => void;
  onClearSubPlayer?: (slotId: string, subPlayerId: string) => void;
  onOpenPicker?: (slotId: string) => void;
  onSubDragStart?: (e: React.DragEvent, playerId: string) => void;
  onDropSub?: (e: React.DragEvent, slotId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

export const PitchSubList: React.FC<PitchSubListProps> = ({
  slotId, role, subPlayers, isFullscreen, isMobile = false,
  onPromoteSubToMain, onClearSubPlayer, onOpenPicker,
  onSubDragStart, onDropSub, onDragOver,
}) => {
  const canOpenPicker = isFullscreen || isMobile;

  return (
    <div onDragOver={onDragOver} onDrop={(e) => onDropSub && onDropSub(e, slotId)} className="mt-2 pt-1.5 border-t border-slate-200 text-left">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase mb-1">
        <span className="flex items-center space-x-1">
          <Users className="w-3 h-3 text-slate-400" />
          <span>Dự bị ({subPlayers.length}/5)</span>
        </span>
      </div>

      <div className="space-y-1">
        {subPlayers.map((subP) => (
          <div
            key={subP.id} draggable
            onDragStart={(e) => onSubDragStart && onSubDragStart(e, subP.id)}
            className={`relative group/sub flex items-center justify-between bg-slate-50 hover:bg-slate-100/90 rounded border border-slate-200/90 ${getRoleBorderLeftClass(role)} border-l-4 py-1 px-1.5 text-xs transition-all shadow-2xs`}
          >
            <span className="font-bold text-slate-800 truncate flex-1 min-w-0 pr-1" title={`#${subP.number} ${subP.name}`}>
              <span className="font-extrabold text-blue-600">#{subP.number}</span>
              <span className="text-slate-400 mx-0.5">-</span>
              <span>{getVietnameseShortName(subP.name)}</span>
            </span>

            <div className="flex items-center space-x-0.5 shrink-0 opacity-80 group-hover/sub:opacity-100">
              {onPromoteSubToMain && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onPromoteSubToMain(slotId, subP.id); }}
                  className="p-0.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  title="Đôn lên làm đá chính"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              )}
              {onClearSubPlayer && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onClearSubPlayer(slotId, subP.id); }}
                  className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Gỡ khỏi dự bị"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {subPlayers.length < 5 && (
          <div
            onClick={(e) => {
              if (canOpenPicker) {
                e.stopPropagation();
                onOpenPicker?.(slotId);
              }
            }}
            className={`w-full py-1 border border-dashed border-slate-200 rounded text-center text-xs font-semibold text-slate-400 ${
              canOpenPicker ? "hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-300 cursor-pointer" : "cursor-default"
            } transition-colors`}
          >
            {canOpenPicker ? "+ Thêm dự bị" : "+ Kéo dự bị vào đây"}
          </div>
        )}
      </div>
    </div>
  );
};
