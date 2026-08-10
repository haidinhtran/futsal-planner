import React from 'react';
import type { PositionSlot, Player } from '../types/futsal';
import { POSITION_TAG_CONFIG } from '../types/futsal';
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
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-[168px] p-2.5 overflow-hidden flex flex-col transition-all">
                {/* Role Header Badge */}
                <div
                  className={`text-[9.5px] sm:text-[10.5px] font-black uppercase py-1 px-1.5 rounded-lg flex items-center justify-between mb-2 shadow-xs leading-tight ${getRoleBadgeClass(
                    slot.role
                  )}`}
                >
                  <span className="whitespace-normal break-words text-center flex-1 tracking-tighter" title={slot.label}>
                    {slot.label}
                  </span>
                  <GripVertical className="w-3 h-3 opacity-80 cursor-grab shrink-0 ml-1" />
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

                    {/* Top Row: Shirt Number & Avatar (Only if custom image present) */}
                    <div className="flex items-center justify-center space-x-2 mb-1 w-full">
                      {player.avatar ? (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-2xl font-black text-blue-600 leading-none">
                          #{player.number}
                        </span>
                      )}
                    </div>

                    {/* Big Prominent Vietnamese Name on New Dedicated Row */}
                    <div className="w-full mb-1 px-1" title={player.name}>
                      <span className="text-sm font-black text-slate-900 block truncate leading-tight">
                        {getVietnameseShortName(player.name)}
                      </span>
                    </div>

                    {/* Quick Position Tags (GK, FI, AL, PI) */}
                    {player.positions && player.positions.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-1 mb-1.5">
                        {player.positions.map((pos) => {
                          const cfg = POSITION_TAG_CONFIG[pos];
                          return (
                            <span
                              key={pos}
                              className={`text-[10px] font-black px-1.5 py-0.2 rounded border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
                              title={cfg.fullLabel}
                            >
                              {cfg.shortLabel}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Individual Player Notes Tag on Pitch Card */}
                    {player.notes && player.notes.trim() !== '' && (
                      <div
                        className="w-full mb-1.5 px-1.5 py-1 bg-amber-50 border border-amber-200/90 text-amber-900 rounded-lg text-[11px] font-bold leading-tight truncate text-left"
                        title={player.notes}
                      >
                        📝 {player.notes}
                      </div>
                    )}

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
