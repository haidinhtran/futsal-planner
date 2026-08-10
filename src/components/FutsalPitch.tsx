import React from 'react';
import type { PositionSlot, Player } from '../types/futsal';
import { User, X, GripVertical } from 'lucide-react';

interface FutsalPitchProps {
  slots: PositionSlot[];
  playersMap: Record<string, Player>;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  onAssignPlayerToSlot: (slotId: string, playerId: string) => void;
  onClearSlot: (slotId: string) => void;
  onSwapSlots: (slotIdA: string, slotIdB: string) => void;
}

// Smart helper function for Vietnamese short names (e.g. "Nguyễn Cao Tấn" -> "Cao Tấn", "Hồ Đắc Thạnh" -> "Đắc Thạnh")
export const getVietnameseShortName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  return parts.slice(-2).join(' ');
};

export const FutsalPitch: React.FC<FutsalPitchProps> = ({
  slots,
  playersMap,
  selectedSlotId,
  onSelectSlot,
  onAssignPlayerToSlot,
  onClearSlot,
  onSwapSlots,
}) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'GOALKEEPER':
        return 'bg-emerald-600 text-white';
      case 'FIXO':
        return 'bg-purple-600 text-white';
      case 'ALA_LEFT':
      case 'ALA_RIGHT':
        return 'bg-sky-600 text-white';
      case 'PIVOT':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault();
    const sourcePlayerId = e.dataTransfer.getData('text/player-id');
    const sourceSlotId = e.dataTransfer.getData('text/slot-id');

    if (sourceSlotId && sourceSlotId !== targetSlotId) {
      onSwapSlots(sourceSlotId, targetSlotId);
    } else if (sourcePlayerId) {
      onAssignPlayerToSlot(targetSlotId, sourcePlayerId);
    }
  };

  const handleSlotDragStart = (e: React.DragEvent, slotId: string, playerId: string | null) => {
    e.dataTransfer.setData('text/slot-id', slotId);
    if (playerId) {
      e.dataTransfer.setData('text/player-id', playerId);
    }
  };

  return (
    <div className="futsal-pitch-container w-full">
      {/* Outer Pitch Border & Playing Floor */}
      <div className="futsal-pitch-floor relative min-h-[480px]">
        {/* Court markings */}
        <div className="pitch-line pitch-center-line"></div>
        <div className="pitch-line pitch-center-circle"></div>
        <div className="pitch-line pitch-center-spot"></div>
        <div className="pitch-line pitch-penalty-left"></div>
        <div className="pitch-line pitch-penalty-right"></div>
        <div className="pitch-goal-left"></div>
        <div className="pitch-goal-right"></div>

        {/* Render 5 Position Slots on Court */}
        {slots.map((slot) => {
          const player = slot.playerId ? playersMap[slot.playerId] : null;
          const isSelected = selectedSlotId === slot.id;

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              draggable={!!player}
              onDragStart={(e) => handleSlotDragStart(e, slot.id, slot.playerId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slot.id)}
              onClick={() => onSelectSlot(slot.id)}
              className={`pitch-player-card cursor-pointer ${
                isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-30' : ''
              }`}
            >
              {/* Position Card Container */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-40 p-3 overflow-hidden flex flex-col transition-all">
                {/* Role Header Badge */}
                <div
                  className={`text-xs font-extrabold uppercase py-1 px-2.5 rounded-lg flex items-center justify-between mb-2.5 shadow-xs ${getRoleBadgeClass(
                    slot.role
                  )}`}
                >
                  <span className="truncate">{slot.label}</span>
                  <GripVertical className="w-3.5 h-3.5 opacity-80 cursor-grab" />
                </div>

                {player ? (
                  /* Player assigned */
                  <div className="flex flex-col items-center relative text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearSlot(slot.id);
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-opacity z-10 cursor-pointer"
                      title="Bỏ cầu thủ khỏi vị trí"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Top Row: Shirt Number & Centered Avatar */}
                    <div className="flex items-center justify-center space-x-2.5 mb-2 w-full">
                      <span className="text-xl font-black text-slate-900 leading-none">
                        {player.number}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Big Prominent Vietnamese Name on New Dedicated Row */}
                    <div className="w-full mb-2 px-1" title={player.name}>
                      <span className="text-sm font-black text-slate-900 block truncate leading-tight">
                        {getVietnameseShortName(player.name)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 block truncate">
                        {player.name}
                      </span>
                    </div>

                    {/* Stats List */}
                    <div className="w-full text-xs font-bold space-y-1 pt-2 border-t border-slate-100 text-left">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Thể Lực</span>
                        <span className="font-black text-emerald-600">{player.stamina ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Tấn Công</span>
                        <span className="font-black text-orange-600">{player.attack ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Phòng Thủ</span>
                        <span className="font-black text-blue-600">{player.defense ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty Slot Placeholder */
                  <div className="py-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 transition-colors">
                    <User className="w-7 h-7 text-slate-300 mb-1" />
                    <span className="text-xs font-bold text-slate-400">Chọn cầu thủ</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
