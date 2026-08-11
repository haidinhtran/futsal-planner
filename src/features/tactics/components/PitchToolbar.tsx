import React from 'react';
import type { AttackDirection, PositionSlot } from '../../../types/futsal';
import { FORMATION_PRESETS } from '../../../constants/formations';
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ArrowRightLeft,
  ArrowLeftRight,
  Trash2,
} from 'lucide-react';

interface PitchToolbarProps {
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
  currentFormationId: string;
  attackDirection: AttackDirection;
  slots: PositionSlot[];
  onSelectFormation?: (formationId: string) => void;
  onToggleAttackDirection?: () => void;
  onQuickSwap?: () => void;
  onSwapSlots?: (slotIdA: string, slotIdB: string) => void;
  onClearAllSlots?: () => void;
  onClearSlot: (slotId: string) => void;
}

export const PitchToolbar: React.FC<PitchToolbarProps> = ({
  isExpanded,
  onToggleExpand,
  currentFormationId,
  attackDirection,
  slots,
  onSelectFormation,
  onToggleAttackDirection,
  onQuickSwap,
  onSwapSlots,
  onClearAllSlots,
  onClearSlot,
}) => {
  return (
    <div className="absolute top-3 right-3 z-30 select-none">
      {isExpanded ? (
        /* EXPANDED POPUP TOOLBAR PANEL (2 COLUMNS) */
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-2xl w-52 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Toggle Collapse Button */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>CÔNG CỤ THẾ TRẬN</span>
            </div>
            <button
              type="button"
              onClick={() => onToggleExpand(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Rút gọn thanh công cụ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* CATEGORY 1: SƠ ĐỒ ĐỘI HÌNH (6 Presets in 2-Column Grid) */}
          {onSelectFormation && (
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                SƠ ĐỒ ĐỘI HÌNH
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {FORMATION_PRESETS.map((preset) => {
                  const isSelected = currentFormationId === preset.id;
                  return (
                    <div key={preset.id} className="relative group">
                      <button
                        type="button"
                        onClick={() => onSelectFormation(preset.id)}
                        className={`w-full py-1.5 px-2 text-xs font-black rounded-btn border transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 scale-[1.02]'
                            : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200'
                        }`}
                      >
                        <span className="text-[11px] font-black">{preset.id}</span>
                        {preset.id === '0-4' && (
                          <span className="text-[9px] text-amber-300 font-extrabold" title="Power-Play Đặc Biệt">
                            ⚡
                          </span>
                        )}
                      </button>

                      {/* Hover Tooltip for Formation */}
                      <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                        <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-btn shadow-xl whitespace-nowrap">
                          Sơ đồ {preset.id} - {preset.subName}
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute -right-0.5 top-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 2: TÁC VỤ SÂN (Court Actions in 2-Column Grid) */}
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              TÁC VỤ
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {/* Attack Direction Toggle Switch */}
              <div className="relative group col-span-1">
                <button
                  type="button"
                  onClick={() => onToggleAttackDirection && onToggleAttackDirection()}
                  className={`w-full py-1.5 px-2 text-xs font-bold rounded-btn border transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                    attackDirection === 'right'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] font-extrabold truncate">
                    {attackDirection === 'right' ? 'Phải →' : '← Trái'}
                  </span>
                </button>

                {/* Tooltip */}
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-btn shadow-xl whitespace-nowrap">
                    Đổi hướng tấn công ({attackDirection === 'right' ? 'Sang phải →' : '← Sang trái'})
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute -right-0.5 top-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              {/* Quick Swap Button */}
              <div className="relative group col-span-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onQuickSwap) {
                      onQuickSwap();
                    } else if (onSwapSlots && slots.length >= 3) {
                      onSwapSlots(slots[1].id, slots[2].id);
                    }
                  }}
                  className="w-full py-1.5 px-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-btn transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="text-[10px] font-extrabold">Hoán đổi</span>
                </button>

                {/* Tooltip */}
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-btn shadow-xl whitespace-nowrap">
                    Hoán đổi vị trí 2 cầu thủ Ala
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute -right-0.5 top-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              {/* Clear All Slots Button */}
              <div className="relative group col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onClearAllSlots) {
                      onClearAllSlots();
                    } else {
                      slots.forEach((s) => onClearSlot(s.id));
                    }
                  }}
                  className="w-full py-1.5 px-2 text-xs font-extrabold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-btn transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">Xóa tất cả cầu thủ</span>
                </button>

                {/* Tooltip */}
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap">
                    Xóa tất cả cầu thủ khỏi sân thi đấu
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute -right-0.5 top-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* COLLAPSED FLOATING BUTTON */
        <div className="relative group">
          <button
            type="button"
            onClick={() => onToggleExpand(true)}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/90 shadow-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer flex items-center space-x-1.5 font-bold text-xs"
            title="Mở thanh công cụ thế trận"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Tooltip for Collapsed Button */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
              Mở công cụ sơ đồ & tác vụ
            </div>
            <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute -right-0.5 top-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};
