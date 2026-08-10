import React from 'react';
import type { PositionSlot, Player, AttackDirection } from '../types/futsal';
import { getPositionConfig } from '../types/futsal';
import { User, X, GripVertical } from 'lucide-react';

interface FutsalPitchProps {
  slots: PositionSlot[];
  playersMap: Record<string, Player>;
  selectedSlotId: string | null;
  attackDirection?: AttackDirection;
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
  attackDirection = 'right',
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

  const getPlayerAverage = (p: Player) => {
    let sum = 0, count = 0;
    if (p.stamina !== null) { sum += p.stamina; count++; }
    if (p.attack !== null) { sum += p.attack; count++; }
    if (p.defense !== null) { sum += p.defense; count++; }
    return count > 0 ? (sum / count).toFixed(1) : '-';
  };

  const getPopoverPositionClass = (x: number, y: number) => {
    // Vertical placement: default above, if near top (< 35%) place below
    const vertClass = y < 35 ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]';

    // Horizontal placement:
    // If near left edge (< 25%), align to left edge of card
    // If near right edge (> 75%), align to right edge of card
    // Otherwise center
    let horizClass = 'left-1/2 -translate-x-1/2';
    if (x < 25) {
      horizClass = 'left-0 translate-x-0';
    } else if (x > 75) {
      horizClass = 'right-0 left-auto translate-x-0';
    }

    return `${vertClass} ${horizClass}`;
  };

  return (
    <div className="futsal-pitch-container w-full">
      {/* UI Safe Area: Dedicated Header Bar for Court Controls & Attack Direction */}
      <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl mb-3 border border-slate-700 text-white text-xs font-bold shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-extrabold uppercase tracking-wider">SÂN THI ĐẤU FUTSAL</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
          <span className="text-slate-400">Hướng tấn công:</span>
          <span className="text-yellow-400 font-extrabold flex items-center gap-1">
            {attackDirection === 'left' ? '← Sang trái' : 'Sang phải →'}
          </span>
        </div>
      </div>

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
          const popoverPosClass = getPopoverPositionClass(slot.x, slot.y);

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              draggable={!!player}
              onDragStart={(e) => handleSlotDragStart(e, slot.id, slot.playerId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slot.id)}
              onClick={() => onSelectSlot(slot.id)}
              className={`pitch-player-card cursor-pointer group ${
                isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-30' : ''
              }`}
            >
              {/* Compact Tactical Card Container */}
              <div className="bg-white rounded-xl shadow-xl border border-slate-200/90 w-[132px] sm:w-[138px] p-2 overflow-visible flex flex-col transition-all relative">
                {/* Role Header Badge */}
                <div
                  className={`text-[9px] sm:text-[10px] font-black uppercase py-0.5 px-1.5 rounded-lg flex items-center justify-between mb-1.5 shadow-2xs leading-tight ${getRoleBadgeClass(
                    slot.role
                  )}`}
                >
                  <span className="whitespace-normal break-words text-center flex-1 tracking-tighter" title={slot.label}>
                    {slot.label}
                  </span>
                  <GripVertical className="w-3 h-3 opacity-80 cursor-grab shrink-0 ml-1" />
                </div>

                {player ? (
                  /* Player assigned - Compact Layout */
                  <div className="flex flex-col items-center relative text-center">
                    {/* Redesigned Compact Circular Remove Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearSlot(slot.id);
                      }}
                      className="absolute -top-3.5 -right-3.5 w-5 h-5 rounded-full bg-white text-slate-400 border border-slate-200 shadow-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 z-20 cursor-pointer"
                      title="Bỏ cầu thủ khỏi vị trí"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Prominent Shirt Number */}
                    <div className="flex items-center justify-center mb-0.5">
                      <span className="text-base sm:text-lg font-black text-blue-600 leading-none">
                        #{player.number}
                      </span>
                    </div>

                    {/* Vietnamese Short Name */}
                    <div className="w-full px-0.5 mb-1" title={player.name}>
                      <span className="text-xs font-black text-slate-900 block truncate leading-tight">
                        {getVietnameseShortName(player.name)}
                      </span>
                    </div>

                    {/* Individual Player Note (ONLY rendered if present, 1 line truncated) */}
                    {player.notes && player.notes.trim() !== '' && (
                      <div
                        className="w-full px-1.5 py-0.5 bg-amber-50 border border-amber-200/90 text-amber-900 rounded-md text-[10px] font-extrabold leading-tight truncate text-left"
                        title={player.notes}
                      >
                        📝 {player.notes}
                      </div>
                    )}

                    {/* Smart Floating Rich Popover Tooltip (Appears on Hover / Focus, Auto Positioned) */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto absolute ${popoverPosClass} w-[190px] bg-slate-900/95 backdrop-blur-md text-white rounded-xl p-3 shadow-2xl border border-slate-700/80 z-50 flex flex-col gap-1.5 text-left`}>
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                        <span className="font-black text-sm text-yellow-400">#{player.number} {player.name}</span>
                        <span className="text-[10px] font-extrabold bg-blue-600 px-1.5 py-0.5 rounded text-white">{getPlayerAverage(player)} đ</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-300">
                        {slot.label}
                      </div>

                      {/* Capabilities */}
                      {player.positions && player.positions.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-0.5">
                          {player.positions.map((pTag) => {
                            const cfg = getPositionConfig(pTag);
                            return (
                              <span key={pTag} className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${cfg.bgClass} ${cfg.textClass}`}>
                                {cfg.shortLabel}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Detailed Stats */}
                      <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-center pt-1 border-t border-slate-800">
                        <div className="bg-slate-800/80 p-1 rounded">
                          <span className="text-emerald-400 block text-[9px]">TL</span>
                          <span>{player.stamina ?? '-'}</span>
                        </div>
                        <div className="bg-slate-800/80 p-1 rounded">
                          <span className="text-orange-400 block text-[9px]">TC</span>
                          <span>{player.attack ?? '-'}</span>
                        </div>
                        <div className="bg-slate-800/80 p-1 rounded">
                          <span className="text-blue-400 block text-[9px]">PT</span>
                          <span>{player.defense ?? '-'}</span>
                        </div>
                      </div>

                      {/* Full Notes */}
                      {player.notes && (
                        <div className="text-[10px] text-amber-300 font-medium pt-1 border-t border-slate-800 break-words">
                          📝 {player.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Empty Slot Placeholder */
                  <div className="py-4 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 transition-colors">
                    <User className="w-5 h-5 text-slate-300 mb-0.5" />
                    <span className="text-[10px] font-bold text-slate-400">Chọn cầu thủ</span>
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
