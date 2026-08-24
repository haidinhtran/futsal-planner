import React, { useRef } from "react";
import {
  ArrowRight,
  XCircle,
  Pointer,
  Trash2,
  Undo2,
  Type,
  UserCheck,
  UserX,
  Move,
  Eraser,
  Layers,
  ChevronUp,
  ChevronDown,
  Maximize,
  Minimize,
  GripVertical,
} from "lucide-react";
import type { DrawTool } from "@/types/futsal";
import { useDraggable } from "@/hooks/useDraggable";

interface ToolbarProps {
  activeTool: DrawTool;
  setActiveTool: (tool: DrawTool) => void;
  shapesCount: number;
  showLayerPanel: boolean;
  setShowLayerPanel: (show: boolean) => void;
  handleUndo: () => void;
  handleClearAll: () => void;
  loadPresetRun: (presetType: "side" | "pivot" | "defense") => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isToolbarExpanded: boolean;
  setIsToolbarExpanded: (expanded: boolean) => void;
  containerRef: React.RefObject<HTMLElement | null>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  shapesCount,
  showLayerPanel,
  setShowLayerPanel,
  handleUndo,
  handleClearAll,
  loadPresetRun,
  isFullscreen,
  toggleFullscreen,
  isToolbarExpanded,
  setIsToolbarExpanded,
  containerRef,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { pos, handleDragStart } = useDraggable(containerRef, toolbarRef, isFullscreen, isToolbarExpanded);

  return (
    <div
      ref={toolbarRef}
      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 flex items-start justify-end pointer-events-none gap-2 max-w-[calc(100%-1rem)]"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      {isToolbarExpanded ? (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg p-1.5 flex items-center gap-1.5 text-slate-800 max-w-full overflow-x-auto animate-in fade-in zoom-in-95 duration-150 select-none">
          <div
            onPointerDown={handleDragStart}
            className="h-9 p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 flex items-center justify-center shrink-0"
            title="Kéo thả để di chuyển thanh công cụ"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <button
            onClick={() => setActiveTool("select")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "select"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Chọn & Kéo thả di chuyển đối tượng"
          >
            <Move className={`w-4 h-4 ${activeTool === "select" ? "text-white" : "text-slate-600"}`} />
          </button>

          <button
            onClick={() => setActiveTool("pointer")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "pointer"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Laser Con Trỏ Thuyết Trình"
          >
            <Pointer className={`w-4 h-4 ${activeTool === "pointer" ? "text-white" : "text-amber-500"}`} />
          </button>

          <button
            onClick={() => setActiveTool("arrow")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "arrow"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Mũi tên di chuyển"
          >
            <ArrowRight className={`w-4 h-4 ${activeTool === "arrow" ? "text-white" : "text-blue-500"}`} />
          </button>

          <button
            onClick={() => setActiveTool("dashed-arrow")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "dashed-arrow"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Mũi tên đường chuyền bóng (nét đứt)"
          >
            <span className={`font-mono text-xs font-black ${activeTool === "dashed-arrow" ? "text-white" : "text-blue-600"}`}>
              --➔
            </span>
          </button>

          <button
            onClick={() => setActiveTool("player-home")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "player-home"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Đặt vị trí Cầu Thủ Ta"
          >
            <UserCheck className={`w-4 h-4 ${activeTool === "player-home" ? "text-white" : "text-sky-600"}`} />
          </button>

          <button
            onClick={() => setActiveTool("player-away")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "player-away"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Đặt vị trí Cầu Thủ Địch"
          >
            <UserX className={`w-4 h-4 ${activeTool === "player-away" ? "text-white" : "text-red-500"}`} />
          </button>

          <button
            onClick={() => setActiveTool("cross-red")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "cross-red"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Dấu gạch chéo đỏ"
          >
            <XCircle className={`w-4 h-4 ${activeTool === "cross-red" ? "text-white" : "text-red-500"}`} />
          </button>

          <button
            onClick={() => setActiveTool("ball")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "ball"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Đặt Bóng Futsal"
          >
            <span className="text-xs">⚽</span>
          </button>

          <button
            onClick={() => setActiveTool("text")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "text"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Thêm ghi chú văn bản"
          >
            <Type className={`w-4 h-4 ${activeTool === "text" ? "text-white" : "text-slate-600"}`} />
          </button>

          <button
            onClick={() => setActiveTool("eraser")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              activeTool === "eraser"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Cục Tẩy"
          >
            <Eraser className={`w-4 h-4 ${activeTool === "eraser" ? "text-white" : "text-amber-600"}`} />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block shrink-0"></div>

          <select
            onChange={(e) => {
              if (e.target.value) {
                loadPresetRun(e.target.value as "side" | "pivot" | "defense");
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="h-9 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors shadow-2xs shrink-0"
            title="Nạp mẫu bài đánh chiến thuật"
          >
            <option value="" disabled>-- Mẫu bài --</option>
            <option value="side">🏃 Chạy biên</option>
            <option value="pivot">🛡️ Đè Pivot</option>
            <option value="defense">🔄 Bọc lót</option>
          </select>

          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`h-9 flex items-center space-x-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border shrink-0 ${
              showLayerPanel
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"
            }`}
            title="Quản Lý Lớp Đối Tượng"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lớp ({shapesCount})</span>
          </button>

          <button
            onClick={handleUndo}
            className="w-9 h-9 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Hoàn tác (Undo)"
          >
            <Undo2 className="w-3.5 h-3.5 text-slate-600" />
          </button>

          <button
            onClick={handleClearAll}
            className="w-9 h-9 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Xóa tất cả hình vẽ trên sa bàn"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-0.5 shrink-0"></div>

          <button
            onClick={toggleFullscreen}
            className="h-9 flex items-center space-x-1.5 px-3 rounded-lg text-xs font-extrabold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all cursor-pointer shadow-2xs shrink-0"
            title={isFullscreen ? "Thoát Chế Độ Toàn Màn Hình (ESC)" : "Toàn Màn Hình"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-slate-600" /> : <Maximize className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isFullscreen ? "Thoát Chế Độ Toàn Màn Hình" : "Toàn Màn Hình"}</span>
          </button>

          <button
            onClick={() => setIsToolbarExpanded(false)}
            className="w-9 h-9 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center shrink-0 ml-auto"
            title="Thu gọn thanh công cụ"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg p-1.5 flex items-center gap-1.5 text-slate-800 animate-in fade-in zoom-in-95 duration-150 select-none">
          <div
            onPointerDown={handleDragStart}
            className="h-9 p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 flex items-center justify-center shrink-0"
            title="Kéo thả để di chuyển thanh công cụ"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <button
            onClick={toggleFullscreen}
            className="h-9 flex items-center space-x-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-2xs shrink-0"
            title={isFullscreen ? "Thoát Chế Độ Toàn Màn Hình" : "Toàn Màn Hình"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-slate-600" /> : <Maximize className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isFullscreen ? "Thoát Chế Độ Toàn Màn Hình" : "Toàn Màn Hình"}</span>
          </button>

          <button
            onClick={() => setIsToolbarExpanded(true)}
            className="h-9 flex items-center space-x-1 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
            title="Mở rộng thanh công cụ"
          >
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            <span>Công cụ</span>
          </button>
        </div>
      )}
    </div>
  );
};
