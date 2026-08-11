import React from 'react';
import { Layers, X, ChevronUp, ChevronDown, Trash2, ArrowRight, XCircle, Type } from 'lucide-react';

export interface DiagramShapeItem {
  id: string;
  tool: string;
  number?: number;
  text?: string;
  color?: string;
}

interface LayerPanelModalProps {
  showLayerPanel: boolean;
  onClose: () => void;
  shapes: DiagramShapeItem[];
  selectedShapeId: string | null;
  onSelectShape: (id: string) => void;
  onMoveLayerUp: (index: number) => void;
  onMoveLayerDown: (index: number) => void;
  onDeleteSingleShape: (id: string, e: React.MouseEvent) => void;
}

export const LayerPanelModal: React.FC<LayerPanelModalProps> = ({
  showLayerPanel,
  onClose,
  shapes,
  selectedShapeId,
  onSelectShape,
  onMoveLayerUp,
  onMoveLayerDown,
  onDeleteSingleShape,
}) => {
  if (!showLayerPanel) return null;

  return (
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
          onClick={onClose}
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
                onClick={() => onSelectShape(s.id)}
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
                      onMoveLayerUp(idx);
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
                      onMoveLayerDown(idx);
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
                      onDeleteSingleShape(s.id, e);
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
  );
};
