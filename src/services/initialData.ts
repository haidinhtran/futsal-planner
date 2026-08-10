import type { Player, FormationPreset } from '../types/futsal';

export const INITIAL_PLAYERS: Player[] = [
  { id: '1', number: 1, name: 'Hồ Đắc Thạnh', stamina: 6, attack: 6, defense: 9, positions: ['GK', 'FI', 'AL_L'] },
  { id: '2', number: 2, name: 'Huỳnh Tấn Phong', stamina: 8, attack: 7, defense: 7.5, positions: ['AL_R', 'PI', 'FI'], notes: 'Dễ Cọc' },
  { id: '3', number: 3, name: 'Mai Thanh', stamina: 6, attack: 7.5, defense: 6.5, positions: ['GK', 'FI'], notes: 'Dễ thiếu tập trung' },
  { id: '4', number: 4, name: 'Ngô Thái Tuấn', stamina: 8.5, attack: 8.5, defense: 7.5, positions: ['GK', 'AL_L', 'PI', 'FI'] },
  { id: '5', number: 5, name: 'Nguyễn Bình An', stamina: 6.5, attack: 7, defense: 6.5, positions: ['PI', 'AL_R'] },
  { id: '6', number: 6, name: 'Nguyễn Cao Tấn', stamina: 7.5, attack: 9, defense: 6, positions: ['PI', 'AL_L'], notes: 'Dễ Tâm Lý' },
  { id: '7', number: 7, name: 'Nguyen Minh Tan', stamina: null, attack: null, defense: null, positions: [] },
  { id: '8', number: 8, name: 'Nguyễn Tiến Đạt', stamina: 7, attack: 6, defense: 6, positions: ['GK', 'FI', 'AL_R', 'PI'] },
  { id: '9', number: 9, name: 'Phạm Hữu Thành', stamina: 5, attack: 6, defense: 6, positions: ['GK', 'FI', 'AL_L'], notes: 'Mau mệt' },
  { id: '10', number: 10, name: 'Trần Hoàng Hiệp', stamina: 10, attack: null, defense: null, positions: ['AL_R'], notes: 'Thể Lực Phi Thường' },
  { id: '11', number: 11, name: 'Vo Hoang Ha', stamina: null, attack: null, defense: null, positions: ['AL_L', 'PI'] },
  { id: '12', number: 12, name: 'Vũ Đức Mạnh', stamina: 9, attack: null, defense: null, positions: ['PI'] },
  { id: '13', number: 13, name: 'Vũ Trọng Phúc', stamina: 7.5, attack: 6, defense: 7, positions: ['GK', 'FI'], notes: '666' },
  { id: '14', number: 14, name: 'Vo Tien Phat', stamina: null, attack: null, defense: null, positions: ['PI', 'AL_R'] },
];

export const FORMATION_PRESETS: FormationPreset[] = [
  {
    id: '4-0',
    name: '4-0',
    subName: 'Xoay vòng',
    schema: '1-4-0 (Tứ giác xoay vòng)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN (GOALKEEPER)', x: 10, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ CÁNH TRÁI DƯỚI (ALA LEFT)', x: 42, y: 25 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ CÁNH PHẢI DƯỚI (ALA RIGHT)', x: 42, y: 75 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ CÁNH TRÁI TRÊN (ALA LEFT)', x: 75, y: 25 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ CÁNH PHẢI TRÊN (ALA RIGHT)', x: 75, y: 75 },
    ],
  },
  {
    id: '3-1',
    name: '3-1',
    subName: 'Pivot',
    schema: '1-3-1 (Kim Cương Pivot)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN (GOALKEEPER)', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ (FIXO)', x: 35, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ CÁNH TRÁI (ALA LEFT)', x: 65, y: 22 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ CÁNH PHẢI (ALA RIGHT)', x: 65, y: 78 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO (PIVOT)', x: 82, y: 50 },
    ],
  },
  {
    id: '2-2',
    name: '2-2',
    subName: 'Cân bằng',
    schema: '1-2-2 (Hình Vuông Cân Bằng)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN (GOALKEEPER)', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ TRÁI (FIXO LEFT)', x: 40, y: 30 },
      { role: 'FIXO', label: 'HẬU VỆ PHẢI (FIXO RIGHT)', x: 40, y: 70 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO TRÁI (PIVOT LEFT)', x: 78, y: 30 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO PHẢI (PIVOT RIGHT)', x: 78, y: 70 },
    ],
  },
  {
    id: '1-2-1',
    name: '1-2-1',
    subName: 'Kim cương',
    schema: '1-2-1 (Hình Kim Cương)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN (GOALKEEPER)', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ (FIXO)', x: 28, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ CÁNH TRÁI (ALA LEFT)', x: 50, y: 25 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ CÁNH PHẢI (ALA RIGHT)', x: 50, y: 75 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO (PIVOT)', x: 72, y: 50 },
    ],
  },
  {
    id: '1-3',
    name: '1-3',
    subName: 'Tấn công',
    schema: '1-1-3 (Tam giác dâng cao)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN (GOALKEEPER)', x: 10, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ (FIXO)', x: 35, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ CÁNH TRÁI (ALA LEFT)', x: 72, y: 20 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ CÁNH PHẢI (ALA RIGHT)', x: 72, y: 80 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO (PIVOT)', x: 84, y: 50 },
    ],
  },
  {
    id: '0-4',
    name: '0-4',
    subName: 'Power Play',
    schema: '0-4 (Power Play - Đặc biệt)',
    positions: [
      { role: 'GOALKEEPER', label: 'THỦ MÔN DÂNG (GOALKEEPER)', x: 22, y: 50 },
      { role: 'FIXO', label: 'HẬU VỆ DƯỚI (FIXO)', x: 55, y: 50 },
      { role: 'ALA_LEFT', label: 'TIỀN VỆ CÁNH TRÁI (ALA LEFT)', x: 80, y: 20 },
      { role: 'ALA_RIGHT', label: 'TIỀN VỆ CÁNH PHẢI (ALA RIGHT)', x: 80, y: 80 },
      { role: 'PIVOT', label: 'TIỀN ĐẠO (PIVOT)', x: 85, y: 50 },
    ],
  },
];

export const INITIAL_TACTICAL_SQUAD = {
  formationId: '4-0',
  slots: [
    { id: 'slot-0', role: 'GOALKEEPER' as const, label: 'THỦ MÔN (GOALKEEPER)', x: 10, y: 50, playerId: '13' },
    { id: 'slot-1', role: 'ALA_LEFT' as const, label: 'TIỀN VỆ CÁNH TRÁI DƯỚI (ALA LEFT)', x: 42, y: 25, playerId: '1' },
    { id: 'slot-2', role: 'ALA_RIGHT' as const, label: 'TIỀN VỆ CÁNH PHẢI DƯỚI (ALA RIGHT)', x: 42, y: 75, playerId: '2' },
    { id: 'slot-3', role: 'ALA_LEFT' as const, label: 'TIỀN VỆ CÁNH TRÁI TRÊN (ALA LEFT)', x: 75, y: 25, playerId: '4' },
    { id: 'slot-4', role: 'ALA_RIGHT' as const, label: 'TIỀN VỆ CÁNH PHẢI TRÊN (ALA RIGHT)', x: 75, y: 75, playerId: '6' },
  ],
  notes: '',
};
