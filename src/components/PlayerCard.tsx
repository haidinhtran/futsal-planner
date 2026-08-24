import React from "react";
import type { Player } from "../types/futsal";
import { getUniquePositionConfigs } from "../types/futsal";
import { Edit2, Trash2, Star, FileText } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onEdit,
  onDelete,
}) => {
  const formatStat = (val: number | null) => (val !== null ? val : "-");

  const getBarWidth = (val: number | null) => {
    if (val === null) return "0%";
    const pct = Math.min(Math.max((val / 10) * 100, 0), 100);
    return `${pct}%`;
  };

  const getStarRating = (p: Player): number | null => {
    if (p.stamina === null || p.attack === null || p.defense === null) {
      return null;
    }
    const total = p.stamina + p.attack + p.defense;
    if (total >= 27 && total <= 30) return 5;
    if (total >= 22 && total < 27) return 4;
    if (total >= 17 && total < 22) return 3;
    return null;
  };

  const starCount = getStarRating(player);
  const positionConfigs = getUniquePositionConfigs(player.positions);
  const hasNotes = player.notes && player.notes.trim() !== "";

  const StatBar = ({ label, val, colorClass }: { label: string, val: number | null, colorClass: string }) => (
    <div className="flex items-center gap-1 min-w-0">
      <span className="text-slate-500 font-bold shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
        <div className={`${colorClass} h-full transition-all rounded-full`} style={{ width: getBarWidth(val) }} />
      </div>
      <span className="font-extrabold text-slate-700 shrink-0">{formatStat(val)}</span>
    </div>
  );

  return (
    <div className="relative card-surface hover:shadow-md transition-all group overflow-hidden flex flex-col p-3 sm:p-4 bg-white">
      {/* Individual Player Notes Tooltip trigger */}
      {hasNotes && (
        <div className="absolute top-0 right-0 group/note z-20">
          {/* A small invisible hit area to trigger tooltip without taking space */}
          <div className="absolute top-0 right-0 w-8 h-8 cursor-help"></div>
          {/* Hover Tooltip Popup */}
          <div className="absolute right-8 top-0 hidden group-hover/note:block w-48 p-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in duration-150">
            <div className="font-extrabold text-amber-400 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>Ghi chú đặc điểm:</span>
            </div>
            <p className="leading-snug whitespace-normal break-words text-slate-200">
              {player.notes}
            </p>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex items-start justify-between gap-2">
        {/* Top Left: Number, Name, Jersey Name, Stars */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* Row 1: Number & Name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] font-black text-slate-500 shrink-0 select-none">#{player.number}</span>
            <h3 className="text-sm font-extrabold text-slate-800 line-clamp-1 truncate" title={player.name}>
              {player.name}
            </h3>
            {hasNotes && <FileText className="w-3 h-3 text-amber-500 shrink-0" />}
          </div>
          
          {/* Row 2: Jersey Name & Stars */}
          <div className="flex items-center mt-1 flex-wrap gap-y-1">
            {player.jerseyName && (
              <span className="text-[11px] font-bold text-slate-500 tracking-wide truncate mr-1.5">
                {player.jerseyName} <span className="text-slate-300 ml-1.5">•</span>
              </span>
            )}
            {/* Star Rating */}
            {starCount !== null ? (
              <div
                className="flex items-center space-x-0.5"
                title={`Đánh giá: ${starCount}/5 sao (Tổng ${player.stamina! + player.attack! + player.defense!} điểm)`}
              >
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star
                    key={index}
                    className={`w-3 h-3 ${index <= starCount ? 'fill-slate-500 text-slate-500' : 'fill-slate-200 text-slate-200'}`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 italic">
                Chưa đủ đánh giá
              </span>
            )}
          </div>
        </div>

        {/* Top Right: Positions & Actions */}
        <div className="flex flex-col items-end shrink-0 gap-1.5">
          {/* Row 1: Positions */}
          <div className="flex items-center justify-end gap-1 flex-wrap max-w-[100px]">
            {positionConfigs.length > 0 ? (
              positionConfigs.map((cfg) => {
                const getBadgeClass = (pos: string) => {
                  if (pos === 'GK') return 'badge-gk';
                  if (pos === 'FI') return 'badge-fixo';
                  if (pos.startsWith('AL')) return 'badge-ala';
                  if (pos === 'PI') return 'badge-pivot';
                  return '';
                };
                return (
                <span
                  key={cfg.shortLabel}
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border-0 opacity-90 ${getBadgeClass(cfg.id)}`}
                  title={`Vị trí: ${cfg.fullLabel}`}
                >
                  {cfg.shortLabel === "ALA" ? "AL" : cfg.shortLabel}
                </span>
              )})
            ) : (
              <span className="text-[10px] font-semibold text-slate-400">
                -
              </span>
            )}
          </div>
          
          {/* Row 2: Actions */}
          {(onEdit || onDelete) && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(player)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                  title="Chỉnh sửa cầu thủ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(player.id)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="Xóa cầu thủ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-2.5"></div>

      {/* Bottom Section: Stats */}
      <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-[11px]">
        <StatBar label="Bền" val={player.stamina} colorClass="bg-slate-700" />
        <StatBar label="Công" val={player.attack} colorClass="bg-slate-500" />
        <StatBar label="Thủ" val={player.defense} colorClass="bg-slate-400" />
      </div>
    </div>
  );
};
