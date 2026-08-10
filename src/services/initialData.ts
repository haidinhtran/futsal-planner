import type { Player, FormationPreset } from '../types/futsal';

export const INITIAL_PLAYERS: Player[] = [
  { id: '1', number: 1, name: 'Hồ Đắc Thạnh', stamina: 6, attack: 6, defense: 9, positions: ['GK', 'FI', 'AL'] },
  { id: '2', number: 2, name: 'Huỳnh Tấn Phong', stamina: 8, attack: 7, defense: 7.5, positions: ['AL', 'PI', 'FI'], notes: 'Dễ Cọc' },
  { id: '3', number: 3, name: 'Mai Thanh', stamina: 6, attack: 7.5, defense: 6.5, positions: ['GK', 'FI'], notes: 'Dễ thiếu tập trung' },
  { id: '4', number: 4, name: 'Ngô Thái Tuấn', stamina: 8.5, attack: 8.5, defense: 7.5, positions: ['GK', 'AL', 'PI', 'FI'] },
  { id: '5', number: 5, name: 'Nguyễn Bình An', stamina: 6.5, attack: 7, defense: 6.5, positions: ['PI', 'AL'] },
  { id: '6', number: 6, name: 'Nguyễn Cao Tấn', stamina: 7.5, attack: 9, defense: 6, positions: ['PI', 'AL'], notes: 'Dễ Tâm Lý' },
  { id: '7', number: 7, name: 'Nguyen Minh Tan', stamina: null, attack: null, defense: null, positions: [] },
  { id: '8', number: 8, name: 'Nguyễn Tiến Đạt', stamina: 7, attack: 6, defense: 6, positions: ['GK', 'FI', 'AL', 'PI'] },
  { id: '9', number: 9, name: 'Phạm Hữu Thành', stamina: 5, attack: 6, defense: 6, positions: ['GK', 'FI', 'AL'], notes: 'Mau mệt' },
  { id: '10', number: 10, name: 'Trần Hoàng Hiệp', stamina: 10, attack: null, defense: null, positions: ['AL'], notes: 'Thể Lực Phi Thường' },
  { id: '11', number: 11, name: 'Vo Hoang Ha', stamina: null, attack: null, defense: null, positions: ['AL', 'PI'] },
  { id: '12', number: 12, name: 'Vũ Đức Mạnh', stamina: 9, attack: null, defense: null, positions: ['PI'] },
  { id: '13', number: 13, name: 'Vũ Trọng Phúc', stamina: 7.5, attack: 6, defense: 7, positions: ['GK', 'FI'], notes: '666' },
  { id: '14', number: 14, name: 'Vo Tien Phat', stamina: null, attack: null, defense: null, positions: ['PI', 'AL'] },
];

export const FORMATION_PRESETS: FormationPreset[] = [
  {
    id: '4-0',
    name: '4-0',
    subName: 'Power Play',
    schema: '1-4-0 (Tứ giác rộng)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN', x: 10, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ DƯỚI TRÁI', x: 42, y: 25 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ DƯỚI PHẢI', x: 42, y: 75 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ TRÊN TRÁI', x: 75, y: 25 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ TRÊN PHẢI', x: 75, y: 75 },
    ],
  },
  {
    id: '3-1',
    name: '3-1',
    subName: 'Chuẩn',
    schema: '1-1-2 (Kim Cương)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ', x: 35, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ TRÁI', x: 65, y: 22 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ PHẢI', x: 65, y: 78 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO', x: 82, y: 50 },
    ],
  },
  {
    id: '2-2',
    name: '2-2',
    subName: 'Cân bằng',
    schema: '1-2-2 (Hình Vuông)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ TRÁI', x: 40, y: 30 },
      { role: 'FIXO', label: 'HẬU VỆ PHẢI', x: 40, y: 70 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO TRÁI', x: 78, y: 30 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO PHẢI', x: 78, y: 70 },
    ],
  },
  {
    id: '1-2-1',
    name: '1-2-1',
    subName: 'Phòng ngự',
    schema: '1-1-2-1 (Cụm Phòng Tháp)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ', x: 28, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ TRÁI', x: 50, y: 25 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ PHẢI', x: 50, y: 75 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO', x: 72, y: 50 },
    ],
  },
  {
    id: '1-3',
    name: '1-3',
    subName: 'Tấn công',
    schema: '1-1-3 (Tam giác dâng cao)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ', x: 35, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ TRÁI', x: 72, y: 20 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ PHẢI', x: 72, y: 80 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO', x: 84, y: 50 },
    ],
  },
  {
    id: '0-4',
    name: '0-4',
    subName: 'Siêu tấn công',
    schema: '0-4 (Tổng lực Power Play)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN (DÂNG)', x: 22, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ DƯỚI', x: 55, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ TRÁI', x: 80, y: 20 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ PHẢI', x: 80, y: 80 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO', x: 85, y: 50 },
    ],
  },
];

export const INITIAL_TACTICAL_SQUAD = {
  formationId: '4-0',
  slots: [
    { id: 'slot-0', role: 'GOALKEEPER' as const, label: 'THỦ MÔN', x: 10, y: 50, playerId: '13' },
    { id: 'slot-1', role: 'ALA_LEFT' as const, label: 'TIỀN VỆ DƯỚI TRÁI', x: 42, y: 25, playerId: '1' },
    { id: 'slot-2', role: 'ALA_RIGHT' as const, label: 'TIỀN VỆ DƯỚI PHẢI', x: 42, y: 75, playerId: '2' },
    { id: 'slot-3', role: 'ALA_LEFT' as const, label: 'TIỀN VỆ TRÊN TRÁI', x: 75, y: 25, playerId: '4' },
    { id: 'slot-4', role: 'ALA_RIGHT' as const, label: 'TIỀN VỆ TRÊN PHẢI', x: 75, y: 75, playerId: '6' },
  ],
  notes: '',
};
