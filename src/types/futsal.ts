export type PositionTag = 'GK' | 'FI' | 'AL_L' | 'AL_R' | 'PI';

export const POSITION_TAG_CONFIG: Record<
  string,
  { shortLabel: string; fullLabel: string; bgClass: string; textClass: string; borderClass: string }
> = {
  GK: { shortLabel: 'GK', fullLabel: 'Thủ Môn (Goalkeeper)', bgClass: 'bg-emerald-100', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' },
  FI: { shortLabel: 'FI', fullLabel: 'Hậu Vệ (Fixo)', bgClass: 'bg-purple-100', textClass: 'text-purple-800', borderClass: 'border-purple-200' },
  AL_L: { shortLabel: 'ALA', fullLabel: 'Tiền Vệ Cánh Trái (Ala Left)', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
  AL_R: { shortLabel: 'ALA', fullLabel: 'Tiền Vệ Cánh Phải (Ala Right)', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
  PI: { shortLabel: 'PI', fullLabel: 'Tiền Đạo (Pivot)', bgClass: 'bg-amber-100', textClass: 'text-amber-800', borderClass: 'border-amber-200' },
  AL: { shortLabel: 'ALA', fullLabel: 'Tiền Vệ Cánh (Ala)', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
};

export const getPositionConfig = (pos: string) => {
  return (
    POSITION_TAG_CONFIG[pos] || {
      shortLabel: pos,
      fullLabel: pos,
      bgClass: 'bg-slate-100',
      textClass: 'text-slate-700',
      borderClass: 'border-slate-200',
    }
  );
};

export const getUniquePositionConfigs = (positions?: string[]) => {
  if (!positions || positions.length === 0) return [];
  const seen = new Set<string>();
  const list: Array<{ shortLabel: string; fullLabel: string; bgClass: string; textClass: string; borderClass: string }> = [];

  for (const pos of positions) {
    const cfg = getPositionConfig(pos);
    if (!seen.has(cfg.shortLabel)) {
      seen.add(cfg.shortLabel);
      list.push(cfg);
    }
  }
  return list;
};

export interface Player {
  id: string;
  number: number;
  name: string;
  avatar?: string;
  stamina: number | null; // Thể lực (0-10)
  attack: number | null;  // Tấn công (0-10)
  defense: number | null; // Phòng thủ (0-10)
  positions?: PositionTag[]; // Tag vị trí thi đấu (GK, FI, AL, PI)
  notes?: string; // Ghi chú đặc điểm riêng cho từng cầu thủ
}

export type PositionRole = 'GOALKEEPER' | 'FIXO' | 'ALA_LEFT' | 'ALA_RIGHT' | 'PIVOT';

export interface PositionSlot {
  id: string;
  role: PositionRole;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  playerId: string | null;
  subPlayerIds?: string[]; // Up to 5 substitute player IDs assigned to this position
}

export interface FormationPreset {
  id: string;
  name: string;
  subName: string;
  schema: string;
  positions: Array<{
    role: PositionRole;
    label: string;
    x: number;
    y: number;
  }>;
}

export type AttackDirection = 'right' | 'left';

export interface TacticalSquad {
  id: string;
  formationId: string;
  slots: PositionSlot[];
  notes: string;
  attackDirection?: AttackDirection;
  updatedAt: string;
}

export type DrawTool = 'select' | 'arrow' | 'dashed-arrow' | 'curve' | 'player-home' | 'player-away' | 'circle-red' | 'circle-blue' | 'cross-red' | 'pointer' | 'text' | 'ball' | 'eraser';

export interface DrawShape {
  id: string;
  tool: DrawTool;
  points: Array<{ x: number; y: number }>;
  color: string;
  text?: string;
  number?: number;
  size?: number;
}

export interface SavedTacticalDiagram {
  id: string;
  name: string;
  shapes: DrawShape[];
  updatedAt: string;
}
