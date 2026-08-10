import { useState, useEffect, useCallback } from 'react';
import type { Player, TacticalSquad } from './types/futsal';
import { storageService } from './services/storageService';
import { supabaseService } from './services/supabaseService';
import type { UserProfile } from './services/supabaseService';
import { Header } from './components/Header';
import { PlayerManagement } from './components/PlayerManagement';
import { TacticsBoard } from './components/TacticsBoard';
import { TacticalDiagram } from './components/TacticalDiagram';
import { LoginPage } from './components/LoginPage';
import { AuthModal } from './components/AuthModal';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initial state load from LocalStorage
  const [players, setPlayers] = useState<Player[]>(() => storageService.getPlayers());
  const [squad, setSquad] = useState<TacticalSquad>(() => storageService.getSquad());

  // Function to reload data from Supabase or LocalStorage
  const loadSupabaseData = useCallback(async () => {
    if (!supabaseService.isConfigured()) {
      setIsLoadingAuth(false);
      return;
    }
    try {
      const user = await supabaseService.getCurrentUser();
      setUserProfile(user);

      if (user) {
        // Fetch dynamic players & squad from Supabase PostgreSQL
        const dbPlayers = await supabaseService.getPlayers();
        setPlayers(dbPlayers);
        storageService.savePlayers(dbPlayers);

        const dbSquad = await supabaseService.getSquad();
        if (dbSquad) {
          setSquad(dbSquad);
          storageService.saveSquad(dbSquad);
        }
      }
    } catch (err) {
      console.error('Lỗi nạp dữ liệu động từ Supabase:', err);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const refreshData = () => {
    setPlayers(storageService.getPlayers());
    setSquad(storageService.getSquad());
    loadSupabaseData();
  };

  // Sync route and handle Supabase auth state change
  useEffect(() => {
    loadSupabaseData();

    const subscription = supabaseService.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadSupabaseData();
      } else {
        setUserProfile(null);
        setIsLoadingAuth(false);
      }
    });

    const handlePopState = () => {
      setActiveTab(getTabFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loadSupabaseData]);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    const targetPath = getPathFromTab(newTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleSavePlayer = async (updatedPlayer: Player) => {
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

    // Dynamic sync to Supabase if authenticated
    if (userProfile && supabaseService.isConfigured()) {
      try {
        await supabaseService.savePlayer(updatedPlayer);
      } catch (err: any) {
        console.error('Không thể đồng bộ cầu thủ lên Supabase:', err);
      }
    }
  };

  const handleDeletePlayer = async (id: string) => {
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
        if (userProfile && supabaseService.isConfigured()) {
          supabaseService.saveSquad(newSquad).catch(console.error);
        }
      }

      // Dynamic delete from Supabase
      if (userProfile && supabaseService.isConfigured()) {
        try {
          await supabaseService.deletePlayer(id);
        } catch (err: any) {
          console.error('Không thể xóa cầu thủ khỏi Supabase:', err);
        }
      }
    }
  };

  const handleSaveSquad = async (updatedSquad: TacticalSquad) => {
    setSquad(updatedSquad);
    storageService.saveSquad(updatedSquad);

    // Dynamic sync to Supabase
    if (userProfile && supabaseService.isConfigured()) {
      try {
        await supabaseService.saveSquad(updatedSquad);
      } catch (err: any) {
        console.error('Không thể đồng bộ sơ đồ lên Supabase:', err);
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      try {
        await supabaseService.signOut();
        setUserProfile(null);
        window.history.pushState({}, '', '/');
      } catch (err: any) {
        alert(err.message || 'Lỗi đăng xuất!');
      }
    }
  };

  // Loading spinner during initial session check
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400">Đang kiểm tra trạng thái xác thực...</p>
      </div>
    );
  }

  // ROUTE GUARD: If user is not authenticated, render LoginPage as default
  if (!userProfile) {
    return <LoginPage onLoginSuccess={loadSupabaseData} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onDataRefresh={refreshData}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Tab View Content */}
      <main className="flex-1 pb-14 md:pb-12">
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

      {/* Supabase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={loadSupabaseData}
      />

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs font-semibold text-slate-500 mb-12 md:mb-0">
        Một sản phẩm của AI với sự từ chối mọi trách nhiệm từ tuiii - Hải Trần
      </footer>
    </div>
  );
};

export default App;
