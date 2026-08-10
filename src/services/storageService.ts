import type { Player, TacticalSquad } from '../types/futsal';
import { INITIAL_PLAYERS, INITIAL_TACTICAL_SQUAD } from './initialData';

const PLAYERS_KEY = 'futsal_planner_players_v1';
const SQUAD_KEY = 'futsal_planner_squad_v1';

export const storageService = {
  getPlayers(): Player[] {
    try {
      const data = localStorage.getItem(PLAYERS_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading players from localStorage', e);
      return [];
    }
  },

  savePlayers(players: Player[]): void {
    try {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    } catch (e) {
      console.error('Error saving players to localStorage', e);
    }
  },

  getSquad(): TacticalSquad {
    try {
      const data = localStorage.getItem(SQUAD_KEY);
      if (!data) {
        const initialSquad: TacticalSquad = {
          id: 'default',
          formationId: INITIAL_TACTICAL_SQUAD.formationId,
          slots: INITIAL_TACTICAL_SQUAD.slots,
          notes: INITIAL_TACTICAL_SQUAD.notes,
          updatedAt: new Date().toISOString(),
        };
        this.saveSquad(initialSquad);
        return initialSquad;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading squad from localStorage', e);
      return {
        id: 'default',
        formationId: INITIAL_TACTICAL_SQUAD.formationId,
        slots: INITIAL_TACTICAL_SQUAD.slots,
        notes: INITIAL_TACTICAL_SQUAD.notes,
        updatedAt: new Date().toISOString(),
      };
    }
  },

  saveSquad(squad: TacticalSquad): void {
    try {
      localStorage.setItem(SQUAD_KEY, JSON.stringify(squad));
    } catch (e) {
      console.error('Error saving squad to localStorage', e);
    }
  },

  resetAllData(): { players: Player[]; squad: TacticalSquad } {
    this.savePlayers(INITIAL_PLAYERS);
    const initialSquad: TacticalSquad = {
      id: 'default',
      formationId: INITIAL_TACTICAL_SQUAD.formationId,
      slots: INITIAL_TACTICAL_SQUAD.slots,
      notes: INITIAL_TACTICAL_SQUAD.notes,
      updatedAt: new Date().toISOString(),
    };
    this.saveSquad(initialSquad);
    return { players: INITIAL_PLAYERS, squad: initialSquad };
  },

  exportBackup(): void {
    const data = {
      players: this.getPlayers(),
      squad: this.getSquad(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futsal_planner_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importBackup(file: File): Promise<{ players: Player[]; squad: TacticalSquad }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json.players) && json.squad) {
            this.savePlayers(json.players);
            this.saveSquad(json.squad);
            resolve({ players: json.players, squad: json.squad });
          } else {
            reject(new Error('Định dạng file sao lưu JSON không hợp lệ!'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Đọc file thất bại.'));
      reader.readAsText(file);
    });
  },
};
