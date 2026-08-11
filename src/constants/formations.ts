import type { FormationPreset } from '../types/futsal';

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
