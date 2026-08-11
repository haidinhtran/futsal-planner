import type { Player } from '../types/futsal';
import { FORMATION_PRESETS } from '../constants/formations';

export { FORMATION_PRESETS };

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
