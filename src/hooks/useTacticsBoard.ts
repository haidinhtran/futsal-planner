import { useState, useMemo, useEffect } from "react";
import type {
  Player,
  TacticalSquad,
  PositionSlot,
  AttackDirection,
} from "@/types/futsal";
import {
  FORMATION_PRESETS,
  INITIAL_TACTICAL_SQUAD,
} from "@/services/initialData";
import { dialogService } from "@/services/dialogService";
import { getPlayerTotalScore } from "@/utils/pitchHelpers";

interface UseTacticsBoardProps {
  players: Player[];
  squad: TacticalSquad;
  onSaveSquad: (squad: TacticalSquad) => void;
}

export interface PlayerPickerState {
  isOpen: boolean;
  slotId: string | null;
  mode: "main" | "sub";
}

export function useTacticsBoard({
  players,
  squad,
  onSaveSquad,
}: UseTacticsBoardProps) {
  const [currentFormationId, setCurrentFormationId] = useState<string>(
    squad.formationId || "3-1",
  );
  const [slots, setSlots] = useState<PositionSlot[]>(squad.slots || []);
  const [notes, setNotes] = useState<string>(squad.notes || "");
  const [attackDirection, setAttackDirection] = useState<AttackDirection>(
    squad.attackDirection || "right",
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showSubs, setShowSubs] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [onlyUnselected, setOnlyUnselected] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<
    "total_desc" | "total_asc" | "number_asc"
  >("total_desc");
  const [pickerState, setPickerState] = useState<PlayerPickerState>({
    isOpen: false,
    slotId: null,
    mode: "main",
  });

  useEffect(() => {
    if (squad) {
      setCurrentFormationId(squad.formationId || "3-1");
      setSlots(squad.slots || []);
      setNotes(squad.notes || "");
      setAttackDirection(squad.attackDirection || "right");
    }
  }, [squad]);

  const playersMap = useMemo(() => {
    const map: Record<string, Player> = {};
    players.forEach((p) => (map[p.id] = p));
    return map;
  }, [players]);

  const currentPreset = useMemo(() => {
    return (
      FORMATION_PRESETS.find((f) => f.id === currentFormationId) ||
      FORMATION_PRESETS[1]
    );
  }, [currentFormationId]);

  const assignedMainPlayerIds = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => {
      if (s.playerId) set.add(s.playerId);
    });
    return set;
  }, [slots]);

  const assignedSubPlayerIds = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => {
      s.subPlayerIds?.forEach((id) => set.add(id));
    });
    return set;
  }, [slots]);

  const assignedPlayerIds = useMemo(() => {
    return new Set([...assignedMainPlayerIds, ...assignedSubPlayerIds]);
  }, [assignedMainPlayerIds, assignedSubPlayerIds]);

  const sidebarPlayers = useMemo(() => {
    return players
      .filter((p) => !onlyUnselected || !assignedPlayerIds.has(p.id))
      .sort((a, b) => {
        if (sortBy === "number_asc") return a.number - b.number;
        const totalA = getPlayerTotalScore(a);
        const totalB = getPlayerTotalScore(b);
        return sortBy === "total_desc" ? totalB - totalA : totalA - totalB;
      });
  }, [players, onlyUnselected, assignedPlayerIds, sortBy]);

  const teamAverageStats = useMemo(() => {
    let staSum = 0,
      staC = 0,
      attSum = 0,
      attC = 0,
      defSum = 0,
      defC = 0;
    slots.forEach((s) => {
      const p = s.playerId ? playersMap[s.playerId] : null;
      if (p) {
        if (p.stamina !== null) {
          staSum += p.stamina;
          staC++;
        }
        if (p.attack !== null) {
          attSum += p.attack;
          attC++;
        }
        if (p.defense !== null) {
          defSum += p.defense;
          defC++;
        }
      }
    });
    return {
      avgStamina: staC > 0 ? (staSum / staC).toFixed(1) : "-",
      avgAttack: attC > 0 ? (attSum / attC).toFixed(1) : "-",
      avgDefense: defC > 0 ? (defSum / defC).toFixed(1) : "-",
    };
  }, [slots, playersMap]);

  const startingPlayersWithNotes = useMemo(() => {
    return slots
      .map((slot) => {
        if (!slot.playerId) return null;
        const p = playersMap[slot.playerId];
        if (!p || !p.notes || p.notes.trim() === "") return null;
        return { slot, player: p };
      })
      .filter(Boolean) as Array<{ slot: PositionSlot; player: Player }>;
  }, [slots, playersMap]);

  const handleToggleAttackDirection = () => {
    const nextDir: AttackDirection =
      attackDirection === "right" ? "left" : "right";
    setAttackDirection(nextDir);
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        x: Number((100 - slot.x).toFixed(2)),
        y: Number((100 - slot.y).toFixed(2)),
      })),
    );
  };

  const handleSelectFormation = (formationId: string) => {
    setCurrentFormationId(formationId);
    const preset = FORMATION_PRESETS.find((f) => f.id === formationId);
    if (!preset) return;

    setSlots(
      preset.positions.map((pos, idx) => ({
        id: `slot-${idx}`,
        role: pos.role,
        label: pos.label,
        x: Number(
          (attackDirection === "left" ? 100 - pos.x : pos.x).toFixed(2),
        ),
        y: Number(
          (attackDirection === "left" ? 100 - pos.y : pos.y).toFixed(2),
        ),
        playerId: slots[idx]?.playerId || null,
        subPlayerIds: slots[idx]?.subPlayerIds || [],
      })),
    );
  };

  const handleAssignPlayerToSlot = (slotId: string, playerId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        const newSlot = { ...slot };
        if (newSlot.playerId === playerId) newSlot.playerId = null;
        if (newSlot.subPlayerIds?.includes(playerId)) {
          newSlot.subPlayerIds = newSlot.subPlayerIds.filter(
            (id) => id !== playerId,
          );
        }
        if (newSlot.id === slotId) newSlot.playerId = playerId;
        return newSlot;
      }),
    );
    setSelectedSlotId(null);
  };

  const handleAssignSubPlayerToSlot = (slotId: string, playerId: string) => {
    setSlots((prev) => {
      const targetSlot = prev.find((s) => s.id === slotId);
      if (!targetSlot) return prev;
      const currentSubs = targetSlot.subPlayerIds || [];
      if (currentSubs.length >= 5 || currentSubs.includes(playerId))
        return prev;

      return prev.map((slot) => {
        const newSlot = { ...slot };
        if (newSlot.playerId === playerId) newSlot.playerId = null;
        if (newSlot.subPlayerIds?.includes(playerId)) {
          newSlot.subPlayerIds = newSlot.subPlayerIds.filter(
            (id) => id !== playerId,
          );
        }
        if (newSlot.id === slotId) {
          newSlot.subPlayerIds = [...(newSlot.subPlayerIds || []), playerId];
        }
        return newSlot;
      });
    });
  };

  const handleClearSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, playerId: null } : s)),
    );
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
      }),
    );
  };

  const handlePromoteSubToMain = (slotId: string, subPlayerId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const oldMain = slot.playerId;
          const newSubs = (slot.subPlayerIds || []).filter(
            (id) => id !== subPlayerId,
          );
          if (oldMain) newSubs.push(oldMain);
          return {
            ...slot,
            playerId: subPlayerId,
            subPlayerIds: newSubs.slice(0, 5),
          };
        }
        return slot;
      }),
    );
  };

  const handleClearAllSlots = async () => {
    if (
      await dialogService.confirm(
        "Bạn có chắc chắn muốn xóa tất cả cầu thủ khỏi sân?",
        "danger",
      )
    ) {
      setSlots((prev) =>
        prev.map((s) => ({ ...s, playerId: null, subPlayerIds: [] })),
      );
    }
  };

  const handleSwapSlots = (slotIdA: string, slotIdB: string) => {
    setSlots((prev) => {
      const slotA = prev.find((s) => s.id === slotIdA);
      const slotB = prev.find((s) => s.id === slotIdB);
      if (!slotA || !slotB) return prev;
      return prev.map((s) => {
        if (s.id === slotIdA)
          return {
            ...s,
            playerId: slotB.playerId,
            subPlayerIds: slotB.subPlayerIds || [],
          };
        if (s.id === slotIdB)
          return {
            ...s,
            playerId: slotA.playerId,
            subPlayerIds: slotA.subPlayerIds || [],
          };
        return s;
      });
    });
  };

  const handleQuickSwap = () => {
    if (slots.length < 2) return;
    const alaLeftSlot = slots.find((s) => s.role === "ALA_LEFT");
    const alaRightSlot = slots.find((s) => s.role === "ALA_RIGHT");
    if (alaLeftSlot && alaRightSlot && alaLeftSlot.id !== alaRightSlot.id) {
      handleSwapSlots(alaLeftSlot.id, alaRightSlot.id);
      return;
    }
    const alaSlots = slots.filter(
      (s) => s.role === "ALA_LEFT" || s.role === "ALA_RIGHT",
    );
    if (alaSlots.length >= 2) {
      handleSwapSlots(alaSlots[0].id, alaSlots[1].id);
      return;
    }
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
        await dialogService.alert(
          "Cả 5 vị trí trên sân đã có cầu thủ! Nhấp chọn 1 vị trí trên sân trước khi chọn thay thế.",
        );
      }
    }
  };

  const handleDragStartPlayer = (e: React.DragEvent, playerId: string) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/player-id", playerId);
    e.dataTransfer.setData("text/plain", playerId);
    e.dataTransfer.effectAllowed = "copyMove";
  };

  const handleResetPreset = () => {
    const preset = FORMATION_PRESETS.find((f) => f.id === currentFormationId);
    if (!preset) return;
    if (currentFormationId === INITIAL_TACTICAL_SQUAD.formationId) {
      setSlots(
        INITIAL_TACTICAL_SQUAD.slots.map((s) => ({
          ...s,
          x: Number((attackDirection === "left" ? 100 - s.x : s.x).toFixed(2)),
          y: Number((attackDirection === "left" ? 100 - s.y : s.y).toFixed(2)),
        })),
      );
    } else {
      setSlots(
        preset.positions.map((pos, idx) => ({
          id: `slot-${idx}`,
          role: pos.role,
          label: pos.label,
          x: Number(
            (attackDirection === "left" ? 100 - pos.x : pos.x).toFixed(2),
          ),
          y: Number(
            (attackDirection === "left" ? 100 - pos.y : pos.y).toFixed(2),
          ),
          playerId: null,
        })),
      );
    }
  };

  const handleSaveSquadAction = async () => {
    onSaveSquad({
      id: squad.id || "default",
      formationId: currentFormationId,
      slots,
      notes,
      attackDirection,
      updatedAt: new Date().toISOString(),
    });
    await dialogService.alert("Đã lưu sơ đồ thế trận futsal thành công!");
  };

  const openPicker = (slotId: string, mode: "main" | "sub") => {
    setPickerState({ isOpen: true, slotId, mode });
  };

  const closePicker = () => {
    setPickerState((prev) => ({ ...prev, isOpen: false, slotId: null }));
  };

  return {
    currentFormationId,
    slots,
    notes,
    setNotes,
    attackDirection,
    selectedSlotId,
    setSelectedSlotId,
    showSubs,
    setShowSubs,
    isSettingsOpen,
    setIsSettingsOpen,
    isMoreMenuOpen,
    setIsMoreMenuOpen,
    onlyUnselected,
    setOnlyUnselected,
    sortBy,
    setSortBy,
    pickerState,
    playersMap,
    currentPreset,
    assignedMainPlayerIds,
    assignedSubPlayerIds,
    assignedPlayerIds,
    sidebarPlayers,
    teamAverageStats,
    startingPlayersWithNotes,
    handleToggleAttackDirection,
    handleSelectFormation,
    handleAssignPlayerToSlot,
    handleAssignSubPlayerToSlot,
    handleClearSlot,
    handleClearSubPlayer,
    handlePromoteSubToMain,
    handleClearAllSlots,
    handleSwapSlots,
    handleQuickSwap,
    handleSidebarPlayerClick,
    handleDragStartPlayer,
    handleResetPreset,
    handleSaveSquadAction,
    openPicker,
    closePicker,
  };
}
