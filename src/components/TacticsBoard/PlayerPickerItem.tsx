import React from "react";
import type { Player, PositionTag } from "@/types/futsal";
import { getUniquePositionConfigs } from "@/types/futsal";

interface Props {
  player: Player;
  isMainHere: boolean;
  isMainOther: boolean;
  isSub: boolean;
  onSelect: (id: string) => void;
}

export const PlayerPickerItem: React.FC<Props> = ({
  player: p,
  isMainHere,
  isMainOther,
  isSub,
  onSelect,
}) => {
  const tags = getUniquePositionConfigs(p.positions as PositionTag[]);

  return (
    <button
      type="button"
      onClick={() => onSelect(p.id)}
      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
        isMainHere
          ? "bg-blue-50/80 border-blue-300 ring-1 ring-blue-400"
          : "bg-white hover:bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex items-center space-x-2.5 min-w-0">
        <span className="w-7 h-7 bg-slate-900 text-white font-black text-xs rounded-lg flex items-center justify-center shrink-0">
          #{p.number}
        </span>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-xs text-slate-900 truncate">
              {p.name}
            </span>
            {isMainHere && (
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-black">
                Đang chọn
              </span>
            )}
            {isMainOther && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                Đá chính
              </span>
            )}
            {isSub && (
              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                Dự bị
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[10px]">
            <span className="text-amber-700 font-bold">
              C: {p.attack ?? "-"}
            </span>
            <span className="text-blue-700 font-bold">
              T: {p.defense ?? "-"}
            </span>
            <span className="text-emerald-700 font-bold">
              B: {p.stamina ?? "-"}
            </span>
            {tags.map((t) => (
              <span
                key={t.shortLabel}
                className={`px-1 rounded border font-black ${t.bgClass} ${t.textClass}`}
              >
                {t.shortLabel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};
