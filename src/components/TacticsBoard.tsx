import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStickyActions } from '../hooks/useStickyActions';
import type { Player, TacticalSquad, PositionSlot, AttackDirection } from '../types/futsal';
import { getUniquePositionConfigs } from '../types/futsal';
import { FORMATION_PRESETS, INITIAL_TACTICAL_SQUAD } from '../services/initialData';
import { FutsalPitch } from './FutsalPitch';
import { Trash2, ArrowLeftRight, Info, GripVertical, Filter, RefreshCw, Save, Settings, X, Check, ArrowRight, ArrowLeft, MoreVertical } from 'lucide-react';
import { dialogService } from '../services/dialogService';

interface TacticsBoardProps {
  players: Player[];
  squad: TacticalSquad;
  onSaveSquad: (squad: TacticalSquad) => void;
  onEditPlayer?: (player: Player) => void;
}

const getVietnameseShortName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ players, squad, onSaveSquad }) => {
  const [currentFormationId, setCurrentFormationId] = useState<string>(squad.formationId || '3-1');
  const [slots, setSlots] = useState<PositionSlot[]>(squad.slots);
  const [notes, setNotes] = useState<string>(squad.notes || '');
  const [attackDirection, setAttackDirection] = useState<AttackDirection>(squad.attackDirection || 'right');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showSubs, setShowSubs] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

  const { isSticky, sentinelRef } = useStickyActions();

  // Filter 5 starting players with notes
  const startingPlayersWithNotes = useMemo(() => {
    return slots
      .map((slot) => {
        if (!slot.playerId) return null;
        const p = players.find((pl) => pl.id === slot.playerId);
        if (!p || !p.notes || p.notes.trim() === '') return null;
        return { slot, player: p };
      })
      .filter(Boolean) as Array<{ slot: PositionSlot; player: Player }>;
  }, [slots, players]);

  // Sync squad state when props update (e.g. initial load, reset, or import)
  useEffect(() => {
    if (squad) {
      setCurrentFormationId(squad.formationId || '3-1');
      setSlots(squad.slots || []);
      setNotes(squad.notes || '');
      setAttackDirection(squad.attackDirection || 'right');
    }
  }, [squad]);

  // Sidebar Filter & Sort (Default: onlyUnselected = true)
  const [onlyUnselected, setOnlyUnselected] = useState<boolean>(true);
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

  // Set of player IDs assigned as main starter
  const assignedMainPlayerIds = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => {
      if (s.playerId) set.add(s.playerId);
    });
    return set;
  }, [slots]);

  // Set of player IDs assigned as sub
  const assignedSubPlayerIds = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => {
      if (s.subPlayerIds) {
        s.subPlayerIds.forEach((id) => set.add(id));
      }
    });
    return set;
  }, [slots]);

  // Set of all player IDs currently assigned on the pitch (main + sub)
  const assignedPlayerIds = useMemo(() => {
    return new Set([...assignedMainPlayerIds, ...assignedSubPlayerIds]);
  }, [assignedMainPlayerIds, assignedSubPlayerIds]);

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

  // Toggle Attack Direction (Left <-> Right)
  const handleToggleAttackDirection = () => {
    const nextDirection: AttackDirection = attackDirection === 'right' ? 'left' : 'right';
    setAttackDirection(nextDirection);
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        x: Number((100 - slot.x).toFixed(2)),
        y: Number((100 - slot.y).toFixed(2)),
      }))
    );
  };

  // Change Preset Formation layout
  const handleSelectFormation = (formationId: string) => {
    setCurrentFormationId(formationId);
    const preset = FORMATION_PRESETS.find((f) => f.id === formationId);
    if (!preset) return;

    // Keep existing assigned players if possible, map to new position coordinates
    const newSlots: PositionSlot[] = preset.positions.map((pos, idx) => {
      const existingPlayerId = slots[idx]?.playerId || null;
      const existingSubs = slots[idx]?.subPlayerIds || [];
      const posX = attackDirection === 'left' ? 100 - pos.x : pos.x;
      const posY = attackDirection === 'left' ? 100 - pos.y : pos.y;
      return {
        id: `slot-${idx}`,
        role: pos.role,
        label: pos.label,
        x: Number(posX.toFixed(2)),
        y: Number(posY.toFixed(2)),
        playerId: existingPlayerId,
        subPlayerIds: existingSubs,
      };
    });
    setSlots(newSlots);
  };

  const handleAssignPlayerToSlot = (slotId: string, playerId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        let newSlot = { ...slot };
        if (newSlot.playerId === playerId) {
          newSlot.playerId = null;
        }
        if (newSlot.subPlayerIds && newSlot.subPlayerIds.includes(playerId)) {
          newSlot.subPlayerIds = newSlot.subPlayerIds.filter((id) => id !== playerId);
        }
        if (newSlot.id === slotId) {
          newSlot.playerId = playerId;
        }
        return newSlot;
      })
    );
    setSelectedSlotId(null);
  };

  const handleAssignSubPlayerToSlot = (slotId: string, playerId: string) => {
    setSlots((prev) => {
      const targetSlot = prev.find((s) => s.id === slotId);
      if (!targetSlot) return prev;
      const currentSubs = targetSlot.subPlayerIds || [];
      if (currentSubs.length >= 5 || currentSubs.includes(playerId)) return prev;

      return prev.map((slot) => {
        let newSlot = { ...slot };
        if (newSlot.playerId === playerId) {
          newSlot.playerId = null;
        }
        if (newSlot.subPlayerIds && newSlot.subPlayerIds.includes(playerId)) {
          newSlot.subPlayerIds = newSlot.subPlayerIds.filter((id) => id !== playerId);
        }
        if (newSlot.id === slotId) {
          newSlot.subPlayerIds = [...(newSlot.subPlayerIds || []), playerId];
        }
        return newSlot;
      });
    });
  };

  const handleClearSlot = (slotId: string) => {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, playerId: null } : s)));
  };

  const handleClearSubPlayer = (slotId: string, subPlayerId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId && slot.subPlayerIds) {
          return {
            ...slot,
            subPlayerIds: slot.subPlayerIds.filter((id) => id !== subPlayerId),
          };
        }
        return slot;
      })
    );
  };

  const handlePromoteSubToMain = (slotId: string, subPlayerId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const oldMain = slot.playerId;
          const newSubs = (slot.subPlayerIds || []).filter((id) => id !== subPlayerId);
          if (oldMain) {
            newSubs.push(oldMain);
          }
          return {
            ...slot,
            playerId: subPlayerId,
            subPlayerIds: newSubs.slice(0, 5),
          };
        }
        return slot;
      })
    );
  };

  const handleClearAllSlots = async () => {
    if (await dialogService.confirm('Bạn có chắc chắn muốn xóa tất cả cầu thủ khỏi sân?', 'danger')) {
      setSlots((prev) => prev.map((s) => ({ ...s, playerId: null, subPlayerIds: [] })));
    }
  };

  const handleSwapSlots = (slotIdA: string, slotIdB: string) => {
    setSlots((prev) => {
      const slotA = prev.find((s) => s.id === slotIdA);
      const slotB = prev.find((s) => s.id === slotIdB);
      if (!slotA || !slotB) return prev;

      return prev.map((s) => {
        if (s.id === slotIdA) return { ...s, playerId: slotB.playerId, subPlayerIds: slotB.subPlayerIds || [] };
        if (s.id === slotIdB) return { ...s, playerId: slotA.playerId, subPlayerIds: slotA.subPlayerIds || [] };
        return s;
      });
    });
  };

  const handleQuickSwap = () => {
    if (slots.length < 2) return;

    // 1. Check if formation has both ALA_LEFT and ALA_RIGHT slots
    const alaLeftSlot = slots.find((s) => s.role === 'ALA_LEFT');
    const alaRightSlot = slots.find((s) => s.role === 'ALA_RIGHT');

    if (alaLeftSlot && alaRightSlot && alaLeftSlot.id !== alaRightSlot.id) {
      handleSwapSlots(alaLeftSlot.id, alaRightSlot.id);
      return;
    }

    // 2. Fallback: if 2 ALA slots exist (e.g. 4-0 formation)
    const alaSlots = slots.filter((s) => s.role === 'ALA_LEFT' || s.role === 'ALA_RIGHT');
    if (alaSlots.length >= 2) {
      handleSwapSlots(alaSlots[0].id, alaSlots[1].id);
      return;
    }

    // 3. Fallback: swap middle field slots (slot-1 & slot-2)
    handleSwapSlots(slots[1].id, slots[2].id);
  };

  const handleSidebarPlayerClick = async (playerId: string) => {
    if (selectedSlotId) {
      handleAssignPlayerToSlot(selectedSlotId, playerId);
    } else {
      const emptySlot = slots.find((s) => !s.playerId);
      if (emptySlot) {
        handleAssignPlayerToSlot(emptySlot.id, playerId);
      } else {
        await dialogService.alert('Cả 5 vị trí trên sân đã có cầu thủ! Nhấp chọn 1 vị trí trên sân trước khi chọn thay thế.');
      }
    }
  };

  const handleDragStartPlayer = (e: React.DragEvent, playerId: string) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/player-id', playerId);
    e.dataTransfer.setData('text/plain', playerId);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleResetPreset = () => {
    const preset = FORMATION_PRESETS.find((f) => f.id === currentFormationId);
    if (!preset) return;
    if (currentFormationId === INITIAL_TACTICAL_SQUAD.formationId) {
      setSlots(
        INITIAL_TACTICAL_SQUAD.slots.map((s) => ({
          ...s,
          x: Number((attackDirection === 'left' ? 100 - s.x : s.x).toFixed(2)),
          y: Number((attackDirection === 'left' ? 100 - s.y : s.y).toFixed(2)),
        }))
      );
    } else {
      setSlots(
        preset.positions.map((pos, idx) => ({
          id: `slot-${idx}`,
          role: pos.role,
          label: pos.label,
          x: Number((attackDirection === 'left' ? 100 - pos.x : pos.x).toFixed(2)),
          y: Number((attackDirection === 'left' ? 100 - pos.y : pos.y).toFixed(2)),
          playerId: null,
        }))
      );
    }
  };

  const handleSaveSquadAction = async () => {
    onSaveSquad({
      id: squad.id || 'default',
      formationId: currentFormationId,
      slots,
      notes,
      attackDirection,
      updatedAt: new Date().toISOString(),
    });
    await dialogService.alert('Đã lưu sơ đồ thế trận futsal thành công!');
  };

  return (
    <div className="w-full bg-white">
      {/* Sticky Compact Actions Portal (Mobile) & Desktop Always-Visible Portal */}
      {document.getElementById('topbar-actions-portal') && createPortal(
        <div className={`items-center justify-end gap-1.5 sm:gap-2 w-full ${isSticky ? 'flex' : 'hidden md:flex'}`}>
          <button onClick={handleResetPreset} className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors" title="Đặt lại sơ đồ">
            <RefreshCw className="btn-icon" />
          </button>
          <button onClick={handleClearAllSlots} className="p-1.5 md:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa tất cả">
            <Trash2 className="btn-icon" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors" title="Cấu hình">
            <Settings className="btn-icon" />
          </button>
          <button onClick={handleSaveSquadAction} className="btn-primary" title="Lưu đội hình">
            <Save className="btn-icon" />
            <span className="btn-label">Lưu đội hình</span>
          </button>
        </div>,
        document.getElementById('topbar-actions-portal')!
      )}

      {/* Sentinel for sticky header tracking */}
      <div ref={sentinelRef} className="w-full h-[1px]"></div>

      {/* Primary Action Row - Hidden on Desktop, Visible on Mobile */}
      <div className="md:hidden w-full max-w-[1920px] mx-auto layout-page-container pt-1 pb-3 border-b border-slate-200 mb-4">
        <div className="flex items-center justify-end gap-2 sm:gap-3">

          {/* Mobile More Menu */}
          <div className="relative sm:hidden">
            <button 
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} 
              className="btn-outline px-2 py-2.5 flex items-center justify-center shrink-0 shadow-sm rounded-lg"
              title="Thêm tùy chọn"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>

            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Cấu hình</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      handleResetPreset();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 border-t border-slate-100"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>Đặt lại sơ đồ</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      handleClearAllSlots();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 border-t border-slate-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Xóa tất cả</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button onClick={handleSaveSquadAction} className="btn-primary flex-1 sm:flex-none justify-center py-2.5 text-sm whitespace-nowrap">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Lưu đội hình</span>
          </button>
        </div>
      </div>

      {/* Monolithic Main Grid: Left Sidebar (4 Cols on lg, 3 Cols on xl) | Right Pitch Panel (8 Cols on lg, 9 Cols on xl) */}
      <div className="w-full max-w-[1920px] mx-auto layout-page-container grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Sidebar: Player List & Filters */}
        <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3 py-4 sm:py-5 pr-0 lg:pr-6 bg-white flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Header: Title & Player Count */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs shrink-0"></span>
                <h3 className="text-h3 text-slate-900">
                  DANH SÁCH CẦU THỦ
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full border border-blue-200">
                  {players.length}
                </span>
              </div>
            </div>

            {/* TOOLBAR: Filter & Sort (Directly under Title) */}
            <div className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2 text-xs xl:text-sm">
              <div className="flex items-center justify-between gap-2">
                <label className="font-bold text-slate-500 uppercase text-[11px] shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sắp xếp:</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white font-bold px-2 py-1 text-slate-700 border border-slate-200 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 text-xs flex-1 min-w-0"
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
                  onChange={(e) => setOnlyUnselected(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500/30 cursor-pointer"
                />
                <span className="font-bold text-xs select-none">Chỉ hiển thị cầu thủ chưa được chọn</span>
              </label>
            </div>

            {/* Player Cards Scroll Container - Fixed top clipping padding */}
            <div className="max-h-[520px] xl:max-h-[600px] overflow-y-auto px-1 pt-2 pb-2 space-y-2.5">
              {sidebarPlayers.map((p) => {
                const isAssigned = assignedMainPlayerIds.has(p.id) || assignedSubPlayerIds.has(p.id);
                const total = getPlayerTotalScore(p);
                const uniquePositions = getUniquePositionConfigs(p.positions);

                return (
                  <div
                    key={p.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStartPlayer(e, p.id)}
                    onDragEnd={(e) => e.preventDefault()}
                    onClick={() => handleSidebarPlayerClick(p.id)}
                    className={`group relative card-surface transition-all duration-200 select-none flex flex-col justify-between ${
                      isAssigned
                        ? 'bg-slate-50 border-slate-200/80 opacity-60 shadow-none cursor-pointer'
                        : 'hover:shadow-md hover:border-blue-400/80 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {/* TOP ROW: Drag handle + #Number + Name + Total score */}
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 gap-2 border-b border-slate-100">
                      <div className="flex items-center space-x-2 min-w-0 flex-1 pr-1">
                        {/* Drag Handle Icon (:::) */}
                        <GripVertical className={`w-4 h-4 shrink-0 transition-colors ${
                          isAssigned ? 'text-slate-300' : 'text-slate-400 group-hover:text-blue-600'
                        }`} />

                        {/* Shirt Number Badge */}
                        <span className={`w-5 h-5 font-black text-xs rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                          isAssigned ? 'bg-slate-400 text-white' : 'bg-slate-900 text-white'
                        }`}>
                          #{p.number}
                        </span>

                        {/* Player Name */}
                        <span className={`font-extrabold text-xs xl:text-sm truncate ${
                          isAssigned ? 'text-slate-400' : 'text-slate-900'
                        }`} title={p.name}>
                          {p.name}
                        </span>
                      </div>

                      {/* Total Score Badge (Removed Edit button as requested) */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/80 shrink-0">
                          {total !== -1 ? `${total}đ` : '-'}
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM ROW: Compact Stats Chips (Công, Thủ, Bền) + Position Badges */}
                    <div className="flex items-center justify-between gap-1.5 pt-0.5">
                      {/* Compact Stats Badges: Công, Thủ, Bền */}
                      <div className="flex items-center gap-1 min-w-0 flex-1 text-[11px]">
                        <span className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60" title="Tấn công">
                          <span className="text-[10px] text-amber-600 font-semibold">Công</span>
                          <span className="font-extrabold">{p.attack ?? '-'}</span>
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/60" title="Phòng thủ">
                          <span className="text-[10px] text-blue-600 font-semibold">Thủ</span>
                          <span className="font-extrabold">{p.defense ?? '-'}</span>
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60" title="Thể lực / Độ bền">
                          <span className="text-[10px] text-emerald-600 font-semibold">Bền</span>
                          <span className="font-extrabold">{p.stamina ?? '-'}</span>
                        </span>
                      </div>

                      {/* Positions Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        {uniquePositions.length > 0 ? (
                          uniquePositions.slice(0, 3).map((cfg) => (
                            <span
                              key={cfg.shortLabel}
                              className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 truncate cursor-help"
                              title={cfg.fullLabel}
                            >
                              {cfg.shortLabel}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">-</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Futsal Pitch Section (8 Cols on lg, 9 Cols on xl) */}
        <div className="order-1 lg:order-2 lg:col-span-8 xl:col-span-9 py-4 sm:py-5 pl-0 lg:pl-6 bg-white space-y-4">
          <FutsalPitch
            slots={slots}
            playersMap={playersMap}
            selectedSlotId={selectedSlotId}
            showSubs={showSubs}
            onSelectSlot={(id) => setSelectedSlotId(selectedSlotId === id ? null : id)}
            onAssignPlayerToSlot={handleAssignPlayerToSlot}
            onAssignSubPlayerToSlot={handleAssignSubPlayerToSlot}
            onClearSlot={handleClearSlot}
            onClearSubPlayer={handleClearSubPlayer}
            onPromoteSubToMain={handlePromoteSubToMain}
            onSwapSlots={handleSwapSlots}
          />

          {/* Pitch Bottom Info & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-1 text-sm gap-3">
            <div className="flex items-center space-x-2 text-slate-600 font-semibold">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Kéo thả cầu thủ từ danh sách vào vị trí trên sân để thay đổi.</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW ROW: Seamless 2-Column Layout for Squad Overview & Tactical Notes (Part of Page Content) */}
      <div className="border-t border-slate-200 pt-5 pb-6">
        <div className="w-full max-w-[1920px] mx-auto layout-page-container grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMN 1 (6 Cols): Combined Squad Info + Average Team Stats */}
          <div className="lg:col-span-6 space-y-4">
            {/* 1.1 Squad Formation Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-xs shrink-0"></span>
                <span>THÔNG TIN ĐỘI HÌNH & BÀI ĐÁNH</span>
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs pt-0.5">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70">
                  <span className="font-semibold text-slate-500 block text-[11px]">Đội hình:</span>
                  <span className="text-blue-700 font-black text-sm block mt-0.5">{currentPreset.name}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70">
                  <span className="font-semibold text-slate-500 block text-[11px]">Sơ đồ:</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5 truncate" title={currentPreset.schema}>{currentPreset.schema}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70">
                  <span className="font-semibold text-slate-500 block text-[11px]">Hướng tấn công:</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">
                    {attackDirection === 'right' ? 'Phải ➔' : '🧠 Trái'}
                  </span>
                </div>
              </div>
            </div>

            {/* 1.2 Average Stats (TB 5 cầu thủ ra sân) */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-xs shrink-0"></span>
                <span>TỔNG CHỈ SỐ ĐỘI HÌNH (TB 5 CẦU THỦ RA SÂN)</span>
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50/70 p-2.5 rounded border border-emerald-200/70">
                  <span className="block text-[11px] font-bold text-emerald-700">🟢 Bền (Thể Lực)</span>
                  <span className="text-lg font-black text-emerald-700 mt-0.5 block">{teamAverageStats.avgStamina}</span>
                </div>
                <div className="bg-amber-50/70 p-2.5 rounded border border-amber-200/70">
                  <span className="block text-[11px] font-bold text-amber-700">🟠 Công (Tấn Công)</span>
                  <span className="text-lg font-black text-amber-700 mt-0.5 block">{teamAverageStats.avgAttack}</span>
                </div>
                <div className="bg-blue-50/70 p-2.5 rounded border border-blue-200/70">
                  <span className="block text-[11px] font-bold text-blue-700">🔵 Thủ (Phòng Thủ)</span>
                  <span className="text-lg font-black text-blue-700 mt-0.5 block">{teamAverageStats.avgDefense}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2 (6 Cols): Tactical Notes & Starting Players Characteristics */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center space-x-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-xs shrink-0"></span>
              <span>GHI CHÚ ĐỘI HÌNH & 5 CẦU THỦ RA SÂN</span>
            </h4>

            {startingPlayersWithNotes.length > 0 ? (
              <div className="space-y-1.5 bg-amber-50/70 p-2.5 rounded border border-amber-200/70">
                <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
                  📋 Đặc điểm cầu thủ ra sân ({startingPlayersWithNotes.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {startingPlayersWithNotes.map(({ slot, player }) => (
                    <div key={slot.id} className="bg-white p-1.5 rounded border border-amber-200/80 flex items-center space-x-1.5 min-w-0">
                      <span className="font-black text-slate-900 shrink-0">#{player.number} {getVietnameseShortName(player.name)}:</span>
                      <span className="text-amber-900 font-semibold truncate" title={player.notes}>{player.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium italic bg-slate-50 p-2 rounded border border-slate-200/80 text-center">
                Chưa có cầu thủ ra sân nào có ghi chú cá nhân riêng.
              </div>
            )}

            <textarea
              placeholder="Nhập thêm ghi chú bài đánh chung cho đội hình này..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-600 resize-none font-medium text-slate-800"
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Settings Modal Dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="text-h3 text-slate-900">Cấu hình Đội Hình</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Đội hình Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Sơ đồ chiến thuật</label>
                <select
                  value={currentFormationId}
                  onChange={(e) => handleSelectFormation(e.target.value)}
                  className="w-full bg-slate-50 text-emerald-700 font-black text-sm px-3 py-2.5 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500 shadow-sm"
                >
                  {FORMATION_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} ({preset.subName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hướng tấn công */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Hướng tấn công</label>
                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className={`text-sm font-bold ${attackDirection === 'left' ? 'text-blue-700 font-black' : 'text-slate-500'}`}>
                    Trái
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={attackDirection === 'right'}
                    onClick={() => handleToggleAttackDirection()}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      attackDirection === 'right' ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        attackDirection === 'right' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {attackDirection === 'right' ? (
                        <ArrowRight className="w-3 h-3 text-blue-600 stroke-[3]" />
                      ) : (
                        <ArrowLeft className="w-3 h-3 text-slate-400 stroke-[3]" />
                      )}
                    </span>
                  </button>
                  <span className={`text-sm font-bold ${attackDirection === 'right' ? 'text-blue-700 font-black' : 'text-slate-500'}`}>
                    Phải
                  </span>
                </div>
              </div>

              {/* Ẩn / Hiện Dự bị */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Quản lý Dự bị</label>
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer" onClick={() => setShowSubs(!showSubs)}>
                  <span className="text-sm font-bold text-slate-700">Hiển thị khe thẻ dự bị</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showSubs}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showSubs ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        showSubs ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {showSubs ? (
                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                      ) : (
                        <X className="w-3 h-3 text-slate-400 stroke-[3]" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Hoán đổi nhanh */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Tiện ích</label>
                <button
                  onClick={() => {
                    handleQuickSwap();
                    setIsSettingsOpen(false);
                  }}
                  className="w-full btn-outline flex items-center justify-center py-2 text-sm"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  <span>Đổi cánh nhanh (Ala Trái ↔ Phải)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
