import React from "react";
import { GripVertical } from "lucide-react";
import type { PositionSlot, Player } from "@/types/futsal";
import { getEnglishRoleTitle, getRoleBadgeClass } from "@/utils/pitchHelpers";
import { PitchStarterCard } from "./PitchStarterCard";
import { PitchSubList } from "./PitchSubList";

interface PitchSlotCardProps {
  slot: PositionSlot;
  playersMap: Record<string, Player>;
  isSelected: boolean;
  showSubs?: boolean;
  isFullscreen: boolean;
  onSelectSlot: (slotId: string) => void;
  onOpenPicker: (slotId: string, mode: "main" | "sub") => void;
  onClearSlot: (slotId: string) => void;
  onClearSubPlayer?: (slotId: string, subPlayerId: string) => void;
  onPromoteSubToMain?: (slotId: string, subPlayerId: string) => void;
  onDropMain: (e: React.DragEvent, slotId: string) => void;
  onDropSub: (e: React.DragEvent, slotId: string) => void;
  onSlotDragStart: (e: React.DragEvent, slotId: string, playerId: string | null) => void;
  onSubDragStart: (e: React.DragEvent, playerId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const PitchSlotCard: React.FC<PitchSlotCardProps> = ({
  slot, playersMap, isSelected, showSubs = true, isFullscreen, onSelectSlot, onOpenPicker,
  onClearSlot, onClearSubPlayer, onPromoteSubToMain, onDropMain, onDropSub,
  onSlotDragStart, onSubDragStart, onDragOver,
}) => {
  const mainPlayer = slot.playerId ? playersMap[slot.playerId] : null;
  const subPlayerIds = slot.subPlayerIds || [];
  const subPlayers = subPlayerIds.map((id) => playersMap[id]).filter(Boolean);

  return (
    <div
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
      onClick={() => onSelectSlot(slot.id)}
      className={`pitch-player-card cursor-pointer group ${isSelected ? "ring-2 ring-yellow-400 z-30" : ""}`}
    >
      <div className="bg-white border border-slate-300 w-36 sm:w-40 xl:w-44 2xl:w-48 p-2 flex flex-col relative">
        <div className={`text-xs font-black uppercase py-0.5 px-1.5 flex items-center justify-between mb-1.5 leading-tight ${getRoleBadgeClass(slot.role)}`}>
          <span className="whitespace-normal break-words text-left flex-1 tracking-tight" title={slot.label}>
            {getEnglishRoleTitle(slot.role)}
          </span>
          <GripVertical className="w-3 h-3 opacity-80 cursor-move shrink-0 ml-1" />
        </div>

        <PitchStarterCard
          slotId={slot.id} mainPlayer={mainPlayer} isFullscreen={isFullscreen}
          onOpenPicker={onOpenPicker} onClearSlot={onClearSlot}
          onDropMain={onDropMain} onSlotDragStart={onSlotDragStart} onDragOver={onDragOver}
        />

        {showSubs && (
          <PitchSubList
            slotId={slot.id} role={slot.role} subPlayers={subPlayers} isFullscreen={isFullscreen}
            onPromoteSubToMain={onPromoteSubToMain} onClearSubPlayer={onClearSubPlayer}
            onOpenPicker={(id) => onOpenPicker(id, "sub")} onSubDragStart={onSubDragStart}
            onDropSub={onDropSub} onDragOver={onDragOver}
          />
        )}
      </div>
    </div>
  );
};
