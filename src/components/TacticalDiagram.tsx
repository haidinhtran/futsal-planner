import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Player } from "@/types/futsal";
import { FilePlus, Save, Sparkles, FolderOpen, Trash2 } from "lucide-react";

import { useFullscreen } from "@/hooks/useFullscreen";
import { useDiagramState } from "@/hooks/useDiagramState";

import { Header } from "./TacticalDiagram/Header";
import { Toolbar } from "./TacticalDiagram/Toolbar";
import { LayerPanel } from "./TacticalDiagram/LayerPanel";
import { CanvasArea } from "./TacticalDiagram/CanvasArea";
import { PlayerModal } from "./TacticalDiagram/PlayerModal";

interface TacticalDiagramProps {
  players?: Player[];
  dataRefreshToken?: number;
}

export const TacticalDiagram: React.FC<TacticalDiagramProps> = ({
  players: initialPlayers,
  dataRefreshToken,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState<boolean>(true);

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const state = useDiagramState(initialPlayers, dataRefreshToken, canvasRef);

  return (
    <div className="w-full max-w-[1920px] mx-auto layout-page-container pb-6 md:pb-8">
      {/* Desktop Always-Visible Portal */}
      {document.getElementById('topbar-actions-portal') && !isFullscreen && createPortal(
        <div className="hidden md:flex items-center justify-end gap-1.5 sm:gap-2 w-full">
          {/* Tên Bản Vẽ - Thu gọn chiều dài */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-300 px-2 h-[38px] rounded-lg text-sm font-medium shadow-sm max-w-[140px] lg:max-w-[180px]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-extrabold text-slate-800 truncate" title={state.diagramName}>
              {state.diagramName}
            </span>
            {state.isDirty ? (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" title="Chưa lưu" />
            ) : state.currentDiagramId ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Đã lưu" />
            ) : null}
          </div>

          {/* Chọn Bản Vẽ Đã Lưu - Thu gọn */}
          <div className="relative flex items-center bg-white border border-slate-300 rounded-lg px-2 h-[38px] text-sm w-[140px] lg:w-[180px] shadow-sm">
            <FolderOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={state.currentDiagramId || ""}
              onChange={(e) => state.handleLoadDiagram(e.target.value)}
              className="bg-transparent font-extrabold focus:outline-none cursor-pointer text-slate-800 text-xs w-full min-w-0 pr-4 appearance-none"
            >
              <option value="">-- Bản vẽ đã lưu --</option>
              {state.savedDiagrams.map((d) => (
                <option key={d.id} value={d.id} title={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <span className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Delete Diagram Button (Icon Only) */}
          {state.currentDiagramId && (
            <button
              onClick={state.handleDeleteCurrentDiagram}
              className="btn-outline-danger !px-2 md:!px-2.5 h-[38px] bg-white"
              title="Xóa bản vẽ này"
            >
              <Trash2 className="btn-icon" />
            </button>
          )}

          {/* Bản vẽ mới (Icon Only) */}
          <button onClick={state.handleNewDiagram} className="btn-outline !px-2 md:!px-2.5 h-[38px]" title="Bản vẽ mới">
            <FilePlus className="btn-icon text-blue-600" />
          </button>

          <button onClick={state.handleSaveDiagram} className="btn-primary h-[38px]" title="Lưu bản vẽ">
            <Save className="btn-icon" />
            <span className="btn-label">Lưu bản vẽ</span>
          </button>
        </div>,
        document.getElementById('topbar-actions-portal')!
      )}

      {/* Primary Action Row - Hidden on Desktop, Visible on Mobile */}
      {!isFullscreen && (
        <div className="md:hidden flex items-center justify-end gap-3 mb-3">
          <button onClick={state.handleNewDiagram} className="btn-outline flex-1 justify-center py-2.5 text-sm">
            <FilePlus className="w-4 h-4 text-blue-600 mr-1.5" />
            <span>Bản vẽ mới</span>
          </button>
          <button onClick={state.handleSaveDiagram} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Lưu bản vẽ</span>
          </button>
        </div>
      )}

      <Header
        isFullscreen={isFullscreen}
        diagramName={state.diagramName}
        isDirty={state.isDirty}
        currentDiagramId={state.currentDiagramId}
        savedDiagrams={state.savedDiagrams}
        onSaveDiagram={state.handleSaveDiagram}
        onLoadDiagram={state.handleLoadDiagram}
        onDeleteCurrentDiagram={state.handleDeleteCurrentDiagram}
      />

      <div
        className={`futsal-pitch-container w-full relative ${isFullscreen ? "is-fullscreen" : ""}`}
        ref={containerRef}
      >
        <Toolbar
          activeTool={state.activeTool}
          setActiveTool={state.setActiveTool}
          shapesCount={state.shapes.length}
          showLayerPanel={state.showLayerPanel}
          setShowLayerPanel={state.setShowLayerPanel}
          handleUndo={state.handleUndo}
          handleClearAll={state.handleClearAll}
          loadPresetRun={state.loadPresetRun}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isToolbarExpanded={isToolbarExpanded}
          setIsToolbarExpanded={setIsToolbarExpanded}
          containerRef={containerRef}
        />

        <div className="futsal-pitch-floor relative overflow-hidden min-h-[480px]">
          <div className="pitch-line pitch-center-line"></div>
          <div className="pitch-line pitch-center-circle"></div>
          <div className="pitch-line pitch-center-spot"></div>
          <div className="pitch-line pitch-penalty-left"></div>
          <div className="pitch-line pitch-penalty-right"></div>
          <div className="pitch-line pitch-penalty-spot-left"></div>
          <div className="pitch-line pitch-penalty-spot-right"></div>
          <div className="pitch-line pitch-corner-tl"></div>
          <div className="pitch-line pitch-corner-tr"></div>
          <div className="pitch-line pitch-corner-bl"></div>
          <div className="pitch-line pitch-corner-br"></div>
          <div className="pitch-goal-left"></div>
          <div className="pitch-goal-right"></div>

          <CanvasArea
            canvasRef={canvasRef}
            activeTool={state.activeTool}
            shapes={state.shapes}
            sortedShapes={state.sortedShapes}
            selectedShapeId={state.selectedShapeId}
            isDrawing={state.isDrawing}
            currentPoints={state.currentPoints}
            laserPos={state.laserPos}
            handleCanvasMouseDown={state.handleCanvasMouseDown}
            handleCanvasMouseMove={state.handleCanvasMouseMove}
            handleCanvasMouseUp={state.handleCanvasMouseUp}
            handleCanvasTouchStart={state.handleCanvasTouchStart}
            handleCanvasTouchMove={state.handleCanvasTouchMove}
            handleCanvasTouchEnd={state.handleCanvasTouchEnd}
            handleShapeStart={state.handleShapeStart}
            setEditingShapeId={state.setEditingShapeId}
            setShowPlayerModal={state.setShowPlayerModal}
            handleDeleteSingleShape={state.handleDeleteSingleShape}
          />
        </div>

        <PlayerModal
          showPlayerModal={state.showPlayerModal}
          teamPlayers={state.teamPlayers}
          shapes={state.shapes}
          onClose={() => {
            state.setShowPlayerModal(false);
            state.setEditingShapeId(null);
          }}
          onSelectPlayer={state.handleSelectPlayerForShape}
        />

        <LayerPanel
          showLayerPanel={state.showLayerPanel}
          shapes={state.shapes}
          selectedShapeId={state.selectedShapeId}
          onClose={() => state.setShowLayerPanel(false)}
          onSelectShape={state.setSelectedShapeId}
          onMoveLayerUp={state.handleMoveLayerUp}
          onMoveLayerDown={state.handleMoveLayerDown}
          onDeleteShape={state.handleDeleteSingleShape}
        />
      </div>
    </div>
  );
};
