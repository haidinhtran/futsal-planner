import React from "react";
import type { Player } from "@/types/futsal";

interface Props {
  player: Partial<Player>;
  onChange: (updated: Partial<Player>) => void;
  calculateTotal: (p: Player) => number;
}

export const PlayerStatsSliders: React.FC<Props> = ({
  player,
  onChange,
  calculateTotal,
}) => {
  const total = calculateTotal(player as Player);

  return (
    <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
          CHỈ SỐ KỸ NĂNG (0 - 10)
        </span>
        <span className="text-xs font-bold text-slate-500">
          Tổng điểm:{" "}
          <strong className="text-blue-700 font-black">
            {total !== -1 ? `${total}đ` : "-"}
          </strong>
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Thể Lực (Bền)</span>
          </span>
          <span className="font-black text-slate-800">
            {player.stamina !== null && player.stamina !== undefined
              ? `${player.stamina} / 10`
              : "Chưa đánh giá"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={player.stamina ?? 0}
          onChange={(e) =>
            onChange({ ...player, stamina: parseFloat(e.target.value) })
          }
          className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-amber-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Tấn Công (Công)</span>
          </span>
          <span className="font-black text-slate-800">
            {player.attack !== null && player.attack !== undefined
              ? `${player.attack} / 10`
              : "Chưa đánh giá"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={player.attack ?? 0}
          onChange={(e) =>
            onChange({ ...player, attack: parseFloat(e.target.value) })
          }
          className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-blue-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Phòng Thủ (Thủ)</span>
          </span>
          <span className="font-black text-slate-800">
            {player.defense !== null && player.defense !== undefined
              ? `${player.defense} / 10`
              : "Chưa đánh giá"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={player.defense ?? 0}
          onChange={(e) =>
            onChange({ ...player, defense: parseFloat(e.target.value) })
          }
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
      </div>
    </div>
  );
};
