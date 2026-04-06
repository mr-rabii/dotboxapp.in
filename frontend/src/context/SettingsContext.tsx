import React, { createContext, useContext, useState, useEffect } from 'react';
import { setMuted } from '@/src/utils/sounds';

interface SettingsContextType {
  gridSize: number;
  soundEnabled: boolean;
  setGridSize: (size: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  gridSize: 5,
  soundEnabled: true,
  setGridSize: () => {},
  setSoundEnabled: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [gridSize, setGridSize] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  return (
    <SettingsContext.Provider value={{ gridSize, soundEnabled, setGridSize, setSoundEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
