import React from "react";
import { GripVertical } from "lucide-react";
import type { Player, PositionTag } from "@/types/futsal";
import { getUniquePositionConfigs } from "@/types/futsal";
import { getPlayerTotalScore } from "@/utils/pitchHelpers";

interface Props {
  player: Player;
  isAssigned: boolean;
  onPlayerClick: (id: string) => void;
  onDragStartPlayer: (e: React.DragEvent, id: string) => void;
}

export const PlayerSidebarItem: React.FC<Props> = ({
  player: p,
  isAssigned,
  onPlayerClick,
  onDragStartPlayer,
}) => {
  const total = getPlayerTotalScore(p);
  const uniquePositions = getUniquePositionConfigs(
    p.positions as PositionTag[],
  );

  return (
    <div
      draggable
      onDragStart={(e) => onDragStartPlayer(e, p.id)}
      onClick={() => onPlayerClick(p.id)}
      className={`group relative card-surface transition-all duration-200 select-none flex flex-col justify-between ${
        isAssigned
          ? "bg-slate-50 border-slate-200/80 opacity-60 shadow-none cursor-pointer"
          : "hover:shadow-md hover:border-blue-400/80 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="flex items-center justify-between pb-1.5 mb-1.5 gap-2 border-b border-slate-100">
        <div className="flex items-center space-x-2 min-w-0 flex-1 pr-1">
          <GripVertical
            className={`w-4 h-4 shrink-0 ${
              isAssigned
                ? "text-slate-300"
                : "text-slate-400 group-hover:text-blue-600"
            }`}
          />
          <span
            className={`w-5 h-5 font-black text-xs rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
              isAssigned ? "bg-slate-400 text-white" : "bg-slate-900 text-white"
            }`}
          >
            #{p.number}
          </span>
          <span
            className={`font-extrabold text-xs xl:text-sm truncate ${
              isAssigned ? "text-slate-400" : "text-slate-900"
            }`}
            title={p.name}
          >
            {p.name}
          </span>
        </div>
        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/80 shrink-0">
          {total !== -1 ? `${total}đ` : "-"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 pt-0.5 text-[11px]">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span
            className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60"
            title="Tấn công"
          >
            <span className="text-[10px] text-amber-600 font-semibold">
              Công
            </span>
            <span className="font-extrabold">{p.attack ?? "-"}</span>
          </span>
          <span
            className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/60"
            title="Phòng thủ"
          >
            <span className="text-[10px] text-blue-600 font-semibold">Thủ</span>
            <span className="font-extrabold">{p.defense ?? "-"}</span>
          </span>
          <span
            className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60"
            title="Độ bền"
          >
            <span className="text-[10px] text-emerald-600 font-semibold">
              Bền
            </span>
            <span className="font-extrabold">{p.stamina ?? "-"}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {uniquePositions.slice(0, 3).map((cfg) => (
            <span
              key={cfg.shortLabel}
              className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 truncate"
            >
              {cfg.shortLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
