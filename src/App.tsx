import { useState, useEffect, useRef } from 'react';
import type { Player, TacticalSquad } from './types/futsal';
import { storageService } from './services/storageService';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PlayerManagement } from './components/PlayerManagement';
import { TacticsBoard } from './components/TacticsBoard';
import { TacticalDiagram } from './components/TacticalDiagram';

type TabType = 'tactics' | 'players' | 'presentation';

const getTabFromLocation = (): TabType => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/players')) return 'players';
  if (path.includes('/present')) return 'presentation';
  return 'tactics'; // default ./ or /plan
};

const getPathFromTab = (tab: TabType): string => {
  if (tab === 'players') return '/players';
  if (tab === 'presentation') return '/present';
  return '/plan';
};

import type { PlayerControlsData, DiagramControlsData } from './components/TopBar';

export const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromLocation());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Edit request from TacticsBoard: opens PlayerManagement edit modal for a player
  const [editRequest, setEditRequest] = useState<{ playerId: string; nonce: number } | null>(null);

  // Player Management TOP Bar Controls State
  const [playerControls, setPlayerControls] = useState<PlayerControlsData | null>(null);

  // Tactical Diagram TOP Bar Controls State
  const [diagramControls, setDiagramControls] = useState<DiagramControlsData | null>(null);

  // Synchronous initial state load from LocalStorage
  const [players, setPlayers] = useState<Player[]>(() => storageService.getPlayers());
  const [squad, setSquad] = useState<TacticalSquad>(() => storageService.getSquad());

  // Actions registry ref for TopBar dynamic actions
  const tacticsActionsRef = useRef<{ resetPreset?: () => void; saveSquad?: () => void }>({});

  // Function to reload state when reset/imported
  const refreshData = () => {
    setPlayers(storageService.getPlayers());
    setSquad(storageService.getSquad());
  };

  // Sync route and handle browser Back/Forward (popstate)
  useEffect(() => {
    refreshData();

    const handlePopState = () => {
      setActiveTab(getTabFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    const targetPath = getPathFromTab(newTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditRequest({ playerId: player.id, nonce: Date.now() });
    handleTabChange('players');
  };

  const handleSavePlayer = (updatedPlayer: Player) => {
    const existingIndex = players.findIndex((p) => p.id === updatedPlayer.id);
    let newPlayers: Player[];
    if (existingIndex >= 0) {
      newPlayers = [...players];
      newPlayers[existingIndex] = updatedPlayer;
    } else {
      newPlayers = [...players, updatedPlayer];
    }
    setPlayers(newPlayers);
    storageService.savePlayers(newPlayers);
  };

  const handleDeletePlayer = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
      const newPlayers = players.filter((p) => p.id !== id);
      setPlayers(newPlayers);
      storageService.savePlayers(newPlayers);

      // Also unassign player from squad slot if currently on field
      if (squad && squad.slots) {
        const newSlots = squad.slots.map((slot) => (slot.playerId === id ? { ...slot, playerId: null } : slot));
        const newSquad = { ...squad, slots: newSlots };
        setSquad(newSquad);
        storageService.saveSquad(newSquad);
      }
    }
  };

  const handleSaveSquad = (updatedSquad: TacticalSquad) => {
    setSquad(updatedSquad);
    storageService.saveSquad(updatedSquad);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-slate-800 antialiased h-screen overflow-hidden">
      {/* 1. Fixed Left Vertical Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onDataRefresh={refreshData}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Right Panel (Dynamic pl-64 or pl-[68px]) */}
      <div className={`flex-1 flex flex-col min-w-0 ${isSidebarCollapsed ? 'pl-[68px]' : 'pl-64'} h-screen overflow-hidden transition-all duration-200`}>
        {/* 2a. Fixed Dynamic TopBar */}
        <TopBar
          activeTab={activeTab}
          onResetPreset={() => tacticsActionsRef.current.resetPreset?.()}
          onSaveSquad={() => tacticsActionsRef.current.saveSquad?.()}
          playerControls={playerControls}
          diagramControls={diagramControls}
        />

        {/* 2b. Main Page Content - Only Area Scrollable by User */}
        <main className="flex-1 overflow-y-auto bg-white">
          {activeTab === 'tactics' && (
            <TacticsBoard
              players={players}
              squad={squad}
              onSaveSquad={handleSaveSquad}
              onEditPlayer={handleEditPlayer}
              onRegisterActions={(actions) => {
                tacticsActionsRef.current = actions;
              }}
            />
          )}

          {activeTab === 'players' && (
            <PlayerManagement
              players={players}
              onSavePlayer={handleSavePlayer}
              onDeletePlayer={handleDeletePlayer}
              editRequest={editRequest}
              onRegisterControls={setPlayerControls}
            />
          )}

          {activeTab === 'presentation' && (
            <TacticalDiagram
              players={players}
              onRegisterControls={setDiagramControls}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
