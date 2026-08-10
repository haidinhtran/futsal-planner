import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Sparkles, User, AlertCircle, ShieldCheck, ArrowRight, Layout, Users, PenTool } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = supabaseService.isConfigured();

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabaseService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối đăng nhập Google!');
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabaseService.signInWithGitHub();
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối đăng nhập GitHub!');
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await supabaseService.signInAnonymously();
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo tài khoản Khách!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 w-full">
        {/* Left Column: Hero & App Highlights */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Logo Brand section in Content */}
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <svg className="w-7 h-7 text-white stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12 7 9.5 9.5 10.5 13 13.5 13 14.5 9.5 12 7" fill="currentColor" />
                <path d="M12 7V2" />
                <path d="M9.5 9.5 5 7" />
                <path d="M10.5 13 7.5 17.5" />
                <path d="M13.5 13 16.5 17.5" />
                <path d="M14.5 9.5 19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">FTSP</h1>
              <p className="text-xs text-slate-400 font-semibold">Futsal Tactics & Squad Planner</p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Một ứng dụng Futsal vui vẻ cho anh em đá bóng</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Thiết Kế Thế Trận & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              Đồng Bộ Dữ Liệu Tự Động
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Đăng nhập nhẹ một cái để khởi tạo sơ đồ đội hình Futsal, xếp chỉ số anh em và đồng bộ kho dữ liệu riêng của bạn lên CSDL đám mây nha!
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
              <Layout className="w-5 h-5 text-blue-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Thế Trận 2D</h4>
              <p className="text-[11px] text-slate-400">Thiết lập vị trí & sơ đồ thi đấu tương tác trực quan.</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
              <Users className="w-5 h-5 text-emerald-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Quản Lý Cầu Thủ</h4>
              <p className="text-[11px] text-slate-400">Lưu trữ chỉ số thể lực, tấn công, phòng thủ & vị trí.</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
              <PenTool className="w-5 h-5 text-amber-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Diễn Giải Bài Đánh</h4>
              <p className="text-[11px] text-slate-400">Vẽ mũi tên di chuyển & thuyết trình bài đánh cảm ứng.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Authentication Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-white">Đăng Nhập Tài Khoản</h3>
              <p className="text-xs text-slate-400">
                Chọn 1 phương thức dưới đây để bắt đầu trải nghiệm
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-2xl flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!isConfigured && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3.5 rounded-2xl font-semibold">
                ⚠️ Chưa phát hiện Supabase API Key trong môi trường (VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY).
              </div>
            )}

            {/* LOGIN OPTIONS */}
            <div className="space-y-3 pt-2">
              {/* Google OAuth Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
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

              {/* GitHub OAuth Login */}
              <button
                onClick={handleGitHubLogin}
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-2xl shadow-md border border-slate-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Đăng nhập bằng GitHub</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-950 px-3 text-[10px] font-black text-slate-500 uppercase absolute">HOẶC</span>
              </div>

              {/* Anonymous Guest Login */}
              <button
                onClick={handleGuestLogin}
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-2xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Dùng Thử Dạng Khách (Anonymous Guest)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 font-medium pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bảo mật Row Level Security (RLS) theo tài khoản</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-4 text-center text-xs font-semibold text-slate-500">
        Một sản phẩm của AI với sự từ chối mọi trách nhiệm từ tuiii - Hải Trần
      </footer>
    </div>
  );
};
