import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import ExcelJS from "exceljs";
import type { Player, PositionTag } from "@/types/futsal";
import { getPositionConfig, getUniquePositionConfigs } from "@/types/futsal";
import { PlayerCard } from "./PlayerCard";
import { PlayerFormModal } from "./PlayerManagement/PlayerFormModal";
import {
  X,
  Filter,
  LayoutGrid,
  List,
  Search,
  Download,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { removeVietnameseTones } from "@/utils/vietnamese";

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
    const nameToDisplay = player.jerseyName
      ? `${player.name} (${player.jerseyName})`
      : player.name;
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

  const [isStickySearchOpen, setIsStickySearchOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(
    null,
  );
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
  }, [editRequest, players]);

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!editingPlayer || !editingPlayer.name) return;

    const targetNumber = Number(editingPlayer.number);
    if (
      editingPlayer.number === undefined ||
      editingPlayer.number === null ||
      isNaN(targetNumber) ||
      targetNumber < 0
    ) {
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
    <div className="w-full max-w-[1920px] mx-auto layout-page-container pt-3 pb-12 md:pt-4 md:pb-8">
      {/* Primary Action Row - Desktop & Mobile Portal */}
      {document.getElementById("topbar-actions-portal") &&
        createPortal(
          <div className="items-center justify-end gap-1.5 sm:gap-2 w-full flex">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
              title="Lọc"
            >
              <Filter className="btn-icon" />
            </button>

            <button
              onClick={() => setIsStickySearchOpen(!isStickySearchOpen)}
              className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
              title="Tìm kiếm"
            >
              <Search className="btn-icon" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="p-1.5 md:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                title="Xuất Dữ Liệu"
              >
                <MoreVertical className="btn-icon text-slate-500" />
              </button>
              {isExportMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsExportMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        exportPlayersToXLSX(filteredAndSortedPlayers);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-green-50 flex items-center space-x-2.5 uppercase"
                    >
                      <Download className="w-4 h-4 text-green-600 shrink-0" />
                      <span>XUẤT TỆP EXCEL</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        exportPlayersToPDF(filteredAndSortedPlayers);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-red-50 flex items-center space-x-2.5 border-t border-slate-100 uppercase"
                    >
                      <Download className="w-4 h-4 text-red-600 shrink-0" />
                      <span>XUẤT TỆP PDF</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleOpenAddModal}
              className="btn-primary"
              title="Thêm Cầu Thủ"
            >
              <UserPlus className="btn-icon" />
              <span className="btn-label">Thêm Cầu Thủ</span>
            </button>
          </div>,
          document.getElementById("topbar-actions-portal")!,
        )}

      {/* Filter Modal Dialog */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFilterModalOpen(false);
            }
          }}
        >
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
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  Lọc theo Vị Trí
                </label>
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
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  Sắp xếp theo
                </label>
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
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800 px-4"
                  >
                    {sortOrder === "asc" ? "Tăng dần ↑" : "Giảm dần ↓"}
                  </button>
                </div>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  Chế độ xem
                </label>
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
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="btn-primary w-full py-2"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
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
                  if (pos === "GK") return "badge-gk";
                  if (pos === "FI") return "badge-fixo";
                  if (pos.startsWith("AL")) return "badge-ala";
                  if (pos === "PI") return "badge-pivot";
                  return "";
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

      {/* Search Input Portal (Shown when search is active, sticky or not) */}
      {isStickySearchOpen &&
        document.getElementById("topbar-bottom-portal") &&
        createPortal(
          <div className="layout-page-container py-2 pb-3 bg-white border-t border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc số áo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 shadow-sm"
                autoFocus
              />
            </div>
          </div>,
          document.getElementById("topbar-bottom-portal")!,
        )}

      <PlayerFormModal
        isOpen={isModalOpen}
        editingPlayer={editingPlayer}
        isExisting={players.some((p) => p.id === editingPlayer?.id)}
        errorMsg={errorMsg}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        onChangePlayer={(updated) => setEditingPlayer(updated)}
        onClearError={() => setErrorMsg(null)}
        calculateTotal={calculateTotal}
      />
    </div>
  );
};
