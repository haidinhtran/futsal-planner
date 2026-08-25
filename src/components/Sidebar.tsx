import React from "react";
import { Users, Layout, PenTool, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarLogo } from "./Sidebar/SidebarLogo";

interface SidebarProps {
  activeTab: "tactics" | "players" | "presentation" | "settings";
  setActiveTab: (tab: "tactics" | "players" | "presentation" | "settings") => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const isExpanded = !isCollapsed;

  const renderNavItem = (
    id: "tactics" | "players" | "presentation" | "settings",
    label: string,
    IconComponent: React.ComponentType<any>,
  ) => {
    const isActive = activeTab === id;

    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center rounded-lg text-sm transition-all cursor-pointer group ${
          isActive
            ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
            : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-200/80"
        }`}
        title={!isExpanded ? label : undefined}
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
            isActive ? "text-white bg-transparent" : "bg-transparent text-slate-500 group-hover:text-blue-700"
          }`}
        >
          <IconComponent className="w-4 h-4" />
        </div>
        <span
          className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
            isExpanded ? "opacity-100 max-w-xs ml-2 pr-3" : "opacity-0 max-w-0 ml-0 pointer-events-none"
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-16"
      } fixed top-0 bottom-0 left-0 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-4 select-none transition-all duration-200 overflow-y-auto overflow-x-hidden`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className={`fixed top-5 w-6 h-6 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-md rounded-full flex items-center justify-center transition-all z-50 cursor-pointer ${
          isExpanded ? "left-64 -ml-3" : "left-16 -ml-3"
        }`}
        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-6">
        <SidebarLogo isExpanded={isExpanded} />
        <nav className="space-y-1.5 px-3">
          {renderNavItem("tactics", "Quản Lý Đội Hình", Layout)}
          {renderNavItem("players", "Quản Lý Cầu Thủ", Users)}
          {renderNavItem("presentation", "Mô Phỏng Chiến Thuật", PenTool)}
        </nav>
      </div>

      <div className="pt-3 border-t border-slate-200 px-3">
        <nav className="space-y-1.5">
          {renderNavItem("settings", "Cài đặt hệ thống", Settings)}
        </nav>
      </div>
    </aside>
  );
};
