import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Keys stored in LocalStorage if user inputs credentials via UI
const STORAGE_URL_KEY = 'ftsp_supabase_url';
const STORAGE_KEY_KEY = 'ftsp_supabase_publishable_key';

export const getStoredSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem(STORAGE_URL_KEY) || '';
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    localStorage.getItem(STORAGE_KEY_KEY) ||
    '';
  return { url, key };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url) localStorage.setItem(STORAGE_URL_KEY, url);
  if (key) localStorage.setItem(STORAGE_KEY_KEY, key);
  // Re-initialize client
  initSupabaseClient();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  supabase = null;
};

let supabase: SupabaseClient | null = null;

export const initSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getStoredSupabaseConfig();
  if (url && key) {
    try {
      supabase = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabase;
    } catch (err) {
      console.error('Lỗi khởi tạo Supabase client:', err);
      supabase = null;
      return null;
    }
  }
  supabase = null;
  return null;
};

// Initial setup
initSupabaseClient();

export const getSupabase = (): SupabaseClient | null => {
  if (!supabase) {
    return initSupabaseClient();
  }
  return supabase;
};
