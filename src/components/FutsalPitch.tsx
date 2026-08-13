import React, { useState } from 'react';
import type { PositionSlot, Player, AttackDirection } from '../types/futsal';
import { FORMATION_PRESETS } from '../services/initialData';
import { getUniquePositionConfigs as _getUniquePositionConfigs } from '../types/futsal';
import { User, X, GripVertical, ChevronUp, Users, Check, ArrowLeft, ArrowRight } from 'lucide-react';

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
  onAssignSubPlayerToSlot?: (slotId: string, playerId: string) => void;
  onClearSlot: (slotId: string) => void;
  onClearSubPlayer?: (slotId: string, subPlayerId: string) => void;
  onPromoteSubToMain?: (slotId: string, subPlayerId: string) => void;
  onSwapSlots: (slotIdA: string, slotIdB: string) => void;
}

// Helper function to format clean English role titles for pitch card headers
export const getEnglishRoleTitle = (role: string): string => {
  switch (role) {
    case 'GOALKEEPER':
      return 'Goalkeeper';
    case 'FIXO':
      return 'Fixo';
    case 'ALA_LEFT':
      return 'Ala Left';
    case 'ALA_RIGHT':
      return 'Ala Right';
    case 'PIVOT':
      return 'Pivot';
    default:
      return role;
  }
};

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
  currentFormationId,
  onSelectFormation,
  onToggleAttackDirection,
  onSelectSlot,
  onAssignPlayerToSlot,
  onAssignSubPlayerToSlot,
  onClearSlot,
  onClearSubPlayer,
  onPromoteSubToMain,
  onSwapSlots,
}) => {
  const [showSubs, setShowSubs] = useState<boolean>(true);

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

  const getRoleBorderLeftClass = (role: string) => {
    switch (role) {
      case 'GOALKEEPER':
        return 'border-l-emerald-500';
      case 'FIXO':
        return 'border-l-purple-500';
      case 'ALA_LEFT':
      case 'ALA_RIGHT':
        return 'border-l-sky-500';
      case 'PIVOT':
        return 'border-l-amber-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropMain = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const sourcePlayerId = e.dataTransfer.getData('text/player-id') || e.dataTransfer.getData('text/plain');
    const sourceSlotId = e.dataTransfer.getData('text/slot-id');

    if (sourceSlotId && sourceSlotId !== targetSlotId) {
      onSwapSlots(sourceSlotId, targetSlotId);
    } else if (sourcePlayerId) {
      onAssignPlayerToSlot(targetSlotId, sourcePlayerId);
    }
  };

  const handleDropSub = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const sourcePlayerId = e.dataTransfer.getData('text/player-id') || e.dataTransfer.getData('text/plain');
    if (sourcePlayerId && onAssignSubPlayerToSlot) {
      onAssignSubPlayerToSlot(targetSlotId, sourcePlayerId);
    }
  };

  const handleSlotDragStart = (e: React.DragEvent, slotId: string, playerId: string | null) => {
    e.dataTransfer.setData('text/slot-id', slotId);
    e.dataTransfer.effectAllowed = 'copyMove';
    if (playerId) {
      e.dataTransfer.setData('text/player-id', playerId);
      e.dataTransfer.setData('text/plain', playerId);
    }
  };

  const handleSubPlayerDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/player-id', playerId);
    e.dataTransfer.setData('text/plain', playerId);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  /* Temporarily commented out popover helpers
  const getPlayerAverage = (p: Player) => {
    let sum = 0, count = 0;
    if (p.stamina !== null) { sum += p.stamina; count++; }
    if (p.attack !== null) { sum += p.attack; count++; }
    if (p.defense !== null) { sum += p.defense; count++; }
    return count > 0 ? (sum / count).toFixed(1) : '-';
  };

  const getPopoverPositionClass = (x: number, y: number) => {
    const vertClass = y < 35 ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]';
    let horizClass = 'left-1/2 -translate-x-1/2';
    if (x < 25) {
      horizClass = 'left-0 translate-x-0';
    } else if (x > 75) {
      horizClass = 'right-0 left-auto translate-x-0';
    }
    return `${vertClass} ${horizClass}`;
  };
  */

  return (
    <div className="futsal-pitch-container w-full">
      {/* Court Header Bar - Monolithic Single Row without border divider */}
      <div className="flex flex-wrap items-center justify-between pb-1 mb-2 text-slate-800 text-sm font-bold gap-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-emerald-500"></span>
          <span className="text-slate-900 font-extrabold uppercase tracking-wide text-sm sm:text-base">SÂN THI ĐẤU FUTSAL</span>
        </div>

        {/* Inline Controls Group - Modern Segmented Control Toggle Groups */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Formation Preset Dropdown Selector */}
          {currentFormationId && onSelectFormation && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-bold text-sm shrink-0">Đội hình:</span>
              <select
                value={currentFormationId}
                onChange={(e) => onSelectFormation(e.target.value)}
                className="bg-slate-100/90 text-emerald-700 font-black text-sm px-3 py-1.5 rounded-lg border border-slate-200/80 cursor-pointer focus:outline-none focus:border-emerald-500 shadow-2xs hover:bg-slate-200/70 transition-colors"
              >
                {FORMATION_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.subName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Hướng tấn công: Toggle Switch */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-bold text-sm shrink-0">Hướng tấn công:</span>
            <div className="flex items-center space-x-1.5">
              <span className={`text-xs font-bold ${attackDirection === 'left' ? 'text-blue-700 font-black' : 'text-slate-400'}`}>
                Trái
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={attackDirection === 'right'}
                onClick={() => onToggleAttackDirection && onToggleAttackDirection()}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  attackDirection === 'right' ? 'bg-blue-600' : 'bg-slate-200'
                }`}
                title={`Hướng tấn công hiện tại: ${attackDirection === 'left' ? 'Sang Trái (←)' : 'Sang Phải (→)'}`}
              >
                <span
                  className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    attackDirection === 'right' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {attackDirection === 'right' ? (
                    <ArrowRight className="w-3 h-3 text-blue-600 stroke-[3]" />
                  ) : (
                    <ArrowLeft className="w-3 h-3 text-slate-400 stroke-[3]" />
                  )}
                </span>
              </button>
              <span className={`text-xs font-bold ${attackDirection === 'right' ? 'text-blue-700 font-black' : 'text-slate-400'}`}>
                Phải
              </span>
            </div>
          </div>

          {/* Dự Bị: Toggle Switch */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-bold text-sm shrink-0">Dự bị:</span>
            <button
              type="button"
              role="switch"
              aria-checked={showSubs}
              onClick={() => setShowSubs(!showSubs)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showSubs ? 'bg-blue-600' : 'bg-slate-200'
              }`}
              title={showSubs ? 'Đang hiện dàn dự bị (Bấm để ẩn)' : 'Đang ẩn dàn dự bị (Bấm để hiện)'}
            >
              <span
                className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showSubs ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {showSubs ? (
                  <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                ) : (
                  <X className="w-3 h-3 text-slate-400 stroke-[3]" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Outer Pitch Border & Playing Floor */}
      <div className="futsal-pitch-floor relative min-h-[520px]">
        {/* Court markings */}
        <div className="pitch-line pitch-center-line"></div>
        <div className="pitch-line pitch-center-circle"></div>
        <div className="pitch-line pitch-center-spot"></div>
        <div className="pitch-line pitch-penalty-left"></div>
        <div className="pitch-line pitch-penalty-right"></div>
        <div className="pitch-line pitch-penalty-spot-left"></div>
        <div className="pitch-line pitch-penalty-spot-right"></div>
        <div className="pitch-line pitch-corner-tl"></div>
        <div className="pitch-line pitch-corner-tr"></div>
        <div className="pitch-line pitch-corner-bl"></div>
        <div className="pitch-line pitch-corner-br"></div>
        <div className="pitch-goal-left"></div>
        <div className="pitch-goal-right"></div>

        {/* Render 5 Position Container Boxes on Court */}
        {slots.map((slot) => {
          const mainPlayer = slot.playerId ? playersMap[slot.playerId] : null;
          const subPlayerIds = slot.subPlayerIds || [];
          const subPlayers = subPlayerIds.map((id) => playersMap[id]).filter(Boolean);
          const isSelected = selectedSlotId === slot.id;

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              onClick={() => onSelectSlot(slot.id)}
              className={`pitch-player-card cursor-pointer group ${
                isSelected ? 'ring-2 ring-yellow-400 z-30' : ''
              }`}
            >
              {/* Position Container Box */}
              <div className="bg-white border border-slate-300 w-[145px] sm:w-[155px] xl:w-[175px] 2xl:w-[185px] p-2 xl:p-2.5 flex flex-col relative">
                {/* Role Header Badge */}
                <div
                  className={`text-xs font-black uppercase py-0.5 px-1.5 flex items-center justify-between mb-1.5 leading-tight ${getRoleBadgeClass(
                    slot.role
                  )}`}
                >
                  <span className="whitespace-normal break-words text-left flex-1 tracking-tight" title={slot.label}>
                    {getEnglishRoleTitle(slot.role)}
                  </span>
                  <GripVertical className="w-3 h-3 opacity-80 cursor-move shrink-0 ml-1" />
                </div>

                {/* 1. Main Starter Slot Container */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropMain(e, slot.id)}
                  draggable={!!mainPlayer}
                  onDragStart={(e) => handleSlotDragStart(e, slot.id, slot.playerId)}
                  className="relative p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                >
                  {mainPlayer ? (
                    /* Main Starter Player Card - Prominently Styled: [ #5 - Cao Tấn ] */
                    <div className="flex flex-col items-center relative text-center">
                      {/* Synchronized Main Starter Badge: [ #Number - ShortName ] + Inline Remove Button */}
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
                            onClearSlot(slot.id);
                          }}
                          className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 ml-1 cursor-pointer"
                          title="Bỏ cầu thủ chính khỏi vị trí"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Main Player Note (if present) */}
                      {mainPlayer.notes && mainPlayer.notes.trim() !== '' && (
                        <div
                          className="w-full px-1 py-0.5 bg-amber-50 border border-amber-200/90 text-amber-900 rounded text-xs font-semibold leading-tight truncate text-left"
                          title={mainPlayer.notes}
                        >
                          📝 {mainPlayer.notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Empty Main Starter Slot Placeholder */
                    <div className="py-2.5 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50/90 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                      <User className="w-4 h-4 text-slate-300 mb-0.5" />
                      <span className="text-xs font-extrabold text-slate-400">Chọn đá chính</span>
                    </div>
                  )}
                </div>

                {/* 2. Sub Player Slots Area (Dự bị - Max 5) */}
                {showSubs && (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropSub(e, slot.id)}
                    className="mt-2 pt-1.5 border-t border-slate-200 text-left"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase mb-1">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>Dự bị ({subPlayers.length}/5)</span>
                      </span>
                    </div>

                    {/* Sub Player Cards List */}
                    <div className="space-y-1">
                      {subPlayers.map((subP) => (
                        <div
                          key={subP.id}
                          draggable
                          onDragStart={(e) => handleSubPlayerDragStart(e, subP.id)}
                          className={`relative group/sub flex items-center justify-between bg-slate-50 hover:bg-slate-100/90 rounded border border-slate-200/90 ${getRoleBorderLeftClass(
                            slot.role
                          )} border-l-4 py-1 px-1.5 text-xs transition-all shadow-2xs`}
                        >
                          {/* Label: [ #Number - Name ] */}
                          <span
                            className="font-bold text-slate-800 truncate flex-1 min-w-0 pr-1"
                            title={`#${subP.number} ${subP.name}`}
                          >
                            <span className="font-extrabold text-blue-600">#{subP.number}</span>
                            <span className="text-slate-400 mx-0.5">-</span>
                            <span>{getVietnameseShortName(subP.name)}</span>
                          </span>

                          {/* Quick Action Buttons: Promote ↑ / Remove × */}
                          <div className="flex items-center space-x-0.5 shrink-0 opacity-80 group-hover/sub:opacity-100">
                            {onPromoteSubToMain && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPromoteSubToMain(slot.id, subP.id);
                                }}
                                className="p-0.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Đôn lên làm đá chính"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onClearSubPlayer && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onClearSubPlayer(slot.id, subP.id);
                                }}
                                className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Gỡ khỏi dự bị"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Sub Placeholder (if space remains) */}
                      {subPlayers.length < 5 && (
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropSub(e, slot.id)}
                          className="py-1 border border-dashed border-slate-200 rounded text-center text-xs font-semibold text-slate-400 hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        >
                          + Kéo dự bị vào đây
                        </div>
                      )}
                    </div>
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
