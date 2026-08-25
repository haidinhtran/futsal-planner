import React from "react";
import { Filter } from "lucide-react";
import type { Player } from "@/types/futsal";
import { PlayerSidebarItem } from "./PlayerSidebarItem";

interface Props {
  players: Player[];
  sidebarPlayers: Player[];
  assignedMainPlayerIds: Set<string>;
  assignedSubPlayerIds: Set<string>;
  onlyUnselected: boolean;
  sortBy: "total_desc" | "total_asc" | "number_asc";
  onSetOnlyUnselected: (val: boolean) => void;
  onSetSortBy: (val: "total_desc" | "total_asc" | "number_asc") => void;
  onPlayerClick: (id: string) => void;
  onDragStartPlayer: (e: React.DragEvent, id: string) => void;
}

export const PlayerSidebar: React.FC<Props> = ({
  players,
  sidebarPlayers,
  assignedMainPlayerIds,
  assignedSubPlayerIds,
  onlyUnselected,
  sortBy,
  onSetOnlyUnselected,
  onSetSortBy,
  onPlayerClick,
  onDragStartPlayer,
}) => {
  return (
    <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3 py-4 sm:py-5 pr-0 lg:pr-6 bg-white flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs shrink-0" />
            <h3 className="text-h3 text-slate-900">DANH SÁCH CẦU THỦ</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full border border-blue-200">
              {players.length}
            </span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2 text-xs xl:text-sm">
          <div className="flex items-center justify-between gap-2">
            <label className="font-bold text-slate-500 uppercase text-[11px] shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Sắp xếp:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSetSortBy(e.target.value as any)}
              className="bg-white font-bold px-2 py-1 text-slate-700 border border-slate-200 rounded-lg cursor-pointer focus:outline-none text-xs flex-1 min-w-0"
            >
              <option value="total_desc">Tổng điểm (cao ➔ thấp)</option>
              <option value="total_asc">Tổng điểm (thấp ➔ cao)</option>
              <option value="number_asc">Số áo (1 ➔ 99)</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-1.5 border-t border-slate-200/60">
            <input
              type="checkbox"
              checked={onlyUnselected}
              onChange={(e) => onSetOnlyUnselected(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500/30 cursor-pointer"
            />
            <span className="font-bold text-xs select-none">Chỉ hiển thị cầu thủ chưa chọn</span>
          </label>
        </div>

        <div className="max-h-[520px] xl:max-h-[600px] overflow-y-auto px-1 pt-2 pb-2 space-y-2.5">
          {sidebarPlayers.map((p) => (
            <PlayerSidebarItem
              key={p.id}
              player={p}
              isAssigned={assignedMainPlayerIds.has(p.id) || assignedSubPlayerIds.has(p.id)}
              onPlayerClick={onPlayerClick}
              onDragStartPlayer={onDragStartPlayer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
