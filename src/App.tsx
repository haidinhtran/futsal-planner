import { useState, useEffect, useCallback } from 'react';
import type { Player } from './types/futsal';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { PlayerManagement } from './components/PlayerManagement';
import { TacticsBoard } from './components/TacticsBoard';
import { TacticalDiagram } from './components/TacticalDiagram';
import { TopbarProvider } from './context/TopbarContext';
import { usePlayers } from './hooks/usePlayers';
import { useSquad } from './hooks/useSquad';

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
  const { players, savePlayer, deletePlayer: removePlayerFromList, refreshPlayers } = usePlayers();
  const { squad, saveSquad, unassignPlayerFromSquad, refreshSquad } = useSquad();

  const refreshData = useCallback(() => {
    refreshPlayers();
    refreshSquad();
  }, [refreshPlayers, refreshSquad]);

  // Sync route and handle browser Back/Forward (popstate)
  useEffect(() => {
    refreshData();

    const handlePopState = () => {
      setActiveTab(getTabFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [refreshData]);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    const targetPath = getPathFromTab(newTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleSavePlayer = (updatedPlayer: Player) => {
    savePlayer(updatedPlayer);
  };

  const handleDeletePlayer = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
      removePlayerFromList(id);
      unassignPlayerFromSquad(id);
    }
  };

  return (
    <TopbarProvider>
      <div className="h-screen w-screen overflow-hidden flex font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white bg-slate-100">
        {/* 1. Left Vertical Fixed Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onDataRefresh={refreshData}
        />

        {/* 2. Main Content Wrapper filling remaining space */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Dynamic Context-Aware Topbar */}
          <Topbar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'tactics' && (
              <TacticsBoard
                players={players}
                squad={squad}
                onSaveSquad={saveSquad}
              />
            )}

            {activeTab === 'players' && (
              <PlayerManagement
                players={players}
                onSavePlayer={handleSavePlayer}
                onDeletePlayer={handleDeletePlayer}
              />
            )}

            {activeTab === 'presentation' && <TacticalDiagram players={players} />}
          </main>
        </div>
      </div>
    </TopbarProvider>
  );
};

export default App;
