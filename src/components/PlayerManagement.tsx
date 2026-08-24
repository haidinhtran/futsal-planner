import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useStickyActions } from "../hooks/useStickyActions";
import ExcelJS from "exceljs";
import type { Player, PositionTag } from "../types/futsal";
import { getPositionConfig, getUniquePositionConfigs } from "../types/futsal";
import { PlayerCard } from "./PlayerCard";
import {
  X,
  Check,
  AlertCircle,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Search,
  Plus,
  Download,
} from "lucide-react";
import { removeVietnameseTones } from "../utils/vietnamese";

const getFullPositionLabel = (positions?: PositionTag[]): string => {
  if (!positions || positions.length === 0) return "Chưa phân vị trí";
  return positions.map((p) => getPositionConfig(p).fullLabel).join(", ");
};

const getFormattedDateCode = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

const exportPlayersToXLSX = async (players: Player[]) => {
  const dateCode = getFormattedDateCode();
  const nowStr = new Date().toLocaleDateString("vi-VN");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FTSP";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Danh sách cầu thủ", {
    views: [{ showGridLines: false }],
  });
  worksheet.columns = [
    { key: "number", width: 12 },
    { key: "name", width: 32 },
    { key: "positions", width: 52 },
  ];

  worksheet.mergeCells("A1:C1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "DANH SÁCH CẦU THỦ";
  titleCell.font = {
    name: "Arial",
    size: 16,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells("A2:C2");
  const subtitleCell = worksheet.getCell("A2");
  subtitleCell.value = `Ngày xuất: ${nowStr} | Tổng số: ${players.length} cầu thủ`;
  subtitleCell.font = {
    name: "Arial",
    size: 10,
    italic: true,
    color: { argb: "FF475569" },
  };
  subtitleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 20;

  const headerRow = worksheet.getRow(4);
  headerRow.values = ["Số áo", "Họ và tên cầu thủ", "Vị trí"];
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Arial",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F766E" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF0F766E" } },
      left: { style: "thin", color: { argb: "FF0F766E" } },
      bottom: { style: "thin", color: { argb: "FF0F766E" } },
      right: { style: "thin", color: { argb: "FF0F766E" } },
    };
  });

  players.forEach((player, index) => {
    const nameToDisplay = player.jerseyName ? `${player.name} (${player.jerseyName})` : player.name;
    const row = worksheet.addRow({
      number: player.number,
      name: nameToDisplay,
      positions: getFullPositionLabel(player.positions),
    });
    row.height = 21;
    row.eachCell((cell, columnNumber) => {
      cell.font = { name: "Arial", size: 11, bold: columnNumber === 2 };
      cell.alignment = {
        horizontal: columnNumber === 1 ? "center" : "left",
        vertical: "middle",
        wrapText: columnNumber === 3,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: index % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });
  });

  worksheet.autoFilter = {
    from: "A4",
    to: `C${Math.max(4, players.length + 4)}`,
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `danh_sach_cau_thu_${dateCode}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPlayersToPDF = (players: Player[]) => {
  const dateCode = getFormattedDateCode();
  const filename = `danh_sach_cau_thu_${dateCode}_pdf`;
  const nowStr = new Date().toLocaleDateString("vi-VN");

  const rowsHtml = players
    .map(
      (p) => `
    <tr>
      <td style="text-align: center; font-weight: bold; padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.number}</td>
      <td style="font-weight: bold; padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.jerseyName ? `${p.name} (${p.jerseyName})` : p.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${getFullPositionLabel(p.positions)}</td>
    </tr>
  `,
    )
    .join("");

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

  const printWindow = window.open("", "_blank");
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
  editRequest?: { playerId: string; nonce: number } | null;
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  onSavePlayer,
  onDeletePlayer,
  editRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState<"all" | PositionTag>(
    "all",
  );
  const [sortBy, setSortBy] = useState<
    "number" | "name" | "total" | "stamina" | "attack" | "defense"
  >("number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { isSticky, sentinelRef } = useStickyActions();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const calculateTotal = (p: Player) => {
    let sum = 0;
    let count = 0;
    if (p.stamina !== null) {
      sum += p.stamina;
      count++;
    }
    if (p.attack !== null) {
      sum += p.attack;
      count++;
    }
    if (p.defense !== null) {
      sum += p.defense;
      count++;
    }
    return count > 0 ? sum : -1;
  };

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter((p) => {
        const normalizedTerm = removeVietnameseTones(searchTerm);
        const normalizedName = removeVietnameseTones(p.name);
        const normalizedNotes = removeVietnameseTones(p.notes || "");

        const matchesSearch =
          !normalizedTerm ||
          normalizedName.includes(normalizedTerm) ||
          p.number.toString().includes(searchTerm.trim()) ||
          normalizedNotes.includes(normalizedTerm);

        if (!matchesSearch) return false;

        if (filterPosition !== "all") {
          if (!p.positions || !p.positions.includes(filterPosition)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy as keyof Player];
        let valB: any = b[sortBy as keyof Player];

        if (sortBy === "total") {
          valA = calculateTotal(a);
          valB = calculateTotal(b);
        }

        if (valA === null || valA === undefined || valA === -1)
          valA = sortOrder === "asc" ? 999 : -999;
        if (valB === null || valB === undefined || valB === -1)
          valB = sortOrder === "asc" ? 999 : -999;

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [players, searchTerm, filterPosition, sortBy, sortOrder]);

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
      name: "",
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

  // Removed onRegisterControls

  // Open edit modal for a player requested from another module (e.g. TacticsBoard)
  useEffect(() => {
    if (!editRequest) return;
    const target = players.find((p) => p.id === editRequest.playerId);
    if (target) {
      handleOpenEditModal(target);
    }
  }, [editRequest]);

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!editingPlayer || !editingPlayer.name) return;

    const targetNumber = Number(editingPlayer.number);
    if (editingPlayer.number === undefined || editingPlayer.number === null || isNaN(targetNumber) || targetNumber < 0) {
      setErrorMsg("Vui lòng nhập số áo hợp lệ (lớn hơn hoặc bằng 0)!");
      return;
    }

    onSavePlayer({
      id: editingPlayer.id || Date.now().toString(),
      number: targetNumber,
      name: editingPlayer.name,
      jerseyName: editingPlayer.jerseyName,
      avatar: editingPlayer.avatar,
      stamina:
        editingPlayer.stamina !== null &&
        editingPlayer.stamina !== undefined &&
        editingPlayer.stamina !== ("" as any)
          ? Number(editingPlayer.stamina)
          : null,
      attack:
        editingPlayer.attack !== null &&
        editingPlayer.attack !== undefined &&
        editingPlayer.attack !== ("" as any)
          ? Number(editingPlayer.attack)
          : null,
      defense:
        editingPlayer.defense !== null &&
        editingPlayer.defense !== undefined &&
        editingPlayer.defense !== ("" as any)
          ? Number(editingPlayer.defense)
          : null,
      positions: editingPlayer.positions || [],
      notes: editingPlayer.notes || "",
    });

    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto layout-page-container layout-section">
      {/* Action Header Area */}
      <div ref={sentinelRef} className="flex flex-col gap-3 mb-5 pt-1">
        {/* Primary Action Row: Add Player & More (Export) */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleOpenAddModal}
            className="btn-primary flex-1 sm:flex-none justify-center py-2.5 text-sm"
          >
            <span className="w-4 h-4 flex items-center justify-center font-bold text-lg leading-none pb-0.5">+</span>
            <span>Thêm Cầu Thủ</span>
          </button>

          <div className="relative inline-flex items-center rounded-lg shadow-2xs bg-white border border-slate-300">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center space-x-1.5 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer rounded-lg"
            >
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <span>Thêm Thao Tác</span>
            </button>
            {isExportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      exportPlayersToXLSX(filteredAndSortedPlayers);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-green-50 hover:text-green-700"
                  >
                    Xuất File XLSX
                  </button>
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      exportPlayersToPDF(filteredAndSortedPlayers);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Xuất File PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Secondary Action Row: Search & Filter Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên hoặc số áo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center justify-center p-2.5 rounded-lg border shadow-sm transition-colors ${
              filterPosition !== "all" || sortBy !== "number" || sortOrder !== "asc"
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-slate-50 border-slate-300 text-slate-700"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Modal Dialog */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl border border-slate-200/90">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-h3 text-slate-900">Lọc & Sắp xếp</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Position Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Lọc theo Vị Trí</label>
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="GK">🧤 GK (Thủ môn)</option>
                  <option value="FI">🟣 Fixo (Thòng)</option>
                  <option value="AL_L">🔵 Ala (Trái)</option>
                  <option value="AL_R">🟣 Ala (Phải)</option>
                  <option value="PI">🟠 Pivot (Tiền đạo)</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Sắp xếp theo</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="number">Số áo</option>
                    <option value="name">Tên</option>
                    <option value="total">Tổng chỉ số</option>
                    <option value="stamina">TL (Bền)</option>
                    <option value="attack">Tấn công</option>
                    <option value="defense">Phòng thủ</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800 px-4"
                  >
                    {sortOrder === "asc" ? "Tăng dần ↑" : "Giảm dần ↓"}
                  </button>
                </div>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Chế độ xem</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-md text-sm font-bold ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                  >
                    <LayoutGrid className="w-4 h-4" /> <span>Dạng thẻ</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-md text-sm font-bold ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                  >
                    <List className="w-4 h-4" /> <span>Danh sách</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsFilterModalOpen(false)} className="btn-primary w-full py-2">
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === "grid" ? (
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
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 min-w-[700px]">
            <thead className="bg-slate-50 text-sm uppercase font-extrabold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 px-5 w-16 text-center">#</th>
                <th className="py-4 px-5">Tên cầu thủ</th>
                <th className="py-4 px-5">Vị Trí</th>
                <th className="py-4 px-5 text-center">🟢 Bền</th>
                <th className="py-4 px-5 text-center">🟠 Công</th>
                <th className="py-4 px-5 text-center">🔵 Thủ</th>
                <th className="py-4 px-5 text-center">Tổng Điểm</th>
                <th className="py-4 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredAndSortedPlayers.map((p) => {
                const total = calculateTotal(p);
                const posConfigs = getUniquePositionConfigs(p.positions);
                const getBadgeClass = (pos: string) => {
                  if (pos === 'GK') return 'badge-gk';
                  if (pos === 'FI') return 'badge-fixo';
                  if (pos.startsWith('AL')) return 'badge-ala';
                  if (pos === 'PI') return 'badge-pivot';
                  return '';
                };
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-5 text-center font-black text-slate-900">
                      {p.number}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-5">
                      {posConfigs.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {posConfigs.map((cfg) => (
                            <span
                              key={cfg.shortLabel}
                              className={`text-xs font-black px-2 py-0.5 rounded-lg border-0 ${getBadgeClass(cfg.id)} hover:opacity-90 transition-opacity cursor-help shadow-2xs`}
                              title={`Vị trí: ${cfg.fullLabel}`}
                            >
                              {cfg.shortLabel}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">
                          Chưa chọn
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-emerald-600">
                      {p.stamina !== null ? p.stamina : "-"}
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-orange-600">
                      {p.attack !== null ? p.attack : "-"}
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-blue-600">
                      {p.defense !== null ? p.defense : "-"}
                    </td>
                    <td className="py-3.5 px-5 text-center font-black text-slate-900">
                      {total !== -1 ? total : "-"}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="btn-outline px-3 py-1.5 text-xs"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onDeletePlayer(p.id)}
                        className="btn-outline-danger px-3 py-1.5 text-xs"
                        title="Xóa cầu thủ khỏi danh sách"
                      >
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Add Modal - Minimalist & Monolithic Design */}
      {isSticky && document.getElementById('topbar-actions-portal') && createPortal(
        <>
          <button onClick={handleOpenAddModal} className="btn-primary p-2 sm:px-3 sm:py-2 flex items-center justify-center shrink-0 shadow-sm" title="Thêm Cầu Thủ">
            <Plus className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Thêm</span>
          </button>
          <button onClick={() => exportPlayersToXLSX(filteredAndSortedPlayers)} className="btn-outline p-2 sm:px-3 sm:py-2 flex items-center justify-center shrink-0 shadow-sm text-green-700 hover:bg-green-50" title="Xuất Excel">
            <Download className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Excel</span>
          </button>
        </>,
        document.getElementById('topbar-actions-portal')!
      )}

      {isModalOpen && editingPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-slate-200/90 max-h-[90vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs shrink-0"></span>
                <h3 className="text-h3 text-slate-900 tracking-wide">
                  {players.some((p) => p.id === editingPlayer.id)
                    ? "CHỈNH SỬA CẦU THỦ"
                    : "THÊM CẦU THỦ MỚI"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning / Error alert if duplicate shirt number exists */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Basic Info: Shirt Number & Name */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
                    SỐ ÁO (#)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={99}
                    placeholder="10"
                    value={editingPlayer.number !== undefined && editingPlayer.number !== null ? editingPlayer.number : ""}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setEditingPlayer({
                        ...editingPlayer,
                        number: e.target.value === "" ? (undefined as any) : parseInt(e.target.value) || 0,
                      });
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-black text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
                    TÊN CẦU THỦ
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên cầu thủ..."
                    value={editingPlayer.name || ""}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setEditingPlayer({
                        ...editingPlayer,
                        name: e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Tên In Áo */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
                  TÊN IN ÁO (TÙY CHỌN)
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên in trên áo (ví dụ: A. NGUYEN)..."
                  value={editingPlayer.jerseyName || ""}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      jerseyName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"
                />
              </div>

              {/* Individual Player Notes */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
                  ĐẶC ĐIỂM CÁ NHÂN & GHI CHÚ
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Tốc độ cao, sút xa tốt, khả năng tranh chấp mạnh..."
                  value={editingPlayer.notes || ""}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800"
                />
              </div>

              {/* Position Tag Selector - Multiple Checkbox Strip */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                  VỊ TRÍ THI ĐẤU
                </label>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {[
                    {
                      pos: "GK" as PositionTag,
                      label: "Goalkeeper",
                      tooltip: "Thủ Môn",
                    },
                    {
                      pos: "FI" as PositionTag,
                      label: "Fixo",
                      tooltip: "Hậu Vệ Thòng",
                    },
                    {
                      pos: "AL_L" as PositionTag,
                      label: "Ala (Trái)",
                      tooltip: "Tiền Vệ Cánh Trái",
                    },
                    {
                      pos: "AL_R" as PositionTag,
                      label: "Ala (Phải)",
                      tooltip: "Tiền Vệ Cánh Phải",
                    },
                    {
                      pos: "PI" as PositionTag,
                      label: "Pivot",
                      tooltip: "Tiền Đạo Cắm",
                    },
                  ].map((item) => {
                    const isSelected = editingPlayer.positions?.includes(
                      item.pos,
                    );
                    return (
                      <label
                        key={item.pos}
                        title={`Vị trí tiếng Việt: ${item.tooltip}`}
                        className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none hover:text-blue-600 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const currentPos = editingPlayer.positions || [];
                            const updated = isSelected
                              ? currentPos.filter((p) => p !== item.pos)
                              : [...currentPos, item.pos];
                            setEditingPlayer({
                              ...editingPlayer,
                              positions: updated,
                            });
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Monolithic Stats Panel */}
              <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    CHỈ SỐ KỸ NĂNG (0 - 10)
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Tổng điểm:{" "}
                    <strong className="text-blue-700 font-black">
                      {calculateTotal(editingPlayer as Player) !== -1
                        ? `${calculateTotal(editingPlayer as Player)}đ`
                        : "-"}
                    </strong>
                  </span>
                </div>

                {/* Bền (Thể Lực) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Thể Lực (Bền)</span>
                    </span>
                    <span className="font-black text-slate-800">
                      {editingPlayer.stamina !== null &&
                      editingPlayer.stamina !== undefined
                        ? `${editingPlayer.stamina} / 10`
                        : "Chưa đánh giá"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editingPlayer.stamina ?? 0}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        stamina: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Công (Tấn Công) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-700 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      <span>Tấn Công (Công)</span>
                    </span>
                    <span className="font-black text-slate-800">
                      {editingPlayer.attack !== null &&
                      editingPlayer.attack !== undefined
                        ? `${editingPlayer.attack} / 10`
                        : "Chưa đánh giá"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editingPlayer.attack ?? 0}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        attack: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Thủ (Phòng Thủ) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-700 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>Phòng Thủ (Thủ)</span>
                    </span>
                    <span className="font-black text-slate-800">
                      {editingPlayer.defense !== null &&
                      editingPlayer.defense !== undefined
                        ? `${editingPlayer.defense} / 10`
                        : "Chưa đánh giá"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editingPlayer.defense ?? 0}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        defense: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Action Buttons with Design Tokens */}
              <div className="flex items-center justify-end space-x-2.5 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-5 py-2.5 rounded-lg border-0 shadow-xs transition-all cursor-pointer"
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
