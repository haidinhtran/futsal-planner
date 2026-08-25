import type { DrawShape, Player } from "@/types/futsal";
import { storageService } from "@/services/storageService";
import { getVietnameseShortName } from "@/utils/pitchHelpers";

export const getRelativeCoords = (
  clientX: number,
  clientY: number,
  canvasRef: React.RefObject<SVGSVGElement | null>,
) => {
  if (!canvasRef.current) return { x: 0, y: 0 };
  const rect = canvasRef.current.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  return {
    x: Number(Math.max(0, Math.min(100, x)).toFixed(2)),
    y: Number(Math.max(0, Math.min(100, y)).toFixed(2)),
  };
};

export const getShapeBounds = (shape: DrawShape) => {
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
    if (shape.tool === "text") {
      const textLen = shape.text?.length || 4;
      padX = Math.max(2.2, textLen * 0.4);
      padYTop = 2.0;
      padYBottom = 2.0;
    } else if (
      shape.tool === "player-home" &&
      shape.number !== undefined &&
      shape.text &&
      shape.text !== "Ta"
    ) {
      padX = 3.2;
      padYTop = 2.8;
      padYBottom = 5.8; // Tight bottom padding enclosing player name badge
    } else if (
      shape.tool === "player-home" ||
      shape.tool === "player-away" ||
      shape.tool === "circle-blue" ||
      shape.tool === "circle-red"
    ) {
      padX = 2.0;
      padYTop = 2.6;
      padYBottom = 2.6;
    } else if (shape.tool === "ball" || shape.tool === "cross-red") {
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

export const generateNextDraftName = () => {
  const existing = storageService.getDiagrams();
  const draftNumbers = existing
    .map((d) => {
      const match = d.name.match(/^Draft-(\d+)$/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const maxNum = draftNumbers.length > 0 ? Math.max(...draftNumbers) : 0;
  const nextNum = (maxNum + 1).toString().padStart(3, "0");
  return `Draft-${nextNum}`;
};

export const resolvePlayerShortName = (player: Player) => {
  return player.jerseyName || getVietnameseShortName(player.name);
};
