import React, { useRef, useState, useEffect } from "react";
import type { Player } from "@/types/futsal";
import type { DiagramControlsData } from "./TopBar";

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
  onRegisterControls?: (controls: DiagramControlsData) => void;
}

export const TacticalDiagram: React.FC<TacticalDiagramProps> = ({
  players: initialPlayers,
  dataRefreshToken,
  onRegisterControls,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState<boolean>(true);

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const state = useDiagramState(initialPlayers, dataRefreshToken, canvasRef);

  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        onSaveDiagram: state.handleSaveDiagram,
        onLoadDiagram: state.handleLoadDiagram,
        onNewDiagram: state.handleNewDiagram,
      });
    }
  }, [
    onRegisterControls,
    state.handleSaveDiagram,
    state.handleLoadDiagram,
    state.handleNewDiagram,
  ]);

  return (
    <div className="w-full max-w-[1920px] mx-auto layout-page-container layout-section">
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
