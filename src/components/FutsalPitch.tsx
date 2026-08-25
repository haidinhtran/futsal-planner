import React, { useRef } from 'react';
import type { PositionSlot, Player, AttackDirection } from '@/types/futsal';
import { PitchSlotCard } from './TacticsBoard/PitchSlotCard';
import { PitchToolbar } from './TacticsBoard/PitchToolbar';

interface Props {
  slots: PositionSlot[]; playersMap: Record<string, Player>; selectedSlotId: string | null;
  showSubs?: boolean; isFullscreen: boolean; isMobile?: boolean; currentFormationId: string;
  attackDirection: AttackDirection; containerRef: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
  onSelectSlot: (id: string) => void; onOpenPicker: (id: string, mode: 'main' | 'sub') => void;
  onAssignPlayerToSlot: (slotId: string, playerId: string) => void;
  onAssignSubPlayerToSlot?: (slotId: string, playerId: string) => void;
  onClearSlot: (slotId: string) => void; onClearSubPlayer?: (slotId: string, subPlayerId: string) => void;
  onPromoteSubToMain?: (slotId: string, subPlayerId: string) => void;
  onSwapSlots: (slotIdA: string, slotIdB: string) => void;
  onSelectFormation: (id: string) => void; onToggleAttackDirection: () => void;
  onQuickSwap: () => void; onToggleShowSubs: () => void; onResetPreset: () => void;
  onClearAllSlots: () => void; onSaveSquad: () => void; onToggleFullscreen: () => void;
}

export const FutsalPitch: React.FC<Props> = ({
  slots, playersMap, selectedSlotId, showSubs = true, isFullscreen, isMobile = false,
  currentFormationId, attackDirection, containerRef, children,
  onSelectSlot, onOpenPicker, onAssignPlayerToSlot, onAssignSubPlayerToSlot,
  onClearSlot, onClearSubPlayer, onPromoteSubToMain, onSwapSlots,
  onSelectFormation, onToggleAttackDirection, onQuickSwap, onToggleShowSubs,
  onResetPreset, onClearAllSlots, onSaveSquad, onToggleFullscreen,
}) => {
  const floorRef = useRef<HTMLDivElement>(null);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const handleDropMain = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault(); e.stopPropagation();
    const sourcePlayerId = e.dataTransfer.getData('text/player-id') || e.dataTransfer.getData('text/plain');
    const sourceSlotId = e.dataTransfer.getData('text/slot-id');
    if (sourceSlotId && sourceSlotId !== targetSlotId) onSwapSlots(sourceSlotId, targetSlotId);
    else if (sourcePlayerId) onAssignPlayerToSlot(targetSlotId, sourcePlayerId);
  };

  const handleDropSub = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault(); e.stopPropagation();
    const sourcePlayerId = e.dataTransfer.getData('text/player-id') || e.dataTransfer.getData('text/plain');
    if (sourcePlayerId && onAssignSubPlayerToSlot) onAssignSubPlayerToSlot(targetSlotId, sourcePlayerId);
  };

  const handleSlotDragStart = (e: React.DragEvent, slotId: string, playerId: string | null) => {
    e.dataTransfer.setData('text/slot-id', slotId); e.dataTransfer.effectAllowed = 'copyMove';
    if (playerId) { e.dataTransfer.setData('text/player-id', playerId); e.dataTransfer.setData('text/plain', playerId); }
  };

  const handleSubPlayerDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/player-id', playerId); e.dataTransfer.setData('text/plain', playerId); e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className={`futsal-pitch-container w-full relative ${isFullscreen ? 'is-fullscreen' : ''}`} ref={containerRef}>
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-2 mb-2 text-slate-800 text-sm font-bold gap-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
            <span className="text-h3 text-slate-900">SÂN THI ĐẤU FUTSAL</span>
          </div>
        </div>
      )}

      <div className="futsal-pitch-floor relative min-h-[520px]" ref={floorRef}>
        <PitchToolbar
          currentFormationId={currentFormationId} attackDirection={attackDirection}
          showSubs={showSubs} isFullscreen={isFullscreen} containerRef={floorRef}
          onSelectFormation={onSelectFormation} onToggleAttackDirection={onToggleAttackDirection}
          onQuickSwap={onQuickSwap} onToggleShowSubs={onToggleShowSubs} onResetPreset={onResetPreset}
          onClearAllSlots={onClearAllSlots} onSaveSquad={onSaveSquad} onToggleFullscreen={onToggleFullscreen}
        />

        <div className="pitch-line pitch-center-line" /><div className="pitch-line pitch-center-circle" />
        <div className="pitch-line pitch-center-spot" /><div className="pitch-line pitch-penalty-left" />
        <div className="pitch-line pitch-penalty-right" /><div className="pitch-line pitch-penalty-spot-left" />
        <div className="pitch-line pitch-penalty-spot-right" /><div className="pitch-line pitch-corner-tl" />
        <div className="pitch-line pitch-corner-tr" /><div className="pitch-line pitch-corner-bl" />
        <div className="pitch-line pitch-corner-br" /><div className="pitch-goal-left" /><div className="pitch-goal-right" />

        {slots.map((slot) => (
          <PitchSlotCard
            key={slot.id} slot={slot} playersMap={playersMap} isSelected={selectedSlotId === slot.id}
            showSubs={showSubs} isFullscreen={isFullscreen} isMobile={isMobile} onSelectSlot={onSelectSlot} onOpenPicker={onOpenPicker}
            onClearSlot={onClearSlot} onClearSubPlayer={onClearSubPlayer} onPromoteSubToMain={onPromoteSubToMain}
            onDropMain={handleDropMain} onDropSub={handleDropSub} onSlotDragStart={handleSlotDragStart}
            onSubDragStart={handleSubPlayerDragStart} onDragOver={handleDragOver}
          />
        ))}
      </div>

      {children}
    </div>
  );
};
