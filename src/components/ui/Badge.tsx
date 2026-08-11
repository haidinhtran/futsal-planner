import React from 'react';
import { getPositionConfig } from '../../constants/positionTags';

export interface BadgeProps {
  positionTag?: string;
  label?: string;
  variant?: 'custom' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  positionTag,
  label,
  variant = 'custom',
  size = 'sm',
}) => {
  if (positionTag) {
    const cfg = getPositionConfig(positionTag);
    return (
      <span
        className={`font-black rounded-md border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ${
          size === 'xs' ? 'text-[9px] px-1 py-0.2' : size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        }`}
      >
        {cfg.fullLabel}
      </span>
    );
  }

  const variantStyles = {
    custom: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`font-black rounded-md border ${variantStyles[variant]} ${
        size === 'xs' ? 'text-[9px] px-1 py-0.2' : size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      {label}
    </span>
  );
};
