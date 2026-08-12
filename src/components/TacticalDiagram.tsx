import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { DrawShape, DrawTool, Player, SavedTacticalDiagram } from '../types/futsal';
import { storageService } from '../services/storageService';
import { getVietnameseShortName } from './FutsalPitch';
import { getPositionConfig } from '../types/futsal';
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
  Move,
  Eraser,
  X,
  Save,
  FilePlus,
  FolderOpen,
  Edit3,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface TacticalDiagramProps {
  players?: Player[];
}

export const TacticalDiagram: React.FC<TacticalDiagramProps> = ({ players: initialPlayers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<DrawTool>('select');
  const [shapes, setShapes] = useState<DrawShape[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [textInput] = useState<string>('');

  // Team players state
  const [teamPlayers, setTeamPlayers] = useState<Player[]>(
    () => initialPlayers || storageService.getPlayers()
  );

  useEffect(() => {
    if (initialPlayers) {
      setTeamPlayers(initialPlayers);
    }
  }, [initialPlayers]);

  // Saved Diagrams & Storage State
  const [savedDiagrams, setSavedDiagrams] = useState<SavedTacticalDiagram[]>(() =>
    storageService.getDiagrams()
  );
  const [diagramName, setDiagramName] = useState<string>('Draft-001');
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);

  // Re-order Layer Z-Index Functions
  const handleMoveLayerUp = (index: number) => {
    if (index <= 0) return;
    setShapes((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
    setIsDirty(true);
  };

  const handleMoveLayerDown = (index: number) => {
    if (index >= shapes.length - 1) return;
    setShapes((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
    setIsDirty(true);
  };

  // Selection & Drag & Drop State
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [draggingShapeId, setDraggingShapeId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [initialShapePoints, setInitialShapePoints] = useState<Array<{ x: number; y: number }> | null>(null);

  // Automatically deselect current object on pitch whenever drawing tool changes
  useEffect(() => {
    setSelectedShapeId(null);
  }, [activeTool]);

  // Player Selector Modal State
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [pendingPt, setPendingPt] = useState<{ x: number; y: number } | null>(null);
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);

  // Generate next draft name (Draft-001, Draft-002, etc.)
  const generateNextDraftName = () => {
    const existing = storageService.getDiagrams();
    const draftNumbers = existing
      .map((d) => {
        const match = d.name.match(/^Draft-(\d+)$/i);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const maxNum = draftNumbers.length > 0 ? Math.max(...draftNumbers) : 0;
    const nextNum = (maxNum + 1).toString().padStart(3, '0');
    return `Draft-${nextNum}`;
  };

  // Warning when closing/refreshing (F5) with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && shapes.length > 0) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa lưu trên bản vẽ diễn giải chiến thuật. Bạn có chắc chắn muốn rời đi?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, shapes.length]);

  // Listen for Delete / Backspace keys to remove selected shape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeId) {
        setShapes((prev) => prev.filter((s) => s.id !== selectedShapeId));
        setSelectedShapeId(null);
        setIsDirty(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId]);

  // Save Diagram to LocalStorage
  const handleSaveDiagram = () => {
    const inputName = prompt('Nhập tên bản vẽ chiến thuật:', diagramName || 'Draft-001');
    if (inputName === null) return; // User cancelled

    const finalName = inputName.trim() || diagramName || 'Draft-001';
    const diagramId = currentDiagramId || Date.now().toString();

    const newDiagram: SavedTacticalDiagram = {
      id: diagramId,
      name: finalName,
      shapes: [...shapes],
      updatedAt: new Date().toISOString(),
    };

    storageService.saveDiagram(newDiagram);
    setSavedDiagrams(storageService.getDiagrams());
    setDiagramName(finalName);
    setCurrentDiagramId(diagramId);
    setIsDirty(false);
  };

  // Load Diagram from LocalStorage
  const handleLoadDiagram = (diagramId: string) => {
    if (!diagramId) return;

    if (isDirty && shapes.length > 0) {
      if (!window.confirm('Bản vẽ hiện tại chưa được lưu. Bạn có chắc chắn muốn chuyển sang bản vẽ khác?')) {
        return;
      }
    }

    const found = savedDiagrams.find((d) => d.id === diagramId);
    if (found) {
      setShapes([...found.shapes.map((s) => ({ ...s, points: [...s.points] }))]);
      setDiagramName(found.name);
      setCurrentDiagramId(found.id);
      setSelectedShapeId(null);
      setIsDirty(false);
    }
  };

  // New Diagram
  const handleNewDiagram = () => {
    if (isDirty && shapes.length > 0) {
      if (!window.confirm('Bản vẽ hiện tại chưa được lưu. Bạn có chắc chắn muốn tạo bản vẽ mới?')) {
        return;
      }
    }

    const nextName = generateNextDraftName();
    setShapes([]);
    setDiagramName(nextName);
    setCurrentDiagramId(null);
    setSelectedShapeId(null);
    setIsDirty(false);
  };

  // Delete Current Saved Diagram
  const handleDeleteCurrentDiagram = () => {
    if (!currentDiagramId) {
      if (window.confirm('Xóa sạch tất cả các nét vẽ trên màn hình?')) {
        setShapes([]);
        setSelectedShapeId(null);
        setIsDirty(false);
      }
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa bản vẽ "${diagramName}" khỏi danh sách đã lưu?`)) {
      storageService.deleteDiagram(currentDiagramId);
      const updated = storageService.getDiagrams();
      setSavedDiagrams(updated);
      const nextName = generateNextDraftName();
      setShapes([]);
      setDiagramName(nextName);
      setCurrentDiagramId(null);
      setSelectedShapeId(null);
      setIsDirty(false);
    }
  };

  // Sample tactical presets (Updated with full features: Player names, Shirt numbers, Ball, Passes)
  const loadPresetRun = (presetType: 'side' | 'pivot' | 'defense') => {
    let presetShapes: DrawShape[] = [];

    if (presetType === 'side') {
      // Chạy biên (Overlap) - Ala di chuyển xé cánh, chuyền bóng xẻ nách
      presetShapes = [
        { id: '1', tool: 'player-home', points: [{ x: 30, y: 70 }], color: '#16a34a', text: 'Thái Tuấn', number: 4 },
        { id: '2', tool: 'player-home', points: [{ x: 35, y: 35 }], color: '#16a34a', text: 'Hữu Thành', number: 6 },
        { id: '3', tool: 'player-home', points: [{ x: 75, y: 35 }], color: '#16a34a', text: 'Cao Tấn', number: 9 },
        { id: '4', tool: 'player-away', points: [{ x: 50, y: 35 }], color: '#dc2626', text: 'Địch' },
        { id: '5', tool: 'player-away', points: [{ x: 70, y: 40 }], color: '#dc2626', text: 'Địch' },
        { id: '6', tool: 'ball', points: [{ x: 30, y: 70 }], color: '#ffffff' },
        { id: '7', tool: 'dashed-arrow', points: [{ x: 30, y: 70 }, { x: 75, y: 35 }], color: '#facc15' },
        { id: '8', tool: 'arrow', points: [{ x: 30, y: 70 }, { x: 55, y: 80 }, { x: 80, y: 65 }], color: '#ffffff' },
      ];
    } else if (presetType === 'pivot') {
      // Xoay Dọc Pivot - Fixo chuyền thẳng vào chân Pivot đè hậu vệ
      presetShapes = [
        { id: '1', tool: 'player-home', points: [{ x: 25, y: 50 }], color: '#16a34a', text: 'Tấn Phong', number: 2 },
        { id: '2', tool: 'player-home', points: [{ x: 75, y: 50 }], color: '#16a34a', text: 'Bình An', number: 10 },
        { id: '3', tool: 'player-away', points: [{ x: 70, y: 50 }], color: '#dc2626', text: 'Địch' },
        { id: '4', tool: 'ball', points: [{ x: 25, y: 50 }], color: '#ffffff' },
        { id: '5', tool: 'dashed-arrow', points: [{ x: 25, y: 50 }, { x: 75, y: 50 }], color: '#facc15' },
        { id: '6', tool: 'arrow', points: [{ x: 35, y: 30 }, { x: 65, y: 25 }], color: '#ffffff' },
        { id: '7', tool: 'player-home', points: [{ x: 35, y: 30 }], color: '#16a34a', text: 'Hữu Thành', number: 6 },
      ];
    } else if (presetType === 'defense') {
      // Bọc Lót Phòng Thủ - Đóng trung lộ, di chuyển bọc lót chặn đột phá
      presetShapes = [
        { id: '1', tool: 'player-away', points: [{ x: 65, y: 25 }], color: '#dc2626', text: 'Địch' },
        { id: '2', tool: 'arrow', points: [{ x: 65, y: 25 }, { x: 40, y: 40 }], color: '#ef4444' },
        { id: '3', tool: 'player-home', points: [{ x: 40, y: 40 }], color: '#16a34a', text: 'Thái Tuấn', number: 4 },
        { id: '4', tool: 'player-home', points: [{ x: 25, y: 60 }], color: '#16a34a', text: 'Tấn Phong', number: 2 },
        { id: '5', tool: 'cross-red', points: [{ x: 50, y: 45 }], color: '#ef4444' },
        { id: '6', tool: 'ball', points: [{ x: 65, y: 25 }], color: '#ffffff' },
      ];
    }

    setShapes(presetShapes);
    setSelectedShapeId(null);
    setIsDirty(true);
  };

  const getRelativeCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Number(Math.max(0, Math.min(100, x)).toFixed(2)),
      y: Number(Math.max(0, Math.min(100, y)).toFixed(2)),
    };
  };

  const getShapeBounds = (shape: DrawShape) => {
    if (!shape.points || shape.points.length === 0) {
      return { x: 50, y: 50, width: 4, height: 4, maxX: 52, minY: 48 };
    }

    const xs = shape.points.map((p) => p.x);
    const ys = shape.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    let padX = 2.0;
    let padYTop = 2.6;
    let padYBottom = 2.6;

    if (shape.points.length === 1) {
      if (shape.tool === 'text') {
        const textLen = shape.text?.length || 4;
        padX = Math.max(2.2, textLen * 0.4);
        padYTop = 2.0;
        padYBottom = 2.0;
      } else if (shape.tool === 'player-home' && shape.number !== undefined && shape.text && shape.text !== 'Ta') {
        padX = 3.2;
        padYTop = 2.8;
        padYBottom = 5.8; // Tight bottom padding enclosing player name badge
      } else if (shape.tool === 'player-home' || shape.tool === 'player-away' || shape.tool === 'circle-blue' || shape.tool === 'circle-red') {
        padX = 2.0;
        padYTop = 2.6;
        padYBottom = 2.6;
      } else if (shape.tool === 'ball' || shape.tool === 'cross-red') {
        padX = 1.6;
        padYTop = 2.2;
        padYBottom = 2.2;
      }
    } else {
      // Multi-point lines/arrows
      padX = 1.8;
      padYTop = 2.2;
      padYBottom = 2.2;
    }

    const boundsMinX = Number(Math.max(0.5, minX - padX).toFixed(2));
    const boundsMaxX = Number(Math.min(99.5, maxX + padX).toFixed(2));
    const boundsMinY = Number(Math.max(0.5, minY - padYTop).toFixed(2));
    const boundsMaxY = Number(Math.min(99.5, maxY + padYBottom).toFixed(2));

    return {
      x: boundsMinX,
      y: boundsMinY,
      width: Number(Math.max(3, boundsMaxX - boundsMinX).toFixed(2)),
      height: Number(Math.max(3, boundsMaxY - boundsMinY).toFixed(2)),
      maxX: boundsMaxX,
      minY: boundsMinY,
    };
  };

  const handleDeleteSingleShape = (shapeId: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    if (selectedShapeId === shapeId) setSelectedShapeId(null);
    setIsDirty(true);
  };

  const handleSelectPlayerForShape = (selectedPlayer: Player | null) => {
    if (!selectedPlayer) {
      // Default "Ta"
      if (editingShapeId) {
        setShapes((prev) =>
          prev.map((s) => (s.id === editingShapeId ? { ...s, text: 'Ta', number: undefined } : s))
        );
      } else if (pendingPt) {
        const newShape: DrawShape = {
          id: Date.now().toString(),
          tool: 'player-home',
          points: [pendingPt],
          color: '#16a34a',
          text: 'Ta',
        };
        setShapes((prev) => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
      }
    } else {
      // Real player assigned
      const shortName = getVietnameseShortName(selectedPlayer.name);
      if (editingShapeId) {
        setShapes((prev) =>
          prev.map((s) =>
            s.id === editingShapeId
              ? { ...s, text: shortName, number: selectedPlayer.number }
              : s
          )
        );
      } else if (pendingPt) {
        const newShape: DrawShape = {
          id: Date.now().toString(),
          tool: 'player-home',
          points: [pendingPt],
          color: '#16a34a',
          text: shortName,
          number: selectedPlayer.number,
        };
        setShapes((prev) => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
      }
    }

    setIsDirty(true);
    setShowPlayerModal(false);
    setPendingPt(null);
    setEditingShapeId(null);
  };

  // Dynamically sort shapes so the currently selected shape is rendered at the top Z-index layer
  const sortedShapes = useMemo(() => {
    if (!selectedShapeId) return shapes;
    const unselected = shapes.filter((s) => s.id !== selectedShapeId);
    const selected = shapes.filter((s) => s.id === selectedShapeId);
    return [...unselected, ...selected];
  }, [shapes, selectedShapeId]);

  const handleShapeStart = (shapeId: string, pt: { x: number; y: number }, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (activeTool === 'eraser') {
      handleDeleteSingleShape(shapeId);
      return;
    }

    setSelectedShapeId(shapeId);
    const targetShape = shapes.find((s) => s.id === shapeId);
    if (targetShape) {
      setDraggingShapeId(shapeId);
      setDragStartPos(pt);
      setInitialShapePoints([...targetShape.points.map((p) => ({ ...p }))]);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getRelativeCoords(e.clientX, e.clientY);

    if (activeTool === 'pointer') {
      setLaserPos(pt);
      return;
    }

    if (activeTool === 'select' || activeTool === 'eraser') {
      setSelectedShapeId(null);
      return;
    }

    if (activeTool === 'player-home' || activeTool === 'circle-blue') {
      // Open Player Selector Modal for Cầu Thủ Ta
      setPendingPt(pt);
      setEditingShapeId(null);
      setShowPlayerModal(true);
      return;
    }

    if (
      activeTool === 'player-away' ||
      activeTool === 'circle-red' ||
      activeTool === 'cross-red' ||
      activeTool === 'ball'
    ) {
      const toolType = activeTool === 'circle-red' ? 'player-away' : activeTool;
      const newShape: DrawShape = {
        id: Date.now().toString(),
        tool: toolType,
        points: [pt],
        color: toolType === 'player-away' || toolType === 'cross-red' ? '#dc2626' : '#ffffff',
      };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
      setIsDirty(true);
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
        setSelectedShapeId(newShape.id);
        setIsDirty(true);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([pt]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getRelativeCoords(e.clientX, e.clientY);

    if (activeTool === 'pointer') {
      setLaserPos(pt);
      return;
    } else {
      setLaserPos(null);
    }

    // Dragging an existing shape
    if (draggingShapeId && dragStartPos && initialShapePoints) {
      const dx = pt.x - dragStartPos.x;
      const dy = pt.y - dragStartPos.y;

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== draggingShapeId) return s;
          const updatedPoints = initialShapePoints.map((p) => ({
            x: Number((p.x + dx).toFixed(2)),
            y: Number((p.y + dy).toFixed(2)),
          }));
          return { ...s, points: updatedPoints };
        })
      );
      setIsDirty(true);
      return;
    }

    if (!isDrawing) return;
    setCurrentPoints((prev) => [...prev, pt]);
  };

  const handleCanvasMouseUp = () => {
    if (draggingShapeId) {
      setDraggingShapeId(null);
      setDragStartPos(null);
      setInitialShapePoints(null);
    }

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
      setSelectedShapeId(newShape.id);
      setIsDirty(true);
    }
    setCurrentPoints([]);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const pt = getRelativeCoords(touch.clientX, touch.clientY);

    if (activeTool === 'pointer') {
      setLaserPos(pt);
      return;
    }

    if (activeTool === 'select' || activeTool === 'eraser') {
      setSelectedShapeId(null);
      return;
    }

    if (activeTool === 'player-home' || activeTool === 'circle-blue') {
      setPendingPt(pt);
      setEditingShapeId(null);
      setShowPlayerModal(true);
      return;
    }

    if (
      activeTool === 'player-away' ||
      activeTool === 'circle-red' ||
      activeTool === 'cross-red' ||
      activeTool === 'ball'
    ) {
      const toolType = activeTool === 'circle-red' ? 'player-away' : activeTool;
      const newShape: DrawShape = {
        id: Date.now().toString(),
        tool: toolType,
        points: [pt],
        color: toolType === 'player-away' || toolType === 'cross-red' ? '#dc2626' : '#ffffff',
      };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
      setIsDirty(true);
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
        setSelectedShapeId(newShape.id);
        setIsDirty(true);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([pt]);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const pt = getRelativeCoords(touch.clientX, touch.clientY);

    if (activeTool === 'pointer') {
      setLaserPos(pt);
      return;
    } else {
      setLaserPos(null);
    }

    if (draggingShapeId && dragStartPos && initialShapePoints) {
      const dx = pt.x - dragStartPos.x;
      const dy = pt.y - dragStartPos.y;

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== draggingShapeId) return s;
          const updatedPoints = initialShapePoints.map((p) => ({
            x: Number((p.x + dx).toFixed(2)),
            y: Number((p.y + dy).toFixed(2)),
          }));
          return { ...s, points: updatedPoints };
        })
      );
      setIsDirty(true);
      return;
    }

    if (!isDrawing) return;
    setCurrentPoints((prev) => [...prev, pt]);
  };

  const handleCanvasTouchEnd = () => {
    handleCanvasMouseUp();
  };

  const handleUndo = () => {
    setShapes((prev) => prev.slice(0, -1));
    setIsDirty(true);
  };

  const handleClearAll = () => {
    setShapes([]);
    setSelectedShapeId(null);
    setIsDirty(true);
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Master Tactical Diagram Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        {/* 1. Header Banner: Diagram Save & Load Control Panel (Minimalist Light Theme) */}
        <div className="bg-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 rounded-t-3xl">
          {/* Current Diagram Title & Status Badge */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-600 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg tracking-wide text-slate-900">
                  {diagramName}
                </span>
                <button
                  onClick={handleSaveDiagram}
                  className="text-slate-400 hover:text-blue-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Đổi tên bản vẽ"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {/* Status Badge (Only shown when changes exist or a saved diagram is loaded) */}
                {isDirty ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                    • Chưa lưu
                  </span>
                ) : currentDiagramId ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ Đã lưu
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sơ đồ diễn giải chiến thuật Futsal bài đánh
              </p>
            </div>
          </div>

          {/* Saved Diagrams Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Load Selection Dropdown */}
            <div className="relative flex items-center min-w-[210px]">
              <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={currentDiagramId || ''}
                onChange={(e) => handleLoadDiagram(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 text-slate-800 font-bold text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none transition-colors shadow-2xs"
              >
                <option value="">-- Bản vẽ đã lưu ({savedDiagrams.length}) --</option>
                {savedDiagrams.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({new Date(d.updatedAt).toLocaleDateString('vi-VN')})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>

            {/* New Diagram Button */}
            <button
              onClick={handleNewDiagram}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl border border-slate-200/90 transition-all cursor-pointer shadow-2xs"
              title="Tạo bản vẽ chiến thuật mới"
            >
              <FilePlus className="w-4 h-4 text-blue-600" />
              <span>Bản vẽ mới</span>
            </button>

            {/* Save Diagram Button */}
            <button
              onClick={handleSaveDiagram}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
              title="Lưu bản vẽ vào LocalStorage"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Bản Vẽ</span>
            </button>

            {/* Delete Diagram Button */}
            {currentDiagramId && (
              <button
                onClick={handleDeleteCurrentDiagram}
                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-200 transition-all cursor-pointer"
                title="Xóa bản vẽ này khỏi LocalStorage"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Middle Floating Toolbar: Compact Icon-Only Tools, Preset Dropdown & Red-Boxed Trash Button */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-4 border-b border-slate-200/90 shadow-md flex items-center justify-between gap-2 overflow-x-auto">
          {/* Icon-Only Boxed Drawing Tools */}
          <div className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shrink-0">
            {/* Select & Drag Tool */}
            <button
              onClick={() => setActiveTool('select')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'select'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Chọn & Kéo thả di chuyển đối tượng"
            >
              <Move className="w-4 h-4" />
            </button>

            {/* Pointer Laser Tool */}
            <button
              onClick={() => setActiveTool('pointer')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'pointer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Laser Con Trỏ Thuyết Trình"
            >
              <Pointer className={`w-4 h-4 ${activeTool === 'pointer' ? 'text-white' : 'text-amber-500'}`} />
            </button>

            {/* Movement Arrow */}
            <button
              onClick={() => setActiveTool('arrow')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'arrow'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Mũi tên di chuyển"
            >
              <ArrowRight className={`w-4 h-4 ${activeTool === 'arrow' ? 'text-white' : 'text-blue-500'}`} />
            </button>

            {/* Pass Arrow */}
            <button
              onClick={() => setActiveTool('dashed-arrow')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'dashed-arrow'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Mũi tên đường chuyền bóng (nét đứt)"
            >
              <span className={`font-mono text-xs font-black ${activeTool === 'dashed-arrow' ? 'text-white' : 'text-blue-600'}`}>--➔</span>
            </button>

            {/* Cầu Thủ Ta */}
            <button
              onClick={() => setActiveTool('player-home')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'player-home'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Đặt vị trí Cầu Thủ Ta (Chọn Tên & Số áo từ đội bóng)"
            >
              <UserCheck className={`w-4 h-4 ${activeTool === 'player-home' ? 'text-white' : 'text-emerald-600'}`} />
            </button>

            {/* Cầu Thủ Địch */}
            <button
              onClick={() => setActiveTool('player-away')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'player-away'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Đặt vị trí Cầu Thủ Địch (Đối thủ)"
            >
              <UserX className={`w-4 h-4 ${activeTool === 'player-away' ? 'text-white' : 'text-red-500'}`} />
            </button>

            {/* Dấu X Đỏ */}
            <button
              onClick={() => setActiveTool('cross-red')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'cross-red'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Dấu gạch chéo đỏ (Vị trí phạm lỗi/định vị)"
            >
              <XCircle className={`w-4 h-4 ${activeTool === 'cross-red' ? 'text-white' : 'text-red-500'}`} />
            </button>

            {/* Bóng Futsal */}
            <button
              onClick={() => setActiveTool('ball')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'ball'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Đặt Bóng Futsal"
            >
              <span className="text-sm">⚽</span>
            </button>

            {/* Văn bản */}
            <button
              onClick={() => setActiveTool('text')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'text'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Thêm ghi chú văn bản"
            >
              <Type className={`w-4 h-4 ${activeTool === 'text' ? 'text-white' : 'text-slate-600'}`} />
            </button>

            {/* Eraser Tool */}
            <button
              onClick={() => setActiveTool('eraser')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeTool === 'eraser'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/90'
              }`}
              title="Cục Tẩy (Nhấp vào đối tượng trên sân để xóa)"
            >
              <Eraser className={`w-4 h-4 ${activeTool === 'eraser' ? 'text-white' : 'text-amber-600'}`} />
            </button>
          </div>

          {/* Right Controls: Presets Dropdown, Layers, Undo, Red-Boxed Trash */}
          <div className="flex items-center space-x-1.5 shrink-0 ml-auto">
            {/* Tactical Presets Dropdown Select */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  loadPresetRun(e.target.value as 'side' | 'pivot' | 'defense');
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 font-extrabold text-xs px-2.5 py-1.5 rounded-xl border border-slate-200/90 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors shadow-2xs"
              title="Nạp mẫu bài đánh chiến thuật có sẵn"
            >
              <option value="" disabled>-- Mẫu bài đánh --</option>
              <option value="side">🏃 Chạy biên</option>
              <option value="pivot">🛡️ Đè Pivot</option>
              <option value="defense">🔄 Bọc lót</option>
            </select>

            <div className="h-5 w-px bg-slate-200 mx-0.5"></div>

            {/* Layer Panel Button */}
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                showLayerPanel
                  ? 'bg-blue-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold border border-slate-200/80'
              }`}
              title="Bảng Quản Lý Lớp Đối Tượng (Layer)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lớp ({shapes.length})</span>
            </button>

            {/* Undo Button */}
            <button
              onClick={handleUndo}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              title="Hoàn tác nét vẽ (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            {/* Red Boxed Trash Clear Canvas Button */}
            <button
              onClick={handleClearAll}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/90 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Xóa tất cả nét vẽ trên sân"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* 3. Main Interactive Pitch Section */}
        <div className="p-4 sm:p-6">

        <div className="futsal-pitch-container w-full" ref={containerRef}>
          <div className="futsal-pitch-floor relative overflow-hidden min-h-[480px]">
            {/* Standard pitch markings */}
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

            {/* SVG Drawing Canvas Overlay */}
            <svg
              className={`absolute inset-0 w-full h-full z-20 touch-none-canvas ${
                activeTool === 'select'
                  ? 'cursor-default'
                  : activeTool === 'eraser'
                  ? 'cursor-pointer'
                  : 'cursor-crosshair'
              }`}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
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
                <filter id="laser-neon-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render Saved Shapes (sortedShapes ensures selected shape is rendered at the top Z-index layer) */}
              {sortedShapes.map((shape: DrawShape) => {
                const isSelected = selectedShapeId === shape.id;
                const anchorPt = shape.points[0] || { x: 50, y: 50 };
                const shapeBounds = getShapeBounds(shape);
                const bounds = isSelected ? shapeBounds : null;

                return (
                  <g
                    key={shape.id}
                    className={`group ${
                      activeTool === 'select' || activeTool === 'eraser' ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
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
                      if (shape.tool === 'player-home') {
                        setEditingShapeId(shape.id);
                        setShowPlayerModal(true);
                      }
                    }}
                  >
                    {/* Transparent Hit Target Box (Only for Single-Point Shapes to prevent multi-point arrows from stealing pitch clicks) */}
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

                    {/* Atomic Local SVG Frame for Single-Point Shapes (Ensures 100% rigid lockstep drag with zero offset/drift) */}
                    {shape.points.length === 1 && (
                      <svg x={`${anchorPt.x}%`} y={`${anchorPt.y}%`} overflow="visible" className="pointer-events-none">
                        {(shape.tool === 'player-home' || shape.tool === 'circle-blue') && (
                          <g style={isSelected ? { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))' } : undefined}>
                            {/* Outer Green Circle */}
                            <circle
                              cx="0"
                              cy="0"
                              r="18"
                              fill="#16a34a"
                              stroke={isSelected ? '#facc15' : '#ffffff'}
                              strokeWidth={isSelected ? '4' : '3'}
                              className="drop-shadow-md transition-all"
                            />
                            {/* Shirt Number `#` inside Circle */}
                            <text
                              x="0"
                              y="0"
                              fill="#ffffff"
                              fontSize={shape.number !== undefined ? '13' : '12'}
                              fontWeight="900"
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {shape.number !== undefined ? `#${shape.number}` : shape.text || 'Ta'}
                            </text>

                            {/* Player Short Name Badge Below Circle */}
                            {shape.number !== undefined && shape.text && shape.text !== 'Ta' && (
                              <g>
                                <rect
                                  x="-36"
                                  y="22"
                                  width="72"
                                  height="18"
                                  rx="5"
                                  fill="#0f172a"
                                  stroke="#ffffff"
                                  strokeWidth="1"
                                  className="shadow-sm opacity-95"
                                />
                                <text
                                  x="0"
                                  y="31"
                                  fill="#facc15"
                                  fontSize="10"
                                  fontWeight="900"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  className="tracking-tight"
                                >
                                  {shape.text}
                                </text>
                              </g>
                            )}
                          </g>
                        )}

                        {(shape.tool === 'player-away' || shape.tool === 'circle-red') && (
                          <g style={isSelected ? { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))' } : undefined}>
                            <circle
                              cx="0"
                              cy="0"
                              r="18"
                              fill="#dc2626"
                              stroke={isSelected ? '#facc15' : '#ffffff'}
                              strokeWidth={isSelected ? '4' : '3'}
                              className="drop-shadow-md transition-all"
                            />
                            <text
                              x="0"
                              y="0"
                              fill="#ffffff"
                              fontSize="11"
                              fontWeight="900"
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {shape.text || 'Địch'}
                            </text>
                          </g>
                        )}

                        {shape.tool === 'cross-red' && (
                          <g stroke={isSelected ? '#facc15' : '#ef4444'} strokeWidth="4" strokeLinecap="round" style={isSelected ? { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))' } : undefined}>
                            <line x1="-12" y1="-12" x2="12" y2="12" />
                            <line x1="12" y1="-12" x2="-12" y2="12" />
                          </g>
                        )}

                        {shape.tool === 'ball' && (
                          <text
                            x="0"
                            y="0"
                            fontSize="28"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={isSelected ? { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))' } : undefined}
                          >
                            ⚽
                          </text>
                        )}

                        {shape.tool === 'text' && (
                          <text
                            x="0"
                            y="0"
                            fill="#ffffff"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="drop-shadow-md"
                            style={isSelected ? { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))' } : undefined}
                          >
                            {shape.text}
                          </text>
                        )}
                      </svg>
                    )}

                    {shape.points.length > 1 && (
                      <g style={isSelected ? { filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.9))' } : undefined}>
                        <line
                          x1={`${shape.points[0].x}%`}
                          y1={`${shape.points[0].y}%`}
                          x2={`${shape.points[shape.points.length - 1].x}%`}
                          y2={`${shape.points[shape.points.length - 1].y}%`}
                          stroke={isSelected ? '#facc15' : shape.color}
                          strokeWidth={isSelected ? '5' : '3.5'}
                          strokeDasharray={shape.tool === 'dashed-arrow' ? '6,6' : undefined}
                          markerEnd={shape.tool === 'dashed-arrow' ? 'url(#arrowhead-yellow)' : 'url(#arrowhead-white)'}
                          className="transition-all"
                        />
                        {/* Expanded invisible thick line for comfortable touch/click target (28px) */}
                        <line
                          x1={`${shape.points[0].x}%`}
                          y1={`${shape.points[0].y}%`}
                          x2={`${shape.points[shape.points.length - 1].x}%`}
                          y2={`${shape.points[shape.points.length - 1].y}%`}
                          stroke="transparent"
                          strokeWidth="28"
                          className="cursor-pointer"
                        />
                      </g>
                    )}

                    {/* Selection Indicator & Delete Button (Shown when Selected) */}
                    {isSelected && (
                      <g key={`selection-frame-${shape.id}`}>
                        {shape.points.length === 1 && bounds && (
                          <>
                            {/* Single-point shapes: Translucent Box with Dashed Border around Node */}
                            <rect
                              x={`${bounds.x}%`}
                              y={`${bounds.y}%`}
                              width={`${bounds.width}%`}
                              height={`${bounds.height}%`}
                              fill="rgba(250, 204, 21, 0.16)"
                              stroke="#facc15"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                              rx="8"
                              className="pointer-events-none transition-all"
                            />
                            {/* Fixed Delete Button at Top-Right Corner of Node Box */}
                            <g
                              onClick={(e) => handleDeleteSingleShape(shape.id, e)}
                              onTouchStart={(e) => handleDeleteSingleShape(shape.id, e)}
                              className="cursor-pointer group/btn"
                              style={{ pointerEvents: 'all' }}
                            >
                              <circle
                                cx={`${bounds.maxX}%`}
                                cy={`${bounds.minY}%`}
                                r="11"
                                fill="#ef4444"
                                stroke="#ffffff"
                                strokeWidth="2"
                                className="shadow-md transition-colors group-hover/btn:fill-red-600"
                              />
                              <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round">
                                <line x1={`${bounds.maxX - 0.6}%`} y1={`${bounds.minY - 1.0}%`} x2={`${bounds.maxX + 0.6}%`} y2={`${bounds.minY + 1.0}%`} />
                                <line x1={`${bounds.maxX + 0.6}%`} y1={`${bounds.minY - 1.0}%`} x2={`${bounds.maxX - 0.6}%`} y2={`${bounds.minY + 1.0}%`} />
                              </g>
                            </g>
                          </>
                        )}

                        {shape.points.length > 1 && (
                          <>
                            {/* Multi-point Lines/Arrows: Compact Glowing Line Highlight along Arrow Path */}
                            <line
                              x1={`${shape.points[0].x}%`}
                              y1={`${shape.points[0].y}%`}
                              x2={`${shape.points[shape.points.length - 1].x}%`}
                              y2={`${shape.points[shape.points.length - 1].y}%`}
                              stroke="#facc15"
                              strokeWidth="9"
                              opacity="0.35"
                              strokeLinecap="round"
                              className="pointer-events-none"
                            />
                            {/* Start Handle Dot */}
                            <circle
                              cx={`${shape.points[0].x}%`}
                              cy={`${shape.points[0].y}%`}
                              r="5"
                              fill="#facc15"
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="shadow-sm pointer-events-none"
                            />
                            {/* End Handle Dot */}
                            <circle
                              cx={`${shape.points[shape.points.length - 1].x}%`}
                              cy={`${shape.points[shape.points.length - 1].y}%`}
                              r="5"
                              fill="#facc15"
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="shadow-sm pointer-events-none"
                            />
                            {/* Compact Delete Button at Arrow Head (End Point) */}
                            <g
                              onClick={(e) => handleDeleteSingleShape(shape.id, e)}
                              onTouchStart={(e) => handleDeleteSingleShape(shape.id, e)}
                              className="cursor-pointer group/btn"
                              style={{ pointerEvents: 'all' }}
                            >
                              <svg
                                x={`${shape.points[shape.points.length - 1].x}%`}
                                y={`${shape.points[shape.points.length - 1].y}%`}
                                overflow="visible"
                              >
                                <circle
                                  cx="14"
                                  cy="-14"
                                  r="11"
                                  fill="#ef4444"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  className="shadow-md transition-colors group-hover/btn:fill-red-600"
                                />
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

              {/* Render Glowing Yellow Neon Laser Pointer Cursor (Without lagging CSS scaling artifacts) */}
              {laserPos && (
                <g className="pointer-events-none">
                  {/* Soft Outer Neon Halo */}
                  <circle
                    cx={`${laserPos.x}%`}
                    cy={`${laserPos.y}%`}
                    r="18"
                    fill="rgba(250, 204, 21, 0.25)"
                    filter="url(#laser-neon-glow)"
                  />
                  {/* Neon Glow Ring */}
                  <circle
                    cx={`${laserPos.x}%`}
                    cy={`${laserPos.y}%`}
                    r="12"
                    fill="rgba(250, 204, 21, 0.6)"
                    filter="url(#laser-neon-glow)"
                  />
                  {/* Core Yellow Circle */}
                  <circle
                    cx={`${laserPos.x}%`}
                    cy={`${laserPos.y}%`}
                    r="7"
                    fill="#facc15"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Center White Core Spot */}
                  <circle
                    cx={`${laserPos.x}%`}
                    cy={`${laserPos.y}%`}
                    r="2.5"
                    fill="#ffffff"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Player Selector Modal Dialog */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-white p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100 text-emerald-600 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                    CHỌN CẦU THỦ THI ĐẤU (CẦU THỦ TA)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Gán tên & số áo cầu thủ lên sơ đồ chiến thuật
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPlayerModal(false);
                  setPendingPt(null);
                  setEditingShapeId(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Player List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">

              {/* Option 0: Default "Ta" */}
              <button
                onClick={() => handleSelectPlayerForShape(null)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    Ta
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-800 group-hover:text-emerald-700 block">
                      Mặc định (Nhãn "Ta")
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Icon hình tròn xanh lá mặc định</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">Chọn</span>
              </button>

              <div className="h-px bg-slate-100 my-2"></div>

              {/* Team Players List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teamPlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handleSelectPlayerForShape(player)}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        #{player.number}
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 truncate block">
                          {player.name}
                        </span>
                        {player.positions && player.positions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {player.positions.map((p) => {
                              const cfg = getPositionConfig(p);
                              return (
                                <span key={p} className={`text-[8.5px] font-black px-1 py-0.2 rounded border ${cfg.bgClass} ${cfg.textClass}`}>
                                  {cfg.shortLabel}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating Layer Panel (Popup Trôi Nổi Giữa / Góc Phải Màn Hình) */}
      {showLayerPanel && (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col max-h-[460px] animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-xl border border-blue-100 shadow-2xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center space-x-1.5">
                  <span>Quản Lý Lớp (Layer)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full">
                    {shapes.length}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  Chọn & chỉnh thứ tự lớp đối tượng bị chồng lên nhau
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLayerPanel(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Đóng bảng Layer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of shapes */}
          <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-100">
            {shapes.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <Layers className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-semibold">Chưa có đối tượng nào trên sân</p>
              </div>
            ) : (
              shapes.map((s, idx) => {
                const isSelected = selectedShapeId === s.id;
                let label = 'Đối tượng';
                let icon = <Layers className="w-4 h-4 text-slate-500" />;

                if (s.tool === 'player-home' || s.tool === 'circle-blue') {
                  label = s.number !== undefined ? `#${s.number} ${s.text || 'Cầu Thủ Ta'}` : (s.text || 'Cầu Thủ Ta');
                  icon = (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      {s.number !== undefined ? `#${s.number}` : 'Ta'}
                    </div>
                  );
                } else if (s.tool === 'player-away' || s.tool === 'circle-red') {
                  label = s.text || 'Cầu Thủ Địch';
                  icon = (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      Địch
                    </div>
                  );
                } else if (s.tool === 'arrow') {
                  label = 'Mũi tên di chuyển';
                  icon = <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />;
                } else if (s.tool === 'dashed-arrow') {
                  label = 'Đường chuyền bóng';
                  icon = <span className="font-mono text-xs font-black text-yellow-600 shrink-0">--➔</span>;
                } else if (s.tool === 'ball') {
                  label = 'Bóng Futsal ⚽';
                  icon = <span className="text-sm shrink-0">⚽</span>;
                } else if (s.tool === 'cross-red') {
                  label = 'Dấu X Đỏ';
                  icon = <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
                } else if (s.tool === 'text') {
                  label = `Văn bản: "${s.text || ''}"`;
                  icon = <Type className="w-4 h-4 text-slate-600 shrink-0" />;
                }

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedShapeId(s.id);
                      setActiveTool('select');
                    }}
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-300 text-blue-900 shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 font-semibold'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      {icon}
                      <span className="text-xs truncate">{label}</span>
                    </div>

                    {/* Layer Actions (Re-order Z-Index & Delete) */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLayerUp(idx);
                        }}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-200/70 disabled:opacity-30 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Đưa lên lớp phía trên"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLayerDown(idx);
                        }}
                        disabled={idx === shapes.length - 1}
                        className="p-1 hover:bg-slate-200/70 disabled:opacity-30 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Hạ xuống lớp phía dưới"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSingleShape(s.id, e);
                        }}
                        className="p-1 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="Xóa đối tượng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
};
