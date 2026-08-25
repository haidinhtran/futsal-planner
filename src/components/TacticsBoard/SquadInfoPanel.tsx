import React from "react";
import type { Player, PositionSlot, FormationPreset, AttackDirection } from "@/types/futsal";
import { SquadNotesCard } from "./SquadNotesCard";

interface Props {
  currentPreset: FormationPreset;
  attackDirection: AttackDirection;
  teamAverageStats: { avgStamina: string; avgAttack: string; avgDefense: string };
  startingPlayersWithNotes: Array<{ slot: PositionSlot; player: Player }>;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const SquadInfoPanel: React.FC<Props> = ({
  currentPreset,
  attackDirection,
  teamAverageStats,
  startingPlayersWithNotes,
  notes,
  onNotesChange,
}) => {
  return (
    <div className="border-t border-slate-200 pt-5 pb-6">
      <div className="w-full max-w-[1920px] mx-auto layout-page-container grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center space-x-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-xs shrink-0" />
              <span>THÔNG TIN ĐỘI HÌNH & BÀI ĐÁNH</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs pt-0.5">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70">
                <span className="font-semibold text-slate-500 block text-[11px]">Đội hình:</span>
                <span className="text-blue-700 font-black text-sm block mt-0.5">{currentPreset.name}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70">
                <span className="font-semibold text-slate-500 block text-[11px]">Sơ đồ:</span>
                <span className="font-bold text-slate-800 text-xs block mt-0.5 truncate" title={currentPreset.schema}>{currentPreset.schema}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70">
                <span className="font-semibold text-slate-500 block text-[11px]">Hướng tấn công:</span>
                <span className="font-bold text-slate-800 text-xs block mt-0.5">
                  {attackDirection === "right" ? "Phải ➔" : "⬅ Trái"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center space-x-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-xs shrink-0" />
              <span>TỔNG CHỈ SỐ ĐỘI HÌNH (TB 5 CẦU THỦ RA SÂN)</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-50/70 p-2.5 rounded border border-emerald-200/70">
                <span className="block text-[11px] font-bold text-emerald-700">🟢 Bền (Thể Lực)</span>
                <span className="text-lg font-black text-emerald-700 mt-0.5 block">{teamAverageStats.avgStamina}</span>
              </div>
              <div className="bg-amber-50/70 p-2.5 rounded border border-amber-200/70">
                <span className="block text-[11px] font-bold text-amber-700">🟠 Công (Tấn Công)</span>
                <span className="text-lg font-black text-amber-700 mt-0.5 block">{teamAverageStats.avgAttack}</span>
              </div>
              <div className="bg-blue-50/70 p-2.5 rounded border border-blue-200/70">
                <span className="block text-[11px] font-bold text-blue-700">🔵 Thủ (Phòng Thủ)</span>
                <span className="text-lg font-black text-blue-700 mt-0.5 block">{teamAverageStats.avgDefense}</span>
              </div>
            </div>
          </div>
        </div>

        <SquadNotesCard
          startingPlayersWithNotes={startingPlayersWithNotes}
          notes={notes}
          onNotesChange={onNotesChange}
        />
      </div>
    </div>
  );
};
