import React from 'react';
import type { Player } from '../types/futsal';
import { getPositionConfig } from '../types/futsal';
import { User, Edit2, Trash2 } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete }) => {
  const formatStat = (val: number | null) => (val !== null ? val : '-');

  const getBarWidth = (val: number | null) => {
    if (val === null) return '0%';
    const pct = Math.min(Math.max((val / 10) * 100, 0), 100);
    return `${pct}%`;
  };

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all duration-200 group">
      {/* Shirt Number Badge */}
      <div className="absolute top-3 left-3 w-7 h-7 bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center justify-center shadow-xs">
        {player.number}
      </div>

      {/* Action Buttons on Hover */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(player)}
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Chỉnh sửa cầu thủ"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(player.id)}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Xóa cầu thủ"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Card Body: Avatar & Details */}
      <div className="flex flex-col items-center mb-3">
        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-2 overflow-hidden shadow-inner">
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-9 h-9 text-slate-400" />
          )}
        </div>
        <h3 className="text-base font-bold text-slate-900 text-center line-clamp-1">{player.name}</h3>

        {/* Position Tags (Full Labels) */}
        <div className="flex flex-wrap items-center justify-center gap-1 mt-1">
          {player.positions && player.positions.length > 0 ? (
            player.positions.map((pos) => {
              const cfg = getPositionConfig(pos);
              return (
                <span
                  key={pos}
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
                >
                  {cfg.fullLabel}
                </span>
              );
            })
          ) : (
            <span className="text-[11px] font-semibold text-slate-400">Chưa xếp vị trí</span>
          )}
        </div>

        {/* Individual Player Notes Badge */}
        {player.notes && player.notes.trim() !== '' && (
          <div className="mt-2 w-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-2.5 py-1.5 rounded-xl flex items-start space-x-1.5 text-left">
            <span className="shrink-0 text-amber-600 font-bold">📝</span>
            <span className="line-clamp-2 leading-tight">{player.notes}</span>
          </div>
        )}
      </div>

      {/* Stat Sliders / Bars */}
      <div className="space-y-2.5 pt-1 border-t border-slate-100">
        {/* Thể Lực */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <div className="flex items-center space-x-1 w-22 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Thể Lực</span>
          </div>
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div
              className="bg-emerald-600 h-full rounded-full stat-bar-fill"
              style={{ width: getBarWidth(player.stamina) }}
            ></div>
          </div>
          <span className="w-7 text-right font-bold text-slate-800">{formatStat(player.stamina)}</span>
        </div>

        {/* Tấn Công */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <div className="flex items-center space-x-1 w-22 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Tấn Công</span>
          </div>
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div
              className="bg-orange-500 h-full rounded-full stat-bar-fill"
              style={{ width: getBarWidth(player.attack) }}
            ></div>
          </div>
          <span className="w-7 text-right font-bold text-slate-800">{formatStat(player.attack)}</span>
        </div>

        {/* Phòng Thủ */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <div className="flex items-center space-x-1 w-22 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Phòng Thủ</span>
          </div>
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div
              className="bg-blue-600 h-full rounded-full stat-bar-fill"
              style={{ width: getBarWidth(player.defense) }}
            ></div>
          </div>
          <span className="w-7 text-right font-bold text-slate-800">{formatStat(player.defense)}</span>
        </div>
      </div>
    </div>
  );
};
