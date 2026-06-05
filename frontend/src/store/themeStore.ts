import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('rozgar-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('rozgar-theme', next);
      return { theme: next };
    }),
  setTheme: (t) => {
    localStorage.setItem('rozgar-theme', t);
    set({ theme: t });
  },
}));
