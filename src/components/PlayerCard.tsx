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

  // Calculate star rating (5★: 27-30, 4★: 22-26.5, 3★: 17-21.5, <17 or incomplete: "Chưa đủ chỉ số để đánh giá")
  const getStarRating = (p: Player): number | null => {
    if (p.stamina === null || p.attack === null || p.defense === null) {
      return null;
    }
    const total = p.stamina + p.attack + p.defense;
    if (total >= 27 && total <= 30) return 5;
    if (total >= 22 && total < 27) return 4;
    if (total >= 17 && total < 22) return 3;
    return null; // <17: Không có 2 sao và 1 sao -> Chưa đủ chỉ số để đánh giá
  };

  const starCount = getStarRating(player);
  const positionConfigs = getUniquePositionConfigs(player.positions);
  const hasNotes = player.notes && player.notes.trim() !== "";

  return (
    <div className="relative card-surface hover:shadow-md transition-all group overflow-hidden">
      {/* Individual Player Notes Icon Badge (Top Left Corner) with Hover Tooltip */}
      {hasNotes && (
        <div className="absolute top-3 left-3 group/note z-10">
          <div
            className="p-1.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg shadow-2xs cursor-help flex items-center justify-center transition-all hover:bg-slate-200 hover:text-slate-900"
            title={`Ghi chú đặc điểm: ${player.notes}`}
          >
            <FileText className="w-3.5 h-3.5" />
          </div>

          {/* Hover Tooltip Popup */}
          <div className="absolute left-0 top-full mt-1.5 hidden group-hover/note:block w-48 p-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in duration-150">
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

      {/* Action Buttons on Hover */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(player)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Chỉnh sửa cầu thủ"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(player.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Xóa cầu thủ"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Card Body: Big Unframed Centered Shirt Number & Player Name */}
      <div className="flex flex-col items-center mb-2.5 pt-1">
        <span
          className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none mb-2 select-none"
          title={`Số áo: #${player.number}`}
        >
          #{player.number}
        </span>

        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 text-center line-clamp-1">
          {player.name}
        </h3>
        
        {player.jerseyName && (
          <p className="text-[11px] font-bold text-slate-500 text-center tracking-wider -mt-0.5">
            {player.jerseyName}
          </p>
        )}

        {/* Star Rating Section - Monochrome Stars */}
        <div className="mt-1.5 flex items-center justify-center">
          {starCount !== null ? (
            <div
              className="flex items-center space-x-1"
              title={`Đánh giá: ${starCount}/5 sao (Tổng ${player.stamina! + player.attack! + player.defense!} điểm)`}
            >
              {[1, 2, 3, 4, 5].slice(0, starCount).map((index) => (
                <Star
                  key={index}
                  className="w-3.5 h-3.5 fill-slate-500 text-slate-500"
                />
              ))}
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-400 italic">
              Chưa đủ chỉ số để đánh giá
            </span>
          )}
        </div>
      </div>

      {/* Monolithic Greyscale Pattern Stat Bars */}
      <div className="space-y-2.5 text-xs">
        {/* Bền (Thể Lực) - Dark Charcoal Fill */}
        <div className="flex items-center space-x-2 font-semibold">
          <span className="w-10 text-slate-500 font-bold">Bền</span>
          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className="bg-slate-700 h-full transition-all rounded-full"
              style={{ width: getBarWidth(player.stamina) }}
            />
          </div>
          <span className="w-6 text-right font-extrabold text-slate-800">
            {formatStat(player.stamina)}
          </span>
        </div>

        {/* Công (Tấn Công) - Medium Graphite Fill */}
        <div className="flex items-center space-x-2 font-semibold">
          <span className="w-10 text-slate-500 font-bold">Công</span>
          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className="bg-slate-500 h-full transition-all rounded-full"
              style={{ width: getBarWidth(player.attack) }}
            />
          </div>
          <span className="w-6 text-right font-extrabold text-slate-700">
            {formatStat(player.attack)}
          </span>
        </div>

        {/* Thủ (Phòng Thủ) - Slate Gray Fill */}
        <div className="flex items-center space-x-2 font-semibold">
          <span className="w-10 text-slate-500 font-bold">Thủ</span>
          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className="bg-slate-400 h-full transition-all rounded-full"
              style={{ width: getBarWidth(player.defense) }}
            />
          </div>
          <span className="w-6 text-right font-extrabold text-slate-600">
            {formatStat(player.defense)}
          </span>
        </div>

        {/* Minimalist Color-Coded Position Tags */}
        <div className="pt-3 flex flex-wrap items-center justify-end gap-1">
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
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg border-0 opacity-80 ${getBadgeClass(cfg.id)} hover:opacity-90 transition-opacity cursor-help shadow-2xs`}
                title={`Vị trí: ${cfg.fullLabel}`}
              >
                {cfg.shortLabel === "ALA" ? "AL" : cfg.shortLabel}
              </span>
            )})
          ) : (
            <span className="text-xs font-semibold text-slate-400">
              Chưa xếp vị trí
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
