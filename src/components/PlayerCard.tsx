import React from 'react';
import type { Player } from '../types/futsal';
import { getPositionConfig } from '../constants/positionTags';
import { User, Edit2, Trash2 } from 'lucide-react';
import { StatBar } from './ui/StatBar';

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete }) => {
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
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Chỉnh sửa cầu thủ"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(player.id)}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
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
        <StatBar label="Thể Lực" value={player.stamina} colorClass="bg-emerald-600" dotColorClass="bg-emerald-600" />
        <StatBar label="Tấn Công" value={player.attack} colorClass="bg-orange-500" dotColorClass="bg-orange-500" />
        <StatBar label="Phòng Thủ" value={player.defense} colorClass="bg-blue-600" dotColorClass="bg-blue-600" />
      </div>
    </div>
  );
};
