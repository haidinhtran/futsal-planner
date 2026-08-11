import React from 'react';

interface TeamStatsCardProps {
  teamAverageStats: {
    avgStamina: string;
    avgAttack: string;
    avgDefense: string;
  };
}

export const TeamStatsCard: React.FC<TeamStatsCardProps> = ({ teamAverageStats }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-black text-slate-500 uppercase tracking-wide">
        TỔNG CHỈ SỐ ĐỘI HÌNH (TB 5 CẦU THỦ)
      </h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
          <span className="block text-sm font-bold text-emerald-700">🟢 Thể Lực</span>
          <span className="text-xl font-black text-emerald-700">{teamAverageStats.avgStamina}</span>
        </div>
        <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100">
          <span className="block text-sm font-bold text-orange-700">🟠 Tấn Công</span>
          <span className="text-xl font-black text-orange-700">{teamAverageStats.avgAttack}</span>
        </div>
        <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
          <span className="block text-sm font-bold text-blue-700">🔵 Phòng Thủ</span>
          <span className="text-xl font-black text-blue-700">{teamAverageStats.avgDefense}</span>
        </div>
      </div>
    </div>
  );
};
