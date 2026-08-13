import type {
  Player,
  TacticalSquad,
  SavedTacticalDiagram,
} from "../types/futsal";
import {
  INITIAL_PLAYERS,
  INITIAL_TACTICAL_DIAGRAMS,
  INITIAL_TACTICAL_SQUAD,
} from "./initialData";

const PLAYERS_KEY = "futsal_planner_players_v1";
const SQUAD_KEY = "futsal_planner_squad_v1";
const DIAGRAMS_KEY = "futsal_planner_diagrams_v1";

export const storageService = {
  getPlayers(): Player[] {
    try {
      const data = localStorage.getItem(PLAYERS_KEY);
      if (!data) {
        this.savePlayers(INITIAL_PLAYERS);
        return INITIAL_PLAYERS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading players from localStorage", e);
      return INITIAL_PLAYERS;
    }
  },

  savePlayers(players: Player[]): void {
    try {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    } catch (e) {
      console.error("Error saving players to localStorage", e);
    }
  },

  getSquad(): TacticalSquad {
    try {
      const data = localStorage.getItem(SQUAD_KEY);
      let squad: TacticalSquad;
      if (!data) {
        squad = {
          id: "default",
          formationId: INITIAL_TACTICAL_SQUAD.formationId,
          slots: INITIAL_TACTICAL_SQUAD.slots,
          notes: INITIAL_TACTICAL_SQUAD.notes,
          updatedAt: new Date().toISOString(),
        };
        this.saveSquad(squad);
      } else {
        squad = JSON.parse(data);
      }

      // Ensure backward compatibility: normalize subPlayerIds array on all slots
      if (squad && Array.isArray(squad.slots)) {
        squad.slots = squad.slots.map((s) => ({
          ...s,
          subPlayerIds: Array.isArray(s.subPlayerIds) ? s.subPlayerIds : [],
        }));
      }

      return squad;
    } catch (e) {
      console.error("Error reading squad from localStorage", e);
      return {
        id: "default",
        formationId: INITIAL_TACTICAL_SQUAD.formationId,
        slots: INITIAL_TACTICAL_SQUAD.slots.map((s) => ({
          ...s,
          subPlayerIds: [],
        })),
        notes: INITIAL_TACTICAL_SQUAD.notes,
        updatedAt: new Date().toISOString(),
      };
    }
  },

  saveSquad(squad: TacticalSquad): void {
    try {
      localStorage.setItem(SQUAD_KEY, JSON.stringify(squad));
    } catch (e) {
      console.error("Error saving squad to localStorage", e);
    }
  },

  resetAllData(): { players: Player[]; squad: TacticalSquad } {
    this.savePlayers(INITIAL_PLAYERS);
    const initialSquad: TacticalSquad = {
      id: "default",
      formationId: INITIAL_TACTICAL_SQUAD.formationId,
      slots: INITIAL_TACTICAL_SQUAD.slots,
      notes: INITIAL_TACTICAL_SQUAD.notes,
      updatedAt: new Date().toISOString(),
    };
    this.saveSquad(initialSquad);
    this.saveDiagrams(INITIAL_TACTICAL_DIAGRAMS);
    return { players: INITIAL_PLAYERS, squad: initialSquad };
  },

  exportBackup(): void {
    const data = {
      format: "ftsp-backup",
      schemaVersion: 1,
      players: this.getPlayers(),
      squad: this.getSquad(),
      diagrams: this.getDiagrams(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `futsal_planner_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importBackup(
    file: File,
  ): Promise<{
    players: Player[];
    squad: TacticalSquad;
    diagrams: SavedTacticalDiagram[];
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (
            Array.isArray(json.players) &&
            json.squad &&
            (json.diagrams === undefined || Array.isArray(json.diagrams))
          ) {
            const diagrams = Array.isArray(json.diagrams) ? json.diagrams : [];
            this.savePlayers(json.players);
            this.saveSquad(json.squad);
            this.saveDiagrams(diagrams);
            resolve({ players: json.players, squad: json.squad, diagrams });
          } else {
            reject(new Error("Định dạng file sao lưu JSON không hợp lệ!"));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Đọc file thất bại."));
      reader.readAsText(file);
    });
  },

  getDiagrams(): SavedTacticalDiagram[] {
    try {
      const data = localStorage.getItem(DIAGRAMS_KEY);
      if (!data) {
        this.saveDiagrams(INITIAL_TACTICAL_DIAGRAMS);
        return INITIAL_TACTICAL_DIAGRAMS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading diagrams from localStorage", e);
      return [];
    }
  },

  saveDiagram(diagram: SavedTacticalDiagram): void {
    try {
      const existing = this.getDiagrams();
      const idx = existing.findIndex((d) => d.id === diagram.id);
      let updated: SavedTacticalDiagram[];
      if (idx >= 0) {
        updated = [...existing];
        updated[idx] = diagram;
      } else {
        updated = [diagram, ...existing];
      }
      localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving diagram to localStorage", e);
    }
  },

  deleteDiagram(id: string): void {
    try {
      const existing = this.getDiagrams();
      const updated = existing.filter((d) => d.id !== id);
      localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error deleting diagram from localStorage", e);
    }
  },

  saveDiagrams(diagrams: SavedTacticalDiagram[]): void {
    try {
      localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(diagrams));
    } catch (e) {
      console.error("Error saving diagrams to localStorage", e);
    }
  },
};
