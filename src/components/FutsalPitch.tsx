import React, { useState } from 'react';
import type { PositionSlot, Player, AttackDirection } from '../types/futsal';
import { getPositionConfig, POSITION_TAG_CONFIG } from '../types/futsal';
import { User, X, GripVertical } from 'lucide-react';
import { getVietnameseShortName } from '../utils/formatters';
import { PitchToolbar } from '../features/tactics/components/PitchToolbar';

interface FutsalPitchProps {
  slots: PositionSlot[];
  playersMap: Record<string, Player>;
  selectedSlotId: string | null;
  attackDirection?: AttackDirection;
  currentFormationId?: string;
  onSelectFormation?: (formationId: string) => void;
  onToggleAttackDirection?: () => void;
  onSelectSlot: (slotId: string) => void;
  onAssignPlayerToSlot: (slotId: string, playerId: string) => void;
  onClearSlot: (slotId: string) => void;
  onSwapSlots?: (slotIdA: string, slotIdB: string) => void;
  onQuickSwap?: () => void;
  onClearAllSlots?: () => void;
}

export const FutsalPitch: React.FC<FutsalPitchProps> = ({
  slots,
  playersMap,
  selectedSlotId,
  attackDirection = 'right',
  currentFormationId = '3-1',
  onSelectFormation,
  onToggleAttackDirection,
  onSelectSlot,
  onAssignPlayerToSlot,
  onClearSlot,
  onSwapSlots,
  onQuickSwap,
  onClearAllSlots,
}) => {
  // Responsive default expanded/collapsed state:
  // Mobile (< 768px): default collapsed. Tablet, Laptop, Desktop (>= 768px): default expanded.
  const [isToolbarExpanded, setIsToolbarExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();

    const draggedPlayerId = e.dataTransfer.getData('text/player-id');
    if (draggedPlayerId) {
      onAssignPlayerToSlot(slotId, draggedPlayerId);
      return;
    }

    const draggedSlotId = e.dataTransfer.getData('text/slot-id');
    if (draggedSlotId && draggedSlotId !== slotId && onSwapSlots) {
      onSwapSlots(draggedSlotId, slotId);
    }
  };

  const handleSlotDragStart = (e: React.DragEvent, slotId: string, playerId: string | null) => {
    if (playerId) {
      e.dataTransfer.setData('text/slot-id', slotId);
      e.dataTransfer.setData('text/player-id', playerId);
    }
  };

  // Smart popover position helper based on slot coordinates (x, y)
  const getPopoverPositionClass = (x: number, y: number) => {
    let vertClass = 'bottom-full mb-2.5';
    if (y < 40) {
      vertClass = 'top-full mt-2.5';
    }

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

        {/* Floating Pitch Toolbar Popup */}
        <PitchToolbar
          isExpanded={isToolbarExpanded}
          onToggleExpand={setIsToolbarExpanded}
          currentFormationId={currentFormationId}
          attackDirection={attackDirection}
          slots={slots}
          onSelectFormation={onSelectFormation}
          onToggleAttackDirection={onToggleAttackDirection}
          onQuickSwap={onQuickSwap}
          onSwapSlots={onSwapSlots}
          onClearAllSlots={onClearAllSlots}
          onClearSlot={onClearSlot}
        />

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
              onDrop={(e) => handleDropOnSlot(e, slot.id)}
              onClick={() => onSelectSlot(slot.id)}
              className={`pitch-slot flex flex-col items-center justify-center cursor-pointer group select-none ${
                isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-emerald-800 rounded-2xl z-30' : 'z-20'
              }`}
            >
              {player ? (
                /* Player Card Pin on Court Floor */
                <div className="relative flex flex-col items-center group transition-transform duration-200 group-hover:scale-105">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-200/90 shadow-2xl p-2 min-w-[125px] sm:min-w-[140px] text-center transition-all group-hover:border-blue-500">
                    {/* Role Header Badge */}
                    <div className="bg-slate-900 text-white text-[8.5px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-lg mb-1 flex items-center justify-between uppercase tracking-wider">
                      <span className="truncate">{getPositionConfig(slot.role).shortLabel}</span>
                      <GripVertical className="w-2.5 h-2.5 opacity-60 shrink-0 ml-1" />
                    </div>

                    <div className="flex items-center justify-center space-x-1 mb-0.5">
                      <span className="text-xs sm:text-sm font-black text-blue-700">#{player.number}</span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[90px] sm:max-w-[105px]">
                        {getVietnameseShortName(player.name)}
                      </span>
                    </div>

                    {player.notes && player.notes.trim() !== '' && (
                      <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-center space-x-1">
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/80 truncate max-w-[115px]" title={player.notes}>
                          📝 {player.notes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remove Player Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSlot(slot.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-40 cursor-pointer"
                    title="Bỏ cầu thủ khỏi vị trí này"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* ------------------------------------------------------------- */}
                  {/* HOVER PLAYER DETAILS POPOVER CARD                             */}
                  {/* ------------------------------------------------------------- */}
                  <div
                    className={`absolute hidden group-hover:flex flex-col bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl z-50 border border-slate-700/80 min-w-[210px] max-w-[250px] pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 ${getPopoverPositionClass(
                      slot.x,
                      slot.y
                    )}`}
                  >
                    {/* Header: Shirt Number, Full Name, Role */}
                    <div className="border-b border-slate-700/80 pb-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">
                          #{player.number}
                        </span>
                        <span className="text-xs font-black text-white truncate max-w-[160px]">
                          {player.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold mt-1">
                        {getPositionConfig(slot.role).fullLabel}
                      </div>
                    </div>

                    {/* Positions Badges */}
                    {player.positions && player.positions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {player.positions.map((pos) => (
                          <span
                            key={pos}
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${POSITION_TAG_CONFIG[pos].bgClass} ${POSITION_TAG_CONFIG[pos].textClass} ${POSITION_TAG_CONFIG[pos].borderClass}`}
                          >
                            {POSITION_TAG_CONFIG[pos].shortLabel}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats Breakdown (TL, TC, PT) */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-800/90 p-2 rounded-xl border border-slate-700/50 text-center mb-2">
                      <div>
                        <div className="text-[8.5px] text-slate-400 font-extrabold uppercase">TL</div>
                        <div className="text-xs font-black text-emerald-400">
                          {player.stamina !== null && player.stamina !== undefined ? player.stamina : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[8.5px] text-slate-400 font-extrabold uppercase">TC</div>
                        <div className="text-xs font-black text-orange-400">
                          {player.attack !== null && player.attack !== undefined ? player.attack : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[8.5px] text-slate-400 font-extrabold uppercase">PT</div>
                        <div className="text-xs font-black text-blue-400">
                          {player.defense !== null && player.defense !== undefined ? player.defense : '-'}
                        </div>
                      </div>
                    </div>

                    {/* Personal Notes */}
                    {player.notes && player.notes.trim() !== '' ? (
                      <div className="text-[10px] font-medium text-amber-300 bg-amber-950/70 p-2 rounded-xl border border-amber-800/60 flex items-start space-x-1">
                        <span className="shrink-0">📝</span>
                        <span className="italic leading-snug">{player.notes}</span>
                      </div>
                    ) : (
                      <div className="text-[9.5px] text-slate-400 italic">Chưa có ghi chú cá nhân</div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty Position Pin Slot */
                <div className="bg-white/80 backdrop-blur-xs hover:bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-2.5 min-w-[110px] text-center shadow-md transition-all flex flex-col items-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] font-extrabold text-slate-600 uppercase tracking-tight">
                    {getPositionConfig(slot.role).shortLabel}
                  </span>
                  <span className="text-[9px] font-bold text-blue-600">Trống</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
