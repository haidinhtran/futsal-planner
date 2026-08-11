import type { PositionTag, PositionConfig } from '../constants/positionTags';

export type { PositionTag, PositionConfig };
export { POSITION_TAG_CONFIG, getPositionConfig } from '../constants/positionTags';

export interface Player {
  id: string;
  number: number;
  name: string;
  avatar?: string;
  stamina: number | null; // Thể lực (0-10)
  attack: number | null;  // Tấn công (0-10)
  defense: number | null; // Phòng thủ (0-10)
  positions?: PositionTag[]; // Tag vị trí thi đấu (GK, FI, AL_L, AL_R, PI)
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

export type AttackDirection = 'right' | 'left';

export interface TacticalSquad {
  id: string;
  formationId: string;
  slots: PositionSlot[];
  notes: string;
  attackDirection?: AttackDirection;
  updatedAt: string;
}

export type DrawTool =
  | 'select'
  | 'arrow'
  | 'dashed-arrow'
  | 'curve'
  | 'player-home'
  | 'player-away'
  | 'circle-red'
  | 'circle-blue'
  | 'cross-red'
  | 'pointer'
  | 'text'
  | 'ball'
  | 'eraser';

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
