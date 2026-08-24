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
    if (total >= 27) return 5;
    if (total >= 22) return 4;
    if (total >= 17) return 3;
    if (total >= 12) return 2;
    return 1;
  };

  const starCount = getStarRating(player);
  const positionConfigs = getUniquePositionConfigs(player.positions);
  const hasNotes = player.notes && player.notes.trim() !== "";

  const StatBar = ({ label, val, colorClass }: { label: string, val: number | null, colorClass: string }) => (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-slate-500 font-bold shrink-0 w-8 sm:w-9 text-left">{label}</span>
      <div className="flex-1 h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: getBarWidth(val) }}></div>
      </div>
      <span className="font-black text-slate-800 w-4 sm:w-6 text-right">{formatStat(val)}</span>
    </div>
  );

  return (
    <div className="relative card-surface hover:shadow-md transition-all group overflow-hidden bg-white p-0">
      {/* ---------------- MOBILE LAYOUT (Nguyên bản, không sửa) ---------------- */}
      <div className="md:hidden flex flex-col p-3 sm:p-4">
        {/* Individual Player Notes Tooltip trigger */}
        {hasNotes && (
          <div className="absolute top-0 right-0 group/note z-20">
            <div className="absolute top-0 right-0 w-8 h-8 cursor-help"></div>
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
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[13px] sm:text-[14px] font-black text-slate-500 shrink-0 select-none">#{player.number}</span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 line-clamp-1 truncate" title={player.name}>
                {player.name}
              </h3>
              {hasNotes && <FileText className="w-3 h-3 text-amber-500 shrink-0" />}
            </div>
            
            <div className="flex items-center mt-1 flex-wrap gap-y-1">
              {player.jerseyName && (
                <span className="text-[11px] sm:text-[12px] font-bold text-slate-500 tracking-wide truncate mr-1.5">
                  {player.jerseyName} <span className="text-slate-300 ml-1.5">•</span>
                </span>
              )}
              {starCount !== null ? (
                <div
                  className="flex items-center space-x-0.5"
                  title={`Đánh giá: ${starCount}/5 sao (Tổng ${player.stamina! + player.attack! + player.defense!} điểm)`}
                >
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${index <= starCount ? 'fill-slate-500 text-slate-500' : 'fill-slate-200 text-slate-200'}`}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 italic">
                  Chưa đủ đánh giá
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1.5 sm:gap-2">
            <div className="flex items-center justify-end gap-1 sm:gap-1.5 flex-wrap max-w-[100px] sm:max-w-[140px]">
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
                    className={`text-[10px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded border-0 opacity-90 ${getBadgeClass(cfg.id)}`}
                    title={`Vị trí: ${cfg.fullLabel}`}
                  >
                    {cfg.shortLabel === "ALA" ? "AL" : cfg.shortLabel}
                  </span>
                )})
              ) : (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
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

      {/* ---------------- DESKTOP LAYOUT (Mới) ---------------- */}
      <div className="hidden md:flex flex-col w-full h-full">
        {/* Header: Notes (Left) & Stars (Right) */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100">
          <div className="w-5 h-5 flex items-center justify-center">
            {hasNotes ? (
              <div className="group/note relative flex items-center">
                <FileText className="w-4 h-4 text-amber-500 cursor-help" />
                <div className="absolute left-0 top-full mt-2 hidden group-hover/note:block w-48 p-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in duration-150">
                  <div className="font-extrabold text-amber-400 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Ghi chú đặc điểm:</span>
                  </div>
                  <p className="leading-snug whitespace-normal break-words text-slate-200">
                    {player.notes}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="flex items-center">
            {starCount !== null ? (
              <div className="flex items-center space-x-0.5" title={`Đánh giá: ${starCount}/5 sao`}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star
                    key={index}
                    className={`w-3.5 h-3.5 ${index <= starCount ? 'fill-slate-500 text-slate-500' : 'fill-slate-200 text-slate-200'}`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 italic">Chưa đủ đánh giá</span>
            )}
          </div>
        </div>

        {/* Body: Jersey Name, Number, Full Name, Positions, Stats */}
        <div className="flex flex-col items-center px-5 py-4 flex-1">
          {/* Jersey Name */}
          <span className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1 line-clamp-1 w-full text-center">
            {player.jerseyName || "-"}
          </span>
          
          {/* Number */}
          <span className="text-5xl font-black text-slate-800 leading-none mb-2 select-none">
            {player.number}
          </span>
          
          {/* Full Name */}
          <h3 className="text-lg font-extrabold text-slate-600 line-clamp-1 mb-2 text-center w-full" title={player.name}>
            {player.name}
          </h3>
          
          {/* Positions */}
          <div className="flex justify-center items-center gap-1.5 flex-wrap mb-6">
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
                    className={`text-xs font-extrabold px-2.5 py-1 rounded border-0 opacity-90 ${getBadgeClass(cfg.id)}`}
                    title={`Vị trí: ${cfg.fullLabel}`}
                  >
                    {cfg.shortLabel === "ALA" ? "AL" : cfg.shortLabel}
                  </span>
                )
              })
            ) : (
              <span className="text-xs font-semibold text-slate-400">-</span>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex flex-col gap-2.5 text-xs w-full mt-auto">
            <StatBar label="Bền" val={player.stamina} colorClass="bg-slate-700" />
            <StatBar label="Công" val={player.attack} colorClass="bg-slate-500" />
            <StatBar label="Thủ" val={player.defense} colorClass="bg-slate-400" />
          </div>
        </div>

        {/* Footer: Actions (Chi Tiết | Xóa) */}
        {(onEdit || onDelete) && (
          <div className="flex items-center border-t border-slate-100 mt-auto bg-slate-50/50">
            {onEdit && (
              <button
                onClick={() => onEdit(player)}
                className={`flex-1 py-3 text-xs font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors uppercase flex items-center justify-center gap-1.5 ${onDelete ? 'border-r border-slate-200' : ''}`}
                title="Chỉnh sửa cầu thủ"
              >
                CHI TIẾT
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(player.id)}
                className="flex-1 py-3 text-xs font-black text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors uppercase flex items-center justify-center gap-1.5"
                title="Xóa cầu thủ"
              >
                XÓA
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
