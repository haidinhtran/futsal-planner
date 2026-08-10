export type PositionTag = 'GK' | 'FI' | 'AL' | 'PI';

export const POSITION_TAG_CONFIG: Record<
  PositionTag,
  { shortLabel: PositionTag; fullLabel: string; bgClass: string; textClass: string; borderClass: string }
> = {
  GK: { shortLabel: 'GK', fullLabel: 'Thủ môn', bgClass: 'bg-emerald-100', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' },
  FI: { shortLabel: 'FI', fullLabel: 'Hậu vệ', bgClass: 'bg-purple-100', textClass: 'text-purple-800', borderClass: 'border-purple-200' },
  AL: { shortLabel: 'AL', fullLabel: 'Tiền vệ cánh', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
  PI: { shortLabel: 'PI', fullLabel: 'Tiền đạo', bgClass: 'bg-amber-100', textClass: 'text-amber-800', borderClass: 'border-amber-200' },
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

export interface TacticalSquad {
  id: string;
  formationId: string;
  slots: PositionSlot[];
  notes: string;
  updatedAt: string;
}

export type DrawTool = 'arrow' | 'dashed-arrow' | 'curve' | 'player-home' | 'player-away' | 'circle-red' | 'circle-blue' | 'cross-red' | 'pointer' | 'text' | 'ball' | 'eraser';

export interface DrawShape {
  id: string;
  tool: DrawTool;
  points: Array<{ x: number; y: number }>;
  color: string;
  text?: string;
  size?: number;
}
