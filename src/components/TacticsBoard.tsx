import React, { useState, useMemo, useEffect } from 'react';
import type { Player, TacticalSquad, PositionSlot, AttackDirection } from '../types/futsal';
import { getPositionConfig } from '../types/futsal';
import { FORMATION_PRESETS, INITIAL_TACTICAL_SQUAD } from '../services/initialData';
import { FutsalPitch } from './FutsalPitch';
import { TopbarPortal } from '../context/TopbarContext';
import {
  RefreshCw,
  Save,
  Trash2,
  ArrowLeftRight,
  Info,
  X,
  FileText,
  BarChart2,
  Users,
  Layout,
} from 'lucide-react';

import { BenchPanel } from '../features/tactics/components/BenchPanel';
import { TeamStatsCard } from '../features/tactics/components/TeamStatsCard';
import { TacticalNotesCard } from '../features/tactics/components/TacticalNotesCard';

interface TacticsBoardProps {
  players: Player[];
  squad: TacticalSquad;
  onSaveSquad: (squad: TacticalSquad) => void;
}

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ players, squad, onSaveSquad }) => {
  const [currentFormationId, setCurrentFormationId] = useState<string>(squad.formationId || '3-1');
  const [slots, setSlots] = useState<PositionSlot[]>(squad.slots);
  const [notes, setNotes] = useState<string>(squad.notes || '');
  const [attackDirection, setAttackDirection] = useState<AttackDirection>(squad.attackDirection || 'right');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Viewport Size Tracking & Adaptive Workspace Detection
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mode Detection: FULL WORKSPACE vs FOCUS WORKSPACE
  // Full Workspace requires >= 1536px width AND >= 800px height
  const isFullWorkspace = useMemo(() => {
    return viewportSize.width >= 1536 && viewportSize.height >= 800;
  }, [viewportSize.width, viewportSize.height]);

  // Focus Workspace Interactive State (Drawers & Bottom Dock)
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showBottomDock, setShowBottomDock] = useState<boolean>(false);
  const [bottomDockTab, setBottomDockTab] = useState<'bench' | 'stats' | 'notes'>('bench');

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

    const newSlots: PositionSlot[] = preset.positions.map((pos, idx) => {
      const existingPlayerId = slots[idx]?.playerId || null;
      const posX = attackDirection === 'left' ? 100 - pos.x : pos.x;
      const posY = attackDirection === 'left' ? 100 - pos.y : pos.y;
      return {
        id: `slot-${idx}`,
        role: pos.role,
        label: pos.label,
        x: Number(posX.toFixed(2)),
        y: Number(posY.toFixed(2)),
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
      attackDirection,
      updatedAt: new Date().toISOString(),
    };
    onSaveSquad(updatedSquad);
    alert('Đã lưu sơ đồ thế trận futsal thành công!');
  };

  const handleResetPreset = () => {
    const preset = FORMATION_PRESETS.find((f) => f.id === currentFormationId);
    if (!preset) return;

    if (currentFormationId === INITIAL_TACTICAL_SQUAD.formationId) {
      setSlots(
        INITIAL_TACTICAL_SQUAD.slots.map((s) => {
          const posX = attackDirection === 'left' ? 100 - s.x : s.x;
          const posY = attackDirection === 'left' ? 100 - s.y : s.y;
          return {
            ...s,
            x: Number(posX.toFixed(2)),
            y: Number(posY.toFixed(2)),
          };
        })
      );
    } else {
      const resetSlots: PositionSlot[] = preset.positions.map((pos, idx) => {
        const posX = attackDirection === 'left' ? 100 - pos.x : pos.x;
        const posY = attackDirection === 'left' ? 100 - pos.y : pos.y;
        return {
          id: `slot-${idx}`,
          role: pos.role,
          label: pos.label,
          x: Number(posX.toFixed(2)),
          y: Number(posY.toFixed(2)),
          playerId: null,
        };
      });
      setSlots(resetSlots);
    }
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

  // Render Component for Player List Sidebar Content
  const renderPlayerListContent = () => (
    <div className="flex flex-col h-full justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span>DANH SÁCH CẦU THỦ ({players.length})</span>
          </h3>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-sm font-bold text-slate-500 uppercase pb-1.5 border-b border-slate-200">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-6">Cầu thủ</span>
          <span className="col-span-1 text-center text-emerald-600">TL</span>
          <span className="col-span-1 text-center text-orange-600">TC</span>
          <span className="col-span-1 text-center text-blue-600">PT</span>
          <span className="col-span-2 text-right pr-1">Tổng</span>
        </div>

        {/* Player Scroll List */}
        <div className="max-h-[380px] xl:max-h-[460px] overflow-y-auto divide-y divide-slate-100 my-1 pr-1">
          {sidebarPlayers.map((p) => {
            const isAssigned = assignedPlayerIds.has(p.id);
            const total = getPlayerTotalScore(p);
            return (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStartPlayer(e, p.id)}
                onClick={() => handleSidebarPlayerClick(p.id)}
                className={`grid grid-cols-12 items-center py-2 px-1.5 text-sm cursor-pointer rounded-xl transition-colors ${
                  isAssigned
                    ? 'bg-slate-50 text-slate-400 opacity-60'
                    : 'hover:bg-blue-50/80 text-slate-900 font-semibold'
                }`}
              >
                <span className="col-span-1 text-center font-black text-slate-700">{p.number}</span>
                <div className="col-span-6 flex items-center space-x-1 min-w-0 pr-1">
                  <span className="truncate font-bold text-sm" title={p.name}>{p.name}</span>
                  {p.positions && p.positions.length > 0 && (
                    <div className="flex items-center space-x-0.5 shrink-0">
                      {p.positions.map((pos) => {
                        const cfg = getPositionConfig(pos);
                        return (
                          <span
                            key={pos}
                            className={`text-[9.5px] font-black px-1 rounded border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
                            title={cfg.fullLabel}
                          >
                            {cfg.shortLabel}
                          </span>
                        );
                      })}
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
        <div className="pt-3 border-t border-slate-100 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-1.5">
            <span className="font-bold text-slate-500 uppercase text-xs">SẮP XẾP</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 font-bold px-2.5 py-1 rounded-xl text-slate-800 border border-slate-200 cursor-pointer focus:outline-none text-sm"
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
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-bold text-sm">Chỉ hiển thị chưa chọn</span>
          </label>
        </div>
      </div>

      {/* Bottom Left: Squad Info */}
      <div className="pt-2 border-t border-slate-100 bg-slate-50 p-3 rounded-xl space-y-0.5">
        <h4 className="text-xs font-black text-slate-500 uppercase">THÔNG TIN SƠ ĐỒ</h4>
        <p className="text-sm font-bold text-slate-800">
          Đội hình: <span className="text-blue-600 font-extrabold">{currentPreset.name} ({currentPreset.subName})</span>
        </p>
      </div>
    </div>
  );

  // Render Component for Bench Section
  const renderBenchContent = () => (
    <BenchPanel
      benchPlayers={benchPlayers}
      onDragStartPlayer={handleDragStartPlayer}
      onPlayerClick={handleSidebarPlayerClick}
    />
  );

  // Render Component for Average Team Stats
  const renderStatsContent = () => (
    <TeamStatsCard teamAverageStats={teamAverageStats} />
  );

  // Render Component for Tactical Notes
  const renderNotesContent = () => (
    <TacticalNotesCard
      startingPlayersWithNotes={startingPlayersWithNotes}
      notes={notes}
      onNotesChange={setNotes}
    />
  );

  return (
    <div className="max-w-[2200px] mx-auto px-2 sm:px-5 lg:px-6 py-3">
      {/* Topbar Injection via React Portal */}
      <TopbarPortal>
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Layout className="w-4 h-4 text-blue-600" />
              <span>SƠ ĐỒ CHIẾN THUẬT</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 shrink-0 ml-auto">
            {!isFullWorkspace && (
              <button
                onClick={() => setShowLeftDrawer(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all cursor-pointer shadow-2xs"
                title="Mở danh sách cầu thủ"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Cầu thủ ({players.length})</span>
              </button>
            )}

            {!isFullWorkspace && (
              <button
                onClick={() => setShowBottomDock(!showBottomDock)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  showBottomDock
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
                }`}
                title="Mở thông tin Dự bị, Chỉ số & Ghi chú"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Chi tiết</span>
              </button>
            )}

            <button
              onClick={handleResetPreset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
              title="Khôi phục vị trí sơ đồ mặc định"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 border border-blue-500 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu chiến thuật</span>
            </button>
          </div>
        </div>
      </TopbarPortal>
      {/* 2. Main Content Layout */}
      {isFullWorkspace ? (
        /* FULL WORKSPACE (Desktop 24-27" 1080p & 2K): 3-Column Professional Layout */
        <div className="grid grid-cols-12 gap-4 lg:gap-5 items-start">
          {/* Column 1: Persistent Left Player List (3 Cols) */}
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-[calc(100vh-84px)] overflow-hidden">
            {renderPlayerListContent()}
          </div>

          {/* Column 2: Center Interactive Futsal Court (6 Cols) */}
          <div className="col-span-6 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 space-y-2">
              <FutsalPitch
                slots={slots}
                playersMap={playersMap}
                selectedSlotId={selectedSlotId}
                attackDirection={attackDirection}
                currentFormationId={currentFormationId}
                onSelectFormation={handleSelectFormation}
                onToggleAttackDirection={handleToggleAttackDirection}
                onSelectSlot={(id) => setSelectedSlotId(selectedSlotId === id ? null : id)}
                onAssignPlayerToSlot={handleAssignPlayerToSlot}
                onClearSlot={handleClearSlot}
                onSwapSlots={handleSwapSlots}
                onQuickSwap={handleQuickSwap}
                onClearAllSlots={handleClearAllSlots}
              />

              {/* Pitch Bottom Info */}
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-sm pt-1">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Kéo thả cầu thủ vào sân để sắp xếp vị trí bài đánh.</span>
              </div>
            </div>
          </div>

          {/* Column 3: Right Inspector Panel (3 Cols) - Bench + Stats + Notes */}
          <div className="col-span-3 space-y-3.5 h-[calc(100vh-84px)] overflow-y-auto pr-1">
            {/* Bench Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              {renderBenchContent()}
            </div>

            {/* Average Stats Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              {renderStatsContent()}
            </div>

            {/* Tactical Notes Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              {renderNotesContent()}
            </div>
          </div>
        </div>
      ) : (
        /* FOCUS WORKSPACE (Laptop 1366x768 / 1280x720 & Scale 125-150%): Max Pitch Height & Zero Page Scroll */
        <div className="space-y-3">
          {/* Main Pitch Viewport Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-2 max-w-full">
            <FutsalPitch
              slots={slots}
              playersMap={playersMap}
              selectedSlotId={selectedSlotId}
              attackDirection={attackDirection}
              currentFormationId={currentFormationId}
              onSelectFormation={handleSelectFormation}
              onToggleAttackDirection={handleToggleAttackDirection}
              onSelectSlot={(id) => setSelectedSlotId(selectedSlotId === id ? null : id)}
              onAssignPlayerToSlot={handleAssignPlayerToSlot}
              onClearSlot={handleClearSlot}
              onSwapSlots={handleSwapSlots}
            />

            {/* Pitch Action Footer */}
            <div className="flex items-center justify-between pt-1 text-xs gap-2">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-sm truncate">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Kéo thả cầu thủ vào vị trí trên sân.</span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={handleQuickSwap}
                  className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Hoán đổi</span>
                </button>
                <button
                  onClick={handleClearAllSlots}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FOCUS WORKSPACE INTERACTIVE OVERLAYS */}

      {/* Left Collapsible Drawer for Player List (Laptop Mode) */}
      {showLeftDrawer && !isFullWorkspace && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-80 sm:w-96 bg-white h-full shadow-2xl border-r border-slate-200 p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
              <span className="font-black text-sm text-slate-900 uppercase">QUẢN LÝ ĐỘI HÌNH</span>
              <button
                onClick={() => setShowLeftDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderPlayerListContent()}
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowLeftDrawer(false)}></div>
        </div>
      )}

      {/* Bottom Inspector Dock for Bench / Stats / Notes (Laptop Mode) */}
      {showBottomDock && !isFullWorkspace && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-3 max-h-[340px] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          {/* Dock Header Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 shrink-0">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setBottomDockTab('bench')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  bottomDockTab === 'bench'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Dự Bị ({benchPlayers.length})</span>
              </button>

              <button
                onClick={() => setBottomDockTab('stats')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  bottomDockTab === 'stats'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Chỉ Số TB</span>
              </button>

              <button
                onClick={() => setBottomDockTab('notes')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  bottomDockTab === 'notes'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ghi Chú</span>
              </button>
            </div>

            <button
              onClick={() => setShowBottomDock(false)}
              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dock Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {bottomDockTab === 'bench' && renderBenchContent()}
            {bottomDockTab === 'stats' && renderStatsContent()}
            {bottomDockTab === 'notes' && renderNotesContent()}
          </div>
        </div>
      )}
    </div>
  );
};
