import React, { useState, useMemo, useEffect } from 'react';
import type { Player, TacticalSquad, PositionSlot } from '../types/futsal';
import { POSITION_TAG_CONFIG } from '../types/futsal';
import { FORMATION_PRESETS } from '../services/initialData';
import { FutsalPitch } from './FutsalPitch';
import { RefreshCw, Save, Trash2, ArrowLeftRight, Info } from 'lucide-react';

interface TacticsBoardProps {
  players: Player[];
  squad: TacticalSquad;
  onSaveSquad: (squad: TacticalSquad) => void;
}

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ players, squad, onSaveSquad }) => {
  const [currentFormationId, setCurrentFormationId] = useState<string>(squad.formationId || '3-1');
  const [slots, setSlots] = useState<PositionSlot[]>(squad.slots);
  const [notes, setNotes] = useState<string>(squad.notes || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Sync squad state when props update (e.g. initial load, reset, or import)
  useEffect(() => {
    if (squad) {
      setCurrentFormationId(squad.formationId || '3-1');
      setSlots(squad.slots || []);
      setNotes(squad.notes || '');
    }
  }, [squad]);

  // Sidebar Filter & Sort
  const [onlyUnselected, setOnlyUnselected] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'total_desc' | 'total_asc' | 'number_asc'>('total_desc');

  // Quick Map of Players for fast lookup
  const playersMap = useMemo(() => {
    const map: Record<string, Player> = {};
    players.forEach((p) => (map[p.id] = p));
    return map;
  }, [players]);

  // Active Formation Preset Object
  const currentPreset = useMemo(() => {
    return FORMATION_PRESETS.find((f) => f.id === currentFormationId) || FORMATION_PRESETS[1];
  }, [currentFormationId]);

  // Set of player IDs currently assigned on the pitch
  const assignedPlayerIds = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => {
      if (s.playerId) set.add(s.playerId);
    });
    return set;
  }, [slots]);

  // Calculate total score of a player
  const getPlayerTotalScore = (p: Player) => {
    let sum = 0;
    let count = 0;
    if (p.stamina !== null) { sum += p.stamina; count++; }
    if (p.attack !== null) { sum += p.attack; count++; }
    if (p.defense !== null) { sum += p.defense; count++; }
    return count > 0 ? sum : -1;
  };

  // Sidebar Player List (Filtered & Sorted)
  const sidebarPlayers = useMemo(() => {
    return players
      .filter((p) => {
        if (onlyUnselected && assignedPlayerIds.has(p.id)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'number_asc') return a.number - b.number;
        const totalA = getPlayerTotalScore(a);
        const totalB = getPlayerTotalScore(b);
        if (sortBy === 'total_desc') return totalB - totalA;
        return totalA - totalB;
      });
  }, [players, onlyUnselected, assignedPlayerIds, sortBy]);

  // Unassigned Sub / Bench Players
  const benchPlayers = useMemo(() => {
    return players.filter((p) => !assignedPlayerIds.has(p.id));
  }, [players, assignedPlayerIds]);

  // Average Stats of the 5 starting players on court
  const teamAverageStats = useMemo(() => {
    let staminaSum = 0, staminaCount = 0;
    let attackSum = 0, attackCount = 0;
    let defenseSum = 0, defenseCount = 0;

    slots.forEach((s) => {
      if (s.playerId && playersMap[s.playerId]) {
        const p = playersMap[s.playerId];
        if (p.stamina !== null) { staminaSum += p.stamina; staminaCount++; }
        if (p.attack !== null) { attackSum += p.attack; attackCount++; }
        if (p.defense !== null) { defenseSum += p.defense; defenseCount++; }
      }
    });

    return {
      avgStamina: staminaCount > 0 ? (staminaSum / staminaCount).toFixed(1) : '-',
      avgAttack: attackCount > 0 ? (attackSum / attackCount).toFixed(1) : '-',
      avgDefense: defenseCount > 0 ? (defenseSum / defenseCount).toFixed(1) : '-',
    };
  }, [slots, playersMap]);

  // Change Preset Formation layout
  const handleSelectFormation = (formationId: string) => {
    setCurrentFormationId(formationId);
    const preset = FORMATION_PRESETS.find((f) => f.id === formationId);
    if (!preset) return;

    // Keep existing assigned players if possible, map to new position coordinates
    const newSlots: PositionSlot[] = preset.positions.map((pos, idx) => {
      const existingPlayerId = slots[idx]?.playerId || null;
      return {
        id: `slot-${idx}`,
        role: pos.role,
        label: pos.label,
        x: pos.x,
        y: pos.y,
        playerId: existingPlayerId,
      };
    });
    setSlots(newSlots);
  };

  const handleAssignPlayerToSlot = (slotId: string, playerId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.playerId === playerId) {
          return { ...slot, playerId: null };
        }
        if (slot.id === slotId) {
          return { ...slot, playerId };
        }
        return slot;
      })
    );
    setSelectedSlotId(null);
  };

  const handleClearSlot = (slotId: string) => {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, playerId: null } : s)));
  };

  const handleClearAllSlots = () => {
    setSlots((prev) => prev.map((s) => ({ ...s, playerId: null })));
  };

  const handleSwapSlots = (slotIdA: string, slotIdB: string) => {
    setSlots((prev) => {
      const slotA = prev.find((s) => s.id === slotIdA);
      const slotB = prev.find((s) => s.id === slotIdB);
      if (!slotA || !slotB) return prev;

      return prev.map((s) => {
        if (s.id === slotIdA) return { ...s, playerId: slotB.playerId };
        if (s.id === slotIdB) return { ...s, playerId: slotA.playerId };
        return s;
      });
    });
  };

  const handleQuickSwap = () => {
    if (slots.length >= 2) {
      handleSwapSlots(slots[1].id, slots[2].id);
    }
  };

  const handleSave = () => {
    const updatedSquad: TacticalSquad = {
      id: squad.id || 'default',
      formationId: currentFormationId,
      slots,
      notes,
      updatedAt: new Date().toISOString(),
    };
    onSaveSquad(updatedSquad);
    alert('Đã lưu sơ đồ thế trận futsal thành công!');
  };

  const handleResetPreset = () => {
    handleSelectFormation(currentFormationId);
  };

  const handleSidebarPlayerClick = (playerId: string) => {
    if (selectedSlotId) {
      handleAssignPlayerToSlot(selectedSlotId, playerId);
    } else {
      const emptySlot = slots.find((s) => !s.playerId);
      if (emptySlot) {
        handleAssignPlayerToSlot(emptySlot.id, playerId);
      } else {
        alert('Cả 5 vị trí trên sân đã có cầu thủ! Nhấp chọn 1 vị trí trên sân trước khi chọn thay thế.');
      }
    }
  };

  const handleDragStartPlayer = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/player-id', playerId);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar: Formation Selector & Main Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Preset Formations Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-2">
            CHỌN ĐỘI HÌNH:
          </span>
          {FORMATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectFormation(preset.id)}
              className={`px-5 py-2.5 rounded-xl text-center transition-all cursor-pointer ${
                currentFormationId === preset.id
                  ? 'bg-slate-900 text-white shadow-md font-bold ring-2 ring-slate-900 ring-offset-1'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold'
              }`}
            >
              <div className="text-sm leading-tight">{preset.name}</div>
              <div className="text-[11px] opacity-75 font-normal">{preset.subName}</div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleResetPreset}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Đặt lại</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 border border-blue-500 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu đội hình</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Left Sidebar (4 Cols) + Center Pitch (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Player List (4 Cols) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  DANH SÁCH CẦU THỦ ({players.length})
                </h3>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 text-xs font-bold text-slate-500 uppercase pb-2 border-b border-slate-200">
                <span className="col-span-1 text-center">#</span>
                <span className="col-span-6">Cầu thủ</span>
                <span className="col-span-1 text-center text-emerald-600">TL</span>
                <span className="col-span-1 text-center text-orange-600">TC</span>
                <span className="col-span-1 text-center text-blue-600">PT</span>
                <span className="col-span-2 text-right pr-1">Tổng</span>
              </div>

              {/* Player Scroll List */}
              <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 my-1 pr-1">
                {sidebarPlayers.map((p) => {
                  const isAssigned = assignedPlayerIds.has(p.id);
                  const total = getPlayerTotalScore(p);
                  return (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={(e) => handleDragStartPlayer(e, p.id)}
                      onClick={() => handleSidebarPlayerClick(p.id)}
                      className={`grid grid-cols-12 items-center py-2.5 px-2 text-xs cursor-pointer rounded-xl transition-colors ${
                        isAssigned
                          ? 'bg-slate-50 text-slate-400 opacity-60'
                          : 'hover:bg-blue-50/80 text-slate-900 font-semibold'
                      }`}
                    >
                      <span className="col-span-1 text-center font-black text-slate-700">{p.number}</span>
                      <div className="col-span-6 flex items-center space-x-1.5 min-w-0 pr-1">
                        <span className="truncate font-bold" title={p.name}>{p.name}</span>
                        {/* Quick Position Badges */}
                        {p.positions && p.positions.length > 0 && (
                          <div className="flex items-center space-x-0.5 shrink-0">
                            {p.positions.map((pos) => (
                              <span
                                key={pos}
                                className={`text-[9px] font-black px-1 rounded border ${POSITION_TAG_CONFIG[pos].bgClass} ${POSITION_TAG_CONFIG[pos].textClass} ${POSITION_TAG_CONFIG[pos].borderClass}`}
                                title={POSITION_TAG_CONFIG[pos].fullLabel}
                              >
                                {POSITION_TAG_CONFIG[pos].shortLabel}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="col-span-1 text-center font-extrabold text-emerald-600">{p.stamina ?? '-'}</span>
                      <span className="col-span-1 text-center font-extrabold text-orange-600">{p.attack ?? '-'}</span>
                      <span className="col-span-1 text-center font-extrabold text-blue-600">{p.defense ?? '-'}</span>
                      <span className="col-span-2 text-right font-black text-slate-900 pr-1">
                        {total !== -1 ? total : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Filters & Sorting */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-500 uppercase text-xs">LỌC & SẮP XẾP</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-100 font-bold px-3 py-1.5 rounded-xl text-slate-800 border border-slate-200 cursor-pointer focus:outline-none"
                  >
                    <option value="total_desc">Tổng điểm (cao ➔ thấp)</option>
                    <option value="total_asc">Tổng điểm (thấp ➔ cao)</option>
                    <option value="number_asc">Số áo (1 ➔ 99)</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyUnselected}
                    onChange={(e) => setOnlyUnselected(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-bold">Chỉ hiển thị cầu thủ chưa được chọn</span>
                </label>
              </div>
            </div>

            {/* Bottom Left: Squad Info */}
            <div className="pt-3 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-black text-slate-500 uppercase">THÔNG TIN ĐỘI HÌNH</h4>
              <p className="text-xs font-bold text-slate-800">
                Đội hình: <span className="text-blue-600 font-extrabold">{currentPreset.name} ({currentPreset.subName})</span>
              </p>
              <p className="text-xs text-slate-600">
                Sơ đồ: <span className="font-semibold text-slate-800">{currentPreset.schema}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Interactive Futsal Court (8 Cols) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <FutsalPitch
              slots={slots}
              playersMap={playersMap}
              selectedSlotId={selectedSlotId}
              onSelectSlot={(id) => setSelectedSlotId(selectedSlotId === id ? null : id)}
              onAssignPlayerToSlot={handleAssignPlayerToSlot}
              onClearSlot={handleClearSlot}
              onSwapSlots={handleSwapSlots}
            />

            {/* Pitch Bottom Info & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-xs gap-3">
              <div className="flex items-center space-x-2 text-slate-600 font-semibold">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Kéo thả cầu thủ từ danh sách hoặc khu dự bị vào vị trí trên sân để thay đổi.</span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleQuickSwap}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Hoán đổi nhanh</span>
                </button>
                <button
                  onClick={handleClearAllSlots}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bench Section ("DỰ BỊ / CHƯA CHỌN") */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
              DỰ BỊ / CHƯA CHỌN ({benchPlayers.length})
            </h3>

            <div className="flex items-center space-x-4 overflow-x-auto pb-3 pt-1">
              {benchPlayers.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStartPlayer(e, p.id)}
                  onClick={() => handleSidebarPlayerClick(p.id)}
                  className="bg-slate-50 hover:bg-blue-50/80 border border-slate-200 rounded-2xl p-3.5 min-w-[155px] shrink-0 cursor-pointer shadow-xs transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-5 h-5 bg-slate-900 text-white font-black text-[10px] rounded flex items-center justify-center shrink-0">
                        {p.number}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                    </div>
                  </div>

                  {/* Quick Position Tags */}
                  {p.positions && p.positions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {p.positions.map((pos) => (
                        <span
                          key={pos}
                          className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${POSITION_TAG_CONFIG[pos].bgClass} ${POSITION_TAG_CONFIG[pos].textClass} ${POSITION_TAG_CONFIG[pos].borderClass}`}
                          title={POSITION_TAG_CONFIG[pos].fullLabel}
                        >
                          {POSITION_TAG_CONFIG[pos].shortLabel}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs space-y-1 font-semibold text-slate-600 border-t border-slate-200/60 pt-1.5">
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
                <p className="text-xs text-slate-400 font-medium italic py-2">Tất cả cầu thủ đã được xếp vào đội hình chính!</p>
              )}
            </div>
          </div>

          {/* Bottom Average Team Stats & Tactical Notes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Average Stats */}
            <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
                TỔNG CHỈ SỐ ĐỘI HÌNH (TB 5 CẦU THỦ)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <span className="block text-xs font-bold text-emerald-700">🟢 Thể Lực</span>
                  <span className="text-xl font-black text-emerald-700">{teamAverageStats.avgStamina}</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
                  <span className="block text-xs font-bold text-orange-700">🟠 Tấn Công</span>
                  <span className="text-xl font-black text-orange-700">{teamAverageStats.avgAttack}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                  <span className="block text-xs font-bold text-blue-700">🔵 Phòng Thủ</span>
                  <span className="text-xl font-black text-blue-700">{teamAverageStats.avgDefense}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">GHI CHÚ</h4>
              <textarea
                placeholder="Nhập ghi chú cho đội hình này..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full flex-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium text-slate-800"
                rows={3}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
