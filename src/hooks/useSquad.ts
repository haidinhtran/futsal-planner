import { useState, useCallback } from 'react';
import type { TacticalSquad } from '../types/futsal';
import { storageService } from '../services/storageService';

export const useSquad = (initialSquad?: TacticalSquad) => {
  const [squad, setSquad] = useState<TacticalSquad>(
    () => initialSquad ?? storageService.getSquad()
  );

  const refreshSquad = useCallback(() => {
    setSquad(storageService.getSquad());
  }, []);

  const saveSquad = useCallback((updatedSquad: TacticalSquad) => {
    setSquad(updatedSquad);
    storageService.saveSquad(updatedSquad);
  }, []);

  const unassignPlayerFromSquad = useCallback((playerId: string) => {
    setSquad((prevSquad) => {
      if (!prevSquad || !prevSquad.slots) return prevSquad;
      const newSlots = prevSquad.slots.map((slot) =>
        slot.playerId === playerId ? { ...slot, playerId: null } : slot
      );
      const newSquad = { ...prevSquad, slots: newSlots };
      storageService.saveSquad(newSquad);
      return newSquad;
    });
  }, []);

  return {
    squad,
    setSquad,
    refreshSquad,
    saveSquad,
    unassignPlayerFromSquad,
  };
};
