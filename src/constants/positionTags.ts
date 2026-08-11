export type PositionTag = 'GK' | 'FI' | 'AL_L' | 'AL_R' | 'PI' | 'AL';

export interface PositionConfig {
  shortLabel: string;
  fullLabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const POSITION_TAG_CONFIG: Record<string, PositionConfig> = {
  GK: { shortLabel: 'GK', fullLabel: 'Thủ Môn', bgClass: 'bg-emerald-100', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' },
  FI: { shortLabel: 'FI', fullLabel: 'Hậu Vệ', bgClass: 'bg-purple-100', textClass: 'text-purple-800', borderClass: 'border-purple-200' },
  AL_L: { shortLabel: 'AL_L', fullLabel: 'Tiền Vệ Cánh Trái', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
  AL_R: { shortLabel: 'AL_R', fullLabel: 'Tiền Vệ Cánh Phải', bgClass: 'bg-indigo-100', textClass: 'text-indigo-800', borderClass: 'border-indigo-200' },
  PI: { shortLabel: 'PI', fullLabel: 'Tiền Đạo', bgClass: 'bg-amber-100', textClass: 'text-amber-800', borderClass: 'border-amber-200' },
  // Backward compatibility alias for legacy 'AL' tag saved in browser localStorage
  AL: { shortLabel: 'AL', fullLabel: 'Tiền Vệ Cánh', bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-200' },
};

export const getPositionConfig = (pos: string): PositionConfig => {
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
