import React from "react";
import type { Player, PositionSlot } from "@/types/futsal";
import { getVietnameseShortName } from "@/utils/pitchHelpers";

interface Props {
  startingPlayersWithNotes: Array<{ slot: PositionSlot; player: Player }>;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const SquadNotesCard: React.FC<Props> = ({
  startingPlayersWithNotes,
  notes,
  onNotesChange,
}) => {
  return (
    <div className="lg:col-span-6 space-y-3">
      <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center space-x-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-xs shrink-0" />
        <span>GHI CHÚ ĐỘI HÌNH & 5 CẦU THỦ RA SÂN</span>
      </h4>

      {startingPlayersWithNotes.length > 0 ? (
        <div className="space-y-1.5 bg-amber-50/70 p-2.5 rounded border border-amber-200/70">
          <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
            📋 Đặc điểm cầu thủ ra sân ({startingPlayersWithNotes.length}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {startingPlayersWithNotes.map(({ slot, player }) => (
              <div
                key={slot.id}
                className="bg-white p-1.5 rounded border border-amber-200/80 flex items-center space-x-1.5 min-w-0"
              >
                <span className="font-black text-slate-900 shrink-0">
                  #{player.number} {getVietnameseShortName(player.name)}:
                </span>
                <span
                  className="text-amber-900 font-semibold truncate"
                  title={player.notes}
                >
                  {player.notes}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400 font-medium italic bg-slate-50 p-2 rounded border border-slate-200/80 text-center">
          Chưa có cầu thủ ra sân nào có ghi chú cá nhân riêng.
        </div>
      )}

      <textarea
        placeholder="Nhập thêm ghi chú bài đánh chung cho đội hình này..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 resize-none font-medium text-slate-800"
        rows={3}
      />
    </div>
  );
};
