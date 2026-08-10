import { getSupabase } from './supabaseClient';
import type { Player, TacticalSquad } from '../types/futsal';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  isAnonymous?: boolean;
}

export const supabaseService = {
  // Check if Supabase client is configured and available
  isConfigured(): boolean {
    return getSupabase() !== null;
  },

  // Listen to Auth State Changes
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const supabase = getSupabase();
    if (!supabase) return { unsubscribe: () => {} };
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  },

  // Get current user session
  async getCurrentUser(): Promise<UserProfile | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || (user.is_anonymous ? 'Khách Ẩn Danh' : 'Người dùng'),
        avatarUrl: user.user_metadata?.avatar_url,
        isAnonymous: user.is_anonymous,
      };
    } catch (err) {
      console.error('Lỗi lấy thông tin người dùng Supabase:', err);
      return null;
    }
  },

  // Sign In with Google OAuth
  async signInWithGoogle() {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Chưa cấu hình URL và API Key cho Supabase!');
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
  },

  // Sign In with GitHub OAuth
  async signInWithGitHub() {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Chưa cấu hình URL và API Key cho Supabase!');
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
  },

  // Sign In Anonymously (Guest Login)
  async signInAnonymously() {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Chưa cấu hình URL và API Key cho Supabase!');
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.user;
  },

  // Sign Out
  async signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Fetch Players from Supabase PostgreSQL Table 'players'
  async getPlayers(): Promise<Player[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('number', { ascending: true });

    if (error) {
      console.error('Lỗi tải danh sách cầu thủ từ Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      number: row.number,
      name: row.name,
      avatar: row.avatar || undefined,
      stamina: row.stamina,
      attack: row.attack,
      defense: row.defense,
      positions: row.positions || [],
    }));
  },

  // Save/Update Player to Supabase PostgreSQL
  async savePlayer(player: Player): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Bạn cần đăng nhập để lưu cầu thủ lên Supabase!');

    const row = {
      id: player.id,
      user_id: user.id,
      number: player.number,
      name: player.name,
      avatar: player.avatar || null,
      stamina: player.stamina,
      attack: player.attack,
      defense: player.defense,
      positions: player.positions || [],
    };

    const { error } = await supabase.from('players').upsert(row, { onConflict: 'id,user_id' });
    if (error) {
      console.error('Lỗi lưu cầu thủ lên Supabase:', error);
      throw error;
    }
  },

  // Save All Players Array to Supabase
  async saveAllPlayers(players: Player[]): Promise<void> {
    for (const p of players) {
      await this.savePlayer(p);
    }
  },

  // Delete Player from Supabase PostgreSQL
  async deletePlayer(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Lỗi xóa cầu thủ khỏi Supabase:', error);
      throw error;
    }
  },

  // Fetch Squad from Supabase PostgreSQL Table 'squads'
  async getSquad(): Promise<TacticalSquad | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('squads')
      .select('*')
      .eq('id', 'default')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Lỗi tải đội hình từ Supabase:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      formationId: data.formation_id || '4-0',
      slots: data.slots || [],
      notes: data.notes || '',
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  },

  // Save Squad to Supabase PostgreSQL
  async saveSquad(squad: TacticalSquad): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Bạn cần đăng nhập để lưu đội hình lên Supabase!');

    const row = {
      id: squad.id || 'default',
      user_id: user.id,
      formation_id: squad.formationId,
      slots: squad.slots,
      notes: squad.notes || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('squads').upsert(row, { onConflict: 'id,user_id' });
    if (error) {
      console.error('Lỗi lưu đội hình lên Supabase:', error);
      throw error;
    }
  },
};
