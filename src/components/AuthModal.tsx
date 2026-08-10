import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { getStoredSupabaseConfig, saveSupabaseConfig } from '../services/supabaseClient';
import { X, Key, Sparkles, User, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'config'>('auth');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [publishableKey, setPublishableKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { url, key } = getStoredSupabaseConfig();
    setSupabaseUrl(url);
    setPublishableKey(key);

    if (!url || !key) {
      setActiveTab('config');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabaseUrl || !publishableKey) {
      setError('Vui lòng nhập đầy đủ Supabase Project URL và Publishable Key!');
      return;
    }

    try {
      saveSupabaseConfig(supabaseUrl.trim(), publishableKey.trim());
      alert('Đã lưu cấu hình Supabase thành công!');
      setActiveTab('auth');
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu cấu hình!');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabaseService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập Google!');
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabaseService.signInWithGitHub();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập GitHub!');
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabaseService.signInAnonymously();
      alert('Đã đăng nhập dưới dạng Khách Ẩn Danh thành công!');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập Khách Ẩn Danh!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 pb-safe sm:pb-0">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-900">
              {activeTab === 'auth' ? 'Đăng Nhập Tài Khoản' : 'Cấu Hình Supabase'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'auth' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'config' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Cấu Hình API Key
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: AUTH BUTTONS */}
        {activeTab === 'auth' && (
          <div className="space-y-3 pt-1">
            {!supabaseService.isConfigured() && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl font-semibold mb-2">
                ⚠️ Chưa phát hiện Supabase API Key. Bạn vui lòng chuyển sang tab <b>"Cấu Hình API Key"</b> để nhập Publishable Key của bạn nhé.
              </div>
            )}

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading || !supabaseService.isConfigured()}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập bằng Google</span>
            </button>

            {/* GitHub Login */}
            <button
              onClick={handleGitHubLogin}
              disabled={loading || !supabaseService.isConfigured()}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Đăng nhập bằng GitHub</span>
            </button>

            <div className="relative my-3 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase absolute">HOẶC</span>
            </div>

            {/* Guest Login */}
            <button
              onClick={handleGuestLogin}
              disabled={loading || !supabaseService.isConfigured()}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Dùng thử dạng Khách Ẩn Danh (Anonymous)</span>
            </button>
          </div>
        )}

        {/* TAB 2: CONFIG FORM */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                required
                placeholder="https://xyz...supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Publishable Key (hoặc Anon Key)
              </label>
              <input
                type="text"
                required
                placeholder="sb_publishable_... hoặc eyJ..."
                value={publishableKey}
                onChange={(e) => setPublishableKey(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Dán <b>Publishable key</b> từ trang Supabase Dashboard ➔ Project Settings ➔ API Keys.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Lưu Cấu Hình Supabase</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
