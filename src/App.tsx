import { useState, useEffect } from 'react';
import type { Player, TacticalSquad } from './types/futsal';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
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

export const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromLocation());

  // Synchronous initial state load from LocalStorage
  const [players, setPlayers] = useState<Player[]>(() => storageService.getPlayers());
  const [squad, setSquad] = useState<TacticalSquad>(() => storageService.getSquad());

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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onDataRefresh={refreshData}
      />

      {/* Main Tab View Content */}
      <main className="flex-1 pb-12">
        {activeTab === 'tactics' && (
          <TacticsBoard
            players={players}
            squad={squad}
            onSaveSquad={handleSaveSquad}
          />
        )}

        {activeTab === 'players' && (
          <PlayerManagement
            players={players}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {activeTab === 'presentation' && <TacticalDiagram />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs font-semibold text-slate-500">
        Một sản phẩm của AI với sự từ chối mọi trách nhiệm từ tuiii - Hải Trần
      </footer>
    </div>
  );
};

export default App;
