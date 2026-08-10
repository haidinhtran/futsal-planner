import React, { useState, useRef } from 'react';
import type { DrawShape, DrawTool } from '../types/futsal';
import {
  ArrowRight,
  XCircle,
  Pointer,
  Trash2,
  Undo2,
  Type,
  Sparkles,
  UserCheck,
  UserX,
} from 'lucide-react';

export const TacticalDiagram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<DrawTool>('arrow');
  const [shapes, setShapes] = useState<DrawShape[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [textInput] = useState<string>('');

  // Sample tactical presets
  const loadPresetRun = (presetType: 'side' | 'pivot' | 'defense') => {
    let presetShapes: DrawShape[] = [];

    if (presetType === 'side') {
      // Chạy biên
      presetShapes = [
        {
          id: '1',
          tool: 'player-home',
          points: [{ x: 35, y: 50 }],
          color: '#16a34a',
          text: 'Ta',
        },
        {
          id: '2',
          tool: 'arrow',
          points: [{ x: 35, y: 50 }, { x: 65, y: 20 }],
          color: '#ffffff',
        },
        {
          id: '3',
          tool: 'dashed-arrow',
          points: [{ x: 65, y: 20 }, { x: 80, y: 20 }],
          color: '#facc15',
        },
        {
          id: '4',
          tool: 'player-away',
          points: [{ x: 80, y: 20 }],
          color: '#dc2626',
          text: 'Địch',
        },
        {
          id: '5',
          tool: 'ball',
          points: [{ x: 35, y: 50 }],
          color: '#ffffff',
        },
      ];
    } else if (presetType === 'pivot') {
      // Fixo chuyền Pivot
      presetShapes = [
        {
          id: '1',
          tool: 'player-home',
          points: [{ x: 30, y: 50 }],
          color: '#16a34a',
          text: 'Fixo',
        },
        {
          id: '2',
          tool: 'dashed-arrow',
          points: [{ x: 30, y: 50 }, { x: 80, y: 50 }],
          color: '#38bdf8',
        },
        {
          id: '3',
          tool: 'arrow',
          points: [{ x: 30, y: 50 }, { x: 60, y: 75 }],
          color: '#ffffff',
        },
        {
          id: '4',
          tool: 'player-away',
          points: [{ x: 75, y: 50 }],
          color: '#dc2626',
          text: 'Địch',
        },
        {
          id: '5',
          tool: 'ball',
          points: [{ x: 80, y: 50 }],
          color: '#ffffff',
        },
      ];
    } else if (presetType === 'defense') {
      // Lùi về bọc lót
      presetShapes = [
        {
          id: '1',
          tool: 'player-away',
          points: [{ x: 70, y: 25 }],
          color: '#dc2626',
          text: 'Địch',
        },
        {
          id: '2',
          tool: 'arrow',
          points: [{ x: 70, y: 25 }, { x: 35, y: 40 }],
          color: '#ef4444',
        },
        {
          id: '3',
          tool: 'player-home',
          points: [{ x: 35, y: 40 }],
          color: '#16a34a',
          text: 'Bọc lót',
        },
        {
          id: '4',
          tool: 'cross-red',
          points: [{ x: 45, y: 50 }],
          color: '#ef4444',
        },
      ];
    }

    setShapes(presetShapes);
  };

  const getRelativeCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getRelativeCoords(e);

    if (activeTool === 'pointer') {
      setLaserPos(pt);
      return;
    }

    if (
      activeTool === 'player-home' ||
      activeTool === 'player-away' ||
      activeTool === 'circle-red' ||
      activeTool === 'circle-blue' ||
      activeTool === 'cross-red' ||
      activeTool === 'ball'
    ) {
      const toolType = activeTool === 'circle-blue' ? 'player-home' : activeTool === 'circle-red' ? 'player-away' : activeTool;
      const newShape: DrawShape = {
        id: Date.now().toString(),
        tool: toolType,
        points: [pt],
        color: toolType === 'player-home' ? '#16a34a' : toolType === 'player-away' || toolType === 'cross-red' ? '#dc2626' : '#ffffff',
      };
      setShapes((prev) => [...prev, newShape]);
      return;
    }

    if (activeTool === 'text') {
      const text = prompt('Nhập văn bản ghi chú chiến thuật:', textInput || 'Chạy biên');
      if (text) {
        const newShape: DrawShape = {
          id: Date.now().toString(),
          tool: 'text',
          points: [pt],
          color: '#ffffff',
          text,
        };
        setShapes((prev) => [...prev, newShape]);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([pt]);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getRelativeCoords(e);

    if (activeTool === 'pointer') {
      setLaserPos(pt);
      return;
    } else {
      setLaserPos(null);
    }

    if (!isDrawing) return;
    setCurrentPoints((prev) => [...prev, pt]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 1) {
      const newShape: DrawShape = {
        id: Date.now().toString(),
        tool: activeTool,
        points: currentPoints,
        color: activeTool === 'dashed-arrow' ? '#facc15' : '#ffffff',
      };
      setShapes((prev) => [...prev, newShape]);
    }
    setCurrentPoints([]);
  };

  const handleUndo = () => {
    setShapes((prev) => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setShapes([]);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Drawing Tools */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-2xl">
          <button
            onClick={() => setActiveTool('pointer')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'pointer' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Laser Con Trỏ Thuyết Trình"
          >
            <Pointer className="w-4 h-4" />
            <span>Con trỏ Laser</span>
          </button>

          <button
            onClick={() => setActiveTool('arrow')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'arrow' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Mũi tên di chuyển"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Mũi tên</span>
          </button>

          <button
            onClick={() => setActiveTool('dashed-arrow')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'dashed-arrow' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Mũi tên đường chuyền"
          >
            <span className="font-mono text-xs font-black">--➔</span>
            <span>Chuyền bóng</span>
          </button>

          {/* Cầu Thủ Ta (Màu Xanh Lá Cây) */}
          <button
            onClick={() => setActiveTool('player-home')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTool === 'player-home' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80'
            }`}
            title="Cầu Thủ Ta (Đội mình - Xanh lá cây)"
          >
            <UserCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span>Cầu Thủ Ta (Xanh Lá)</span>
          </button>

          {/* Cầu Thủ Địch (Màu Đỏ) */}
          <button
            onClick={() => setActiveTool('player-away')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTool === 'player-away' ? 'bg-red-600 text-white shadow-md' : 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80'
            }`}
            title="Cầu Thủ Địch (Đội đối thủ - Đỏ)"
          >
            <UserX className="w-4 h-4 text-red-600 fill-red-100" />
            <span>Cầu Thủ Địch (Đỏ)</span>
          </button>

          <button
            onClick={() => setActiveTool('cross-red')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'cross-red' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Dấu gạch chéo đỏ"
          >
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Dấu X Đỏ</span>
          </button>

          <button
            onClick={() => setActiveTool('ball')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'ball' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Đặt Bóng Futsal"
          >
            <span className="text-sm">⚽</span>
            <span>Bóng Futsal</span>
          </button>

          <button
            onClick={() => setActiveTool('text')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'text' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Văn bản ghi chú"
          >
            <Type className="w-4 h-4" />
            <span>Văn bản</span>
          </button>
        </div>

        {/* Preset Tactical Maneuvers & Actions */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-slate-500 uppercase mr-1 hidden sm:inline">
            BÀI ĐÁNH MẪU:
          </span>
          <button
            onClick={() => loadPresetRun('side')}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            Chạy biên
          </button>
          <button
            onClick={() => loadPresetRun('pivot')}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-colors cursor-pointer"
          >
            Đè Pivot
          </button>
          <button
            onClick={() => loadPresetRun('defense')}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors cursor-pointer"
          >
            Bọc lót
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <button
            onClick={handleUndo}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            title="Hoàn tác nét vẽ"
          >
            <Undo2 className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleClearAll}
            className="p-2 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
            title="Xóa tất cả nét vẽ"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Pitch Drawing Board */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold uppercase">SÂN DIỄN GIẢI THUYẾT TRÌNH BÀI ĐÁNH (ĐỘC LẬP)</span>
          </div>
          <span className="text-slate-500 font-semibold">
            {activeTool === 'pointer'
              ? 'Di chuột để dùng Laser chỉ bài'
              : 'Nắm giữ & kéo chuột trên sân để vẽ nét di chuyển hoặc nhấp để đặt Cầu thủ / Bóng'}
          </span>
        </div>

        <div className="futsal-pitch-container w-full" ref={containerRef}>
          <div className="futsal-pitch-floor relative overflow-hidden min-h-[480px]">
            {/* Standard pitch markings */}
            <div className="pitch-line pitch-center-line"></div>
            <div className="pitch-line pitch-center-circle"></div>
            <div className="pitch-line pitch-center-spot"></div>
            <div className="pitch-line pitch-penalty-left"></div>
            <div className="pitch-line pitch-penalty-right"></div>
            <div className="pitch-goal-left"></div>
            <div className="pitch-goal-right"></div>

            {/* SVG Drawing Canvas Overlay */}
            <svg
              className="absolute inset-0 w-full h-full cursor-crosshair z-20"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                <marker
                  id="arrowhead-white"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 0, 8 4, 0 8" fill="#ffffff" />
                </marker>
                <marker
                  id="arrowhead-yellow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 0, 8 4, 0 8" fill="#facc15" />
                </marker>
              </defs>

              {/* Render Saved Shapes */}
              {shapes.map((shape) => {
                // Cầu Thủ Ta (Green Circle Marker)
                if (shape.tool === 'player-home' || shape.tool === 'circle-blue') {
                  const pt = shape.points[0];
                  return (
                    <g key={shape.id} className="cursor-pointer">
                      {/* Outer Green Player Circle */}
                      <circle
                        cx={`${pt.x}%`}
                        cy={`${pt.y}%`}
                        r="18"
                        fill="#16a34a"
                        stroke="#ffffff"
                        strokeWidth="3"
                        className="drop-shadow-md"
                      />
                      {/* Label Text "Ta" */}
                      <text
                        x={`${pt.x}%`}
                        y={`${pt.y}%`}
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {shape.text || 'Ta'}
                      </text>
                    </g>
                  );
                }

                // Cầu Thủ Địch (Red Circle Marker)
                if (shape.tool === 'player-away' || shape.tool === 'circle-red') {
                  const pt = shape.points[0];
                  return (
                    <g key={shape.id} className="cursor-pointer">
                      {/* Outer Red Player Circle */}
                      <circle
                        cx={`${pt.x}%`}
                        cy={`${pt.y}%`}
                        r="18"
                        fill="#dc2626"
                        stroke="#ffffff"
                        strokeWidth="3"
                        className="drop-shadow-md"
                      />
                      {/* Label Text "Địch" */}
                      <text
                        x={`${pt.x}%`}
                        y={`${pt.y}%`}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {shape.text || 'Địch'}
                      </text>
                    </g>
                  );
                }

                if (shape.tool === 'cross-red') {
                  const pt = shape.points[0];
                  return (
                    <g key={shape.id} stroke="#ef4444" strokeWidth="4" strokeLinecap="round">
                      <line x1={`calc(${pt.x}% - 12px)`} y1={`calc(${pt.y}% - 12px)`} x2={`calc(${pt.x}% + 12px)`} y2={`calc(${pt.y}% + 12px)`} />
                      <line x1={`calc(${pt.x}% + 12px)`} y1={`calc(${pt.y}% - 12px)`} x2={`calc(${pt.x}% - 12px)`} y2={`calc(${pt.y}% + 12px)`} />
                    </g>
                  );
                }

                if (shape.tool === 'ball') {
                  const pt = shape.points[0];
                  return (
                    <text
                      key={shape.id}
                      x={`${pt.x}%`}
                      y={`${pt.y}%`}
                      fontSize="28"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      ⚽
                    </text>
                  );
                }

                if (shape.tool === 'text') {
                  const pt = shape.points[0];
                  return (
                    <text
                      key={shape.id}
                      x={`${pt.x}%`}
                      y={`${pt.y}%`}
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="drop-shadow-md"
                    >
                      {shape.text}
                    </text>
                  );
                }

                if (shape.points.length > 1) {
                  const startPt = shape.points[0];
                  const endPt = shape.points[shape.points.length - 1];
                  const markerId = shape.tool === 'dashed-arrow' ? 'url(#arrowhead-yellow)' : 'url(#arrowhead-white)';

                  return (
                    <line
                      key={shape.id}
                      x1={`${startPt.x}%`}
                      y1={`${startPt.y}%`}
                      x2={`${endPt.x}%`}
                      y2={`${endPt.y}%`}
                      stroke={shape.color}
                      strokeWidth="3.5"
                      strokeDasharray={shape.tool === 'dashed-arrow' ? '6,6' : undefined}
                      markerEnd={markerId}
                    />
                  );
                }

                return null;
              })}

              {/* Render Current Line while drawing */}
              {isDrawing && currentPoints.length > 1 && (
                <line
                  x1={`${currentPoints[0].x}%`}
                  y1={`${currentPoints[0].y}%`}
                  x2={`${currentPoints[currentPoints.length - 1].x}%`}
                  y2={`${currentPoints[currentPoints.length - 1].y}%`}
                  stroke={activeTool === 'dashed-arrow' ? '#facc15' : '#ffffff'}
                  strokeWidth="3.5"
                  strokeDasharray={activeTool === 'dashed-arrow' ? '6,6' : undefined}
                />
              )}

              {/* Render Glowing Laser Pointer Cursor */}
              {laserPos && (
                <g>
                  <circle cx={`${laserPos.x}%`} cy={`${laserPos.y}%`} r="14" fill="rgba(239, 68, 68, 0.4)" />
                  <circle cx={`${laserPos.x}%`} cy={`${laserPos.y}%`} r="6" fill="#ef4444" className="animate-pulse" />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
