import React, { useState, useMemo } from 'react';
import type { Player, PositionTag } from '../types/futsal';
import { PlayerCard } from './PlayerCard';
import { TopbarPortal } from '../context/TopbarContext';
import { PlayerFilterBar } from '../features/players/components/PlayerFilterBar';
import { PlayerFormModal } from '../features/players/components/PlayerFormModal';
import { PlayerListTable } from '../features/players/components/PlayerListTable';
import { exportPlayersToCSV, exportPlayersToPDF } from '../features/players/utils/exportPlayers';
import { calculatePlayerTotalScore } from '../utils/formatters';
import { Plus, Users, UserCheck } from 'lucide-react';
import { Button } from './ui/Button';

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

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter((p) => {
        // Search Filter
        const query = searchTerm.toLowerCase().trim();
        const matchSearch =
          query === '' ||
          p.name.toLowerCase().includes(query) ||
          p.number.toString() === query;

        // Position Filter
        const matchPos =
          filterPosition === 'all' ||
          (p.positions && (p.positions.includes(filterPosition) || (filterPosition === 'AL_L' && p.positions.includes('AL'))));

        // Rating Filter
        const hasRating = p.stamina !== null || p.attack !== null || p.defense !== null;
        const matchRating =
          filterRated === 'all' ||
          (filterRated === 'rated' && hasRating) ||
          (filterRated === 'unrated' && !hasRating);

        return matchSearch && matchPos && matchRating;
      })
      .sort((a, b) => {
        let valA: string | number = 0;
        let valB: string | number = 0;

        if (sortBy === 'number') {
          valA = a.number;
          valB = b.number;
        } else if (sortBy === 'name') {
          valA = a.name;
          valB = b.name;
        } else if (sortBy === 'total') {
          valA = calculatePlayerTotalScore(a);
          valB = calculatePlayerTotalScore(b);
        } else if (sortBy === 'stamina') {
          valA = a.stamina ?? -1;
          valB = b.stamina ?? -1;
        } else if (sortBy === 'attack') {
          valA = a.attack ?? -1;
          valB = b.attack ?? -1;
        } else if (sortBy === 'defense') {
          valA = a.defense ?? -1;
          valB = b.defense ?? -1;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [players, searchTerm, filterPosition, filterRated, sortBy, sortOrder]);

  const handleOpenAddModal = () => {
    // Generate next shirt number
    const maxNum = players.reduce((max, p) => (p.number > max ? p.number : max), 0);
    setEditingPlayer({
      number: maxNum + 1 <= 99 ? maxNum + 1 : 1,
      name: '',
      stamina: 7,
      attack: 7,
      defense: 7,
      positions: [],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (player: Player) => {
    setEditingPlayer({ ...player });
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    exportPlayersToCSV(filteredAndSortedPlayers);
    setIsExportMenuOpen(false);
  };

  const handleExportPDF = () => {
    exportPlayersToPDF(filteredAndSortedPlayers);
    setIsExportMenuOpen(false);
  };

  const totalRatedCount = useMemo(
    () => players.filter((p) => p.stamina !== null || p.attack !== null || p.defense !== null).length,
    [players]
  );

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Topbar Injection via React Portal */}
      <TopbarPortal>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-xs sm:text-sm">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>DANH SÁCH CẦU THỦ</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Tổng số: {players.length} (Hiển thị: {filteredAndSortedPlayers.length})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleOpenAddModal}>
              Thêm cầu thủ
            </Button>
          </div>
        </div>
      </TopbarPortal>

      {/* Filter and Tool Bar */}
      <PlayerFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterPosition={filterPosition}
        onPositionFilterChange={setFilterPosition}
        filterRated={filterRated}
        onRatedFilterChange={setFilterRated}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isExportMenuOpen={isExportMenuOpen}
        onToggleExportMenu={() => setIsExportMenuOpen((prev) => !prev)}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      {/* Summary Header */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>
            Đã đánh giá chỉ số: <strong className="text-blue-700">{totalRatedCount}/{players.length}</strong> cầu thủ
          </span>
        </div>
        <div className="text-[11px] font-semibold text-slate-500">
          Ghi chú cá nhân và chỉ số thể lực giúp HLV xếp sơ đồ phù hợp nhất.
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
        <PlayerListTable
          players={filteredAndSortedPlayers}
          onEdit={handleOpenEditModal}
          onDelete={onDeletePlayer}
        />
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingPlayer && (
        <PlayerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingPlayer={editingPlayer}
          existingPlayers={players}
          onSave={onSavePlayer}
        />
      )}
    </div>
  );
};
