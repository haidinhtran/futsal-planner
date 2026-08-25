import React from "react";
import { UserCheck, X } from "lucide-react";
import type { Player, DrawShape } from "@/types/futsal";
import { getPositionConfig } from "@/types/futsal";

interface PlayerModalProps {
  showPlayerModal: boolean;
  teamPlayers: Player[];
  shapes: DrawShape[];
  onClose: () => void;
  onSelectPlayer: (player: Player | null) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  showPlayerModal,
  teamPlayers,
  shapes,
  onClose,
  onSelectPlayer,
}) => {
  if (!showPlayerModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-white p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-emerald-600 shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs shrink-0"></span>
                <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  CHỌN CẦU THỦ THI ĐẤU (CẦU THỦ TA)
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Gán tên & số áo cầu thủ lên sơ đồ chiến thuật
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer bg-slate-100 hover:bg-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <button
            onClick={() => onSelectPlayer(null)}
            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                Ta
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-800 group-hover:text-emerald-700 block">
                  Mặc định (Nhãn "Ta")
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Icon hình tròn xanh lá mặc định
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">
              Chọn
            </span>
          </button>

          <div className="h-px bg-slate-100 my-2"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {teamPlayers
              .filter((p) => !shapes.some((s) => s.tool === "player-home" && s.playerId === p.id))
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      #{player.number}
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 truncate block">
                        {player.name}
                      </span>
                      {player.jerseyName && (
                        <span className="font-bold text-[10px] text-slate-500 truncate block mt-0.5">
                          {player.jerseyName}
                        </span>
                      )}
                      {player.positions && player.positions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {player.positions.map((p) => {
                            const cfg = getPositionConfig(p);
                            return (
                              <span
                                key={p}
                                className={`text-xs font-black px-1.5 py-0.5 rounded-lg border ${cfg.bgClass} ${cfg.textClass}`}
                              >
                                {cfg.shortLabel}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
