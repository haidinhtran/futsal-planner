import React from "react";
import type { Player } from "@/types/futsal";

interface Props {
  editingPlayer: Partial<Player>;
  onChangePlayer: (player: Partial<Player>) => void;
  onClearError: () => void;
}

export const PlayerBasicInfoInputs: React.FC<Props> = ({
  editingPlayer,
  onChangePlayer,
  onClearError,
}) => {
  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-1">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
            SỐ ÁO (#)
          </label>
          <input
            type="number"
            required
            min={0}
            max={99}
            placeholder="10"
            value={
              editingPlayer.number !== undefined &&
              editingPlayer.number !== null
                ? editingPlayer.number
                : ""
            }
            onChange={(e) => {
              onClearError();
              onChangePlayer({
                ...editingPlayer,
                number:
                  e.target.value === ""
                    ? (undefined as any)
                    : parseInt(e.target.value) || 0,
              });
            }}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-black text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
            TÊN CẦU THỦ
          </label>
          <input
            type="text"
            required
            placeholder="Nhập họ và tên cầu thủ..."
            value={editingPlayer.name || ""}
            onChange={(e) => {
              onClearError();
              onChangePlayer({ ...editingPlayer, name: e.target.value });
            }}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
          TÊN IN ÁO (TÙY CHỌN)
        </label>
        <input
          type="text"
          placeholder="Nhập tên in trên áo (ví dụ: A. NGUYEN)..."
          value={editingPlayer.jerseyName || ""}
          onChange={(e) =>
            onChangePlayer({ ...editingPlayer, jerseyName: e.target.value })
          }
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
          ĐẶC ĐIỂM CÁ NHÂN & GHI CHÚ
        </label>
        <textarea
          rows={2}
          placeholder="Ví dụ: Tốc độ cao, sút xa tốt, khả năng tranh chấp mạnh..."
          value={editingPlayer.notes || ""}
          onChange={(e) =>
            onChangePlayer({ ...editingPlayer, notes: e.target.value })
          }
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800"
        />
      </div>
    </>
  );
};
