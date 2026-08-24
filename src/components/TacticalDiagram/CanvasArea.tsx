import React from "react";
import type { DrawShape, DrawTool } from "@/types/futsal";
import { getShapeBounds } from "@/utils/diagramHelpers";

interface CanvasAreaProps {
  canvasRef: React.RefObject<SVGSVGElement | null>;
  activeTool: DrawTool;
  shapes: DrawShape[];
  sortedShapes: DrawShape[];
  selectedShapeId: string | null;
  isDrawing: boolean;
  currentPoints: Array<{ x: number; y: number }>;
  laserPos: { x: number; y: number } | null;
  handleCanvasMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleCanvasMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleCanvasMouseUp: () => void;
  handleCanvasTouchStart: (e: React.TouchEvent<SVGSVGElement>) => void;
  handleCanvasTouchMove: (e: React.TouchEvent<SVGSVGElement>) => void;
  handleCanvasTouchEnd: () => void;
  handleShapeStart: (shapeId: string, pt: { x: number; y: number }, e: React.MouseEvent | React.TouchEvent) => void;
  setEditingShapeId: (id: string | null) => void;
  setShowPlayerModal: (show: boolean) => void;
  handleDeleteSingleShape: (shapeId: string, e?: React.MouseEvent | React.TouchEvent) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  activeTool,
  sortedShapes,
  selectedShapeId,
  isDrawing,
  currentPoints,
  laserPos,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasTouchStart,
  handleCanvasTouchMove,
  handleCanvasTouchEnd,
  handleShapeStart,
  setEditingShapeId,
  setShowPlayerModal,
  handleDeleteSingleShape,
}) => {
  const getRelativeCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Number(Math.max(0, Math.min(100, x)).toFixed(2)),
      y: Number(Math.max(0, Math.min(100, y)).toFixed(2)),
    };
  };

  return (
    <svg
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full z-20 touch-none-canvas ${
        activeTool === "select"
          ? "cursor-default"
          : activeTool === "eraser"
            ? "cursor-pointer"
            : "cursor-crosshair"
      }`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onTouchStart={handleCanvasTouchStart}
      onTouchMove={handleCanvasTouchMove}
      onTouchEnd={handleCanvasTouchEnd}
    >
      <defs>
        <marker id="arrowhead-white" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#ffffff" />
        </marker>
        <marker id="arrowhead-yellow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#facc15" />
        </marker>
        <filter id="laser-neon-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {sortedShapes.map((shape: DrawShape) => {
        const isSelected = selectedShapeId === shape.id;
        const anchorPt = shape.points[0] || { x: 50, y: 50 };
        const shapeBounds = getShapeBounds(shape);
        const bounds = isSelected ? shapeBounds : null;

        return (
          <g
            key={shape.id}
            className={`group ${activeTool === "select" || activeTool === "eraser" ? "cursor-grab active:cursor-grabbing" : ""}`}
            onMouseDown={(e) => {
              const pt = getRelativeCoords(e.clientX, e.clientY);
              handleShapeStart(shape.id, pt, e);
            }}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                const pt = getRelativeCoords(e.touches[0].clientX, e.touches[0].clientY);
                handleShapeStart(shape.id, pt, e);
              }
            }}
            onDoubleClick={() => {
              if (shape.tool === "player-home") {
                setEditingShapeId(shape.id);
                setShowPlayerModal(true);
              }
            }}
          >
            {shape.points.length === 1 && (
              <rect
                x={`${shapeBounds.x}%`}
                y={`${shapeBounds.y}%`}
                width={`${shapeBounds.width}%`}
                height={`${shapeBounds.height}%`}
                fill="rgba(0,0,0,0.001)"
                className="cursor-pointer"
              />
            )}

            {shape.points.length === 1 && (
              <svg x={`${anchorPt.x}%`} y={`${anchorPt.y}%`} overflow="visible" className="pointer-events-none">
                {(shape.tool === "player-home" || shape.tool === "circle-blue") && (
                  <g style={isSelected ? { filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))" } : undefined}>
                    <circle
                      cx="0" cy="0" r="18" fill="#16a34a"
                      stroke={isSelected ? "#facc15" : "#ffffff"}
                      strokeWidth={isSelected ? "4" : "3"}
                      className="drop-shadow-md transition-all"
                    />
                    <text
                      x="0" y="0" fill="#ffffff"
                      fontSize={shape.number !== undefined ? "13" : "12"}
                      fontWeight="900" textAnchor="middle" dominantBaseline="central"
                    >
                      {shape.number !== undefined ? `#${shape.number}` : shape.text || "Ta"}
                    </text>
                    {shape.number !== undefined && shape.text && shape.text !== "Ta" && (
                      <g>
                        <rect x="-36" y="22" width="72" height="18" rx="5" fill="#0f172a" stroke="#ffffff" strokeWidth="1" className="shadow-sm opacity-95" />
                        <text x="0" y="31" fill="#facc15" fontSize="10" fontWeight="900" textAnchor="middle" dominantBaseline="central" className="tracking-tight">
                          {shape.text}
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {(shape.tool === "player-away" || shape.tool === "circle-red") && (
                  <g style={isSelected ? { filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))" } : undefined}>
                    <circle cx="0" cy="0" r="18" fill="#dc2626" stroke={isSelected ? "#facc15" : "#ffffff"} strokeWidth={isSelected ? "4" : "3"} className="drop-shadow-md transition-all" />
                    <text x="0" y="0" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                      {shape.text || "Địch"}
                    </text>
                  </g>
                )}

                {shape.tool === "cross-red" && (
                  <g stroke={isSelected ? "#facc15" : "#ef4444"} strokeWidth="4" strokeLinecap="round" style={isSelected ? { filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))" } : undefined}>
                    <line x1="-12" y1="-12" x2="12" y2="12" />
                    <line x1="12" y1="-12" x2="-12" y2="12" />
                  </g>
                )}

                {shape.tool === "ball" && (
                  <text x="0" y="0" fontSize="28" textAnchor="middle" dominantBaseline="central" style={isSelected ? { filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))" } : undefined}>
                    ⚽
                  </text>
                )}

                {shape.tool === "text" && (
                  <text x="0" y="0" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" className="drop-shadow-md" style={isSelected ? { filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))" } : undefined}>
                    {shape.text}
                  </text>
                )}
              </svg>
            )}

            {shape.points.length > 1 && (
              <g style={isSelected ? { filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.9))" } : undefined}>
                <line
                  x1={`${shape.points[0].x}%`} y1={`${shape.points[0].y}%`}
                  x2={`${shape.points[shape.points.length - 1].x}%`} y2={`${shape.points[shape.points.length - 1].y}%`}
                  stroke={isSelected ? "#facc15" : shape.color}
                  strokeWidth={isSelected ? "5" : "3.5"}
                  strokeDasharray={shape.tool === "dashed-arrow" ? "6,6" : undefined}
                  markerEnd={shape.tool === "dashed-arrow" ? "url(#arrowhead-yellow)" : "url(#arrowhead-white)"}
                  className="transition-all"
                />
                <line
                  x1={`${shape.points[0].x}%`} y1={`${shape.points[0].y}%`}
                  x2={`${shape.points[shape.points.length - 1].x}%`} y2={`${shape.points[shape.points.length - 1].y}%`}
                  stroke="transparent" strokeWidth="28" className="cursor-pointer"
                />
              </g>
            )}

            {isSelected && (
              <g key={`selection-frame-${shape.id}`}>
                {shape.points.length === 1 && bounds && (
                  <>
                    <rect
                      x={`${bounds.x}%`} y={`${bounds.y}%`}
                      width={`${bounds.width}%`} height={`${bounds.height}%`}
                      fill="rgba(250, 204, 21, 0.16)" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" rx="8"
                      className="pointer-events-none transition-all"
                    />
                    <g onClick={(e) => handleDeleteSingleShape(shape.id, e)} onTouchStart={(e) => handleDeleteSingleShape(shape.id, e)} className="cursor-pointer group/btn" style={{ pointerEvents: "all" }}>
                      <circle cx={`${bounds.maxX}%`} cy={`${bounds.minY}%`} r="11" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="shadow-md transition-colors group-hover/btn:fill-red-600" />
                      <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round">
                        <line x1={`${bounds.maxX - 0.6}%`} y1={`${bounds.minY - 1.0}%`} x2={`${bounds.maxX + 0.6}%`} y2={`${bounds.minY + 1.0}%`} />
                        <line x1={`${bounds.maxX + 0.6}%`} y1={`${bounds.minY - 1.0}%`} x2={`${bounds.maxX - 0.6}%`} y2={`${bounds.minY + 1.0}%`} />
                      </g>
                    </g>
                  </>
                )}

                {shape.points.length > 1 && (
                  <>
                    <line
                      x1={`${shape.points[0].x}%`} y1={`${shape.points[0].y}%`}
                      x2={`${shape.points[shape.points.length - 1].x}%`} y2={`${shape.points[shape.points.length - 1].y}%`}
                      stroke="#facc15" strokeWidth="9" opacity="0.35" strokeLinecap="round" className="pointer-events-none"
                    />
                    <circle cx={`${shape.points[0].x}%`} cy={`${shape.points[0].y}%`} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" className="shadow-sm pointer-events-none" />
                    <circle cx={`${shape.points[shape.points.length - 1].x}%`} cy={`${shape.points[shape.points.length - 1].y}%`} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" className="shadow-sm pointer-events-none" />
                    <g onClick={(e) => handleDeleteSingleShape(shape.id, e)} onTouchStart={(e) => handleDeleteSingleShape(shape.id, e)} className="cursor-pointer group/btn" style={{ pointerEvents: "all" }}>
                      <svg x={`${shape.points[shape.points.length - 1].x}%`} y={`${shape.points[shape.points.length - 1].y}%`} overflow="visible">
                        <circle cx="14" cy="-14" r="11" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="shadow-md transition-colors group-hover/btn:fill-red-600" />
                        <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round">
                          <line x1="8.5" y1="-19.5" x2="19.5" y2="-8.5" />
                          <line x1="19.5" y1="-19.5" x2="8.5" y2="-8.5" />
                        </g>
                      </svg>
                    </g>
                  </>
                )}
              </g>
            )}
          </g>
        );
      })}

      {isDrawing && currentPoints.length > 1 && (
        <line
          x1={`${currentPoints[0].x}%`} y1={`${currentPoints[0].y}%`}
          x2={`${currentPoints[currentPoints.length - 1].x}%`} y2={`${currentPoints[currentPoints.length - 1].y}%`}
          stroke={activeTool === "dashed-arrow" ? "#facc15" : "#ffffff"}
          strokeWidth="3.5"
          strokeDasharray={activeTool === "dashed-arrow" ? "6,6" : undefined}
        />
      )}

      {laserPos && (
        <g className="pointer-events-none">
          <circle cx={`${laserPos.x}%`} cy={`${laserPos.y}%`} r="18" fill="rgba(250, 204, 21, 0.25)" filter="url(#laser-neon-glow)" />
          <circle cx={`${laserPos.x}%`} cy={`${laserPos.y}%`} r="12" fill="rgba(250, 204, 21, 0.6)" filter="url(#laser-neon-glow)" />
          <circle cx={`${laserPos.x}%`} cy={`${laserPos.y}%`} r="7" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
          <circle cx={`${laserPos.x}%`} cy={`${laserPos.y}%`} r="2.5" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
};
