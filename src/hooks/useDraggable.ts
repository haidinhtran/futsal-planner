import { useState, useEffect, useRef, type RefObject } from "react";

export function useDraggable(
  containerRef: RefObject<HTMLElement | null>,
  draggableRef: RefObject<HTMLElement | null>,
  isFullscreen: boolean,
  isExpanded: boolean
) {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragLimitsRef = useRef<{ minX: number; maxX: number; minY: number; maxY: number } | null>(null);

  useEffect(() => {
    setPos({ x: 0, y: 0 });
  }, [isFullscreen, isExpanded]);

  const handleDragStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (containerRef.current && draggableRef.current) {
      const parentRect = containerRef.current.getBoundingClientRect();
      const childRect = draggableRef.current.getBoundingClientRect();

      const baseLeft = childRect.left - pos.x;
      const baseTop = childRect.top - pos.y;

      const minX = parentRect.left - baseLeft;
      const maxX = parentRect.right - childRect.width - baseLeft;
      const minY = parentRect.top - baseTop;
      const maxY = parentRect.bottom - childRect.height - baseTop;

      dragLimitsRef.current = { minX, maxX, minY, maxY };
    }

    setIsDragging(true);
    setDragStartPos({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rawX = e.clientX - dragStartPos.x;
      const rawY = e.clientY - dragStartPos.y;

      if (dragLimitsRef.current) {
        const { minX, maxX, minY, maxY } = dragLimitsRef.current;
        const clampedX = Math.max(minX, Math.min(maxX, rawX));
        const clampedY = Math.max(minY, Math.min(maxY, rawY));
        setPos({ x: clampedX, y: clampedY });
      } else {
        setPos({ x: rawX, y: rawY });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, dragStartPos]);

  return { pos, handleDragStart };
}
