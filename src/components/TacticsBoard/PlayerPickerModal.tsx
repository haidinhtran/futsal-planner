import React, { useState, useMemo } from "react";
import { UserCheck, X, Search, Trash2 } from "lucide-react";
import type { Player, PositionSlot } from "@/types/futsal";
import { removeVietnameseTones } from "@/utils/vietnamese";
import { getEnglishRoleTitle } from "@/utils/pitchHelpers";
import { PlayerPickerItem } from "./PlayerPickerItem";

interface Props {
  isOpen: boolean; slot: PositionSlot | null; mode: "main" | "sub"; players: Player[];
  assignedMainPlayerIds: Set<string>; assignedSubPlayerIds: Set<string>;
  onClose: () => void; onSelectPlayer: (id: string) => void; onClearSlot: () => void;
}

export const PlayerPickerModal: React.FC<Props> = ({
  isOpen, slot, mode, players, assignedMainPlayerIds, assignedSubPlayerIds,
  onClose, onSelectPlayer, onClearSlot,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [onlyUnassigned, setOnlyUnassigned] = useState<boolean>(true);

  const filteredPlayers = useMemo(() => {
    const query = removeVietnameseTones(searchQuery.trim());
    return players.filter((p) => {
      if (onlyUnassigned && p.id !== slot?.playerId) {
        if (assignedMainPlayerIds.has(p.id) || assignedSubPlayerIds.has(p.id)) return false;
      }
      if (selectedTag !== "ALL") {
        const hasTag = p.positions?.some((tag) => (selectedTag === "ALA" ? tag === "AL_L" || tag === "AL_R" : tag === selectedTag));
        if (!hasTag) return false;
      }
      return !query || removeVietnameseTones(p.name).includes(query) || p.number.toString().includes(query);
    });
  }, [players, searchQuery, selectedTag, onlyUnassigned, slot, assignedMainPlayerIds, assignedSubPlayerIds]);

  if (!isOpen || !slot) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-xs flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl rounded-none shadow-2xl border-0 sm:border sm:border-slate-200 flex flex-col overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0"><UserCheck className="w-5 h-5" /></div>
            <div className="min-w-0">
              <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">
                {mode === "main" ? "CHỌN ĐÁ CHÍNH" : "THÊM DỰ BỊ"}: {getEnglishRoleTitle(slot.role)}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Nhấp chọn cầu thủ để gán vào vị trí</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-3 bg-slate-50 border-b border-slate-100 space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc số áo..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-black pb-0.5 flex-1 min-w-0">
              {["ALL", "GK", "FI", "ALA", "PI"].map((tag) => (
                <button
                  key={tag} onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 rounded-md transition-colors shrink-0 ${selectedTag === tag ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                >
                  {tag === "ALL" ? "Tất cả" : tag}
                </button>
              ))}
              {slot.playerId && mode === "main" && (
                <button onClick={() => { onClearSlot(); onClose(); }} className="ml-auto text-red-600 hover:bg-red-50 px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-1 shrink-0">
                  <Trash2 className="w-3 h-3" /> <span>Gỡ</span>
                </button>
              )}
            </div>

            <div
              onClick={() => setOnlyUnassigned(!onlyUnassigned)}
              className="flex items-center space-x-1.5 cursor-pointer select-none text-[11px] font-bold text-slate-600 shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-200"
              title="Bật/Tắt chỉ hiện cầu thủ chưa lên sân"
            >
              <span className="text-[10px] sm:text-[11px]">Chưa lên sân</span>
              <button
                type="button" role="switch" aria-checked={onlyUnassigned}
                className={`relative inline-flex h-4 w-7 shrink-0 rounded-full border border-transparent transition-colors duration-200 ${onlyUnassigned ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span className={`pointer-events-none inline-flex h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ${onlyUnassigned ? "translate-x-3.5" : "translate-x-0.5"} mt-0.5`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 overflow-y-auto space-y-2 flex-1 overscroll-contain">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((p) => (
              <PlayerPickerItem
                key={p.id} player={p}
                isMainHere={slot.playerId === p.id}
                isMainOther={slot.playerId !== p.id && assignedMainPlayerIds.has(p.id)}
                isSub={assignedSubPlayerIds.has(p.id)}
                onSelect={(id) => { onSelectPlayer(id); onClose(); }}
              />
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 font-semibold italic">Không tìm thấy cầu thủ phù hợp</div>
          )}
        </div>
      </div>
    </div>
  );
};
