import React from "react";
import { Info, Sparkles, Database, Share2, ShieldCheck } from "lucide-react";

export const ProjectInfoCard: React.FC = () => {
  return (
    <div className="card-surface flex flex-col gap-4 md:col-span-2 border-slate-200 bg-slate-50/50">
      <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-2.5">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <h2 className="text-h3 font-bold text-slate-800">Thông tin dự án</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-bold block text-[11px]">
            Phiên bản
          </span>
          <span className="font-extrabold text-sm text-slate-800 mt-0.5 block">
            v1.0
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-1 text-slate-400 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phát triển</span>
          </div>
          <span className="font-extrabold text-sm text-slate-800 mt-0.5 block">
            Sản phẩm của AI
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-1 text-slate-400 font-bold text-[11px]">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Lưu trữ</span>
          </div>
          <span className="font-extrabold text-xs text-slate-800 mt-0.5 block">
            LocalStorage (Không dùng Cloud)
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-1 text-slate-400 font-bold text-[11px]">
            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Chia sẻ</span>
          </div>
          <span className="font-extrabold text-xs text-slate-800 mt-0.5 block">
            Xuất / Nhập tệp JSON (.json)
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-slate-500 text-xs bg-white p-2.5 rounded-lg border border-slate-200/80">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Ứng dụng chạy hoàn toàn trên trình duyệt (Local-first), dữ liệu lưu
          cục bộ và an toàn tuyệt đối.
        </span>
      </div>
    </div>
  );
};
