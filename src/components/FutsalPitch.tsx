import React, { useState } from 'react';
import type { PositionSlot, Player, AttackDirection } from '../types/futsal';
import { getPositionConfig } from '../types/futsal';
import { User, X, GripVertical, ChevronUp, Users } from 'lucide-react';

interface FutsalPitchProps {
  slots: PositionSlot[];
  playersMap: Record<string, Player>;
  selectedSlotId: string | null;
  attackDirection?: AttackDirection;
  onToggleAttackDirection?: () => void;
  onSelectSlot: (slotId: string) => void;
  onAssignPlayerToSlot: (slotId: string, playerId: string) => void;
  onAssignSubPlayerToSlot?: (slotId: string, playerId: string) => void;
  onClearSlot: (slotId: string) => void;
  onClearSubPlayer?: (slotId: string, subPlayerId: string) => void;
  onPromoteSubToMain?: (slotId: string, subPlayerId: string) => void;
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
    const sourcePlayerId = e.dataTransfer.getData('text/player-id');
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
    const sourcePlayerId = e.dataTransfer.getData('text/player-id');
    if (sourcePlayerId && onAssignSubPlayerToSlot) {
      onAssignSubPlayerToSlot(targetSlotId, sourcePlayerId);
    }
  };

  const handleSlotDragStart = (e: React.DragEvent, slotId: string, playerId: string | null) => {
    e.dataTransfer.setData('text/slot-id', slotId);
    if (playerId) {
      e.dataTransfer.setData('text/player-id', playerId);
    }
  };

  const handleSubPlayerDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/player-id', playerId);
  };

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

  return (
    <div className="futsal-pitch-container w-full">
      {/* UI Safe Area: Dedicated Header Bar for Court Controls & Attack Direction / Sub Visibility Toggle */}
      <div className="flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl mb-3 border border-slate-200/90 text-slate-800 text-xs font-bold shadow-sm gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-800 font-black uppercase tracking-wider">SÂN THI ĐẤU FUTSAL</span>
        </div>

        {/* Right Controls Group */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Direction Switcher Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <span className="text-slate-700 font-extrabold text-[11px] sm:text-xs">Đổi hướng:</span>
            <button
              type="button"
              onClick={onToggleAttackDirection}
              className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                attackDirection === 'right' ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
              title={`Đổi hướng tấn công (Hiện tại: ${attackDirection === 'right' ? 'Sang phải →' : 'Sang trái ←'})`}
            >
              <span className="sr-only">Đổi hướng tấn công</span>
              <span
                className={`pointer-events-none inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center transform rounded-full bg-white text-[9px] sm:text-[10px] font-black text-slate-900 shadow-md transition duration-200 ease-in-out ${
                  attackDirection === 'right' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                }`}
              >
                {attackDirection === 'right' ? '→' : '←'}
              </span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Sub Players Visibility Toggle Switcher (ON / OFF) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <span className="text-slate-700 font-extrabold text-[11px] sm:text-xs">Hiện dự bị:</span>
            <button
              type="button"
              onClick={() => setShowSubs(!showSubs)}
              className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                showSubs ? 'bg-blue-600' : 'bg-slate-400'
              }`}
              title={showSubs ? 'Tắt để ẩn bớt dàn dự bị trên sân' : 'Bật để hiển thị các cầu thủ dự bị'}
            >
              <span className="sr-only">Bật tắt ẩn hiện dự bị</span>
              <span
                className={`pointer-events-none inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center transform rounded-full bg-white text-[8px] sm:text-[9px] font-black text-slate-900 shadow-md transition duration-200 ease-in-out ${
                  showSubs ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                }`}
              >
                {showSubs ? 'ON' : 'OFF'}
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
          const popoverPosClass = getPopoverPositionClass(slot.x, slot.y);

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              onClick={() => onSelectSlot(slot.id)}
              className={`pitch-player-card cursor-pointer group ${
                isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-30' : ''
              }`}
            >
              {/* Position Container Box */}
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200/90 w-[145px] sm:w-[155px] xl:w-[175px] 2xl:w-[185px] p-2 xl:p-2.5 flex flex-col transition-all relative">
                {/* Role Header Badge */}
                <div
                  className={`text-[9px] sm:text-[10px] xl:text-xs font-black uppercase py-0.5 px-1.5 rounded-lg flex items-center justify-between mb-1.5 shadow-2xs leading-tight ${getRoleBadgeClass(
                    slot.role
                  )}`}
                >
                  <span className="whitespace-normal break-words text-center flex-1 tracking-tighter" title={slot.label}>
                    {slot.label}
                  </span>
                  <GripVertical className="w-3 h-3 opacity-80 cursor-grab shrink-0 ml-1" />
                </div>

                {/* 1. Main Starter Slot Container */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropMain(e, slot.id)}
                  draggable={!!mainPlayer}
                  onDragStart={(e) => handleSlotDragStart(e, slot.id, slot.playerId)}
                  className="relative rounded-lg p-1.5 transition-colors bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/80"
                >
                  {mainPlayer ? (
                    /* Main Starter Player Card - Prominently Styled: [ #5 - Cao Tấn ] */
                    <div className="flex flex-col items-center relative text-center">
                      {/* Clear Main Starter Button */}
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearSlot(slot.id);
                        }}
                        className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-white text-slate-400 border border-slate-200 shadow-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 z-20 cursor-pointer"
                        title="Bỏ cầu thủ chính khỏi vị trí"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Prominent Label: [ #Number - Name ] */}
                      <div className="w-full bg-blue-50/90 border border-blue-200/80 rounded-md py-1 px-1.5 mb-1 flex items-center justify-center space-x-1 shadow-2xs">
                        <span className="text-sm xl:text-base font-black text-blue-600 leading-none">
                          #{mainPlayer.number}
                        </span>
                        <span className="text-slate-400 font-bold text-xs">-</span>
                        <span className="text-xs xl:text-sm font-black text-slate-900 truncate leading-tight" title={mainPlayer.name}>
                          {getVietnameseShortName(mainPlayer.name)}
                        </span>
                      </div>

                      {/* Main Player Note (if present) */}
                      {mainPlayer.notes && mainPlayer.notes.trim() !== '' && (
                        <div
                          className="w-full px-1 py-0.5 bg-amber-50 border border-amber-200/90 text-amber-900 rounded text-[9px] font-extrabold leading-tight truncate text-left"
                          title={mainPlayer.notes}
                        >
                          📝 {mainPlayer.notes}
                        </div>
                      )}

                      {/* Floating Rich Popover Tooltip */}
                      <div className={`opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto absolute ${popoverPosClass} w-[205px] bg-slate-900/95 backdrop-blur-md text-white rounded-xl p-3 shadow-2xl border border-slate-700/80 z-50 flex flex-col gap-1.5 text-left`}>
                        <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 gap-2">
                          <span className="font-black text-sm text-yellow-400 truncate flex-1 min-w-0" title={`#${mainPlayer.number} ${mainPlayer.name}`}>
                            #{mainPlayer.number} {mainPlayer.name}
                          </span>
                          <span className="text-[10px] font-extrabold bg-blue-600 px-2 py-0.5 rounded text-white shrink-0 whitespace-nowrap">
                            {getPlayerAverage(mainPlayer)} đ
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-300">
                          {slot.label} (Đá chính)
                        </div>

                        {mainPlayer.positions && mainPlayer.positions.length > 0 && (
                          <div className="flex flex-wrap gap-1 my-0.5">
                            {mainPlayer.positions.map((pTag) => {
                              const cfg = getPositionConfig(pTag);
                              return (
                                <span key={pTag} className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${cfg.bgClass} ${cfg.textClass}`}>
                                  {cfg.shortLabel}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-center pt-1 border-t border-slate-800">
                          <div className="bg-slate-800/80 p-1 rounded">
                            <span className="text-emerald-400 block text-[9px]">TL</span>
                            <span>{mainPlayer.stamina ?? '-'}</span>
                          </div>
                          <div className="bg-slate-800/80 p-1 rounded">
                            <span className="text-orange-400 block text-[9px]">TC</span>
                            <span>{mainPlayer.attack ?? '-'}</span>
                          </div>
                          <div className="bg-slate-800/80 p-1 rounded">
                            <span className="text-blue-400 block text-[9px]">PT</span>
                            <span>{mainPlayer.defense ?? '-'}</span>
                          </div>
                        </div>

                        {mainPlayer.notes && (
                          <div className="text-[10px] text-amber-300 font-medium pt-1 border-t border-slate-800 break-words">
                            📝 {mainPlayer.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Empty Main Starter Slot Placeholder */
                    <div className="py-2.5 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50/90 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                      <User className="w-4 h-4 text-slate-300 mb-0.5" />
                      <span className="text-[10px] font-extrabold text-slate-400">Chọn đá chính</span>
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
                    <div className="flex items-center justify-between text-[9px] xl:text-[10px] font-black text-slate-500 uppercase mb-1">
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
                          )} border-l-4 py-1 px-1.5 text-[10px] xl:text-xs transition-all shadow-2xs`}
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
                          className="py-1 border border-dashed border-slate-200 rounded text-center text-[9px] xl:text-[10px] font-bold text-slate-400 hover:bg-blue-50/60 hover:text-blue-600 hover:border-blue-300 transition-colors"
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
