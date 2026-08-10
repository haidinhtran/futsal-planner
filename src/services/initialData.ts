import type { Player, FormationPreset } from '../types/futsal';

export const INITIAL_PLAYERS: Player[] = [];

export const FORMATION_PRESETS: FormationPreset[] = [
  {
    id: '4-0',
    name: '4-0',
    subName: 'Power Play',
    schema: '1-4-0 (Tứ giác rộng)',
    positions: [
      { role: 'GOALKEEPER', label: 'GOALKEEPER', x: 10, y: 50 },
      { role: 'FIXO', label: 'ALA DƯỚI TRÁI', x: 42, y: 25 },
      { role: 'FIXO', label: 'ALA DƯỚI PHẢI', x: 42, y: 75 },
      { role: 'ALA_LEFT', label: 'ALA TRÊN TRÁI', x: 75, y: 25 },
      { role: 'ALA_RIGHT', label: 'ALA TRÊN PHẢI', x: 75, y: 75 },
    ],
  },
  {
    id: '3-1',
    name: '3-1',
    subName: 'Chuẩn',
    schema: '1-1-2 (Kim Cương)',
    positions: [
      { role: 'GOALKEEPER', label: 'GOALKEEPER', x: 10, y: 50 },
      { role: 'FIXO', label: 'FIXO', x: 35, y: 50 },
      { role: 'ALA_LEFT', label: 'ALA TRÁI', x: 65, y: 22 },
      { role: 'ALA_RIGHT', label: 'ALA PHẢI', x: 65, y: 78 },
      { role: 'PIVOT', label: 'PIVOT', x: 82, y: 50 },
    ],
  },
  {
    id: '2-2',
    name: '2-2',
    subName: 'Cân bằng',
    schema: '1-2-2 (Hình Vuông)',
    positions: [
      { role: 'GOALKEEPER', label: 'GOALKEEPER', x: 10, y: 50 },
      { role: 'FIXO', label: 'FIXO TRÁI', x: 40, y: 30 },
      { role: 'FIXO', label: 'FIXO PHẢI', x: 40, y: 70 },
      { role: 'PIVOT', label: 'PIVOT TRÁI', x: 78, y: 30 },
      { role: 'PIVOT', label: 'PIVOT PHẢI', x: 78, y: 70 },
    ],
  },
  {
    id: '1-2-1',
    name: '1-2-1',
    subName: 'Phòng ngự',
    schema: '1-1-2-1 (Cụm Phòng Tháp)',
    positions: [
      { role: 'GOALKEEPER', label: 'GOALKEEPER', x: 10, y: 50 },
      { role: 'FIXO', label: 'FIXO', x: 28, y: 50 },
      { role: 'ALA_LEFT', label: 'ALA TRÁI', x: 50, y: 25 },
      { role: 'ALA_RIGHT', label: 'ALA PHẢI', x: 50, y: 75 },
      { role: 'PIVOT', label: 'PIVOT', x: 72, y: 50 },
    ],
  },
  {
    id: '1-3',
    name: '1-3',
    subName: 'Tấn công',
    schema: '1-1-3 (Tam giác dâng cao)',
    positions: [
      { role: 'GOALKEEPER', label: 'GOALKEEPER', x: 10, y: 50 },
      { role: 'FIXO', label: 'FIXO', x: 35, y: 50 },
      { role: 'ALA_LEFT', label: 'ALA TRÁI', x: 72, y: 20 },
      { role: 'PIVOT', label: 'PIVOT', x: 84, y: 50 },
      { role: 'ALA_RIGHT', label: 'ALA PHẢI', x: 72, y: 80 },
    ],
  },
  {
    id: '0-4',
    name: '0-4',
    subName: 'Siêu tấn công',
    schema: '0-4 (Tổng lực Power Play)',
    positions: [
      { role: 'FIXO', label: 'GOALKEEPER (DÂNG)', x: 22, y: 50 },
      { role: 'FIXO', label: 'ALA DƯỚI', x: 55, y: 50 },
      { role: 'ALA_LEFT', label: 'ALA TRÁI', x: 80, y: 20 },
      { role: 'PIVOT', label: 'PIVOT', x: 85, y: 50 },
      { role: 'ALA_RIGHT', label: 'ALA PHẢI', x: 80, y: 80 },
    ],
  },
];

export const INITIAL_TACTICAL_SQUAD = {
  formationId: '4-0',
  slots: [
    { id: 'slot-0', role: 'GOALKEEPER' as const, label: 'GOALKEEPER', x: 10, y: 50, playerId: null },
    { id: 'slot-1', role: 'FIXO' as const, label: 'ALA DƯỚI TRÁI', x: 42, y: 25, playerId: null },
    { id: 'slot-2', role: 'FIXO' as const, label: 'ALA DƯỚI PHẢI', x: 42, y: 75, playerId: null },
    { id: 'slot-3', role: 'ALA_LEFT' as const, label: 'ALA TRÊN TRÁI', x: 75, y: 25, playerId: null },
    { id: 'slot-4', role: 'ALA_RIGHT' as const, label: 'ALA TRÊN PHẢI', x: 75, y: 75, playerId: null },
  ],
  notes: '',
};
