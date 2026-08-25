import React, { useRef } from 'react';
import type { Player, TacticalSquad } from '@/types/futsal';
import { useTacticsBoard } from '@/hooks/useTacticsBoard';
import { useFullscreen } from '@/hooks/useFullscreen';
import { FutsalPitch } from './FutsalPitch';
import { TacticsHeader } from './TacticsBoard/TacticsHeader';
import { PlayerSidebar } from './TacticsBoard/PlayerSidebar';
import { SquadInfoPanel } from './TacticsBoard/SquadInfoPanel';
import { SettingsModal } from './TacticsBoard/SettingsModal';
import { PlayerPickerModal } from './TacticsBoard/PlayerPickerModal';
import { Info } from 'lucide-react';

interface TacticsBoardProps {
  players: Player[];
  squad: TacticalSquad;
  onSaveSquad: (squad: TacticalSquad) => void;
  onEditPlayer?: (player: Player) => void;
}

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ players, squad, onSaveSquad }) => {
  const pitchContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(pitchContainerRef);
  const state = useTacticsBoard({ players, squad, onSaveSquad });
  const activePickerSlot = state.slots.find((s) => s.id === state.pickerState.slotId) || null;

  return (
    <div className="w-full bg-white pb-12 md:pb-0">
      <TacticsHeader
        isFullscreen={isFullscreen} onOpenSettings={() => state.setIsSettingsOpen(true)}
        onResetPreset={state.handleResetPreset} onClearAllSlots={state.handleClearAllSlots}
        onSaveSquad={state.handleSaveSquadAction} onToggleFullscreen={toggleFullscreen}
      />

      <div className={`w-full max-w-[1920px] mx-auto layout-page-container ${
        isFullscreen ? 'p-0' : 'grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200'
      }`}>
        {!isFullscreen && (
          <PlayerSidebar
            players={players} sidebarPlayers={state.sidebarPlayers}
            assignedMainPlayerIds={state.assignedMainPlayerIds} assignedSubPlayerIds={state.assignedSubPlayerIds}
            onlyUnselected={state.onlyUnselected} sortBy={state.sortBy}
            onSetOnlyUnselected={state.setOnlyUnselected} onSetSortBy={state.setSortBy}
            onPlayerClick={state.handleSidebarPlayerClick} onDragStartPlayer={state.handleDragStartPlayer}
          />
        )}

        <div className={`py-4 sm:py-5 bg-white space-y-4 ${isFullscreen ? 'w-full p-0' : 'order-1 lg:order-2 lg:col-span-8 xl:col-span-9 pl-0 lg:pl-6'}`}>
          <FutsalPitch
            slots={state.slots} playersMap={state.playersMap} selectedSlotId={state.selectedSlotId}
            showSubs={state.showSubs} isFullscreen={isFullscreen} currentFormationId={state.currentFormationId}
            attackDirection={state.attackDirection} containerRef={pitchContainerRef}
            onSelectSlot={(id) => state.setSelectedSlotId(state.selectedSlotId === id ? null : id)}
            onOpenPicker={state.openPicker} onAssignPlayerToSlot={state.handleAssignPlayerToSlot}
            onAssignSubPlayerToSlot={state.handleAssignSubPlayerToSlot} onClearSlot={state.handleClearSlot}
            onClearSubPlayer={state.handleClearSubPlayer} onPromoteSubToMain={state.handlePromoteSubToMain}
            onSwapSlots={state.handleSwapSlots} onSelectFormation={state.handleSelectFormation}
            onToggleAttackDirection={state.handleToggleAttackDirection} onQuickSwap={state.handleQuickSwap}
            onToggleShowSubs={() => state.setShowSubs(!state.showSubs)} onResetPreset={state.handleResetPreset}
            onClearAllSlots={state.handleClearAllSlots} onSaveSquad={state.handleSaveSquadAction}
            onToggleFullscreen={toggleFullscreen}
          >
            <SettingsModal
              isOpen={state.isSettingsOpen} currentFormationId={state.currentFormationId}
              attackDirection={state.attackDirection} showSubs={state.showSubs}
              onClose={() => state.setIsSettingsOpen(false)} onSelectFormation={state.handleSelectFormation}
              onToggleAttackDirection={state.handleToggleAttackDirection}
              onToggleShowSubs={() => state.setShowSubs(!state.showSubs)} onQuickSwap={state.handleQuickSwap}
            />

            <PlayerPickerModal
              isOpen={state.pickerState.isOpen} slot={activePickerSlot} mode={state.pickerState.mode}
              players={players} assignedMainPlayerIds={state.assignedMainPlayerIds}
              assignedSubPlayerIds={state.assignedSubPlayerIds} onClose={state.closePicker}
              onSelectPlayer={(pId) => {
                if (state.pickerState.slotId) {
                  if (state.pickerState.mode === 'main') state.handleAssignPlayerToSlot(state.pickerState.slotId, pId);
                  else state.handleAssignSubPlayerToSlot(state.pickerState.slotId, pId);
                }
              }}
              onClearSlot={() => state.pickerState.slotId && state.handleClearSlot(state.pickerState.slotId)}
            />
          </FutsalPitch>

          {!isFullscreen && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-1 text-sm gap-3">
              <div className="flex items-center space-x-2 text-slate-600 font-semibold">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Kéo thả hoặc nhấp vào vị trí trên sân để chọn cầu thủ.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isFullscreen && (
        <SquadInfoPanel
          currentPreset={state.currentPreset} attackDirection={state.attackDirection}
          teamAverageStats={state.teamAverageStats} startingPlayersWithNotes={state.startingPlayersWithNotes}
          notes={state.notes} onNotesChange={state.setNotes}
        />
      )}
    </div>
  );
};
