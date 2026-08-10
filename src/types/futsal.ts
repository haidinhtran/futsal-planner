export interface Player {
  id: string;
  number: number;
  name: string;
  avatar?: string;
  stamina: number | null; // TL - Thể lực (0-10)
  attack: number | null;  // TC - Tấn công (0-10)
  defense: number | null; // PT - Phòng thủ (0-10)
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
