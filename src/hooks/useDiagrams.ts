import { useState, useCallback } from 'react';
import type { SavedTacticalDiagram } from '../types/futsal';
import { storageService } from '../services/storageService';

export const useDiagrams = () => {
  const [savedDiagrams, setSavedDiagrams] = useState<SavedTacticalDiagram[]>(
    () => storageService.getDiagrams()
  );

  const refreshDiagrams = useCallback(() => {
    setSavedDiagrams(storageService.getDiagrams());
  }, []);

  const saveDiagram = useCallback((diagram: SavedTacticalDiagram) => {
    storageService.saveDiagram(diagram);
    setSavedDiagrams(storageService.getDiagrams());
  }, []);

  const deleteDiagram = useCallback((id: string) => {
    storageService.deleteDiagram(id);
    setSavedDiagrams(storageService.getDiagrams());
  }, []);

  return {
    savedDiagrams,
    refreshDiagrams,
    saveDiagram,
    deleteDiagram,
  };
};
