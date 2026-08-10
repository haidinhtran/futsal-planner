export type PositionTag = 'GK' | 'FI' | 'AL_L' | 'AL_R' | 'PI';

export const POSITION_TAG_CONFIG: Record<
  string,
  { shortLabel: string; fullLabel: string; bgClass: string; textClass: string; borderClass: string }
> = {
  GK: { shortLabel: 'GK', fullLabel: 'Thủ Môn', bgClass: 'bg-emerald-100', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' },
  FI: { shortLabel: 'FI', fullLabel: 'Hậu Vệ', bgClass: 'bg-purple-100', textClass: 'text-purple-800', borderClass: 'border-purple-200' },
  AL_L: { shortLabel: 'AL_L', fullLabel: 'Tiền Vệ Cánh Trái', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
  AL_R: { shortLabel: 'AL_R', fullLabel: 'Tiền Vệ Cánh Phải', bgClass: 'bg-indigo-100', textClass: 'text-indigo-800', borderClass: 'border-indigo-200' },
  PI: { shortLabel: 'PI', fullLabel: 'Tiền Đạo', bgClass: 'bg-amber-100', textClass: 'text-amber-800', borderClass: 'border-amber-200' },
  // Backward compatibility alias for legacy 'AL' tag saved in browser localStorage
  AL: { shortLabel: 'AL', fullLabel: 'Tiền Vệ Cánh', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
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
