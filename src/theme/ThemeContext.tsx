import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppTheme {
  isDark: boolean;
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    elevated: string;
    input: string;
    text: string;
    secondaryText: string;
    mutedText: string;
    border: string;
    accent: string;
    accentSoft: string;
    accentText: string;
    danger: string;
    dangerSoft: string;
    success: string;
    successSoft: string;
    placeholder: string;
    traitEmpty: string;
    overlay: string;
  };
  toggleMode: () => void;
}

const lightColors: AppTheme['colors'] = {
  background: '#f8f9fa',
  surface: '#ffffff',
  elevated: '#ffffff',
  input: '#f1f3f4',
  text: '#1a1a1a',
  secondaryText: '#3c4043',
  mutedText: '#5f6368',
  border: '#e0e0e0',
  accent: '#007aff',
  accentSoft: '#e8f0fe',
  accentText: '#1967d2',
  danger: '#ff3b30',
  dangerSoft: '#fce8e6',
  success: '#137333',
  successSoft: '#e6f4ea',
  placeholder: '#9aa0a6',
  traitEmpty: '#e0e0e0',
  overlay: 'rgba(0,0,0,0.6)',
};

const darkColors: AppTheme['colors'] = {
  background: '#101418',
  surface: '#1a2027',
  elevated: '#222a33',
  input: '#252d36',
  text: '#f5f7fa',
  secondaryText: '#d2d8df',
  mutedText: '#aab4bf',
  border: '#36414d',
  accent: '#5aa2ff',
  accentSoft: '#1d385d',
  accentText: '#9bc5ff',
  danger: '#ff746b',
  dangerSoft: '#4a2425',
  success: '#8bd5a5',
  successSoft: '#1d3a29',
  placeholder: '#8e9aa7',
  traitEmpty: '#4a5663',
  overlay: 'rgba(0,0,0,0.72)',
};

const defaultTheme: AppTheme = {
  isDark: false,
  mode: 'light',
  colors: lightColors,
  toggleMode: () => undefined,
};

const ThemeContext = createContext<AppTheme>(defaultTheme);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const value = useMemo<AppTheme>(() => ({
    isDark,
    mode,
    colors: isDark ? darkColors : lightColors,
    toggleMode: () => setMode((currentMode) => {
      const currentlyDark = currentMode === 'dark' || (currentMode === 'system' && systemScheme === 'dark');
      return currentlyDark ? 'light' : 'dark';
    }),
  }), [isDark, mode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): AppTheme => {
  return useContext(ThemeContext);
};
