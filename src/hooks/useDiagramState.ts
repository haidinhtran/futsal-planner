import { useState, useEffect, useMemo } from "react";
import type { DrawShape, DrawTool, Player, SavedTacticalDiagram } from "@/types/futsal";
import { storageService } from "@/services/storageService";
import { generateNextDraftName, resolvePlayerShortName, getRelativeCoords } from "@/utils/diagramHelpers";

export function useDiagramState(
  initialPlayers?: Player[],
  dataRefreshToken?: number,
  canvasRef?: React.RefObject<SVGSVGElement | null>
) {
  const [activeTool, setActiveTool] = useState<DrawTool>("select");
  const [shapes, setShapes] = useState<DrawShape[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [textInput] = useState<string>("");

  const [teamPlayers, setTeamPlayers] = useState<Player[]>(() => initialPlayers || storageService.getPlayers());
  useEffect(() => {
    if (initialPlayers) setTeamPlayers(initialPlayers);
  }, [initialPlayers]);

  const [savedDiagrams, setSavedDiagrams] = useState<SavedTacticalDiagram[]>(() => storageService.getDiagrams());
  useEffect(() => {
    setSavedDiagrams(storageService.getDiagrams());
  }, [dataRefreshToken]);

  const [diagramName, setDiagramName] = useState<string>("Draft-001");
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [draggingShapeId, setDraggingShapeId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [initialShapePoints, setInitialShapePoints] = useState<Array<{ x: number; y: number }> | null>(null);

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [pendingPt, setPendingPt] = useState<{ x: number; y: number } | null>(null);
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
  
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);

  useEffect(() => setSelectedShapeId(null), [activeTool]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && shapes.length > 0) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, shapes.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedShapeId) {
        setShapes((prev) => prev.filter((s) => s.id !== selectedShapeId));
        setSelectedShapeId(null);
        setIsDirty(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapeId]);

  const handleSaveDiagram = () => {
    const inputName = prompt("Nhập tên bản vẽ chiến thuật:", diagramName || "Draft-001");
    if (inputName === null) return;
    const finalName = inputName.trim() || diagramName || "Draft-001";
    const diagramId = currentDiagramId || Date.now().toString();
    const newDiagram: SavedTacticalDiagram = {
      id: diagramId, name: finalName, shapes: [...shapes], updatedAt: new Date().toISOString(),
    };
    storageService.saveDiagram(newDiagram);
    setSavedDiagrams(storageService.getDiagrams());
    setDiagramName(finalName);
    setCurrentDiagramId(diagramId);
    setIsDirty(false);
  };

  const handleLoadDiagram = (diagramId: string) => {
    if (!diagramId) return;
    if (isDirty && shapes.length > 0 && !window.confirm("Bản vẽ hiện tại chưa được lưu. Bạn có chắc chắn muốn chuyển sang bản vẽ khác?")) return;
    const found = savedDiagrams.find((d) => d.id === diagramId);
    if (found) {
      setShapes([...found.shapes.map((s) => ({ ...s, points: [...s.points] }))]);
      setDiagramName(found.name);
      setCurrentDiagramId(found.id);
      setSelectedShapeId(null);
      setIsDirty(false);
    }
  };

  const handleNewDiagram = () => {
    if (isDirty && shapes.length > 0 && !window.confirm("Bản vẽ hiện tại chưa được lưu. Bạn có chắc chắn muốn tạo bản vẽ mới?")) return;
    setShapes([]);
    setDiagramName(generateNextDraftName());
    setCurrentDiagramId(null);
    setSelectedShapeId(null);
    setIsDirty(false);
  };

  const handleDeleteCurrentDiagram = () => {
    if (!currentDiagramId) {
      if (window.confirm("Xóa sạch tất cả các nét vẽ trên màn hình?")) {
        setShapes([]);
        setSelectedShapeId(null);
        setIsDirty(false);
      }
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản vẽ "${diagramName}" khỏi danh sách đã lưu?`)) {
      storageService.deleteDiagram(currentDiagramId);
      setSavedDiagrams(storageService.getDiagrams());
      setShapes([]);
      setDiagramName(generateNextDraftName());
      setCurrentDiagramId(null);
      setSelectedShapeId(null);
      setIsDirty(false);
    }
  };

  const loadPresetRun = (presetType: "side" | "pivot" | "defense") => {
    let presetShapes: DrawShape[] = [];
    if (presetType === "side") {
      presetShapes = [
        { id: "1", tool: "player-home", points: [{ x: 30, y: 70 }], color: "#16a34a", text: "Thái Tuấn", number: 4 },
        { id: "2", tool: "player-home", points: [{ x: 35, y: 35 }], color: "#16a34a", text: "Hữu Thành", number: 6 },
        { id: "3", tool: "player-home", points: [{ x: 75, y: 35 }], color: "#16a34a", text: "Cao Tấn", number: 9 },
        { id: "4", tool: "player-away", points: [{ x: 50, y: 35 }], color: "#dc2626", text: "Địch" },
        { id: "5", tool: "player-away", points: [{ x: 70, y: 40 }], color: "#dc2626", text: "Địch" },
        { id: "6", tool: "ball", points: [{ x: 30, y: 70 }], color: "#ffffff" },
        { id: "7", tool: "dashed-arrow", points: [{ x: 30, y: 70 }, { x: 75, y: 35 }], color: "#facc15" },
        { id: "8", tool: "arrow", points: [{ x: 30, y: 70 }, { x: 55, y: 80 }, { x: 80, y: 65 }], color: "#ffffff" },
      ];
    } else if (presetType === "pivot") {
      presetShapes = [
        { id: "1", tool: "player-home", points: [{ x: 25, y: 50 }], color: "#16a34a", text: "Tấn Phong", number: 2 },
        { id: "2", tool: "player-home", points: [{ x: 75, y: 50 }], color: "#16a34a", text: "Bình An", number: 10 },
        { id: "3", tool: "player-away", points: [{ x: 70, y: 50 }], color: "#dc2626", text: "Địch" },
        { id: "4", tool: "ball", points: [{ x: 25, y: 50 }], color: "#ffffff" },
        { id: "5", tool: "dashed-arrow", points: [{ x: 25, y: 50 }, { x: 75, y: 50 }], color: "#facc15" },
        { id: "6", tool: "arrow", points: [{ x: 35, y: 30 }, { x: 65, y: 25 }], color: "#ffffff" },
        { id: "7", tool: "player-home", points: [{ x: 35, y: 30 }], color: "#16a34a", text: "Hữu Thành", number: 6 },
      ];
    } else if (presetType === "defense") {
      presetShapes = [
        { id: "1", tool: "player-away", points: [{ x: 65, y: 25 }], color: "#dc2626", text: "Địch" },
        { id: "2", tool: "arrow", points: [{ x: 65, y: 25 }, { x: 40, y: 40 }], color: "#ef4444" },
        { id: "3", tool: "player-home", points: [{ x: 40, y: 40 }], color: "#16a34a", text: "Thái Tuấn", number: 4 },
        { id: "4", tool: "player-home", points: [{ x: 25, y: 60 }], color: "#16a34a", text: "Tấn Phong", number: 2 },
        { id: "5", tool: "cross-red", points: [{ x: 50, y: 45 }], color: "#ef4444" },
        { id: "6", tool: "ball", points: [{ x: 65, y: 25 }], color: "#ffffff" },
      ];
    }
    setShapes(presetShapes);
    setSelectedShapeId(null);
    setIsDirty(true);
  };

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

  const handleDeleteSingleShape = (shapeId: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    if (selectedShapeId === shapeId) setSelectedShapeId(null);
    setIsDirty(true);
  };

  const handleSelectPlayerForShape = (selectedPlayer: Player | null) => {
    if (!selectedPlayer) {
      if (editingShapeId) {
        setShapes((prev) => prev.map((s) => s.id === editingShapeId ? { ...s, text: "Ta", number: undefined } : s));
      } else if (pendingPt) {
        const newShape: DrawShape = { id: Date.now().toString(), tool: "player-home", points: [pendingPt], color: "#16a34a", text: "Ta" };
        setShapes((prev) => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
      }
    } else {
      const shortName = resolvePlayerShortName(selectedPlayer);
      if (editingShapeId) {
        setShapes((prev) => prev.map((s) => s.id === editingShapeId ? { ...s, text: shortName, number: selectedPlayer.number, playerId: selectedPlayer.id } : s));
      } else if (pendingPt) {
        const newShape: DrawShape = { id: Date.now().toString(), tool: "player-home", points: [pendingPt], color: "#16a34a", text: shortName, number: selectedPlayer.number, playerId: selectedPlayer.id };
        setShapes((prev) => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
      }
    }
    setIsDirty(true);
    setShowPlayerModal(false);
    setPendingPt(null);
    setEditingShapeId(null);
  };

  const sortedShapes = useMemo(() => {
    if (!selectedShapeId) return shapes;
    const unselected = shapes.filter((s) => s.id !== selectedShapeId);
    const selected = shapes.filter((s) => s.id === selectedShapeId);
    return [...unselected, ...selected];
  }, [shapes, selectedShapeId]);

  const handleShapeStart = (shapeId: string, pt: { x: number; y: number }, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (activeTool === "eraser") {
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

  const handleCanvasStart = (clientX: number, clientY: number) => {
    if (!canvasRef) return;
    const pt = getRelativeCoords(clientX, clientY, canvasRef);
    if (activeTool === "pointer") {
      setLaserPos(pt);
      return;
    }
    if (activeTool === "select" || activeTool === "eraser") {
      setSelectedShapeId(null);
      return;
    }
    if (activeTool === "player-home" || activeTool === "circle-blue") {
      setPendingPt(pt);
      setEditingShapeId(null);
      setShowPlayerModal(true);
      return;
    }
    if (activeTool === "player-away" || activeTool === "circle-red" || activeTool === "cross-red" || activeTool === "ball") {
      const toolType = activeTool === "circle-red" ? "player-away" : activeTool;
      const newShape: DrawShape = {
        id: Date.now().toString(),
        tool: toolType,
        points: [pt],
        color: toolType === "player-away" || toolType === "cross-red" ? "#dc2626" : "#ffffff",
      };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
      setIsDirty(true);
      return;
    }
    if (activeTool === "text") {
      const text = prompt("Nhập văn bản ghi chú chiến thuật:", textInput || "Chạy biên");
      if (text) {
        const newShape: DrawShape = { id: Date.now().toString(), tool: "text", points: [pt], color: "#ffffff", text };
        setShapes((prev) => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
        setIsDirty(true);
      }
      return;
    }
    setIsDrawing(true);
    setCurrentPoints([pt]);
  };

  const handleCanvasMove = (clientX: number, clientY: number) => {
    if (!canvasRef) return;
    const pt = getRelativeCoords(clientX, clientY, canvasRef);
    if (activeTool === "pointer") {
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
          const updatedPoints = initialShapePoints.map((p) => ({ x: Number((p.x + dx).toFixed(2)), y: Number((p.y + dy).toFixed(2)) }));
          return { ...s, points: updatedPoints };
        })
      );
      setIsDirty(true);
      return;
    }
    if (!isDrawing) return;
    setCurrentPoints((prev) => [...prev, pt]);
  };

  const handleCanvasEnd = () => {
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
        color: activeTool === "dashed-arrow" ? "#facc15" : "#ffffff",
      };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
      setIsDirty(true);
    }
    setCurrentPoints([]);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => handleCanvasStart(e.clientX, e.clientY);
  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => handleCanvasMove(e.clientX, e.clientY);
  const handleCanvasMouseUp = () => handleCanvasEnd();
  
  const handleCanvasTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length > 0) handleCanvasStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleCanvasTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length > 0) handleCanvasMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleCanvasTouchEnd = () => handleCanvasEnd();

  const handleUndo = () => {
    setShapes((prev) => prev.slice(0, -1));
    setIsDirty(true);
  };

  const handleClearAll = () => {
    setShapes([]);
    setSelectedShapeId(null);
    setIsDirty(true);
  };

  return {
    activeTool, setActiveTool,
    shapes, setShapes,
    currentPoints, isDrawing, laserPos,
    teamPlayers, savedDiagrams, diagramName, currentDiagramId, isDirty,
    selectedShapeId, setSelectedShapeId,
    showPlayerModal, setShowPlayerModal, setEditingShapeId,
    showLayerPanel, setShowLayerPanel,
    sortedShapes,
    handleSaveDiagram, handleLoadDiagram, handleNewDiagram, handleDeleteCurrentDiagram,
    loadPresetRun, handleMoveLayerUp, handleMoveLayerDown, handleDeleteSingleShape,
    handleSelectPlayerForShape, handleShapeStart,
    handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp,
    handleCanvasTouchStart, handleCanvasTouchMove, handleCanvasTouchEnd,
    handleUndo, handleClearAll
  };
}
