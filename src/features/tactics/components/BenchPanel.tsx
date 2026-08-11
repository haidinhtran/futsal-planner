import React from 'react';
import type { Player } from '../../../types/futsal';
import { POSITION_TAG_CONFIG } from '../../../constants/positionTags';

interface BenchPanelProps {
  benchPlayers: Player[];
  onDragStartPlayer: (e: React.DragEvent, playerId: string) => void;
  onPlayerClick: (playerId: string) => void;
}

export const BenchPanel: React.FC<BenchPanelProps> = ({
  benchPlayers,
  onDragStartPlayer,
  onPlayerClick,
}) => {
  const handleHorizontalWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center justify-between">
        <span>DỰ BỊ / CHƯA CHỌN ({benchPlayers.length})</span>
        <span className="text-xs text-slate-400 font-medium lowercase italic">
          (lăn chuột/vuốt ngang để cuộn)
        </span>
      </h3>

      <div
        onWheel={handleHorizontalWheel}
        className="flex items-center space-x-3 overflow-x-auto pb-2.5 pt-0.5 custom-horizontal-scrollbar scroll-smooth select-none"
      >
        {benchPlayers.map((p) => (
          <div
            key={p.id}
            draggable
            onDragStart={(e) => onDragStartPlayer(e, p.id)}
            onClick={() => onPlayerClick(p.id)}
            className="bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-2xl p-2.5 min-w-[155px] shrink-0 cursor-grab active:cursor-grabbing shadow-2xs transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="w-5.5 h-5.5 bg-slate-900 text-white font-black text-xs rounded flex items-center justify-center shrink-0">
                  {p.number}
                </span>
                <span className="text-sm font-bold text-slate-900 truncate">{p.name}</span>
              </div>
            </div>

            {p.positions && p.positions.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {p.positions.map((pos) => (
                  <span
                    key={pos}
                    className={`text-[9.5px] font-black px-1 rounded border ${POSITION_TAG_CONFIG[pos].bgClass} ${POSITION_TAG_CONFIG[pos].textClass} ${POSITION_TAG_CONFIG[pos].borderClass}`}
                    title={POSITION_TAG_CONFIG[pos].fullLabel}
                  >
                    {POSITION_TAG_CONFIG[pos].shortLabel}
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm space-y-0.5 font-semibold text-slate-600 border-t border-slate-200/60 pt-1">
              <div className="flex justify-between items-center">
                <span>Thể Lực</span>
                <span className="font-extrabold text-emerald-600">{p.stamina ?? '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tấn Công</span>
                <span className="font-extrabold text-orange-600">{p.attack ?? '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Phòng Thủ</span>
                <span className="font-extrabold text-blue-600">{p.defense ?? '-'}</span>
              </div>
            </div>
          </div>
        ))}

        {benchPlayers.length === 0 && (
          <p className="text-sm text-slate-400 font-medium italic py-2">Tất cả cầu thủ đã được xếp vào đội hình chính!</p>
        )}
      </div>
    </div>
  );
};
