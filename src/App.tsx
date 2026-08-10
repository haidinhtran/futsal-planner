import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlayerManagement } from './components/PlayerManagement';
import { TacticsBoard } from './components/TacticsBoard';
import { TacticalDiagram } from './components/TacticalDiagram';
import type { Player, TacticalSquad } from './types/futsal';
import { storageService } from './services/storageService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'players' | 'tactics' | 'presentation'>('tactics');

  // Synchronously initialize state from LocalStorage so data is available on 1st render (F5 refresh)
  const [players, setPlayers] = useState<Player[]>(() => storageService.getPlayers());
  const [squad, setSquad] = useState<TacticalSquad>(() => storageService.getSquad());

  const loadData = () => {
    const loadedPlayers = storageService.getPlayers();
    const loadedSquad = storageService.getSquad();
    setPlayers(loadedPlayers);
    setSquad(loadedSquad);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePlayer = (updatedPlayer: Player) => {
    const existingIdx = players.findIndex((p) => p.id === updatedPlayer.id);
    let newPlayers: Player[];
    if (existingIdx >= 0) {
      newPlayers = [...players];
      newPlayers[existingIdx] = updatedPlayer;
    } else {
      newPlayers = [...players, updatedPlayer];
    }
    setPlayers(newPlayers);
    storageService.savePlayers(newPlayers);
  };

  const handleDeletePlayer = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa cầu thủ này?')) {
      const newPlayers = players.filter((p) => p.id !== id);
      setPlayers(newPlayers);
      storageService.savePlayers(newPlayers);

      // Also unassign player from squad slots if assigned
      const updatedSlots = squad.slots.map((s) => (s.playerId === id ? { ...s, playerId: null } : s));
      const updatedSquad = { ...squad, slots: updatedSlots };
      setSquad(updatedSquad);
      storageService.saveSquad(updatedSquad);
    }
  };

  const handleSaveSquad = (updatedSquad: TacticalSquad) => {
    setSquad(updatedSquad);
    storageService.saveSquad(updatedSquad);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDataRefresh={loadData}
      />

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
        Futsal Tactics & Squad Planner MVP • Lưu dữ liệu LocalStorage trình duyệt & Xuất File JSON
      </footer>
    </div>
  );
};

export default App;
