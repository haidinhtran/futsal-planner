import React from "react";
import type { PositionTag } from "@/types/futsal";

interface Props {
  selectedPositions: PositionTag[];
  onChange: (positions: PositionTag[]) => void;
}

const POSITION_OPTIONS: Array<{
  pos: PositionTag;
  label: string;
  tooltip: string;
}> = [
  { pos: "GK", label: "Goalkeeper", tooltip: "Thủ Môn" },
  { pos: "FI", label: "Fixo", tooltip: "Hậu Vệ Thòng" },
  { pos: "AL_L", label: "Ala (Trái)", tooltip: "Tiền Vệ Cánh Trái" },
  { pos: "AL_R", label: "Ala (Phải)", tooltip: "Tiền Vệ Cánh Phải" },
  { pos: "PI", label: "Pivot", tooltip: "Tiền Đạo Cắm" },
];

export const PlayerPositionCheckboxes: React.FC<Props> = ({
  selectedPositions,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
        VỊ TRÍ THI ĐẤU
      </label>
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
        {POSITION_OPTIONS.map((item) => {
          const isSelected = selectedPositions.includes(item.pos);
          return (
            <label
              key={item.pos}
              title={`Vị trí: ${item.tooltip}`}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none hover:text-blue-600 transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  const updated = isSelected
                    ? selectedPositions.filter((p) => p !== item.pos)
                    : [...selectedPositions, item.pos];
                  onChange(updated);
                }}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
