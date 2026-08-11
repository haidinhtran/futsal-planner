import React from 'react';
import { formatPlayerStat, getStatBarWidth } from '../../utils/formatters';

export interface StatBarProps {
  label: string;
  value: number | null | undefined;
  colorClass: string;
  dotColorClass: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  colorClass,
  dotColorClass,
}) => {
  return (
    <div className="flex items-center space-x-2 text-xs font-semibold">
      <div className="flex items-center space-x-1 w-22 text-slate-700">
        <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
        <span>{label}</span>
      </div>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-300`}
          style={{ width: getStatBarWidth(value) }}
        ></div>
      </div>
      <span className="w-7 text-right font-bold text-slate-800">
        {formatPlayerStat(value)}
      </span>
    </div>
  );
};
