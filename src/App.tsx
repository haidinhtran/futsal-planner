import { useState, useEffect } from 'react';
import type { Player, TacticalSquad } from './types/futsal';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { PlayerManagement } from './components/PlayerManagement';
import { TacticsBoard } from './components/TacticsBoard';
import { TacticalDiagram } from './components/TacticalDiagram';

export const App = () => {
  const [activeTab, setActiveTab] = useState<'players' | 'tactics' | 'presentation'>('players');

  // Synchronous initial state load from LocalStorage
  const [players, setPlayers] = useState<Player[]>(() => storageService.getPlayers());
  const [squad, setSquad] = useState<TacticalSquad>(() => storageService.getSquad());

  // Function to reload state when reset/imported
  const refreshData = () => {
    setPlayers(storageService.getPlayers());
    setSquad(storageService.getSquad());
  };

  // Extra safety sync on mount
  useEffect(() => {
    refreshData();
  }, []);

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
        setActiveTab={setActiveTab}
        onDataRefresh={refreshData}
      />

      {/* Main Tab View Content */}
      <main className="flex-1 pb-12">
        {activeTab === 'players' && (
          <PlayerManagement
            players={players}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {activeTab === 'tactics' && (
          <TacticsBoard
            players={players}
            squad={squad}
            onSaveSquad={handleSaveSquad}
          />
        )}

        {activeTab === 'presentation' && <TacticalDiagram />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs font-semibold text-slate-500">
        Một sản phẩm của AI với sự từ chối mọi trách nhiệm của Hải Trần
      </footer>
    </div>
  );
};

export default App;
