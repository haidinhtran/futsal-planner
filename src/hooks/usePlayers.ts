import { useState, useCallback } from 'react';
import type { Player } from '../types/futsal';
import { storageService } from '../services/storageService';

export const usePlayers = (initialPlayers?: Player[]) => {
  const [players, setPlayers] = useState<Player[]>(
    () => initialPlayers ?? storageService.getPlayers()
  );

  const refreshPlayers = useCallback(() => {
    setPlayers(storageService.getPlayers());
  }, []);

  const savePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === updatedPlayer.id);
      let newPlayers: Player[];
      if (existingIndex >= 0) {
        newPlayers = [...prev];
        newPlayers[existingIndex] = updatedPlayer;
      } else {
        newPlayers = [...prev, updatedPlayer];
      }
      storageService.savePlayers(newPlayers);
      return newPlayers;
    });
  }, []);

  const deletePlayer = useCallback((id: string) => {
    setPlayers((prev) => {
      const newPlayers = prev.filter((p) => p.id !== id);
      storageService.savePlayers(newPlayers);
      return newPlayers;
    });
  }, []);

  return {
    players,
    setPlayers,
    refreshPlayers,
    savePlayer,
    deletePlayer,
  };
};
