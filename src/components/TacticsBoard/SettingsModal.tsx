import React from "react";
import { Settings, X, ArrowLeftRight, Check } from "lucide-react";
import { FORMATION_PRESETS } from "@/services/initialData";
import type { AttackDirection } from "@/types/futsal";
import { SettingsDirectionControl } from "./SettingsDirectionControl";

interface SettingsModalProps {
  isOpen: boolean;
  currentFormationId: string;
  attackDirection: AttackDirection;
  showSubs: boolean;
  onClose: () => void;
  onSelectFormation: (formationId: string) => void;
  onToggleAttackDirection: () => void;
  onToggleShowSubs: () => void;
  onQuickSwap: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentFormationId,
  attackDirection,
  showSubs,
  onClose,
  onSelectFormation,
  onToggleAttackDirection,
  onToggleShowSubs,
  onQuickSwap,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl border border-slate-200/90">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h3 className="text-h3 text-slate-900">Cấu hình Đội Hình</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Sơ đồ chiến thuật</label>
            <select
              value={currentFormationId}
              onChange={(e) => onSelectFormation(e.target.value)}
              className="w-full bg-slate-50 text-emerald-700 font-black text-sm px-3 py-2.5 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500 shadow-xs"
            >
              {FORMATION_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.subName})</option>
              ))}
            </select>
          </div>

          <SettingsDirectionControl attackDirection={attackDirection} onToggle={onToggleAttackDirection} />

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Quản lý Dự bị</label>
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer" onClick={onToggleShowSubs}>
              <span className="text-sm font-bold text-slate-700">Hiển thị khe thẻ dự bị</span>
              <button
                type="button"
                role="switch"
                aria-checked={showSubs}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
                  showSubs ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-xs transition duration-200 ${
                  showSubs ? "translate-x-5" : "translate-x-0"
                }`}>
                  {showSubs ? <Check className="w-3 h-3 text-blue-600 stroke-[3]" /> : <X className="w-3 h-3 text-slate-400 stroke-[3]" />}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Tiện ích</label>
            <button
              onClick={() => {
                onQuickSwap();
                onClose();
              }}
              className="w-full btn-outline flex items-center justify-center py-2 text-sm"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              <span>Đổi cánh nhanh (Ala Trái ↔ Phải)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
