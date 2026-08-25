import React, { useRef, useState, useEffect } from 'react';
import {
  GripVertical, Maximize, Minimize, Settings, ChevronRight,
  ArrowLeftRight, RefreshCw, Trash2, Save, Users,
} from 'lucide-react';
import { FORMATION_PRESETS } from '@/services/initialData';
import { useDraggable } from '@/hooks/useDraggable';
import type { AttackDirection } from '@/types/futsal';

interface PitchToolbarProps {
  currentFormationId: string;
  attackDirection: AttackDirection;
  showSubs: boolean;
  isFullscreen: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onSelectFormation: (formationId: string) => void;
  onToggleAttackDirection: () => void;
  onQuickSwap: () => void;
  onToggleShowSubs: () => void;
  onResetPreset: () => void;
  onClearAllSlots: () => void;
  onSaveSquad: () => void;
  onToggleFullscreen: () => void;
}

export const PitchToolbar: React.FC<PitchToolbarProps> = ({
  currentFormationId, attackDirection, showSubs, isFullscreen, containerRef,
  onSelectFormation, onToggleAttackDirection, onQuickSwap, onToggleShowSubs,
  onResetPreset, onClearAllSlots, onSaveSquad, onToggleFullscreen,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(isFullscreen);
  const { pos, handleDragStart } = useDraggable(containerRef, toolbarRef, isFullscreen, isExpanded);

  useEffect(() => {
    setIsExpanded(isFullscreen);
  }, [isFullscreen]);

  return (
    <div
      ref={toolbarRef}
      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 flex items-start justify-end pointer-events-none gap-2 max-w-[calc(100%-1rem)]"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      {isExpanded ? (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg p-1.5 flex items-center gap-1.5 text-slate-800 max-w-full overflow-x-auto select-none">
          <div onPointerDown={handleDragStart} className="h-8 p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 flex items-center justify-center shrink-0" title="Di chuyển">
            <GripVertical className="w-4 h-4" />
          </div>
          <select
            value={currentFormationId}
            onChange={(e) => onSelectFormation(e.target.value)}
            className="h-8 bg-white hover:bg-slate-50 text-blue-700 font-black text-xs px-2 rounded-md border border-slate-200 cursor-pointer focus:outline-none shrink-0"
            title="Chọn sơ đồ"
          >
            {FORMATION_PRESETS.map((f) => (<option key={f.id} value={f.id}>{f.name} ({f.subName})</option>))}
          </select>
          <button onClick={onToggleAttackDirection} className="h-8 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-bold shrink-0" title="Đổi hướng công">
            {attackDirection === 'right' ? '➔ Phải' : '⬅ Trái'}
          </button>
          <button onClick={onQuickSwap} className="h-8 w-8 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md flex items-center justify-center shrink-0" title="Đổi cánh (Ala T ↔ P)">
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <button onClick={onToggleShowSubs} className={`h-8 px-2 rounded-md border text-xs font-bold shrink-0 flex items-center gap-1 ${showSubs ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`} title="Ẩn/Hiện dự bị">
            <Users className="w-3.5 h-3.5" /><span className="hidden sm:inline">Dự bị</span>
          </button>
          <button onClick={onResetPreset} className="h-8 w-8 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md flex items-center justify-center shrink-0" title="Đặt lại sơ đồ">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClearAllSlots} className="h-8 w-8 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-md flex items-center justify-center shrink-0" title="Xóa tất cả">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onSaveSquad} className="h-8 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shrink-0 flex items-center gap-1 shadow-xs" title="Lưu đội hình">
            <Save className="w-3.5 h-3.5" /><span>Lưu</span>
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0" />
          <button onClick={onToggleFullscreen} className="h-8 px-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-xs font-black shrink-0 flex items-center gap-1" title={isFullscreen ? 'Thoát Toàn Màn Hình' : 'Toàn Màn Hình'}>
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Thoát' : 'Toàn màn hình'}</span>
          </button>
          <button onClick={() => setIsExpanded(false)} className="h-8 px-1.5 hover:bg-slate-100 rounded-md text-slate-500 flex items-center justify-center gap-0.5 shrink-0" title="Thu gọn công cụ">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto select-none">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-8 h-8 bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-md rounded-lg flex items-center justify-center cursor-pointer transition-all"
            title="Cấu hình & Công cụ"
          >
            <Settings className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}
    </div>
  );
};
