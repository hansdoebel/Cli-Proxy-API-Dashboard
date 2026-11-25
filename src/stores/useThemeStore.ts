/**
 * 主题状态管理
 * Linear dark is the default. Stripe stays available as an alternate palette.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';
import { normalizeStoredTheme } from '@/types/common';
import { STORAGE_KEY_THEME } from '@/utils/constants';

type ResolvedTheme = 'light' | 'dark';
type Palette = 'linear' | 'stripe';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const selectionFor = (theme: Theme): { palette: Palette; scheme: ResolvedTheme } => {
  switch (theme) {
    case 'linear-light':
      return { palette: 'linear', scheme: 'light' };
    case 'stripe-light':
      return { palette: 'stripe', scheme: 'light' };
    case 'stripe-dark':
      return { palette: 'stripe', scheme: 'dark' };
    case 'auto':
      return { palette: 'linear', scheme: getSystemTheme() };
    case 'linear-dark':
    default:
      return { palette: 'linear', scheme: 'dark' };
  }
};

const applyTheme = (theme: Theme) => {
  const { palette, scheme } = selectionFor(theme);
  const root = document.documentElement;
  root.dataset.palette = palette;
  root.dataset.theme = scheme;
  root.classList.toggle('dark', scheme === 'dark');
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'linear-dark',
      resolvedTheme: 'dark',

      setTheme: (theme) => {
        const next = normalizeStoredTheme(theme);
        const { scheme } = selectionFor(next);
        applyTheme(next);
        set({ theme: next, resolvedTheme: scheme });
      },

      initializeTheme: () => {
        const next = normalizeStoredTheme(get().theme);
        get().setTheme(next);

        if (!window.matchMedia) {
          return () => {};
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
          if (get().theme === 'auto') {
            const { scheme } = selectionFor('auto');
            applyTheme('auto');
            set({ resolvedTheme: scheme });
          }
        };

        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      },
    }),
    {
      name: STORAGE_KEY_THEME,
      version: 2,
      migrate: (persisted) => {
        const theme = (persisted as { theme?: unknown } | undefined)?.theme;
        if (theme === 'light' || theme === 'white') return { theme: 'linear-light' as Theme };
        if (
          theme === 'linear-dark' ||
          theme === 'linear-light' ||
          theme === 'stripe-light' ||
          theme === 'stripe-dark'
        ) {
          return { theme };
        }
        return { theme: 'linear-dark' as Theme };
      },
    }
  )
);
