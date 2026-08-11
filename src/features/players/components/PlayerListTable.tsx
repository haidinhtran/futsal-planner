import React from 'react';
import type { Player } from '../../../types/futsal';
import { getPositionConfig } from '../../../constants/positionTags';
import { calculatePlayerTotalScore } from '../../../utils/formatters';
import { Button } from '../../../components/ui/Button';

interface PlayerListTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export const PlayerListTable: React.FC<PlayerListTableProps> = ({
  players,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700 min-w-[700px]">
        <thead className="bg-slate-50 text-xs uppercase font-extrabold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="py-4 px-5 w-16 text-center">#</th>
            <th className="py-4 px-5">Tên cầu thủ</th>
            <th className="py-4 px-5">Vị Trí</th>
            <th className="py-4 px-5 text-center">🟢 Thể Lực (TL)</th>
            <th className="py-4 px-5 text-center">🟠 Tấn Công (TC)</th>
            <th className="py-4 px-5 text-center">🔵 Phòng Thủ (PT)</th>
            <th className="py-4 px-5 text-center">Tổng Điểm</th>
            <th className="py-4 px-5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-semibold">
          {players.map((p) => {
            const total = calculatePlayerTotalScore(p);
            return (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 text-center font-black text-slate-900">{p.number}</td>
                <td className="py-3.5 px-5 font-bold text-slate-900">{p.name}</td>
                <td className="py-3.5 px-5">
                  {p.positions && p.positions.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {p.positions.map((pos) => {
                        const cfg = getPositionConfig(pos);
                        return (
                          <span
                            key={pos}
                            className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
                          >
                            {cfg.shortLabel}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-normal">Chưa chọn</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-center font-extrabold text-emerald-600">
                  {p.stamina !== null && p.stamina !== undefined ? p.stamina : '-'}
                </td>
                <td className="py-3.5 px-5 text-center font-extrabold text-orange-600">
                  {p.attack !== null && p.attack !== undefined ? p.attack : '-'}
                </td>
                <td className="py-3.5 px-5 text-center font-extrabold text-blue-600">
                  {p.defense !== null && p.defense !== undefined ? p.defense : '-'}
                </td>
                <td className="py-3.5 px-5 text-center font-black text-slate-900">
                  {total !== -1 ? total : '-'}
                </td>
                <td className="py-3.5 px-5 text-right space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(p)}>
                    Sửa
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(p.id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
