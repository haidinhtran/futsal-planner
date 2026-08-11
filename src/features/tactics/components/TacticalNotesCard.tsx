import React from 'react';
import type { Player, PositionSlot } from '../../../types/futsal';
import { getVietnameseShortName } from '../../../utils/formatters';

interface TacticalNotesCardProps {
  startingPlayersWithNotes: Array<{ slot: PositionSlot; player: Player }>;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const TacticalNotesCard: React.FC<TacticalNotesCardProps> = ({
  startingPlayersWithNotes,
  notes,
  onNotesChange,
}) => {
  return (
    <div className="space-y-2 flex flex-col h-full">
      <h4 className="text-sm font-black text-slate-500 uppercase tracking-wide">
        GHI CHÚ ĐỘI HÌNH & 5 CẦU THỦ RA SÂN
      </h4>

      {startingPlayersWithNotes.length > 0 ? (
        <div className="space-y-1 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/90 max-h-[140px] overflow-y-auto">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block mb-0.5">
            📋 Đặc điểm cầu thủ ra sân ({startingPlayersWithNotes.length}):
          </span>
          <div className="grid grid-cols-1 gap-1 text-sm">
            {startingPlayersWithNotes.map(({ slot, player }) => (
              <div key={slot.id} className="bg-white p-1.5 rounded-lg border border-amber-200/80 shadow-2xs flex items-start space-x-1">
                <span className="font-black text-slate-900 shrink-0">#{player.number} {getVietnameseShortName(player.name)}:</span>
                <span className="text-amber-900 font-semibold truncate" title={player.notes}>{player.notes}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400 font-medium italic bg-slate-50 p-2 rounded-xl border border-slate-100">
          Chưa có cầu thủ ra sân nào có ghi chú cá nhân riêng.
        </div>
      )}

      <textarea
        placeholder="Nhập ghi chú bài đánh chung cho đội hình này..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="w-full flex-1 p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium text-slate-800 min-h-[70px]"
        rows={3}
      ></textarea>
    </div>
  );
};
