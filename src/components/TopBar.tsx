import React from "react";

interface TopBarProps {
  activeTab: "tactics" | "players" | "presentation" | "settings";
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab }) => {
  const getTabMeta = () => {
    switch (activeTab) {
      case "tactics":
        return {
          title: "Đội hình",
          subtitle: "",
        };
      case "players":
        return {
          title: "Cầu thủ",
          subtitle: "",
        };
      case "presentation":
        return {
          title: "Mô phỏng",
          subtitle: "",
        };
      case "settings":
        return {
          title: "Cài đặt",
          subtitle: "",
        };
    }
  };

  const meta = getTabMeta();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 layout-page-container py-2.5 flex items-center select-none shrink-0 min-h-[61px]">
      {/* Title & Subtitle */}
      <div className="flex items-center space-x-2.5">
        <span className="w-3 h-3 bg-blue-600 rounded-xs shrink-0"></span>
        <div>
          <h2 className="text-h2 text-slate-900 leading-tight">
            {meta.title}
          </h2>
          {meta.subtitle ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-500 hidden xl:block">
              {meta.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* Portal Target for Compact Actions */}
      <div id="topbar-actions-portal" className="flex items-center justify-end flex-1 gap-1.5 sm:gap-2 ml-auto"></div>
    </header>
  );
};
