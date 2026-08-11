import React, { useState } from 'react';
import type { Player, PositionTag } from '../../../types/futsal';
import { POSITION_TAG_CONFIG } from '../../../constants/positionTags';
import { Modal } from '../../../components/ui/Modal';
import { UserCheck, AlertCircle, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlayer: Partial<Player>;
  existingPlayers: Player[];
  onSave: (player: Player) => void;
}

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  isOpen,
  onClose,
  editingPlayer: initialPlayer,
  existingPlayers,
  onSave,
}) => {
  const [player, setPlayer] = useState<Partial<Player>>(initialPlayer);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEditMode = existingPlayers.some((p) => p.id === player.id);

  const handleTogglePosition = (tag: PositionTag) => {
    const currentPos = player.positions || [];
    if (currentPos.includes(tag)) {
      setPlayer({ ...player, positions: currentPos.filter((t) => t !== tag) });
    } else {
      setPlayer({ ...player, positions: [...currentPos, tag] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!player.name || !player.name.trim()) {
      setErrorMsg('Vui lòng nhập tên cầu thủ!');
      return;
    }

    if (!player.number || player.number <= 0) {
      setErrorMsg('Số áo phải lớn hơn 0!');
      return;
    }

    // Check duplicate shirt number
    const duplicate = existingPlayers.find(
      (p) => p.number === player.number && p.id !== player.id
    );
    if (duplicate) {
      setErrorMsg(`Số áo #${player.number} đã thuộc về cầu thủ "${duplicate.name}"!`);
      return;
    }

    const finalPlayer: Player = {
      id: player.id || Date.now().toString(),
      number: player.number,
      name: player.name.trim(),
      avatar: player.avatar,
      stamina: player.stamina !== undefined ? player.stamina : null,
      attack: player.attack !== undefined ? player.attack : null,
      defense: player.defense !== undefined ? player.defense : null,
      positions: player.positions || [],
      notes: player.notes || '',
    };

    onSave(finalPlayer);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Chỉnh Sửa Cầu Thủ' : 'Thêm Cầu Thủ Mới'}
      subtitle="Cập nhật vị trí, đặc điểm và chỉ số kỹ năng"
      icon={<UserCheck className="w-5 h-5 text-blue-600" />}
      maxWidth="max-w-lg"
    >
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl flex items-center space-x-2 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">Số Áo (#)</label>
            <input
              type="number"
              required
              min={1}
              max={99}
              value={player.number || ''}
              onChange={(e) => {
                setErrorMsg(null);
                setPlayer({ ...player, number: parseInt(e.target.value) || 0 });
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-btn font-bold text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên Cầu Thủ</label>
            <input
              type="text"
              required
              placeholder="Nhập họ và tên..."
              value={player.name || ''}
              onChange={(e) => {
                setErrorMsg(null);
                setPlayer({ ...player, name: e.target.value });
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-btn focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
            />
          </div>
        </div>

        {/* Individual Player Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            📝 Ghi Chú Đặc Điểm (Ví dụ: Dễ bị tâm lý, Tỷ lệ phản lưới nhà cao...)
          </label>
          <textarea
            rows={2}
            placeholder="Nhập ghi chú đặc điểm cá nhân, tâm lý hoặc điểm mạnh/yếu..."
            value={player.notes || ''}
            onChange={(e) => setPlayer({ ...player, notes: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-btn focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800"
          />
        </div>

        {/* Position Selectors */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Vị Trí Thi Đấu Khả Dụng (Có thể chọn nhiều)
          </label>
          <div className="flex flex-wrap gap-2">
            {(['GK', 'FI', 'AL_L', 'AL_R', 'PI'] as PositionTag[]).map((tag) => {
              const cfg = POSITION_TAG_CONFIG[tag];
              const isSelected = (player.positions || []).includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTogglePosition(tag)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-btn border text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} shadow-2xs ring-2 ring-blue-400/40`
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cfg.fullLabel} ({cfg.shortLabel})</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Controls */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Chỉ Số Kỹ Năng (0 - 10)
          </div>

          {/* Thể Lực */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold w-20 text-emerald-700">🟢 Thể Lực:</span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={player.stamina ?? 5}
              onChange={(e) => setPlayer({ ...player, stamina: parseFloat(e.target.value) })}
              className="flex-1 accent-emerald-600"
            />
            <span className="w-8 text-center text-xs font-black bg-emerald-50 text-emerald-800 py-1 rounded-md border border-emerald-200">
              {player.stamina !== null && player.stamina !== undefined ? player.stamina : '-'}
            </span>
          </div>

          {/* Tấn Công */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold w-20 text-orange-700">🟠 Tấn Công:</span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={player.attack ?? 5}
              onChange={(e) => setPlayer({ ...player, attack: parseFloat(e.target.value) })}
              className="flex-1 accent-orange-500"
            />
            <span className="w-8 text-center text-xs font-black bg-orange-50 text-orange-800 py-1 rounded-md border border-orange-200">
              {player.attack !== null && player.attack !== undefined ? player.attack : '-'}
            </span>
          </div>

          {/* Phòng Thủ */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold w-20 text-blue-700">🔵 Phòng Thủ:</span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={player.defense ?? 5}
              onChange={(e) => setPlayer({ ...player, defense: parseFloat(e.target.value) })}
              className="flex-1 accent-blue-600"
            />
            <span className="w-8 text-center text-xs font-black bg-blue-50 text-blue-800 py-1 rounded-md border border-blue-200">
              {player.defense !== null && player.defense !== undefined ? player.defense : '-'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Lưu Thay Đổi' : 'Thêm Cầu Thủ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
