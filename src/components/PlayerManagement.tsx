import React, { useState, useMemo } from 'react';
import type { Player, PositionTag } from '../types/futsal';
import { POSITION_TAG_CONFIG, getPositionConfig } from '../types/futsal';
import { PlayerCard } from './PlayerCard';
import { Plus, Search, ArrowUpDown, LayoutGrid, List, X, Check, AlertCircle, Filter, Download, FileText, UserCheck } from 'lucide-react';

const getFullPositionLabel = (positions?: PositionTag[]): string => {
  if (!positions || positions.length === 0) return 'Chưa phân vị trí';
  return positions.map((p) => getPositionConfig(p).fullLabel).join(', ');
};

const getFormattedDateCode = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

const exportPlayersToCSV = (players: Player[]) => {
  const dateCode = getFormattedDateCode();
  const filename = `danh_sach_cau_thu_${dateCode}.csv`;

  // UTF-8 BOM so Excel & Sheets open Vietnamese characters flawlessly
  let csvContent = '\uFEFF';
  csvContent += 'Danh sách cầu thủ\n\n';
  csvContent += 'Số áo,Họ và tên cầu thủ,Vị trí\n';

  players.forEach((p) => {
    const number = p.number;
    const name = `"${(p.name || '').replace(/"/g, '""')}"`;
    const positions = `"${getFullPositionLabel(p.positions).replace(/"/g, '""')}"`;
    csvContent += `${number},${name},${positions}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPlayersToPDF = (players: Player[]) => {
  const dateCode = getFormattedDateCode();
  const filename = `danh_sach_cau_thu_${dateCode}_pdf`;
  const nowStr = new Date().toLocaleDateString('vi-VN');

  const rowsHtml = players
    .map(
      (p) => `
    <tr>
      <td style="text-align: center; font-weight: bold; padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.number}</td>
      <td style="font-weight: bold; padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${getFullPositionLabel(p.positions)}</td>
    </tr>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${filename}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 30px; color: #1e293b; }
          h1 { font-size: 24px; font-weight: 900; color: #2563eb; margin-bottom: 4px; }
          p.subtitle { font-size: 13px; color: #64748b; margin-bottom: 24px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
          th { background-color: #f8fafc; color: #475569; text-transform: uppercase; font-size: 12px; font-weight: 800; padding: 12px 10px; border-bottom: 2px solid #cbd5e1; text-align: left; }
          th.center { text-align: center; }
          footer { margin-top: 40px; text-align: right; font-size: 12px; color: #94a3b8; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>Danh sách cầu thủ</h1>
        <p class="subtitle">Ngày xuất: ${nowStr} • Tổng số: ${players.length} cầu thủ</p>
        <table>
          <thead>
            <tr>
              <th class="center" style="width: 80px;">Số áo</th>
              <th>Họ và tên cầu thủ</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <footer>Hệ thống Quản Lý Đội Hình Futsal FTSP</footer>
        <script>
          window.onload = function() {
            document.title = "${filename}";
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};

interface PlayerManagementProps {
  players: Player[];
  onSavePlayer: (player: Player) => void;
  onDeletePlayer: (id: string) => void;
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  onSavePlayer,
  onDeletePlayer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRated, setFilterRated] = useState<'all' | 'rated' | 'unrated'>('all');
  const [filterPosition, setFilterPosition] = useState<'all' | PositionTag>('all');
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'total' | 'stamina' | 'attack' | 'defense'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateTotal = (p: Player) => {
    let sum = 0;
    let count = 0;
    if (p.stamina !== null) { sum += p.stamina; count++; }
    if (p.attack !== null) { sum += p.attack; count++; }
    if (p.defense !== null) { sum += p.defense; count++; }
    return count > 0 ? sum : -1;
  };

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.toString().includes(searchTerm);
        if (!matchesSearch) return false;

        const isRated = p.stamina !== null || p.attack !== null || p.defense !== null;
        if (filterRated === 'rated' && !isRated) return false;
        if (filterRated === 'unrated' && isRated) return false;

        if (filterPosition !== 'all') {
          if (!p.positions || !p.positions.includes(filterPosition)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy as keyof Player];
        let valB: any = b[sortBy as keyof Player];

        if (sortBy === 'total') {
          valA = calculateTotal(a);
          valB = calculateTotal(b);
        }

        if (valA === null || valA === undefined || valA === -1) valA = sortOrder === 'asc' ? 999 : -999;
        if (valB === null || valB === undefined || valB === -1) valB = sortOrder === 'asc' ? 999 : -999;

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [players, searchTerm, filterRated, filterPosition, sortBy, sortOrder]);

  const handleOpenAddModal = () => {
    const usedNumbers = new Set(players.map((p) => p.number));
    let nextNumber = 1;
    while (usedNumbers.has(nextNumber)) {
      nextNumber++;
    }
    setErrorMsg(null);
    setEditingPlayer({
      id: Date.now().toString(),
      number: nextNumber,
      name: '',
      stamina: null,
      attack: null,
      defense: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (player: Player) => {
    setErrorMsg(null);
    setEditingPlayer({ ...player });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!editingPlayer || !editingPlayer.name) return;

    const targetNumber = Number(editingPlayer.number);
    if (!targetNumber || targetNumber < 1) {
      setErrorMsg('Vui lòng nhập số áo hợp lệ (lớn hơn 0)!');
      return;
    }

    // Check for duplicate shirt number
    const duplicate = players.find(
      (p) => p.number === targetNumber && p.id !== editingPlayer.id
    );

    if (duplicate) {
      setErrorMsg(`⚠️ Số áo #${targetNumber} đã trùng với cầu thủ "${duplicate.name}"! Vui lòng chọn số áo khác.`);
      return;
    }

    onSavePlayer({
      id: editingPlayer.id || Date.now().toString(),
      number: targetNumber,
      name: editingPlayer.name,
      avatar: editingPlayer.avatar,
      stamina: editingPlayer.stamina !== null && editingPlayer.stamina !== undefined && editingPlayer.stamina !== ('' as any) ? Number(editingPlayer.stamina) : null,
      attack: editingPlayer.attack !== null && editingPlayer.attack !== undefined && editingPlayer.attack !== ('' as any) ? Number(editingPlayer.attack) : null,
      defense: editingPlayer.defense !== null && editingPlayer.defense !== undefined && editingPlayer.defense !== ('' as any) ? Number(editingPlayer.defense) : null,
      positions: editingPlayer.positions || [],
      notes: editingPlayer.notes || '',
    });

    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số áo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setFilterRated('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterRated === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({players.length})
            </button>
            <button
              onClick={() => setFilterRated('rated')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterRated === 'rated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã đánh giá
            </button>
            <button
              onClick={() => setFilterRated('unrated')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterRated === 'unrated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chưa đánh giá
            </button>
          </div>

          {/* Position Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Vị trí:</span>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value as any)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-900"
            >
              <option value="all">Tất cả vị trí</option>
              <option value="GK">🧤 Thủ Môn</option>
              <option value="FI">🟣 Hậu Vệ</option>
              <option value="AL_L">🔵 Tiền Vệ Cánh Trái</option>
              <option value="AL_R">🟣 Tiền Vệ Cánh Phải</option>
              <option value="PI">🟠 Tiền Đạo</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
            >
              <option value="number">Số áo</option>
              <option value="name">Tên</option>
              <option value="total">Tổng chỉ số</option>
              <option value="stamina">Thể Lực (TL)</option>
              <option value="attack">Tấn Công (TC)</option>
              <option value="defense">Phòng Thủ (PT)</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-700 font-black cursor-pointer"
              title="Thứ tự tăng/giảm"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Hiển thị dạng thẻ (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Hiển thị danh sách tối giản (List)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Export Roster Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
              title="Xuất danh sách cầu thủ ra file CSV hoặc PDF"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Xuất Danh Sách</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 space-y-1">
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    exportPlayersToCSV(filteredAndSortedPlayers);
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Xuất File CSV (.csv)</span>
                </button>
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    exportPlayersToPDF(filteredAndSortedPlayers);
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer text-left"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Xuất File PDF (.pdf)</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Player Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Cầu Thủ</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredAndSortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={handleOpenEditModal}
              onDelete={onDeletePlayer}
            />
          ))}
        </div>
      ) : (
        /* Minimal List View Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 min-w-[700px]">
            <thead className="bg-slate-50 text-xs uppercase font-extrabold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 px-5 w-16 text-center">#</th>
                <th className="py-4 px-5">Tên cầu thủ</th>
                <th className="py-4 px-5">Vị Trí</th>
                <th className="py-4 px-5 text-center">🟢 Thể Lực (TL)</th>
                <th className="py-4 px-5 text-center">🟠 Tấn Công (TC)</th>
                <th className="py-4 px-5 text-center">🔵 Phòng Thủ (PT)</th>
                <th className="py-4 px-5 text-center">Tổng Điểm</th>
                <th className="py-4 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredAndSortedPlayers.map((p) => {
                const total = calculateTotal(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 text-center font-black text-slate-900">{p.number}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-5">
                      {p.positions && p.positions.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {p.positions.map((pos) => {
                            const cfg = getPositionConfig(pos);
                            return (
                              <span
                                key={pos}
                                className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
                              >
                                {cfg.shortLabel}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">Chưa chọn</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-emerald-600">
                      {p.stamina !== null ? p.stamina : '-'}
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-orange-600">
                      {p.attack !== null ? p.attack : '-'}
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-blue-600">
                      {p.defense !== null ? p.defense : '-'}
                    </td>
                    <td className="py-3.5 px-5 text-center font-black text-slate-900">
                      {total !== -1 ? total : '-'}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onDeletePlayer(p.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200/90 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2.5 rounded-2xl border border-blue-100 text-blue-600 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                    {players.some((p) => p.id === editingPlayer.id) ? 'Chỉnh Sửa Cầu Thủ' : 'Thêm Cầu Thủ Mới'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Cập nhật vị trí, đặc điểm và chỉ số kỹ năng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning / Error alert if duplicate shirt number exists */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl flex items-center space-x-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Áo (#)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    value={editingPlayer.number || ''}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) || 0 });
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Cầu Thủ</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên..."
                    value={editingPlayer.name || ''}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setEditingPlayer({ ...editingPlayer, name: e.target.value });
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              {/* Individual Player Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  📝 Ghi Chú Đặc Điểm (Ví dụ: Dễ bị tâm lý, Tỷ lệ phản lưới nhà cao...)
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhập ghi chú đặc điểm cá nhân, tâm lý hoặc điểm mạnh/yếu..."
                  value={editingPlayer.notes || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800"
                />
              </div>

              {/* Position Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vị Trí Thi Đấu Có Thể Đảm Nhận
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {(['GK', 'FI', 'AL_L', 'AL_R', 'PI'] as PositionTag[]).map((pos) => {
                    const cfg = POSITION_TAG_CONFIG[pos];
                    const isSelected = editingPlayer.positions?.includes(pos);
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => {
                          const currentPos = editingPlayer.positions || [];
                          const updated = isSelected
                            ? currentPos.filter((p) => p !== pos)
                            : [...currentPos, pos];
                          setEditingPlayer({ ...editingPlayer, positions: updated });
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-black border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ring-2 ring-blue-500/30`
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{cfg.fullLabel}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats Sliders */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chỉ Số Kỹ Năng (0 - 10)</p>

                {/* Thể Lực */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="text-emerald-600">🟢 Thể Lực (TL)</span>
                    <span>{editingPlayer.stamina !== null && editingPlayer.stamina !== undefined ? editingPlayer.stamina : 'Chưa đánh giá'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editingPlayer.stamina ?? 0}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, stamina: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Tấn Công */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="text-orange-600">🟠 Tấn Công (TC)</span>
                    <span>{editingPlayer.attack !== null && editingPlayer.attack !== undefined ? editingPlayer.attack : 'Chưa đánh giá'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editingPlayer.attack ?? 0}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, attack: parseFloat(e.target.value) })}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                {/* Phòng Thủ */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="text-blue-600">🔵 Phòng Thủ (PT)</span>
                    <span>{editingPlayer.defense !== null && editingPlayer.defense !== undefined ? editingPlayer.defense : 'Chưa đánh giá'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editingPlayer.defense ?? 0}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, defense: parseFloat(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Cầu Thủ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
